# Làm web bằng nhiều agent

Một **Chỉ huy** chia việc, **3–4 agent con** làm song song trong phạm vi file rõ ràng, một agent **kiểm tra**
soát lại, rồi Chỉ huy gộp. Agent con không nói chuyện với nhau mà trao đổi qua file trong `docs/tasks/`.
Quy tắc chi tiết: [`CLAUDE.md`](../CLAUDE.md).

## Dùng thế nào

Mở repo trong Claude Code, gõ:

```
/chi-huy làm trang /dac-lo/lich-tap hiển thị lịch tập theo tuần, có lọc theo nhóm hát / múa / kịch
```

Chỉ huy sẽ:

1. **Đợt 0** — đọc code, viết `docs/tasks/TD-x/PLAN.md` (hợp đồng chung + cây việc + câu hỏi), **dừng lại chờ bạn duyệt**.
2. **Đợt 1** — sửa file dùng chung (route, kiểu dữ liệu), rồi gọi song song `noi-dung` + 1–2 `giao-dien`.
3. **Đợt 2** — gọi `kiem-tra`; lỗi chặn được giao lại đúng agent, tối đa 2 vòng.
4. **Đợt 3** — gộp, thêm mục chờ vào `FIGMA_SYNC.md`, đẩy nhánh `claude/td-x-…` để Vercel tạo bản xem trước.

Khi lượt Figma đã làm mới: *"Gọi figma-sync đồng bộ các mục đang chờ."*

## Kiểm tra toàn bộ web

```
/kiem-tra-web                 # cả web
/kiem-tra-web /dac-lo         # soát kỹ một trang
```

Chạy `npm run audit` (máy đo: lỗi, font tiếng Việt, cuộn ngang, độ mượt, link, nút nhỏ) rồi 2 agent `kiem-tra`
soát ảnh chụp và tính năng, ra `docs/audits/<ngày>/BAO-CAO.md` chia 🔴 / 🟠 / 🟢. Không sửa code.
Kèm `npm run soat-ma` (soát mã nguồn) và bảng chấm thiết kế [`SOAT-THIET-KE.md`](SOAT-THIET-KE.md):
báo cáo có **Điểm thiết kế**, **Điểm AI slop** (A–F, so được với lần trước) và mục **Sửa nhanh**.
Sửa thì gõ tiếp: `/chi-huy sửa các lỗi 🔴 trong docs/audits/<ngày>/BAO-CAO.md`.

Nên chạy: trước khi gộp một việc lớn vào `main`, và khoảng 2 tuần một lần trước ngày diễn.
Lần đầu trên máy cần: `npm install` rồi `npx playwright install chromium`.

## Bạn duyệt ở đâu

| Lúc | Xem gì |
|---|---|
| Sau Đợt 0 | `PLAN.md`: section có đúng ý không, có trả lời các câu hỏi chưa |
| Sau Đợt 3 | bản xem trước Vercel + danh sách **CHƯA KIỂM** |

## Thư mục một việc

```
docs/tasks/TD-1/
├── PLAN.md          # Chỉ huy viết — hợp đồng + cây việc
├── sources.md       # noi-dung viết — thông tin → nguồn
├── TD-1.1.report.md # mỗi agent con một report
├── TD-1.2.report.md
├── review.md        # kiem-tra viết
└── shot-375.png …   # ảnh chụp khổ màn hình (nếu chụp được)
```

## Khi nào không cần cả đội

Sửa chữ, đổi ảnh, chỉnh một nút — cứ bảo Claude làm thẳng, không cần `/chi-huy`.
Đội chỉ đáng dùng khi việc có **từ 2 phần độc lập trở lên** (nội dung + nhiều section, hoặc nhiều trang).
