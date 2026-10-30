/**
 * Dữ liệu sơ đồ 3D vở Đắc Lộ — BẢN DỰ KIẾN.
 * Sân khấu đặt trên sân trống lớn nhất của khuôn viên TTMV (~64 × 60 m, tính từ dữ liệu
 * OpenStreetMap — xem campus/data.ts và stage/frame.ts). Chưa có sơ đồ chính thức từ Ban tổ chức.
 * Đơn vị: mét, hệ toạ độ sân khấu: mép trước sân khấu tại z = 0, khán giả trải về phía z dương.
 */
import { campusToLocal } from './frame';
import type { XY } from '../campus/data';

export type Rect = { x0: number; x1: number; z0: number; z1: number };

export type Zone = {
  id: string;
  name: string;
  short: string;
  color: string;
  desc: string;
  rects: Rect[];
  /** điểm đặt camera khi bấm "Xem từ chỗ ngồi này" */
  seat: [number, number];
};

/* Khán đài trên sân lớn ~64 × 60 m: 4 cụm ghế, lối đi giữa, 2 lối ngang */
const L = { x0: -29, x1: -17 }, CL = { x0: -15, x1: -1 }, CR = { x0: 1, x1: 15 }, R = { x0: 17, x1: 29 };
const band = (z0: number, z1: number, ...cols: { x0: number; x1: number }[]) => cols.map(c => ({ ...c, z0, z1 }));

export const ZONES: Zone[] = [
  {
    id: 'khach-moi', name: 'Khách mời & Ban tổ chức', short: 'Khách mời', color: '#D4AF37',
    desc: 'Hàng ghế đầu, chính giữa sân khấu — dành cho quý Đức Cha, quý khách mời, Dòng Tên Việt Nam và Ban tổ chức.',
    rects: band(4, 9.4, CL, CR), seat: [0, 7],
  },
  {
    id: 'linh-muc', name: 'Linh mục · Tu sĩ · Chủng sinh', short: 'Linh mục – Tu sĩ', color: '#B9874A',
    desc: 'Cánh trái phía trước và dãy ngay sau khu khách mời.',
    rects: [...band(4, 15.1, L), ...band(10, 15.1, CL, CR, R)], seat: [-22, 10],
  },
  {
    id: 'gioi-tre', name: 'Giới trẻ · Sinh viên Công giáo', short: 'Giới trẻ', color: '#C2553F',
    desc: 'Khu giữa khán đài, gần sân khấu và màn LED hai bên.',
    rects: band(17, 29.6, L, CL, CR, R), seat: [6, 23],
  },
  {
    id: 'cong-doan', name: 'Cộng đoàn · Giáo xứ · Khán giả', short: 'Cộng đoàn', color: '#5C7FA3',
    desc: 'Khu phía sau, quanh bàn điều khiển âm thanh – ánh sáng; có màn LED hai bên hỗ trợ.',
    rects: [...band(30.5, 44.9, L, R), ...band(37, 44.9, CL, CR)], seat: [-8, 41],
  },
  {
    id: 'uu-tien', name: 'Khu ưu tiên', short: 'Ưu tiên', color: '#5E9C76',
    desc: 'Dành cho người cao tuổi, người khuyết tật và người đi cùng — hàng đầu cánh phải, gần lối đi.',
    rects: band(4, 9.4, R), seat: [23, 7],
  },
];

export const SEAT = { dx: 0.55, dz: 0.9 };

export function seatsIn(r: Rect): [number, number][] {
  const out: [number, number][] = [];
  for (let z = r.z0 + SEAT.dz / 2; z < r.z1; z += SEAT.dz)
    for (let x = r.x0 + SEAT.dx / 2; x < r.x1; x += SEAT.dx) out.push([x, z]);
  return out;
}
export const zoneCount = (z: Zone) => z.rects.reduce((n, r) => n + seatsIn(r).length, 0);
export const TOTAL_SEATS = ZONES.reduce((n, z) => n + zoneCount(z), 0);

/** Điểm tiện ích (chế độ Khán giả) — đặt ở dải sân trước dọc Tôn Đức Thắng, vị trí dự kiến */
const fac = (id: string, label: string, campus: XY) => { const [x, z] = campusToLocal(campus); return { id, label, pos: [x, 0, z] as [number, number, number] }; };
export const FACILITIES = [
  fac('loi-vao', 'Lối vào · Cổng số 6 *', [-92, -62]),
  fac('y-te', 'Y tế', [-74, -34]),
  fac('nuoc', 'Nước uống', [-63, -45]),
  fac('wc', 'Nhà vệ sinh', [-52, -55]),
];

/** Hạng mục đồng hành — lấy từ "Lĩnh vực cần đóng góp / tài trợ" và "Chuyên môn" trong proposal */
export type SponsorItem = { id: string; name: string; desc: string; focus: [number, number, number]; cam: [number, number, number]; label: [number, number, number] };
export const SPONSOR: SponsorItem[] = [
  { id: 'led', name: 'Màn hình LED', desc: 'Màn LED nền sân khấu (phông cảnh động thế kỷ XVII) và 2 màn LED hai bên cho khán giả phía sau.', focus: [0, 6, -12], cam: [18, 12, 30], label: [0, 11.6, -12.3] },
  { id: 'am-thanh', name: 'Âm thanh', desc: 'Hai cụm loa treo (line array) hai bên sân khấu và bàn điều khiển âm thanh – ánh sáng (FOH) giữa khán đài.', focus: [0, 6, 10], cam: [-22, 20, 44], label: [-15.6, 12.8, -0.4] },
  { id: 'anh-sang', name: 'Ánh sáng', desc: 'Giàn khung (truss) phía trên sân khấu với đèn di động, cùng đèn follow spot từ khu FOH.', focus: [0, 11, -6], cam: [20, 6, 22], label: [7, 14.6, -8] },
  { id: 'canh-tri', name: 'Cảnh trí & đạo cụ', desc: 'Sân khấu hai tầng, cầu thang giữa và các khối bậc đá — tái hiện bối cảnh thế kỷ XVII theo thiết kế của ekip.', focus: [0, 1.5, -6], cam: [9, 5, 13], label: [-9, 4.2, -1.5] },
  { id: 'phuc-trang', name: 'Phục trang & hậu đài', desc: 'Lều hậu đài bên trái sân khấu: thay phục trang, trang điểm, lưu trữ đạo cụ cho 130+ diễn viên.', focus: [-25.5, 0, -9], cam: [-15, 28, 10], label: [-25.5, 5.6, -9] },
  { id: 'livestream', name: 'Livestream · Quay phim', desc: 'Bục máy quay trung tâm tại FOH, 2 tháp máy quay hai bên và máy quay cẩu trước sân khấu — phát trực tuyến cho hơn 10.000 người theo dõi.', focus: [0, 2, 30], cam: [-22, 24, 46], label: [31, 6, 22] },
  { id: 'hau-can', name: 'Suất ăn · Nước uống', desc: 'Khu hậu cần phục vụ diễn viên, tình nguyện viên trong các buổi tập và đêm diễn.', focus: [25.5, 0, -9], cam: [15, 28, 10], label: [25.5, 5.4, -9] },
];

/** Góc camera trong hệ sân khấu (đổi sang khuôn viên bằng toWorld) */
export const CAMERAS = {
  overview: { pos: [42, 46, 82] as [number, number, number], look: [-16, 2, -10] as [number, number, number] },
  top: { pos: [0, 190, 18] as [number, number, number], look: [0, 0, 17] as [number, number, number] },
  stage: { pos: [0, 5.5, -9.5] as [number, number, number], look: [0, 1, 40] as [number, number, number] },
};
export const STAGE_FOCUS: [number, number, number] = [0, 4, -6];
