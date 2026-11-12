# Kiểm tra website — 05/11/2026

Tóm tắt: web ổn định — **không có lỗi JS, không cuộn ngang, không lỗi dấu tiếng Việt, cuộn mượt** trên điện thoại
giả lập CPU chậm 4×. Vấn đề chính nằm ở **ảnh giữ chỗ trên /hoat-dong**, **form chưa nối dịch vụ gửi**, và
**nút biểu tượng quá nhỏ** trên mobile.

- 9 trang × 3 khổ (375 / 768 / 1440px; trang 3D chỉ mobile + desktop) = 25 lượt
- Công cụ: `npm run audit` (Playwright, Chromium), soát bằng mắt ảnh chụp của /dac-lo và /hoat-dong (mobile)
- Bản kiểm: nhánh `claude/agent-team-setup`, build cục bộ (`vite preview`)

## 🔴 Lỗi chặn

| # | Trang | Khổ | Vấn đề | Bằng chứng | Cách sửa đề xuất |
|---|---|---|---|---|---|
| 1 | /hoat-dong | mọi khổ | 7 thẻ Thiện nguyện / Thánh ca (và album ảnh trong popup — tổng 49 chỗ trong `src/constants.ts`) dùng ảnh ngẫu nhiên từ `picsum.photos` — người xem thấy ảnh stock không liên quan (hoặc ô trống nếu picsum lỗi) | `audit.json` → `brokenImgs`; `grep picsum src/constants.ts`; README "Việc còn mở" | Xin ảnh thật từ nhóm, nén < 300KB, đặt vào `src/assets/photos/`; tạm thời dùng ảnh có sẵn của nhóm thay vì picsum |
| 2 | /lien-he, /dac-lo#nhan-tin | — | Form liên hệ và ô đăng ký nhận tin **chưa nối dịch vụ gửi**: người muốn cộng tác bấm gửi mà không ai nhận | README "Việc còn mở" (chưa thử bấm gửi) | Nối Google Sheets (Apps Script) hoặc EmailJS; khi chưa nối thì đổi nút thành "Gửi email" (mailto) |

## 🟠 Nên sửa sớm

| # | Trang | Khổ | Vấn đề | Bằng chứng | Cách sửa đề xuất |
|---|---|---|---|---|---|
| 3 | mọi trang | mobile, tablet | Nút "Mở menu" và biểu tượng YouTube / Facebook / Email ở chân trang nhỏ hơn 32px — khó bấm bằng ngón tay (khuyến nghị ≥ 44px) | `smallTapTargets` | Thêm `p-3` (hoặc `min-w-11 min-h-11`) quanh biểu tượng, giữ nguyên kích thước icon |
| 4 | /tuyen-dien-vien | mọi khổ | Trang không có tiêu đề `<h1>` (ảnh hưởng tìm kiếm Google và trình đọc màn hình) | `h1: 0` | Đổi tiêu đề chính của `CastingSection` thành `h1` khi đứng riêng một trang |
| 5 | /dac-lo/khuon-vien, /dac-lo/so-do | mobile | Nút điều khiển bản đồ ("Thu gọn", nút chế độ) nhỏ | `smallTapTargets` | Tăng vùng bấm như mục 3 |

## 🟢 Cải thiện trải nghiệm & mời cộng tác

| # | Vấn đề | Đề xuất |
|---|---|---|
| 6 | Mũi tên "→" trong nút ("Vở Đắc Lộ →", "Đọc câu chuyện của nhóm →") không có trong font Be Vietnam Pro nên máy vẽ bằng font hệ thống — lệch nét nhẹ so với chữ | Thay ký tự "→" bằng icon `ArrowRight` của Lucide |
| 7 | Sơ đồ 3D tải ~1MB JS | Đã tải riêng khi mở trang sơ đồ (không ảnh hưởng trang khác) — giữ nguyên; có thể thêm chữ "Đang tải sơ đồ…" thay khung trống |
| 8 | Lời mời cộng tác hiện chỉ đầy đủ ở /dac-lo#cong-tac | Thêm một dải "Đồng hành cùng Đắc Lộ 2027" ngắn ở cuối /vo-dien, /hoat-dong, /cau-chuyen trỏ về /dac-lo#cong-tac |

## ⚪ CHƯA KIỂM

- **Video YouTube trên màn LED sân khấu (/dac-lo/so-do)** và ảnh picsum: máy kiểm không ra được mạng ngoài, nên không biết video có phát không.
- **Link ngoài** (Facebook, YouTube kênh, Google Maps): chưa mở thử.
- **Thời gian tải thật**: số đo (~0,9–1,6 giây) là trên máy chủ cục bộ, chưa tính mạng 4G. Nên chạy thêm PageSpeed Insights trên bản Vercel.
- **Điện thoại thật / Safari iOS**: chỉ giả lập Chromium; chế độ Dạo khuôn viên và nhà nguyện chưa thử thao tác.
- **Bấm thử từng tính năng** (popup vở diễn, tab năm, menu mobile, gửi form): bước soát bằng tay theo `/kiem-tra-web` bước 2 chưa chạy đủ.

## Đã kiểm, ổn

- `npm run lint`, `npm run build`: qua.
- 0 lỗi JavaScript trên cả 9 trang.
- 0 trang bị cuộn ngang ở cả 3 khổ.
- Chữ tiếng Việt có dấu: toàn bộ vẽ bằng Be Vietnam Pro / Playfair Display, không rơi về font khác (trừ ký tự "→", mục 6).
- Cuộn mượt: 0 khung hình bị giật (> 50ms) trên điện thoại giả lập CPU chậm 4×; xê dịch bố cục (CLS) ≤ 0,04 — tốt.
- Mọi link nội bộ và `#mục` đều trỏ đúng chỗ.
- Hiệu ứng tôn trọng chế độ "giảm chuyển động" của máy (`useReducedMotion`).
