/**
 * Đặt sân khấu vào khuôn viên thật.
 * Hệ toạ độ "sân khấu" (local): x = ngang sân khấu, z = hướng về phía khán giả, mép trước sân khấu tại z = 0.
 * Hệ toạ độ "khuôn viên": x = Đông, y = Bắc (mét, xem campus/data.ts).
 * Sân khấu nằm trên sân trống lớn nhất (~64 × 60 m, tâm (2, -86)), quay lưng về phía Đông Bắc,
 * khán giả nhìn về phía sân khấu với Nhà nguyện cổ ở phía sau bên trái.
 */
import { CAMPUS_ANGLE, type XY } from '../campus/data';

const A = (CAMPUS_ANGLE * Math.PI) / 180;
export const U: XY = [Math.cos(A), Math.sin(A)];   // dọc đường Tôn Đức Thắng
export const V: XY = [-Math.sin(A), Math.cos(A)];  // vuông góc, hướng vào trong khuôn viên
export const YARD = { center: [2, -86] as XY, size: [64, 60] as [number, number] };
/** Mép trước sân khấu cách tâm sân 16 m về phía V */
const FRONT = 16;
export const P0: XY = [YARD.center[0] + FRONT * V[0], YARD.center[1] + FRONT * V[1]];
/** Góc quay quanh trục Y để đưa nhóm sân khấu vào khuôn viên */
export const STAGE_ROT_Y = A;
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
