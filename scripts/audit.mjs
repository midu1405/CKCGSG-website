// Kiểm tra toàn bộ website CKCGSG bằng trình duyệt thật (Playwright).
// Cách chạy:  npm run build && npm run audit
//   (lần đầu trên máy:  npx playwright install chromium)
// Kết quả: docs/audits/<ngày>/audit.json + ảnh chụp từng trang ở 3 khổ màn hình.
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, statSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';

const PORT = 4173;
const BASE = process.env.AUDIT_URL || `http://localhost:${PORT}`;
const DAY = new Date().toISOString().slice(0, 10);
const OUT = join('docs', 'audits', DAY);
mkdirSync(OUT, { recursive: true });

// Lấy danh sách trang từ App.tsx để trang mới thêm vào cũng được kiểm.
const ROUTES = [...readFileSync('src/App.tsx', 'utf8').matchAll(/path="([^"*]+)"/g)].map((m) => m[1]);
const HEAVY = new Set(['/dac-lo/so-do', '/dac-lo/khuon-vien']); // trang 3D: chỉ chụp khổ mobile + desktop
const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];
// Font hợp lệ; chữ nào render bằng font khác (Arial, Times…) là lỗi font.
const OK_FONTS = /Be Vietnam Pro|Playfair Display|lucide/i;

let server;
if (!process.env.AUDIT_URL) {
  server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' });
  for (let i = 0; i < 60; i++) {
    try { await fetch(BASE); break; } catch { await new Promise((r) => setTimeout(r, 500)); }
  }
}

const browser = await chromium.launch();
const result = { base: BASE, date: DAY, pages: [], images: [], links: [] };
const internalLinks = new Set(); // dạng "<trang>|<href>"

for (const route of ROUTES) {
  for (const vp of VIEWPORTS) {
    if (HEAVY.has(route) && vp.name === 'tablet') continue;
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await ctx.newPage();
    const errors = [], failed = [];
    page.on('pageerror', (e) => errors.push(String(e.message).slice(0, 300)));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 300)));
    page.on('requestfailed', (r) => failed.push(`${r.failure()?.errorText} ${r.url()}`));
    page.on('response', (r) => r.status() >= 400 && failed.push(`${r.status()} ${r.url()}`));

    if (vp.name === 'mobile') { // giả lập điện thoại tầm trung: CPU chậm 4 lần
      const c = await ctx.newCDPSession(page); await c.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    }
    const t0 = Date.now();
    await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 45000 }).catch((e) => errors.push('goto: ' + e.message));
    const loadMs = Date.now() - t0;
    await page.evaluate(() => document.fonts.ready);

    // Cuộn hết trang để hiệu ứng "hiện khi cuộn tới" chạy, rồi về đầu.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(400);

    const info = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      // Phần tử tràn ngang (gây cuộn ngang trên điện thoại)
      const overflow = [];
      for (const el of document.querySelectorAll('body *')) {
        const r = el.getBoundingClientRect();
        if (r.width && r.right > vw + 1 && getComputedStyle(el).position !== 'fixed') {
          let hidden = false;
          for (let p = el.parentElement; p; p = p.parentElement) {
            const o = getComputedStyle(p).overflowX;
            if (o === 'hidden' || o === 'clip' || o === 'auto' || o === 'scroll') { hidden = true; break; }
          }
          if (!hidden) overflow.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)} → ${Math.round(r.right)}px`);
        }
      }
      const imgs = [...document.images];
      const tap = [...document.querySelectorAll('a, button')].filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && (r.width < 32 || r.height < 32) && el.textContent.trim().length < 3;
      }).map((el) => el.getAttribute('aria-label') || el.outerHTML.slice(0, 60));
      return {
        hScroll: document.documentElement.scrollWidth > vw,
        overflow: overflow.slice(0, 8),
        brokenImgs: imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
        noAlt: imgs.filter((i) => !i.hasAttribute('alt')).map((i) => i.src.split('/').pop()),
        h1: document.querySelectorAll('h1').length,
        title: document.title,
        smallTapTargets: tap.slice(0, 8),
        links: [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')),
        fontsLoaded: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => `${f.family} ${f.weight} ${f.style}`),
      };
    });

    // Font thật sự được dùng để vẽ chữ (bắt lỗi chữ tiếng Việt rơi về font hệ thống).
    let fontProblems = [];
    if (vp.name === 'desktop' && !HEAVY.has(route)) {
      const cdp = await ctx.newCDPSession(page);
      await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
      const { root } = await cdp.send('DOM.getDocument', { depth: -1 });
      const { nodeIds } = await cdp.send('DOM.querySelectorAll', { nodeId: root.nodeId, selector: 'h1,h2,h3,h4,p,li,a,button,span,label,blockquote' });
      for (const nodeId of nodeIds.slice(0, 600)) {
        try {
          const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId });
          for (const f of fonts) if (!OK_FONTS.test(f.familyName) && f.glyphCount > 0) {
            const { outerHTML } = await cdp.send('DOM.getOuterHTML', { nodeId });
            const text = outerHTML.replace(/<[^>]+>/g, '').trim().slice(0, 60);
            fontProblems.push(`${f.familyName} (${f.glyphCount} ký tự): "${text}"`);
          }
        } catch {}
      }
      fontProblems = [...new Set(fontProblems)].slice(0, 15);
    }

    // Đo độ mượt: tỉ lệ khung hình bị rớt khi cuộn (chỉ mobile — máy yếu nhất).
    let jank = null;
    if (vp.name === 'mobile' && !HEAVY.has(route)) {
      jank = await page.evaluate(async () => {
        const frames = [];
        let last = performance.now(), run = true;
        const tick = (now) => { frames.push(now - last); last = now; if (run) requestAnimationFrame(tick); };
        requestAnimationFrame(tick);
        for (let y = 0; y < document.body.scrollHeight; y += 60) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 16)); }
        run = false;
        const long = frames.filter((d) => d > 50).length;
        return { frames: frames.length, longFrames: long, worstMs: Math.round(Math.max(...frames)) };
      });
      await page.evaluate(() => window.scrollTo(0, 0));
    }

    const cls = await page.evaluate(() => new Promise((res) => {
      let v = 0;
      new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) v += e.value; })
        .observe({ type: 'layout-shift', buffered: true });
      setTimeout(() => res(Math.round(v * 1000) / 1000), 300);
    }));

    const shot = `${route === '/' ? 'home' : route.slice(1).replace(/\//g, '_')}-${vp.name}.png`;
    await page.screenshot({ path: join(OUT, shot), fullPage: !HEAVY.has(route) }).catch(() => {});
    info.links.forEach((l) => internalLinks.add(`${route}|${l}`));
    delete info.links;
    result.pages.push({ route, viewport: vp.name, loadMs, cls, jank, errors: [...new Set(errors)], failed: [...new Set(failed)], fontProblems, ...info, shot });
    await ctx.close();
  }
}

// Link nội bộ trỏ tới trang có thật không; #mục có tồn tại không.
const ctx = await browser.newContext();
const page = await ctx.newPage();
for (const key of [...internalLinks].sort()) {
  const [from, href] = key.split('|');
  if (/^(mailto:|tel:)/.test(href)) { result.links.push({ href, ok: true, note: 'liên hệ' }); continue; }
  if (/^https?:/.test(href)) { result.links.push({ href, ok: null, note: 'link ngoài — chưa kiểm' }); continue; }
  if (result.links.some((l) => l.href === href && !href.startsWith('#'))) continue;
  const [p0, hash] = href.split('#');
  const path = p0 || from;
  const known = ROUTES.includes(path);
  let anchor = true;
  if (known && hash) {
    await page.goto(BASE + path, { waitUntil: 'networkidle' }).catch(() => {});
    anchor = await page.evaluate((h) => !!document.getElementById(h), hash);
  }
  result.links.push({ href, from: href.startsWith('#') ? from : undefined, ok: known && anchor, note: !known ? 'không có trang này (rơi về trang chủ)' : !anchor ? 'không có #mục này' : '' });
}
await browser.close();
server?.kill();

// Ảnh nặng trong bản build
const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]);
for (const f of walk('dist')) {
  const kb = Math.round(statSync(f).size / 1024);
  if (/\.(jpe?g|png|webp)$/i.test(f) && kb > 300) result.images.push({ file: f, kb });
  if (/\.js$/.test(f) && kb > 500) result.images.push({ file: f, kb, note: 'JS lớn' });
}

writeFileSync(join(OUT, 'audit.json'), JSON.stringify(result, null, 2));
const bad = result.pages.filter((p) => p.errors.length || p.failed.length || p.hScroll || p.brokenImgs.length || p.fontProblems.length);
console.log(`Đã kiểm ${result.pages.length} lượt (${ROUTES.length} trang). Lượt có vấn đề: ${bad.length}. Link lỗi: ${result.links.filter((l) => l.ok === false).length}. Ảnh/JS nặng: ${result.images.length}.`);
console.log(`Kết quả: ${join(OUT, 'audit.json')}`);
