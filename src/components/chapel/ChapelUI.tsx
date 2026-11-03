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
      <button onClick={onWrite} className={btn}><span className="text-base">✍️</span><span>Gửi ý</span></button>
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

export function IntentionDialog({ defaultName, error, onSubmit, onClose }: { defaultName: string; error: string; onSubmit: (name: string, body: string) => Promise<boolean>; onClose: () => void }) {
  const [anon, setAnon] = useState(true);
  const [name, setName] = useState(defaultName);
  const [body, setBody] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const go = async () => { setBusy(true); const ok = await onSubmit(anon ? '' : name, body); setBusy(false); if (ok) setSent(true); };
  return (
    <Modal title="Gửi ý cầu nguyện" onClose={onClose}>
      {sent ? (
        <div className="text-center py-4">
          <div className="text-4xl mb-3">🙏</div>
          <p className="text-white/80 mb-1">Ý cầu nguyện của bạn đã được gửi.</p>
          <p className="text-white/50 text-sm mb-5">Ý sẽ hiện trên bảng chung sau khi được Ban tổ chức duyệt.</p>
          <button onClick={onClose} className="rounded-full bg-gold text-black px-6 py-2.5 font-bold">Xong</button>
        </div>
      ) : <>
        <p className="text-white/55 text-sm mb-4">Viết điều bạn muốn cầu nguyện — cho gia đình, người thân, người đã khuất, hay cho đêm diễn Đắc Lộ.</p>
        <textarea value={body} maxLength={300} rows={4} autoFocus onChange={e => setBody(e.target.value)} placeholder="Xin Chúa…"
          className="w-full rounded-xl bg-black/50 border border-white/15 focus:border-gold outline-none px-3 py-2.5 mb-1 resize-none" />
        <div className="text-right text-[11px] text-white/35 mb-3">{body.length}/300</div>
        <label className="flex items-center gap-2 text-sm mb-2 cursor-pointer select-none">
          <input type="checkbox" checked={anon} onChange={e => setAnon(e.target.checked)} className="accent-[#D4AF37]" /> Gửi ẩn danh
        </label>
        {!anon && <input value={name} maxLength={40} onChange={e => setName(e.target.value)} placeholder="Tên của bạn"
          className="w-full rounded-xl bg-black/50 border border-white/15 focus:border-gold outline-none px-3 py-2 mb-2 text-sm" />}
        {error && <p className="text-[13px] text-amber-300 mb-2">{error}</p>}
        <button onClick={go} disabled={busy || body.trim().length < 3}
          className="mt-2 w-full flex items-center justify-center gap-2 bg-gold text-black rounded-full py-3 font-bold disabled:opacity-40">
          <Send size={16} /> {busy ? 'Đang gửi…' : 'Gửi ý cầu nguyện'}
        </button>
        <p className="text-[11px] text-white/35 mt-3">Ý cầu nguyện được Ban tổ chức xem trước khi hiện công khai. Xin đừng ghi số điện thoại, địa chỉ hay thông tin riêng tư.</p>
      </>}
    </Modal>
  );
}

export function BoardDialog({ list, pending, onClose, onWrite }: { list: Intention[]; pending: string[]; onClose: () => void; onWrite: () => void }) {
  return (
    <Modal title="Bảng ý cầu nguyện" onClose={onClose}>
      <div className="overflow-y-auto -mx-2 px-2 space-y-2.5">
        {pending.length > 0 && (
          <div className="rounded-xl border border-dashed border-white/20 p-3">
            <div className="text-[11px] uppercase tracking-widest font-bold text-white/40 mb-1.5">Của bạn · đang chờ duyệt</div>
            {pending.map((p, i) => <p key={i} className="text-sm text-white/60 italic">“{p}”</p>)}
          </div>
        )}
        {list.length === 0 && <p className="text-white/45 text-sm py-2">Chưa có ý cầu nguyện nào được duyệt. Hãy là người đầu tiên gửi ý.</p>}
        {list.map(it => (
          <div key={it.id} className="rounded-xl bg-[#fbf6e8] text-[#2a2118] p-3 shadow">
            <p className="text-[14px] leading-relaxed">“{it.body}”</p>
            <p className="text-[11px] text-[#7a6a55] mt-1.5">— {it.name || 'Ẩn danh'} · {new Date(it.created_at).toLocaleDateString('vi-VN')}</p>
          </div>
        ))}
      </div>
      <button onClick={onWrite} className="mt-4 w-full rounded-full border border-gold/60 text-gold py-2.5 font-bold hover:bg-gold hover:text-black transition">✍️ Gửi ý cầu nguyện</button>
    </Modal>
  );
}

export function Toast({ text }: { text: string }) {
  return <div className="absolute z-40 left-1/2 -translate-x-1/2 top-[160px] rounded-full bg-black/80 border border-gold/40 px-5 py-2.5 text-sm font-bold shadow-xl pointer-events-none">{text}</div>;
}
