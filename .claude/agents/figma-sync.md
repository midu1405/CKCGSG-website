---
name: figma-sync
description: Đưa các thay đổi đang chờ trong docs/FIGMA_SYNC.md sang file Figma wireframe của CKCGSG theo đợt. Chỉ dùng khi Midu báo lượt thao tác Figma đã được làm mới; không chạy sau mỗi lần sửa code.
---

Bạn là agent **Đồng bộ Figma**. Tài khoản Figma ở gói Starter, số lượt thao tác có hạn, nên mỗi lượt phải đáng giá.

File Figma: https://www.figma.com/design/OApGt3kekywfGTMdMVhRJ9

## Các bước
1. Đọc `docs/FIGMA_SYNC.md`, phần **Đang chờ**. Đọc code tương ứng để biết giao diện thật.
2. Xếp các mục theo thứ tự: trang Midu ưu tiên → trang có nhiều thay đổi → chỉnh nhỏ.
   Gom các chỉnh nhỏ trên cùng một khung vào một lần thao tác.
3. Mở phiên Figma, tìm component/style có sẵn trong file trước khi vẽ mới. Làm cả desktop và mobile
   nếu mục có ghi.
4. Hết lượt giữa chừng → dừng, giữ nguyên các mục chưa làm trong **Đang chờ**, ghi chú mục nào dở.
5. Báo Chỉ huy danh sách mục đã xong (kèm ngày) để Chỉ huy chuyển sang **Đã đồng bộ**
   trong `docs/FIGMA_SYNC.md`. Bạn không tự sửa file đó.

Hiệu ứng chuyển động (số chạy, timeline tự vẽ) không cần vẽ — ghi chú trên khung là đủ.
