/** Giao diện chế độ Dạo khuôn viên: bảng chọn tên & màu áo, thanh trạng thái, cần điều khiển trên điện thoại */
import { useEffect, useRef, useState } from 'react';
import { Footprints, LogOut, Users, X } from 'lucide-react';
import type { Me, TouchInput } from './Walker';
import type { NetStatus } from './presence';

export const ROBES = ['#D4AF37', '#f4f1ea', '#9b2c2c', '#3d5a80', '#5b7d5a', '#7a5c8e', '#c96f3b', '#22252b'];

const load = (): Me => {
  try { const s = JSON.parse(localStorage.getItem('ckcgsg-walker') || 'null'); if (s?.name && s?.color) return s; } catch { /* bỏ qua */ }
  return { name: `Khách ${Math.floor(100 + Math.random() * 900)}`, color: ROBES[Math.floor(Math.random() * ROBES.length)] };
};

export function JoinDialog({ onJoin, onClose }: { onJoin: (m: Me) => void; onClose: () => void }) {
  const [me, setMe] = useState<Me>(load);
  const go = () => {
    const m = { name: me.name.trim().slice(0, 24) || 'Khách', color: me.color };
    try { localStorage.setItem('ckcgsg-walker', JSON.stringify(m)); } catch { /* bỏ qua */ }
    onJoin(m);
  };
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm rounded-3xl border border-gold/30 bg-[#141414] p-6 shadow-2xl">
        <div className="flex items-start justify-between mb-1">
          <h2 className="serif text-2xl font-bold">Dạo khuôn viên</h2>
          <button onClick={onClose} aria-label="Đóng" className="text-white/50 hover:text-white"><X size={20} /></button>
        </div>
        <p className="text-white/55 text-sm mb-5">Đi dạo quanh sân khấu Đắc Lộ cùng những người đang xem trang lúc này.</p>
        <label className="block text-[11px] uppercase tracking-widest font-bold text-white/45 mb-1.5">Tên hiển thị</label>
        <input value={me.name} maxLength={24} onChange={e => setMe({ ...me, name: e.target.value })} onKeyDown={e => e.key === 'Enter' && go()}
          className="w-full rounded-xl bg-black/50 border border-white/15 focus:border-gold outline-none px-3 py-2.5 mb-4" />
        <div className="text-[11px] uppercase tracking-widest font-bold text-white/45 mb-2">Màu áo</div>
        <div className="flex flex-wrap gap-2 mb-6">
          {ROBES.map(c => (
            <button key={c} onClick={() => setMe({ ...me, color: c })} aria-label={`Màu ${c}`}
              className={`w-9 h-9 rounded-full border-2 transition-transform ${me.color === c ? 'border-white scale-110' : 'border-white/10'}`} style={{ background: c }} />
          ))}
        </div>
        <button onClick={go} className="w-full flex items-center justify-center gap-2 bg-gold text-black rounded-full py-3 font-bold">
          <Footprints size={18} /> Vào khuôn viên
        </button>
        <p className="text-[11px] text-white/35 mt-3 leading-relaxed">Tên và vị trí của bạn hiển thị cho người khác đang dạo cùng. Không lưu lại sau khi rời trang.</p>
      </div>
    </div>
  );
}

const STATUS: Record<NetStatus, string> = { off: '', connecting: 'Đang kết nối…', online: 'Trực tuyến', local: 'Chỉ thấy các tab trên máy này' };

export function WalkHud({ count, status, onExit }: { count: number; status: NetStatus; onExit: () => void }) {
  return (
    <div className="absolute z-30 top-[88px] left-4 right-4 flex items-start justify-between gap-3 pointer-events-none">
      <div className="pointer-events-auto rounded-2xl bg-black/70 backdrop-blur border border-white/10 px-4 py-3">
        <div className="flex items-center gap-2 font-bold">
          <span className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-emerald-400' : status === 'local' ? 'bg-amber-400' : 'bg-white/40 animate-pulse'}`} />
          <Users size={16} className="text-gold" /> {count} người đang dạo
        </div>
        <div className="text-[11px] text-white/45 mt-0.5">{STATUS[status]}</div>
        <div className="hidden md:block text-[11px] text-white/55 mt-2 leading-relaxed">
          <b className="text-white/80">W A S D</b> di chuyển · <b className="text-white/80">Space</b> nhảy · <b className="text-white/80">Shift</b> chạy<br />
          Kéo chuột để xoay · lăn chuột để phóng to
        </div>
      </div>
      <button onClick={onExit} className="pointer-events-auto flex items-center gap-2 bg-gold text-black rounded-full px-4 py-2 font-bold text-sm">
        <LogOut size={16} /> Thoát
      </button>
    </div>
  );
}

/** Cần điều khiển ảo + nút nhảy (chỉ hiện trên màn hình cảm ứng) */
export function TouchControls({ touch }: { touch: React.MutableRefObject<TouchInput> }) {
  const [coarse, setCoarse] = useState(false);
  const base = useRef<HTMLDivElement>(null);
  const [knob, setKnob] = useState<[number, number]>([0, 0]);
  const active = useRef<number | null>(null);
  useEffect(() => { try { setCoarse(window.matchMedia('(pointer: coarse)').matches); } catch { /* bỏ qua */ } }, []);
  if (!coarse) return null;
  const move = (e: React.PointerEvent) => {
    if (active.current !== e.pointerId || !base.current) return;
    const r = base.current.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2, max = r.width / 2;
    let dx = e.clientX - cx, dy = e.clientY - cy; const l = Math.hypot(dx, dy); if (l > max) { dx *= max / l; dy *= max / l; }
    setKnob([dx, dy]); touch.current.x = dx / max; touch.current.y = -dy / max;
  };
  const end = () => { active.current = null; setKnob([0, 0]); touch.current.x = 0; touch.current.y = 0; };
  return (
    <>
      <div ref={base} className="absolute z-30 left-6 bottom-8 w-32 h-32 rounded-full bg-white/10 border border-white/20 backdrop-blur touch-none"
        onPointerDown={e => { e.stopPropagation(); active.current = e.pointerId; (e.target as HTMLElement).setPointerCapture(e.pointerId); move(e); }}
        onPointerMove={move} onPointerUp={end} onPointerCancel={end}>
        <div className="absolute left-1/2 top-1/2 w-14 h-14 -ml-7 -mt-7 rounded-full bg-gold/80" style={{ transform: `translate(${knob[0]}px, ${knob[1]}px)` }} />
      </div>
      <button className="absolute z-30 right-6 bottom-10 w-20 h-20 rounded-full bg-gold text-black font-bold touch-none select-none"
        onPointerDown={e => { e.stopPropagation(); touch.current.jump = true; }} onPointerUp={() => (touch.current.jump = false)} onPointerCancel={() => (touch.current.jump = false)}>
        Nhảy
      </button>
    </>
  );
}
