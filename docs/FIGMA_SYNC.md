# Đồng bộ Figma ↔ code

File Figma: [CKCGSG – Wireframe website](https://www.figma.com/design/OApGt3kekywfGTMdMVhRJ9)

Tài khoản Figma đang ở gói Starter nên số lần Claude được thao tác trong file bị giới hạn.
Vì vậy các thay đổi code được **gom lại và cập nhật sang Figma theo đợt** khi lượt thao tác
được làm mới. Mỗi lần sửa code mà chưa kịp đưa sang Figma, thêm một dòng vào mục "Đang chờ".

## Đang chờ cập nhật sang Figma

- [ ] **Đóng tuyển diễn viên (14/11/2026, nhánh `claude/dong-tuyen-dien-vien`)** — công tắc `CASTING.open = false`:
  - **/tuyen-dien-vien desktop + mobile:** dựng khung mới "Đợt tuyển diễn viên 2026 đã khép lại" — chip xám
    "Đã đóng nhận hồ sơ · 30/06/2026", lời cảm ơn + "dàn diễn viên Đắc Lộ đã đủ và đang tập luyện";
    2 thẻ: **Vẫn muốn góp sức?** (viền vàng, nút vàng "CỘNG TÁC CHO ĐẮC LỘ" → /dac-lo#cong-tac) và
    **Chờ đợt tuyển sau** (nút viền Facebook, YouTube); khối thu gọn "Yêu cầu hồ sơ đợt 2026 — tham khảo".
    Giữ khung cũ (đang tuyển) làm biến thể để dùng lại khi mở đợt mới.
  - **Navbar:** bỏ mục "Tuyển diễn viên". **Footer** (cột Khám phá, cuối danh sách): "Tuyển diễn viên (đã đóng)" → /tuyen-dien-vien.
  - **Trang chủ:** link dưới nút chính đổi "Góp sức cho vở Đắc Lộ"; thẻ "Tham gia cùng nhóm" → "Góp sức hậu trường"
    (icon búa, nút "CỘNG TÁC CHO ĐẮC LỘ"). **/cau-chuyen:** nút viền "GÓP SỨC CHO VỞ ĐẮC LỘ".
  - **/lien-he:** chủ đề form "Tham gia nhóm / tuyển diễn viên" → "Tham gia nhóm".
- [ ] **Link mạng xã hội chính thức (14/11/2026, nhánh `claude/mang-xa-hoi-soat-thiet-ke`)**:
  - **Footer (mọi trang):** link Facebook → facebook.com/cakichconggiaosaigon, YouTube → youtube.com/@CaKichCongGiaoSaiGon
    (chỉ đổi link, giao diện giữ nguyên).
  - **/lien-he desktop + mobile:** khối mới "THEO DÕI NHÓM" ngay dưới Email — 2 nút viền mảnh bo `rounded-xl`, cao ≥ 44px:
    [icon Facebook] **Facebook** · trang chính thức, [icon YouTube] **YouTube** · kênh chính thức; rê chuột viền + chữ vàng;
    desktop xếp ngang, mobile xếp dọc.
- [ ] **TD-1 · Sửa lỗi giao diện (12/11/2026, nhánh `claude/td-1-sua-giao-dien`)** — chi tiết trong
  `docs/tasks/TD-1/TD-1.1.report.md` và `TD-1.2.report.md`, mục "Cần đưa sang Figma":
  - **Đắc Lộ desktop + mobile:** nhãn 3 cột "2014 – 2027…" vàng → đỏ rượu; chữ phụ số liệu trắng 70%; form cộng tác:
    "Chọn lĩnh vực…" + mũi tên xổ, nhãn "Lời nhắn", trạng thái lỗi (viền + chữ đỏ rượu dưới ô); form nhận tin: lỗi email,
    icon dấu tích thay 🎭; mobile: khối "Nhóm Ca Kịch…" căn trái, eyebrow 2 dòng thẳng lề.
  - **Sơ đồ 3D + Khuôn viên:** tiêu đề trong khung đen 60% bo góc; mobile: hàng nút vuốt ngang cao 44px,
    dòng hướng dẫn cảm ứng dưới hàng nút.
  - **Popup vở diễn:** nút X 44px cố định góc trên; mobile hiện sẵn 2 mũi tên ảnh; trạng thái "Đã sao chép link".
  - **Thẻ vở (mobile):** dòng "Xem chi tiết" + mũi tên; ngày trắng 60% không xuống dòng.
  - **Thanh "Đã có phiên bản mới":** nền tối viền vàng, nút ✕, trạng thái cảnh báo khi đang gõ form.
  - **Menu mobile:** nút ☰ vùng bấm 44px, mỗi link cao 48px; nút "Vở Đắc Lộ" dùng icon mũi tên.
  - **/lien-he:** ô Chủ đề có mũi tên xổ; lỗi dưới từng ô; "(mở trang mới)". **Trang chủ 768:** H1 cỡ 7xl.
    **/cau-chuyen:** h1 ngắt "…nay là một / gia đình 120+.".
- [ ] **02 · Trang Đắc Lộ – Desktop** và **05 · Đắc Lộ – Mobile**: dựng lại theo landing page mới
  (nhánh `claude/dac-lo-landing`): hero kỷ niệm 400 năm + đếm ngược tới 04/06/2027, cột mốc 400 năm,
  4 thông điệp, sơ nét Cha Đắc Lộ + dòng thời gian, kế hoạch công diễn + số liệu, quy mô dàn dựng,
  lời mời cộng tác (3 lĩnh vực) + thẻ liên hệ chị Teresa Nguyễn Lan Nghi (0908 033 357, ckcgsg@gmail.com),
  nhận thông báo, tuyển diễn viên. Ảnh đã có sẵn trong khung "📷 Thư viện ảnh".
- [ ] **Tách trang (tham khảo sight-sound.com)** — cấu trúc mới:
  - **01 · Trang chủ** (desktop + mobile) dựng lại: GIỮ hero cũ (ảnh hero.jpg, "Mang Tin Mừng Qua Nghệ Thuật
    Ca Kịch") → mục vở sắp tới (Đắc Lộ, nền chân dung) → 3 thẻ "Nhóm làm những gì?"
    (Ca kịch / Thiện nguyện / Thánh ca & hợp xướng) → câu chuyện rút gọn + số liệu → 3 vở gần nhất
    + nút "Tất cả vở diễn" → 2 thẻ Tham gia / Đồng hành. Bỏ kho lưu trữ, thiện nguyện, chương trình
    khác, liên hệ khỏi trang chủ.
  - Trang mới: **/vo-dien** (khối Sắp diễn + chia giai đoạn "2023 – nay" / "2015 – 2019"),
    **/hoat-dong** (Thiện nguyện + Thánh ca & hợp xướng có tab năm), **/cau-chuyen** (đôi nét,
    6 cột mốc, 4 giá trị có ảnh, sứ mệnh + Mt 5,14–16), **/tuyen-dien-vien**, **/lien-he**.
  - Navbar: Vở diễn · Hoạt động · Câu chuyện · Tuyển diễn viên · Liên hệ + nút vàng "Vở Đắc Lộ".
    Footer: cột Khám phá + Kết nối.
  - Ảnh mới cho trang Câu chuyện: story-10-nam, value-san-khau, value-cau-nguyen, value-thanh-le,
    value-gia-dinh, mission (cần đưa vào "📷 Thư viện ảnh").

- [ ] **Font mới toàn bộ wireframe**: tiêu đề + con số = **Playfair Display** (Bold, nghiêng vàng cho
  "Nghệ Thuật Ca Kịch"), chữ thường / nhãn / nút = **Be Vietnam Pro**. Wireframe hiện đang dùng Inter.
  Cả hai font đều có sẵn trong Figma (Google Fonts).

- [ ] **Thẻ liên hệ Đắc Lộ**: nhãn "LIÊN HỆ CỘNG TÁC" 14px; dòng "Teresa Nguyễn Lan Nghi (đậm) · Đại diện
  phụ trách dự án" 16px; số điện thoại + email Be Vietnam Pro Bold 18–20px; 2 nút Gọi điện / Gửi email bên phải.
  (Hiệu ứng chuyển động — số chạy, timeline tự vẽ — chỉ có trên web, không cần vẽ trong Figma; có thể ghi chú.)

## Đã đồng bộ

- 29/10/2026 — Trang chủ (desktop + mobile): poster thật cho 11 vở từ proposal, ngày diễn mới,
  thêm vở "Đi Tìm Inhaxio" (12.2025), mục "Vở sắp ra mắt" dùng ảnh chân dung Cha Đắc Lộ.
- 28/10/2026 — Ảnh thật từ repo vào toàn bộ wireframe; khung "📷 Thư viện ảnh".
- 10/10/2026 — Wireframe ban đầu: Trang chủ, Đắc Lộ, popup chi tiết (desktop + mobile), menu mobile.
