# Ca Kịch Công Giáo Sài Gòn — Website

Website chính thức của **Nhóm Ca Kịch Công Giáo Sài Gòn (CKCGSG)** — mang Tin Mừng đến mọi người qua nghệ thuật ca kịch, miễn phí cho cộng đồng từ năm 2014.

🌐 **Website:** https://ckcgsg-website.vercel.app
🎭 **Vở sắp tới:** [Đắc Lộ — kỷ niệm 400 năm Cha Đắc Lộ đến Đàng Ngoài (04.06.2027)](https://ckcgsg-website.vercel.app/dac-lo)
🗺️ **Sơ đồ cấu trúc code:** https://gitdiagram.com/midu1405/ckcgsg-website
🎨 **Wireframe Figma:** https://www.figma.com/design/OApGt3kekywfGTMdMVhRJ9

**Thực hiện:** Nguyễn Minh Đức (Midu) — [github.com/midu1405](https://github.com/midu1405)
**Nội dung & hình ảnh:** Nhóm Ca Kịch Công Giáo Sài Gòn

---

## Các trang

| Đường dẫn | Trang | Nội dung |
|---|---|---|
| `/` | Trang chủ | Mở đầu, vở sắp tới, nhóm làm những gì, câu chuyện rút gọn, 3 vở gần nhất |
| `/dac-lo` | Vở Đắc Lộ | Landing page theo proposal 2027: đếm ngược, thông điệp, Cha Đắc Lộ, kế hoạch công diễn, lời mời cộng tác |
| `/dac-lo/so-do` | Sơ đồ sân khấu 3D | Bản dự kiến: sân khấu theo thiết kế, khán đài, chế độ Khán giả / Nhà tài trợ |
| `/dac-lo/khuon-vien` | Sơ đồ khuôn viên | Trung Tâm Mục Vụ & Đại Chủng Viện Thánh Giuse từ dữ liệu OpenStreetMap; chế độ đánh dấu để thêm bãi xe, cổng… |
| `/vo-dien` | Vở diễn | Tất cả vở ca kịch, chia theo giai đoạn |
| `/hoat-dong` | Hoạt động | Thiện nguyện, thánh ca & hợp xướng |
| `/cau-chuyen` | Câu chuyện | Đôi nét về nhóm, cột mốc, giá trị, sứ mệnh |
| `/tuyen-dien-vien` | Tuyển diễn viên | Yêu cầu hồ sơ hát / múa, cách ứng tuyển |
| `/lien-he` | Liên hệ & Ủng hộ | Email, thông tin chuyển khoản, form liên hệ |

## Công nghệ

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org) + [Vite](https://vite.dev)
- [Tailwind CSS 4](https://tailwindcss.com) — màu chủ đạo: vàng `#D4AF37` trên nền đen `#0A0A0A`
- [React Router](https://reactrouter.com) cho các trang, [Motion](https://motion.dev) cho hiệu ứng
- Font tự chứa qua [Fontsource](https://fontsource.org): **Playfair Display** (tiêu đề, con số) + **Be Vietnam Pro** (chữ thường)
- Biểu tượng: [Lucide](https://lucide.dev)
- Sơ đồ 3D: [three.js](https://threejs.org) + [React Three Fiber](https://r3f.docs.pmnd.rs) (chỉ tải khi mở trang sơ đồ)
- Dữ liệu bản đồ khuôn viên: © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors (ODbL)
- Triển khai: [Vercel](https://vercel.com)

## Chạy trên máy

Cần [Node.js](https://nodejs.org) 20 trở lên.

```bash
npm install
npm run dev        # mở http://localhost:3000
```

Các lệnh khác:

```bash
npm run build      # đóng gói vào thư mục dist/
npm run preview    # xem thử bản đã đóng gói
npm run lint       # kiểm tra lỗi TypeScript
```

## Cấu trúc thư mục

```
src/
├── App.tsx                 # khai báo các trang (routes), tự cuộn lên đầu khi đổi trang
├── constants.ts            # ⭐ dữ liệu vở diễn, thiện nguyện, chương trình khác
├── types.ts                # kiểu dữ liệu Project
├── index.css               # font, màu chủ đạo
├── pages/                  # mỗi file là một trang
│   ├── HomePage.tsx
│   ├── DacLoPage.tsx
│   ├── PlaysPage.tsx
│   ├── ActivitiesPage.tsx
│   ├── StoryPage.tsx
│   ├── CastingPage.tsx
│   └── ContactPage.tsx
├── components/
│   ├── Navbar.tsx          # thanh menu (danh sách link nằm ở NAV_LINKS)
│   ├── Footer.tsx
│   ├── PageParts.tsx       # đầu trang, nhãn, lưới thẻ dùng chung
│   ├── Motion.tsx          # hiệu ứng: số chạy, timeline tự vẽ, hiện lần lượt
│   ├── ProjectCard.tsx     # thẻ vở diễn
│   ├── Modal.tsx           # popup chi tiết khi bấm thẻ
│   └── CastingSection.tsx  # khối tuyển diễn viên
└── assets/
    ├── LOGO.png, LOGO_MAIN_W.png
    └── photos/             # ảnh dùng trên web (nên nén < 300KB / ảnh)
docs/
└── FIGMA_SYNC.md           # danh sách thay đổi chờ cập nhật sang Figma
vercel.json                 # cho phép mở thẳng /vo-dien, /dac-lo... không bị lỗi 404
```

## Cập nhật nội dung thường gặp

**Thêm / sửa một vở diễn** — mở `src/constants.ts`, thêm một mục vào `PLAYS`:

```ts
{
  id: 'ten-vo-khong-dau',
  title: 'TÊN VỞ DIỄN',
  description: 'Một câu giới thiệu ngắn (hiện trên thẻ).',
  content: 'Đoạn mô tả đầy đủ (hiện trong popup).',
  imageUrl: POSTER_TEN_VO,          // import ảnh ở đầu file
  images: [ANH_1, ANH_2],           // (tuỳ chọn) album ảnh trong popup
  youtubeUrl: 'https://youtu.be/…', // (tuỳ chọn) nút Xem trên YouTube
  status: 'archived',               // 'upcoming' = vở sắp diễn
  date: '11.2024',                  // dạng MM.YYYY — web tự sắp xếp mới nhất lên đầu
}
```

**Thay ảnh** — đặt ảnh vào `src/assets/photos/`, nén trước khi đưa lên (rộng tối đa ~2000px, chất lượng ~80%).

**Đổi ngày diễn Đắc Lộ** — sửa `PREMIERE` trong `src/pages/DacLoPage.tsx` (đồng hồ đếm ngược) và `date` của mục `dac-lo` trong `constants.ts`.

**Thêm bãi xe / cổng trên sơ đồ khuôn viên** — mở `/dac-lo/khuon-vien`, bật *Chế độ đánh dấu*, bấm vào vị trí, bấm *Sao chép dòng thêm điểm* rồi dán vào `MARKERS` trong `src/components/campus/data.ts`.

**Thêm một trang** — tạo file trong `src/pages/`, khai báo route trong `App.tsx`, thêm link vào `NAV_LINKS` trong `Navbar.tsx`.

## Triển khai

Website tự động cập nhật qua Vercel:

- Đẩy code lên nhánh **`main`** → cập nhật **website chính thức**.
- Đẩy lên **nhánh khác** → Vercel tạo **bản xem trước** riêng để duyệt trước khi đưa lên `main`.

## Thiết kế (Figma)

Wireframe desktop + mobile và thư viện ảnh nằm trong file Figma ở trên. Do tài khoản Figma đang ở gói Starter (giới hạn lượt chỉnh qua Claude), các thay đổi code được gom lại và cập nhật sang Figma theo đợt — xem [`docs/FIGMA_SYNC.md`](docs/FIGMA_SYNC.md).

## Việc còn mở

- Form liên hệ và ô đăng ký nhận tin Đắc Lộ chưa nối dịch vụ gửi (EmailJS / Google Sheets).
- Ảnh thẻ Thiện nguyện và Thánh ca & hợp xướng còn là ảnh mẫu tạm.
- Link YouTube của các vở đang là đường dẫn giữ chỗ.

---

© Nhóm Ca Kịch Công Giáo Sài Gòn. Website thực hiện bởi Nguyễn Minh Đức (Midu).
