/**
 * Vật liệu vẽ bằng canvas (không cần tải ảnh): mặt tiền có cửa sổ, ngói, cỏ, gạch lát, nhựa đường.
 * Mỗi texture được tạo một lần rồi dùng chung cho cả sơ đồ sân khấu và sơ đồ khuôn viên.
 */
import * as THREE from 'three';

const cache = new Map<string, THREE.CanvasTexture>();
type G = CanvasRenderingContext2D;

function make(key: string, size: number, draw: (g: G, s: number) => void, srgb = true) {
  const hit = cache.get(key);
  if (hit) return hit;
  const c = document.createElement('canvas'); c.width = c.height = size;
  const g = c.getContext('2d')!;
  draw(g, size);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  cache.set(key, t);
  return t;
}

/** Số ngẫu nhiên cố định (để mỗi lần tải trang trông giống nhau) */
function rng(seed: number) { let s = seed; return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646; }
function speckle(g: G, s: number, n: number, colors: string[], seed: number, max = 6) {
  const r = rng(seed);
  for (let i = 0; i < n; i++) { g.fillStyle = colors[Math.floor(r() * colors.length)]; const w = 1 + r() * max; g.fillRect(r() * s, r() * s, w, w * (0.4 + r())); }
}

export type FacadeStyle = 'colonial' | 'modern' | 'chapel';
const FACADE = {
  colonial: { wall: '#e2bf72', dark: 'rgba(120,80,20,0.08)', trim: '#f6efe0', shutter: '#3e6a4c', arch: true },
  modern: { wall: '#e6dfd2', dark: 'rgba(60,50,40,0.07)', trim: '#fbf8f2', shutter: '', arch: false },
  chapel: { wall: '#efe0bd', dark: 'rgba(120,90,40,0.07)', trim: '#fffaf0', shutter: '', arch: true },
};

/**
 * Một "ô" mặt tiền = 1 cửa sổ. colonial/modern: rộng 4 m × cao 1 tầng (3,6 m); chapel: 4 m × 8 m (cửa sổ vòm cao).
 * lit = bản dùng cho ánh đèn ban đêm (chỉ ô kính sáng, còn lại đen).
 */
export function facadeTex(style: FacadeStyle, lit = false) {
  return make(`facade-${style}-${lit}`, 256, (g, s) => {
    const f = FACADE[style];
    g.fillStyle = lit ? '#000' : f.wall; g.fillRect(0, 0, s, s);
    if (!lit) speckle(g, s, 900, [f.dark, 'rgba(255,255,255,0.06)'], style.length * 7);
    const chapel = style === 'chapel';
    const ww = chapel ? 70 : f.arch ? 92 : 112, x0 = (s - ww) / 2;
    const y0 = chapel ? 40 : 58, y1 = chapel ? 220 : 206;
    // dải gờ sàn / chân tường
    if (!lit) {
      g.fillStyle = f.trim; g.fillRect(0, s - 12, s, 12);
      g.fillStyle = 'rgba(0,0,0,0.12)'; g.fillRect(0, s - 13, s, 2);
      if (chapel) { g.fillStyle = f.trim; g.fillRect(0, 0, 14, s); g.fillRect(s - 14, 0, 14, s); } // trụ áp tường
    }
    // khung cửa sổ
    const path = () => {
      g.beginPath();
      if (f.arch) { const r = ww / 2; g.moveTo(x0, y1); g.lineTo(x0, y0 + r); g.arc(x0 + r, y0 + r, r, Math.PI, 0); g.lineTo(x0 + ww, y1); g.closePath(); }
      else g.rect(x0, y0, ww, y1 - y0);
    };
    if (!lit) { g.save(); g.translate(-7, -7); g.scale(1, 1); g.restore(); g.lineWidth = 14; g.strokeStyle = f.trim; path(); g.stroke(); }
    const grd = g.createLinearGradient(0, y0, 0, y1);
    if (lit) { grd.addColorStop(0, '#ffcf7a'); grd.addColorStop(1, '#ffb257'); }
    else if (chapel) { grd.addColorStop(0, '#5b4a7a'); grd.addColorStop(0.5, '#3d5a7a'); grd.addColorStop(1, '#7a4a3a'); }
    else { grd.addColorStop(0, '#5f7482'); grd.addColorStop(1, '#2a3640'); }
    g.fillStyle = grd; path(); g.fill();
    if (!lit) {
      // song cửa
      g.strokeStyle = f.trim; g.lineWidth = chapel ? 3 : 4;
      g.beginPath(); g.moveTo(s / 2, y0 + 4); g.lineTo(s / 2, y1); g.stroke();
      for (let y = y0 + (chapel ? 70 : 60); y < y1; y += chapel ? 45 : 55) { g.beginPath(); g.moveTo(x0, y); g.lineTo(x0 + ww, y); g.stroke(); }
      // bậu cửa
      g.fillStyle = f.trim; g.fillRect(x0 - 10, y1, ww + 20, 9);
      // cửa chớp xanh hai bên (kiểu nhà Pháp cổ)
      if (f.shutter) {
        for (const sx of [x0 - 44, x0 + ww + 8]) {
          g.fillStyle = f.shutter; g.fillRect(sx, y0 + 30, 36, y1 - y0 - 30);
          g.strokeStyle = 'rgba(0,0,0,0.25)'; g.lineWidth = 2;
          for (let y = y0 + 36; y < y1; y += 7) { g.beginPath(); g.moveTo(sx + 3, y); g.lineTo(sx + 33, y); g.stroke(); }
        }
      }
    }
  });
}

/** Ngói đỏ — một ô 2 × 2 m */
export function roofTileTex() {
  return make('roof-tile', 128, (g, s) => {
    g.fillStyle = '#9e4f35'; g.fillRect(0, 0, s, s);
    speckle(g, s, 500, ['rgba(60,20,10,0.18)', 'rgba(255,180,140,0.10)'], 3, 5);
    for (let r = 0; r < 8; r++) {
      const y = r * 16;
      g.fillStyle = 'rgba(40,12,6,0.35)'; g.fillRect(0, y + 13, s, 3);
      for (let x = (r % 2) * 8; x < s; x += 16) { g.fillStyle = 'rgba(40,12,6,0.22)'; g.fillRect(x, y, 2, 14); }
    }
  });
}

/** Mái bằng bê tông */
export function concreteTex() {
  return make('concrete', 128, (g, s) => {
    g.fillStyle = '#9b968d'; g.fillRect(0, 0, s, s);
    speckle(g, s, 900, ['rgba(0,0,0,0.08)', 'rgba(255,255,255,0.07)'], 11, 4);
    g.strokeStyle = 'rgba(0,0,0,0.12)'; g.lineWidth = 1; g.strokeRect(0.5, 0.5, s - 1, s - 1);
  });
}

/** Cỏ — một ô 8 × 8 m */
export function grassTex() {
  return make('grass', 256, (g, s) => {
    g.fillStyle = '#5d7a3d'; g.fillRect(0, 0, s, s);
    speckle(g, s, 5000, ['#4e6b32', '#6d8a46', '#56743a', '#7a9550', '#476230'], 5, 4);
  });
}

/** Gạch lát sân — một ô 4 × 4 m (gạch 50 cm) */
export function pavingTex(tone: 'warm' | 'grey' = 'grey') {
  return make(`paving-${tone}`, 256, (g, s) => {
    g.fillStyle = tone === 'warm' ? '#b8a68c' : '#a9a59c'; g.fillRect(0, 0, s, s);
    speckle(g, s, 1500, ['rgba(0,0,0,0.07)', 'rgba(255,255,255,0.08)'], tone === 'warm' ? 21 : 23, 4);
    g.strokeStyle = 'rgba(70,60,50,0.35)'; g.lineWidth = 2;
    for (let i = 0; i <= s; i += 32) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, s); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(s, i); g.stroke(); }
  });
}

/** Nhựa đường — một ô 8 × 8 m */
export function asphaltTex() {
  return make('asphalt', 256, (g, s) => {
    g.fillStyle = '#4a4b4d'; g.fillRect(0, 0, s, s);
    speckle(g, s, 4000, ['rgba(0,0,0,0.12)', 'rgba(255,255,255,0.07)'], 31, 3);
  });
}

/** Tường rào sơn vôi — một ô 3 × 3 m */
export function stuccoTex() {
  return make('stucco', 128, (g, s) => {
    g.fillStyle = '#e4d8bf'; g.fillRect(0, 0, s, s);
    speckle(g, s, 900, ['rgba(110,80,40,0.08)', 'rgba(255,255,255,0.08)'], 41, 4);
    g.fillStyle = 'rgba(120,90,50,0.18)'; g.fillRect(0, s - 10, s, 10);
  });
}

/** Bản sao có số lần lặp riêng (texture gốc dùng chung ảnh) */
export function tiled(t: THREE.Texture, rx: number, ry: number) {
  const c = t.clone(); c.repeat.set(rx, ry); c.needsUpdate = true; return c;
}
