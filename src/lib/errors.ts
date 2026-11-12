/**
 * Câu báo lỗi cho người dùng khi gửi form.
 * Hàm SQL của dự án báo lỗi bằng `raise exception '…'` (tiếng Việt, mã P0001) — câu đó hiện nguyên văn.
 * Mọi lỗi khác (mất mạng "Failed to fetch", lỗi máy chủ, lỗi tiếng Anh) → hiện câu dự phòng tiếng Việt.
 */
export function friendlyError(e: unknown, fallback: string): string {
  const err = e as { code?: string; message?: string } | null;
  if (err?.code === 'P0001' && err.message) return err.message;
  return fallback;
}

/** Email có dạng a@b.c (có dấu chấm sau @). */
export const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** Liên hệ hợp lệ: email đúng dạng, hoặc số điện thoại có từ 9 chữ số trở lên. */
export function isContact(v: string): boolean {
  const s = v.trim();
  return EMAIL_RE.test(s) || s.replace(/\D/g, '').length >= 9;
}
