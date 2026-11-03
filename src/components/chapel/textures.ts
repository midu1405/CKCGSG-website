/**
 * Texture vẽ bằng canvas cho Nhà nguyện cổ — theo ảnh chụp thực tế:
 * mặt tiền Gothic trắng ngà (cổng vòm nhọn, cửa sổ hoa hồng, hoa văn đắp nổi, vòm mù), hành lang cột trắng – cửa gỗ đỏ nâu,
 * cửa sổ vòm bán nguyệt phía trên, bên trong sàn gạch xanh ngọc, vách gỗ cung thánh, kính màu.
 */
import * as THREE from 'three';

const cache = new Map<string, THREE.CanvasTexture>();
type G = CanvasRenderingContext2D;
function make(key: string, w: number, h: number, draw: (g: G, w: number, h: number) => void, repeat = false) {
  const hit = cache.get(key); if (hit) return hit;
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d')!, w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  cache.set(key, t); return t;
}
function rng(seed: number) { let s = seed; return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646; }
function grain(g: G, w: number, h: number, n: number, cols: string[], seed: number) {
  const r = rng(seed); for (let i = 0; i < n; i++) { g.fillStyle = cols[Math.floor(r() * cols.length)]; g.fillRect(r() * w, r() * h, 1 + r() * 3, 1 + r() * 3); }
}
export const IVORY = '#f3ecdc', IVORY_DK = '#ddd2bb', DOOR = '#5a1d14', WOOD = '#5b2a1c';

/** đường vòm nhọn (Gothic) từ (x, yBase) rộng w, chân cao yBase, đỉnh cao yTop */
function lancet(g: G, x: number, yBase: number, w: number, yTop: number) {
  const ySpring = Math.min(yBase, yTop + w * 0.8);
  g.beginPath(); g.moveTo(x, yBase); g.lineTo(x, ySpring);
  g.bezierCurveTo(x, yTop + (ySpring - yTop) * 0.35, x + w * 0.28, yTop + 2, x + w / 2, yTop);
  g.bezierCurveTo(x + w * 0.72, yTop + 2, x + w, yTop + (ySpring - yTop) * 0.35, x + w, ySpring);
  g.lineTo(x + w, yBase); g.closePath();
}
function relief(g: G, cx: number, cy: number, rw: number, rh: number, seed: number) {
  // hoa văn đắp nổi: các nét cong mảnh màu xám nhạt
  const r = rng(seed); g.strokeStyle = 'rgba(150,140,120,0.55)'; g.lineWidth = 1.4;
  for (let i = 0; i < 26; i++) {
    const x = cx + (r() - 0.5) * rw, y = cy + (r() - 0.5) * rh, s = 4 + r() * 9;
    g.beginPath(); g.arc(x, y, s, r() * 6, r() * 6 + 2.2); g.stroke();
    g.beginPath(); g.arc(-x + 2 * cx, y, s, Math.PI - (r() * 6 + 2.2), Math.PI - r() * 6); g.stroke();
  }
}

/** Khối giữa mặt tiền: rộng 12 m × cao 13 m (32 px/m) */
export function facadeCenterTex() {
  return make('ch-front', 384, 416, (g, w, h) => {
    g.fillStyle = IVORY; g.fillRect(0, 0, w, h); grain(g, w, h, 1500, ['rgba(120,100,70,0.05)', 'rgba(255,255,255,0.1)'], 3);
    // chân tường ốp đá (gạch khối)
    g.fillStyle = '#e9dfca'; g.fillRect(0, h - 70, w, 70);
    g.strokeStyle = 'rgba(140,125,100,0.45)'; g.lineWidth = 1.2;
    for (let y = h - 70; y < h; y += 14) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); for (let x = ((y / 14) % 2) * 20; x < w; x += 40) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 14); g.stroke(); } }
    // trụ ốp hai bên
    g.fillStyle = '#efe6d2'; g.fillRect(0, 0, 22, h); g.fillRect(w - 22, 0, 22, h);
    g.strokeStyle = 'rgba(150,135,110,0.5)'; for (const x of [22, w - 22]) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
    // dãy vòm nhỏ vàng nhạt hai bên cổng
    for (const side of [-1, 1]) for (let i = 0; i < 3; i++) {
      const x = w / 2 + side * (70 + i * 26) - (side < 0 ? 22 : 0);
      g.fillStyle = '#f0d9a6'; lancet(g, x, 300, 22, 238); g.fill();
      g.strokeStyle = '#d9c08a'; g.lineWidth = 2; lancet(g, x, 300, 22, 238); g.stroke();
      g.fillStyle = '#e8cf95'; g.fillRect(x + 4, 262, 14, 38);
    }
    // vòm mù lớn bao quanh cổng + hoa văn
    g.strokeStyle = 'rgba(150,135,110,0.6)'; g.lineWidth = 3; lancet(g, 40, 300, w - 80, 30); g.stroke();
    relief(g, w / 2, 150, 250, 150, 7);
    // cửa sổ hoa hồng
    g.fillStyle = '#efe7d6'; g.beginPath(); g.arc(w / 2, 96, 44, 0, Math.PI * 2); g.fill();
    g.strokeStyle = 'rgba(140,125,100,0.8)'; g.lineWidth = 5; g.beginPath(); g.arc(w / 2, 96, 44, 0, Math.PI * 2); g.stroke();
    g.lineWidth = 2; g.beginPath(); g.arc(w / 2, 96, 34, 0, Math.PI * 2); g.stroke();
    // khung tam giác nhọn trên cổng (gable nhỏ)
    g.fillStyle = '#f6f0e3'; g.beginPath(); g.moveTo(w / 2 - 60, 250); g.lineTo(w / 2, 150); g.lineTo(w / 2 + 60, 250); g.closePath(); g.fill();
    g.strokeStyle = 'rgba(140,125,100,0.7)'; g.lineWidth = 2.5; g.stroke();
    for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(w / 2 - 45 + i * 18, 246); g.lineTo(w / 2 - 45 + i * 18 + 9, 226 - Math.abs(i - 2.5) * 12); g.lineTo(w / 2 - 45 + i * 18 + 18, 246); g.stroke(); }
    // cổng vòm nhọn + cửa gỗ đỏ
    g.fillStyle = '#e8d9b6'; lancet(g, w / 2 - 50, h - 6, 100, 236); g.fill();
    g.strokeStyle = 'rgba(140,120,90,0.8)'; g.lineWidth = 3; lancet(g, w / 2 - 50, h - 6, 100, 236); g.stroke();
    const grd = g.createLinearGradient(0, 260, 0, h); grd.addColorStop(0, '#3a0f0a'); grd.addColorStop(1, DOOR);
    g.fillStyle = grd; lancet(g, w / 2 - 38, h - 6, 76, 256); g.fill();
    g.strokeStyle = 'rgba(0,0,0,0.35)'; g.lineWidth = 2; g.beginPath(); g.moveTo(w / 2, 300); g.lineTo(w / 2, h - 6); g.stroke();
  });
}

/** Đầu hồi tam giác phía trên khối giữa: 12 m × 6 m */
export function gableTex() {
  return make('ch-gable', 384, 192, (g, w, h) => {
    g.fillStyle = IVORY; g.fillRect(0, 0, w, h);
    // các vòm mù nhỏ xếp bậc
    g.strokeStyle = 'rgba(150,135,110,0.55)'; g.lineWidth = 2;
    for (let i = 0; i < 11; i++) {
      const x = 22 + i * 31, top = 30 + Math.abs(i - 5) * 26;
      lancet(g, x, h - 8, 22, top); g.stroke();
    }
    g.fillStyle = 'rgba(160,145,120,0.35)'; g.fillRect(0, h - 10, w, 10);
  });
}

/** Cánh hai bên mặt tiền: 6,5 m × 9 m — một vòm mù cao */
export function wingTex() {
  return make('ch-wing', 208, 288, (g, w, h) => {
    g.fillStyle = IVORY; g.fillRect(0, 0, w, h); grain(g, w, h, 600, ['rgba(120,100,70,0.05)'], 9);
    g.fillStyle = '#e9dfca'; g.fillRect(0, h - 50, w, 50);
    g.fillStyle = '#efe6d2'; lancet(g, 52, 230, 104, 40); g.fill();
    g.strokeStyle = 'rgba(140,125,100,0.7)'; g.lineWidth = 4; lancet(g, 52, 230, 104, 40); g.stroke();
    g.lineWidth = 2; lancet(g, 66, 226, 76, 62); g.stroke();
    g.fillStyle = '#f6f0e3'; g.fillRect(44, 230, 120, 10);
  });
}

/** Hành lang tầng dưới (một gian 4,5 m × 5 m): trụ trắng + khung cửa gỗ đỏ nâu chia ô */
export function aisleBayTex() {
  return make('ch-aisle', 256, 284, (g, w, h) => {
    g.fillStyle = IVORY; g.fillRect(0, 0, w, h);
    g.fillStyle = '#e7dcc6'; g.fillRect(0, h - 40, w, 40);
    g.fillStyle = IVORY_DK; g.fillRect(0, 0, 26, h); g.fillRect(w - 26, 0, 26, h);
    const x0 = 40, x1 = w - 40, y0 = 40, y1 = h - 44;
    g.fillStyle = WOOD; g.fillRect(x0, y0, x1 - x0, y1 - y0);
    g.fillStyle = '#2a120c';
    for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) g.fillRect(x0 + 10 + c * ((x1 - x0 - 20) / 4), y0 + 10 + r * ((y1 - y0 - 20) / 4), (x1 - x0 - 20) / 4 - 6, (y1 - y0 - 20) / 4 - 6);
    g.strokeStyle = '#7a3a26'; g.lineWidth = 4; g.strokeRect(x0, y0, x1 - x0, y1 - y0);
  }, true);
}

/** Tường cao phía trên (một gian 4,5 m × 4,5 m): cửa sổ vòm bán nguyệt gỗ tối chia song */
export function clerestoryBayTex() {
  return make('ch-clere', 256, 256, (g, w, h) => {
    g.fillStyle = IVORY; g.fillRect(0, 0, w, h);
    g.fillStyle = IVORY_DK; g.fillRect(0, 0, 22, h); g.fillRect(w - 22, 0, 22, h);
    const cx = w / 2, r = 70, base = h - 34;
    g.fillStyle = '#1f1612'; g.beginPath(); g.moveTo(cx - r, base); g.lineTo(cx - r, base - 90); g.arc(cx, base - 90, r, Math.PI, 0); g.lineTo(cx + r, base); g.closePath(); g.fill();
    g.strokeStyle = '#4a2a1c'; g.lineWidth = 3;
    for (let a = 1; a < 6; a++) { const t = Math.PI + (a / 6) * Math.PI; g.beginPath(); g.moveTo(cx, base - 90); g.lineTo(cx + Math.cos(t) * r, base - 90 + Math.sin(t) * r); g.stroke(); }
    for (let x = cx - r + 23; x < cx + r; x += 23) { g.beginPath(); g.moveTo(x, base - 90); g.lineTo(x, base); g.stroke(); }
    g.beginPath(); g.moveTo(cx - r, base - 45); g.lineTo(cx + r, base - 45); g.stroke();
    // con sơn đỡ mái
    g.fillStyle = '#2b2522'; for (const x of [10, w - 18]) g.fillRect(x, 0, 8, 26);
  }, true);
}

/* ---------- Bên trong ---------- */
/** Sàn gạch xanh ngọc bóng — ô 0,6 m (texture 2,4 m) */
export function floorTex() {
  return make('ch-floor', 256, 256, (g, w, h) => {
    g.fillStyle = '#2f7f7b'; g.fillRect(0, 0, w, h);
    grain(g, w, h, 2500, ['rgba(255,255,255,0.05)', 'rgba(0,0,0,0.06)', '#3a8c87'], 13);
    g.strokeStyle = 'rgba(20,60,58,0.7)'; g.lineWidth = 2;
    for (let i = 0; i <= w; i += 64) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, h); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(w, i); g.stroke(); }
  }, true);
}
/** Vách gỗ nan dọc sau bàn thờ */
export function slatTex() {
  return make('ch-slat', 256, 256, (g, w, h) => {
    for (let x = 0; x < w; x += 16) {
      const tone = 150 + ((x * 37) % 40);
      g.fillStyle = `rgb(${tone + 40},${tone - 10},${tone - 70})`; g.fillRect(x, 0, 16, h);
      g.fillStyle = 'rgba(60,30,10,0.45)'; g.fillRect(x + 14, 0, 2, h);
    }
    grain(g, w, h, 1500, ['rgba(80,40,10,0.12)', 'rgba(255,220,170,0.08)'], 17);
  }, true);
}
/** Kính màu cửa sổ */
export function stainedTex(seed = 1) {
  return make('ch-glass-' + seed, 128, 256, (g, w, h) => {
    const cols = ['#c0392b', '#2e86c1', '#f1c40f', '#27ae60', '#8e44ad', '#e67e22', '#1abc9c'];
    const r = rng(seed * 31);
    for (let y = 0; y < h; y += 16) for (let x = 0; x < w; x += 16) { g.fillStyle = cols[Math.floor(r() * cols.length)]; g.fillRect(x, y, 16, 16); }
    g.strokeStyle = '#1b1b1b'; g.lineWidth = 2;
    for (let y = 0; y <= h; y += 16) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
    for (let x = 0; x <= w; x += 16) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
    g.fillStyle = 'rgba(255,240,200,0.55)'; g.beginPath(); g.arc(w / 2, h * 0.38, 22, 0, Math.PI * 2); g.fill();
  });
}
