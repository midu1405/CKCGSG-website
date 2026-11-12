import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type * as THREE from 'three';
import { Link } from 'react-router-dom';
import { Users, Handshake, Eye, Maximize2, ArrowUpFromLine, Theater, Mail, X, Info, Sun, Moon, Footprints, ArrowRight } from 'lucide-react';
import StageScene, { type Mode, type SceneHandle } from '../components/stage/StageScene';
import { ZONES, SPONSOR, TOTAL_SEATS, TOTAL_STANDING, STAND_DENSITY, zoneCount, nearestChair, zoneSpot, type Zone } from '../components/stage/data';
import STAGE_DESIGN from '../assets/photos/stage-design.jpg';
import MapTabs from '../components/MapTabs';
import LedControls from '../components/stage/LedControls';
import { usePresence } from '../components/walk/presence';
import { JoinDialog, WalkHud, TouchControls, EmoteBar, ChatPanel, ZonePicker } from '../components/walk/WalkUI';
import { CAMPUS_WORLD, type Me, type TouchInput, type EmoteState, type World, type SeatCmd } from '../components/walk/Walker';
import { CHAPEL } from '../components/chapel/ChapelExterior';
import { nearExit, nearestSeat } from '../components/chapel/ChapelInterior';
import { usePrayer } from '../components/chapel/prayer';
import { Organ } from '../components/chapel/organ';
import { ChapelBar, DoorPrompt, SeatPrompt, IntentionDialog, BoardDialog, Toast } from '../components/chapel/ChapelUI';

/** chỗ đứng khi vừa bước ra khỏi Nhà nguyện, quay lưng lại cửa */
const OUTSIDE_WORLD: World = (() => {
  const [ox, oy] = CHAPEL.outside, [dx, dy] = CHAPEL.door;
  return { ...CAMPUS_WORLD, spawn: { p: [ox, 0, -oy], yaw: Math.atan2(ox - dx, -(oy - dy)) } };
})();

const fmt = (n: number) => n.toLocaleString('vi-VN');

/** Gợi ý thao tác cảm ứng (chỉ hiện dưới md): ẩn sau lần chạm đầu hoặc sau 6 giây. */
function useTouchHint() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const hide = () => setShow(false);
    const t = window.setTimeout(hide, 6000);
    window.addEventListener('pointerdown', hide, { once: true, capture: true });
    return () => { window.clearTimeout(t); window.removeEventListener('pointerdown', hide, { capture: true }); };
  }, []);
  return show;
}

/** nút điều khiển: cao 44px trên điện thoại (vùng bấm), giữ cỡ cũ từ md */
const ctl = 'flex items-center gap-1.5 shrink-0 whitespace-nowrap px-3 py-1.5 max-md:min-h-11 rounded-full text-xs font-bold';

export default function StageMapPage() {
  const scene = useRef<SceneHandle>(null);
  const [mode, setMode] = useState<Mode>('audience');
  const [night, setNight] = useState(false);
  const [joining, setJoining] = useState(false);
  const [walkMe, setWalkMe] = useState<Me | null>(null);
  const touch = useRef<TouchInput>({ x: 0, y: 0, jump: false });
  const emote = useRef<EmoteState>({ id: '', k: 0, t0: 0 });
  const [place, setPlace] = useState<'campus' | 'chapel'>('campus');
  const [campusWorld, setCampusWorld] = useState<World>(CAMPUS_WORLD);
  const [near, setNear] = useState(false);
  const nearRef = useRef(false);
  const [music, setMusic] = useState(true);
  const organ = useRef<Organ | null>(null);
  const [dialog, setDialog] = useState<'write' | 'board' | null>(null);
  const [toast, setToast] = useState('');
  const wantChapel = useRef(false);
  const seat = useRef<SeatCmd>({ want: null, stand: false, sitting: false, back: null });
  const seatSpot = useRef<{ x: number; y: number; z: number; face: number } | null>(null);
  const [picker, setPicker] = useState(false);
  const [fp, setFp] = useState(false);
  const fpRef = useRef(false);
  const toggleView = useCallback(() => setFp(v => { fpRef.current = !v; return !v; }), []);
  const pendingZone = useRef<Zone | null>(null);
  const goZoneRef = useRef<(z: Zone) => void>(() => {});
  const [seatUi, setSeatUi] = useState<'none' | 'sit' | 'stand'>('none');
  const inChapel = !!walkMe && place === 'chapel';
  const { net, ids, count, status, chat, sendChat } = usePresence(!!walkMe, walkMe?.name ?? '', inChapel ? 'nha-nguyen-v1' : undefined);
  const prayer = usePrayer(inChapel);
  const touchHint = useTouchHint();

  const say = (t: string) => { setToast(t); window.setTimeout(() => setToast(x => (x === t ? '' : x)), 3200); };
  const enterChapel = useCallback(() => {
    nearRef.current = false; setNear(false); setPlace('chapel');
    if (music) { organ.current ??= new Organ(); organ.current.start(); }
  }, [music]);
  const exitChapel = useCallback(() => {
    nearRef.current = false; setNear(false); setPlace('campus'); setCampusWorld(OUTSIDE_WORLD); setDialog(null);
    organ.current?.stop();
  }, []);
  const leaveWalk = () => { organ.current?.stop(); setPlace('campus'); setCampusWorld(CAMPUS_WORLD); setDialog(null); setNear(false); nearRef.current = false; setWalkMe(null); };
  const onChapel = () => { if (walkMe) enterChapel(); else { wantChapel.current = true; setJoining(true); } };
  const onMove = useCallback((p: THREE.Vector3) => {
    const n = place === 'chapel' ? nearExit(p) : Math.hypot(p.x - CHAPEL.door[0], -p.z - CHAPEL.door[1]) < 4.5;
    if (n !== nearRef.current) { nearRef.current = n; setNear(n); }
    if (pendingZone.current) { const z = pendingZone.current; pendingZone.current = null; goZoneRef.current(z); }
    // ghế trống gần nhất (bỏ qua chỗ người khác đang ngồi)
    let ui: 'none' | 'sit' | 'stand' = 'none';
    if (seat.current.sitting) ui = 'stand';
    else {
      const taken = [...net.peers.current.values()].filter(q => q.s === 1).map(q => ({ x: q.x, z: q.z }));
      seatSpot.current = place === 'chapel' ? nearestSeat(p, taken) : (() => { const c = nearestChair(p, taken); return c ? { ...c, here: true } : null; })();
      if (seatSpot.current) ui = 'sit';
    }
    setSeatUi(u => (u === ui ? u : ui));
  }, [place, net]);
  const sitOrStand = useCallback(() => {
    if (seat.current.sitting) seat.current.stand = true;
    else if (seatSpot.current) seat.current.want = seatSpot.current;
  }, []);
  /** đến một khu trên khán đài (khu ghế: ngồi luôn vào ghế trống gần tâm khu) */
  const goZone = useCallback((z: Zone) => {
    setPicker(false);
    const taken = [...net.peers.current.values()].filter(q => q.s === 1).map(q => ({ x: q.x, z: q.z }));
    const r = zoneSpot(z, taken); if (!r) { say('Khu này tạm hết chỗ trống.'); return; }
    if (r.sit) seat.current.want = { ...r.spot, here: true }; else seat.current.goto = r.spot;
    say(r.sit ? `Bạn đã ngồi ở khu ${z.short}` : `Bạn đã đến ${z.short}`);
  }, [net]);
  goZoneRef.current = goZone;
  const doCandle = useCallback(async () => {
    const ok = await prayer.lightCandle();
    say(ok ? 'Bạn đã thắp một ngọn nến. Xin Chúa nhậm lời.' : (prayer.error || 'Chưa thắp được nến, xin thử lại.'));
  }, [prayer]);
  const toggleMusic = () => setMusic(m => {
    const next = !m; organ.current ??= new Organ();
    if (next && place === 'chapel') organ.current.start(); else organ.current.stop();
    return next;
  });
  useEffect(() => () => organ.current?.stop(), []);
  // trang sơ đồ chiếm trọn màn hình: khoá cuộn trang để kéo xoay góc nhìn trên điện thoại không làm trang trôi
  useEffect(() => {
    const h = document.documentElement, b = document.body;
    const prev = [h.style.overflow, b.style.overflow, h.style.overscrollBehavior, b.style.overscrollBehavior];
    h.style.overflow = b.style.overflow = 'hidden'; h.style.overscrollBehavior = b.style.overscrollBehavior = 'none';
    window.scrollTo(0, 0);
    return () => { [h.style.overflow, b.style.overflow, h.style.overscrollBehavior, b.style.overscrollBehavior] = prev; };
  }, []);
  // phím E: vào / ra Nhà nguyện khi đứng gần cửa
  useEffect(() => {
    if (!walkMe) return;
    const k = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null; if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
      if (e.key.toLowerCase() === 'e' && nearRef.current) (place === 'chapel' ? exitChapel : enterChapel)();
      if (e.key.toLowerCase() === 'f') sitOrStand();
      if (e.key.toLowerCase() === 'v' && !e.repeat) toggleView();
    };
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  }, [walkMe, place, enterChapel, exitChapel, sitOrStand, toggleView]);

  const walk = useMemo(() => (walkMe ? {
    me: walkMe, net, ids, touch, emote, place, world: campusWorld, onMove, seat, firstPerson: fpRef,
    chapel: { candles: prayer.stats.candlesToday, notes: prayer.stats.notes, onCandle: doCandle, onBoard: () => setDialog('board') },
  } : null), [walkMe, net, ids, place, campusWorld, onMove, prayer.stats, doCandle]);
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
      <div className="absolute inset-0 top-[72px] isolate touch-none select-none" style={{ transform: 'translateZ(0)' }}>
        <Suspense fallback={<div className="h-full flex items-center justify-center text-white/50">Đang dựng sân khấu…</div>}>
          <StageScene ref={scene} mode={mode} night={night} walk={walk} onChapel={onChapel} selZone={zone} selItem={item} onPickZone={pickZone} onPickItem={pickItem} />
        </Suspense>
      </div>

      {walkMe && <>
        <WalkHud count={count} status={status} onExit={leaveWalk} where={inChapel ? 'trong Nhà nguyện' : 'đang dạo'} firstPerson={fp} onView={toggleView} />
        {!inChapel && <LedControls className="absolute z-30 right-4 top-[200px] md:top-[140px]" />}
        {inChapel
          ? <ChapelBar stats={prayer.stats} music={music} onMusic={toggleMusic} onCandle={doCandle}
              onPray={() => { emote.current = { id: 'pray', k: emote.current.k + 1, t0: -1 }; }}
              onWrite={() => { prayer.setError(''); setDialog('write'); }} onBoard={() => setDialog('board')} onExit={exitChapel} />
          : <EmoteBar emote={emote} />}
        {seatUi !== 'none' && !near && <SeatPrompt sitting={seatUi === 'stand'} onGo={sitOrStand} />}
        {!inChapel && <ZonePicker open={picker} onToggle={() => setPicker(o => !o)} onPick={goZone} />}
        {near && <DoorPrompt label={inChapel ? 'Ra ngoài' : 'Vào Nhà nguyện'} onGo={inChapel ? exitChapel : enterChapel} />}
        <ChatPanel lines={chat} onSend={sendChat} /><TouchControls touch={touch} firstPerson={fp} onView={toggleView} />
        {toast && <Toast text={toast} />}
        {dialog === 'write' && <IntentionDialog list={prayer.list} mine={prayer.mine} error={prayer.error} onPray={prayer.pray} onClose={() => setDialog(null)} />}
        {dialog === 'board' && <BoardDialog list={prayer.list} mine={prayer.mine} onClose={() => setDialog(null)} onWrite={() => { prayer.setError(''); setDialog('write'); }} />}
      </>}
      {joining && <JoinDialog onClose={() => { setJoining(false); wantChapel.current = false; }} onJoin={(m, z) => {
        setJoining(false); setPanelOpen(false); setWalkMe(m);
        if (wantChapel.current) { wantChapel.current = false; enterChapel(); }
        else if (z) pendingZone.current = z;
      }} />}

      {/* Tiêu đề + điều khiển */}
      {!walkMe && <div className="absolute z-20 top-[88px] left-4 right-4 md:right-auto md:max-w-[560px] pointer-events-none">
        <div className="pointer-events-auto">
          <div className="mb-2"><MapTabs active="stage" /></div>
          {/* nền mờ sau tiêu đề: đọc được cả khi nằm trên mái nhà sáng màu */}
          <div className="w-fit max-w-full bg-black/60 backdrop-blur-sm rounded-2xl px-3 py-2 mb-3">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-gold uppercase tracking-[0.25em] text-[10px] font-bold whitespace-nowrap">Đắc Lộ · 04.06.2027</span>
              <span className="bg-white/10 text-white/70 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">Bản dự kiến</span>
            </div>
            <h1 className="serif text-3xl md:text-4xl font-bold leading-tight text-balance">Sơ đồ sân khấu 3D</h1>
          </div>
          <div className="inline-flex bg-black/70 backdrop-blur border border-white/10 rounded-full p-1 mb-3">
            {([['audience', 'Khán giả', Users], ['sponsor', 'Nhà tài trợ', Handshake]] as const).map(([m, label, Icon]) => (
              <button key={m} onClick={() => switchMode(m)}
                className={`flex items-center gap-2 px-4 py-2 max-md:min-h-11 rounded-full text-sm font-bold transition-all ${mode === m ? 'bg-gold text-black' : 'text-white/70 hover:text-white'}`}>
                <Icon size={16} /> {label}
              </button>
            ))}
          </div>
          {/* điện thoại: một hàng vuốt ngang để khối nút không che nửa màn hình; từ md: xuống dòng như cũ */}
          <div className="flex gap-2 max-md:-mx-4 max-md:px-4 max-md:overflow-x-auto max-md:[scrollbar-width:none] md:flex-wrap">
            {([['overview', 'Toàn cảnh', Maximize2], ['top', 'Nhìn từ trên', ArrowUpFromLine], ['stage', 'Từ sân khấu', Theater]] as const).map(([k, label, Icon]) => (
              <button key={k} onClick={() => scene.current?.preset(k)}
                className={`${ctl} bg-black/70 backdrop-blur border border-white/10 hover:border-gold/60`}>
                <Icon size={14} className="text-gold" /> {label}
              </button>
            ))}
            <button onClick={() => setJoining(true)}
              className={`${ctl} bg-gold text-black shadow-lg`}>
              <Footprints size={14} /> Dạo khuôn viên
            </button>
            <LedControls className="shrink-0" />
            <button onClick={() => setNight(n => !n)}
              className={`${ctl} bg-black/70 backdrop-blur border border-white/10 hover:border-gold/60`}>
              {night ? <Sun size={14} className="text-gold" /> : <Moon size={14} className="text-gold" />} {night ? 'Ban ngày' : 'Đêm diễn'}
            </button>
          </div>
          {touchHint && (
            <p className="md:hidden mt-2 w-fit bg-black/70 backdrop-blur-sm rounded-2xl px-3 py-1.5 text-xs text-white/90 pointer-events-none">
              Vuốt để xoay · chụm hai ngón để phóng to · chạm vào khu để xem
            </p>
          )}
        </div>
      </div>}

      {!walkMe && <div className="hidden md:block absolute bottom-4 left-4 bg-black/60 rounded-full px-3 py-1 text-white/75 text-xs pointer-events-none">
        Kéo để xoay · cuộn để phóng to · chuột phải để di chuyển · bấm vào khu để xem
      </div>}

      {/* Bảng thông tin */}
      {!walkMe && !panelOpen && (
        <button onClick={() => setPanelOpen(true)} className="absolute z-30 bottom-4 right-4 md:top-[88px] md:bottom-auto bg-gold text-black rounded-full px-4 py-2 max-md:min-h-11 font-bold text-sm flex items-center gap-2">
          <Info size={16} /> {mode === 'audience' ? 'Các khu' : 'Hạng mục'}
        </button>
      )}
      {!walkMe && panelOpen && (
        <aside className="absolute z-30 left-0 right-0 bottom-0 max-h-[46svh] md:max-h-none md:left-auto md:right-4 md:top-[88px] md:bottom-4 md:w-[360px] bg-black/85 backdrop-blur-md border border-white/10 rounded-t-3xl md:rounded-3xl overflow-y-auto">
          <div className="sticky top-0 bg-black/90 backdrop-blur px-5 pt-4 pb-3 border-b border-white/10 flex items-center justify-between">
            <div className="text-gold uppercase tracking-[0.2em] text-[11px] font-bold">
              {mode === 'audience' ? `~${fmt(TOTAL_SEATS)} ghế · ~${fmt(TOTAL_STANDING)} chỗ đứng` : 'Hạng mục cần đồng hành'}
            </div>
            <button onClick={() => setPanelOpen(false)} aria-label="Thu gọn" className="-my-3 -mr-3 w-11 h-11 shrink-0 flex items-center justify-center text-white/50 hover:text-white"><X size={18} /></button>
          </div>

          <div className="p-5 space-y-4">
            {mode === 'audience' && zone && (
              <div className="rounded-2xl border border-gold/40 bg-gold/10 p-4">
                <div className="flex items-center gap-2 mb-1"><span className="w-3 h-3 rounded-sm" style={{ background: zone.color }} /><span className="font-bold serif text-lg">{zone.name}</span></div>
                <div className="text-gold text-sm font-bold mb-2">{zone.kind === 'stand' ? `Khu đứng · ~${fmt(zone.area!.s[0] * zone.area!.s[1])} m² · khoảng ${fmt(zoneCount(zone))} người (dự kiến)` : `Ghế ngồi · khoảng ${fmt(zoneCount(zone))} chỗ`}</div>
                <p className="text-white/65 text-sm leading-relaxed mb-3">{zone.desc}</p>
                <button onClick={() => scene.current?.seatView(zone)} className="w-full flex items-center justify-center gap-2 bg-gold text-black rounded-full py-2.5 font-bold text-sm">
                  <Eye size={16} /> {zone.kind === 'stand' ? 'Xem từ khu đứng này' : 'Xem từ chỗ ngồi này'}
                </button>
              </div>
            )}

            {mode === 'audience' && (
              <ul className="space-y-1">
                {ZONES.map((z, i) => (
                  <li key={z.id}>
                    {(i === 0 || ZONES[i - 1].kind !== z.kind) && (
                      <div className="text-white/40 uppercase tracking-widest text-[10px] font-bold px-3 pt-2 pb-1">{z.kind === 'seat' ? 'Ghế ngồi trước sân khấu' : 'Khu đứng'}</div>
                    )}
                    <button onClick={() => pickZone(z)}
                      className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${zone?.id === z.id ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                      <span className="flex items-center gap-3"><span className={`w-3 h-3 shrink-0 ${z.kind === 'stand' ? 'rounded-full' : 'rounded-sm'}`} style={{ background: z.color }} /><span className="text-sm">{z.name}</span></span>
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
                <Link to="/dac-lo#cong-tac" className="flex items-center justify-center gap-2 text-gold text-sm font-bold border border-gold/50 rounded-full py-2.5 hover:bg-gold hover:text-black transition-all">
                  Xem lời mời cộng tác <ArrowRight size={16} aria-hidden />
                </Link>
              </>
            )}

            <p className="text-[11px] leading-relaxed text-white/40 border-t border-white/10 pt-3">
              Sơ đồ minh hoạ, chưa phải mặt bằng chính thức. Sân khấu dựng theo phối cảnh thiết kế của ekip, đặt ở khoảng sân giữa toà nhà
              bên trái và Nhà nguyện cổ; khu đứng, nhà vệ sinh và bãi giữ xe (sân lớn, sân trước) theo vị trí Ban tổ chức khoanh. Vị trí, hình khối toà nhà và
              đường lấy từ OpenStreetMap (© OpenStreetMap contributors); màu tường, mái, cửa sổ, cây xanh và phố xung quanh là minh hoạ. Sức chứa khu đứng tính theo {STAND_DENSITY} người/m² — tổng khoảng{' '}
              {fmt(TOTAL_SEATS + TOTAL_STANDING)} khán giả tại chỗ; số chỗ sẽ cập nhật khi có sơ đồ chính thức.
            </p>
          </div>
        </aside>
      )}
    </div>
  );
}
