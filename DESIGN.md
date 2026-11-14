---
# design-md-format=spec  (định dạng DESIGN.md mở — gstack, Google Stitch, impeccable… đọc được)
name: ckcgsg
typography:
  display:
    fontFamily: Playfair Display
    fontFeature: lnum
  body:
    fontFamily: Be Vietnam Pro
  label:
    fontFamily: Be Vietnam Pro
colors:
  # Nền tối — đa số trang
  gold: "#D4AF37"
  dark: "#0A0A0A"
  card: "#141414"
  # Nền kem — trang Đắc Lộ (Figma "Kêu gọi hỗ trợ" Draft 3)
  cream: "#f6ebd8"
  parchment: "#e8d7c2"
  line: "#cdbe9f"
  sand: "#d9c2a5"
  wine: "#8b1a1a"
  umber: "#5a3a2d"
  cocoa: "#6f5a4a"
  champagne: "#e8c89a"
  deep: "#381c1b"
  night: "#1a0f0a"
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  4xl: 96px
rounded:
  md: 12px
  lg: 16px
  xl: 24px
  full: 9999px
---

# Hệ thiết kế — Ca Kịch Công Giáo Sài Gòn

Một file duy nhất mô tả **giao diện web đang là gì và vì sao**, để code, Figma, các agent và nhóm UX/UI
đọc chung. Token màu thật nằm trong `src/index.css` — file này phải khớp với nó; đổi một bên thì đổi cả hai
và ghi vào *Nhật ký quyết định* bên dưới. Cách soát theo file này: [`docs/SOAT-THIET-KE.md`](docs/SOAT-THIET-KE.md).

## Tổng quan

- **Đây là gì:** website chính thức của Nhóm Ca Kịch Công Giáo Sài Gòn — giới thiệu vở diễn, hoạt động,
  tuyển diễn viên, và kêu gọi cộng tác cho vở nhạc kịch *Đắc Lộ* (2027).
- **Ai xem:** giáo dân và cộng đoàn muốn xem vở; người muốn tham gia diễn; ân nhân, nhà tài trợ, cộng tác viên.
  Thiết kế ưu tiên **điện thoại** (mobile trước).
- **Hướng thẩm mỹ:** *sân khấu trong bóng tối* — nền đen như khán phòng tắt đèn, vàng như ánh đèn rọi,
  tiêu đề serif cổ điển mang chất kịch nghệ và phụng vụ. Trang Đắc Lộ đổi sang *giấy cũ* (kem, đỏ rượu, nâu)
  gợi thư tịch thế kỷ 17 — thời Cha Đắc Lộ.
- **Tâm trạng:** trang trọng, ấm, có đức tin; không phô trương, không giống web bán hàng.
- **Mục tiêu đo được:** người xem tới được lời mời cộng tác hoặc thông tin liên hệ trong tối đa 2 lần bấm từ mọi trang.

## Màu

**Nền tối (mặc định):** `dark` làm nền, `card` cho khối nổi, chữ trắng với độ mờ theo cấp
(tiêu đề 100%, thân 60–85%, phụ ≥ 50% và vẫn phải đạt 4,5:1). `gold` là màu nhấn **duy nhất**:
nút chính, nhãn, số liệu, trạng thái rê chuột.

**Nền kem (trang Đắc Lộ):** `cream` nền, `parchment` thẻ, `line` viền, `umber` tiêu đề, `cocoa` chữ thân,
`wine` cho nút / nhãn / nhấn (7,9:1 trên kem). Khu tối trong trang Đắc Lộ dùng `deep` / `night` với chữ `champagne`.

**Quy tắc:** không gõ mã màu trong component — dùng lớp `text-gold`, `bg-cream`… hoặc `var(--color-…)`.
Cần màu mới → thêm token vào `src/index.css` và vào đây. Lỗi form dùng hổ phách (`amber-300`) trên nền tối,
`wine` trên nền kem, luôn kèm chữ.

## Chữ

| Vai | Font | Dùng cho |
|---|---|---|
| Tiêu đề, con số | Playfair Display (lớp `serif` / `font-serif`, số thẳng hàng `lining-nums`) | h1–h3, số liệu, tên vở |
| Chữ thân, nhãn, nút | Be Vietnam Pro (`font-sans`) | mọi thứ còn lại |

- Cả hai font tự chứa qua Fontsource, có đủ dấu tiếng Việt. **Không thêm font thứ ba.** Ký tự font không có
  (ví dụ "→") thay bằng icon Lucide.
- Cỡ thực tế: h1 trang con `text-5xl` → `md:text-7xl`, h2 `text-4xl`–`text-5xl`, chữ thân `text-base`–`text-lg`
  (≥ 16px), nhãn `text-xs` in hoa giãn chữ.
- Tiêu đề nhiều dòng thêm `text-balance`. Đoạn văn tối đa ~`max-w-3xl` (≈ 65–75 ký tự).
- Nhãn in hoa giãn chữ (`Eyebrow`) là **dấu ấn có chủ ý** — dùng ở đầu mỗi trang và đầu khu lớn,
  không đặt trên mọi tiêu đề nhỏ (xem SOAT-THIET-KE mục 9).

## Bố cục

- Khung nội dung `max-w-7xl mx-auto px-6`; khu Đắc Lộ dùng lề riêng theo Figma (`lg:px-[100px]`).
- Mobile trước: thiết kế ở 375px, rồi `md:` 768px, `lg:` 1024px+, kiểm ở 1440px.
- Ảnh và poster là nhân vật chính ở các trang *trải nghiệm* (vở diễn, sơ đồ 3D): giao diện lùi lại.

### Khoảng cách

Bậc 4/8px của Tailwind. Phần liên quan gần nhau (`gap-3`–`gap-6`), giữa các khu xa (`py-16`–`py-24`).

### Bo góc

Có thứ bậc: nút và chip `rounded-full`; ô nhập `rounded-xl`; thẻ `rounded-2xl`; khung lớn / form `rounded-3xl`.
Phần tử bên trong bo nhỏ hơn khung chứa nó.

## Tương tác

- Vùng bấm ≥ 44px (`h-11`, `min-h-11`, hoặc `p-3 -m-3` quanh icon).
- Rê chuột: đổi sang `gold` (nền tối) hoặc sáng / tối nhẹ (nền kem). Bàn phím: vòng `focus-visible` màu `gold` / `wine`.
- Form: báo lỗi tiếng Việt ngay dưới ô sai, nói rõ cách sửa (`friendlyError()` trong `src/lib/errors.ts`);
  nút đổi chữ khi gửi ("Đang gửi…"); thành công có xác nhận rõ.

## Chuyển động

- Thư viện `motion/react`. Mặc định hiện dần lên (`fadeUp`: trượt 30px, 0,6s, một lần).
- Có `MotionConfig` tôn trọng "giảm chuyển động" của máy.
- Chỉ động `transform` / `opacity`; ghi rõ `transition-colors` / `transition-transform`.
- Mỗi trang một khoảnh khắc đáng nhớ (đếm ngược Đắc Lộ, dòng thời gian tự vẽ) — các khu còn lại hiện nhẹ hoặc đứng yên.

## Thành phần dùng chung

`PageHeader`, `Eyebrow`, `fadeUp` (PageParts.tsx) · `CountUp`, `DrawnTimeline` (Motion.tsx) ·
`ProjectCard` + `Modal` (thẻ và popup vở diễn) · `Navbar`, `Footer` · `FacebookIcon` (SocialIcons.tsx).
Link Facebook / YouTube / email lấy từ `SOCIAL` trong `src/constants.ts`.

## Không làm

Chữ gradient, nút gradient, quầng sáng phát sáng · emoji làm trang trí · ảnh stock / ảnh ngẫu nhiên thay ảnh thật
của nhóm · lời chứng không tên thật · nút "Tìm hiểu thêm" chung chung · kính mờ làm nền mặc định ·
căn giữa đoạn văn dài · font thứ ba.

## Nhật ký quyết định

| Ngày | Quyết định | Lý do |
|---|---|---|
| (trước 11/2026) | Vàng `#D4AF37` trên đen `#0A0A0A`; Playfair Display + Be Vietnam Pro | Chất sân khấu; đủ dấu tiếng Việt |
| 11/2026 | Trang Đắc Lộ dùng bảng màu kem (Figma Draft 3), thêm token `night` `#1a0f0a` | Gợi thời kỳ Cha Đắc Lộ; khớp Figma |
| 14/11/2026 | Thêm file DESIGN.md này và bảng soát `docs/SOAT-THIET-KE.md` | Một nguồn chung cho code, Figma và agent |
