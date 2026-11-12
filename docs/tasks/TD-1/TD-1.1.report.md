# TD-1.1 — Đắc Lộ + trang 3D (Việc A)
- Trạng thái: xong
- File đã sửa: `src/pages/DacLoPage.tsx`, `src/pages/StageMapPage.tsx`, `src/pages/CampusMapPage.tsx`
- Nguồn đã dùng: `docs/tasks/TD-1/PLAN.md` (Việc A), `docs/audits/2026-11-12/review-a.md` (A3, A4, A9, A10, A12–A18), `src/lib/errors.ts`, token trong `src/index.css`. Không thêm nội dung mới. Chữ mới chỉ gồm câu báo lỗi, "Chọn lĩnh vực…", nhãn "Lời nhắn" và dòng hướng dẫn cảm ứng, đúng như PLAN ghi.
- CHƯA KIỂM: phản hồi thật của Supabase (`submit_collab`, `subscribe_notify`). Khi thử, mọi request `/rest/v1/` đều được trả giả: 204, 400 P0001, 500 tiếng Anh, và abort để giả mất mạng. Request ngoài localhost bị chặn. Chưa thử Safari iOS / máy thật.

## Đã làm (theo 9 mục)
1. **#6** Cả hai form dùng `friendlyError(err, 'Chưa gửi được — có thể do mạng yếu. Xin thử lại hoặc gọi 0908 033 357.')`. Đã thử: mất mạng và lỗi 500 tiếng Anh đều ra câu dự phòng tiếng Việt. Lỗi P0001 hiện nguyên câu "Bạn vừa gửi đăng ký rồi".
2. **#11** Hai form có `noValidate`, tự kiểm và báo tiếng Việt ngay dưới ô, kèm `aria-invalid`/`aria-describedby`, rồi đưa con trỏ vào ô sai đầu tiên. Mọi ô được `trim()` trước khi gửi. Ô Email/SĐT dùng `isContact()`: nhập `abc` thì không gửi và báo "Xin nhập email (vd. ten@gmail.com) hoặc số điện thoại". Ô nhận tin dùng `EMAIL_RE`: nhập `a@b` thì không gửi. Đã thử: gửi `"  Kiểm Thử  "` / `" 0908 123 456 "` thì body là `"Kiểm Thử"` / `"0908 123 456"`.
3. **#26** Ô chọn mặc định là "Chọn lĩnh vực…". Khi chưa chọn chữ màu `cocoa`, đã chọn thì màu `umber`. Thêm icon `ChevronDown`. Nhãn ô cuối đổi thành "Lời nhắn". Chữ gợi ý (placeholder) từ cocoa/50 (2,1:1) lên `cocoa` (5,5:1 trên kem). Không dùng `/70` như audit gợi ý vì mức đó chỉ đạt 3:1.
4. **#28** Bỏ emoji 🎭 ở lời báo thành công, thay bằng icon `CheckCircle2`.
5. **#34** Bỏ bảng `C`. Mọi màu đổi sang token (`bg-cream`, `bg-parchment`, `border-line`, `bg-sand`, `text-wine`, `text-umber`, `text-cocoa`, `text-champagne`, `bg-deep`). Gradient có kênh alpha dùng `color-mix(var(--color-…))`, cho ra đúng màu hex cũ. `grep -nE "#[0-9A-Fa-f]{6}"` ra **0 dòng** ở cả 3 file.
   - Nền hero `#1a0a00` → `bg-dark`. Ảnh phủ kín nên chụp lại không thấy khác.
   - Nền khu "Quy mô dàn dựng" `#1a0f0a`: thử `bg-dark` thì thấy rõ nền chuyển sang đen lạnh, mất cảm giác nâu của Figma. Nên đã pha `NIGHT = color-mix(deep 35%, dark)` ≈ #1a1010 và gán qua biến `--night` (`bg-(--night)`, `from-(--night)/80`…). Ảnh chụp mới gần như trùng ảnh cũ.
   - `CampusMapPage`: `#ff5a5a` (chế độ đánh dấu) → `red-400` của Tailwind (#ff6467), gần như không thấy khác.
6. **#17** Nhãn trên 3 cột (2014 – 2027 / Biểu diễn phi lợi nhuận / Sứ mạng) đổi `#b8862e` → `text-wine` (từ 2,74:1 lên 7,9:1). Chữ phụ dưới các con số `text-white/45` → `/70`. Khối "Nhóm Ca Kịch Công Giáo Sài Gòn": dưới `lg` chữ căn trái và lớp phủ kem đậm hơn (cả hai khối). Từ `lg` giữ nguyên như Figma.
7. **#16** Thêm `text-balance` cho h2 "…trong vở ca kịch “Đắc Lộ”", các h3/h4 (4 thông điệp, 3 thẻ cộng tác, "Đăng ký cộng tác", 2 khối đơn vị, 3 cột "Hơn 12 Năm Gắn Kết"…), câu "Cho vinh danh…" và đoạn "…sẽ được gửi qua email.". Ở 375px "Lộ”" và "email." không còn đứng riêng một dòng. `Eyebrow` dùng `items-start` + `text-balance`, nên khi xuống 2 dòng thì gạch ngang thẳng dòng đầu ("TỪ LỊCH SỬ ĐẾN SÂN / KHẤU NGHỆ THUẬT").
8. **#15/#19** Trang 3D (cả `/dac-lo/so-do` và `/dac-lo/khuon-vien`):
   - Tiêu đề và dòng phụ ("ĐẮC LỘ · 04.06.2027" / "SỐ 6 TÔN ĐỨC THẮNG · QUẬN 1") nằm trong khung `bg-black/60 backdrop-blur-sm rounded-2xl` ở **mọi khổ**.
   - Dưới `md` các nút điều khiển cao 44px (`max-md:min-h-11`), gồm: Khán giả/Nhà tài trợ, Toàn cảnh/Nhìn từ trên/Từ sân khấu/Dạo khuôn viên/Đêm diễn, Sơ đồ/3D/Ảnh vệ tinh/Đánh dấu, nút "Các khu"/"Chú thích". Nút "Thu gọn" có vùng bấm 44×44 ở mọi khổ (dùng margin âm nên đầu bảng không cao thêm).
   - **Quyết định cần Chỉ huy xem:** nếu chỉ tăng chiều cao mà các nút vẫn xuống dòng thì khối nút trên điện thoại cao thêm khoảng 50px, che nhiều hơn (lỗi A9 nặng thêm). Vì vậy dưới `md` hàng nút chuyển thành **một hàng vuốt ngang** (`overflow-x-auto`, ẩn thanh cuộn, sát mép màn hình). Từ `md` vẫn xuống dòng như cũ. Kết quả ở khuôn viên 375px: khối nút từ y 93→420 còn 93→315. Đây chưa phải gom vào "Tuỳ chọn". Nếu không muốn thì bỏ các lớp `max-md:overflow-x-auto…` trên div hàng nút là về lại như cũ.
   - Dòng "Vuốt để xoay · chụm hai ngón để phóng to · chạm vào khu để xem" chỉ hiện dưới `md`, nằm ngay dưới hàng nút. Dòng này tự ẩn sau 6 giây hoặc sau lần chạm đầu (`pointerdown`, capture). Đã thử: hiện lúc 2,5–3 giây, ẩn lúc 7 giây, ẩn ngay sau khi chạm.
   - Thêm (ngoài PLAN, nhỏ): dòng gợi ý chuột ở desktop và dòng ghi nguồn OSM trên khuôn viên có nền `bg-black/60`, chữ `/75` (trước là `/40`, khó đọc trên nền cảnh 3D).
9. **#28** "Xem lời mời cộng tác →" đổi thành chữ + icon `ArrowRight`.

## Kiểm
- `npm run lint`, `npm run build`: qua.
- Chụp Playwright (`vite preview :4176`, đã tắt): `/dac-lo` ở 375 và 1440, so từng vùng với `docs/audits/2026-11-12/dac-lo-*.png`. Chiều cao trang giữ nguyên (12453 / 8293px). Khác biệt chỉ nằm ở các chỗ đã sửa, màu nền và màu chữ còn lại không đổi. Không có cuộn ngang. Trang 3D ở 375 (3 giây / 7 giây) và 1440: 0 lỗi JS, 0 cuộn ngang.
- Ảnh và script: `/tmp/claude-0/-home-claude/913de08d-1c06-5831-bd99-86ea176ba7b7/scratchpad/td1-a/` (`shots.cjs`, `dac-lo-*.png`, `so-do-*.png`, `khuon-vien-*.png`, `form-*.png`, `r1–r5.png` là ảnh so cũ/mới).

## Cần Chỉ huy xử lý
- **Nút còn < 44px trên trang 3D, nằm ở file không thuộc phạm vi việc này:** `src/components/MapTabs.tsx` ("Sân khấu 3D"/"Khuôn viên" cao 28px) và `src/components/stage/LedControls.tsx` ("Bật tiếng"/"Clip tiếp" cao 28px). Gợi ý: thêm `max-md:min-h-11` cho các nút/link (LedControls thêm `p-0.5` vào khung).
- **Token:** nên thêm `--color-night: #1a0f0a` (nền tối khu ảnh Đắc Lộ) để thay `color-mix` trong `NIGHT`. Trong `DacLoPage` vẫn còn 4 giá trị `rgba(...)` lấy từ hiệu ứng Figma (lớp phủ hero `rgba(26,10,0,.72/.55)`, ô đếm ngược `rgba(42,16,8,.6)`, lớp ánh hồng trên ảnh thuyền `rgba(194,91,74,.18)`). Chưa có token cùng giá trị nên giữ nguyên để không đổi màu. Nếu muốn bỏ hẳn thì thêm token rồi đổi sang `bg-night/72`…
- Danh sách khu và toà nhà trong bảng bên (trang 3D) cao 36–40px, chưa sửa vì PLAN chỉ nói nút điều khiển.

## Cần đưa sang Figma
- **Trang Đắc Lộ — Desktop (Draft 3):**
  - Nhãn 3 cột "2014 – 2027 / Biểu diễn phi lợi nhuận / Sứ mạng": vàng `#b8862e` → đỏ rượu `wine`.
  - Chữ phụ dưới 5 con số ở "Quy mô dàn dựng": trắng 45% → 70%.
  - Form "Đăng ký cộng tác": ô chọn ghi "Chọn lĩnh vực…" + mũi tên xổ xuống; nhãn ô cuối "Lời nhắn"; placeholder đậm hơn (`cocoa`); thêm trạng thái lỗi (viền đỏ rượu + chữ đỏ rượu 12px dưới ô); câu lỗi gửi.
  - Form nhận tin: trạng thái lỗi email, lời báo thành công dùng icon tròn có dấu tích thay cho 🎭.
  - Các tiêu đề ngắt dòng cân hơn (`text-balance`).
- **Trang Đắc Lộ — Mobile:**
  - Như desktop.
  - Khối "Nhóm Ca Kịch Công Giáo Sài Gòn" căn trái. Cả hai khối đơn vị có lớp phủ kem đậm hơn.
  - Eyebrow 2 dòng thẳng lề.
  - h2 "Tất cả sẽ được tái hiện trong vở ca kịch “Đắc Lộ”" ngắt 3 dòng đều.
- **Sơ đồ sân khấu 3D và Khuôn viên — Desktop:**
  - Tiêu đề + dòng phụ nằm trong khung đen 60% bo góc.
  - Dòng gợi ý chuột / ghi nguồn OSM ở góc dưới có nền đen 60%.
  - Nút "Xem lời mời cộng tác" dùng icon mũi tên.
- **Sơ đồ sân khấu 3D và Khuôn viên — Mobile:**
  - Như desktop.
  - Nút cao 44px.
  - Hàng nút điều khiển thành một hàng vuốt ngang.
  - Thêm khung gợi ý cảm ứng dưới hàng nút (hiện 6 giây).
  - Nút "Các khu"/"Chú thích" cao 44px.
