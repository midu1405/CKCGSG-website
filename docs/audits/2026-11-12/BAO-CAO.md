# Kiểm tra website — 12/11/2026

**Tóm tắt.** Về kỹ thuật web chạy tốt: không lỗi JS, không cuộn ngang, chữ có dấu đúng font, cuộn mượt, các form gửi
an toàn và có chống gửi trùng. Vấn đề lớn nhất nằm ở **nội dung lỗi thời / giữ chỗ** mà người xem gặp ngay:
hạn tuyển diễn viên đã qua, link YouTube giả, thiếu tên ngân hàng, số vở diễn mâu thuẫn, ảnh picsum.
Ngoài ra **thông tin liên hệ và "gửi xong rồi ai gọi lại"** chưa rõ — đây là chỗ quyết định có giữ được người muốn cộng tác hay không.

- Bản kiểm: `main` @ `73161a9` (form Supabase, nhà nguyện, tự tải bản mới) + bộ agent, nhánh `claude/kiem-tra-2026-11-12`
- 9 trang × 3 khổ (375 / 768 / 1440) = 25 lượt máy đo (`npm run audit`) + 2 agent `kiem-tra` soát ảnh và **bấm thử tính năng**
  (chi tiết: [`review-a.md`](review-a.md) — trang chủ, Đắc Lộ, 3D · [`review-b.md`](review-b.md) — các trang còn lại, menu, footer)
- Form được thử bằng phản hồi giả — **không gửi dữ liệu thật**. Phía máy chủ Supabase được Chỉ huy đọc trực tiếp (quyền, hàm, trigger).

Tổng: **🔴 6 · 🟠 14 · 🟢 15 · ⚪ 6**

## 🔴 Lỗi chặn — người xem gặp ngay

| # | Trang | Vấn đề | Bằng chứng | Cần gì để sửa |
|---|---|---|---|---|
| 1 | /tuyen-dien-vien | **Hạn chót "30/06/2026" đã qua** 4 tháng. Ngày này còn in sẵn trong ảnh nền. Nút cuối /cau-chuyen "Tham gia cùng nhóm" cũng dẫn về đây | `CastingSection.tsx:40`; ảnh nền | Midu: còn tuyển không, cho dự án nào, hạn mới. Ảnh nền không chữ |
| 2 | /vo-dien, trang chủ (popup) | **9/11 vở có nút "Xem trên YouTube" trỏ tới video giả** (`watch?v=placeholder1…9`) | `constants.ts:66–148` | Link video thật; chưa có thì ẩn nút (xoá trường `youtubeUrl`) |
| 3 | /lien-he | **Thông tin chuyển khoản thiếu tên ngân hàng** — người muốn ủng hộ không chuyển được | `ContactPage.tsx:53` | Midu: tên ngân hàng (+ chi nhánh); có thể thêm mã VietQR |
| 4 | trang chủ | **Mâu thuẫn số vở diễn trên cùng một trang:** ô số liệu "15+ Vở diễn", ngay dưới là "11 vở diễn" / "Tất cả 11 vở diễn" | `HomePage.tsx:18` vs `:32`, `:153` | Midu: số đúng |
| 5 | /hoat-dong | **Còn từ 05/11:** 7 thẻ + album popup dùng ảnh ngẫu nhiên `picsum.photos` (49 chỗ) | `constants.ts` | Ảnh thật các chuyến thiện nguyện / hợp xướng |
| 6 | /dac-lo, /lien-he | **Lỗi mạng hiện chữ kỹ thuật tiếng Anh** "TypeError: Failed to fetch" thay cho câu tiếng Việt có số điện thoại — người dùng 4G yếu sẽ gặp đúng lúc muốn đăng ký | `DacLoPage.tsx:133`, `ContactPage.tsx:27`; thử cắt mạng | Sửa code, không cần Midu |

## 🟠 Nên sửa sớm

| # | Trang | Vấn đề | Bằng chứng |
|---|---|---|---|
| 7 | /dac-lo, /lien-he, /tuyen-dien-vien | **Gửi xong rồi ai liên hệ, khi nào?** Đắc Lộ hứa "sớm nhất", /lien-he hứa "vài ngày", tuyển diễn viên không nói gì. Phía máy chủ: cả 4 bảng (liên hệ, cộng tác, nhận tin, cầu nguyện) **đều tự đẩy sang Google Sheet** qua trigger `ping_sheet` — dữ liệu không bị bỏ quên, nhưng chưa rõ ai được báo khi có dòng mới | A5, B10; Supabase `pg_trigger` |
| 8 | /lien-he, footer, /tuyen-dien-vien | **Liên hệ không đồng bộ:** số 0908 033 357 và chị Teresa chỉ có ở /dac-lo; nơi khác chỉ có email; không có Zalo, không có địa chỉ. Email gõ cứng ở 6 file | A6, B9 |
| 9 | /dac-lo | Số liệu buổi diễn **chưa diễn ra** viết như đã xảy ra ("10.000+ khán giả theo dõi", "200+ phục trang") — không ghi "dự kiến", chưa có nguồn. Sơ đồ 3D tính sức chứa tại chỗ ≈ 3.240 | A7 |
| 10 | /dac-lo ↔ /, /cau-chuyen | "130+ diễn viên" cạnh "120+ thành viên"; "vở **ca** kịch" (/dac-lo) và "vở **nhạc** kịch" (các trang khác); "10+ năm" và "hơn 12 năm" | A8, A19, B13 |
| 11 | /dac-lo form cộng tác | Ô "Email / SĐT" chỉ kiểm độ dài (máy chủ nhận ≥ 6 ký tự bất kỳ, ví dụ `abcdef`) — có thể nhận liên hệ không dùng được | A3; hàm `submit_collab` |
| 12 | mọi trang | **Menu mobile:** bấm link trang đang đứng thì menu không đóng (tưởng hỏng); Esc không đóng; nền vẫn cuộn | A11, B6 |
| 13 | /vo-dien, trang chủ | **Popup vở diễn:** Esc không đóng, trang nền vẫn trôi khi lăn chuột, nút X không có nhãn cho trình đọc màn hình | B5, A20 |
| 14 | mọi trang | **Thanh "Đã có phiên bản mới":** bấm "Tải lại" khi đang gõ form thì **mất hết chữ, không cảnh báo**; thanh không tắt được, cùng màu vàng với nút chính; gãy 2 dòng ở 375px | B8, B23 |
| 15 | /dac-lo/so-do, /khuon-vien | Ở 375px **khối nút che nửa trên màn hình** và chồng lên nhãn 3D; dòng phụ vàng trên mái nhà sáng gần như không đọc được; **không có hướng dẫn cảm ứng** (chỉ có hướng dẫn chuột, ẩn trên mobile) | A9, A10 |
| 16 | trang chủ, /dac-lo, /cau-chuyen | **Chữ mồ côi ở tiêu đề** — nặng nhất H1 trang chủ ở 768px: chữ "Kịch" rớt riêng một dòng ngay màn hình đầu | A12, B18 |
| 17 | /dac-lo | Nhãn vàng `#b8862e` trên nền kem chỉ đạt **2,74:1** (chuẩn ≥ 4,5:1); chữ phụ trắng mờ trên ảnh khó đọc ở mobile | A13 |
| 18 | /hoat-dong, /vo-dien | Ô ngày ghi "Hè Yêu Thương" / "Tết Ấm" (lặp tên); "Hài Nhi Là Ai" vở Giáng Sinh nhưng ghi tháng 06.2016; lỗi chính tả "vớ" → "vở", "Misal" → "Missal" | B11, B12, B25 |
| 19 | mọi trang | **Còn từ 05/11:** nút menu, icon footer, nút trang 3D < 32px; /tuyen-dien-vien thiếu `<h1>` | A15, B14 |
| 20 | mọi trang | **Hiệu ứng hiện dần vẫn chạy khi máy bật "giảm chuyển động"** — báo cáo 05/11 ghi "ổn" là sai, đã sửa lại ở đây | A23 |

## 🟢 Cải thiện trải nghiệm & mời cộng tác

| # | Đề xuất | Từ |
|---|---|---|
| 21 | Thêm 1 dòng quy trình ở form cộng tác: "Gửi đăng ký → chị Teresa gọi lại trong X ngày → hẹn trao đổi" và mốc cần hỗ trợ của từng nhóm | A28 |
| 22 | Dải "Đồng hành cùng Đắc Lộ 2027" ở cuối /vo-dien, /hoat-dong, /cau-chuyen (còn từ 05/11) | B24 |
| 23 | Trên điện thoại hiện sẵn "Xem chi tiết ›" trên thẻ vở/hoạt động (hiện chỉ hiện khi rê chuột); mũi tên chuyển ảnh trong popup cũng vô hình trên cảm ứng | B15 |
| 24 | Nút X popup trôi mất khi cuộn nội dung dài → giữ cố định | B16 |
| 25 | "Chia sẻ bài viết" chia sẻ link chung /vo-dien, không phải vở đang xem; dùng `alert()` thô | B17 |
| 26 | Ô chọn lĩnh vực / chủ đề không có mũi tên ▾, trông như ô nhập chữ hoặc đã chọn sẵn | A16, B20 |
| 27 | Gợi ý "form đăng ký cộng tác" giữa form /lien-he — bấm vào là mất chữ đã gõ | B22 |
| 28 | Ký tự "→" rơi về font hệ thống (còn từ 05/11) → icon Lucide; emoji 🎭 trong lời cảm ơn → icon | 05/11 #6, A17 |
| 29 | Fallback trang 3D: còn 0,3–0,9 giây màn đen trước chữ "Đang dựng sân khấu…" | A22 |
| 30 | Đếm ngược chạy tới 00:00 ngày 04/06/2027, chưa có giờ mở màn; sau ngày diễn chưa có trạng thái "Đã công diễn" | A24 |
| 31 | Ảnh hero Đắc Lộ chỉ rộng 1024px, mềm nét trên màn 1440 | A25 |
| 32 | Khối "Dòng Tên Việt Nam" dùng lại ảnh sân khấu Jericho; khoảng trắng thừa ~200px trên desktop | A26 |
| 33 | Địa chỉ "Quận 1" — từ 07/2025 TP.HCM bỏ cấp quận; nên ghi kèm phường mới | A27 |
| 34 | **Quy tắc dự án:** `DacLoPage.tsx` gõ thẳng mã màu ở 12 dòng — bảng màu Figma Draft 3 (kem, đỏ rượu, nâu) cần thành token trong `index.css`; cập nhật luôn quy tắc 5 trong `CLAUDE.md` (đang chỉ nhắc token tối màu) | A14, B26 |
| 35 | **Supabase (an toàn, chỉ dọn thêm):** các bảng bật RLS, không có quyền đọc công khai, chỉ ghi qua hàm có kiểm tra độ dài + giới hạn tần suất — tốt. Có thể thu hồi các quyền bảng thừa của vai trò `anon` cho chắc (hiện bị RLS chặn nên chưa gây hại). Giới hạn tần suất tính **chung cho mọi người** (30 tin / 10 phút) nên một người spam có thể làm người khác tạm không gửi được | Supabase advisor + `pg_proc` |

## ⚪ CHƯA KIỂM

- **Gửi thật một tin tới Google Sheet và có ai được báo không** — cố ý không gửi dữ liệu thật vào bảng đang dùng. Có thể thử 1 lần với nội dung "TEST — xoá" nếu Midu đồng ý.
- **Nguồn nội dung:** số liệu Đắc Lộ, mốc đời Cha Đắc Lộ, tài khoản "DINH NGUYEN NHA THANH", email cá nhân `jeankiet@gmail.com` công khai ở /tuyen-dien-vien, "PAUSSIERE DE VIE" (Poussière de vie?), địa chỉ "Số 6" hay "6Bis" Tôn Đức Thắng.
- **Video YouTube màn LED, link Facebook/YouTube, mailto trên điện thoại** — máy kiểm không ra được mạng ngoài.
- **Điện thoại thật / Safari iOS**, cuộn nền khi popup mở trên cảm ứng thật, độ trễ bấm trên trang 3D.
- **Dạo khuôn viên / Nhà nguyện** (cần realtime Supabase, bị chặn trong máy kiểm).
- **Câu báo lỗi của trình duyệt bằng tiếng Việt** (máy kiểm chạy tiếng Anh).

## Đã kiểm, ổn

- `npm run lint`, `npm run build`: qua. 0 lỗi JS trên 9 trang. 0 cuộn ngang ở 3 khổ. CLS ≤ 0,04. 0 khung giật khi cuộn trên điện thoại giả lập CPU chậm 4×.
- Chữ có dấu (Đ, Ắ, Ố, ữ, ự…) vẽ đúng Be Vietnam Pro / Playfair Display; "Đắc Lộ" ở hero không còn đè dòng trên. Tương phản chữ chính trên nền kem đạt chuẩn.
- Mọi nút / neo trên trang chủ và /dac-lo dẫn đúng chỗ; 3 thẻ cộng tác tự chọn đúng lĩnh vực. Mọi link nội bộ đúng.
- Đếm ngược đúng (203 ngày lúc 11:05 12/11). Ngày 04.06.2027, địa điểm, năm thành lập 2014, các mốc vở diễn khớp giữa các trang.
- **3 form** (cộng tác, nhận tin, liên hệ): chặn ô trống / sai, khoá nút khi gửi, bấm đôi chỉ gửi 1 lần, báo thành công rõ, giữ chữ khi lỗi. Chỉ gọi hàm RPC, không ghi thẳng vào bảng. Máy chủ kiểm lại độ dài, định dạng email, chống gửi dồn.
- Popup vở diễn vừa màn 375px; tab năm /hoat-dong đúng; menu mobile tự đóng khi sang trang khác (9/9 trang).
- Ảnh nhóm A đều ảnh thật / Figma, nhẹ (< 100KB), có `alt`, lazy load.

## So với 05/11

| Mục 05/11 | 12/11 |
|---|---|
| 🔴 #1 ảnh picsum /hoat-dong | **Còn** (#5) |
| 🔴 #2 form liên hệ + nhận tin chưa nối | **Đã xong** — lưu Supabase, đổ về Google Sheet |
| 🟠 #3, #5 nút nhỏ | **Còn** (#19) |
| 🟠 #4 /tuyen-dien-vien thiếu h1 | **Còn** (#19) |
| 🟢 #6 ký tự "→" | **Còn** (#28) |
| 🟢 #7 trang 3D trống khi tải | **Phần lớn đã xong** — có "Đang dựng sân khấu…"; còn < 1 giây trống (#29) |
| 🟢 #8 dải mời cộng tác | **Còn** (#22) |
| "Ổn" — giảm chuyển động | **Sửa lại: chưa đúng** (#20) |
| Mới | #1–4, #6, #7–18, #20 |

## Đề xuất chia việc sửa

1. **`/chi-huy` sửa code, không cần chờ ai** — #6, #12, #13, #14, #16, #17, #19, #20, #23–#29, #34
2. **Cần Midu trả lời trước** — #1 (tuyển diễn viên), #2 (link video), #3 (ngân hàng), #4 (số vở), #7–#10 (ai gọi lại, số điện thoại dùng chung, số liệu dự kiến, tên "ca kịch"/"nhạc kịch"), #18
3. **Cần ảnh từ nhóm** — #5, #31, #32, ảnh nền tuyển diễn viên không chữ
