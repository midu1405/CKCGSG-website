import { Suspense, useRef, useState } from 'react';
import { Map as MapIcon, Box, Crosshair, Copy, Check, X, Info, Satellite, Navigation } from 'lucide-react';
import MapTabs from '../components/MapTabs';
import CampusScene, { type CampusHandle } from '../components/campus/CampusScene';
import { BUILDINGS, MARKERS, KIND_STYLE, CAMPUS_AREA, ORIGIN, toLatLon, type Building, type Marker, type XY } from '../components/campus/data';

const fmt = (n: number) => n.toLocaleString('vi-VN');
const ll = (p: XY) => toLatLon(p).map(v => v.toFixed(6)).join(',');
const SAT_URL = `https://www.google.com/maps/@${ORIGIN[0].toFixed(5)},${ORIGIN[1].toFixed(5)},260m/data=!3m1!1e3`;

export default function CampusMapPage() {
  const scene = useRef<CampusHandle>(null);
  const [sel, setSel] = useState<{ type: 'b'; b: Building } | { type: 'm'; m: Marker } | null>(null);
  const [view, setView] = useState<'top' | '3d'>('top');
  const [pickMode, setPickMode] = useState(false);
  const [picked, setPicked] = useState<XY | null>(null);
  const [copied, setCopied] = useState(false);
  const [panelOpen, setPanelOpen] = useState(() => typeof window === 'undefined' || window.innerWidth >= 768);

  const pickB = (b: Building) => { setSel({ type: 'b', b }); setPanelOpen(true); };
  const pickM = (m: Marker) => { setSel({ type: 'm', m }); setPanelOpen(true); scene.current?.focus(m.pos, m.size ? 150 : 90); setView('3d'); };
  const setV = (v: 'top' | '3d') => { setView(v); v === 'top' ? scene.current?.top() : scene.current?.perspective(); };
  const copyPoint = async () => {
    if (!picked) return;
    const line = `{ id: 'diem-moi', kind: 'parking', label: 'Tên điểm', pos: [${picked[0]}, ${picked[1]}], desc: '' },  // ${ll(picked)}`;
    try { await navigator.clipboard.writeText(line); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* trình duyệt chặn */ }
  };

  const named = BUILDINGS.filter(b => b.name);

  return (
    <div className="relative h-[100svh] pt-[72px] overflow-hidden bg-dark">
      <div className="absolute inset-0 top-[72px]">
        <Suspense fallback={<div className="h-full flex items-center justify-center text-white/50">Đang dựng bản đồ…</div>}>
          <CampusScene ref={scene} sel={sel} onPickBuilding={pickB} onPickMarker={pickM}
            pickMode={pickMode} onPickPoint={p => { setPicked(p); setPanelOpen(true); }} picked={pickMode ? picked : null} />
        </Suspense>
      </div>

      {/* Tiêu đề + điều khiển */}
      <div className="absolute z-20 top-[88px] left-4 right-4 md:right-auto md:max-w-[560px] pointer-events-none">
        <div className="pointer-events-auto">
          <div className="mb-2"><MapTabs active="campus" /></div>
          <div className="text-gold uppercase tracking-[0.25em] text-[10px] font-bold mb-1">Số 6 Tôn Đức Thắng · Quận 1</div>
          <h1 className="serif text-2xl md:text-4xl font-bold leading-tight mb-3">Khuôn viên Trung Tâm Mục Vụ<br className="hidden md:block" /> & Đại Chủng Viện Thánh Giuse</h1>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setV('top')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${view === 'top' ? 'bg-gold text-black border-gold' : 'bg-black/70 border-white/10'}`}><MapIcon size={14} /> Sơ đồ</button>
            <button onClick={() => setV('3d')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${view === '3d' ? 'bg-gold text-black border-gold' : 'bg-black/70 border-white/10'}`}><Box size={14} /> 3D</button>
            <a href={SAT_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-black/70 border border-white/10 hover:border-gold/60 px-3 py-1.5 rounded-full text-xs font-bold"><Satellite size={14} className="text-gold" /> Ảnh vệ tinh (Google Maps)</a>
            <button onClick={() => { setPickMode(m => !m); setPicked(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${pickMode ? 'bg-[#ff5a5a] text-black border-[#ff5a5a]' : 'bg-black/70 border-white/10'}`}>
              <Crosshair size={14} /> {pickMode ? 'Đang đánh dấu — bấm lên bản đồ' : 'Chế độ đánh dấu'}
            </button>
          </div>
        </div>
      </div>

      {view === 'top' && (
        <div className="absolute z-20 left-4 md:left-auto md:right-[396px] bottom-24 md:bottom-auto md:top-[88px] w-11 h-11 rounded-full bg-black/70 border border-white/15 flex flex-col items-center justify-center text-[10px] font-bold pointer-events-none" aria-label="Hướng Bắc">
          <span className="text-gold leading-none">▲</span><span>B</span>
        </div>
      )}
      <div className="hidden md:block absolute bottom-4 left-4 text-white/40 text-[11px] pointer-events-none max-w-md">
        Dữ liệu bản đồ © <span className="underline">OpenStreetMap</span> contributors (ODbL). Chiều cao toà nhà và vị trí có dấu * là ước lượng.
      </div>

      {!panelOpen && (
        <button onClick={() => setPanelOpen(true)} className="absolute z-30 bottom-4 right-4 md:top-[88px] md:bottom-auto bg-gold text-black rounded-full px-4 py-2 font-bold text-sm flex items-center gap-2">
          <Info size={16} /> Chú thích
        </button>
      )}
      {panelOpen && (
        <aside className="absolute z-30 left-0 right-0 bottom-0 max-h-[46svh] md:max-h-none md:left-auto md:right-4 md:top-[88px] md:bottom-4 md:w-[360px] bg-black/85 backdrop-blur-md border border-white/10 rounded-t-3xl md:rounded-3xl overflow-y-auto">
          <div className="sticky top-0 bg-black/90 backdrop-blur px-5 pt-4 pb-3 border-b border-white/10 flex items-center justify-between">
            <div className="text-gold uppercase tracking-[0.2em] text-[11px] font-bold">Khuôn viên · ~{(CAMPUS_AREA / 10000).toFixed(1).replace('.', ',')} ha</div>
            <button onClick={() => setPanelOpen(false)} aria-label="Thu gọn" className="text-white/50 hover:text-white"><X size={18} /></button>
          </div>
          <div className="p-5 space-y-5">
            {pickMode && (
              <div className="rounded-2xl border border-[#ff5a5a]/50 bg-[#ff5a5a]/10 p-4 text-sm">
                <div className="font-bold mb-1">Chế độ đánh dấu</div>
                {picked ? (
                  <>
                    <div className="text-white/70 mb-1">Toạ độ: <b className="text-white tabular-nums">{picked[0]}, {picked[1]}</b> (m)</div>
                    <div className="text-white/50 text-xs mb-3 tabular-nums">GPS: {ll(picked)}</div>
                    <button onClick={copyPoint} className="w-full flex items-center justify-center gap-2 bg-white text-black rounded-full py-2 font-bold text-xs">
                      {copied ? <><Check size={14} /> Đã sao chép</> : <><Copy size={14} /> Sao chép dòng thêm điểm</>}
                    </button>
                    <p className="text-white/45 text-[11px] mt-2 leading-relaxed">Dán vào MARKERS trong <code>src/components/campus/data.ts</code> (hoặc gửi cho người phụ trách web) để thêm bãi xe, cổng…</p>
                  </>
                ) : <div className="text-white/60">Bấm vào một vị trí bất kỳ trên bản đồ để lấy toạ độ.</div>}
              </div>
            )}

            {sel && (
              <div className="rounded-2xl border border-gold/40 bg-gold/10 p-4">
                {sel.type === 'b' ? (
                  <>
                    <div className="font-bold serif text-lg">{sel.b.name ?? 'Toà nhà'}</div>
                    {sel.b.note && <div className="text-white/60 text-sm mt-1">{sel.b.note}</div>}
                    <div className="text-white/50 text-xs mt-2">Diện tích mặt bằng ~{fmt(sel.b.area)} m²{!sel.b.name && ' · chưa có tên trên bản đồ'}</div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm" style={{ background: KIND_STYLE[sel.m.kind].color }} /><span className="font-bold serif text-lg">{sel.m.label}</span></div>
                    <div className="text-xs text-white/45 mb-2">{KIND_STYLE[sel.m.kind].name}{sel.m.estimate ? ' · vị trí ước lượng' : ''}</div>
                    <p className="text-white/65 text-sm leading-relaxed mb-3">{sel.m.desc}</p>
                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${ll(sel.m.pos)}`} target="_blank" rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-gold text-black rounded-full py-2.5 font-bold text-sm">
                      <Navigation size={16} /> Chỉ đường tới đây
                    </a>
                  </>
                )}
              </div>
            )}

            <div>
              <div className="text-white/40 uppercase tracking-widest text-[10px] font-bold mb-2">Điểm đánh dấu</div>
              <ul className="space-y-1">
                {MARKERS.map(m => (
                  <li key={m.id}>
                    <button onClick={() => pickM(m)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-sm ${sel?.type === 'm' && sel.m.id === m.id ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                      <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: KIND_STYLE[m.kind].color }} />{m.label}{m.estimate ? ' *' : ''}
                    </button>
                  </li>
                ))}
                <li className="px-3 py-2 text-sm text-white/35 flex items-center gap-3"><span className="w-3 h-3 rounded-sm shrink-0" style={{ background: KIND_STYLE.parking.color }} />Bãi giữ xe — chưa cập nhật</li>
              </ul>
            </div>

            <div>
              <div className="text-white/40 uppercase tracking-widest text-[10px] font-bold mb-2">Toà nhà có tên</div>
              <ul className="space-y-1">
                {named.map(b => (
                  <li key={b.i}><button onClick={() => pickB(b)} className={`w-full text-left px-3 py-2 rounded-xl text-sm ${sel?.type === 'b' && sel.b.i === b.i ? 'bg-white/10' : 'hover:bg-white/5'}`}>{b.name}</button></li>
                ))}
              </ul>
            </div>

            <p className="text-[11px] leading-relaxed text-white/40 border-t border-white/10 pt-3">
              Hình dạng khuôn viên, toà nhà và đường lấy từ OpenStreetMap; tên một số toà đối chiếu với ảnh vệ tinh. Bản đồ không có cây xanh và
              đường nội bộ nên diện tích sân là ước tính — cần Ban tổ chức khảo sát và xác nhận trước khi bố trí sân khấu, bãi xe.
            </p>
          </div>
        </aside>
      )}
    </div>
  );
}
