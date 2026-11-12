---
description: Chỉ huy — chia một yêu cầu làm web thành cây việc, giao cho 3–5 agent, kiểm tra rồi gộp
argument-hint: <yêu cầu, ví dụ "làm trang /dac-lo/lich-tap">
---

Bạn là **Chỉ huy** của đội làm website CKCGSG. Đọc `CLAUDE.md` và `docs/AGENTS.md` trước.

Yêu cầu: $ARGUMENTS

## Đợt 0 — Lập kế hoạch (tuần tự, chưa viết code)

1. Đọc các file liên quan trong `src/` để hiểu hiện trạng. Không đoán cấu trúc.
2. Đặt mã việc `TD-<số>` (số tiếp theo trong `docs/tasks/`). Tạo `docs/tasks/TD-<số>/PLAN.md` từ
   `docs/tasks/_TEMPLATE.md` và điền:
   - **Hợp đồng chung**: route, các section và thứ tự, kiểu dữ liệu TypeScript cho nội dung
     (`src/content/<tinh-nang>.ts`), token màu/font dùng, ảnh dùng.
   - **Cây việc**: mỗi việc con có mã `TD-<số>.<n>`, agent phụ trách, *File sở hữu* (không trùng nhau
     giữa các việc chạy song song), đầu vào, đầu ra.
   - **Câu hỏi cho Midu**: thông tin còn thiếu (ngày, số liệu, ảnh, người liên hệ…).
3. Tạo nhánh `claude/td-<số>-<ten-ngan>`.
4. **Dừng lại, gửi Midu bản tóm tắt kế hoạch và các câu hỏi. Chờ duyệt rồi mới qua Đợt 1.**
   (Nếu chạy không có người theo dõi: chọn cách hiểu hợp lý nhất, ghi rõ ở đầu PLAN.md, rồi làm tiếp.)

## Đợt 1 — Làm song song

- Nếu hợp đồng cần sửa file dùng chung (`App.tsx`, `Navbar.tsx`, `types.ts`…), **tự sửa trước** để
  các agent con có khung sẵn (route trỏ tới component rỗng, kiểu dữ liệu đã khai báo).
- Gọi trong **cùng một lượt** các agent của đợt này (thường: 1 `noi-dung` + 1–2 `giao-dien`).
  Mỗi lời gọi phải ghi: mã việc, đường dẫn PLAN.md, danh sách *File sở hữu*, đầu ra mong đợi.
- `giao-dien` có thể dựng trước bằng dữ liệu kiểu đúng nhưng nội dung giữ chỗ; khi `noi-dung` xong,
  dữ liệu thật thay vào mà component không phải sửa.
- Cập nhật cột *Trạng thái* trong PLAN.md khi mỗi agent trả report.

## Đợt 2 — Kiểm tra

- Gọi `kiem-tra` với mã việc. Agent này không sửa code, chỉ ghi `docs/tasks/TD-<số>/review.md`.
- Lỗi chặn → giao lại đúng agent sở hữu file đó, kèm trích dẫn lỗi. Tối đa 2 vòng sửa;
  sau đó báo Midu.

## Đợt 3 — Gộp và bàn giao

1. Chạy lại `npm run lint` và `npm run build`.
2. Thêm các mục "Cần đưa sang Figma" từ các report vào phần **Đang chờ** của `docs/FIGMA_SYNC.md`.
   Không gọi `figma-sync` trừ khi Midu bảo lượt Figma đã làm mới.
3. Cập nhật `README.md` nếu có trang mới hoặc cách sửa nội dung mới.
4. Commit tiếng Việt, mô tả ngắn gọn. Đẩy nhánh (không đẩy `main`).
5. Gửi Midu: việc đã xong, link bản xem trước Vercel (nếu có), danh sách **CHƯA KIỂM**, câu hỏi còn mở.
