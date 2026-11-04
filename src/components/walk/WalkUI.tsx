/** Giao diện chế độ Dạo khuôn viên: bảng nhập tên, thanh trạng thái, động tác, khung chat, cần điều khiển trên điện thoại */
import { useEffect, useRef, useState } from 'react';
import { Eye, Footprints, LogOut, MapPin, MessageCircle, Send, Users, X } from 'lucide-react';
import { ZONES, type Zone } from '../stage/data';
import { EMOTES, type EmoteId, type EmoteState, type Me, type TouchInput } from './Walker';
import { MAX_CHAT, type ChatLine, type NetStatus } from './presence';

const load = (): Me => {
  try { const s = JSON.parse(localStorage.getItem('ckcgsg-walker') || 'null'); if (s?.name) return { name: s.name }; } catch { /* bỏ qua */ }
  return { name: `Khách ${Math.floor(100 + Math.random() * 900)}` };
};

export function JoinDialog({ onJoin, onClose }: { onJoin: (m: Me, z?: Zone) => void; onClose: () => void }) {
  const [name, setName] = useState(() => load().name);
  const [zone, setZone] = useState<string>('');
  const go = () => {
    const m = { name: name.replace(/\s+/g, ' ').trim().slice(0, 24) || 'Khách' };
    try { localStorage.setItem('ckcgsg-walker', JSON.stringify(m)); } catch { /* bỏ qua */ }
    onJoin(m, ZONES.find(z => z.id === zone));
  };
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm rounded-3xl border border-gold/30 bg-[#141414] p-6 shadow-2xl">
        <div className="flex items-start justify-between mb-1">
          <h2 className="serif text-2xl font-bold">Dạo khuôn viên</h2>
          <button onClick={onClose} aria-label="Đóng" className="text-white/50 hover:text-white"><X size={20} /></button>
        </div>
        <p className="text-white/55 text-sm mb-5">Hoá thân thành chú Chiên Con, đi dạo quanh sân khấu Đắc Lộ, chào hỏi và trò chuyện với những người đang xem trang lúc này.</p>
        <label className="block text-[11px] uppercase tracking-widest font-bold text-white/45 mb-1.5">Tên hiển thị</label>
        <input value={name} maxLength={24} autoFocus onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && go()}
          className="w-full rounded-xl bg-black/50 border border-white/15 focus:border-gold outline-none px-3 py-2.5 mb-4" />
        <div className="text-[11px] uppercase tracking-widest font-bold text-white/45 mb-1.5">Bắt đầu ở đâu</div>
        <div className="flex flex-wrap gap-1.5 mb-6">
          {[{ id: '', short: 'Lối vào', color: '#888' }, ...ZONES].map(z => (
            <button key={z.id} onClick={() => setZone(z.id)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold border transition ${zone === z.id ? 'border-gold bg-gold/15 text-white' : 'border-white/10 text-white/60 hover:text-white'}`}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: z.color }} />{z.short}
            </button>
          ))}
        </div>
        <button onClick={go} className="w-full flex items-center justify-center gap-2 bg-gold text-black rounded-full py-3 font-bold">
          <Footprints size={18} /> Vào khuôn viên
        </button>
        <p className="text-[11px] text-white/35 mt-3 leading-relaxed">Tên, vị trí và tin nhắn của bạn hiển thị cho người đang dạo cùng; không lưu lại sau khi rời trang. Xin giữ lời lẽ hoà nhã.</p>
      </div>
    </div>
  );
}

const STATUS: Record<NetStatus, string> = { off: '', connecting: 'Đang kết nối…', online: 'Trực tuyến', local: 'Chỉ thấy các tab trên máy này' };

export function WalkHud({ count, status, onExit, where = 'đang dạo', firstPerson, onView }: { count: number; status: NetStatus; onExit: () => void; where?: string; firstPerson?: boolean; onView?: () => void }) {
  return (
    <div className="absolute z-40 top-[88px] left-4 right-4 flex items-start justify-between gap-3 pointer-events-none" style={{ transform: 'translateZ(0)' }}>
      <div className="pointer-events-auto rounded-2xl bg-black/70 backdrop-blur border border-white/10 px-3 py-2 md:px-4 md:py-3">
        <div className="flex items-center gap-2 font-bold text-sm md:text-base whitespace-nowrap">
          <span className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-emerald-400' : status === 'local' ? 'bg-amber-400' : 'bg-white/40 animate-pulse'}`} />
          <Users size={16} className="text-gold" /> {count} người<span className="hidden md:inline"> {where}</span>
        </div>
        <div className="hidden md:block text-[11px] text-white/45 mt-0.5">{STATUS[status]}</div>
        <div className="hidden md:block text-[11px] text-white/55 mt-2 leading-relaxed">
          <b className="text-white/80">W A S D</b> di chuyển · <b className="text-white/80">Space</b> nhảy · <b className="text-white/80">Shift</b> chạy<br />
          <b className="text-white/80">1–6</b> động tác · <b className="text-white/80">Enter</b> để chat · <b className="text-white/80">V</b> đổi góc nhìn · kéo chuột để xoay
        </div>
      </div>
      <div className="pointer-events-auto flex items-center gap-2">
        {onView && (
          <div className="flex items-center rounded-full bg-black/70 backdrop-blur border border-white/15 p-0.5" role="group" aria-label="Góc nhìn">
            <Eye size={14} className="mx-1.5 text-gold shrink-0" />
            {([[false, 'Thứ 3'], [true, 'Thứ 1']] as const).map(([fp, label]) => (
              <button key={label} type="button" aria-pressed={fp === !!firstPerson}
                onPointerUp={e => { e.stopPropagation(); if (fp !== !!firstPerson) onView(); }}
                onClick={e => { if (e.detail === 0 && fp !== !!firstPerson) onView(); }}
                className={`touch-manipulation rounded-full px-3 py-2 text-xs font-bold whitespace-nowrap ${fp === !!firstPerson ? 'bg-gold text-black' : 'text-white/75'}`}>
                {label}
              </button>
            ))}
          </div>
        )}
        <button onClick={onExit} aria-label="Thoát" className="flex items-center gap-2 bg-gold text-black rounded-full px-3 md:px-4 py-2 font-bold text-sm">
          <LogOut size={16} /> <span className="hidden sm:inline">Thoát</span>
        </button>
      </div>
    </div>
  );
}

/** Thanh động tác: vẫy tay, cúi chào, vỗ tay, nhảy múa, thả tim */
export function EmoteBar({ emote }: { emote: React.MutableRefObject<EmoteState> }) {
  const play = (id: EmoteId) => { emote.current = { id, k: emote.current.k + 1, t0: -1 }; (document.activeElement as HTMLElement | null)?.blur?.(); };
  return (
    <div className="absolute z-30 left-1/2 -translate-x-1/2 bottom-[150px] md:bottom-6 flex gap-1.5 rounded-full bg-black/70 backdrop-blur border border-white/10 p-1.5">
      {EMOTES.map((e, i) => (
        <button key={e.id} onClick={() => play(e.id)} title={`${e.label} (phím ${i + 1})`}
          className="group flex items-center gap-1.5 rounded-full px-2.5 md:px-3 py-1.5 hover:bg-white/10 active:scale-95 transition">
          <span className="text-lg leading-none">{e.icon}</span>
          <span className="hidden md:inline text-xs font-bold text-white/80 whitespace-nowrap">{e.label}</span>
        </button>
      ))}
    </div>
  );
}

/** Khung chat: Enter để mở / gửi, Esc để quay lại điều khiển nhân vật */
export function ChatPanel({ lines, onSend }: { lines: ChatLine[]; onSend: (t: string) => boolean }) {
  const [open, setOpen] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 768);
  const [text, setText] = useState('');
  const input = useRef<HTMLInputElement>(null), list = useRef<HTMLDivElement>(null);
  const [unread, setUnread] = useState(0);
  const seen = useRef(0);
  useEffect(() => { if (list.current) list.current.scrollTop = list.current.scrollHeight; }, [lines, open]);
  useEffect(() => { if (open) { seen.current = lines.length; setUnread(0); } else setUnread(lines.length - seen.current); }, [lines, open]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const typing = document.activeElement === input.current;
      if (e.key === 'Enter' && !typing) { e.preventDefault(); if (input.current) input.current.focus(); else { setOpen(true); setTimeout(() => input.current?.focus(), 0); } }
      if (e.key === 'Escape' && typing) input.current?.blur();
    };
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  }, []);
  const submit = () => { if (onSend(text)) setText(''); };

  if (!open) return (
    <button onClick={() => { setOpen(true); setTimeout(() => input.current?.focus(), 0); }}
      className="absolute z-30 right-4 top-[150px] md:top-auto md:right-auto md:left-4 md:bottom-6 flex items-center gap-2 rounded-full bg-black/70 backdrop-blur border border-white/10 px-4 py-2 text-sm font-bold">
      <MessageCircle size={16} className="text-gold" /> Chat{unread > 0 && <span className="rounded-full bg-gold text-black text-[11px] px-1.5">{unread}</span>}
    </button>
  );
  return (
    <div className="absolute z-30 left-4 right-4 top-[150px] md:top-auto md:right-auto md:bottom-6 md:w-[340px] rounded-2xl bg-black/75 backdrop-blur border border-white/10 flex flex-col">
      <div className="flex items-center justify-between px-3 pt-2.5 pb-1.5">
        <span className="text-[11px] uppercase tracking-widest font-bold text-gold">Trò chuyện</span>
        <button onClick={() => setOpen(false)} aria-label="Thu gọn chat" className="text-white/50 hover:text-white"><X size={16} /></button>
      </div>
      <div ref={list} className="max-h-[22svh] md:max-h-[200px] overflow-y-auto px-3 space-y-1 text-[13px] leading-snug">
        {lines.length === 0 && <div className="text-white/35 text-xs py-1">Chưa có tin nhắn. Chào mọi người một câu nhé!</div>}
        {lines.map((l, i) => (
          <div key={i} className="break-words"><b className={l.mine ? 'text-gold' : 'text-white/90'}>{l.name}:</b> <span className="text-white/80">{l.text}</span></div>
        ))}
      </div>
      <form className="flex gap-2 p-2.5" onSubmit={e => { e.preventDefault(); submit(); }}>
        <input ref={input} value={text} maxLength={MAX_CHAT} onChange={e => setText(e.target.value)} placeholder="Nhập tin nhắn…"
          className="flex-1 min-w-0 rounded-full bg-white/10 border border-white/10 focus:border-gold outline-none px-3 py-2 text-sm" />
        <button type="submit" aria-label="Gửi" className="shrink-0 w-9 h-9 rounded-full bg-gold text-black flex items-center justify-center"><Send size={15} /></button>
      </form>
    </div>
  );
}

/** Cần điều khiển ảo + nút nhảy (chỉ hiện trên màn hình cảm ứng) */
export function TouchControls({ touch, firstPerson, onView }: { touch: React.MutableRefObject<TouchInput>; firstPerson?: boolean; onView?: () => void }) {
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
      <div ref={base} className="absolute z-30 left-6 bottom-8 w-28 h-28 rounded-full bg-white/10 border border-white/20 backdrop-blur touch-none"
        onPointerDown={e => { e.stopPropagation(); active.current = e.pointerId; (e.target as HTMLElement).setPointerCapture(e.pointerId); move(e); }}
        onPointerMove={move} onPointerUp={end} onPointerCancel={end}>
        <div className="absolute left-1/2 top-1/2 w-12 h-12 -ml-6 -mt-6 rounded-full bg-gold/80" style={{ transform: `translate(${knob[0]}px, ${knob[1]}px)` }} />
      </div>
      <button className="absolute z-30 right-6 bottom-10 w-20 h-20 rounded-full bg-gold text-black font-bold touch-none select-none"
        onPointerDown={e => { e.stopPropagation(); touch.current.jump = true; }} onPointerUp={() => (touch.current.jump = false)} onPointerCancel={() => (touch.current.jump = false)}>
        Nhảy
      </button>
      {onView && (
        <button aria-label={firstPerson ? 'Chuyển sang góc nhìn thứ 3' : 'Chuyển sang góc nhìn thứ 1'}
          className="absolute z-30 right-8 bottom-[205px] w-14 h-14 rounded-full bg-black/70 backdrop-blur border border-gold/50 text-white text-[11px] font-bold leading-tight flex flex-col items-center justify-center touch-none select-none"
          onPointerDown={e => { e.stopPropagation(); onView(); }}>
          <Eye size={16} className="text-gold" />{firstPerson ? 'Thứ 1' : 'Thứ 3'}
        </button>
      )}
    </>
  );
}

/** Chọn khu vực trên khán đài để đến (khu ghế thì ngồi luôn) */
export function ZonePicker({ open, onToggle, onPick }: { open: boolean; onToggle: () => void; onPick: (z: Zone) => void }) {
  return (
    <div className="absolute z-30 right-4 top-[250px] md:top-[190px] flex flex-col items-end gap-2">
      <button onClick={onToggle} className="flex items-center gap-1.5 bg-black/70 backdrop-blur border border-white/10 hover:border-gold/60 px-3 py-1.5 rounded-full text-xs font-bold">
        <MapPin size={14} className="text-gold" /> Chọn khu vực
      </button>
      {open && (
        <div className="w-[260px] rounded-2xl bg-black/85 backdrop-blur border border-white/10 p-2">
          {(['seat', 'stand'] as const).map(k => (
            <div key={k}>
              <div className="text-white/40 uppercase tracking-widest text-[10px] font-bold px-2 pt-1.5 pb-1">{k === 'seat' ? 'Ghế ngồi (ngồi luôn)' : 'Khu đứng'}</div>
              {ZONES.filter(z => z.kind === k).map(z => (
                <button key={z.id} onClick={() => onPick(z)} className="w-full flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-white/10 text-left text-sm">
                  <span className={`w-3 h-3 shrink-0 ${k === 'stand' ? 'rounded-full' : 'rounded-sm'}`} style={{ background: z.color }} />{z.name}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
