# Kiểm tra TD-1 (TD-1.3)
Kết luận: **ĐẠT** — 0 lỗi chặn, 8 mục nên sửa (không chặn gộp).

Nhánh `claude/td-1-sua-giao-dien` @ `4ae697c`, so với `claude/kiem-tra-2026-11-12`. Ngày kiểm: 12/11/2026. Chromium (Playwright 1.63).
Script, ảnh chụp và audit mới: `/tmp/claude-0/-home-claude/913de08d-1c06-5831-bd99-86ea176ba7b7/scratchpad/td1-review/`
(`check.cjs`, `debug.cjs`, `arrow.cjs`, `check-result.json`, `new/audit.json`, `cuts/`).

## Lỗi chặn (phải sửa trước khi gộp)
Không có.

## Nên sửa
- [src/index.css:21] `--color-night: color-mix(#381c1b 35%, #0A0A0A)` cho ra **#1a1010**. Figma là **#1a0f0a**. Đo ảnh chụp:
  nền khu "Quy mô dàn dựng" đổi từ (26,15,10) sang (26,16,16), nên bớt chút sắc nâu ấm (mắt thường gần như không thấy).
  Nên đặt thẳng `--color-night: #1a0f0a;`. — giao lại cho: **Chỉ huy** (file dùng chung)
- [src/pages/DacLoPage.tsx:32] Còn sót chú thích `/** nền tối khu ảnh sân khấu: 35% deep… */` nằm ngay trên `SEND_FAIL`.
  Hằng `NIGHT` đã bị bỏ. Dòng 25 cũng còn ghi "nền tối khu ảnh = NIGHT". Nên đổi thành "`bg-night`". — **Chỉ huy** (người sửa cuối) hoặc TD-1.1
- [src/pages/DacLoPage.tsx:118] Placeholder đổi sang `text-cocoa` thì đủ tương phản. Nhưng nó gần cùng màu với chữ đã nhập (`text-umber`),
  nên ô trống trông như đã điền sẵn (xem `cuts/375-05.png`). Có thể thêm `placeholder:italic` hoặc chọn sắc khác mà vẫn đạt ≥ 4,5:1. — TD-1.1
- [src/pages/StageMapPage.tsx:113] Còn emoji 🕯 trong câu hiện ra "Bạn đã thắp một ngọn nến 🕯 Xin Chúa nhậm lời.".
  Chỗ này có từ trước, PLAN chỉ nêu 🎭, nhưng nó trái hợp đồng "không dùng emoji trong chữ hiển thị". Thư mục `chapel/` và `walk/`
  còn nhiều emoji làm icon nút (ngoài phạm vi TD-1). — TD-1.1 / việc sau
- [src/pages/StageMapPage.tsx:189–231] Ở 375×812, khối tiêu đề + nút kéo từ y 88 xuống **407px** khi dòng hướng dẫn đang hiện
  (quá nửa màn hình 1px), rồi còn 355px sau 6 giây. Máy thấp 375×667 (iPhone SE/8): 407px = 61% khi có hướng dẫn, 355px = 53% sau đó.
  `/dac-lo/khuon-vien` thì đạt: 383 → 331px. PLAN đã hẹn để lần sau gom nút vào "Tuỳ chọn", nên ghi lại để làm việc đó. — việc sau
- [src/lib/errors.ts:18] `isContact()` chỉ đếm chữ số, nên `abc123456789` vẫn hợp lệ. Có thể thêm điều kiện "chỉ gồm số, dấu cách, `+ . -`". — Chỉ huy
- [src/pages/ContactPage.tsx:9,26,147; src/pages/CampusMapPage.tsx:71] Dùng màu bảng Tailwind (`amber-300`, `red-400`), không có mã hex
  nhưng cũng không phải token dự án. Nếu muốn chặt theo CLAUDE.md §5 thì thêm token (ví dụ `--color-warn`). — Chỉ huy
- **Audit trùng ngày:** `npm run audit` ghi vào `docs/audits/<hôm nay>/`, mà hôm nay chính là `2026-11-12`, nên chạy là ghi đè bản gốc.
  Tôi đã sao lưu, chạy, chuyển kết quả mới sang scratchpad (`td1-review/new/`) rồi trả nguyên bản gốc (cây làm việc sạch, `git status` trống).
  Chỉ huy quyết định có lưu audit mới vào repo không (ví dụ `docs/audits/2026-11-12-td1/audit.json`). Có thể cho `audit.mjs` nhận tên thư mục.

## CHƯA KIỂM
- Safari iOS / Android máy thật. Mọi kiểm tra chạy trên Chromium giả lập cảm ứng (`hasTouch`, `isMobile`).
- Phản hồi thật của Supabase. Mọi request `/rest/v1/**` đều trả giả bằng `ctx.route` (200 / 400 P0001 / 500 tiếng Anh / abort),
  host ngoài localhost bị chặn. `npm run audit` chỉ tải trang, không gửi form, và theo mã thì không gọi Supabase khi tải.
- Đối chiếu Figma: chỉ so với ảnh chụp cũ `docs/audits/2026-11-12/dac-lo-*.png`, chưa mở tệp Figma.
- Thanh phiên bản hiện lại sau 10 phút khi đã bấm ✕: không chờ.
- `/dac-lo` ở khổ 768 không soát bằng mắt. Audit đo khổ tablet: không cuộn ngang, không lỗi.

## Đã kiểm, ổn
**Kỹ thuật**
- `npm run lint` (tsc) qua. `npm run build` qua. Chỉ có cảnh báo cũ: chunk `MapTabs` 1,04 MB, đã có trong audit cũ.
- Phân quyền file: 21 file `src/` đổi qua 4 commit. Mỗi commit chỉ chạm file trong cột *File sở hữu* của đúng việc đó:
  TD-1.0 → App/Navbar/Footer/index.css/lib/errors.ts/CLAUDE.md; TD-1.2 → 11 file Việc B; TD-1.1 → 3 file Việc A;
  Chỉ huy gộp → `MapTabs.tsx`, `stage/LedControls.tsx`, `index.css`, `DacLoPage.tsx` (token night). Không có file lạ.
- Mã hex `#xxxxxx` trong các file `src/` đã đổi (bỏ `index.css`): **0**.
- "→" và emoji trong chữ hiển thị của các file đã đổi: 0. "→" chỉ còn trong chú thích code. Ngoại lệ 🕯 ghi ở trên.
- Không còn `GIỮ CHỖ` / `TODO`. Không có ảnh mới.

**Máy đo (`npm run audit`, so `2026-11-12/audit.json`)** — 25 lượt, 9 trang. **Không có hồi quy.**
- `smallTapTargets`: hết ở mọi trang mobile/tablet ("Mở menu", YouTube, Facebook, Email, nút 3D, "Thu gọn").
  Còn 1 nút ở `/dac-lo/khuon-vien` **desktop** (lớp `ctl`, chiều cao cũ từ `md`), đúng ý PLAN (44px chỉ áp cho điện thoại).
- `fontProblems` ("Vở Đắc Lộ →", "Đọc câu chuyện của nhóm →"): hết (8 trang desktop → 0).
- `h1` của /tuyen-dien-vien: 0 → 1 ở cả 3 khổ.
- Lỗi JS / cuộn ngang / ảnh thiếu alt: không có mới. 5 lượt "có vấn đề" giống hệt bản cũ: picsum.photos (`/hoat-dong`) và
  youtube-nocookie (`/dac-lo/so-do`) bị mạng sandbox chặn, không do mã.
- CLS: tất cả < 0,04. `/vo-dien` mobile 0 → 0,021 (dưới ngưỡng 0,1); `/dac-lo/so-do` desktop 0,01 → 0; khuôn viên mobile 0,008 → 0.
- Khung giật khi cuộn (mobile, CPU ×4): 0 khung dài ở mọi trang, lâu nhất 17ms, như cũ.

**Bấm thử (Playwright, `vite preview :4178`, đã tắt)**: 69 mục, tất cả đạt sau khi soát lại.
3 mục báo FAIL lần đầu là lỗi script của tôi (locator lọc theo chữ cũ; cách đo chuyển động). Đo lại bằng `debug.cjs` thì đúng.
Mục thứ 4 (khối nút 3D) đã ghi ở trên.
- Menu mobile 375: nút 48×48; `aria-expanded` false → true; khoá cuộn `body`; bấm link trang hiện tại (/vo-dien) thì đóng,
  trả lại cuộn; Esc đóng; link sang trang khác cũng đóng.
- Popup: mở thì `aria-modal`, `aria-labelledby`, focus vào "Đóng", khoá cuộn, URL `?vo=di-tim-inhaxio`. Cuộn nội dung 149px ở 375px
  thì nút X vẫn ở top 52px, 44×44 và bấm trúng. Esc đóng, trả cuộn, xoá `?vo`. Mũi tên ảnh opacity 1 ở 375 cảm ứng, 0 ở 1440 có chuột.
  Chấm ảnh 28–32px.
  Deep link: `/vo-dien?vo=don-bosco`, `/?vo=jericho`, `/?vo=don-bosco`, `/hoat-dong?vo=tet-am-cho-em`,
  `/hoat-dong?vo=giang-sinh-man-coi-2014` mở đúng popup. `?vo=khong-co` bị bỏ qua.
  Desktop: Enter và Space trên thẻ mở popup, đóng thì focus về thẻ.
- /lien-he: `abc@gmail` → "Email chưa đúng dạng — ví dụ ten@gmail.com.", 0 request. Toàn dấu cách → "Xin nhập họ và tên." +
  "Tin nhắn cần ít nhất 5 ký tự.", 0 request. Mất mạng và lỗi 500 tiếng Anh → "Chưa gửi được — có thể do mạng yếu…ckcgsg@gmail.com.",
  chữ đã gõ vẫn còn. Body gửi đi đã trim.
- /dac-lo, form cộng tác: Email/SĐT `abc` → "Xin nhập email (vd. ten@gmail.com) hoặc số điện thoại", 0 request. Toàn dấu cách → báo cả 2 ô.
  Mất mạng → câu tiếng Việt kèm "0908 033 357", giữ chữ. P0001 → hiện nguyên câu SQL. Body đã trim (`"0908 123 456"`).
  Báo thành công không còn 🎭.
  Form nhận tin: `a@b` → "Xin nhập email đúng dạng…", toàn dấu cách → "Xin nhập email", 0 request. Mất mạng → câu tiếng Việt, giữ email.
- Thanh phiên bản mới (giả `version.json` khác id): hiện 1 dòng 295×46px ở 375px. Có chữ đang gõ thì lần bấm đầu không tải lại,
  chữ đổi thành "Bấm lần nữa để tải lại — chữ đang gõ sẽ mất", chữ trong ô vẫn còn. Lần hai thì tải lại. Nút ✕ 44×44 ẩn thanh.
- `reducedMotion: 'reduce'`: 5 thẻ `#thong-diep` nhảy thẳng từ `translateY(28px)` sang `none` (2 trạng thái, không trượt).
  Bản đối chứng `no-preference` có 49 trạng thái trung gian.
- Màn tải trang 3D (giữ chunk 3 giây): hiện "Đang tải sơ đồ sân khấu…" kèm vòng xoay.
- Trang 3D 375 (chờ ~8 giây), cả /so-do và /khuon-vien: tiêu đề có nền `oklab(0 0 0 / 0.6)`, đọc được trên mái nhà.
  Dòng "Vuốt để xoay…" hiện lúc 2,5 giây, ẩn sau 6 giây, chạm sớm thì ẩn ngay. Mọi nút/link trong màn hình ≥ 44px. Không cuộn ngang. 0 lỗi JS.
- Trang chủ 768: H1 2 dòng "Mang Tin Mừng Qua" / "Nghệ Thuật Ca Kịch", không có dòng 1 chữ. Trang chủ có đúng 1 `h1`.
- 0 lỗi JS (`pageerror`) trong toàn bộ lượt bấm thử.

**Soát mắt /dac-lo 375 và 1440** (`cuts/375-*.png`, `cuts/1440-*.png`; trái là cũ, phải là mới)
- Chiều cao trang giữ nguyên (12453 / 8293px). Màu nền chủ đạo của từng đoạn 500px trùng bản cũ ở mọi đoạn nền kem và đỏ rượu.
  Chỉ khác ở khu "Quy mô dàn dựng" (xem mục night ở trên).
- Khác biệt chỉ nằm ở chỗ PLAN cho phép: nhãn 3 cột sang `wine`; chữ phụ dưới con số rõ hơn; h2 "…vở ca kịch “Đắc Lộ”" ngắt 3 dòng đều;
  Eyebrow 2 dòng thẳng lề; ô chọn "Chọn lĩnh vực…" + mũi tên; nhãn "Lời nhắn"; khối "Nhóm Ca Kịch…" căn trái dưới `lg`, phủ kem đậm hơn;
  đoạn "…sẽ được gửi qua email." cân dòng. Không thấy vỡ bố cục, chữ chồng hay tràn ngang.

**Nội dung**: soát `git diff … -- src`.
- Không đổi ngày, số liệu, tên người, số điện thoại, link hay ảnh. `constants.ts`, `types.ts`, `src/content/` không đổi.
  Mảng TIMELINE và dữ liệu đầu `DacLoPage.tsx` không đổi. Ngày diễn 04.06.2027 khớp giữa `DacLoPage.tsx:28,212`,
  `StageMapPage` và `constants.ts:39`.
- Chữ mới chỉ là chữ giao diện PLAN cho phép: câu lỗi form, "Chọn lĩnh vực…", "Lời nhắn", "Xem chi tiết", "ĐÃ SAO CHÉP LINK",
  "(mở trang mới)", dòng hướng dẫn cảm ứng, chữ màn tải, chữ thanh phiên bản. Thêm `&nbsp;` ("Ca&nbsp;Kịch", "gia&nbsp;đình&nbsp;120+.")
  thì không đổi chữ. Số 0908 033 357 và ckcgsg@gmail.com trong câu lỗi đã có sẵn trên trang.
- Chính tả tiếng Việt có dấu trong các câu mới: không thấy lỗi.
