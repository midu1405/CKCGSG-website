// Soát mã nguồn tìm các mẫu giao diện "làm vội / kiểu AI" và lỗi tiếp cận hay gặp.
// Danh sách mẫu phỏng theo bảng AI Slop của gstack /design-review (MIT, github.com/garrytan/gstack),
// đã lọc cho website CKCGSG. Cách đọc từng mục: docs/SOAT-THIET-KE.md.
//
// Cách chạy:  npm run soat-ma            (cả thư mục src/)
//             npm run soat-ma -- src/pages/DacLoPage.tsx   (chỉ vài file, ví dụ file vừa đổi)
// Kết quả:    in bảng tóm tắt + ghi docs/audits/<ngày>/soat-ma.json
//
// "loai": loi = nên sửa · can-nhac = để người soát quyết (có thể là chủ ý thiết kế) · nho = đánh bóng

import { readFileSync, readdirSync, statSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const BO_QUA_THU_MUC = ['stage', 'world', 'campus', 'chapel', 'walk']; // thư mục 3D: quy tắc khác

const RULES = [
  { id: 'thieu-focus', loai: 'loi', nhom: 'Trạng thái tương tác',
    re: /\boutline-none\b/g,
    boQuaNeu: /focus(-visible|-within)?:(outline|ring|border)/, // đã có viền/vòng thay thế khi focus
    goiY: 'Bỏ viền focus mà không thay bằng `focus-visible:outline-*` → người dùng bàn phím không thấy mình đang ở đâu.' },
  { id: 'transition-all', loai: 'loi', nhom: 'Chuyển động',
    re: /\btransition-all\b/g,
    goiY: 'Ghi rõ thuộc tính: `transition-colors`, `transition-transform`, `transition-opacity`. Chỉ nên động transform/opacity.' },
  { id: 'anh-giu-cho', loai: 'loi', nhom: 'Nội dung',
    re: /picsum\.photos|watch\?v=placeholder|lorem ipsum/gi,
    goiY: 'Ảnh / link giữ chỗ người xem sẽ gặp. Thay bằng thật hoặc ẩn đi.' },
  { id: 'ma-mau-hex', loai: 'loi', nhom: 'Màu',
    re: /#[0-9A-Fa-f]{6}\b/g,
    goiY: 'Dùng token trong src/index.css (CLAUDE.md mục 5).' },
  { id: 'nut-chung-chung', loai: 'loi', nhom: 'Câu chữ',
    re: />\s*(Tìm hiểu thêm|Xem thêm|Learn more|Get started|Bắt đầu ngay)\s*</gi,
    goiY: 'Nút nên nói rõ bấm vào được gì ("Xem lịch diễn Đắc Lộ", "Đăng ký cộng tác").' },
  { id: 'nhan-tren-tieu-de', loai: 'can-nhac', nhom: 'AI slop',
    re: /uppercase[^"'`]*tracking-(\[[^\]]+\]|widest|wider)/g,
    goiY: 'Nhãn chữ in hoa giãn rộng trên mỗi tiêu đề là dấu hiệu template. Giữ ở nơi thật sự cần phân loại.' },
  { id: 'kinh-mo', loai: 'can-nhac', nhom: 'AI slop',
    re: /\bbackdrop-blur(-\w+)?\b/g,
    goiY: 'Kính mờ chỉ dùng khi nó giải thích lớp chồng (menu trên ảnh), không làm nền mặc định.' },
  { id: 'so-chay', loai: 'can-nhac', nhom: 'AI slop',
    re: /<CountUp\b/g,
    goiY: 'Hàng "3 con số to" là mẫu template. Giữ nếu số có ý nghĩa thật với người xem, kèm nguồn.' },
  { id: 'can-giua', loai: 'can-nhac', nhom: 'AI slop',
    re: /\btext-center\b/g,
    goiY: 'Căn giữa mọi thứ làm trang mất hướng đọc. Đoạn văn dài nên căn trái.' },
  { id: 'gradient-chu', loai: 'can-nhac', nhom: 'AI slop',
    re: /\bbg-clip-text\b/g,
    goiY: 'Chữ tô gradient: dấu hiệu AI rõ nhất. Dùng màu đặc của bảng màu.' },
  { id: 'bo-goc-lon', loai: 'nho', nhom: 'Khoảng cách & bố cục',
    re: /\brounded-(2xl|3xl|\[[2-9]\dpx\])/g,
    goiY: 'Bo góc lớn như nhau ở mọi khối → nên có thứ bậc (khung ngoài lớn, phần tử trong nhỏ hơn).' },
  { id: 'ba-cham', loai: 'nho', nhom: 'Câu chữ',
    re: />[^<{]*\.\.\.[^<]*</g,
    goiY: 'Dùng ký tự "…" thay cho ba dấu chấm.' },
];

function listFiles(p) {
  const st = statSync(p);
  if (st.isFile()) return /\.(tsx?|css)$/.test(p) ? [p] : [];
  return readdirSync(p).flatMap(n => {
    if (BO_QUA_THU_MUC.includes(n) || n === 'node_modules') return [];
    return listFiles(join(p, n));
  });
}

const targets = process.argv.slice(2).filter(a => a !== '--');
const files = (targets.length ? targets : ['src']).flatMap(t => listFiles(join(ROOT, t)));

const hits = Object.fromEntries(RULES.map(r => [r.id, []]));
for (const f of files) {
  const rel = relative(ROOT, f);
  const lines = readFileSync(f, 'utf8').split('\n');
  lines.forEach((line, i) => {
    for (const r of RULES) {
      if (r.id === 'ma-mau-hex' && rel.endsWith('index.css')) continue;
      if (r.boQuaNeu && r.boQuaNeu.test(line)) continue;
      const n = (line.match(r.re) || []).length;
      if (n) hits[r.id].push({ file: rel, line: i + 1, n });
    }
  });
}

const summary = RULES.map(r => ({
  id: r.id, loai: r.loai, nhom: r.nhom, goiY: r.goiY,
  tong: hits[r.id].reduce((s, h) => s + h.n, 0),
  vi_tri: hits[r.id].slice(0, 40).map(h => `${h.file}:${h.line}`),
}));

const today = new Date().toISOString().slice(0, 10);
const outDir = join(ROOT, 'docs/audits', today);
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'soat-ma.json'),
  JSON.stringify({ ngay: today, so_file: files.length, pham_vi: targets.length ? targets : ['src'], ket_qua: summary }, null, 2));

const icon = { loi: '🔴', 'can-nhac': '🟠', nho: '⚪' };
console.log(`Soát ${files.length} file — ${today}\n`);
for (const s of summary) console.log(`${icon[s.loai]} ${s.id.padEnd(18)} ${String(s.tong).padStart(4)}   ${s.nhom}`);
console.log(`\n🔴 nên sửa · 🟠 người soát cân nhắc · ⚪ đánh bóng`);
console.log(`Chi tiết vị trí: ${relative(ROOT, join(outDir, 'soat-ma.json'))} · cách đọc: docs/SOAT-THIET-KE.md`);
