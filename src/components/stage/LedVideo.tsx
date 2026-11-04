/**
 * Màn LED nền sân khấu phát liên tục các clip YouTube của nhóm (tự chuyển clip, hết danh sách thì lặp lại).
 * Trình duyệt chỉ cho tự phát khi tắt tiếng → mặc định tắt tiếng, có nút "Bật tiếng" trên trang.
 * Dùng chế độ occlude="blending": video nằm sau lớp 3D và được "khoét" đúng chỗ màn LED, nên nhân vật, giàn đèn, toà nhà đứng trước sẽ che video như thật.
 * Điều khiển qua sự kiện window 'ckcgsg-led' với detail: 'unmute' | 'mute' | 'next' | 'prev'.
 * ➜ Đổi / thêm clip: sửa danh sách LED_CLIPS bên dưới (mã video là phần sau "watch?v=").
 */
import { useEffect, useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';

export const LED_CLIPS = [
  { id: '3haB72E5u3M', title: 'Chim Bằng – This Is Me' },
  { id: 'tg5ANi-IOFQ', title: 'Nhìn lại 2024–2025' },
  { id: 'f3BLwKxxTrg', title: 'Nguyện Cầu – Recap hành hương Năm Thánh 2025' },
  { id: '6EUV2Vt3NpM', title: 'MV Kinh Dâng Hiến (Suscipe)' },
  { id: '6S4JXFAO2pA', title: 'Ơn Tuyệt Vời (Amazing Grace)' },
];
/** Nhãn HTML trong cảnh phải nằm trên lớp canvas (canvas có z-index ~8,4 triệu khi màn LED dùng chế độ blending) */
export const OVER_Z: [number, number] = [16777200, 16777000];

export type LedCommand = 'unmute' | 'mute' | 'next' | 'prev';
export const ledCommand = (c: LedCommand) => window.dispatchEvent(new CustomEvent<LedCommand>('ckcgsg-led', { detail: c }));

const [first, ...rest] = LED_CLIPS.map(c => c.id);
const SRC = `https://www.youtube-nocookie.com/embed/${first}?autoplay=1&mute=1&loop=1&playlist=${rest.join(',')},${first}`
  + '&controls=0&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&enablejsapi=1';

/** w × h (mét) — 16:9 đặt giữa màn LED 22 × 8 m; 80 px / mét */
export function LedVideo({ position, w = 14.2, h = 8 }: { position: [number, number, number]; w?: number; h?: number }) {
  const frame = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const call = (func: string) => frame.current?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func, args: [] }), '*');
    const on = (e: Event) => {
      const c = (e as CustomEvent<LedCommand>).detail;
      if (c === 'unmute') { call('unMute'); call('setVolume'); call('playVideo'); }
      if (c === 'mute') call('mute');
      if (c === 'next') call('nextVideo');
      if (c === 'prev') call('previousVideo');
    };
    window.addEventListener('ckcgsg-led', on);
    return () => window.removeEventListener('ckcgsg-led', on);
  }, []);
  // drei chỉ đặt z-index cho canvas một lần và các nhãn HTML khác có thể xoá mất → giữ cố định mỗi khung hình:
  // canvas nằm trên lớp video (video z ≤ 8.388.634), các nhãn (OVER_Z) nằm trên canvas.
  const gl = useThree(s => s.gl);
  useFrame(() => {
    const st = gl.domElement.style;
    if (st.zIndex !== '8388635') { st.zIndex = '8388635'; st.position = 'relative'; }
  });
  useEffect(() => () => { gl.domElement.style.zIndex = ''; }, [gl]);
  const px = 80;
  return (
    <Html transform occlude="blending" position={position} distanceFactor={400 / px} pointerEvents="none"
      style={{ width: w * px, height: h * px, backfaceVisibility: 'hidden', background: '#000' }}>
      <iframe ref={frame} src={SRC} title="Màn LED – clip của Nhóm Ca Kịch Công Giáo Sài Gòn" width={w * px} height={h * px}
        allow="autoplay; encrypted-media; picture-in-picture" referrerPolicy="strict-origin-when-cross-origin"
        style={{ border: 0, pointerEvents: 'none', display: 'block' }} />
    </Html>
  );
}
