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
export type MarkerKind = 'gate' | 'yard' | 'parking' | 'stage' | 'service';
export type Marker = { id: string; kind: MarkerKind; label: string; desc: string; pos: XY; size?: [number, number]; estimate?: boolean };

export const KIND_STYLE: Record<MarkerKind, { color: string; name: string }> = {
  gate: { color: '#D4AF37', name: 'Cổng ra vào' },
  yard: { color: '#5E9C76', name: 'Sân trống' },
  parking: { color: '#5C7FA3', name: 'Bãi giữ xe' },
  stage: { color: '#C2553F', name: 'Sân khấu' },
  service: { color: '#B9874A', name: 'Tiện ích' },
};

/** Góc xoay của khuôn viên so với hướng Bắc (cạnh dọc đường Tôn Đức Thắng) */
export const CAMPUS_ANGLE = -42.6;

export const MARKERS: Marker[] = [
  {
    id: 'cong-chinh', kind: 'gate', label: 'Cổng số 6', estimate: true, pos: [-92, -62],
    desc: 'Cổng phía đường Tôn Đức Thắng. Vị trí ước lượng theo ảnh vệ tinh — cần Ban tổ chức xác nhận.',
  },
  {
    id: 'san-lon', kind: 'yard', label: 'Sân lớn (~3.800 m²)', pos: [2, -86], size: [64, 60],
    desc: 'Khoảng 64 × 60 m (~3.800 m²) — khoảng trống liền khối lớn nhất trong khuôn viên theo dữ liệu bản đồ. Ứng viên để dựng sân khấu ngoài trời. Thực tế có cây xanh nên cần khảo sát lại.',
  },
  {
    id: 'dai-tien-san', kind: 'yard', label: 'Dải sân trước', pos: [-41, -65], size: [154, 30],
    desc: 'Dải trống dài ~154 m, rộng ~30 m giữa hàng rào và các toà nhà mặt tiền — có thể dùng làm lối vào, khu đón khách hoặc giữ xe.',
  },
  // Ví dụ thêm bãi xe sau này:
  // { id: 'bai-xe-1', kind: 'parking', label: 'Bãi xe máy 1', pos: [-60, -80], desc: 'Sức chứa ~… xe' },
];
