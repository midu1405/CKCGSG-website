import { Suspense, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Handshake, Eye, Maximize2, ArrowUpFromLine, Theater, Mail, X, Info } from 'lucide-react';
import StageScene, { type Mode, type SceneHandle } from '../components/stage/StageScene';
import { ZONES, SPONSOR, TOTAL_SEATS, zoneCount, type Zone } from '../components/stage/data';
import STAGE_DESIGN from '../assets/photos/stage-design.jpg';
import MapTabs from '../components/MapTabs';

const fmt = (n: number) => n.toLocaleString('vi-VN');

export default function StageMapPage() {
  const scene = useRef<SceneHandle>(null);
  const [mode, setMode] = useState<Mode>('audience');
  const [zone, setZone] = useState<Zone | null>(null);
  const [item, setItem] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(() => typeof window === 'undefined' || window.innerWidth >= 768);
  const sponsor = SPONSOR.find(s => s.id === item) ?? null;

  const pickZone = (z: Zone) => { setMode('audience'); setZone(z); setPanelOpen(true); };
  const pickItem = (id: string) => {
    const s = SPONSOR.find(x => x.id === id)!; setItem(id); setPanelOpen(true);
    scene.current?.flyTo(s.cam, s.focus);
  };
  const switchMode = (m: Mode) => { setMode(m); setZone(null); setItem(null); scene.current?.preset('overview'); };

  return (
    <div className="relative h-[100svh] pt-[72px] overflow-hidden bg-dark">
      {/* Cảnh 3D */}
      <div className="absolute inset-0 top-[72px]">
        <Suspense fallback={<div className="h-full flex items-center justify-center text-white/50">Đang dựng sân khấu…</div>}>
          <StageScene ref={scene} mode={mode} selZone={zone} selItem={item} onPickZone={pickZone} onPickItem={pickItem} />
        </Suspense>
      </div>

      {/* Tiêu đề + điều khiển */}
      <div className="absolute z-20 top-[88px] left-4 right-4 md:right-auto md:max-w-[560px] pointer-events-none">
        <div className="pointer-events-auto">
          <div className="mb-2"><MapTabs active="stage" /></div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-gold uppercase tracking-[0.25em] text-[10px] font-bold">Đắc Lộ · 04.06.2027</span>
            <span className="bg-white/10 text-white/70 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">Bản dự kiến</span>
          </div>
          <h1 className="serif text-3xl md:text-4xl font-bold leading-tight mb-3">Sơ đồ sân khấu 3D</h1>
          <div className="inline-flex bg-black/70 backdrop-blur border border-white/10 rounded-full p-1 mb-3">
            {([['audience', 'Khán giả', Users], ['sponsor', 'Nhà tài trợ', Handshake]] as const).map(([m, label, Icon]) => (
              <button key={m} onClick={() => switchMode(m)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${mode === m ? 'bg-gold text-black' : 'text-white/70 hover:text-white'}`}>
                <Icon size={16} /> {label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {([['overview', 'Toàn cảnh', Maximize2], ['top', 'Nhìn từ trên', ArrowUpFromLine], ['stage', 'Từ sân khấu', Theater]] as const).map(([k, label, Icon]) => (
              <button key={k} onClick={() => scene.current?.preset(k)}
                className="flex items-center gap-1.5 bg-black/70 backdrop-blur border border-white/10 hover:border-gold/60 px-3 py-1.5 rounded-full text-xs font-bold">
                <Icon size={14} className="text-gold" /> {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="hidden md:block absolute bottom-4 left-4 text-white/40 text-xs pointer-events-none">
        Kéo để xoay · cuộn để phóng to · chuột phải để di chuyển · bấm vào khu để xem
      </div>

      {/* Bảng thông tin */}
      {!panelOpen && (
        <button onClick={() => setPanelOpen(true)} className="absolute z-30 bottom-4 right-4 md:top-[88px] md:bottom-auto bg-gold text-black rounded-full px-4 py-2 font-bold text-sm flex items-center gap-2">
          <Info size={16} /> {mode === 'audience' ? 'Các khu' : 'Hạng mục'}
        </button>
      )}
      {panelOpen && (
        <aside className="absolute z-30 left-0 right-0 bottom-0 max-h-[46svh] md:max-h-none md:left-auto md:right-4 md:top-[88px] md:bottom-4 md:w-[360px] bg-black/85 backdrop-blur-md border border-white/10 rounded-t-3xl md:rounded-3xl overflow-y-auto">
          <div className="sticky top-0 bg-black/90 backdrop-blur px-5 pt-4 pb-3 border-b border-white/10 flex items-center justify-between">
            <div className="text-gold uppercase tracking-[0.2em] text-[11px] font-bold">
              {mode === 'audience' ? `Khán đài · khoảng ${fmt(TOTAL_SEATS)} chỗ` : 'Hạng mục cần đồng hành'}
            </div>
            <button onClick={() => setPanelOpen(false)} aria-label="Thu gọn" className="text-white/50 hover:text-white"><X size={18} /></button>
          </div>

          <div className="p-5 space-y-4">
            {mode === 'audience' && zone && (
              <div className="rounded-2xl border border-gold/40 bg-gold/10 p-4">
                <div className="flex items-center gap-2 mb-1"><span className="w-3 h-3 rounded-sm" style={{ background: zone.color }} /><span className="font-bold serif text-lg">{zone.name}</span></div>
                <div className="text-gold text-sm font-bold mb-2">Khoảng {fmt(zoneCount(zone))} chỗ</div>
                <p className="text-white/65 text-sm leading-relaxed mb-3">{zone.desc}</p>
                <button onClick={() => scene.current?.seatView(zone)} className="w-full flex items-center justify-center gap-2 bg-gold text-black rounded-full py-2.5 font-bold text-sm">
                  <Eye size={16} /> Xem từ chỗ ngồi này
                </button>
              </div>
            )}

            {mode === 'audience' && (
              <ul className="space-y-1">
                {ZONES.map(z => (
                  <li key={z.id}>
                    <button onClick={() => pickZone(z)}
                      className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${zone?.id === z.id ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                      <span className="flex items-center gap-3"><span className="w-3 h-3 rounded-sm shrink-0" style={{ background: z.color }} /><span className="text-sm">{z.name}</span></span>
                      <span className="text-white/45 text-xs tabular-nums lining-nums shrink-0">{fmt(zoneCount(z))}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {mode === 'sponsor' && sponsor && (
              <div className="rounded-2xl border border-gold/40 bg-gold/10 p-4">
                <div className="font-bold serif text-lg mb-2">{sponsor.name}</div>
                <p className="text-white/65 text-sm leading-relaxed mb-3">{sponsor.desc}</p>
                <a href={`mailto:ckcgsg@gmail.com?subject=${encodeURIComponent(`[ĐẮC LỘ 2027] Đồng hành hạng mục: ${sponsor.name}`)}`}
                  className="w-full flex items-center justify-center gap-2 bg-gold text-black rounded-full py-2.5 font-bold text-sm">
                  <Mail size={16} /> Đồng hành hạng mục này
                </a>
              </div>
            )}

            {mode === 'sponsor' && (
              <>
                <ul className="space-y-1">
                  {SPONSOR.map(s => (
                    <li key={s.id}>
                      <button onClick={() => pickItem(s.id)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors ${item === s.id ? 'bg-white/10 text-gold font-bold' : 'hover:bg-white/5'}`}>{s.name}</button>
                    </li>
                  ))}
                </ul>
                <figure className="rounded-2xl overflow-hidden border border-white/10">
                  <img src={STAGE_DESIGN} alt="Phối cảnh thiết kế sân khấu Đắc Lộ" className="w-full" loading="lazy" />
                  <figcaption className="text-[11px] text-white/45 px-3 py-2">Phối cảnh thiết kế sân khấu của ekip</figcaption>
                </figure>
                <Link to="/dac-lo#cong-tac" className="block text-center text-gold text-sm font-bold border border-gold/50 rounded-full py-2.5 hover:bg-gold hover:text-black transition-all">
                  Xem lời mời cộng tác →
                </Link>
              </>
            )}

            <p className="text-[11px] leading-relaxed text-white/40 border-t border-white/10 pt-3">
              Sơ đồ minh hoạ, chưa phải mặt bằng chính thức. Sân khấu dựng theo phối cảnh thiết kế của ekip, đặt trên sân trống lớn nhất
              (~64 × 60 m) của khuôn viên Trung Tâm Mục Vụ; toà nhà, Nhà nguyện cổ và đường xung quanh lấy từ OpenStreetMap
              (© OpenStreetMap contributors). Sân này xếp ghế được khoảng {fmt(TOTAL_SEATS)} chỗ — để đạt 6.000 – 7.000 khán giả như
              proposal cần thêm khu đứng hoặc khu xem qua màn LED. Cách chia khu và số chỗ sẽ cập nhật khi có sơ đồ từ Ban tổ chức.
            </p>
          </div>
        </aside>
      )}
    </div>
  );
}
