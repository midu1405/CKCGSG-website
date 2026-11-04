# CLAUDE.md — quy tắc chung cho mọi agent

Website Nhóm Ca Kịch Công Giáo Sài Gòn (CKCGSG). React 19 + TypeScript + Vite + Tailwind 4.
Đọc `README.md` để biết các trang và cấu trúc thư mục. Hướng dẫn quy trình nhiều agent: `docs/AGENTS.md`.

## Đội hình (tối đa 5)

| Vai | Ở đâu | Việc |
|---|---|---|
| **Chỉ huy** | phiên chính, lệnh `/chi-huy` | Lập kế hoạch, chốt hợp đồng chung, giao việc, gộp kết quả |
| **noi-dung** | `.claude/agents/noi-dung.md` | Viết / soát nội dung, ghi nguồn |
| **giao-dien** | `.claude/agents/giao-dien.md` | Dựng component / section (có thể chạy 2 con song song) |
| **kiem-tra** | `.claude/agents/kiem-tra.md` | Build, lint, khổ màn hình, đối chiếu nguồn — không sửa code |
| **figma-sync** | `.claude/agents/figma-sync.md` | Đưa các mục đang chờ sang Figma theo đợt |

Các agent con không nói chuyện với nhau. Mọi trao đổi đi qua file trong `docs/tasks/<MÃ>/` và qua Chỉ huy.

## Nguyên tắc bắt buộc

1. **Có nguồn thì ghi nguồn. Chưa kiểm được thì nói chưa kiểm.** Không bịa ngày, số liệu, tên người,
   số điện thoại. Thông tin chưa xác nhận đánh dấu `// CHƯA KIỂM:` trong code và liệt kê trong `report`.
2. **Chỉ sửa file mình được giao.** Danh sách file của từng việc nằm trong cột *File sở hữu* của
   `docs/tasks/<MÃ>/PLAN.md`. Cần sửa file ngoài danh sách → ghi vào report, không tự sửa.
3. **File dùng chung chỉ Chỉ huy được sửa:** `src/App.tsx`, `src/components/Navbar.tsx`,
   `src/components/Footer.tsx`, `src/index.css`, `src/types.ts`, `src/constants.ts`, `package.json`,
   `docs/FIGMA_SYNC.md`, `README.md`.
4. **Tách nội dung khỏi giao diện.** Nội dung mới đặt trong `src/content/<tinh-nang>.ts`
   (export mảng/đối tượng có kiểu). Component chỉ đọc dữ liệu, không chứa đoạn văn dài.
   Trang cũ (ví dụ `DacLoPage.tsx` có dữ liệu ngay đầu file) giữ nguyên, chỉ tách khi kế hoạch yêu cầu.
5. **Dùng token có sẵn, không gõ mã màu:** `text-gold`, `bg-dark`, `bg-card`, `font-serif` (tiêu đề, con số),
   `font-sans` (chữ thường). Tái sử dụng `PageParts.tsx`, `Motion.tsx` trước khi viết mới.
6. **Ảnh** đặt ở `src/assets/photos/`, tên không dấu, nén < 300KB, rộng ≤ 2000px.
7. **Mỗi agent kết thúc bằng một file report** `docs/tasks/<MÃ>/<mã-việc>.report.md` theo mẫu bên dưới.
8. Code phải qua `npm run lint` và `npm run build`.
9. Không đẩy lên `main`. Làm trên nhánh `claude/<ma-viec>`; Vercel tự tạo bản xem trước.

## Mẫu report

```md
# TD-x — <tên việc>
- Trạng thái: xong | còn dở | bị chặn
- File đã sửa: …
- Nguồn đã dùng: … (tài liệu, link, người cung cấp)
- CHƯA KIỂM: … (hoặc "không có")
- Cần Chỉ huy xử lý: … (file dùng chung cần sửa, câu hỏi cho Midu)
- Cần đưa sang Figma: … (khung nào, thay đổi gì)
```
