/**
 * Nhà nguyện cổ (khoảng 1863) — mặt ngoài dựng theo ảnh chụp:
 * mặt tiền Gothic trắng ngà với cổng vòm nhọn, cửa sổ hoa hồng, đầu hồi nhọn, các tháp nhọn và lan can răng cưa;
 * thân nhà mái ngói nâu hai tầng (tường cao có cửa sổ vòm, hành lang thấp có cửa gỗ đỏ nâu);
 * phía trước có tượng thánh với hai em nhỏ và các chậu cây cắt tỉa.
 * Đặt khớp với khối toà nhà số 9 trong dữ liệu OpenStreetMap.
 */
import { useMemo, useState } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { BUILDINGS, CAMPUS_ANGLE, uv2xy, xy2uv, type XY } from '../campus/data';
import { roofTileTex, pavingTex, tiled } from '../world/textures';
import { Statue } from './Statue';
import { aisleBayTex, clerestoryBayTex, facadeCenterTex, gableTex, wingTex, IVORY } from './textures';

/* ---------- khung toạ độ ---------- */
const B = BUILDINGS.find(b => b.name === 'Nhà nguyện cổ') ?? BUILDINGS[9];
const UV = B.pts.map(xy2uv);
const U0 = Math.min(...UV.map(p => p[0])), U1 = Math.max(...UV.map(p => p[0])), V0 = Math.min(...UV.map(p => p[1])), V1 = Math.max(...UV.map(p => p[1]));
const A = (CAMPUS_ANGLE * Math.PI) / 180;
export const CH_W = Math.min(25, U1 - U0 - 0.4);
export const CH_L = V1 - V0 - 0.4;
const FRONT_UV: XY = [(U0 + U1) / 2, V0 + 0.2];
const FRONT = uv2xy(FRONT_UV);
/** local (x ngang, z: 0 = mặt tiền, âm = vào trong) → toạ độ khuôn viên */
export const chapelToCampus = (x: number, z: number): XY => uv2xy([FRONT_UV[0] + x, FRONT_UV[1] - z]);
/** điểm (toạ độ khuôn viên) có nằm trong sân trước Nhà nguyện không — để không trồng cây đè lên tượng, lối vào */
export const inChapelYard = (p: XY) => { const [u, v] = xy2uv(p); const x = u - FRONT_UV[0], z = FRONT_UV[1] - v; return Math.abs(x) < 15 && z > -1 && z < 16; };
export const CHAPEL = {
  pos: [FRONT[0], 0, -FRONT[1]] as [number, number, number],
  rotY: A,
  /** điểm cửa chính (để bước vào) và chỗ đứng khi ra */
  door: chapelToCampus(0, 1.2),
  outside: chapelToCampus(0, 6),
};

/* ---------- tiện ích ---------- */
const tri = (a: number[], b: number[], c: number[], uv?: number[][]) => {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute([...a, ...b, ...c], 3));
  if (uv) g.setAttribute('uv', new THREE.Float32BufferAttribute(uv.flat(), 2));
  g.computeVertexNormals(); return g;
};
function quads(list: number[][][], tile = 2) {
  const pos: number[] = [], uv: number[] = [];
  for (const q of list) {
    const [a, b] = q, e = new THREE.Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]).normalize();
    const n = new THREE.Vector3().subVectors(new THREE.Vector3(...q[2]), new THREE.Vector3(...a));
    const up = n.sub(e.clone().multiplyScalar(n.dot(e))).normalize();
    const uvOf = (p: number[]) => { const d = new THREE.Vector3(p[0] - a[0], p[1] - a[1], p[2] - a[2]); return [d.dot(e) / tile, d.dot(up) / tile]; };
    const idx = q.length === 3 ? [0, 1, 2] : [0, 1, 2, 0, 2, 3];
    for (const k of idx) { pos.push(...q[k]); uv.push(...uvOf(q[k])); }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.computeVertexNormals(); return g;
}

function Pinnacle({ x, z, h, w = 1.1 }: { x: number; z: number; h: number; w?: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, h / 2, 0]} castShadow><boxGeometry args={[w, h, w]} /><meshStandardMaterial color={IVORY} roughness={0.85} /></mesh>
      <mesh position={[0, h + 0.25, 0]}><boxGeometry args={[w + 0.25, 0.5, w + 0.25]} /><meshStandardMaterial color="#e6dcc6" /></mesh>
      <mesh position={[0, h + 2.6, 0]} rotation={[0, Math.PI / 4, 0]} castShadow><coneGeometry args={[w * 0.62, 4.2, 4]} /><meshStandardMaterial color={IVORY} roughness={0.85} /></mesh>
      {[0.25, 0.5, 0.75].map(t => <mesh key={t} position={[0, h + 0.5 + t * 4, 0]}><boxGeometry args={[w * 0.9 * (1 - t) + 0.15, 0.12, w * 0.9 * (1 - t) + 0.15]} /><meshStandardMaterial color="#e2d7bf" /></mesh>)}
    </group>
  );
}
function Topiary({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.3, 0]} castShadow><cylinderGeometry args={[0.45, 0.32, 0.6, 12]} /><meshStandardMaterial color="#8a3b28" /></mesh>
      {[0, 1, 2].map(i => <mesh key={i} position={[0, 1.1 + i * 0.75, 0]} castShadow><coneGeometry args={[0.85 - i * 0.22, 1.2, 10]} /><meshStandardMaterial color="#29482b" roughness={1} /></mesh>)}
    </group>
  );
}
export function ChapelExterior({ onEnter, night = false, active = false }: { onEnter?: () => void; night?: boolean; active?: boolean }) {
  const [hover, setHover] = useState(false);
  const W = CH_W, L = CH_L, hw = W / 2, NX = 6.2;
  const tex = useMemo(() => ({
    clere: tiled(clerestoryBayTex(), Math.round((L - 2.5) / 4.5), 1),
    aisle: tiled(aisleBayTex(), Math.round((L - 2.5) / 4.5), 1),
    tile: roofTileTex(),
    plaza: tiled(pavingTex('warm'), 28 / 4, 14 / 4),
  }), [L]);
  const tint = active ? '#ffe29a' : hover ? '#fff6dc' : '#ffffff';
  const geo = useMemo(() => {
    const zb = -L, zf = -1.2;
    const nave = quads([
      [[-NX - 0.8, 10.4, zf], [-NX - 0.8, 10.4, zb - 0.6], [0, 15, zb + 6], [0, 15, zf]],
      [[NX + 0.8, 10.4, zb - 0.6], [NX + 0.8, 10.4, zf], [0, 15, zf], [0, 15, zb + 6]],
      [[-NX - 0.8, 10.4, zb - 0.6], [NX + 0.8, 10.4, zb - 0.6], [0, 15, zb + 6]],
    ]);
    const aisles = quads([
      [[-NX, 5.6, zf], [-NX, 5.6, zb - 0.4], [-hw - 0.9, 4.3, zb - 0.4], [-hw - 0.9, 4.3, zf]],
      [[NX, 5.6, zb - 0.4], [NX, 5.6, zf], [hw + 0.9, 4.3, zf], [hw + 0.9, 4.3, zb - 0.4]],
    ]);
    const gableFront = tri([-6, 13, 0.02], [6, 13, 0.02], [0, 19, 0.02], [[0, 0], [1, 0], [0.5, 1]]);
    const gableBack = tri([6, 13, -1.2], [-6, 13, -1.2], [0, 19, -1.2]);
    const gableSides = quads([[[-6, 13, 0], [-6, 13, -1.2], [0, 19, -1.2], [0, 19, 0]], [[6, 13, -1.2], [6, 13, 0], [0, 19, 0], [0, 19, -1.2]]]);
    return { nave, aisles, gableFront, gableBack, gableSides };
  }, [L, hw]);

  const wall = <meshStandardMaterial color={IVORY} roughness={0.9} />;
  const handlers = onEnter ? {
    onClick: (e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); onEnter(); },
    onPointerOver: (e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer'; },
    onPointerOut: () => { setHover(false); document.body.style.cursor = ''; },
  } : {};

  return (
    <group position={CHAPEL.pos} rotation={[0, CHAPEL.rotY, 0]}>
      {/* sân lát trước nhà nguyện */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 7]} receiveShadow><planeGeometry args={[28, 14]} /><meshStandardMaterial map={tex.plaza} roughness={0.95} /></mesh>
      <group {...handlers}>
        {/* thân nhà: tường cao giữa + hành lang hai bên + tường sau */}
        {[-1, 1].map(s => (
          <group key={s}>
            <mesh position={[s * NX, 8, -L / 2 - 0.6]} rotation={[0, s * Math.PI / 2, 0]} castShadow receiveShadow>
              <planeGeometry args={[L - 2.4, 5]} /><meshStandardMaterial map={tex.clere} color={tint} roughness={0.9} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[s * (hw - 0.2), 2.6, -L / 2 - 0.6]} rotation={[0, s * Math.PI / 2, 0]} castShadow receiveShadow>
              <planeGeometry args={[L - 2.4, 5.2]} /><meshStandardMaterial map={tex.aisle} color={tint} roughness={0.9} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[s * (NX + hw - 0.2) / 2, 0.25, -L / 2 - 0.6]} receiveShadow><boxGeometry args={[hw - NX + 0.4, 0.5, L - 2.4]} /><meshStandardMaterial color="#b4583b" roughness={0.9} /></mesh>
          </group>
        ))}
        <mesh position={[0, 5.2, -L + 0.1]} castShadow><boxGeometry args={[W - 0.4, 10.4, 0.4]} />{wall}</mesh>
        <mesh geometry={geo.nave} castShadow receiveShadow><meshStandardMaterial map={tex.tile} color={tint} roughness={0.85} side={THREE.DoubleSide} /></mesh>
        <mesh geometry={geo.aisles} castShadow receiveShadow><meshStandardMaterial map={tex.tile} color={tint} roughness={0.85} side={THREE.DoubleSide} /></mesh>

        {/* mặt tiền: khối giữa, đầu hồi, hai cánh */}
        <mesh position={[0, 6.5, -0.75]} castShadow><boxGeometry args={[12, 13, 1.5]} />{wall}</mesh>
        <mesh position={[0, 6.5, 0.011]}><planeGeometry args={[12, 13]} /><meshStandardMaterial map={facadeCenterTex()} color={tint} roughness={0.85} /></mesh>
        <mesh geometry={geo.gableFront}><meshStandardMaterial map={gableTex()} color={tint} roughness={0.85} side={THREE.DoubleSide} /></mesh>
        <mesh geometry={geo.gableBack}>{wall}</mesh>
        <mesh geometry={geo.gableSides} castShadow><meshStandardMaterial color={IVORY} side={THREE.DoubleSide} /></mesh>
        {[-1, 1].map(s => (
          <group key={s}>
            <mesh position={[s * (6 + (hw - 6) / 2), 4.5, -0.6]} castShadow><boxGeometry args={[hw - 6, 9, 1.2]} />{wall}</mesh>
            <mesh position={[s * (6 + (hw - 6) / 2), 4.5, 0.011]}><planeGeometry args={[hw - 6, 9]} /><meshStandardMaterial map={wingTex()} color={tint} roughness={0.85} /></mesh>
            {/* lan can răng cưa */}
            <mesh position={[s * (6 + (hw - 6) / 2), 9.25, -0.6]}><boxGeometry args={[hw - 6, 0.5, 1.3]} /><meshStandardMaterial color="#e9e0cc" /></mesh>
            {Array.from({ length: Math.floor((hw - 6.6) / 0.7) }, (_, i) => (
              <mesh key={i} position={[s * (6.6 + i * 0.7), 9.8, 0.0]}><boxGeometry args={[0.35, 0.6, 0.3]} /><meshStandardMaterial color={IVORY} /></mesh>
            ))}
          </group>
        ))}
        {/* tháp nhọn */}
        <Pinnacle x={-6.2} z={0.15} h={16} /><Pinnacle x={6.2} z={0.15} h={16} />
        <Pinnacle x={-hw + 0.4} z={0.15} h={10.5} w={0.9} /><Pinnacle x={hw - 0.4} z={0.15} h={10.5} w={0.9} />
        {/* thánh giá đỉnh */}
        <mesh position={[0, 20.3, -0.6]}><boxGeometry args={[0.28, 2.6, 0.28]} /><meshStandardMaterial color="#f7f3ea" /></mesh>
        <mesh position={[0, 20.7, -0.6]}><boxGeometry args={[1.4, 0.28, 0.28]} /><meshStandardMaterial color="#f7f3ea" /></mesh>
        {/* đèn cửa khi trời tối */}
        {night && <pointLight position={[0, 4.5, 3]} intensity={60} distance={18} color="#ffcf8a" />}
      </group>
      {/* tượng & cây cảnh */}
      <Statue x={-9.5} z={9.5} rot={0.45} />
      {[-9.8, -3.6, 3.6, 9.8].map(x => <Topiary key={x} x={x} z={1.6} />)}
    </group>
  );
}
