/**
 * Tượng đá trắng trước Nhà nguyện cổ — dựng theo ảnh chụp:
 * vị linh mục mặc áo dòng dài, khoác áo choàng ngắn, tay phải giơ cao, tay trái đặt lên vai một em nhỏ;
 * một em nhỏ khác đứng nép bên phải, ngước nhìn lên. Tượng đặt trên bệ vuông có gờ, giữa bồn tròn viền đá,
 * quanh là hàng cây xanh cắt tỉa.
 */
import { useMemo } from 'react';
import * as THREE from 'three';

const MARBLE = '#f3f1eb', STONE = '#8d877d';
const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

/** đoạn chi (tay, chân) từ điểm a tới điểm b */
function Limb({ a, b, r, r2 = r }: { a: THREE.Vector3; b: THREE.Vector3; r: number; r2?: number }) {
  const { pos, q, len } = useMemo(() => {
    const d = b.clone().sub(a), len = d.length();
    return { pos: a.clone().add(b).multiplyScalar(0.5), q: new THREE.Quaternion().setFromUnitVectors(v(0, 1, 0), d.normalize()), len };
  }, [a, b]);
  return (
    <group position={pos} quaternion={q}>
      <mesh castShadow><cylinderGeometry args={[r2, r, len, 12]} /><meshStandardMaterial color={MARBLE} roughness={0.55} /></mesh>
      <mesh position={[0, len / 2, 0]}><sphereGeometry args={[r2, 12, 10]} /><meshStandardMaterial color={MARBLE} roughness={0.55} /></mesh>
      <mesh position={[0, -len / 2, 0]}><sphereGeometry args={[r, 12, 10]} /><meshStandardMaterial color={MARBLE} roughness={0.55} /></mesh>
    </group>
  );
}

/** áo dài loe (tiện tròn theo biên dạng) */
function Robe({ profile, y = 0, sx = 1, sz = 0.82 }: { profile: [number, number][]; y?: number; sx?: number; sz?: number }) {
  const geo = useMemo(() => new THREE.LatheGeometry(profile.map(([r, h]) => new THREE.Vector2(r, h)), 28), [profile]);
  return <mesh geometry={geo} position={[0, y, 0]} scale={[sx, 1, sz]} castShadow receiveShadow><meshStandardMaterial color={MARBLE} roughness={0.55} side={THREE.DoubleSide} /></mesh>;
}

function Head({ p, r, hair = true }: { p: THREE.Vector3; r: number; hair?: boolean }) {
  return (
    <group position={p}>
      <mesh castShadow><sphereGeometry args={[r, 18, 14]} /><meshStandardMaterial color={MARBLE} roughness={0.5} /></mesh>
      {hair && <mesh position={[0, r * 0.18, -r * 0.08]}><sphereGeometry args={[r * 1.04, 18, 14, 0, Math.PI * 2, 0, Math.PI / 2.2]} /><meshStandardMaterial color="#e9e6df" roughness={0.7} /></mesh>}
      <mesh position={[0, -r * 0.05, r * 0.92]}><sphereGeometry args={[r * 0.14, 8, 6]} /><meshStandardMaterial color={MARBLE} /></mesh>
    </group>
  );
}

/* tỉ lệ: linh mục cao ~2,6 m, em lớn ~1,45 m, em nhỏ ~1,2 m */
const PRIEST_ROBE: [number, number][] = [[0.5, 0], [0.48, 0.15], [0.42, 0.6], [0.36, 1.1], [0.34, 1.5], [0.35, 1.8], [0.31, 1.96], [0.15, 2.07], [0, 2.09]];
const CAPE: [number, number][] = [[0.49, 1.5], [0.46, 1.66], [0.41, 1.88], [0.3, 2.02], [0.14, 2.09], [0, 2.1]];
const KID1: [number, number][] = [[0.3, 0], [0.28, 0.4], [0.24, 0.75], [0.21, 1.0], [0.15, 1.12], [0, 1.15]];
const KID2: [number, number][] = [[0.26, 0], [0.24, 0.35], [0.2, 0.62], [0.18, 0.82], [0.12, 0.93], [0, 0.95]];

function Figures() {
  return (
    <group>
      {/* linh mục */}
      <Robe profile={PRIEST_ROBE} sz={0.78} />
      <Robe profile={CAPE} sx={1.05} sz={0.9} />
      <Limb a={v(0.33, 1.95, 0)} b={v(0.62, 2.45, 0.12)} r={0.1} r2={0.09} />
      <Limb a={v(0.62, 2.45, 0.12)} b={v(0.72, 3.05, 0.2)} r={0.09} r2={0.08} />
      <mesh position={[0.74, 3.22, 0.21]} rotation={[0, 0, -0.15]} castShadow><boxGeometry args={[0.13, 0.26, 0.06]} /><meshStandardMaterial color={MARBLE} /></mesh>
      <Limb a={v(-0.33, 1.95, 0)} b={v(-0.5, 1.5, 0.18)} r={0.1} r2={0.09} />
      <Limb a={v(-0.5, 1.5, 0.18)} b={v(-0.62, 1.32, 0.42)} r={0.09} r2={0.08} />
      <mesh position={[0, 2.12, 0]}><cylinderGeometry args={[0.09, 0.11, 0.14, 12]} /><meshStandardMaterial color={MARBLE} /></mesh>
      <Head p={v(0, 2.34, 0.02)} r={0.21} />
      {/* em lớn: đứng bên trái vị linh mục (phía phải người xem), được đặt tay lên vai */}
      <group position={[-0.68, 0, 0.42]} rotation={[0, 0.5, 0]}>
        <Robe profile={KID1} sz={0.8} />
        <Head p={v(0, 1.3, 0.03)} r={0.15} />
        <Limb a={v(0.2, 1.02, 0)} b={v(0.32, 0.65, 0.12)} r={0.065} />
        <Limb a={v(-0.2, 1.02, 0)} b={v(-0.28, 0.62, 0.05)} r={0.065} />
      </group>
      {/* em nhỏ: nép bên phải, ngước nhìn, một tay với lên */}
      <group position={[0.55, 0, 0.5]} rotation={[0, -0.6, 0]}>
        <Robe profile={KID2} sz={0.8} />
        <group rotation={[-0.35, 0, 0]}><Head p={v(0, 1.08, 0.06)} r={0.13} /></group>
        <Limb a={v(-0.17, 0.86, 0)} b={v(-0.32, 1.22, 0.06)} r={0.055} />
        <Limb a={v(0.17, 0.86, 0)} b={v(0.24, 0.52, 0.06)} r={0.055} />
      </group>
    </group>
  );
}

export function Statue({ x, z, rot = 0.35 }: { x: number; z: number; rot?: number }) {
  return (
    <group position={[x, 0, z]} rotation={[0, rot, 0]}>
      {/* bồn tròn viền đá + hàng cây cắt tỉa */}
      <mesh position={[0, 0.28, 0]} receiveShadow castShadow><cylinderGeometry args={[2.5, 2.6, 0.56, 40, 1, true]} /><meshStandardMaterial color={STONE} roughness={0.9} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.56, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[2.52, 0.12, 8, 48]} /><meshStandardMaterial color="#a39d92" roughness={0.9} /></mesh>
      <mesh position={[0, 0.42, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><circleGeometry args={[2.45, 40]} /><meshStandardMaterial color="#4d6b36" roughness={1} /></mesh>
      {Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2; return (
        <mesh key={i} position={[Math.cos(a) * 1.9, 0.62, Math.sin(a) * 1.9]}><sphereGeometry args={[0.22, 10, 8]} /><meshStandardMaterial color={i % 3 ? '#e85d8a' : '#f2c14e'} /></mesh>
      ); })}
      <mesh position={[0, 0.35, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow><torusGeometry args={[3.05, 0.32, 8, 48]} /><meshStandardMaterial color="#2f5a2e" roughness={1} /></mesh>
      {/* bệ vuông có gờ */}
      <group position={[0, 0.42, 0]}>
        <mesh position={[0, 0.12, 0]} castShadow><boxGeometry args={[1.75, 0.24, 1.75]} /><meshStandardMaterial color="#d9d4ca" roughness={0.8} /></mesh>
        <mesh position={[0, 0.85, 0]} castShadow><boxGeometry args={[1.45, 1.25, 1.45]} /><meshStandardMaterial color="#e7e3da" roughness={0.75} /></mesh>
        <mesh position={[0, 1.55, 0]} castShadow><boxGeometry args={[1.7, 0.18, 1.7]} /><meshStandardMaterial color="#d9d4ca" roughness={0.8} /></mesh>
        <mesh position={[0, 0.9, 0.726]}><planeGeometry args={[0.9, 0.42]} /><meshStandardMaterial color="#cfc8ba" roughness={0.9} /></mesh>
        <group position={[0, 1.64, 0]} scale={1.05}><Figures /></group>
      </group>
    </group>
  );
}
