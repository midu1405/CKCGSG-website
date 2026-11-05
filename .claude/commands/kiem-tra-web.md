---
description: Kiểm tra toàn bộ website — mọi trang, 3 khổ màn hình, font tiếng Việt, lỗi, link, độ mượt, trải nghiệm và lời mời cộng tác; ghi báo cáo, không sửa code
argument-hint: [trang cần soát kỹ, ví dụ "/dac-lo" — bỏ trống = cả web]
---

Bạn là **Chỉ huy** đang chạy một đợt kiểm tra toàn bộ website CKCGSG. Đọc `CLAUDE.md` trước.
Phạm vi: $ARGUMENTS (bỏ trống = mọi trang trong `src/App.tsx`).
**Đợt này không sửa code trong `src/`.** Đầu ra là báo cáo và danh sách việc sửa.

## Bước 1 — Máy đo (tự động)

```bash
npm run lint && npm run build
npm run audit          # lần đầu trên máy: npx playwright install chromium
```

`scripts/audit.mjs` mở từng trang ở 375 / 768 / 1440px bằng trình duyệt thật và ghi
`docs/audits/<ngày>/audit.json` + ảnh chụp:
lỗi JS, tài nguyên tải hỏng, ảnh vỡ / thiếu `alt`, cuộn ngang, **chữ vẽ bằng font ngoài
Be Vietnam Pro / Playfair Display** (bắt lỗi dấu tiếng Việt), nút quá nhỏ để bấm, xê dịch bố cục (CLS),
khung hình bị giật khi cuộn trên điện thoại giả lập CPU chậm 4×, link nội bộ / `#mục` hỏng, file nặng.

Lưu ý khi đọc: môi trường không có mạng ngoài sẽ báo YouTube, picsum… tải hỏng — ghi là
**CHƯA KIỂM (do mạng máy kiểm)**, không phải lỗi web, trừ khi chính link đó là ảnh giữ chỗ.

## Bước 2 — Soát bằng mắt (song song, gọi trong cùng một lượt)

Gọi 2 agent `kiem-tra`, mỗi con một nửa số trang, giao rõ: đọc `audit.json`, **mở các ảnh chụp
bằng Read** và soát theo danh sách dưới. Mỗi con ghi `docs/audits/<ngày>/review-<a|b>.md`.

**Font & chữ:** dấu tiếng Việt (ố, ế, ự, ữ, Đ) không lệch, không vỡ; tiêu đề không rớt 1 chữ mồ côi
xuống dòng; chữ không tràn khung, không bị che bởi thanh menu.
**Hình ảnh:** ảnh đúng nội dung, không ảnh mẫu / ảnh ngẫu nhiên, không méo, chữ trên ảnh đọc được.
**Tính năng:** menu mobile mở/đóng; popup vở diễn; tab năm ở /hoat-dong; đếm ngược Đắc Lộ;
sơ đồ 3D và khuôn viên có hiện; nút gọi điện / email đúng số, đúng địa chỉ; form nào **chưa nối**
dịch vụ gửi phải ghi rõ (người dùng bấm gửi mà không ai nhận là lỗi nặng).
**Mượt mà:** hiệu ứng không làm chữ hiện quá chậm; trang có `useReducedMotion`; ảnh lớn có lazy load.
**Mời cộng tác:** từ mọi trang có tối đa 2 lần bấm tới /dac-lo#cong-tac hoặc /lien-he không?
Lời kêu gọi có nói rõ *cần gì* và *liên hệ ai* không? Thông tin liên hệ có thống nhất giữa các trang không?

## Bước 3 — Báo cáo

Gộp thành `docs/audits/<ngày>/BAO-CAO.md`:

```md
# Kiểm tra website — <ngày>
Tóm tắt: <3 dòng> · Số trang · Khổ màn hình · Công cụ
## 🔴 Lỗi chặn — người dùng gặp ngay / mất người cộng tác
| # | Trang | Khổ | Vấn đề | Bằng chứng (ảnh / dòng audit.json) | Cách sửa đề xuất |
## 🟠 Nên sửa sớm
## 🟢 Cải thiện trải nghiệm & mời cộng tác
## ⚪ CHƯA KIỂM (và lý do)
## Đã kiểm, ổn
```

So với báo cáo lần trước trong `docs/audits/` (nếu có): ghi mục nào đã hết, mục nào mới.

## Bước 4 — Hỏi Midu

Gửi Midu tóm tắt + đường dẫn báo cáo, hỏi sửa nhóm nào. Khi được duyệt, mỗi nhóm thành một việc
`/chi-huy` riêng (ví dụ `/chi-huy sửa các lỗi 🔴 trong docs/audits/<ngày>/BAO-CAO.md`).
