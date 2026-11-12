# TD-<số> — <tên việc>

- Yêu cầu gốc: "<câu Midu giao>"
- Nhánh: `claude/td-<số>-<ten-ngan>`
- Cách hiểu đã chọn (nếu Midu chưa duyệt): …

## Hợp đồng chung

**Route:** `/…`
**Section (theo thứ tự):** 1. … 2. … 3. …
**Kiểu dữ liệu** — `src/content/<tinh-nang>.ts`:

```ts
export interface … {
  …
}
export const … : …[] = [];
```

**Token:** `text-gold`, `bg-dark`, `bg-card`, `font-serif` (tiêu đề), `font-sans` (chữ thường)
**Ảnh:** `src/assets/photos/…`
**Chỉ huy sửa trước (file dùng chung):** `App.tsx` (route), `Navbar.tsx` (link), …

## Cây việc

| Mã | Agent | Đợt | File sở hữu | Đầu ra | Trạng thái |
|---|---|---|---|---|---|
| TD-<số>.0 | Chỉ huy | 0 | file dùng chung | khung route + kiểu | ☐ |
| TD-<số>.1 | noi-dung | 1 | `src/content/<tinh-nang>.ts`, `sources.md` | nội dung có nguồn | ☐ |
| TD-<số>.2 | giao-dien | 1 | `src/components/<tinh-nang>/A.tsx` | section A | ☐ |
| TD-<số>.3 | giao-dien | 1 | `src/pages/<Trang>.tsx`, `src/components/<tinh-nang>/B.tsx` | trang + section B | ☐ |
| TD-<số>.4 | kiem-tra | 2 | `review.md` | kết luận ĐẠT / CẦN SỬA | ☐ |
| TD-<số>.5 | Chỉ huy | 3 | gộp, `FIGMA_SYNC.md`, `README.md` | nhánh xem trước | ☐ |

Quy tắc: hai việc cùng đợt không được trùng file sở hữu.

## Câu hỏi cho Midu
- …
