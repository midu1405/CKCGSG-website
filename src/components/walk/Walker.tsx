/**
 * Chế độ "Dạo khuôn viên": nhân vật đi bằng W A S D / phím mũi tên, Space để nhảy, Shift để chạy,
 * kéo chuột để xoay góc nhìn, lăn chuột để lại gần / ra xa. Trên điện thoại dùng cần điều khiển ảo.
 * Va chạm: không đi xuyên toà nhà, không ra khỏi tường rào; nhảy được lên hai tầng sân khấu.
 */
import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { BUILDINGS, CAMPUS, type XY } from '../campus/data';
import { campusToLocal, toWorld } from '../stage/frame';
import type { Net, PlayerState, Remote } from './presence';

export type TouchInput = { x: number; y: number; jump: boolean };
export type Me = { name: string; color: string };

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
/** Có đi vào được điểm này không */
function free(p: XY) {
  return OFFS.every(([dx, dy]) => { const q: XY = [p[0] + dx, p[1] + dy]; return inPoly(q, CAMPUS) && !BUILDINGS.some(b => inPoly(q, b.pts)); });
}

/* ---------- Hình nhân vật ---------- */
export function AvatarBody({ color, name, moving, me = false }: { color: string; name: string; moving: React.MutableRefObject<boolean>; me?: boolean }) {
  const legL = useRef<THREE.Mesh>(null), legR = useRef<THREE.Mesh>(null), body = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime, sw = moving.current ? Math.sin(t * 11) * 0.6 : 0;
    if (legL.current) legL.current.rotation.x = sw;
    if (legR.current) legR.current.rotation.x = -sw;
    if (body.current) body.current.position.y = moving.current ? Math.abs(Math.sin(t * 11)) * 0.05 : 0;
  });
  return (
    <group>
      <group ref={body}>
        {/* áo choàng */}
        <mesh position={[0, 1.02, 0]} castShadow><capsuleGeometry args={[0.27, 0.7, 4, 12]} /><meshStandardMaterial color={color} roughness={0.8} /></mesh>
        <mesh position={[0, 0.72, 0]} castShadow><cylinderGeometry args={[0.29, 0.36, 0.45, 14]} /><meshStandardMaterial color={color} roughness={0.85} /></mesh>
        {/* đầu, tóc, mũi (để biết hướng mặt) */}
        <mesh position={[0, 1.68, 0]} castShadow><sphereGeometry args={[0.2, 16, 12]} /><meshStandardMaterial color="#d9a77c" roughness={0.7} /></mesh>
        <mesh position={[0, 1.76, -0.03]}><sphereGeometry args={[0.205, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2.1]} /><meshStandardMaterial color="#2a211c" roughness={0.9} /></mesh>
        <mesh position={[0, 1.66, 0.19]}><sphereGeometry args={[0.04, 8, 6]} /><meshStandardMaterial color="#c99470" /></mesh>
      </group>
      <mesh ref={legL} position={[-0.11, 0.48, 0]}><cylinderGeometry args={[0.08, 0.07, 0.5, 8]} /><meshStandardMaterial color="#2b2b30" /></mesh>
      <mesh ref={legR} position={[0.11, 0.48, 0]}><cylinderGeometry args={[0.08, 0.07, 0.5, 8]} /><meshStandardMaterial color="#2b2b30" /></mesh>
      <Html position={[0, 2.25, 0]} center zIndexRange={[20, 0]}>
        <div className={`pointer-events-none select-none whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-bold shadow ${me ? 'bg-gold text-black' : 'bg-black/70 text-white'}`}>{name}</div>
      </Html>
    </group>
  );
}

/* ---------- Người khác ---------- */
function RemoteAvatar({ id, net }: { id: string; net: Net }) {
  const g = useRef<THREE.Group>(null), moving = useRef(false), init = useRef(false);
  const p0 = net.peers.current.get(id);
  useFrame((_, dt) => {
    const p = net.peers.current.get(id); if (!p || !g.current) return;
    const k = init.current ? 1 - Math.exp(-dt * 10) : 1; init.current = true;
    g.current.position.lerp(new THREE.Vector3(p.x, p.y, p.z), k);
    let dr = p.r - g.current.rotation.y; dr = Math.atan2(Math.sin(dr), Math.cos(dr));
    g.current.rotation.y += dr * k;
    moving.current = !!p.m;
  });
  if (!p0) return null;
  return <group ref={g}><AvatarBody color={p0.c} name={p0.n} moving={moving} /></group>;
}

export function RemoteAvatars({ ids, net }: { ids: string[]; net: Net }) {
  return <>{ids.map(id => <RemoteAvatar key={id} id={id} net={net} />)}</>;
}

/* ---------- Bản thân + camera theo sau ---------- */
export function Walker({ me, net, touch }: { me: Me; net: Net; touch: React.MutableRefObject<TouchInput> }) {
  const { camera, gl } = useThree();
  const g = useRef<THREE.Group>(null);
  const moving = useRef(false);
  const keys = useRef(new Set<string>());
  const st = useRef({ vy: 0, onGround: true, face: 0, camYaw: 0, camPitch: 0.32, camDist: 7, lastSend: 0, jumpHeld: false });
  const spawn = useMemo(() => {
    const p = toWorld([9, 0, 30]), s = toWorld([0, 0, 0]);
    const yaw = Math.atan2(s[0] - p[0], s[2] - p[2]);
    return { p, yaw };
  }, []);

  useEffect(() => {
    st.current.face = st.current.camYaw = spawn.yaw;
    g.current?.position.set(spawn.p[0], 0, spawn.p[2]);
    const isTyping = (e: KeyboardEvent) => { const t = e.target as HTMLElement | null; return !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable); };
    const down = (e: KeyboardEvent) => { if (isTyping(e)) return; const k = e.key.toLowerCase(); keys.current.add(k); if ([' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) e.preventDefault(); };
    const up = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    const blur = () => keys.current.clear();
    // kéo để xoay góc nhìn, lăn để phóng to
    const el = gl.domElement; let drag: { x: number; y: number; id: number } | null = null;
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
  }, [gl, spawn]);

  useFrame((state, rawDt) => {
    const o = g.current; if (!o) return;
    const dt = Math.min(rawDt, 0.1), s = st.current, k = keys.current, t = touch.current;
    // hướng đi theo góc camera
    let ix = (k.has('d') || k.has('arrowright') ? 1 : 0) - (k.has('a') || k.has('arrowleft') ? 1 : 0) + t.x;
    let iz = (k.has('w') || k.has('arrowup') ? 1 : 0) - (k.has('s') || k.has('arrowdown') ? 1 : 0) + t.y;
    const len = Math.hypot(ix, iz); if (len > 1) { ix /= len; iz /= len; }
    const fwd = new THREE.Vector3(Math.sin(s.camYaw), 0, Math.cos(s.camYaw)), right = new THREE.Vector3(-Math.cos(s.camYaw), 0, Math.sin(s.camYaw));
    const dir = fwd.multiplyScalar(iz).add(right.multiplyScalar(ix));
    const speed = k.has('shift') ? 8 : 4.6;
    moving.current = dir.lengthSq() > 0.01;
    if (moving.current) {
      const target = Math.atan2(dir.x, dir.z);
      let d = target - s.face; d = Math.atan2(Math.sin(d), Math.cos(d));
      s.face += d * Math.min(1, dt * 12);
      // di chuyển tách trục để trượt dọc tường
      const tryMove = (nx: number, nz: number) => {
        const p: XY = [nx, -nz];
        if (!free(p)) return false;
        if (floorAt(p) > o.position.y + 0.45) return false; // bậc quá cao → phải nhảy
        o.position.x = nx; o.position.z = nz; return true;
      };
      const nx = o.position.x + dir.x * speed * dt, nz = o.position.z + dir.z * speed * dt;
      if (!tryMove(nx, nz)) { tryMove(nx, o.position.z); tryMove(o.position.x, nz); }
    }
    o.rotation.y = s.face;
    // nhảy + trọng lực
    const wantJump = k.has(' ') || t.jump;
    const floor = floorAt([o.position.x, -o.position.z]);
    if (wantJump && s.onGround && !s.jumpHeld) { s.vy = 7.2; s.onGround = false; }
    s.jumpHeld = wantJump;
    s.vy -= 20 * dt; o.position.y += s.vy * dt;
    if (o.position.y <= floor) { o.position.y = floor; s.vy = 0; s.onGround = true; }
    // camera theo sau
    const tgt = new THREE.Vector3(o.position.x, o.position.y + 1.5, o.position.z);
    const cp = Math.cos(s.camPitch), unit = new THREE.Vector3(-Math.sin(s.camYaw) * cp, Math.sin(s.camPitch), -Math.cos(s.camYaw) * cp);
    // camera không chui vào trong toà nhà: rút ngắn khoảng cách khi có tường chắn phía sau
    let dist = s.camDist;
    for (let d = 0.6; d <= s.camDist; d += 0.5) {
      const q = tgt.clone().addScaledVector(unit, d);
      const hit = BUILDINGS.find(b => q.y < b.h + 3 && OFFS.some(([dx, dy]) => inPoly([q.x + dx * 3, -q.z + dy * 3], b.pts)));
      if (hit) { dist = Math.max(1.2, d - 0.8); break; }
    }
    const back = unit.multiplyScalar(dist);
    const want = tgt.clone().add(back); want.y = Math.max(want.y, 0.6);
    camera.position.lerp(want, 1 - Math.exp(-dt * 10));
    camera.lookAt(tgt);
    // gửi trạng thái ~12 lần/giây
    const now = state.clock.elapsedTime;
    if (now - s.lastSend > 0.08) {
      s.lastSend = now;
      const msg: PlayerState = { n: me.name, c: me.color, x: +o.position.x.toFixed(2), y: +o.position.y.toFixed(2), z: +o.position.z.toFixed(2), r: +s.face.toFixed(2), m: moving.current ? 1 : 0 };
      net.send.current(msg);
    }
  });

  return <group ref={g}><AvatarBody color={me.color} name={me.name} moving={moving} me /></group>;
}

export type { Remote };
