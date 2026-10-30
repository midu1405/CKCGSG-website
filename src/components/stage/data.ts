/**
 * Dữ liệu sơ đồ 3D vở Đắc Lộ — BẢN DỰ KIẾN.
 * Vị trí sân khấu, khu đứng, bãi giữ xe theo ảnh anh Midu khoanh trên sơ đồ (xem EVENT_AREAS trong campus/data.ts).
 * Chưa có sơ đồ chính thức từ Ban tổ chức.
 * Đơn vị: mét, hệ toạ độ sân khấu: mép trước sân khấu tại z = 0, khán giả trải về phía z dương.
 */
import { campusToLocal } from './frame';
import { EVENT_AREAS, WC_POS, type Area, type XY } from '../campus/data';

export type Rect = { x0: number; x1: number; z0: number; z1: number };

export type Zone = {
  id: string;
  name: string;
  short: string;
  color: string;
  desc: string;
  /** seat = ghế ngồi (rects trong hệ sân khấu); stand = khu đứng (area trong hệ khuôn viên) */
  kind: 'seat' | 'stand';
  rects?: Rect[];
  area?: Area;
  /** điểm đặt camera khi bấm "Xem từ khu này" (hệ sân khấu x, z) */
  seat: [number, number];
};

/** Mật độ khu đứng dùng để ước tính sức chứa (người / m²) — con số dự kiến */
export const STAND_DENSITY = 2;

/* Khán đài ghế ngồi trước sân khấu: 4 cụm ghế, lối đi giữa, 2 lối ngang */
const L = { x0: -19, x1: -10.5 }, CL = { x0: -9, x1: -1 }, CR = { x0: 1, x1: 9 }, R = { x0: 10.5, x1: 19 };
const band = (z0: number, z1: number, ...cols: { x0: number; x1: number }[]) => cols.map(c => ({ ...c, z0, z1 }));
const viewFrom = (a: Area) => campusToLocal(a.c);

export const ZONES: Zone[] = [
  {
    id: 'khach-moi', kind: 'seat', name: 'Khách mời & Ban tổ chức', short: 'Khách mời', color: '#D4AF37',
    desc: 'Hàng ghế đầu, chính giữa sân khấu — dành cho quý Đức Cha, quý khách mời, Dòng Tên Việt Nam và Ban tổ chức.',
    rects: band(4, 9.4, CL, CR), seat: [0, 7],
  },
  {
    id: 'uu-tien', kind: 'seat', name: 'Khu ưu tiên', short: 'Ưu tiên', color: '#5E9C76',
    desc: 'Dành cho người cao tuổi, người khuyết tật và người đi cùng — hàng đầu cánh phải, gần lối đi.',
    rects: band(4, 9.4, R), seat: [15, 7],
  },
  {
    id: 'linh-muc', kind: 'seat', name: 'Linh mục · Tu sĩ · Chủng sinh', short: 'Linh mục – Tu sĩ', color: '#B9874A',
    desc: 'Cánh trái phía trước và hai cánh của dãy thứ hai.',
    rects: [...band(4, 9.4, L), ...band(10.5, 15.9, L, R)], seat: [-15, 9],
  },
  {
    id: 'cong-doan', kind: 'seat', name: 'Cộng đoàn · Giáo xứ (ghế ngồi)', short: 'Cộng đoàn', color: '#5C7FA3',
    desc: 'Phần còn lại của khán đài ghế ngồi, phía trước bàn điều khiển âm thanh – ánh sáng.',
    rects: [...band(10.5, 15.9, CL, CR), ...band(17, 27.8, L, CL, CR, R)], seat: [-6, 24],
  },
  {
    id: 'dung-a', kind: 'stand', name: 'Khu đứng A · cạnh Nhà nguyện cổ', short: 'Khu đứng A', color: '#9B6FB0',
    desc: 'Khoảng trống giữa Nhà nguyện cổ và Trung tâm Mục vụ — khán giả đứng, nhìn chéo về sân khấu và màn LED bên phải. Phù hợp cho giới trẻ, sinh viên.',
    area: EVENT_AREAS.standA, seat: viewFrom(EVENT_AREAS.standA),
  },
  {
    id: 'dung-b', kind: 'stand', name: 'Khu đứng B · cạnh Học viện Mục vụ', short: 'Khu đứng B', color: '#7C79C8',
    desc: 'Khoảng trống giữa Học viện Mục vụ và Trung tâm Mục vụ — khán giả đứng phía sau khán đài, nhìn thẳng về sân khấu.',
    area: EVENT_AREAS.standB, seat: viewFrom(EVENT_AREAS.standB),
  },
];

export const SEAT = { dx: 0.55, dz: 0.9 };

export function seatsIn(r: Rect): [number, number][] {
  const out: [number, number][] = [];
  for (let z = r.z0 + SEAT.dz / 2; z < r.z1; z += SEAT.dz)
    for (let x = r.x0 + SEAT.dx / 2; x < r.x1; x += SEAT.dx) out.push([x, z]);
  return out;
}
export const zoneCount = (z: Zone) =>
  z.kind === 'stand' && z.area ? Math.round((z.area.s[0] * z.area.s[1] * STAND_DENSITY) / 10) * 10
    : (z.rects ?? []).reduce((n, r) => n + seatsIn(r).length, 0);
export const TOTAL_SEATS = ZONES.filter(z => z.kind === 'seat').reduce((n, z) => n + zoneCount(z), 0);
export const TOTAL_STANDING = ZONES.filter(z => z.kind === 'stand').reduce((n, z) => n + zoneCount(z), 0);

/** Điểm tiện ích (chế độ Khán giả) — vị trí dự kiến */
const fac = (id: string, label: string, campus: XY) => { const [x, z] = campusToLocal(campus); return { id, label, pos: [x, 0, z] as [number, number, number] }; };
const facL = (id: string, label: string, x: number, z: number) => ({ id, label, pos: [x, 0, z] as [number, number, number] });
export const FACILITIES = [
  fac('loi-vao', 'Lối vào · Cổng số 6 *', [-92, -62]),
  fac('wc', 'Nhà vệ sinh', WC_POS),
  facL('y-te', 'Y tế', -15, 37),
  facL('nuoc', 'Nước uống', 15, 37),
];
/** Bãi giữ xe hiển thị trên sơ đồ 3D */
export const PARKING = [
  { id: 'xe-a', label: 'Bãi giữ xe · Sân lớn', area: EVENT_AREAS.parkA },
  { id: 'xe-b', label: 'Bãi giữ xe · Sân trước', area: EVENT_AREAS.parkB },
];

/** Hạng mục đồng hành — lấy từ "Lĩnh vực cần đóng góp / tài trợ" và "Chuyên môn" trong proposal */
export type SponsorItem = { id: string; name: string; desc: string; focus: [number, number, number]; cam: [number, number, number]; label: [number, number, number] };
export const SPONSOR: SponsorItem[] = [
  { id: 'led', name: 'Màn hình LED', desc: 'Màn LED nền sân khấu (phông cảnh động thế kỷ XVII) và 2 màn LED hai bên cho khán giả ở khu đứng và phía sau.', focus: [0, 6, -12], cam: [18, 12, 30], label: [0, 11.6, -12.3] },
  { id: 'am-thanh', name: 'Âm thanh', desc: 'Hai cụm loa treo (line array) hai bên sân khấu và bàn điều khiển âm thanh – ánh sáng (FOH) sau khán đài ghế ngồi.', focus: [0, 6, 10], cam: [-22, 20, 44], label: [-15.6, 12.8, -0.4] },
  { id: 'anh-sang', name: 'Ánh sáng', desc: 'Giàn khung (truss) phía trên sân khấu với đèn di động, cùng đèn follow spot từ khu FOH.', focus: [0, 11, -6], cam: [20, 6, 22], label: [7, 14.6, -8] },
  { id: 'canh-tri', name: 'Cảnh trí & đạo cụ', desc: 'Sân khấu hai tầng, cầu thang giữa và các khối bậc đá — tái hiện bối cảnh thế kỷ XVII theo thiết kế của ekip.', focus: [0, 1.5, -6], cam: [9, 5, 13], label: [-9, 4.2, -1.5] },
  { id: 'phuc-trang', name: 'Phục trang & hậu đài', desc: 'Lều hậu đài phía sau bên trái sân khấu, sát toà nhà có nhà vệ sinh: thay phục trang, trang điểm, lưu trữ đạo cụ cho 130+ diễn viên.', focus: [-16, 0, -11], cam: [-4, 24, 16], label: [-16, 5.6, -11] },
  { id: 'livestream', name: 'Livestream · Quay phim', desc: 'Bục máy quay trung tâm tại FOH, 2 tháp máy quay hai bên khán đài và máy quay cẩu trước sân khấu — phát trực tuyến cho hơn 10.000 người theo dõi.', focus: [0, 2, 24], cam: [-24, 22, 44], label: [20.5, 6, 18] },
  { id: 'hau-can', name: 'Suất ăn · Nước uống', desc: 'Khu hậu cần phía sau bên phải sân khấu, phục vụ diễn viên, tình nguyện viên trong các buổi tập và đêm diễn.', focus: [16, 0, -11], cam: [4, 24, 16], label: [16, 5.4, -11] },
];

/** Góc camera trong hệ sân khấu (đổi sang khuôn viên bằng toWorld) */
export const CAMERAS = {
  overview: { pos: [58, 105, 118] as [number, number, number], look: [10, 0, 30] as [number, number, number] },
  top: { pos: [22, 230, 41] as [number, number, number], look: [22, 0, 40] as [number, number, number] },
  stage: { pos: [0, 5.5, -9.5] as [number, number, number], look: [0, 1, 40] as [number, number, number] },
};
export const STAGE_FOCUS: [number, number, number] = [0, 4, -6];
