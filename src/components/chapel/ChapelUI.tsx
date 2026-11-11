/** Giao diện bên trong Nhà nguyện: thanh tác vụ cầu nguyện, khung gửi ý, bảng ý cầu nguyện, nút vào/ra cửa */
import { useState } from 'react';
import { DoorOpen, Music, VolumeX, X, Send, Church } from 'lucide-react';
import type { Intention, Stats } from './prayer';

const fmt = (n: number) => n.toLocaleString('vi-VN');

export function DoorPrompt({ label, onGo }: { label: string; onGo: () => void }) {
  return (
    <button onClick={onGo}
      className="absolute z-30 left-1/2 -translate-x-1/2 bottom-[210px] md:bottom-24 flex items-center gap-2 rounded-full bg-gold text-black px-5 py-2.5 font-bold shadow-xl animate-pulse">
      {label.startsWith('Vào') ? <Church size={18} /> : <DoorOpen size={18} />} {label} <span className="hidden md:inline text-xs font-semibold opacity-70">(phím E)</span>
    </button>
  );
}

export function SeatPrompt({ sitting, onGo }: { sitting: boolean; onGo: () => void }) {
  return (
    <button onClick={onGo}
      className={`absolute z-30 left-1/2 -translate-x-1/2 bottom-[210px] md:bottom-24 flex items-center gap-2 rounded-full px-5 py-2.5 font-bold shadow-xl ${sitting ? 'bg-black/75 border border-gold/50 text-gold' : 'bg-gold text-black'}`}>
      <span className="text-lg leading-none">🪑</span> {sitting ? 'Đứng dậy' : 'Ngồi xuống ghế'} <span className="hidden md:inline text-xs font-semibold opacity-70">(phím F)</span>
    </button>
  );
}

export function ChapelBar({ stats, music, onMusic, onCandle, onPray, onWrite, onBoard, onExit }: {
  stats: Stats; music: boolean; onMusic: () => void; onCandle: () => void; onPray: () => void; onWrite: () => void; onBoard: () => void; onExit: () => void;
}) {
  const btn = 'flex items-center gap-1.5 rounded-full px-3 py-1.5 hover:bg-white/10 active:scale-95 transition text-xs font-bold whitespace-nowrap';
  return (
    <div className="absolute z-30 left-1/2 -translate-x-1/2 bottom-[150px] md:bottom-6 max-w-[calc(100vw-24px)] overflow-x-auto flex gap-1 rounded-full bg-black/75 backdrop-blur border border-gold/30 p-1.5">
      <button onClick={onCandle} className={btn}><span className="text-base">🕯</span><span>Thắp nến</span><span className="text-gold">{fmt(stats.candlesToday)}</span></button>
      <button onClick={onPray} className={btn}><span className="text-base">🙏</span><span>Quỳ cầu nguyện</span></button>
      <button onClick={onWrite} className={btn}><span className="text-base">✍️</span><span>Dâng ý</span></button>
      <button onClick={onBoard} className={btn}><span className="text-base">📜</span><span>Bảng ý</span><span className="text-gold">{fmt(stats.notes)}</span></button>
      <button onClick={onMusic} className={btn} aria-label={music ? 'Tắt nhạc' : 'Bật nhạc'}>{music ? <Music size={15} className="text-gold" /> : <VolumeX size={15} />}</button>
      <button onClick={onExit} className={`${btn} bg-gold text-black hover:bg-gold`}><DoorOpen size={15} /> Ra ngoài</button>
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={onClose}>
      <div className="w-full max-w-md max-h-[80svh] flex flex-col rounded-3xl border border-gold/30 bg-[#141414] p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-3">
          <h2 className="serif text-2xl font-bold">{title}</h2>
          <button onClick={onClose} aria-label="Đóng" className="text-white/50 hover:text-white"><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function IntentionDialog({ list, mine, error, onPray, onClose }: { list: Intention[]; mine: number[]; error: string; onPray: (ids: number[]) => Promise<boolean>; onClose: () => void }) {
  const [pick, setPick] = useState<number[]>([]);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const toggle = (id: number) => setPick(p => (p.includes(id) ? p.filter(x => x !== id) : p.length >= 5 ? p : [...p, id]));
  const go = async () => { setBusy(true); const ok = await onPray(pick); setBusy(false); if (ok) setSent(true); };
  return (
    <Modal title="Dâng ý cầu nguyện" onClose={onClose}>
      {sent ? (
        <div className="text-center py-4">
          <div className="text-4xl mb-3">🙏</div>
          <p className="text-white/80 mb-1">Ý cầu nguyện của bạn đã được dâng lên.</p>
          <p className="text-white/50 text-sm mb-5">Bạn đang hiệp ý cùng mọi người trong Nhà nguyện.</p>
          <button onClick={onClose} className="rounded-full bg-gold text-black px-6 py-2.5 font-bold">Amen</button>
        </div>
      ) : <>
        <p className="text-white/55 text-sm mb-3">Chọn ý bạn muốn hiệp lời cầu nguyện (tối đa 5 ý).</p>
        <div className="overflow-y-auto -mx-2 px-2 space-y-2 mb-3">
          {list.length === 0 && <p className="text-white/45 text-sm py-2">Đang tải các ý cầu nguyện…</p>}
          {list.map(it => {
            const on = pick.includes(it.id);
            return (
              <button key={it.id} type="button" onClick={() => toggle(it.id)}
                className={`w-full text-left rounded-xl border px-3 py-2.5 text-sm leading-snug flex gap-2.5 items-start transition ${on ? 'border-gold bg-gold/15 text-white' : 'border-white/12 bg-black/40 text-white/75 hover:border-white/30'}`}>
                <span className={`mt-0.5 w-4 h-4 shrink-0 rounded border flex items-center justify-center text-[10px] ${on ? 'bg-gold border-gold text-black' : 'border-white/30'}`}>{on ? '✓' : ''}</span>
                <span className="flex-1">{it.body}{mine.includes(it.id) && <span className="ml-1.5 text-[10px] text-gold/80">· bạn đã dâng</span>}</span>
              </button>
            );
          })}
        </div>
        {error && <p className="text-[13px] text-amber-300 mb-2">{error}</p>}
        <button onClick={go} disabled={busy || !pick.length}
          className="w-full flex items-center justify-center gap-2 bg-gold text-black rounded-full py-3 font-bold disabled:opacity-40">
          <Send size={16} /> {busy ? 'Đang dâng…' : pick.length ? `Dâng ${pick.length} ý cầu nguyện` : 'Chọn ý cầu nguyện'}
        </button>
      </>}
    </Modal>
  );
}

export function BoardDialog({ list, mine, onClose, onWrite }: { list: Intention[]; mine: number[]; onClose: () => void; onWrite: () => void }) {
  const sorted = [...list].sort((a, b) => b.total - a.total);
  return (
    <Modal title="Bảng ý cầu nguyện" onClose={onClose}>
      <p className="text-white/50 text-sm mb-3">Số người đã cùng hiệp ý cầu nguyện cho từng ý.</p>
      <div className="overflow-y-auto -mx-2 px-2 space-y-2">
        {sorted.length === 0 && <p className="text-white/45 text-sm py-2">Đang tải…</p>}
        {sorted.map(it => (
          <div key={it.id} className="rounded-xl bg-[#fbf6e8] text-[#2a2118] px-3 py-2.5 shadow flex items-center gap-3">
            <p className="flex-1 text-[14px] leading-snug">{it.body}{mine.includes(it.id) && <span className="ml-1 text-[11px] text-[#8b1a1a]">· có bạn</span>}</p>
            <div className="text-right shrink-0">
              <div className="font-bold text-[15px]">🙏 {fmt(it.total)}</div>
              {it.today > 0 && <div className="text-[10px] text-[#7a6a55]">+{fmt(it.today)} hôm nay</div>}
            </div>
          </div>
        ))}
      </div>
      <button onClick={onWrite} className="mt-4 w-full rounded-full border border-gold/60 text-gold py-2.5 font-bold hover:bg-gold hover:text-black transition">🙏 Dâng ý cầu nguyện</button>
    </Modal>
  );
}

export function Toast({ text }: { text: string }) {
  return <div className="absolute z-40 left-1/2 -translate-x-1/2 top-[160px] rounded-full bg-black/80 border border-gold/40 px-5 py-2.5 text-sm font-bold shadow-xl pointer-events-none">{text}</div>;
}
