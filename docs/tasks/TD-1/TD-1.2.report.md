# TD-1.2 — Thành phần dùng chung + các trang nền tối (Việc B)
- Trạng thái: xong
- File đã sửa: `src/components/Modal.tsx`, `src/components/ProjectCard.tsx`, `src/components/PageParts.tsx`,
  `src/components/UpdateChecker.tsx`, `src/components/CastingSection.tsx`, `src/pages/ContactPage.tsx`,
  `src/pages/HomePage.tsx`, `src/pages/StoryPage.tsx`, `src/pages/PlaysPage.tsx`, `src/pages/ActivitiesPage.tsx`,
  `src/pages/CastingPage.tsx`
- Nguồn đã dùng: `docs/tasks/TD-1/PLAN.md` (Việc B), `docs/audits/2026-11-12/review-b.md` (B5, B7, B8, B14–B18, B20–B23, B26),
  `review-a.md` (A12, A20), `src/lib/errors.ts`. Không đổi chữ nội dung, số liệu, ngày, ảnh, link.
- CHƯA KIỂM: không có (không thêm thông tin mới). Kiểm trên Chromium (Playwright), chưa kiểm trên Safari iOS thật.

## Đã làm (theo 11 mục)
1. **Modal**: Esc để đóng; khoá cuộn `body` (bù bề rộng thanh cuộn), trả lại khi đóng; `role="dialog" aria-modal aria-labelledby`;
   nút X `aria-label="Đóng"`, 44×44px, nhận focus khi mở; Tab/Shift+Tab xoay vòng trong popup; đóng xong focus về lại thẻ vừa bấm.
2. Nút X nằm **ngoài** vùng cuộn (khung popup `overflow-hidden`, nội dung cuộn ở div con) → luôn thấy.
3. Mũi tên ảnh: luôn hiện trên cảm ứng / dưới `md`; từ `md` trên máy có chuột (`pointer-fine`) mới ẩn-hiện theo rê chuột
   (và hiện khi focus bàn phím). Chấm ảnh có vùng bấm 28×28px, `aria-label="Xem ảnh n"`.
4. Chia sẻ: link `…/<trang>?vo=<id>`. Hook mới `useVoParam(items)` trong `PageParts.tsx` (dùng `useSearchParams`, `replace`):
   `ProjectGrid` và trang chủ đọc `?vo=` để mở sẵn popup, đóng thì xoá tham số. Trang chủ tìm trong **mọi vở đã diễn**
   (link cũ vẫn mở được khi vở rời khỏi 3 vở mới nhất). `/hoat-dong?vo=<chương trình>` tự chọn đúng năm.
   `?vo=` sai thì bỏ qua. Bỏ `alert()` → nút đổi thành "ĐÃ SAO CHÉP LINK" (icon Check) trong 2 giây.
   Nếu trình duyệt chặn clipboard thì dùng `window.prompt` để người dùng tự sao chép (chỉ là dự phòng cuối).
5. **ProjectCard**: `role="button" tabIndex=0`, Enter/Space mở, vòng focus vàng, `aria-label="Xem chi tiết: <tên> (<ngày>)"`.
   Cảm ứng / dưới `md` hiện sẵn "XEM CHI TIẾT" + `ArrowRight`; máy có chuột từ `md` giữ hiệu ứng rê chuột như cũ.
   Ngày `whitespace-nowrap shrink-0` (chữ ngày đổi `text-white/40` → `/60` cho đủ tương phản); tên vở `text-balance`.
6. **UpdateChecker**: thanh mới nền tối viền vàng (`bg-dark/95 border-gold/70`), khác nút chính; `w-max whitespace-nowrap`
   (295px, 1 dòng ở 375px); nút ✕ ẩn thanh, 10 phút sau hiện lại. Có chữ đang gõ (input chữ/textarea có nội dung,
   select đã chọn khác lựa chọn trống) → bấm "Tải lại" lần đầu chỉ đổi chữ thành "Bấm lần nữa để tải lại — chữ đang gõ sẽ mất"
   (tự trở lại sau 8 giây), lần hai mới tải lại.
   **Hành vi khi đổi trang** (đã kiểm): đổi trang mà trang đích có ô nhập dở → **không** tự tải lại, chỉ hiện thanh.
   Đổi trang bình thường → vẫn tự tải lại trang đích như trước. Lưu ý: vì form của trang cũ đã bị gỡ khi đổi trang SPA,
   trên thực tế trường hợp "đổi trang mà còn ô nhập dở" chỉ xảy ra nếu sau này có ô nhập nằm ngoài trang (Navbar/Footer).
   Phần chặn chủ yếu có tác dụng ở nút "Tải lại".
7. **ContactPage**: `noValidate` + tự kiểm sau khi `trim()`: họ tên bắt buộc, email theo `EMAIL_RE`, tin nhắn ≥ 5 ký tự;
   lỗi tiếng Việt ngay dưới ô (`aria-invalid`, `aria-describedby`), focus vào ô sai đầu tiên, không gửi request.
   Lỗi gửi → `friendlyError(x, 'Chưa gửi được — có thể do mạng yếu. Xin thử lại hoặc email ckcgsg@gmail.com.')` (`role="alert"`). Dữ liệu gửi đã trim.
8. Ô Chủ đề có `ChevronDown`; gợi ý "form đăng ký cộng tác (mở trang mới)" là `<a target="_blank" rel="noopener">`;
   `bg-[#111]` → `bg-card`.
9. HomePage H1: `md:text-7xl lg:text-8xl` + "Ca&nbsp;Kịch" → 768px còn 2 dòng "Mang Tin Mừng Qua / Nghệ Thuật Ca Kịch".
   "gia&nbsp;đình&nbsp;120+." ở h2 trang chủ và h1 /cau-chuyen → không còn rớt "120+." một mình, cũng không tách "gia / đình".
   h3 3 thẻ hoạt động `md:text-2xl lg:text-3xl` (ở 768 trước rớt "Thánh / ca & / hợp xướng"). `text-balance` cho các h2/h3 còn lại
   ở Home, Story (thẻ giá trị, h2 cuối…), Plays; mốc thời gian Story `whitespace-nowrap`.
10. "Đọc câu chuyện của nhóm →" → icon `ArrowRight`.
11. `CastingSection` nhận `asPage?: boolean` → "Tuyển Diễn Viên" là `h1` khi `asPage`, `h2` khi nhúng; `CastingPage` truyền `asPage`.
    Không đổi chữ / ngày / ảnh.
- Thêm nhỏ: hai gạch ngang của `Eyebrow` (PageParts) `shrink-0` để nhãn dài 2 dòng không bóp mất gạch.

## Kiểm
- `npm run lint` qua, `npm run build` qua.
- Playwright trên `vite preview :4177` (script `…/scratchpad/td1-b/check.js`). Mọi request `supabase.co` / `/rest/v1/` bị chặn, trả giả.
  - 375px cảm ứng /vo-dien: popup `aria-modal=true`, tiêu đề đúng, focus vào "Đóng", `body overflow:hidden`, URL `?vo=jericho`;
    mũi tên opacity 1; chấm 28×28; cuộn trong popup 383px → nút X vẫn ở top 54px, bấm trúng; lăn chuột nền không trôi;
    Esc đóng, `overflow` trả lại, URL xoá `?vo`, focus về thẻ.
  - Deep link: `/vo-dien?vo=don-bosco`, `/?vo=jericho`, `/?vo=don-bosco` (vở cũ), `/hoat-dong?vo=dem-hong-an-2017` (năm 2017),
    `/hoat-dong?vo=tet-am-cho-em` → mở đúng popup; `?vo=khong-ton-tai`, `?vo=<script>` → không mở, không lỗi.
  - Desktop 1440: Enter và Space mở thẻ; 12 lần Tab vẫn trong popup; mũi tên 0 khi không rê / 1 khi rê; chia sẻ → "ĐÃ SAO CHÉP LINK",
    clipboard `http://localhost:4177/vo-dien?vo=di-tim-inhaxio`, không có alert, sau 2 giây trở lại "CHIA SẺ BÀI VIẾT".
  - /lien-he: gửi trống → 3 câu lỗi tiếng Việt; `abc@gmail` → "Email chưa đúng dạng — ví dụ ten@gmail.com.", 0 request;
    tin nhắn 6 dấu cách → "Tin nhắn cần ít nhất 5 ký tự.", 0 request; mất mạng (`route.abort`) → câu dự phòng tiếng Việt, chữ đã gõ còn;
    giả lỗi P0001 → hiện nguyên câu SQL; body gửi đi đã trim.
  - Thanh phiên bản (giả `version.json` id khác): 1 dòng 295×46px; lần bấm đầu chỉ cảnh báo, chữ còn, không tải lại; lần hai tải lại;
    ✕ ẩn thanh; đổi trang khi còn ô nhập dở → không tải lại; đổi trang bình thường → tự tải lại.
  - Không cuộn ngang ở 375px: `/`, `/vo-dien`, `/hoat-dong`, `/cau-chuyen`, `/lien-he`, `/tuyen-dien-vien`, popup. /tuyen-dien-vien có 1 `h1`.
  - Không có lỗi JS (`pageerror`) trong toàn bộ lượt kiểm.
- Ảnh: `/tmp/claude-0/-home-claude/913de08d-1c06-5831-bd99-86ea176ba7b7/scratchpad/td1-b/` (popup-mobile-open/scrolled, popup-desktop,
  card-mobile, share-copied, contact-*, update-bar*, home-768, story-1440).

## Cần Chỉ huy xử lý
- Không cần sửa file dùng chung.
- Gợi ý (không chặn): còn h3 "Đồng hành / & ủng hộ" bắt đầu dòng bằng "&" ở 375/768. Muốn tránh thì đổi chữ trong mảng
  (nội dung) hoặc nối "hành&nbsp;&". Chưa làm vì đụng chuỗi nội dung.
- Mũi tên ảnh cách nút X khoảng 14px ở 375px. Chưa chạm nhau, nhưng nếu thêm thì nên hạ mũi tên xuống.

## Cần đưa sang Figma
- **Popup vở diễn** (desktop + mobile): nút X 44px tách khỏi nội dung cuộn (luôn ở góc trên phải); mobile hiện sẵn 2 mũi tên ảnh;
  chấm ảnh có vùng bấm 28px; trạng thái nút "ĐÃ SAO CHÉP LINK" + icon Check.
- **Thẻ vở diễn** (mobile): thêm dòng "XEM CHI TIẾT →" (vàng, chữ nhỏ in hoa) dưới tên vở; ngày màu trắng 60%, không xuống dòng;
  trạng thái focus bàn phím (viền vàng 2px).
- **Thanh "Đã có phiên bản mới"** (mobile + desktop): nền tối viền vàng, icon vàng, "Tải lại" gạch chân vàng, nút ✕;
  trạng thái cảnh báo "Bấm lần nữa để tải lại — chữ đang gõ sẽ mất" (chữ vàng, 2 dòng ở 375px).
- **/lien-he** (desktop + mobile): ô Chủ đề có `ChevronDown`; câu lỗi màu hổ phách dưới từng ô + viền ô lỗi;
  link gợi ý ghi "(mở trang mới)".
- **Trang chủ** tablet 768: H1 cỡ 7xl (từ `lg` mới 8xl); 3 thẻ hoạt động h3 cỡ 2xl ở tablet; link "Đọc câu chuyện của nhóm" dùng icon mũi tên.
- **/cau-chuyen**: h1 ngắt "…nay là một / gia đình 120+.".
- **/tuyen-dien-vien**: "Tuyển Diễn Viên" là H1 (cỡ chữ không đổi).
