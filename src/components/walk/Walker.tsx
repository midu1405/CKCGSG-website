/**
 * Chế độ "Dạo khuôn viên": mọi người dùng chung nhân vật "Chiên Con" (chỉ khác tên),
 * đi bằng W A S D / phím mũi tên, Space để nhảy, Shift để chạy, phím 1–5 để làm động tác,
 * kéo chuột để xoay góc nhìn, lăn chuột để lại gần / ra xa. Trên điện thoại dùng cần điều khiển ảo.
 * Va chạm: không đi xuyên toà nhà, không ra khỏi tường rào; nhảy được lên hai tầng sân khấu.
 */
import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { OVER_Z } from '../stage/LedVideo';
import * as THREE from 'three';
import { BUILDINGS, CAMPUS, type XY } from '../campus/data';
import { campusToLocal, toWorld } from '../stage/frame';
import type { Bubble, Net, PlayerState } from './presence';

export type TouchInput = { x: number; y: number; jump: boolean };
/** Lệnh ngồi ghế: trang đặt `want` (chỗ ngồi) hoặc `stand`; Walker báo lại `sitting` */
export type SeatCmd = {
  want: { x: number; y: number; z: number; face: number; here?: boolean } | null;
  /** dịch chuyển tới một điểm (khi chọn khu vực) */
  goto?: { x: number; y: number; z: number; face: number } | null;
  stand: boolean; sitting: boolean; back: [number, number] | null;
};
export type Me = { name: string };
export type EmoteId = 'wave' | 'bow' | 'clap' | 'dance' | 'heart' | 'pray';
export type EmoteState = { id: EmoteId | ''; k: number; t0: number };
export const EMOTES: { id: EmoteId; icon: string; label: string; dur: number }[] = [
  { id: 'wave', icon: '👋', label: 'Vẫy tay', dur: 2.4 },
  { id: 'bow', icon: '🙇', label: 'Cúi chào', dur: 2 },
  { id: 'clap', icon: '👏', label: 'Vỗ tay', dur: 2.4 },
  { id: 'dance', icon: '💃', label: 'Nhảy múa', dur: 4 },
  { id: 'heart', icon: '❤️', label: 'Thả tim', dur: 2.6 },
  { id: 'pray', icon: '🙏', label: 'Cầu nguyện', dur: 8 },
];
const DUR = Object.fromEntries(EMOTES.map(e => [e.id, e.dur])) as Record<EmoteId, number>;

const inPoly = ([x, y]: XY, poly: XY[]) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c; } return c; };
const R = 0.35;
const OFFS: XY[] = [[0, 0], [R, 0], [-R, 0], [0, R], [0, -R]];

/** Độ cao mặt sàn tại điểm (khuôn viên x, y): sân khấu tầng dưới 1 m, tầng trên 2 m */
function floorAt(p: XY) {
  const [x, z] = campusToLocal(p);
  if (x > -10.5 && x < 10.5 && z > -12 && z < -7) return 2;
  if (x > -13 && x < 13 && z > -7 && z < 0) return 1;
  return 0;
}
function free(p: XY) {
  return OFFS.every(([dx, dy]) => { const q: XY = [p[0] + dx, p[1] + dy]; return inPoly(q, CAMPUS) && !BUILDINGS.some(b => inPoly(q, b.pts)); });
}

/** Một "không gian" để đi dạo: khuôn viên hoặc bên trong Nhà nguyện. Toạ độ XY = (x, -z) của three.js */
export type World = {
  spawn: { p: [number, number, number]; yaw: number };
  free: (p: XY) => boolean;
  floorAt: (p: XY) => number;
  /** camera có bị chắn tại điểm này không (để kéo camera lại gần) */
  camBlocked: (q: THREE.Vector3) => boolean;
  camDist?: number;
  camPitch?: number;
};
const campusSpawn = () => { const p = toWorld([9, 0, 30]), s = toWorld([0, 0, 0]); return { p, yaw: Math.atan2(s[0] - p[0], s[2] - p[2]) }; };
export const CAMPUS_WORLD: World = {
  spawn: campusSpawn(), free, floorAt,
  camBlocked: q => BUILDINGS.some(b => q.y < b.h + 3 && OFFS.some(([dx, dy]) => inPoly([q.x + dx * 3, -q.z + dy * 3], b.pts))),
};

/* ---------- Nhân vật "Chiên Con" (thiết kế riêng cho web) ---------- */
const WOOL = '#fbf8f1', FACE = '#f1d9bd', EAR = '#e9c9a6', DARK = '#3a2c25', GOLD = '#D4AF37';
const PUFFS: [number, number, number, number][] = [
  [0.28, 0.82, 0.12, 0.2], [-0.28, 0.82, 0.12, 0.2], [0.24, 0.6, -0.18, 0.2], [-0.24, 0.6, -0.18, 0.2],
  [0, 0.92, -0.26, 0.2], [0, 0.5, 0.26, 0.19], [0.3, 0.56, 0.1, 0.17], [-0.3, 0.56, 0.1, 0.17],
];
const TUFT: [number, number, number, number][] = [[0, 1.86, 0.06, 0.13], [0.12, 1.82, -0.02, 0.11], [-0.12, 1.82, -0.02, 0.11], [0, 1.84, -0.14, 0.11]];

type Look = { moving: React.MutableRefObject<boolean>; emote: () => { id: string; since: number } | null; bubble: () => Bubble | undefined; sitting?: () => boolean; hidden?: () => boolean };

export function Lamb({ name, me = false, look }: { name: string; me?: boolean; look: Look }) {
  const root = useRef<THREE.Group>(null), upper = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null), armR = useRef<THREE.Group>(null), legL = useRef<THREE.Group>(null), legR = useRef<THREE.Group>(null);
  const bubbleEl = useRef<HTMLDivElement>(null), heartEl = useRef<HTMLDivElement>(null);
  const shownBubble = useRef(''), heartK = useRef(-1);
  const outer = useRef<THREE.Group>(null), tagEl = useRef<HTMLDivElement>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime, mv = look.moving.current, em = look.emote(), sit = look.sitting?.() ? 1 : 0;
    const walk = mv ? Math.sin(t * 11) : 0;
    let aL = { x: walk * 0.5, z: 0.15 }, aR = { x: -walk * 0.5, z: -0.15 }, lean = 0, spin = 0, kneel = 0, bob = mv ? Math.abs(walk) * 0.06 : Math.sin(t * 2) * 0.01;
    if (em) {
      const s = em.since, env = Math.min(1, s * 4, Math.max(0, (DUR[em.id as EmoteId] - s) * 4));
      if (em.id === 'wave') aR = { x: -0.2, z: -2.5 * env + Math.sin(s * 14) * 0.35 * env };
      if (em.id === 'bow') { lean = 0.55 * Math.sin(Math.min(1, s / 2) * Math.PI); aL = { x: 0.3, z: 0.1 }; aR = { x: 0.3, z: -0.1 }; }
      if (em.id === 'clap') { const c = Math.abs(Math.sin(s * 12)) * 0.35; aL = { x: -1.3 * env, z: -0.5 * env + c }; aR = { x: -1.3 * env, z: 0.5 * env - c }; }
      if (em.id === 'dance') { spin = s * 4; bob = Math.abs(Math.sin(s * 8)) * 0.25; aL = { x: 0, z: 2.4 + Math.sin(s * 8) * 0.4 }; aR = { x: 0, z: -2.4 - Math.sin(s * 8 + 1) * 0.4 }; }
      if (em.id === 'heart') { aL = { x: -1.1, z: -0.6 }; aR = { x: -1.1, z: 0.6 }; bob = Math.abs(Math.sin(s * 5)) * 0.08; }
      if (em.id === 'pray') { kneel = env; aL = { x: -1.5 * env, z: -0.45 * env }; aR = { x: -1.5 * env, z: 0.45 * env }; lean = 0.12 * env; bob = 0; }
    }
    // tay trái của khung (x âm) / phải (x dương): đổi dấu z để số dương = giơ ra ngoài
    if (armL.current) { armL.current.rotation.x = aL.x; armL.current.rotation.z = -aL.z; }
    if (armR.current) { armR.current.rotation.x = aR.x; armR.current.rotation.z = -aR.z; }
    if (sit && !kneel) { aL = { x: -0.5, z: 0.1 }; aR = { x: -0.5, z: -0.1 }; bob = 0; }
    const legX = sit ? -1.45 : kneel * 1.3;
    if (legL.current) legL.current.rotation.x = walk * 0.7 + legX;
    if (legR.current) legR.current.rotation.x = -walk * 0.7 + legX;
    if (upper.current) upper.current.rotation.x = lean;
    if (root.current) { root.current.position.y = bob - kneel * 0.28; root.current.rotation.y = spin; }
    // trái tim bay lên
    if (em?.id === 'heart' && heartEl.current) {
      const k = Math.floor(clock.elapsedTime - em.since);
      if (heartK.current !== k) {
        heartK.current = k;
        for (let i = 0; i < 3; i++) {
          const h = document.createElement('span'); h.textContent = '❤'; h.className = 'absolute text-[#ff5a7a] text-xl';
          h.style.left = `${-20 + i * 20}px`; heartEl.current.appendChild(h);
          h.animate([{ transform: 'translateY(0) scale(.6)', opacity: 1 }, { transform: `translate(${(i - 1) * 14}px,-60px) scale(1.2)`, opacity: 0 }], { duration: 1300 + i * 200, easing: 'ease-out' }).onfinish = () => h.remove();
        }
      }
    }
    // bong bóng chat
    const b = look.bubble(), txt = b && performance.now() - b.t < 6000 ? b.text : '';
    // góc nhìn thứ nhất: ẩn chính mình
    const hid = !!look.hidden?.();
    if (outer.current && outer.current.visible === hid) outer.current.visible = !hid;
    if (tagEl.current) tagEl.current.style.visibility = hid ? 'hidden' : 'visible';
    if (bubbleEl.current && txt !== shownBubble.current) {
      shownBubble.current = txt; bubbleEl.current.textContent = txt; bubbleEl.current.style.display = txt ? 'block' : 'none';
    }
  });

  return (
    <group>
      <group ref={outer}><group ref={root}>
        <group ref={upper} position={[0, 0.45, 0]}>
          <group position={[0, -0.45, 0]}>
            {/* thân bông xù */}
            <mesh position={[0, 0.7, 0]} castShadow><sphereGeometry args={[0.4, 20, 16]} /><meshStandardMaterial color={WOOL} roughness={1} /></mesh>
            {PUFFS.map(([x, y, z, r], i) => <mesh key={i} position={[x, y, z]} castShadow><sphereGeometry args={[r, 12, 10]} /><meshStandardMaterial color={WOOL} roughness={1} /></mesh>)}
            {/* khăn vàng */}
            <mesh position={[0, 1.04, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.26, 0.07, 10, 24]} /><meshStandardMaterial color={GOLD} roughness={0.5} metalness={0.2} /></mesh>
            <mesh position={[0.12, 0.88, 0.24]} rotation={[0.3, 0, -0.25]}><boxGeometry args={[0.1, 0.26, 0.04]} /><meshStandardMaterial color={GOLD} roughness={0.5} /></mesh>
            {/* đầu */}
            <mesh position={[0, 1.42, 0]} castShadow><sphereGeometry args={[0.36, 22, 18]} /><meshStandardMaterial color={WOOL} roughness={1} /></mesh>
            {TUFT.map(([x, y, z, r], i) => <mesh key={i} position={[x, y, z]}><sphereGeometry args={[r, 10, 8]} /><meshStandardMaterial color={WOOL} roughness={1} /></mesh>)}
            <mesh position={[0, 1.36, 0.2]} scale={[1, 0.85, 0.7]}><sphereGeometry args={[0.24, 18, 14]} /><meshStandardMaterial color={FACE} roughness={0.8} /></mesh>
            {/* tai cụp hai bên */}
            {[-1, 1].map(s => <mesh key={s} position={[s * 0.38, 1.4, 0.02]} rotation={[0, 0, s * -1.1]} scale={[0.5, 1, 0.35]}><sphereGeometry args={[0.17, 12, 10]} /><meshStandardMaterial color={EAR} roughness={0.9} /></mesh>)}
            {/* mắt, mũi */}
            {[-1, 1].map(s => <group key={s} position={[s * 0.1, 1.42, 0.355]}>
              <mesh><sphereGeometry args={[0.045, 12, 10]} /><meshStandardMaterial color={DARK} roughness={0.3} /></mesh>
              <mesh position={[0.015, 0.018, 0.035]}><sphereGeometry args={[0.013, 8, 6]} /><meshBasicMaterial color="#ffffff" /></mesh>
            </group>)}
            <mesh position={[0, 1.31, 0.375]} scale={[1.3, 0.8, 0.7]}><sphereGeometry args={[0.03, 10, 8]} /><meshStandardMaterial color="#8c5a48" /></mesh>
            {/* tay */}
            <group ref={armL} position={[-0.36, 0.98, 0]}><mesh position={[0, -0.2, 0]}><capsuleGeometry args={[0.08, 0.22, 4, 8]} /><meshStandardMaterial color={WOOL} roughness={1} /></mesh>
              <mesh position={[0, -0.36, 0]}><sphereGeometry args={[0.07, 10, 8]} /><meshStandardMaterial color={FACE} /></mesh></group>
            <group ref={armR} position={[0.36, 0.98, 0]}><mesh position={[0, -0.2, 0]}><capsuleGeometry args={[0.08, 0.22, 4, 8]} /><meshStandardMaterial color={WOOL} roughness={1} /></mesh>
              <mesh position={[0, -0.36, 0]}><sphereGeometry args={[0.07, 10, 8]} /><meshStandardMaterial color={FACE} /></mesh></group>
          </group>
        </group>
        {/* chân */}
        <group ref={legL} position={[-0.14, 0.36, 0]}><mesh position={[0, -0.18, 0]}><cylinderGeometry args={[0.08, 0.07, 0.36, 10]} /><meshStandardMaterial color={DARK} /></mesh></group>
        <group ref={legR} position={[0.14, 0.36, 0]}><mesh position={[0, -0.18, 0]}><cylinderGeometry args={[0.08, 0.07, 0.36, 10]} /><meshStandardMaterial color={DARK} /></mesh></group>
      </group></group>
      <Html position={[0, 2.25, 0]} center zIndexRange={OVER_Z}>
        <div ref={tagEl} className="pointer-events-none select-none flex flex-col items-center gap-1">
          <div ref={bubbleEl} style={{ display: 'none' }}
            className="max-w-[200px] w-max rounded-2xl rounded-bl-sm bg-white text-black text-[12px] leading-snug px-2.5 py-1.5 shadow-lg break-words" />
          <div ref={heartEl} className="relative h-0 w-0" />
          <div className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-bold shadow ${me ? 'bg-gold text-black' : 'bg-black/70 text-white'}`}>{name}</div>
        </div>
      </Html>
    </group>
  );
}

/* ---------- Người khác ---------- */
function RemoteLamb({ id, net }: { id: string; net: Net }) {
  const g = useRef<THREE.Group>(null), moving = useRef(false), init = useRef(false);
  const em = useRef({ k: -1, t0: 0 });
  const clock = useThree(s => s.clock);
  const p0 = net.peers.current.get(id);
  const look = useMemo<Look>(() => ({
    moving,
    emote: () => {
      const p = net.peers.current.get(id); if (!p || !p.e) return null;
      if (p.k !== em.current.k) em.current = { k: p.k, t0: clock.elapsedTime };
      const since = clock.elapsedTime - em.current.t0;
      return since < (DUR[p.e as EmoteId] ?? 0) ? { id: p.e, since } : null;
    },
    bubble: () => net.bubbles.current.get(id),
    sitting: () => net.peers.current.get(id)?.s === 1,
  }), [id, net, clock]);
  useFrame((_, dt) => {
    const p = net.peers.current.get(id); if (!p || !g.current) return;
    const k = init.current ? 1 - Math.exp(-dt * 10) : 1; init.current = true;
    g.current.position.lerp(new THREE.Vector3(p.x, p.y, p.z), k);
    let dr = p.r - g.current.rotation.y; dr = Math.atan2(Math.sin(dr), Math.cos(dr));
    g.current.rotation.y += dr * k;
    moving.current = !!p.m;
  });
  if (!p0) return null;
  return <group ref={g}><Lamb name={p0.n} look={look} /></group>;
}

export function RemoteAvatars({ ids, net }: { ids: string[]; net: Net }) {
  return <>{ids.map(id => <RemoteLamb key={id} id={id} net={net} />)}</>;
}

/* ---------- Bản thân + camera theo sau ---------- */
export function Walker({ me, net, touch, emote, world = CAMPUS_WORLD, onMove, seat, firstPerson }: { me: Me; net: Net; touch: React.MutableRefObject<TouchInput>; emote: React.MutableRefObject<EmoteState>; world?: World; onMove?: (p: THREE.Vector3) => void; seat?: React.MutableRefObject<SeatCmd>; firstPerson?: React.MutableRefObject<boolean> }) {
  const { camera, gl, clock } = useThree();
  const g = useRef<THREE.Group>(null);
  const moving = useRef(false);
  const keys = useRef(new Set<string>());
  const st = useRef({ vy: 0, onGround: true, face: 0, camYaw: 0, camPitch: 0.32, camDist: 7, lastSend: 0, jumpHeld: false, wasBusy: false, wasSit: 0 });
  const spawn = world.spawn;
  const activeEmote = () => {
    const e = emote.current; if (!e.id) return null;
    const since = clock.elapsedTime - e.t0;
    return since < DUR[e.id] ? { id: e.id, since } : null;
  };
  const look = useMemo<Look>(() => ({ moving, emote: activeEmote, bubble: () => net.bubbles.current.get('me'), sitting: () => !!seat?.current.sitting, hidden: () => !!firstPerson?.current }), [net, seat, firstPerson]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    st.current.face = st.current.camYaw = spawn.yaw;
    g.current?.position.set(spawn.p[0], spawn.p[1], spawn.p[2]);
    st.current.camDist = world.camDist ?? 7; st.current.camPitch = world.camPitch ?? 0.32; st.current.vy = 0;
    if (seat) seat.current = { ...seat.current, stand: false, sitting: false, back: null };
    const isTyping = (e: KeyboardEvent) => { const t = e.target as HTMLElement | null; return !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable); };
    const down = (e: KeyboardEvent) => {
      if (isTyping(e)) return;
      const k = e.key.toLowerCase(); keys.current.add(k);
      if ([' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) e.preventDefault();
      const n = Number(e.key); if (n >= 1 && n <= EMOTES.length && !e.repeat) emote.current = { id: EMOTES[n - 1].id, k: emote.current.k + 1, t0: clock.elapsedTime };
    };
    const up = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    const blur = () => keys.current.clear();
    const el = (gl.domElement.parentElement ?? gl.domElement) as HTMLElement; let drag: { x: number; y: number; id: number } | null = null;
    const pd = (e: PointerEvent) => { drag = { x: e.clientX, y: e.clientY, id: e.pointerId }; };
    const pm = (e: PointerEvent) => {
      if (!drag || drag.id !== e.pointerId) return;
      st.current.camYaw -= (e.clientX - drag.x) * 0.006;
      st.current.camPitch = THREE.MathUtils.clamp(st.current.camPitch + (e.clientY - drag.y) * 0.004, -0.15, 1.25);
      drag.x = e.clientX; drag.y = e.clientY;
    };
    const pu = () => { drag = null; };
    const wh = (e: WheelEvent) => { e.preventDefault(); st.current.camDist = THREE.MathUtils.clamp(st.current.camDist * (1 + Math.sign(e.deltaY) * 0.1), 2.5, 40); };
    window.addEventListener('keydown', down); window.addEventListener('keyup', up); window.addEventListener('blur', blur);
    el.addEventListener('pointerdown', pd); window.addEventListener('pointermove', pm); window.addEventListener('pointerup', pu);
    el.addEventListener('wheel', wh, { passive: false });
    return () => {
      window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); window.removeEventListener('blur', blur);
      el.removeEventListener('pointerdown', pd); window.removeEventListener('pointermove', pm); window.removeEventListener('pointerup', pu);
      el.removeEventListener('wheel', wh);
    };
  }, [gl, spawn, clock, emote, world]);

  useFrame((state, rawDt) => {
    const o = g.current; if (!o) return;
    const dt = Math.min(rawDt, 0.1), s = st.current, k = keys.current, t = touch.current;
    // nút động tác trên giao diện đặt t0 = -1 → lấy giờ hiện tại
    if (emote.current.id && emote.current.t0 < 0) emote.current.t0 = state.clock.elapsedTime;
    let ix = (k.has('d') || k.has('arrowright') ? 1 : 0) - (k.has('a') || k.has('arrowleft') ? 1 : 0) + t.x;
    let iz = (k.has('w') || k.has('arrowup') ? 1 : 0) - (k.has('s') || k.has('arrowdown') ? 1 : 0) + t.y;
    const len = Math.hypot(ix, iz); if (len > 1) { ix /= len; iz /= len; }
    const fwd = new THREE.Vector3(Math.sin(s.camYaw), 0, Math.cos(s.camYaw)), right = new THREE.Vector3(-Math.cos(s.camYaw), 0, Math.sin(s.camYaw));
    const dir = fwd.multiplyScalar(iz).add(right.multiplyScalar(ix));
    const speed = k.has('shift') ? 8 : 4.6;
    // ngồi xuống / đứng dậy
    const sc = seat?.current;
    if (sc?.goto) {
      if (sc.sitting) { sc.sitting = false; sc.back = null; }
      o.position.set(sc.goto.x, sc.goto.y, sc.goto.z); s.face = s.camYaw = sc.goto.face; s.vy = 0; sc.goto = null;
    }
    if (sc?.want) { sc.back = sc.want.here ? [sc.want.x, sc.want.z] : [o.position.x, o.position.z]; o.position.set(sc.want.x, sc.want.y, sc.want.z); s.face = sc.want.face; s.vy = 0; sc.want = null; sc.sitting = true; sc.stand = false; s.camYaw = s.face; s.camPitch = Math.max(s.camPitch, 0.62); s.camDist = Math.min(s.camDist, 4); }
    if (sc?.sitting && (sc.stand || dir.lengthSq() > 0.01 || k.has(' ') || t.jump)) {
      if (sc.back) o.position.set(sc.back[0], world.floorAt([sc.back[0], -sc.back[1]]), sc.back[1]);
      sc.sitting = false; sc.stand = false; sc.back = null; s.jumpHeld = true;
    }
    const seated = !!sc?.sitting;
    moving.current = !seated && dir.lengthSq() > 0.01;
    if (moving.current) {
      if (emote.current.id && emote.current.id !== 'heart') emote.current = { ...emote.current, id: '' }; // đi thì dừng động tác
      const target = Math.atan2(dir.x, dir.z);
      let d = target - s.face; d = Math.atan2(Math.sin(d), Math.cos(d));
      s.face += d * Math.min(1, dt * 12);
      const tryMove = (nx: number, nz: number) => {
        const p: XY = [nx, -nz];
        if (!world.free(p)) return false;
        if (world.floorAt(p) > o.position.y + 0.45) return false; // bậc quá cao → phải nhảy
        o.position.x = nx; o.position.z = nz; return true;
      };
      const nx = o.position.x + dir.x * speed * dt, nz = o.position.z + dir.z * speed * dt;
      if (!tryMove(nx, nz)) { tryMove(nx, o.position.z); tryMove(o.position.x, nz); }
    }
    o.rotation.y = s.face;
    const wantJump = !seated && (k.has(' ') || t.jump);
    const floor = world.floorAt([o.position.x, -o.position.z]);
    if (wantJump && s.onGround && !s.jumpHeld) { s.vy = 7.2; s.onGround = false; }
    s.jumpHeld = wantJump;
    if (!seated) {
      s.vy -= 20 * dt; o.position.y += s.vy * dt;
      if (o.position.y <= floor) { o.position.y = floor; s.vy = 0; s.onGround = true; }
    }
    // góc nhìn thứ nhất: mắt ở đầu nhân vật, thân xoay theo hướng nhìn
    if (firstPerson?.current) {
      if (!seated) s.face = s.camYaw;
      o.rotation.y = s.face;
      const lp = s.camPitch - 0.32, eye = new THREE.Vector3(o.position.x, o.position.y + 1.45, o.position.z);
      const look = new THREE.Vector3(Math.sin(s.camYaw) * Math.cos(lp), -Math.sin(lp), Math.cos(s.camYaw) * Math.cos(lp));
      camera.position.lerp(eye, 1 - Math.exp(-dt * 25));
      camera.lookAt(camera.position.clone().add(look));
    } else {
    // camera theo sau, không chui vào toà nhà
    const tgt = new THREE.Vector3(o.position.x, o.position.y + 1.3, o.position.z);
    const cp = Math.cos(s.camPitch), unit = new THREE.Vector3(-Math.sin(s.camYaw) * cp, Math.sin(s.camPitch), -Math.cos(s.camYaw) * cp);
    let dist = s.camDist;
    for (let d = 0.6; d <= s.camDist; d += 0.5) {
      const q = tgt.clone().addScaledVector(unit, d);
      if (world.camBlocked(q)) { dist = Math.max(1.2, d - 0.8); break; }
    }
    const want = tgt.clone().add(unit.multiplyScalar(dist)); want.y = Math.max(want.y, 0.6);
    camera.position.lerp(want, 1 - Math.exp(-dt * 10));
    camera.lookAt(tgt);
    }
    onMove?.(o.position);
    // gửi trạng thái ~12 lần/giây
    const now = state.clock.elapsedTime;
    const a = activeEmote(), busy = moving.current || !s.onGround || !!a, sitNow = seated ? 1 : 0;
    if (now - s.lastSend > (busy ? 0.2 : 2.5) || busy !== s.wasBusy || sitNow !== s.wasSit) {
      s.lastSend = now; s.wasBusy = busy; s.wasSit = sitNow;
      const msg: PlayerState = { n: me.name, x: +o.position.x.toFixed(2), y: +o.position.y.toFixed(2), z: +o.position.z.toFixed(2), r: +s.face.toFixed(2), m: moving.current ? 1 : 0, e: a ? a.id : '', k: emote.current.k, s: sitNow };
      net.send.current(msg);
    }
  });

  return <group ref={g}><Lamb name={me.name} me look={look} /></group>;
}
