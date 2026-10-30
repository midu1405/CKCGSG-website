/**
 * Sơ đồ khuôn viên Trung Tâm Mục Vụ TGP Sài Gòn & Đại Chủng Viện Thánh Giuse (số 6 Tôn Đức Thắng, Q.1).
 *
 * Hình dạng khuôn viên, toà nhà và đường lấy từ OpenStreetMap (© OpenStreetMap contributors, ODbL),
 * quy về mét quanh tâm khuôn viên: x = Đông (+), y = Bắc (+). Tên một số toà nhà đối chiếu
 * với ảnh vệ tinh. OSM không có cây xanh, đường nội bộ, hàng rào — nên diện tích sân là ước tính.
 *
 * ➜ Thêm bãi xe / cổng / điểm mới: bật "Chế độ đánh dấu" trên trang, bấm vào vị trí,
 *   sao chép toạ độ rồi thêm một dòng vào MARKERS bên dưới.
 */
import OSM from './osm.json';

export type XY = [number, number];
export const ORIGIN = OSM.origin as [number, number]; // [lat, lon] của tâm khuôn viên
const KX = 111320 * Math.cos((ORIGIN[0] * Math.PI) / 180), KY = 110574;
export const toLatLon = ([x, y]: XY): [number, number] => [ORIGIN[0] + y / KY, ORIGIN[1] + x / KX];

export const CAMPUS = OSM.c as XY[];
export const ROADS = OSM.r as unknown as [string, XY[][]][];

/** Tên & chiều cao ước lượng cho từng toà (theo thứ tự trong osm.json). */
const META: Record<number, { name?: string; note?: string; h: number }> = {
  0: { h: 14, note: 'Khu nhà Đại Chủng Viện' },
  1: { h: 12, note: 'Khu nhà Đại Chủng Viện' },
  2: { h: 15, note: 'Khu nhà Đại Chủng Viện (mái pin mặt trời)' },
  3: { h: 6 },
  4: { h: 15, note: 'Khu nhà Đại Chủng Viện (mái pin mặt trời)' },
  5: { name: 'Trung tâm Mục vụ Giáo phận', note: 'Google Maps ghi: Nhà truyền thống TGPSG', h: 13 },
  6: { name: 'Học viện Mục vụ', h: 12 },
  7: { h: 12 },
  8: { h: 10, note: 'Gần điểm "Trung tâm Mục vụ TGP" trên Google Maps' },
  9: { name: 'Nhà nguyện cổ', note: 'Nhà nguyện cổ TTMV TGP Sài Gòn — có từ thời Chủng viện (1863)', h: 13 },
  10: { h: 9 }, 11: { h: 9 }, 12: { h: 9 },
};

export type Building = { i: number; name?: string; note?: string; h: number; pts: XY[]; area: number; center: XY };
const area = (p: XY[]) => Math.abs(p.slice(0, -1).reduce((s, a, i) => s + a[0] * p[i + 1][1] - p[i + 1][0] * a[1], 0)) / 2;
const centroid = (p: XY[]): XY => { const q = p.slice(0, -1); return [q.reduce((s, a) => s + a[0], 0) / q.length, q.reduce((s, a) => s + a[1], 0) / q.length]; };

export const BUILDINGS: Building[] = (OSM.b as [string, XY[]][]).map(([osmName, pts], i) => ({
  i, pts, ...META[i], name: META[i]?.name || osmName || undefined, h: META[i]?.h ?? 10,
  area: Math.round(area(pts)), center: centroid(pts),
}));
export const CAMPUS_AREA = Math.round(area(CAMPUS));

/* ---------- Điểm đánh dấu (sửa / thêm tại đây) ---------- */
export type MarkerKind = 'gate' | 'yard' | 'parking' | 'stage' | 'standing' | 'service';
export type Marker = { id: string; kind: MarkerKind; label: string; desc: string; pos: XY; size?: [number, number]; estimate?: boolean };

export const KIND_STYLE: Record<MarkerKind, { color: string; name: string }> = {
  gate: { color: '#D4AF37', name: 'Cổng ra vào' },
  yard: { color: '#5E9C76', name: 'Sân trống' },
  parking: { color: '#5C7FA3', name: 'Bãi giữ xe' },
  stage: { color: '#C2553F', name: 'Sân khấu' },
  standing: { color: '#9B6FB0', name: 'Khu khán giả đứng' },
  service: { color: '#B9874A', name: 'Tiện ích' },
};

/** Góc xoay của khuôn viên so với hướng Bắc (cạnh dọc đường Tôn Đức Thắng) */
export const CAMPUS_ANGLE = -42.6;
const CA = (CAMPUS_ANGLE * Math.PI) / 180;
/** Hai trục của khuôn viên: u dọc đường Tôn Đức Thắng (về phía Đông Nam), v vuông góc hướng vào trong (Đông Bắc) */
export const AXIS_U: XY = [Math.cos(CA), Math.sin(CA)];
export const AXIS_V: XY = [-Math.sin(CA), Math.cos(CA)];
export const uv2xy = ([u, v]: XY): XY => [u * AXIS_U[0] + v * AXIS_V[0], u * AXIS_U[1] + v * AXIS_V[1]];
export const xy2uv = ([x, y]: XY): XY => [x * AXIS_U[0] + y * AXIS_U[1], x * AXIS_V[0] + y * AXIS_V[1]];

/** Khu chữ nhật thẳng hàng với khuôn viên: tâm (x, y) + kích thước dọc u × v (mét) */
export type Area = { c: XY; s: [number, number] };
const areaUV = (u: number, v: number, w: number, h: number): Area => {
  const [x, y] = uv2xy([u, v]); return { c: [Math.round(x * 10) / 10, Math.round(y * 10) / 10], s: [w, h] };
};
export const areaPts = ({ c, s: [w, h] }: Area): XY[] => {
  const [cu, cv] = xy2uv(c);
  return ([[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]] as XY[]).map(([du, dv]) => uv2xy([cu + du, cv + dv]));
};

/**
 * Bố trí đêm diễn Đắc Lộ — theo ảnh anh Midu khoanh trên sơ đồ (10.2026):
 * sân khấu giữa toà nhà bên trái và Nhà nguyện cổ, 2 khu trống cho khán giả đứng, sân lớn và sân trước làm bãi giữ xe.
 * Kích thước khoanh theo ảnh nên chỉ gần đúng — chỉnh số ở đây nếu Ban tổ chức đo lại.
 */
export const EVENT_AREAS = {
  stage: areaUV(-30, -5.5, 40, 43),   // sân khấu + khán đài ghế ngồi
  standA: areaUV(13, -19, 44, 12.5),  // khu đứng giữa Nhà nguyện cổ và Trung tâm Mục vụ
  standB: areaUV(-43.5, -49, 35, 10), // khu đứng giữa Học viện Mục vụ và Trung tâm Mục vụ
  parkA: areaUV(60, -62, 64, 60),     // sân lớn
  parkB: areaUV(2, -80, 52, 20),      // sân trước, cạnh lối vào
};
export const WC_POS: XY = [-29, 50.5];
const m2 = (a: Area) => (a.s[0] * a.s[1]).toLocaleString('vi-VN');

export const MARKERS: Marker[] = [
  {
    id: 'cong-chinh', kind: 'gate', label: 'Cổng số 6', estimate: true, pos: [-92, -62],
    desc: 'Cổng phía đường Tôn Đức Thắng. Vị trí ước lượng theo ảnh vệ tinh — cần Ban tổ chức xác nhận.',
  },
  {
    id: 'san-khau', kind: 'stage', label: 'Sân khấu Đắc Lộ', pos: EVENT_AREAS.stage.c, size: EVENT_AREAS.stage.s,
    desc: 'Vị trí dựng sân khấu thực tế: khoảng sân giữa toà nhà bên trái và Nhà nguyện cổ, phía trên Trung tâm Mục vụ. Sân khấu quay lưng về bờ tường phía Bắc, khán đài ghế ngồi ở phía trước.',
  },
  {
    id: 'dung-a', kind: 'standing', label: 'Khu đứng A', pos: EVENT_AREAS.standA.c, size: EVENT_AREAS.standA.s,
    desc: `Khoảng trống giữa Nhà nguyện cổ và Trung tâm Mục vụ (~${m2(EVENT_AREAS.standA)} m²) — dành cho khán giả đứng, nhìn chéo về sân khấu.`,
  },
  {
    id: 'dung-b', kind: 'standing', label: 'Khu đứng B', pos: EVENT_AREAS.standB.c, size: EVENT_AREAS.standB.s,
    desc: `Khoảng trống giữa Học viện Mục vụ và Trung tâm Mục vụ (~${m2(EVENT_AREAS.standB)} m²) — dành cho khán giả đứng, nhìn thẳng về sân khấu từ phía sau.`,
  },
  {
    id: 'xe-a', kind: 'parking', label: 'Bãi giữ xe · Sân lớn', pos: EVENT_AREAS.parkA.c, size: EVENT_AREAS.parkA.s,
    desc: `Sân trống lớn nhất khuôn viên (~${m2(EVENT_AREAS.parkA)} m²), dùng làm bãi giữ xe trong đêm diễn.`,
  },
  {
    id: 'xe-b', kind: 'parking', label: 'Bãi giữ xe · Sân trước', pos: EVENT_AREAS.parkB.c, size: EVENT_AREAS.parkB.s,
    desc: `Dải sân trước Trung tâm Mục vụ, gần lối vào từ đường Tôn Đức Thắng (~${m2(EVENT_AREAS.parkB)} m²).`,
  },
  {
    id: 'wc', kind: 'service', label: 'Nhà vệ sinh', pos: WC_POS,
    desc: 'Nhà vệ sinh trong toà nhà bên trái, cạnh sân khấu.',
  },
];
