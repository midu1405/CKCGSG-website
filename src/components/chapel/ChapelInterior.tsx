/**
 * Bên trong Nhà nguyện cổ — dựng theo ảnh chụp: hàng cột trắng, vòm nhọn, trần vòm trắng có gân xanh nhạt,
 * sàn gạch xanh ngọc bóng, ghế gỗ tối, cung thánh ba bậc với vách gỗ nan dọc và thánh giá, cửa sổ kính màu.
 * Kèm giá nến (số nến = số người đã thắp trong 24 giờ) và bảng ý cầu nguyện.
 * Toạ độ three.js: lối vào ở z = +17, cung thánh ở z âm. Va chạm dùng XY = (x, -z).
 */
import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { XY } from '../campus/data';
import type { World } from '../walk/Walker';
import { floorTex, slatTex, stainedTex } from './textures';

const HW = 11.5, ZF = 17, ZB = -17, NX = 5.6, H_AISLE = 6.2, H_NAVE = 11;
const COLS = [13, 8.5, 4, -0.5, -5, -9.5];
const PEW_Z0 = 14.2, PEW_Z1 = -9.6, PEW_STEP = 1.15;
const PEW_ROWS = Math.floor((PEW_Z0 - PEW_Z1) / PEW_STEP) + 1;
const NAVE_PEW: [number, number] = [1.45, 5.0], AISLE_PEW: [number, number] = [6.35, 10.7];
export const RACK = { x: 8.6, z: -10.9 };
export const BOARD = { x: -8.6, z: -10.9 };

/* ---------- va chạm ---------- */
const box = (x: number, z: number, x0: number, x1: number, z0: number, z1: number) => x > x0 && x < x1 && z > z0 && z < z1;
function solid(x: number, z: number) {
  if (Math.abs(x) > HW - 0.4 || z > ZF - 0.4 || z < ZB + 0.6) return true;
  const ax = Math.abs(x);
  if (COLS.some(c => Math.abs(ax - NX) < 0.6 && Math.abs(z - c) < 0.6)) return true;
  if (box(ax, z, NAVE_PEW[0] - 0.1, NAVE_PEW[1] + 0.1, PEW_Z1 - 0.4, PEW_Z0 + 0.4)) return true;
  if (box(ax, z, AISLE_PEW[0] - 0.1, AISLE_PEW[1] + 0.1, PEW_Z1 - 0.4, PEW_Z0 + 0.4)) return true;
  if (box(x, z, -1.8, 1.8, -14.6, -13.0)) return true; // bàn thờ
  if (box(x, z, RACK.x - 1.4, RACK.x + 1.4, RACK.z - 0.5, RACK.z + 0.5)) return true;
  if (box(x, z, BOARD.x - 1.2, BOARD.x + 1.2, BOARD.z - 0.4, BOARD.z + 0.4)) return true;
  return false;
}
const R = 0.32;
export const CHAPEL_WORLD: World = {
  spawn: { p: [0, 0, 15.2], yaw: Math.PI },
  free: ([x, y]: XY) => [[0, 0], [R, 0], [-R, 0], [0, R], [0, -R]].every(([dx, dz]) => !solid(x + dx, -y + dz)),
  floorAt: ([x, y]: XY) => { const z = -y; if (Math.abs(x) > 8) return 0; return z < -12.5 ? 0.6 : z < -12 ? 0.4 : z < -11.5 ? 0.2 : 0; },
  camBlocked: q => Math.abs(q.x) > HW - 0.3 || q.z > ZF - 0.3 || q.z < ZB + 0.3 || q.y > H_AISLE + 3.5,
  camDist: 5,
  camPitch: 0.1,
};
/** đứng gần cửa ra (để hiện nút "Ra ngoài") */
export const nearExit = (p: THREE.Vector3) => p.z > 15.9 && Math.abs(p.x) < 2.2;

/* ---------- vòm nhọn ---------- */
function arcadeShape(w: number, h: number, spring: number) {
  const s = new THREE.Shape([new THREE.Vector2(-w / 2, 0), new THREE.Vector2(w / 2, 0), new THREE.Vector2(w / 2, h), new THREE.Vector2(-w / 2, h)]);
  const o = w / 2 - 0.5, hole = new THREE.Path();
  hole.moveTo(-o, 0); hole.lineTo(-o, spring);
  hole.bezierCurveTo(-o, spring + o * 0.8, -o * 0.3, spring + o * 1.25, 0, spring + o * 1.35);
  hole.bezierCurveTo(o * 0.3, spring + o * 1.25, o, spring + o * 0.8, o, spring); hole.lineTo(o, 0);
  s.holes.push(hole);
  return new THREE.ShapeGeometry(s, 16);
}

function Pews() {
  const seat = useRef<THREE.InstancedMesh>(null), back = useRef<THREE.InstancedMesh>(null);
  const list = useMemo(() => {
    const out: { x: number; z: number; L: number }[] = [];
    for (let r = 0; r < PEW_ROWS; r++) {
      const z = PEW_Z0 - r * PEW_STEP;
      for (const s of [-1, 1]) for (const [a, b] of [NAVE_PEW, AISLE_PEW]) out.push({ x: s * (a + b) / 2, z, L: b - a });
    }
    return out;
  }, []);
  useLayoutEffect(() => {
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), v = new THREE.Vector3();
    list.forEach(({ x, z, L }, i) => {
      seat.current!.setMatrixAt(i, m.compose(v.set(x, 0.45, z), q, s.set(L, 1, 1)));
      back.current!.setMatrixAt(i, m.compose(v.set(x, 0.85, z + 0.27), q, s.set(L, 1, 1)));
    });
    seat.current!.instanceMatrix.needsUpdate = true; back.current!.instanceMatrix.needsUpdate = true;
  }, [list]);
  const mat = <meshStandardMaterial color="#6b3420" roughness={0.45} metalness={0.05} />;
  return (
    <group>
      <instancedMesh ref={seat} args={[undefined, undefined, list.length]} castShadow receiveShadow><boxGeometry args={[1, 0.08, 0.46]} />{mat}</instancedMesh>
      <instancedMesh ref={back} args={[undefined, undefined, list.length]} castShadow><boxGeometry args={[1, 0.85, 0.07]} />{mat}</instancedMesh>
    </group>
  );
}

/** Giá nến: tối đa 60 ngọn, sáng theo số nến đã thắp trong 24 giờ */
function CandleRack({ lit, onClick }: { lit: number; onClick?: () => void }) {
  const body = useRef<THREE.InstancedMesh>(null), flame = useRef<THREE.InstancedMesh>(null), light = useRef<THREE.PointLight>(null);
  const slots = useMemo(() => {
    const out: [number, number, number][] = [];
    for (let tier = 0; tier < 3; tier++) for (let i = 0; i < 20; i++) out.push([-1.14 + i * 0.12, 0.95 + tier * 0.22, 0.18 - tier * 0.2]);
    return out;
  }, []);
  const n = Math.min(slots.length, lit);
  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    slots.forEach(([x, y, z], i) => {
      body.current!.setMatrixAt(i, m.makeTranslation(x, y + 0.07, z));
      flame.current!.setMatrixAt(i, i < n ? m.makeTranslation(x, y + 0.2, z) : m.makeScale(0, 0, 0));
    });
    body.current!.instanceMatrix.needsUpdate = true; flame.current!.instanceMatrix.needsUpdate = true;
  }, [slots, n]);
  useFrame(({ clock }) => { if (light.current) light.current.intensity = n ? 6 + Math.min(n, 30) * 0.5 + Math.sin(clock.elapsedTime * 13) * 0.8 : 0; });
  return (
    <group position={[RACK.x, 0, RACK.z]} rotation={[0, -0.35, 0]}
      onClick={e => { e.stopPropagation(); onClick?.(); }}
      onPointerOver={() => (document.body.style.cursor = 'pointer')} onPointerOut={() => (document.body.style.cursor = '')}>
      {[0, 1, 2].map(t => <mesh key={t} position={[0, 0.45 + t * 0.22, 0.18 - t * 0.2]} castShadow><boxGeometry args={[2.6, 0.9 + t * 0.0, 0.26]} /><meshStandardMaterial color="#4a2618" roughness={0.6} /></mesh>)}
      <instancedMesh ref={body} args={[undefined, undefined, slots.length]}><cylinderGeometry args={[0.035, 0.035, 0.14, 8]} /><meshStandardMaterial color="#f4efe2" /></instancedMesh>
      <instancedMesh ref={flame} args={[undefined, undefined, slots.length]}><coneGeometry args={[0.022, 0.08, 6]} /><meshBasicMaterial color="#ffc864" /></instancedMesh>
      <pointLight ref={light} position={[0, 1.6, 0.5]} distance={7} decay={2} color="#ffb85c" />
      <Html position={[0, 2.1, 0]} center zIndexRange={[15, 0]}>
        <div onClick={onClick} className="cursor-pointer select-none whitespace-nowrap rounded-full bg-gold px-3 py-1 text-[12px] font-bold text-black shadow-lg">🕯 Thắp nến · {lit.toLocaleString('vi-VN')}</div>
      </Html>
    </group>
  );
}

/** Bảng ý cầu nguyện: mỗi tờ giấy là một ý đã được duyệt (hiện tối đa 30 tờ) */
function PrayerBoard({ notes, onClick }: { notes: number; onClick?: () => void }) {
  const cards = useMemo(() => Array.from({ length: 30 }, (_, i) => ({ x: -0.95 + (i % 6) * 0.38, y: 1.95 - Math.floor(i / 6) * 0.3, r: (((i * 37) % 9) - 4) * 0.05 })), []);
  return (
    <group position={[BOARD.x, 0, BOARD.z]} rotation={[0, 0.35, 0]}
      onClick={e => { e.stopPropagation(); onClick?.(); }}
      onPointerOver={() => (document.body.style.cursor = 'pointer')} onPointerOut={() => (document.body.style.cursor = '')}>
      {[-1.05, 1.05].map(x => <mesh key={x} position={[x, 1.1, 0]} castShadow><boxGeometry args={[0.08, 2.2, 0.08]} /><meshStandardMaterial color="#4a2618" /></mesh>)}
      <mesh position={[0, 1.5, 0]} castShadow><boxGeometry args={[2.3, 1.6, 0.06]} /><meshStandardMaterial color="#9c7a52" roughness={1} /></mesh>
      {cards.slice(0, Math.min(30, notes)).map((c, i) => (
        <mesh key={i} position={[c.x, c.y, 0.04]} rotation={[0, 0, c.r]}><planeGeometry args={[0.3, 0.22]} /><meshStandardMaterial color={i % 3 ? '#fbf6e8' : '#f7e7b0'} /></mesh>
      ))}
      <Html position={[0, 2.65, 0]} center zIndexRange={[15, 0]}>
        <div onClick={onClick} className="cursor-pointer select-none whitespace-nowrap rounded-full bg-white/90 px-3 py-1 text-[12px] font-bold text-black shadow-lg">✍️ Ý cầu nguyện · {notes.toLocaleString('vi-VN')}</div>
      </Html>
    </group>
  );
}

export function ChapelInterior({ candles, notes, onCandle, onBoard }: { candles: number; notes: number; onCandle?: () => void; onBoard?: () => void }) {
  const floor = useMemo(() => { const t = floorTex().clone(); t.needsUpdate = true; t.repeat.set((HW * 2) / 2.4, (ZF - ZB) / 2.4); return t; }, []);
  const slats = useMemo(() => { const t = slatTex().clone(); t.needsUpdate = true; t.repeat.set(2, 1); return t; }, []);
  const arcade = useMemo(() => arcadeShape(4.5, 7.6, 3.6), []);
  const white = <meshStandardMaterial color="#f7f6f2" roughness={0.75} emissive="#3b3a36" />;
  const bays = COLS.slice(0, -1).map((z, i) => (z + COLS[i + 1]) / 2);
  const reredos = useMemo(() => {
    const s = new THREE.Shape(); const w = 2.6;
    s.moveTo(-w, 0); s.lineTo(-w, 8.2); s.quadraticCurveTo(-w, 10.6, 0, 11.6); s.quadraticCurveTo(w, 10.6, w, 8.2); s.lineTo(w, 0); s.closePath();
    const g = new THREE.ShapeGeometry(s, 12); const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, (uv.getX(i) + w) / (2 * w), uv.getY(i) / 11.6); return g;
  }, []);

  return (
    <group>
      <color attach="background" args={['#120f0c']} />
      <hemisphereLight args={['#fff6e6', '#55605c', 1.3]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[14, 18, 6]} intensity={0.9} color="#fff1dc" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <pointLight position={[0, 9, -12]} intensity={70} distance={26} color="#ffe2b0" />
      <pointLight position={[0, 8, 4]} intensity={60} distance={30} color="#fff3dc" />
      {/* chùm đèn */}
      {[8, -2].map(z => <group key={z} position={[0, 8.2, z]}>
        <mesh><torusGeometry args={[0.9, 0.05, 8, 24]} /><meshStandardMaterial color="#c9a24a" metalness={0.8} roughness={0.3} /></mesh>
        {Array.from({ length: 8 }, (_, i) => <mesh key={i} position={[Math.cos(i * 0.785) * 0.9, 0.15, Math.sin(i * 0.785) * 0.9]}><sphereGeometry args={[0.08, 8, 6]} /><meshBasicMaterial color="#fff2c8" /></mesh>)}
        <mesh position={[0, 1.6, 0]}><cylinderGeometry args={[0.015, 0.015, 3, 4]} /><meshStandardMaterial color="#333" /></mesh>
      </group>)}

      {/* sàn, bậc cung thánh */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[HW * 2, ZF - ZB]} /><meshStandardMaterial map={floor} roughness={0.22} metalness={0.15} /></mesh>
      {[[-11.5, 0.2], [-12, 0.4], [-12.5, 0.6]].map(([z, h]) => (
        <mesh key={z} position={[0, h / 2, (z + ZB) / 2]} receiveShadow><boxGeometry args={[16, h, z - ZB]} /><meshStandardMaterial map={floor} roughness={0.25} metalness={0.1} /></mesh>
      ))}

      {/* tường bao, tường đầu hồi */}
      {[-1, 1].map(s => <mesh key={s} position={[s * HW, H_AISLE / 2, 0]} rotation={[0, -s * Math.PI / 2, 0]} receiveShadow><planeGeometry args={[ZF - ZB, H_AISLE]} />{white}</mesh>)}
      <mesh position={[0, H_NAVE / 2, ZB]} receiveShadow><planeGeometry args={[HW * 2, H_NAVE + 2]} />{white}</mesh>
      <mesh position={[0, H_NAVE / 2, ZF]} rotation={[0, Math.PI, 0]}><planeGeometry args={[HW * 2, H_NAVE + 2]} />{white}</mesh>
      <mesh position={[0, 2.4, ZF - 0.02]} rotation={[0, Math.PI, 0]}><planeGeometry args={[2.6, 4.8]} /><meshStandardMaterial color="#5a1d14" /></mesh>
      {/* trần hai bên + trần vòm giữa */}
      {[-1, 1].map(s => <mesh key={s} position={[s * (NX + HW) / 2, H_AISLE, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[HW - NX, ZF - ZB]} />{white}</mesh>)}
      <mesh position={[0, H_NAVE - 0.4, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 1, 0.85]}>
        <cylinderGeometry args={[NX, NX, ZF - ZB, 32, 1, true, -Math.PI / 2, Math.PI]} /><meshStandardMaterial color="#f7f6f2" side={THREE.BackSide} roughness={0.8} />
      </mesh>
      {/* gân vòm xanh nhạt */}
      {COLS.map(z => <mesh key={z} position={[0, H_NAVE - 0.4, z]} scale={[1, 0.85, 1]}><torusGeometry args={[NX - 0.05, 0.08, 6, 32, Math.PI]} /><meshStandardMaterial color="#9ec2d8" /></mesh>)}
      {/* tường cao trên hàng cột + vòm nhọn giữa các cột */}
      {[-1, 1].map(s => (
        <group key={s}>
          <mesh position={[s * NX, (7.6 + H_NAVE) / 2 - 0.2, 0]} rotation={[0, s * Math.PI / 2, 0]}><planeGeometry args={[ZF - ZB, H_NAVE - 7.6 + 0.4]} /><meshStandardMaterial color="#f7f6f2" emissive="#3b3a36" side={THREE.DoubleSide} /></mesh>
          {bays.map(z => <mesh key={z} geometry={arcade} position={[s * NX, 0, z]} rotation={[0, Math.PI / 2, 0]}><meshStandardMaterial color="#f7f6f2" emissive="#3b3a36" side={THREE.DoubleSide} /></mesh>)}
          {/* cửa sổ nhỏ phía trên */}
          {bays.map(z => <mesh key={'w' + z} position={[s * (NX - 0.03), 9.2, z]} rotation={[0, -s * Math.PI / 2, 0]}><planeGeometry args={[0.7, 1.3]} /><meshStandardMaterial color="#5f8fc0" emissive="#6fa0d0" emissiveIntensity={0.6} /></mesh>)}
          {/* cửa sổ kính màu tường ngoài */}
          {bays.map((z, i) => <mesh key={'g' + z} position={[s * (HW - 0.03), 3.1, z]} rotation={[0, -s * Math.PI / 2, 0]}>
            <planeGeometry args={[1.3, 3]} /><meshStandardMaterial map={stainedTex(i + (s > 0 ? 7 : 1))} emissiveMap={stainedTex(i + (s > 0 ? 7 : 1))} emissive="#ffffff" emissiveIntensity={0.85} />
          </mesh>)}
          {/* cột */}
          {COLS.map(z => <group key={'c' + z} position={[s * NX, 0, z]}>
            <mesh position={[0, 3.8, 0]} castShadow><cylinderGeometry args={[0.42, 0.45, 7.6, 20]} />{white}</mesh>
            <mesh position={[0, 0.2, 0]}><boxGeometry args={[1.1, 0.4, 1.1]} />{white}</mesh>
            <mesh position={[0, 7.5, 0]}><cylinderGeometry args={[0.65, 0.45, 0.5, 20]} />{white}</mesh>
          </group>)}
        </group>
      ))}

      {/* cung thánh: vách gỗ, thánh giá, bàn thờ, hoa */}
      <mesh geometry={reredos} position={[0, 0.6, ZB + 0.05]}><meshStandardMaterial map={slats} roughness={0.55} /></mesh>
      <mesh position={[0, 6.6, ZB + 0.25]} castShadow><boxGeometry args={[0.22, 4.4, 0.14]} /><meshStandardMaterial color="#2b1a12" /></mesh>
      <mesh position={[0, 7.7, ZB + 0.25]} castShadow><boxGeometry args={[2.2, 0.22, 0.14]} /><meshStandardMaterial color="#2b1a12" /></mesh>
      <mesh position={[0, 7.0, ZB + 0.36]}><capsuleGeometry args={[0.12, 0.9, 4, 8]} /><meshStandardMaterial color="#d8c3a0" /></mesh>
      <mesh position={[0, 3.2, ZB + 0.35]}><cylinderGeometry args={[0.35, 0.3, 1.2, 14]} /><meshStandardMaterial color="#4a3a2a" metalness={0.4} roughness={0.4} /></mesh>
      <group position={[0, 0.6, -13.8]}>
        <mesh position={[0, 0.5, 0]} castShadow><boxGeometry args={[3.2, 1, 1.2]} /><meshStandardMaterial color="#7a4b2c" roughness={0.5} /></mesh>
        <mesh position={[0, 1.02, 0]}><boxGeometry args={[3.4, 0.05, 1.3]} /><meshStandardMaterial color="#ffffff" /></mesh>
        <mesh position={[0, 0.7, 0.62]}><planeGeometry args={[3.3, 0.6]} /><meshStandardMaterial color="#ffffff" /></mesh>
        {[-1.2, 1.2].map(x => <mesh key={x} position={[x, 1.25, 0]}><cylinderGeometry args={[0.04, 0.04, 0.4, 8]} /><meshStandardMaterial color="#fff8e8" emissive="#ffcf80" emissiveIntensity={0.3} /></mesh>)}
        {[-2.4, 2.4].map(x => <group key={x} position={[x, 0, 0.6]}>
          <mesh position={[0, 0.4, 0]}><cylinderGeometry args={[0.18, 0.14, 0.8, 10]} /><meshStandardMaterial color="#e8e2d6" /></mesh>
          {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[Math.cos(i * 2.4) * 0.28, 1 + (i % 3) * 0.12, Math.sin(i * 2.4) * 0.22]}><sphereGeometry args={[0.16, 10, 8]} /><meshStandardMaterial color={i % 2 ? '#e86aa5' : '#f39ac4'} /></mesh>)}
        </group>)}
      </group>

      <Pews />
      <CandleRack lit={candles} onClick={onCandle} />
      <PrayerBoard notes={notes} onClick={onBoard} />
    </group>
  );
}
