/**
 * Đặt sân khấu vào khuôn viên thật.
 * Hệ toạ độ "sân khấu" (local): x = ngang sân khấu, z = hướng về phía khán giả, mép trước sân khấu tại z = 0.
 * Hệ toạ độ "khuôn viên": x = Đông, y = Bắc (mét, xem campus/data.ts).
 * Vị trí theo ảnh anh Midu khoanh: sân khấu nằm giữa toà nhà bên trái và Nhà nguyện cổ,
 * quay lưng về bờ tường phía Bắc, khán giả nhìn về phía sân khấu (Trung tâm Mục vụ ở phía sau khán đài).
 */
import { AXIS_U as U, AXIS_V as V, CAMPUS_ANGLE, uv2xy, type XY } from '../campus/data';

export { U, V };
/** Mép trước sân khấu (giữa) trong hệ (u, v) của khuôn viên — xem EVENT_AREAS.stage */
export const STAGE_UV: XY = [-30, 2];
export const P0: XY = uv2xy(STAGE_UV);
/** Góc quay quanh trục Y để đưa nhóm sân khấu vào khuôn viên */
export const STAGE_ROT_Y = (CAMPUS_ANGLE * Math.PI) / 180;
export const STAGE_POS: [number, number, number] = [P0[0], 0, -P0[1]];

/** local (x, y, z) → toạ độ three.js của cảnh khuôn viên */
export function toWorld([x, y, z]: [number, number, number]): [number, number, number] {
  const cx = P0[0] + x * U[0] - z * V[0];
  const cy = P0[1] + x * U[1] - z * V[1];
  return [cx, y, -cy];
}
/** toạ độ khuôn viên (x Đông, y Bắc) → local sân khấu (x, z) */
export function campusToLocal([x, y]: XY): [number, number] {
  const d: XY = [x - P0[0], y - P0[1]];
  return [d[0] * U[0] + d[1] * U[1], -(d[0] * V[0] + d[1] * V[1])];
}
