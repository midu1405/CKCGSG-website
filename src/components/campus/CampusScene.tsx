import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Canvas, type ThreeEvent } from '@react-three/fiber';
import { CameraControls, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { CAMPUS, ROADS, BUILDINGS, MARKERS, KIND_STYLE, CAMPUS_ANGLE, type Building, type Marker, type XY } from './data';

export type CampusHandle = { top: () => void; perspective: () => void; focus: (p: XY, dist?: number) => void };
type Props = {
  sel: { type: 'b'; b: Building } | { type: 'm'; m: Marker } | null;
  onPickBuilding: (b: Building) => void;
  onPickMarker: (m: Marker) => void;
  pickMode: boolean;
  onPickPoint: (p: XY) => void;
  picked: XY | null;
};

const GOLD = '#D4AF37';
/** local (x Đông, y Bắc) → three (x, 0, -y) */
const v3 = ([x, y]: XY, h = 0) => new THREE.Vector3(x, h, -y);
const shapeOf = (pts: XY[]) => new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));

function Label({ pos, children, tone = 'dark', onClick }: { pos: THREE.Vector3 | [number, number, number]; children: React.ReactNode; tone?: 'dark' | 'gold' | 'light' | 'road'; onClick?: () => void }) {
  const cls = tone === 'gold' ? 'bg-gold text-black' : tone === 'light' ? 'bg-white/90 text-black'
    : tone === 'road' ? 'text-white/70 italic font-medium' : 'bg-black/75 text-white border border-white/15';
  return (
    <Html position={pos} center zIndexRange={[10, 0]}>
      <div onClick={onClick} className={`${cls} ${onClick ? 'cursor-pointer' : 'pointer-events-none'} ${tone === 'road' ? 'text-[11px]' : 'rounded-full px-2.5 py-0.5 text-[12px] font-bold shadow-lg'} whitespace-nowrap select-none`}>
        {children}
      </div>
    </Html>
  );
}

function BuildingMesh({ b, active, onPick, pickMode }: { b: Building; active: boolean; onPick: (b: Building) => void; pickMode: boolean }) {
  const geo = useMemo(() => new THREE.ExtrudeGeometry(shapeOf(b.pts), { depth: b.h, bevelEnabled: false }), [b]);
  const [hover, setHover] = useState(false);
  return (
    <mesh geometry={geo} rotation={[-Math.PI / 2, 0, 0]}
      onClick={e => { if (pickMode) return; e.stopPropagation(); onPick(b); }}
      onPointerOver={e => { e.stopPropagation(); setHover(true); document.body.style.cursor = pickMode ? 'crosshair' : 'pointer'; }}
      onPointerOut={() => { setHover(false); document.body.style.cursor = ''; }}>
      <meshStandardMaterial color={active ? GOLD : b.name ? '#c98a5a' : '#9a6a4c'} emissive={hover || active ? '#3a2a10' : '#000'} roughness={0.85} />
    </mesh>
  );
}

function RotRect({ center, size, color }: { center: XY; size: [number, number]; color: string }) {
  const [w, h] = size;
  const a = (CAMPUS_ANGLE * Math.PI) / 180;
  const corners = ([[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2], [-w / 2, -h / 2]] as XY[])
    .map(([u, v]) => [center[0] + u * Math.cos(a) - v * Math.sin(a), center[1] + u * Math.sin(a) + v * Math.cos(a)] as XY);
  const geo = useMemo(() => new THREE.ShapeGeometry(shapeOf(corners)), [center, size]);
  return (
    <group>
      <mesh geometry={geo} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.25, 0]}>
        <meshBasicMaterial color={color} transparent opacity={0.28} depthWrite={false} />
      </mesh>
      <Line points={corners.map(c => v3(c, 0.3))} color={color} lineWidth={2} dashed dashSize={3} gapSize={2} />
    </group>
  );
}

function Pin({ pos, color, active }: { pos: XY; color: string; active: boolean }) {
  return (
    <group position={v3(pos)}>
      <mesh position={[0, 4, 0]}><cylinderGeometry args={[0.4, 0.4, 8, 8]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[0, 9, 0]}><sphereGeometry args={[active ? 2.6 : 2, 16, 12]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={active ? 0.6 : 0.25} /></mesh>
    </group>
  );
}

const Scene = forwardRef<CampusHandle, Props>(function Scene({ sel, onPickBuilding, onPickMarker, pickMode, onPickPoint, picked }, ref) {
  const cc = useRef<CameraControls>(null);
  const campusGeo = useMemo(() => new THREE.ShapeGeometry(shapeOf(CAMPUS)), []);
  const top = () => cc.current?.setLookAt(0, 360, 0.01, 0, 0, 0, true);
  const perspective = () => cc.current?.setLookAt(-210, 165, 250, 5, 0, 30, true);
  useImperativeHandle(ref, () => ({
    top, perspective,
    focus: (p, dist = 110) => { const t = v3(p); cc.current?.setLookAt(t.x - dist * 0.55, dist * 0.8, t.z + dist * 0.75, t.x, 0, t.z, true); },
  }), []);
  useEffect(() => { cc.current?.setLookAt(0, 360, 0.01, 0, 0, 0, false); }, []);

  const onGround = (e: ThreeEvent<MouseEvent>) => {
    if (!pickMode) return;
    e.stopPropagation();
    onPickPoint([Math.round(e.point.x), Math.round(-e.point.z)]);
  };

  return (
    <>
      <color attach="background" args={['#0a0a0a']} />
      <ambientLight intensity={0.7} />
      <hemisphereLight args={['#fff1d6', '#1a1410', 0.5]} />
      <directionalLight position={[-120, 220, 160]} intensity={1.2} color="#ffe6c0" />

      {/* nền + khuôn viên */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} onClick={onGround}
        onPointerOver={() => pickMode && (document.body.style.cursor = 'crosshair')} onPointerOut={() => (document.body.style.cursor = '')}>
        <planeGeometry args={[900, 900]} /><meshStandardMaterial color="#151412" />
      </mesh>
      <mesh geometry={campusGeo} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} onClick={onGround}>
        <meshStandardMaterial color="#26302a" roughness={1} />
      </mesh>
      <Line points={CAMPUS.map(p => v3(p, 0.4))} color={GOLD} lineWidth={2.5} />

      {/* đường */}
      {ROADS.map(([name, lines]) => lines.map((l, i) => (
        <Line key={name + i} points={l.map(p => v3(p, 0.02))} color="#57524a" lineWidth={name === 'Lý Tự Trọng' || name === 'Nguyễn Du' ? 9 : 14} worldUnits />
      )))}
      {ROADS.map(([name, lines]) => {
        const l = lines.reduce((a, b) => (b.length > a.length ? b : a));
        const mid = l[Math.floor(l.length / 2)];
        return <Label key={name} pos={v3(mid, 1)} tone="road">{name}</Label>;
      })}

      {/* toà nhà */}
      {BUILDINGS.map(b => <BuildingMesh key={b.i} b={b} active={sel?.type === 'b' && sel.b.i === b.i} onPick={onPickBuilding} pickMode={pickMode} />)}
      {BUILDINGS.filter(b => b.name).map(b => (
        <Label key={b.i} pos={v3(b.center, b.h + 4)} tone={sel?.type === 'b' && sel.b.i === b.i ? 'gold' : 'dark'} onClick={() => onPickBuilding(b)}>{b.name}</Label>
      ))}

      {/* điểm đánh dấu */}
      {MARKERS.map(m => {
        const color = KIND_STYLE[m.kind].color, active = sel?.type === 'm' && sel.m.id === m.id;
        return (
          <group key={m.id}>
            {m.size ? <RotRect center={m.pos} size={m.size} color={color} /> : <Pin pos={m.pos} color={color} active={active} />}
            <Label pos={v3(m.pos, m.size ? 3 : 14)} tone={active ? 'gold' : 'light'} onClick={() => onPickMarker(m)}>{m.label}{m.estimate ? ' *' : ''}</Label>
          </group>
        );
      })}

      {picked && <group><Pin pos={picked} color="#ff5a5a" active /><Label pos={v3(picked, 15)} tone="gold">{`${picked[0]}, ${picked[1]}`}</Label></group>}

      <Label pos={[0, 1, -230]} tone="light">↑ Bắc</Label>
      <CameraControls ref={cc} minDistance={25} maxDistance={700} maxPolarAngle={Math.PI / 2.1} smoothTime={0.5} />
    </>
  );
});

const CampusScene = forwardRef<CampusHandle, Props>(function CampusScene(props, ref) {
  return (
    <Canvas dpr={[1, 1.75]} camera={{ fov: 45, near: 1, far: 3000, position: [0, 360, 0.01] }} gl={{ antialias: true }}>
      <Scene ref={ref} {...props} />
    </Canvas>
  );
});
export default CampusScene;
