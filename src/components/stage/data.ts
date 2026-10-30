/**
 * Dữ liệu sơ đồ 3D vở Đắc Lộ — BẢN DỰ KIẾN.
 * Chưa có sơ đồ mặt bằng chính thức của Trung Tâm Mục Vụ TGP Sài Gòn, nên kích thước sân
 * và cách chia khu là giả định (dựa trên ảnh Đại hội Giới trẻ tổ chức ngoài trời tại đây và
 * con số 6.000 – 7.000 khán giả trong proposal). Đơn vị: mét. Sân khấu ở phía z âm,
 * mép trước sân khấu tại z = 0, khán giả trải về phía z dương.
 */

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

/* Các dãy ghế: 4 cụm theo chiều ngang, chừa lối đi giữa và hai bên */
const L = { x0: -31, x1: -13 }, CL = { x0: -11, x1: -1 }, CR = { x0: 1, x1: 11 }, R = { x0: 13, x1: 31 };
const band = (z0: number, z1: number, ...cols: { x0: number; x1: number }[]) => cols.map(c => ({ ...c, z0, z1 }));

export const ZONES: Zone[] = [
  {
    id: 'khach-moi', name: 'Khách mời & Ban tổ chức', short: 'Khách mời', color: '#D4AF37',
    desc: 'Hàng ghế đầu, chính giữa sân khấu — dành cho quý Đức Cha, quý khách mời, Dòng Tên Việt Nam và Ban tổ chức.',
    rects: band(6, 12.3, CL, CR), seat: [0, 9],
  },
  {
    id: 'linh-muc', name: 'Linh mục · Tu sĩ · Chủng sinh', short: 'Linh mục – Tu sĩ', color: '#B9874A',
    desc: 'Hai cánh phía trước và dãy giữa ngay sau khu khách mời.',
    rects: [...band(6, 18.3, L, R), ...band(13.2, 18.3, CL, CR)], seat: [-22, 12],
  },
  {
    id: 'gioi-tre', name: 'Giới trẻ · Sinh viên Công giáo', short: 'Giới trẻ', color: '#C2553F',
    desc: 'Khu trung tâm khán đài, gần sân khấu và màn LED hai bên.',
    rects: band(20, 38.3, L, CL, CR, R), seat: [6, 29],
  },
  {
    id: 'cong-doan', name: 'Cộng đoàn · Giáo xứ · Khán giả', short: 'Cộng đoàn', color: '#5C7FA3',
    desc: 'Khu phía sau, quan sát toàn cảnh sân khấu; có màn LED hai bên hỗ trợ.',
    rects: [...band(40, 72.3, L, R), ...band(46, 72.3, CL, CR)], seat: [-6, 60],
  },
  {
    id: 'uu-tien', name: 'Khu ưu tiên', short: 'Ưu tiên', color: '#5E9C76',
    desc: 'Dành cho người cao tuổi, người khuyết tật và người đi cùng — gần lối vào và khu y tế.',
    rects: [{ x0: 33.5, x1: 39, z0: 8, z1: 18.3 }], seat: [36, 13],
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

/** Điểm tiện ích hiển thị trong chế độ Khán giả */
export const FACILITIES = [
  { id: 'loi-vao-1', label: 'Lối vào', pos: [-22, 0, 79] as [number, number, number] },
  { id: 'loi-vao-2', label: 'Lối vào', pos: [22, 0, 79] as [number, number, number] },
  { id: 'y-te', label: 'Y tế', pos: [36, 0, 26] as [number, number, number] },
  { id: 'nuoc', label: 'Nước uống', pos: [-36, 0, 26] as [number, number, number] },
  { id: 'wc-1', label: 'Nhà vệ sinh', pos: [-36, 0, 60] as [number, number, number] },
  { id: 'wc-2', label: 'Nhà vệ sinh', pos: [36, 0, 60] as [number, number, number] },
];

/** Hạng mục đồng hành — lấy từ "Lĩnh vực cần đóng góp / tài trợ" và "Chuyên môn" trong proposal */
export type SponsorItem = { id: string; name: string; desc: string; focus: [number, number, number]; cam: [number, number, number]; label: [number, number, number] };
export const SPONSOR: SponsorItem[] = [
  { id: 'led', name: 'Màn hình LED', desc: 'Màn LED nền sân khấu (phông cảnh động thế kỷ XVII) và 2 màn LED hai bên cho khán giả phía sau.', focus: [0, 6, -12], cam: [26, 10, 30], label: [0, 11.6, -12.3] },
  { id: 'am-thanh', name: 'Âm thanh', desc: 'Hai cụm loa treo (line array) hai bên sân khấu và bàn điều khiển âm thanh – ánh sáng (FOH) giữa khán đài.', focus: [0, 6, 10], cam: [-38, 18, 48], label: [-15.6, 12.8, -0.4] },
  { id: 'anh-sang', name: 'Ánh sáng', desc: 'Giàn khung (truss) phía trên sân khấu với đèn di động, cùng đèn follow spot từ khu FOH.', focus: [0, 11, -6], cam: [20, 6, 22], label: [7, 14.6, -8] },
  { id: 'canh-tri', name: 'Cảnh trí & đạo cụ', desc: 'Sân khấu hai tầng, cầu thang giữa và các khối bậc đá — tái hiện bối cảnh thế kỷ XVII theo thiết kế của ekip.', focus: [0, 1.5, -6], cam: [9, 5, 13], label: [-9, 4.2, -1.5] },
  { id: 'phuc-trang', name: 'Phục trang & hậu đài', desc: 'Khu lều hậu đài phía sau sân khấu: thay phục trang, trang điểm, lưu trữ đạo cụ cho 130+ diễn viên.', focus: [0, 1, -22], cam: [24, 16, -2], label: [10, 5.5, -21] },
  { id: 'livestream', name: 'Livestream · Quay phim', desc: 'Bục máy quay trung tâm tại FOH, 2 tháp máy quay hai bên và máy quay cẩu trước sân khấu — phát trực tuyến cho hơn 10.000 người theo dõi.', focus: [0, 2, 30], cam: [-30, 14, 60], label: [34, 5.5, 22] },
  { id: 'hau-can', name: 'Suất ăn · Nước uống', desc: 'Khu hậu cần phục vụ diễn viên, tình nguyện viên trong các buổi tập và đêm diễn.', focus: [-26, 1, -18], cam: [-44, 14, 2], label: [-26, 5.2, -18] },
];

export const CAMERAS = {
  overview: { pos: [-54, 40, 90] as [number, number, number], look: [0, 0, 26] as [number, number, number] },
  top: { pos: [0, 125, 33] as [number, number, number], look: [0, 0, 32] as [number, number, number] },
  stage: { pos: [0, 5.5, -9.5] as [number, number, number], look: [0, 1, 40] as [number, number, number] },
};
export const STAGE_FOCUS: [number, number, number] = [0, 4, -6];
