/**
 * Khuôn viên Trung Tâm Mục Vụ dựng "như thật": bầu trời, nắng – bóng đổ, toà nhà có mặt tiền cửa sổ và mái ngói,
 * Nhà nguyện cổ có tháp chuông, tường rào + cổng, sân lát gạch, cỏ, cây xanh, đường phố.
 * Hình khối toà nhà lấy từ OpenStreetMap; màu sắc, mái, cửa sổ là minh hoạ (chưa đối chiếu từng toà ngoài thực tế).
 * Dùng chung cho /dac-lo/so-do và /dac-lo/khuon-vien.
 */
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Line, Sky } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { BUILDINGS, CAMPUS, ROADS, xy2uv, uv2xy, type Area, type Building, type XY } from '../campus/data';
import { ChapelExterior } from '../chapel/ChapelExterior';
import { concreteTex, facadeTex, grassTex, pavingTex, roofTileTex, stuccoTex, tiled, type FacadeStyle } from './textures';

/* ---------- tiện ích hình học ---------- */
export const w3 = ([x, y]: XY, h = 0) => new THREE.Vector3(x, h, -y);
export const shapeOf = (pts: XY[]) => new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
const open = (p: XY[]) => (p.length > 1 && p[0][0] === p[p.length - 1][0] && p[0][1] === p[p.length - 1][1] ? p.slice(0, -1) : p);
export const inPoly = ([x, y]: XY, poly: XY[]) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c; } return c; };
export const inArea = (p: XY, a: Area, pad = 0) => { const [u, v] = xy2uv(p), [cu, cv] = xy2uv(a.c); return Math.abs(u - cu) < a.s[0] / 2 + pad && Math.abs(v - cv) < a.s[1] / 2 + pad; };
const rand = (a: number, b: number) => { const t = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453; return t - Math.floor(t); };

/** Hình chữ nhật bao (theo trục khuôn viên) của một toà */
function obb(pts: XY[]) {
  const uv = open(pts).map(xy2uv);
  const us = uv.map(p => p[0]), vs = uv.map(p => p[1]);
  return { u0: Math.min(...us), u1: Math.max(...us), v0: Math.min(...vs), v1: Math.max(...vs) };
}
const P = (u: number, v: number, h: number): [number, number, number] => { const [x, y] = uv2xy([u, v]); return [x, h, -y]; };

/** Tường quanh một đa giác: mỗi cạnh chia đều số ô cửa sổ để cửa không bị cắt ở góc */
function wallGeo(pts: XY[], z0: number, z1: number, bayW: number, bayH: number) {
  const q = open(pts), pos: number[] = [], uv: number[] = [];
  for (let i = 0; i < q.length; i++) {
    const a = q[i], b = q[(i + 1) % q.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (L < 0.05) continue;
    const n = Math.max(1, Math.round(L / bayW)), va = z0 / bayH, vb = z1 / bayH;
    const A0 = [a[0], z0, -a[1]], B0 = [b[0], z0, -b[1]], B1 = [b[0], z1, -b[1]], A1 = [a[0], z1, -a[1]];
    pos.push(...A0, ...B0, ...B1, ...A0, ...B1, ...A1);
    uv.push(0, va, n, va, n, vb, 0, va, n, vb, 0, vb);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.computeVertexNormals();
  return g;
}

/** Ghép các mặt (tam giác/tứ giác) thành một geometry, UV tính theo mét để dán ngói */
function facesGeo(faces: [number, number, number][][], tile = 2) {
  const pos: number[] = [], uv: number[] = [];
  for (const f of faces) {
    const [a, b] = f, e = new THREE.Vector3(b[0] - a[0], 0, b[2] - a[2]).normalize();
    const uvOf = (p: [number, number, number]) => [(p[0] * e.x + p[2] * e.z) / tile, (p[1] * 1.6) / tile];
    const tris = f.length === 3 ? [[0, 1, 2]] : [[0, 1, 2], [0, 2, 3]];
    for (const t of tris) for (const k of t) { pos.push(...f[k]); uv.push(...uvOf(f[k])); }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.computeVertexNormals();
  return g;
}

/* ---------- kiểu dáng từng toà (minh hoạ) ---------- */
type Roof = 'hip' | 'flat' | 'solar' | 'chapel';
const STYLE: Record<number, { facade: FacadeStyle; roof: Roof }> = {
  0: { facade: 'colonial', roof: 'hip' }, 1: { facade: 'colonial', roof: 'hip' }, 2: { facade: 'modern', roof: 'solar' },
  3: { facade: 'colonial', roof: 'hip' }, 4: { facade: 'modern', roof: 'solar' }, 5: { facade: 'colonial', roof: 'hip' },
  6: { facade: 'colonial', roof: 'hip' }, 7: { facade: 'modern', roof: 'flat' }, 8: { facade: 'colonial', roof: 'hip' },
  9: { facade: 'chapel', roof: 'chapel' }, 10: { facade: 'modern', roof: 'flat' }, 11: { facade: 'colonial', roof: 'hip' },
  12: { facade: 'modern', roof: 'flat' },
};
const FLOOR = 3.6;

type BProps = { b: Building; night: boolean; active?: boolean; onPick?: (b: Building) => void; pickMode?: boolean };

export function RealBuilding({ b, night, active = false, onPick, pickMode = false }: BProps) {
  const st = STYLE[b.i] ?? { facade: 'modern', roof: 'flat' };
  const chapel = st.roof === 'chapel';
  const floors = Math.max(1, Math.round((b.h - (st.roof === 'hip' ? 2 : 0.8)) / FLOOR));
  const wallH = chapel ? 9 : floors * FLOOR;
  const [hover, setHover] = useState(false);
  const box = useMemo(() => obb(b.pts), [b]);

  const walls = useMemo(() => wallGeo(b.pts, 0, wallH, 4, chapel ? 8 : FLOOR), [b, wallH, chapel]);
  const parapet = useMemo(() => (st.roof === 'flat' || st.roof === 'solar' ? wallGeo(b.pts, wallH, wallH + 0.9, 3, 3) : null), [b, wallH, st.roof]);
  const cap = useMemo(() => new THREE.ShapeGeometry(shapeOf(open(b.pts))), [b]);
  const roof = useMemo(() => {
    const o = 0.7, { u0, u1, v0, v1 } = box, U0 = u0 - o, U1 = u1 + o, V0 = v0 - o, V1 = v1 + o, H = wallH;
    const w = U1 - U0, d = V1 - V0;
    if (st.roof === 'hip') {
      const R = Math.min(7, Math.min(w, d) * 0.3), Hr = H + R;
      if (w >= d) {
        const vc = (V0 + V1) / 2, ua = U0 + d / 2, ub = U1 - d / 2;
        return facesGeo([
          [P(U0, V0, H), P(U1, V0, H), P(ub, vc, Hr), P(ua, vc, Hr)],
          [P(U1, V1, H), P(U0, V1, H), P(ua, vc, Hr), P(ub, vc, Hr)],
          [P(U1, V0, H), P(U1, V1, H), P(ub, vc, Hr)],
          [P(U0, V1, H), P(U0, V0, H), P(ua, vc, Hr)],
        ]);
      }
      const uc = (U0 + U1) / 2, va = V0 + w / 2, vb = V1 - w / 2;
      return facesGeo([
        [P(U1, V0, H), P(U1, V1, H), P(uc, vb, Hr), P(uc, va, Hr)],
        [P(U0, V1, H), P(U0, V0, H), P(uc, va, Hr), P(uc, vb, Hr)],
        [P(U0, V0, H), P(U1, V0, H), P(uc, va, Hr)],
        [P(U1, V1, H), P(U0, V1, H), P(uc, vb, Hr)],
      ]);
    }
    if (chapel) {
      // mái hai mái dọc theo chiều dài (trục v)
      const uc = (U0 + U1) / 2, Hr = H + 6.5;
      return facesGeo([
        [P(U0, V0, H), P(U0, V1, H), P(uc, V1, Hr), P(uc, V0, Hr)],
        [P(U1, V1, H), P(U1, V0, H), P(uc, V0, Hr), P(uc, V1, Hr)],
      ]);
    }
    return null;
  }, [box, wallH, st.roof, chapel]);
  // đầu hồi Nhà nguyện (tam giác tường)
  const gables = useMemo(() => {
    if (!chapel) return null;
    const { u0, u1, v0, v1 } = box, uc = (u0 + u1) / 2, H = wallH;
    return facesGeo([[P(u0, v0, H), P(u1, v0, H), P(uc, v0, H + 6.2)], [P(u1, v1, H), P(u0, v1, H), P(uc, v1, H + 6.2)]], 4);
  }, [box, chapel, wallH]);
  // tấm pin mặt trời trên mái bằng
  const panels = useMemo(() => {
    if (st.roof !== 'solar') return [];
    const out: { p: [number, number, number]; r: number }[] = [], q = open(b.pts);
    for (let u = box.u0 + 2.5; u < box.u1 - 2; u += 2.2) for (let v = box.v0 + 2.5; v < box.v1 - 2; v += 2.4) {
      const corners: XY[] = [[u - 1, v - 1.2], [u + 1, v - 1.2], [u + 1, v + 1.2], [u - 1, v + 1.2]];
      if (corners.every(c => inPoly(uv2xy(c), q))) out.push({ p: P(u, v, wallH + 0.6), r: 0 });
    }
    return out;
  }, [b, box, st.roof, wallH]);
  const panelRef = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    if (!panelRef.current) return;
    const m = new THREE.Matrix4(), q = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.26, (-42.6 * Math.PI) / 180, 0, 'YXZ')), s = new THREE.Vector3(1, 1, 1);
    panels.forEach(({ p }, i) => panelRef.current!.setMatrixAt(i, m.compose(new THREE.Vector3(...p), q, s)));
    panelRef.current.instanceMatrix.needsUpdate = true;
  }, [panels]);

  const mats = useMemo(() => {
    const tint = active ? '#ffd76a' : hover ? '#fff4d0' : '#ffffff';
    const wall = new THREE.MeshStandardMaterial({
      map: facadeTex(st.facade), emissiveMap: facadeTex(st.facade, true), emissive: new THREE.Color('#ffd9a0'),
      emissiveIntensity: night ? 1.1 : 0, color: tint, roughness: 0.92, side: THREE.DoubleSide,
    });
    const trim = new THREE.MeshStandardMaterial({ map: stuccoTex(), color: tint, roughness: 0.95, side: THREE.DoubleSide });
    const tile = new THREE.MeshStandardMaterial({ map: roofTileTex(), color: active ? '#ffcf80' : '#ffffff', roughness: 0.85, side: THREE.DoubleSide });
    const concrete = new THREE.MeshStandardMaterial({ map: tiled(concreteTex(), 0.25, 0.25), color: active ? '#ffe08a' : '#ffffff', roughness: 1 });
    const gable = new THREE.MeshStandardMaterial({ map: stuccoTex(), color: '#f2e4c4', roughness: 0.95, side: THREE.DoubleSide });
    return { wall, trim, tile, concrete, gable };
  }, [st.facade, night, active, hover]);

  const handlers = onPick ? {
    onClick: (e: ThreeEvent<MouseEvent>) => { if (pickMode) return; e.stopPropagation(); onPick(b); },
    onPointerOver: (e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); setHover(true); document.body.style.cursor = pickMode ? 'crosshair' : 'pointer'; },
    onPointerOut: () => { setHover(false); document.body.style.cursor = ''; },
  } : {};

  // tháp chuông Nhà nguyện: ở đầu phía Tây Nam (v0)
  const tower = chapel ? { u: (box.u0 + box.u1) / 2, v: box.v0 + 2.2 } : null;

  return (
    <group {...handlers}>
      <mesh geometry={walls} material={mats.wall} castShadow receiveShadow />
      {parapet && <mesh geometry={parapet} material={mats.trim} castShadow />}
      {(st.roof === 'flat' || st.roof === 'solar') && (
        <mesh geometry={cap} material={mats.concrete} rotation={[-Math.PI / 2, 0, 0]} position={[0, wallH + 0.05, 0]} receiveShadow />
      )}
      {st.roof === 'flat' && (() => {
        const c = uv2xy([(box.u0 + box.u1) / 2 + 3, (box.v0 + box.v1) / 2]);
        return <group position={w3(c, wallH)} rotation={[0, (-42.6 * Math.PI) / 180, 0]}>
          <mesh position={[0, 1.4, 0]} castShadow material={mats.trim}><boxGeometry args={[4, 2.8, 3]} /></mesh>
          <mesh position={[4.5, 1.2, 0]} castShadow><cylinderGeometry args={[0.9, 0.9, 1.6, 14]} /><meshStandardMaterial color="#d0d4d8" metalness={0.6} roughness={0.35} /></mesh>
        </group>;
      })()}
      {roof && <mesh geometry={roof} material={mats.tile} castShadow receiveShadow />}
      {gables && <mesh geometry={gables} material={mats.gable} castShadow />}
      {panels.length > 0 && (
        <instancedMesh ref={panelRef} args={[undefined, undefined, panels.length]} castShadow>
          <boxGeometry args={[1.9, 0.06, 2.2]} />
          <meshStandardMaterial color="#1d3557" metalness={0.5} roughness={0.25} />
        </instancedMesh>
      )}
      {tower && (
        <group position={P(tower.u, tower.v, 0)} rotation={[0, (-42.6 * Math.PI) / 180, 0]}>
          <mesh position={[0, 8.5, 0]} castShadow material={mats.gable}><boxGeometry args={[4.6, 17, 4.6]} /></mesh>
          {/* ô cửa chuông */}
          {[[0, 2.31, 0], [0, -2.31, Math.PI], [2.31, 0, Math.PI / 2], [-2.31, 0, -Math.PI / 2]].map(([x, z, r], i) => (
            <mesh key={i} position={[x, 14.2, z]} rotation={[0, r, 0]}><planeGeometry args={[1.6, 2.8]} /><meshStandardMaterial color="#2a2522" /></mesh>
          ))}
          <mesh position={[0, 19.2, 0]} rotation={[0, Math.PI / 4, 0]} castShadow material={mats.tile}><coneGeometry args={[3.6, 4.4, 4]} /></mesh>
          <mesh position={[0, 22.4, 0]}><boxGeometry args={[0.25, 2.2, 0.25]} /><meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.3} /></mesh>
          <mesh position={[0, 22.8, 0]}><boxGeometry args={[1.2, 0.25, 0.25]} /><meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.3} /></mesh>
        </group>
      )}
    </group>
  );
}

/* ---------- Bầu trời & ánh sáng ---------- */
export const SUN: [number, number, number] = [-140, 110, -60];
export function WorldLights({ night }: { night: boolean }) {
  const sun = useRef<THREE.DirectionalLight>(null);
  useLayoutEffect(() => {
    const l = sun.current; if (!l) return;
    const c = l.shadow.camera; c.left = -190; c.right = 190; c.top = 190; c.bottom = -190; c.near = 10; c.far = 600; c.updateProjectionMatrix();
    l.shadow.bias = -0.0006; l.shadow.normalBias = 0.6;
  }, []);
  return (
    <>
      {night ? <color attach="background" args={['#0b1222']} /> : <Sky distance={4500} sunPosition={SUN} turbidity={6} rayleigh={1.4} mieCoefficient={0.006} mieDirectionalG={0.85} />}
      <fog attach="fog" args={night ? ['#0b1222', 220, 760] : ['#d9dfe3', 320, 1100]} />
      <hemisphereLight args={night ? ['#3a4a78', '#0d0d12', 0.35] : ['#dfeaff', '#7b6a52', 0.85]} />
      <ambientLight intensity={night ? 0.12 : 0.18} />
      <directionalLight ref={sun} position={night ? [80, 160, 60] : SUN} intensity={night ? 0.35 : 2.4} color={night ? '#9db4ff' : '#fff0d6'}
        castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
    </>
  );
}

/* ---------- Phố xung quanh: khối nhà giản lược (không có dữ liệu chi tiết, chỉ để tạo bối cảnh) ---------- */
const segDist = (p: XY, a: XY, b: XY) => {
  const dx = b[0] - a[0], dy = b[1] - a[1], L2 = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L2));
  return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy);
};
function CityBlocks({ night }: { night: boolean }) {
  const blocks = useMemo(() => {
    const camp = open(CAMPUS), segs: { a: XY; b: XY; w: number }[] = [];
    ROADS.forEach(([name, lines]) => lines.forEach(l => { for (let i = 0; i < l.length - 1; i++) segs.push({ a: l[i], b: l[i + 1], w: name === 'Lý Tự Trọng' || name === 'Nguyễn Du' ? 9 : 14 }); }));
    const campSegs = camp.map((a, i) => [a, camp[(i + 1) % camp.length]] as [XY, XY]);
    const out: { p: XY; w: number; d: number; h: number; c: number }[] = [];
    for (let u = -330; u <= 330; u += 17) for (let v = -330; v <= 330; v += 17) {
      if (rand(u * 7, v * 11) < 0.22) continue;
      if (Math.hypot(u, v) > 340) continue;
      const w = 9 + rand(u, v) * 5, d = 9 + rand(v, u) * 5, p = uv2xy([u, v]);
      const r = Math.hypot(w, d) / 2;
      if (inPoly(p, camp) || campSegs.some(([a, b]) => segDist(p, a, b) < r + 6)) continue;
      if (segs.some(s => segDist(p, s.a, s.b) < s.w / 2 + r + 4)) continue;
      const tall = rand(u * 2, v * 3);
      out.push({ p, w, d, h: tall > 0.97 ? 35 + tall * 30 : 6 + rand(u + 3, v) * 12, c: rand(u * 5, v) });
    }
    return out;
  }, []);
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = new THREE.Matrix4(), q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, (-42.6 * Math.PI) / 180, 0)), s = new THREE.Vector3(), v = new THREE.Vector3(), col = new THREE.Color();
    const tones = ['#d9d3c7', '#cfc8bb', '#e4ded2', '#c9cdd1', '#d8cbb5', '#bfc4c9'];
    blocks.forEach(({ p: [x, y], w, d, h, c }, i) => {
      ref.current!.setMatrixAt(i, m.compose(v.set(x, h / 2, -y), q, s.set(w, h, d)));
      ref.current!.setColorAt(i, col.set(tones[Math.floor(c * tones.length)]));
    });
    ref.current!.instanceMatrix.needsUpdate = true; if (ref.current!.instanceColor) ref.current!.instanceColor.needsUpdate = true;
  }, [blocks]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, blocks.length]} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} /><meshStandardMaterial roughness={0.95} color={night ? '#3a3f4c' : '#ffffff'} />
    </instancedMesh>
  );
}

/* ---------- Mặt đất, đường, tường rào, cây ---------- */
type CampusProps = {
  night: boolean;
  /** khu không trồng cây (sân khấu, bãi xe…) */
  clear?: Area[];
  /** khu lát gạch thêm (ngoài sân quanh toà nhà) */
  paved?: Area[];
  selected?: number | null;
  onPickBuilding?: (b: Building) => void;
  pickMode?: boolean;
  onGround?: (e: ThreeEvent<MouseEvent>) => void;
  /** bấm vào Nhà nguyện cổ */
  onChapel?: () => void;
};

const GATE: XY = [-92, -62];
const FRONT_STRIP: Area = { c: [-41, -65], s: [154, 30] };

function areaShape(a: Area) {
  const [cu, cv] = xy2uv(a.c), [w, h] = a.s;
  return shapeOf(([[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]] as XY[]).map(([du, dv]) => uv2xy([cu + du, cv + dv])));
}

export function RealCampus({ night, clear = [], paved = [], selected = null, onPickBuilding, pickMode, onGround, onChapel }: CampusProps) {
  const ground = useMemo(() => {
    const g = new THREE.ShapeGeometry(shapeOf(open(CAMPUS))); return g;
  }, []);
  const grass = useMemo(() => tiled(grassTex(), 1 / 8, 1 / 8), []);
  const pave = useMemo(() => tiled(pavingTex('grey'), 1 / 4, 1 / 4), []);
  const city = useMemo(() => tiled(pavingTex('grey'), 600, 600), []);
  // sân lát quanh mỗi toà (khung bao nới rộng 3 m) + dải sân trước + khu được truyền vào
  const pavedGeo = useMemo(() => {
    const shapes = BUILDINGS.map(b => { const o = obb(b.pts); return areaShape({ c: uv2xy([(o.u0 + o.u1) / 2, (o.v0 + o.v1) / 2]), s: [o.u1 - o.u0 + 7, o.v1 - o.v0 + 7] }); });
    return new THREE.ShapeGeometry([...shapes, areaShape(FRONT_STRIP), ...paved.map(areaShape)]);
  }, [paved]);

  // cây xanh: lưới có xê dịch, tránh toà nhà, sân lát và các khu sự kiện
  const trees = useMemo(() => {
    const out: { p: XY; k: number; c: number }[] = [];
    const camp = open(CAMPUS);
    for (let x = -135; x <= 135; x += 9) for (let y = -155; y <= 75; y += 9) {
      const p: XY = [x + (rand(x, y) - 0.5) * 6, y + (rand(y, x) - 0.5) * 6];
      if (!inPoly(p, camp) || [...clear, FRONT_STRIP].some(a => inArea(p, a, 3)) || BUILDINGS.some(b => { const o = obb(b.pts), [u, v] = xy2uv(p); return u > o.u0 - 4.5 && u < o.u1 + 4.5 && v > o.v0 - 4.5 && v < o.v1 + 4.5; })) continue;
      if (rand(x * 3, y * 7) < 0.18) continue;
      out.push({ p, k: 0.75 + rand(x + 1, y) * 0.6, c: rand(x, y + 3) });
    }
    // hàng cây dọc tường rào phía đường Tôn Đức Thắng
    for (let u = -70; u <= 95; u += 10) { const p = uv2xy([u, -96]); if (inPoly(p, camp) && !clear.some(a => inArea(p, a, 1))) out.push({ p, k: 0.8, c: rand(u, 1) }); }
    return out;
  }, [clear]);
  const trunk = useRef<THREE.InstancedMesh>(null), crownA = useRef<THREE.InstancedMesh>(null), crownB = useRef<THREE.InstancedMesh>(null), crownC = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), v = new THREE.Vector3(), col = new THREE.Color();
    const greens = ['#2f5a2b', '#3b6b33', '#466f2f', '#2a4f2c', '#4f7a38'];
    trees.forEach(({ p: [x, y], k, c }, i) => {
      trunk.current!.setMatrixAt(i, m.compose(v.set(x, 2.2 * k, -y), q, s.set(k, k, k)));
      const crowns = [[crownA, 0, 6.2, 0, 1], [crownB, 1.6, 5.4, 1.1, 0.75], [crownC, -1.5, 5.6, -1, 0.7]] as const;
      crowns.forEach(([ref, dx, dy, dz, sc]) => {
        ref.current!.setMatrixAt(i, m.compose(v.set(x + dx * k, dy * k, -y + dz * k), q.setFromEuler(new THREE.Euler(0, c * 6, 0)), s.set(k * sc, k * sc * 0.85, k * sc)));
        ref.current!.setColorAt(i, col.set(greens[Math.floor(c * greens.length)]).offsetHSL(0, 0, (sc - 0.85) * 0.12));
      });
    });
    [trunk, crownA, crownB, crownC].forEach(r => { r.current!.instanceMatrix.needsUpdate = true; if (r.current!.instanceColor) r.current!.instanceColor.needsUpdate = true; });
  }, [trees]);

  // tường rào + trụ, chừa lối Cổng số 6
  const fence = useMemo(() => {
    const q = open(CAMPUS), segs: { c: [number, number, number]; len: number; rot: number }[] = [], posts: [number, number, number][] = [];
    for (let i = 0; i < q.length; i++) {
      const a = q[i], b = q[(i + 1) % q.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (L < 0.5) continue;
      const dir: XY = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], rot = Math.atan2(dir[1], dir[0]);
      // cắt đoạn đi qua cổng
      const t = ((GATE[0] - a[0]) * dir[0] + (GATE[1] - a[1]) * dir[1]), dist = Math.abs((GATE[0] - a[0]) * dir[1] - (GATE[1] - a[1]) * dir[0]);
      const pieces: [number, number][] = dist < 12 && t > 0 && t < L ? [[0, Math.max(0, t - 6)], [Math.min(L, t + 6), L]] : [[0, L]];
      for (const [s0, s1] of pieces) {
        if (s1 - s0 < 0.3) continue;
        const m = (s0 + s1) / 2;
        segs.push({ c: [a[0] + dir[0] * m, 1.2, -(a[1] + dir[1] * m)], len: s1 - s0, rot });
        for (let s = s0; s <= s1; s += 5) posts.push([a[0] + dir[0] * s, 1.45, -(a[1] + dir[1] * s)]);
      }
    }
    return { segs, posts };
  }, []);
  const postRef = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    fence.posts.forEach((p, i) => { m.makeTranslation(...p); postRef.current!.setMatrixAt(i, m); });
    postRef.current!.instanceMatrix.needsUpdate = true;
  }, [fence]);
  const wallMat = useMemo(() => new THREE.MeshStandardMaterial({ map: tiled(stuccoTex(), 1 / 3, 1), roughness: 0.95 }), []);

  // đường phố: vỉa hè + mặt đường + vạch giữa
  const roads = useMemo(() => ROADS.flatMap(([name, lines]) => lines.map((l, i) => ({ key: name + i, pts: l, w: name === 'Lý Tự Trọng' || name === 'Nguyễn Du' ? 9 : 14 }))), []);
  const gateDir = useMemo(() => { const q = open(CAMPUS); let best = 0, bd = 1e9; q.forEach((a, i) => { const b = q[(i + 1) % q.length]; const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2; const d = Math.hypot(mx - GATE[0], my - GATE[1]); if (d < bd) { bd = d; best = Math.atan2(b[1] - a[1], b[0] - a[0]); } }); return best; }, []);

  return (
    <group>
      {/* nền thành phố */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, 0]} receiveShadow onClick={onGround}>
        <planeGeometry args={[2400, 2400]} /><meshStandardMaterial map={city} color={night ? '#3b3d44' : '#d6d2ca'} roughness={1} />
      </mesh>
      {roads.map(r => <Line key={r.key} points={r.pts.map(p => w3(p, -0.08))} color={night ? '#202124' : '#3d3e41'} lineWidth={r.w} worldUnits />)}
      {roads.map(r => <Line key={'c' + r.key} points={r.pts.map(p => w3(p, -0.06))} color="#e9e4d6" lineWidth={1.2} dashed dashSize={3} gapSize={4} transparent opacity={0.7} />)}
      <CityBlocks night={night} />
      {/* cỏ + sân lát trong khuôn viên */}
      <mesh geometry={ground} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow onClick={onGround}>
        <meshStandardMaterial map={grass} color={night ? '#5a6a5a' : '#ffffff'} roughness={1} />
      </mesh>
      <mesh geometry={pavedGeo} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.0, 0]} receiveShadow onClick={onGround}>
        <meshStandardMaterial map={pave} roughness={0.95} />
      </mesh>

      {/* toà nhà */}
      {BUILDINGS.map(b => b.name === 'Nhà nguyện cổ'
        ? <ChapelExterior key={b.i} night={night} active={selected === b.i}
            onEnter={onChapel ?? (onPickBuilding && !pickMode ? () => onPickBuilding(b) : undefined)} />
        : <RealBuilding key={b.i} b={b} night={night} active={selected === b.i} onPick={onPickBuilding} pickMode={pickMode} />)}

      {/* tường rào */}
      {fence.segs.map((s, i) => (
        <mesh key={i} position={s.c} rotation={[0, s.rot, 0]} material={wallMat} castShadow receiveShadow><boxGeometry args={[s.len, 2.4, 0.3]} /></mesh>
      ))}
      <instancedMesh ref={postRef} args={[undefined, undefined, fence.posts.length]} castShadow>
        <boxGeometry args={[0.55, 2.9, 0.55]} /><meshStandardMaterial color="#efe6d2" roughness={0.9} />
      </instancedMesh>
      {/* Cổng số 6 */}
      <group position={w3(GATE)} rotation={[0, gateDir, 0]}>
        {[-6, 6].map(x => <mesh key={x} position={[x, 2.6, 0]} castShadow><boxGeometry args={[1.4, 5.2, 1.4]} /><meshStandardMaterial color="#efe6d2" roughness={0.9} /></mesh>)}
        {[-6, 6].map(x => <mesh key={'c' + x} position={[x, 5.45, 0]}><boxGeometry args={[1.8, 0.5, 1.8]} /><meshStandardMaterial color="#9e4f35" /></mesh>)}
        <mesh position={[0, 5.3, 0]} castShadow><boxGeometry args={[11, 0.6, 0.5]} /><meshStandardMaterial color="#2b2a28" metalness={0.5} roughness={0.5} /></mesh>
        <mesh position={[0, 5.9, 0.27]}><planeGeometry args={[5, 0.9]} /><meshStandardMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={night ? 0.6 : 0.05} /></mesh>
      </group>

      {/* cây */}
      <instancedMesh ref={trunk} args={[undefined, undefined, trees.length]} castShadow>
        <cylinderGeometry args={[0.25, 0.4, 4.4, 6]} /><meshStandardMaterial color="#4a3627" roughness={1} />
      </instancedMesh>
      {[crownA, crownB, crownC].map((r, i) => (
        <instancedMesh key={i} ref={r} args={[undefined, undefined, trees.length]} castShadow receiveShadow>
          <icosahedronGeometry args={[3, 1]} /><meshStandardMaterial roughness={0.9} flatShading color={night ? '#7d8a9a' : '#ffffff'} />
        </instancedMesh>
      ))}
    </group>
  );
}
