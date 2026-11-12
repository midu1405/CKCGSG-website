/** Nút điều khiển màn LED: bật/tắt tiếng, chuyển clip */
import { useState } from 'react';
import { Volume2, VolumeX, SkipForward, Tv } from 'lucide-react';
import { ledCommand } from './LedVideo';

export default function LedControls({ className = '' }: { className?: string }) {
  const [sound, setSound] = useState(false);
  const btn = 'flex items-center gap-1.5 px-3 py-1.5 min-h-11 md:min-h-0 rounded-full text-xs font-bold hover:bg-white/10';
  return (
    <div className={`flex items-center gap-0.5 bg-black/70 backdrop-blur border border-white/10 rounded-full p-0.5 ${className}`}>
      <span className="flex items-center gap-1.5 pl-2.5 pr-1 text-[11px] font-bold text-white/60"><Tv size={14} className="text-gold" /> Màn LED</span>
      <button className={btn} onClick={() => { ledCommand(sound ? 'mute' : 'unmute'); setSound(!sound); }}>
        {sound ? <Volume2 size={14} className="text-gold" /> : <VolumeX size={14} />} {sound ? 'Tắt tiếng' : 'Bật tiếng'}
      </button>
      <button className={btn} onClick={() => ledCommand('next')} aria-label="Clip tiếp theo"><SkipForward size={14} /> Clip tiếp</button>
    </div>
  );
}
