import { useEffect, useLayoutEffect, useMemo, useRef, forwardRef, useImperativeHandle, type ReactNode } from 'react';
import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { CameraControls, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { ZONES, FACILITIES, PARKING, SPONSOR, CAMERAS, STAGE_FOCUS, seatsIn, type Zone } from './data';
import BACKDROP_IMG from '../../assets/photos/stage-backdrop.jpg';
import { BUILDINGS, ROADS, EVENT_AREAS, areaPts, xy2uv, uv2xy, type Area, type XY } from '../campus/data';
import { STAGE_POS, STAGE_ROT_Y, toWorld } from './frame';
import { RealCampus, WorldLights, w3, shapeOf } from '../world/RealCampus';
import { asphaltTex, pavingTex, tiled } from '../world/textures';
import { Walker, RemoteAvatars, type Me, type TouchInput, type EmoteState, type World } from '../walk/Walker';
import { ChapelInterior, CHAPEL_WORLD } from '../chapel/ChapelInterior';
import type { Net } from '../walk/presence';

export type WalkProps = {
  me: Me; net: Net; ids: string[]; touch: React.MutableRefObject<TouchInput>; emote: React.MutableRefObject<EmoteState>;
  /** đang ở đâu: khuôn viên hay bên trong Nhà nguyện */
  place: 'campus' | 'chapel';
  /** không gian khuôn viên (điểm xuất hiện thay đổi khi vừa từ Nhà nguyện bước ra) */
  world?: World;
  onMove?: (p: THREE.Vector3) => void;
  chapel?: { candles: number; notes: number; onCandle: () => void; onBoard: () => void };
};
const rand = (a: number, b: number) => { const t = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453; return t - Math.floor(t); };

export type Mode = 'audience' | 'sponsor';
export type SceneHandle = {
  preset: (k: keyof typeof CAMERAS) => void;
  flyTo: (pos: [number, number, number], look: [number, number, number]) => void;
  seatView: (z: Zone) => void;
};

const GOLD = new THREE.Color('#D4AF37');

/* ---------- vật liệu dùng chung ---------- */
function useGridTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const g = c.getContext('2d')!;
    g.fillStyle = '#8d958a'; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 400; i++) { g.fillStyle = `rgba(255,255,255,${Math.random() * 0.05})`; g.fillRect(Math.random() * 256, Math.random() * 256, 30, 30); }
    g.strokeStyle = 'rgba(235,235,225,0.55)'; g.lineWidth = 3;
    for (let i = 0; i <= 256; i += 64) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 256); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(256, i); g.stroke(); }
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    return t;
  }, []);
}

/** Vật liệu tự sáng vàng khi hạng mục được chọn (chế độ Nhà tài trợ) */
function Hi({ on, color, rough = 0.8, metal = 0 }: { on: boolean; color: string; rough?: number; metal?: number }) {
  return <meshStandardMaterial color={color} roughness={rough} metalness={metal} emissive={on ? GOLD : '#000'} emissiveIntensity={on ? 0.55 : 0} />;
}

function Box({ p, s, c, on = false, rough, metal }: { p: [number, number, number]; s: [number, number, number]; c: string; on?: boolean; rough?: number; metal?: number }) {
  return <mesh position={p}><boxGeometry args={s} /><Hi on={on} color={c} rough={rough} metal={metal} /></mesh>;
}

function Tag({ pos, children, tone = 'dark', onClick }: { pos: [number, number, number]; children: ReactNode; tone?: 'dark' | 'gold' | 'light'; onClick?: () => void }) {
  const cls = tone === 'gold' ? 'bg-gold text-black' : tone === 'light' ? 'bg-white/90 text-black' : 'bg-black/75 text-white border border-white/15';
  return (
    <Html position={pos} center zIndexRange={[10, 0]}>
      <div onClick={onClick}
        className={`${cls} ${onClick ? 'cursor-pointer' : 'pointer-events-none'} whitespace-nowrap rounded-full px-2.5 py-0.5 text-[12px] font-bold shadow-lg select-none`}>
        {children}
      </div>
    </Html>
  );
}

/* ---------- Sân khấu theo phối cảnh thiết kế ---------- */
function StoneStair({ x, y, z, dir }: { x: number; y: number; z: number; dir: 1 | -1 }) {
  const steps = [[2.6, 0.45], [2.0, 0.9], [1.4, 1.35], [0.8, 1.8]];
  return (
    <group position={[x, y, z]}>
      {steps.map(([w, h], i) => (
        <Box key={i} p={[dir * (i * 0.5), h / 2, 0]} s={[w - i * 0.3, h, 1.6]} c="#a07a52" rough={0.95} />
      ))}
    </group>
  );
}

function Stage({ sel }: { sel: string | null }) {
  const grid = useGridTexture();
  const lowerTex = useMemo(() => { const t = grid.clone(); t.needsUpdate = true; t.repeat.set(13, 3.5); return t; }, [grid]);
  const upperTex = useMemo(() => { const t = grid.clone(); t.needsUpdate = true; t.repeat.set(10, 2.5); return t; }, [grid]);
  const backdrop = useLoader(THREE.TextureLoader, BACKDROP_IMG);
  backdrop.colorSpace = THREE.SRGBColorSpace;
  const set = sel === 'canh-tri', led = sel === 'led', snd = sel === 'am-thanh', lit = sel === 'anh-sang', bk = sel === 'phuc-trang', hc = sel === 'hau-can';

  return (
    <group>
      {/* Tầng dưới + bậc trước */}
      <mesh position={[0, 0.5, -3.5]}><boxGeometry args={[26, 1, 7]} />
        <meshStandardMaterial attach="material-0" color="#6f665a" /><meshStandardMaterial attach="material-1" color="#6f665a" />
        <meshStandardMaterial attach="material-2" map={lowerTex} emissive={set ? GOLD : '#000'} emissiveIntensity={set ? 0.35 : 0} />
        <meshStandardMaterial attach="material-3" color="#3d3833" /><meshStandardMaterial attach="material-4" color="#4a433b" /><meshStandardMaterial attach="material-5" color="#4a433b" />
      </mesh>
      {[0, 1, 2].map(i => <Box key={i} p={[0, (0.75 - i * 0.25) / 2, 0.25 + i * 0.5]} s={[26, 0.75 - i * 0.25, 0.5]} c={i % 2 ? '#3b3632' : '#2f2b28'} />)}
      {/* Tầng trên */}
      <mesh position={[0, 1, -9.5]}><boxGeometry args={[21, 2, 5]} />
        <meshStandardMaterial attach="material-0" color="#55504a" /><meshStandardMaterial attach="material-1" color="#55504a" />
        <meshStandardMaterial attach="material-2" map={upperTex} emissive={set ? GOLD : '#000'} emissiveIntensity={set ? 0.35 : 0} />
        <meshStandardMaterial attach="material-3" color="#3d3833" /><meshStandardMaterial attach="material-4" color="#4e5a5e" /><meshStandardMaterial attach="material-5" color="#4e5a5e" />
      </mesh>
      {/* Cầu thang giữa */}
      {[0, 1, 2, 3].map(i => <Box key={i} p={[0, 1 + (1 - i * 0.25) / 2, -6.75 + i * 0.5]} s={[6, 1 - i * 0.25, 0.5]} c={i % 2 ? '#c9b89c' : '#b6a385'} on={set} />)}
      {/* Bậc đá */}
      <StoneStair x={-8.2} y={2} z={-10.3} dir={-1} />
      <StoneStair x={8.2} y={2} z={-10.3} dir={1} />
      <StoneStair x={-6.2} y={1} z={-3.6} dir={-1} />
      <StoneStair x={6.2} y={1} z={-3.6} dir={1} />
      {set && <mesh position={[0, 3, -7]}><boxGeometry args={[22, 4, 11]} /><meshBasicMaterial color={GOLD} transparent opacity={0.07} depthWrite={false} /></mesh>}

      {/* Màn LED nền */}
      <Box p={[0, 6.2, -12.5]} s={[23, 8.8, 0.4]} c="#151515" on={led} />
      <mesh position={[0, 6.2, -12.28]}><planeGeometry args={[22, 8]} /><meshBasicMaterial map={backdrop} toneMapped={false} /></mesh>
      {/* Khung sân khấu (proscenium) */}
      <Box p={[-13.6, 6.5, -0.6]} s={[0.9, 13, 0.9]} c="#cfc6b6" />
      <Box p={[13.6, 6.5, -0.6]} s={[0.9, 13, 0.9]} c="#cfc6b6" />
      <Box p={[0, 13.4, -0.6]} s={[28.2, 1.8, 1]} c="#2a2724" />

      {/* Giàn đèn (truss) */}
      {[-3.5, -8, -12.5].map(z => <Box key={z} p={[0, 12.2, z]} s={[26, 0.45, 0.45]} c="#9a9a9a" metal={0.6} rough={0.4} on={lit} />)}
      {[-12.6, 12.6].map(x => <Box key={x} p={[x, 12.2, -8]} s={[0.45, 0.45, 9.5]} c="#9a9a9a" metal={0.6} rough={0.4} on={lit} />)}
      {[-3.5, -8].flatMap(z => Array.from({ length: 9 }, (_, i) => (
        <mesh key={`${z}-${i}`} position={[-10 + i * 2.5, 11.6, z]}><cylinderGeometry args={[0.22, 0.28, 0.6, 10]} /><Hi on={lit} color="#202020" metal={0.5} rough={0.4} /></mesh>
      )))}

      {/* Loa treo hai bên */}
      {[-15.6, 15.6].map(x => (
        <group key={x}>{Array.from({ length: 8 }, (_, i) => <Box key={i} p={[x, 11.2 - i * 0.48, -0.4]} s={[1.1, 0.42, 0.9]} c="#1b1b1b" on={snd} />)}</group>
      ))}

      {/* Màn LED hai bên */}
      {[-17.5, 17.5].map(x => (
        <group key={x} position={[x, 0, 1.6]}>
          <Box p={[-2.9, 4.5, 0]} s={[0.35, 9, 0.35]} c="#777" metal={0.5} />
          <Box p={[2.9, 4.5, 0]} s={[0.35, 9, 0.35]} c="#777" metal={0.5} />
          <Box p={[0, 7.2, -0.1]} s={[6.2, 3.8, 0.3]} c="#111" on={led} />
          <mesh position={[0, 7.2, 0.07]}><planeGeometry args={[5.8, 3.4]} /><meshBasicMaterial map={backdrop} toneMapped={false} /></mesh>
        </group>
      ))}

      {/* Hậu đài: lều phục trang – trang điểm (phía sau, bên trái sân khấu) */}
      <group position={[-16, 0, -11]}>
        <Box p={[0, 1.4, 0]} s={[7, 2.8, 6]} c="#e8e2d6" on={bk} />
        <mesh position={[0, 3.5, 0]} rotation={[0, Math.PI / 4, 0]}><coneGeometry args={[5, 1.6, 4]} /><Hi on={bk} color="#f2eee6" /></mesh>
      </group>
      {/* Hậu cần: suất ăn – nước uống (phía sau, bên phải sân khấu) */}
      <group position={[16, 0, -11]}>
        <Box p={[0, 1.3, 0]} s={[7, 2.6, 5]} c="#d8cfbf" on={hc} />
        <mesh position={[0, 3.2, 0]} rotation={[0, Math.PI / 4, 0]}><coneGeometry args={[5.2, 1.4, 4]} /><Hi on={hc} color="#efe9df" /></mesh>
      </group>
    </group>
  );
}

/* ---------- Khán đài ---------- */
function ZoneSeats({ zone, dim, onPick }: { zone: Zone; dim: boolean; onPick: (z: Zone) => void }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const seats = useMemo(() => (zone.rects ?? []).flatMap(seatsIn), [zone]);
  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    seats.forEach(([x, z], i) => { m.makeTranslation(x, 0.4, z); ref.current!.setMatrixAt(i, m); });
    ref.current!.instanceMatrix.needsUpdate = true;
  }, [seats]);
  return (
    <group>
      <instancedMesh ref={ref} args={[undefined, undefined, seats.length]}>
        <boxGeometry args={[0.44, 0.8, 0.42]} />
        <meshStandardMaterial color={dim ? '#3a3a3a' : zone.color} roughness={0.7} transparent opacity={dim ? 0.55 : 1} />
      </instancedMesh>
      {(zone.rects ?? []).map((r, i) => (
        <mesh key={i} position={[(r.x0 + r.x1) / 2, 0.85, (r.z0 + r.z1) / 2]} rotation={[-Math.PI / 2, 0, 0]}
          onClick={e => { e.stopPropagation(); onPick(zone); }}
          onPointerOver={() => (document.body.style.cursor = 'pointer')} onPointerOut={() => (document.body.style.cursor = '')}>
          <planeGeometry args={[r.x1 - r.x0, r.z1 - r.z0]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function FOH({ sel }: { sel: string | null }) {
  const snd = sel === 'am-thanh', cam = sel === 'livestream', lit = sel === 'anh-sang';
  return (
    <group position={[0, 0, 31]}>
      <Box p={[0, 0.3, 0]} s={[9, 0.6, 5.5]} c="#2b2b2b" on={snd} />
      <Box p={[-1.5, 1.1, 0.5]} s={[4, 1, 1.2]} c="#111" on={snd} />
      <Box p={[0, 3.4, 0]} s={[9.4, 0.15, 5.9]} c="#444" />
      {[[-4.4, -2.7], [4.4, -2.7], [-4.4, 2.7], [4.4, 2.7]].map(([x, z], i) => <Box key={i} p={[x, 1.85, z]} s={[0.15, 3.1, 0.15]} c="#777" />)}
      {/* bục máy quay trung tâm + đèn follow */}
      <Box p={[2.6, 1.2, -1.2]} s={[1.8, 1.2, 1.6]} c="#3a3a3a" on={cam} />
      <Box p={[2.6, 2.1, -1.2]} s={[0.5, 0.5, 0.9]} c="#0d0d0d" on={cam} />
      {[-3, 3].map(x => <mesh key={x} position={[x, 4, -2.3]} rotation={[Math.PI / 2.4, 0, 0]}><cylinderGeometry args={[0.25, 0.35, 1, 10]} /><Hi on={lit} color="#202020" /></mesh>)}
    </group>
  );
}

function Cameras({ sel }: { sel: string | null }) {
  const on = sel === 'livestream';
  return (
    <group>
      {[-20.5, 20.5].map(x => (
        <group key={x} position={[x, 0, 18]}>
          <Box p={[0, 1.5, 0]} s={[2.4, 3, 2.4]} c="#3a3a3a" on={on} />
          <Box p={[0, 3.35, 0]} s={[0.5, 0.5, 0.9]} c="#0d0d0d" on={on} />
        </group>
      ))}
      {/* máy quay cẩu trước sân khấu */}
      <group position={[11.5, 0, 2.8]}>
        <mesh position={[0, 1.3, 0]}><cylinderGeometry args={[0.15, 0.25, 2.6, 8]} /><Hi on={on} color="#555" /></mesh>
        <mesh position={[-1.6, 3.1, -0.6]} rotation={[0, 0.4, 0.5]}><boxGeometry args={[4.4, 0.16, 0.16]} /><Hi on={on} color="#777" /></mesh>
        <Box p={[-3.5, 4.2, -1.4]} s={[0.4, 0.4, 0.7]} c="#0d0d0d" on={on} />
      </group>
    </group>
  );
}

/* ---------- Bối cảnh khuôn viên dựng như thật (world/RealCampus) ---------- */
const CLOTHES = ['#f2f2f0', '#22252b', '#3d5a80', '#9b2c2c', '#e0c48a', '#5b7d5a', '#7a5c8e', '#c96f3b', '#2f4858', '#d9d2c5'];

/* ---------- Khu đứng: nền màu nhạt + đám đông ---------- */
function StandZone({ zone, dim, active, onPick }: { zone: Zone; dim: boolean; active: boolean; onPick: (z: Zone) => void }) {
  const a = zone.area!;
  const geo = useMemo(() => new THREE.ShapeGeometry(shapeOf(areaPts(a))), [a]);
  const outline = useMemo(() => { const p = areaPts(a); return [...p, p[0]].map(q => w3(q, 0.08)); }, [a]);
  const people = useMemo(() => {
    const [cu, cv] = xy2uv(a.c), [w, h] = a.s, out: { p: XY; k: number; c: number }[] = [];
    for (let i = 0.7; i < w - 0.5; i += 1.15) for (let j = 0.7; j < h - 0.5; j += 1.15) {
      if (rand(i * 5, j * 3) < 0.12) continue;
      out.push({ p: uv2xy([cu - w / 2 + i + (rand(i, j) - 0.5) * 0.7, cv - h / 2 + j + (rand(j, i) - 0.5) * 0.7]), k: 0.92 + rand(j, i * 2) * 0.16, c: rand(i * 7, j) });
    }
    return out;
  }, [a]);
  const body = useRef<THREE.InstancedMesh>(null), head = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), v = new THREE.Vector3(), col = new THREE.Color();
    people.forEach(({ p: [x, y], k, c }, i) => {
      body.current!.setMatrixAt(i, m.compose(v.set(x, 0.72 * k, -y), q, s.set(1, k, 1)));
      head.current!.setMatrixAt(i, m.compose(v.set(x, 1.58 * k, -y), q, s.set(1, 1, 1)));
      body.current!.setColorAt(i, col.set(dim ? '#555' : CLOTHES[Math.floor(c * CLOTHES.length)]));
      head.current!.setColorAt(i, col.set(dim ? '#666' : c > 0.5 ? '#c99a74' : '#b07f5a'));
    });
    [body, head].forEach(r => { r.current!.instanceMatrix.needsUpdate = true; if (r.current!.instanceColor) r.current!.instanceColor.needsUpdate = true; });
  }, [people, dim]);
  return (
    <group>
      <mesh geometry={geo} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}
        onClick={e => { e.stopPropagation(); onPick(zone); }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')} onPointerOut={() => (document.body.style.cursor = '')}>
        <meshBasicMaterial color={dim ? '#3a3a3a' : zone.color} transparent opacity={active ? 0.45 : 0.22} depthWrite={false} />
      </mesh>
      <Line points={outline} color={dim ? '#666' : zone.color} lineWidth={1.5} dashed dashSize={2} gapSize={1.2} />
      <instancedMesh ref={body} args={[undefined, undefined, people.length]} castShadow>
        <capsuleGeometry args={[0.22, 1, 3, 8]} /><meshStandardMaterial roughness={0.85} />
      </instancedMesh>
      <instancedMesh ref={head} args={[undefined, undefined, people.length]}>
        <sphereGeometry args={[0.13, 10, 8]} /><meshStandardMaterial roughness={0.7} />
      </instancedMesh>
    </group>
  );
}

/* ---------- Bãi giữ xe: nhựa đường, vạch kẻ, xe máy ---------- */
function ParkingArea({ area }: { area: Area }) {
  const geo = useMemo(() => new THREE.ShapeGeometry(shapeOf(areaPts(area))), [area]);
  const asphalt = useMemo(() => tiled(asphaltTex(), 1 / 8, 1 / 8), []);
  const { stalls, bikes } = useMemo(() => {
    const [cu, cv] = xy2uv(area.c), [w, h] = area.s, arr: number[] = [], bikes: { p: XY; c: number }[] = [];
    const seg = (a: XY, b: XY) => arr.push(a[0], 0.09, -a[1], b[0], 0.09, -b[1]);
    for (let v = -h / 2 + 3; v <= h / 2 - 3; v += 6) {
      seg(uv2xy([cu - w / 2 + 2, cv + v]), uv2xy([cu + w / 2 - 2, cv + v]));
      for (let u = -w / 2 + 2; u <= w / 2 - 2; u += 2.5) seg(uv2xy([cu + u, cv + v - 1.6]), uv2xy([cu + u, cv + v + 1.6]));
      // xe máy đậu thành hàng (khoảng 60% chỗ)
      for (let u = -w / 2 + 2.4; u <= w / 2 - 2.4; u += 0.85) for (const side of [-0.95, 0.95])
        if (rand(u * 3 + v, side * 5) < 0.6) bikes.push({ p: uv2xy([cu + u, cv + v + side]), c: rand(u, v + side) });
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3)); return { stalls: g, bikes };
  }, [area]);
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = new THREE.Matrix4(), q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, STAGE_ROT_Y + Math.PI / 2, 0)), s = new THREE.Vector3(1, 1, 1), v = new THREE.Vector3(), col = new THREE.Color();
    const paint = ['#b3261e', '#1f3b73', '#e8e8e8', '#1c1c1c', '#8a8f96', '#2e6b3a'];
    bikes.forEach(({ p: [x, y], c }, i) => { ref.current!.setMatrixAt(i, m.compose(v.set(x, 0.55, -y), q, s)); ref.current!.setColorAt(i, col.set(paint[Math.floor(c * paint.length)])); });
    ref.current!.instanceMatrix.needsUpdate = true; if (ref.current!.instanceColor) ref.current!.instanceColor.needsUpdate = true;
  }, [bikes]);
  return (
    <group>
      <mesh geometry={geo} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]} receiveShadow><meshStandardMaterial map={asphalt} color="#9aa0a6" roughness={1} /></mesh>
      <lineSegments geometry={stalls}><lineBasicMaterial color="#e8e4d8" /></lineSegments>
      <instancedMesh ref={ref} args={[undefined, undefined, bikes.length]} castShadow>
        <boxGeometry args={[0.35, 0.9, 1.75]} /><meshStandardMaterial roughness={0.5} metalness={0.3} />
      </instancedMesh>
    </group>
  );
}

/** Bật bóng đổ cho mọi khối trong nhóm (sân khấu, ghế, FOH…) */
function ShadowAll({ children }: { children: ReactNode }) {
  const g = useRef<THREE.Group>(null);
  useLayoutEffect(() => { g.current?.traverse(o => { if ((o as THREE.Mesh).isMesh) { o.castShadow = true; o.receiveShadow = true; } }); });
  return <group ref={g}>{children}</group>;
}

/** Đèn sân khấu ban đêm: các luồng đèn màu chiếu xuống sàn diễn */
function StageLights({ night }: { night: boolean }) {
  const targets = useMemo(() => [-8, -3, 3, 8].map(x => { const o = new THREE.Object3D(); o.position.set(x, 1, -6); return o; }), []);
  if (!night) return null;
  const cols = ['#ffb347', '#ff6fa8', '#7fb2ff', '#ffd27a'];
  return (
    <group>
      {targets.map((t, i) => <primitive key={'t' + i} object={t} />)}
      {targets.map((t, i) => (
        <spotLight key={i} position={[-10 + i * 6.6, 12, -3.5]} target={t} angle={0.45} penumbra={0.6} intensity={900} distance={40} decay={1.6} color={cols[i]} />
      ))}
      <spotLight position={[0, 9, 31]} target={targets[1]} angle={0.16} penumbra={0.4} intensity={2500} distance={60} decay={1.4} color="#fff6e0" />
    </group>
  );
}

/* ---------- Cảnh tổng ---------- */
type Props = { mode: Mode; night: boolean; walk?: WalkProps | null; selZone: Zone | null; selItem: string | null; onPickZone: (z: Zone) => void; onPickItem: (id: string) => void; onChapel?: () => void };

const Scene = forwardRef<SceneHandle, Props>(function Scene({ mode, night, walk = null, selZone, selItem, onPickZone, onPickItem, onChapel }, ref) {
  const cc = useRef<CameraControls>(null);
  const { size } = useThree();
  // Màn hình dọc (điện thoại): lùi camera xa hơn để thấy trọn sân khấu và khán đài
  const far = size.width / size.height < 1 ? 1.75 : 1;
  // Các góc camera khai báo trong hệ sân khấu → đổi sang toạ độ khuôn viên
  const presetPos = (k: keyof typeof CAMERAS) => {
    const c = CAMERAS[k];
    const p = k === 'stage' ? c.pos : c.pos.map((v, i) => c.look[i] + (v - c.look[i]) * far) as [number, number, number];
    return { pos: toWorld(p), look: toWorld(c.look) };
  };
  useImperativeHandle(ref, () => ({
    preset: k => { const c = presetPos(k); cc.current?.setLookAt(...c.pos, ...c.look, true); },
    flyTo: (pos, look) => cc.current?.setLookAt(...toWorld(pos), ...toWorld(look), true),
    seatView: z => cc.current?.setLookAt(...toWorld([z.seat[0], z.kind === 'stand' ? 2.6 : 1.25, z.seat[1]]), ...toWorld(STAGE_FOCUS), true),
  }), [far]);
  useEffect(() => { const c = presetPos('overview'); cc.current?.setLookAt(...c.pos, ...c.look, false); }, [far, !!walk]);
  const item = mode === 'sponsor' ? selItem : null;
  const plaza = useMemo(() => tiled(pavingTex('warm'), 42 / 4, 50 / 4), []);
  const showLabels = mode === 'audience' && !walk;

  if (walk?.place === 'chapel') return (
    <>
      <ChapelInterior candles={walk.chapel?.candles ?? 0} notes={walk.chapel?.notes ?? 0} onCandle={walk.chapel?.onCandle} onBoard={walk.chapel?.onBoard} />
      <Walker me={walk.me} net={walk.net} touch={walk.touch} emote={walk.emote} world={CHAPEL_WORLD} onMove={walk.onMove} />
      <RemoteAvatars ids={walk.ids} net={walk.net} />
    </>
  );

  return (
    <>
      <WorldLights night={night} />
      <RealCampus night={night} clear={Object.values(EVENT_AREAS)} onChapel={onChapel} />
      {PARKING.map(p => <ParkingArea key={p.id} area={p.area} />)}
      {showLabels && <>
        {PARKING.map(p => <Tag key={p.id} pos={w3(p.area.c, 2).toArray() as [number, number, number]} tone="light">🅿 {p.label}</Tag>)}
        {BUILDINGS.filter(b => b.name).map(b => <Tag key={b.i} pos={w3(b.center, b.h + 7).toArray() as [number, number, number]} tone={b.name === 'Nhà nguyện cổ' ? 'light' : 'dark'}>{b.name}</Tag>)}
        {ROADS.filter(([n]) => n === 'Tôn Đức Thắng' || n === 'Nguyễn Bỉnh Khiêm').map(([name, lines]) => {
          const l = lines.reduce((a, b) => (b.length > a.length ? b : a)); const mid = l[Math.floor(l.length / 2)];
          return <Html key={name} position={w3(mid, 1)} center><div className="pointer-events-none whitespace-nowrap rounded-full bg-black/55 px-2 text-[11px] italic text-white/85">{name}</div></Html>;
        })}
      </>}

      <group position={STAGE_POS} rotation={[0, STAGE_ROT_Y, 0]}>
      <pointLight position={[0, 16, 14]} intensity={night ? 2600 : 500} distance={70} decay={2} color="#ffd9a0" />
      <StageLights night={night} />
      <ShadowAll>
      {/* sân lát gạch, lối đi giữa và hai lối ngang */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 10]}><planeGeometry args={[42, 50]} /><meshStandardMaterial map={plaza} roughness={0.95} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 15.9]}><planeGeometry args={[2, 23.8]} /><meshStandardMaterial color="#8a2f2a" roughness={0.9} /></mesh>
      {[9.95, 16.45].map(z => <mesh key={z} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, z]}><planeGeometry args={[40, 1.1]} /><meshStandardMaterial color="#8a7a66" /></mesh>)}
      <Stage sel={item} />
      <FOH sel={item} />
      <Cameras sel={item} />
      {ZONES.filter(z => z.kind === 'seat').map(z => <ZoneSeats key={z.id} zone={z} dim={mode === 'sponsor' || (!!selZone && selZone.id !== z.id)} onPick={onPickZone} />)}
      </ShadowAll>

      {showLabels && <>
        <Tag pos={[0, 15.5, -1]} tone="gold">Sân khấu</Tag>
        {ZONES.filter(z => z.kind === 'seat').map(z => {
          const r = z.rects![0];
          return <Tag key={z.id} pos={[(r.x0 + r.x1) / 2, 3, (r.z0 + r.z1) / 2]} tone={selZone?.id === z.id ? 'gold' : 'dark'} onClick={() => onPickZone(z)}>{z.short}</Tag>;
        })}
        {FACILITIES.map(f => <Tag key={f.id} pos={[f.pos[0], 2.2, f.pos[2]]} tone="light">{f.label}</Tag>)}
        <Tag pos={[0, 5, 31]}>FOH · Âm thanh – Ánh sáng</Tag>
      </>}

      {mode === 'sponsor' && SPONSOR.map(s => (
        <Tag key={s.id} pos={s.label} tone={selItem === s.id ? 'gold' : 'dark'} onClick={() => onPickItem(s.id)}>{s.name}</Tag>
      ))}
      </group>

      {ZONES.filter(z => z.kind === 'stand').map(z => (
        <StandZone key={z.id} zone={z} active={selZone?.id === z.id} dim={mode === 'sponsor' || (!!selZone && selZone.id !== z.id)} onPick={onPickZone} />
      ))}
      {showLabels && ZONES.filter(z => z.kind === 'stand').map(z => (
        <Tag key={z.id} pos={w3(z.area!.c, 3.5).toArray() as [number, number, number]} tone={selZone?.id === z.id ? 'gold' : 'dark'} onClick={() => onPickZone(z)}>{z.short}</Tag>
      ))}

      {walk ? <>
        <Walker me={walk.me} net={walk.net} touch={walk.touch} emote={walk.emote} world={walk.world} onMove={walk.onMove} />
        <RemoteAvatars ids={walk.ids} net={walk.net} />
      </> : <CameraControls ref={cc} minDistance={4} maxDistance={420} maxPolarAngle={Math.PI / 2.05} smoothTime={0.6} />}
    </>
  );
});

const StageScene = forwardRef<SceneHandle, Props>(function StageScene(props, ref) {
  return (
    <Canvas shadows dpr={[1, 1.75]} camera={{ fov: 45, near: 0.5, far: 3000, position: toWorld(CAMERAS.overview.pos) }} gl={{ antialias: true }}
      onPointerMissed={() => (document.body.style.cursor = '')}>
      <Scene ref={ref} {...props} />
    </Canvas>
  );
});

export default StageScene;
