# TD-1 — Sửa nhóm lỗi giao diện (báo cáo kiểm tra 12/11)

- Yêu cầu gốc: "chạy `/chi-huy` sửa trước nhóm lỗi giao diện" — Midu, 12/11/2026
- Nguồn: `docs/audits/2026-11-12/BAO-CAO.md` (mục "Đề xuất chia việc sửa" nhóm 1) + `review-a.md`, `review-b.md`
- Nhánh: `claude/td-1-sua-giao-dien` (tách từ `claude/kiem-tra-2026-11-12`, đã gồm `main` mới nhất + bộ agent)
- Cách hiểu đã chọn: Midu đã chọn sẵn phạm vi từ danh sách trong báo cáo, nhóm này không cần nội dung mới
  → không dừng chờ duyệt kế hoạch, làm luôn. **Không đụng nội dung** (ngày tuyển, link YouTube, ngân hàng,
  số vở, số liệu Đắc Lộ, ảnh picsum, tên "ca kịch/nhạc kịch") — chờ Midu trả lời (nhóm 2, 3 của báo cáo).
  Thêm #11 (kiểm ô Email/SĐT) và một phần #15 (hướng dẫn cảm ứng, chữ dễ đọc trên trang 3D) vì chỉ là code.

## Hợp đồng chung

- **Màu:** token mới trong `src/index.css` — `cream`, `parchment`, `line`, `sand`, `wine`, `umber`, `cocoa`,
  `champagne`, `deep` (dùng `bg-cream`, `text-wine`, `border-line`…; trong `style` dùng `var(--color-wine)`).
  Không còn mã hex trong file được giao (trừ màu 3D trong thư mục `stage/ campus/ chapel/ walk/ world/`).
- **Lỗi form:** `friendlyError(err, fallback)` và `isContact()`, `EMAIL_RE` trong `src/lib/errors.ts`.
  Mọi lỗi không phải câu tiếng Việt từ hàm SQL (mã P0001) → hiện câu dự phòng tiếng Việt kèm cách liên hệ.
  Trước khi gửi: `trim()` mọi ô; email phải có dấu chấm sau @; ô "Email / SĐT" phải là email hoặc ≥ 9 chữ số.
  Báo lỗi bằng tiếng Việt ngay dưới ô (không dựa vào câu báo tiếng Anh của trình duyệt).
- **Mũi tên / emoji:** dùng icon `lucide-react` (`ArrowRight`, `ChevronDown`, `PartyPopper`/`CheckCircle2`…), không dùng ký tự "→" hay emoji trong chữ hiển thị.
- **Vùng bấm:** nút/biểu tượng trên điện thoại ≥ 44×44px (thêm padding, giữ cỡ icon).
- **Tiêu đề:** `text-balance` cho h1–h4 nhiều dòng; ngày dạng "12.2015 · 2019" thêm `whitespace-nowrap`.
- **Giảm chuyển động:** đã bật toàn web bằng `<MotionConfig reducedMotion="user">` trong `App.tsx` — không cần thêm gì trong từng trang.

## Cây việc

| Mã | Agent | Đợt | File sở hữu | Việc (số mục trong BAO-CAO) | Trạng thái |
|---|---|---|---|---|---|
| TD-1.0 | Chỉ huy | 0 | `src/index.css`, `src/App.tsx`, `src/components/Navbar.tsx`, `src/components/Footer.tsx`, `src/lib/errors.ts`, `CLAUDE.md` | token màu (#34); `MotionConfig` (#20); màn tải trang 3D (#29); menu mobile: đóng khi bấm link / Esc, khoá cuộn, `aria-expanded`, nút ≥ 44px (#12, #19); "→" trong menu (#28); icon footer ≥ 44px (#19); helper lỗi form (#6) | ☑ |
| TD-1.1 | giao-dien (A) | 1 | `src/pages/DacLoPage.tsx`, `src/pages/StageMapPage.tsx`, `src/pages/CampusMapPage.tsx` | xem mục **Việc A** | ☑ |
| TD-1.2 | giao-dien (B) | 1 | `src/components/Modal.tsx`, `src/components/ProjectCard.tsx`, `src/components/PageParts.tsx`, `src/components/UpdateChecker.tsx`, `src/components/CastingSection.tsx`, `src/pages/ContactPage.tsx`, `src/pages/HomePage.tsx`, `src/pages/StoryPage.tsx`, `src/pages/PlaysPage.tsx`, `src/pages/ActivitiesPage.tsx`, `src/pages/CastingPage.tsx` | xem mục **Việc B** | ☑ |
| TD-1.3 | kiem-tra | 2 | `docs/tasks/TD-1/review.md` | chạy lại `npm run audit` + bấm thử đúng các mục đã sửa | ☑ |
| TD-1.4 | Chỉ huy | 3 | gộp, `docs/FIGMA_SYNC.md` | đẩy nhánh, ghi mục chờ Figma | ☑ |

### Việc A — Đắc Lộ + trang 3D
1. **#6** Hai form (`errMsg` dòng ~133): dùng `friendlyError(err, 'Chưa gửi được — có thể do mạng yếu. Xin thử lại hoặc gọi 0908 033 357.')`.
2. **#11** Form cộng tác: `trim()`; ô Email/SĐT dùng `isContact()`, sai thì báo "Xin nhập email (vd. ten@gmail.com) hoặc số điện thoại" dưới ô, không gửi. Form nhận tin: email theo `EMAIL_RE`.
3. **#26** Ô chọn "Lĩnh vực quan tâm": lựa chọn mặc định "Chọn lĩnh vực…" màu nhạt + icon `ChevronDown`; đổi nhãn ô cuối thành "Lời nhắn"; placeholder đủ tương phản.
4. **#28** Emoji 🎭 trong lời báo thành công → icon lucide.
5. **#34** Thay bảng `C` và mọi mã hex (`#b8862e`, `#1a0a00`, `#1a0f0a`, `focus:border-[#8b1a1a]`…) bằng token. `#1a0a00`/`#1a0f0a` (nền tối) → `bg-deep` hoặc `bg-dark` tuỳ chỗ, giữ cảm giác Figma.
6. **#17** Nhãn vàng `#b8862e` trên kem → `text-wine`; chữ phụ `text-white/45` trên ảnh → `text-white/70`; đoạn "Khởi đầu năm 2014…" trên mobile không căn phải trên ảnh (hoặc thêm nền).
7. **#16** `text-balance` cho h2 "…trong vở ca kịch “Đắc Lộ”", các h3/h4 ("Hơn 12 Năm Gắn Kết", "Loan Báo Tin Mừng"…), đoạn "…sẽ được gửi qua email."; nhãn Eyebrow 2 dòng không rớt dưới gạch ngang.
8. **#15 / #19** Trang 3D trên điện thoại: nút điều khiển ≥ 44px chiều cao; nền mờ (`bg-black/60` + bo góc) sau tiêu đề và dòng phụ "ĐẮC LỘ · 04.06.2027" / địa chỉ để đọc được trên mái nhà sáng; thêm dòng hướng dẫn cảm ứng chỉ hiện dưới `md`: "Vuốt để xoay · chụm hai ngón để phóng to · chạm vào khu để xem", tự ẩn sau lần chạm đầu (hoặc 6 giây). Không đổi bố cục lớn (gom nút vào "Tuỳ chọn" để lần sau).
9. **#28** "Xem lời mời cộng tác →" (StageMapPage) → icon `ArrowRight`.

### Việc B — thành phần dùng chung + các trang nền tối
1. **#13** `Modal.tsx`: Esc để đóng; khoá cuộn `body` khi mở (trả lại khi đóng); `role="dialog" aria-modal="true" aria-labelledby` (tiêu đề); nút X có `aria-label="Đóng"`, nhận focus khi mở.
2. **#24** Nút X luôn thấy khi cuộn nội dung popup (sticky hoặc đặt ngoài khung cuộn).
3. **#23** Mũi tên chuyển ảnh trong popup hiện sẵn trên màn cảm ứng / dưới `md` (chỉ ẩn-hiện theo rê chuột từ `md` trở lên); chấm chuyển ảnh có vùng bấm ≥ 24px.
4. **#25** "Chia sẻ bài viết": link có `?vo=<id>`; `ProjectGrid` (PageParts) và trang chủ đọc `?vo=` để mở sẵn popup đó (dùng `useSearchParams`, đóng popup thì xoá tham số). Bỏ `alert()` → nhãn "Đã sao chép link" hiện 2 giây trên nút.
5. **#23** `ProjectCard.tsx`: thẻ là `<button>` (hoặc `role="button" tabIndex={0}` + Enter/Space); trên mobile hiện sẵn nhãn nhỏ "Xem chi tiết" + `ArrowRight` (từ `md` giữ hiệu ứng rê chuột); ngày `whitespace-nowrap`; tên vở `text-balance`.
6. **#14** `UpdateChecker.tsx`: nếu trang có ô `input`/`textarea`/`select` đã nhập dở thì **không tự tải lại khi đổi trang** và khi bấm "Tải lại" phải hỏi `confirm`-kiểu giao diện (không dùng `window.confirm`; ví dụ nút đổi chữ thành "Bấm lần nữa để tải lại — chữ đang gõ sẽ mất"); thêm nút ✕ để ẩn thanh (hiện lại sau 10 phút); `whitespace-nowrap`/`w-max` cho thanh; màu thanh khác nút chính (ví dụ `bg-white text-black` hoặc viền vàng nền tối).
7. **#6** `ContactPage.tsx`: `friendlyError(x, 'Chưa gửi được — có thể do mạng yếu. Xin thử lại hoặc email ckcgsg@gmail.com.')`; `trim()`; email theo `EMAIL_RE`; tin nhắn sau khi trim ≥ 5 ký tự; báo lỗi tiếng Việt dưới ô.
8. **#26 / #27** ContactPage: ô Chủ đề thêm `ChevronDown`; gợi ý "form đăng ký cộng tác" mở tab mới (`target="_blank" rel="noopener"`, ghi "(mở trang mới)"); `bg-[#111]` → token.
9. **#16** HomePage: H1 không để "Kịch" rớt một mình ở 768px (`text-balance` và/hoặc giảm cỡ ở `md`, hoặc nối "Ca&nbsp;Kịch"); `text-balance` cho h2/h3 khác ("…một gia đình 120+.", "Đồng hành & ủng hộ", "Tham gia cùng nhóm", "Thánh ca & hợp xướng"). StoryPage: h1 không rớt "120+." một mình, `text-balance` thẻ giá trị và h2 cuối.
10. **#28** HomePage "Đọc câu chuyện của nhóm →" → icon `ArrowRight`.
11. **#19** `CastingSection.tsx` nhận prop `asPage?: boolean` → tiêu đề "Tuyển Diễn Viên" là `h1` khi `asPage`, `h2` khi nhúng; `CastingPage.tsx` truyền `asPage`. **Không đổi chữ / ngày / ảnh** (chờ Midu).

## Không làm trong TD-1 (chờ Midu / nhóm)
#1 hạn tuyển · #2 link YouTube · #3 ngân hàng · #4 số vở · #5 ảnh picsum · #7–#10 liên hệ, số liệu, tên gọi · #18 nội dung vở · #21, #22 nội dung mời cộng tác · #30 giờ mở màn · #31–#33 ảnh, địa chỉ.

## Câu hỏi cho Midu
Không có câu hỏi chặn cho TD-1. Danh sách câu hỏi nội dung nằm ở BAO-CAO.md 12/11.
