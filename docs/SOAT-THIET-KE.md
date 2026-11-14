# Soát thiết kế — bảng chấm cho website CKCGSG

Dùng ở **Bước 2 của `/kiem-tra-web`** (soát bằng mắt) và khi agent `kiem-tra` soát một việc giao diện.
Máy đo kỹ thuật (`npm run audit`) trả lời câu *"web có chạy đúng không"*. Bảng này trả lời câu
*"web có đẹp, rõ và có chủ ý không"* — điều quyết định người xem có ở lại và muốn cộng tác hay không.

> Phỏng theo phương pháp `/design-review` và `/plan-design-review` của
> [gstack](https://github.com/garrytan/gstack) (Garry Tan, giấy phép MIT), đã lược và Việt hoá cho
> một website nhóm ca kịch Công giáo. Không cần cài gstack.

Đi theo thứ tự: **0 phân loại trang → 1 trunk test → 2 mười nhóm soát → 3 điểm thiện cảm → 4 chấm điểm.**
Mỗi nhận xét đều cần **bằng chứng** (ảnh chụp hoặc `file:dòng`) và **cách sửa cụ thể**
("đổi X thành Y vì Z"), không viết "khoảng cách hơi lạ".

---

## 0. Phân loại trang trước khi chấm

Mỗi trang có một "thắng lợi" khác nhau cho người xem, nên tiêu chí khác nhau.

| Loại | Người xem cần | Trang CKCGSG | Ưu tiên khi chấm |
|---|---|---|---|
| **Thuyết phục** | Quyết định và hành động | `/`, `/dac-lo`, `/tuyen-dien-vien`, `/lien-he` | Một lời kêu gọi chính rõ ràng mỗi màn hình; nói rõ *cần gì, liên hệ ai*; không giấu thông tin liên hệ |
| **Đọc** | Hiểu một câu chuyện | `/cau-chuyen`, `/hoat-dong` | Dòng chữ 45–75 ký tự, chữ thân ≥ 16px, tiêu đề phân cấp rõ, ít trang trí |
| **Trải nghiệm** | Đắm vào tác phẩm | `/vo-dien`, popup vở, `/dac-lo/so-do`, `/dac-lo/khuon-vien` | Poster / sân khấu chiếm khung hình đầu; giao diện lùi lại; điều khiển dễ thấy, ≥ 44px |

Trang lai (ví dụ `/dac-lo` có cả câu chuyện lẫn form): **chấm theo từng khu**, ghi rõ khu nào thuộc loại nào.

## 1. Trunk test — thả người xem vào giữa trang

Mở ảnh chụp mobile 375px của trang, không đọc code. Trả lời được ngay bao nhiêu câu?

1. Đây là web của ai? 2. Đang ở trang nào? 3. Trang có những phần chính nào?
4. Từ đây bấm được đi đâu? 5. Đang ở đâu trong web (menu có đánh dấu trang hiện tại)?
6. Muốn liên hệ / cộng tác thì bấm vào đâu?

**ĐẠT** = 6/6 · **TẠM** = 4–5 · **TRƯỢT** = ≤ 3 → trượt là lỗi 🔴 dù trang đẹp đến đâu.
(Câu 6 thay cho câu "tìm kiếm" của bản gốc, vì mục tiêu của web là mời cộng tác.)

## 2. Mười nhóm soát

Mỗi phát hiện ghi **mức**: 🔴 cao · 🟠 vừa · ⚪ đánh bóng, và **nhóm**.

**1. Thứ bậc thị giác** — Mỗi màn hình có một điểm nhìn chính và một nút chính? Nheo mắt nhìn ảnh vẫn thấy
thứ bậc? Phần đầu trang nói được mục đích trong 3 giây? Khoảng trống có chủ ý, không phải chỗ thừa?

**2. Chữ** — Tối đa 2 font (Playfair Display + Be Vietnam Pro). Dấu tiếng Việt không lệch.
Chữ thân ≥ 16px, nhãn ≥ 12px. Cỡ tiêu đề theo tỉ lệ đều (~1,25). Tiêu đề không nhảy cấp (h1 → h3).
Tiêu đề nhiều dòng có `text-balance`, không rớt một chữ mồ côi. Dùng "…" thay "...", số trong bảng dùng `tabular-nums`.
Không giãn chữ (tracking) cho chữ thường.

**3. Màu & tương phản** — Chữ thân ≥ 4,5:1, chữ lớn ≥ 3:1. Nền tối: chữ trắng ngà / trắng 85–90% dễ đọc hơn trắng tuyệt đối.
Không mã hoá chỉ bằng màu (lỗi phải có chữ / icon đi kèm). Màu chỉ từ token trong `src/index.css`.

**4. Khoảng cách & bố cục** — Khoảng cách theo bậc 4/8px. Phần liên quan gần nhau, phần khác xa nhau.
Bo góc có thứ bậc (khối trong nhỏ hơn khối ngoài), không bo to như nhau ở mọi thứ. Có độ rộng tối đa cho đoạn văn.
Không cuộn ngang ở 375 / 768 / 1440.

**5. Trạng thái tương tác** — Mọi nút/link có trạng thái rê chuột **và** vòng focus khi dùng bàn phím
(`focus-visible`), không có `outline-none` trơn. Vùng bấm ≥ 44px. Có trạng thái đang tải ("Đang gửi…"),
lỗi (nói rõ cách sửa, gần ô sai), thành công. Mỗi lựa chọn là một cú bấm "không cần nghĩ": bấm vào biết ngay điều gì xảy ra.

**6. Responsive** — Bố cục mobile là thiết kế cho mobile, không chỉ là cột desktop xếp chồng.
Menu thu gọn hợp lý. Ô nhập đúng kiểu (`type="email"`, `type="tel"`). Không chặn phóng to.

**7. Chuyển động** — Mỗi hiệu ứng có lý do. 50–700ms. Chỉ động `transform`/`opacity`;
không `transition-all`. Tôn trọng "giảm chuyển động". Nội dung **không bị giấu** chờ hiệu ứng mới hiện.
Mỗi trang nên có **một** khoảnh khắc chuyển động đáng nhớ, không phải mọi khối cùng một kiểu hiện lên.

**8. Câu chữ** — Nút nói rõ kết quả ("Đăng ký cộng tác Đắc Lộ", không phải "Tìm hiểu thêm").
Không còn chữ / ảnh giữ chỗ. Câu chủ động. Bớt "lời chào suông" (đoạn mở đầu tự khen) — ghi số chữ và tỉ lệ.
Hướng dẫn dài hơn một câu nghĩa là thiết kế chưa đủ rõ: ghi cả hướng dẫn lẫn chỗ nó đang bù đắp.

**9. Dấu hiệu "làm bằng AI / template"** (AI slop) — câu hỏi: *một nhà thiết kế có tâm có giao bản này không?*
- Lưới 3 cột "icon trong khối tròn màu + tiêu đề đậm + 2 dòng mô tả" lặp lại.
- Căn giữa mọi thứ, kể cả đoạn văn dài.
- Nhãn chữ in hoa giãn rộng đặt trên **mọi** tiêu đề.
- Hàng "3 con số to" dưới phần mở đầu (10+, 120+…) không có ý nghĩa với người xem.
- Kính mờ (`backdrop-blur`) làm nền mặc định khắp nơi; thẻ bo tròn đổ bóng chứa mọi thứ.
- Chữ tô gradient; nút chính tô gradient; quầng sáng phát sáng trên nền tối.
- Emoji làm trang trí (🎭 trong tiêu đề); hình trang trí vẽ bằng khối SVG thay cho ảnh thật.
- Ảnh stock / ảnh ngẫu nhiên thay cho ảnh thật của nhóm.
- Lời chứng không có tên thật; nút chỉ có "Bắt đầu" / "Tìm hiểu thêm".
- Mọi khu cùng chiều cao, cùng nhịp "đầu trang → 3 ý → lời chứng → kêu gọi".
- Chỉ thiết kế trường hợp đẹp: thiếu trạng thái trống, đang tải, lỗi, nội dung dài.

**Lưu ý riêng cho CKCGSG:** vàng trên đen, Playfair Display và chữ nghiêng là **ngôn ngữ sân khấu có chủ ý**,
không tự động là lỗi. Câu hỏi là có *dùng quá tay* không: một nhãn in hoa ở đầu trang Đắc Lộ là đẹp,
50 nhãn khắp web thì thành template. Ghi 🟠 và để nhóm thiết kế quyết.

**10. Hiệu năng cảm nhận** — LCP < 1,5s cho trang thông tin (đo PageSpeed trên bản Vercel, không đo máy cục bộ).
CLS < 0,1. Ảnh có `loading="lazy"`, có kích thước, dạng WebP/AVIF khi được. Font không nháy khi tải.

`npm run soat-ma` đếm sẵn nhiều mẫu ở nhóm 5, 7, 8, 9 trên mã nguồn (`docs/audits/<ngày>/soat-ma.json`).
Con số là **gợi ý chỗ cần nhìn**, không phải điểm: luôn mở ảnh chụp để xác nhận.

## 3. Điểm thiện cảm — đi thử một luồng như người ngoài

Đi 2–3 luồng chính, kể ở ngôi thứ nhất ("Tôi bấm 'Cộng tác'… cuộn xuống… chưa thấy số điện thoại…").
Luồng gợi ý: **Trang chủ → Đắc Lộ → gửi form cộng tác** · **Trang bất kỳ → liên hệ nhóm** · **Vở diễn → mở popup → xem video**.

Bắt đầu 70/100. Con số không quan trọng bằng các khoản cộng/trừ:

| Trừ | Cộng |
|---|---|
| −15 giấu thông tin người xem cần (liên hệ, ngày diễn, địa điểm) | +10 việc chính hiện rõ ngay |
| −15 màn chặn, popup tự bật, phải chờ hiệu ứng | +10 lỗi được báo rõ kèm cách sửa |
| −10 bắt người dùng theo định dạng (không nhận số điện thoại có dấu cách) | +5 nói trước điều cần biết (miễn phí, cần đăng ký…) |
| −10 hỏi thông tin không cần thiết | +5 mỗi bước được rút gọn (link thẳng, điền sẵn) |
| −10 trông cẩu thả | +5 xin lỗi tử tế khi có sự cố |
| −5 mỗi lựa chọn mập mờ | |

```
Thiện cảm: Trang chủ → Đắc Lộ → form cộng tác
  Bước 1: Trang chủ       70 → 80  (+10 nút "Vở Đắc Lộ" nổi bật)
  Bước 2: /dac-lo#cong-tac 80 → 65  (−15 phải cuộn qua 6 khu mới tới form)
  CUỐI: 65/100
```
< 30 = nợ trải nghiệm nghiêm trọng · 30–60 = cần sửa · > 60 = ổn. Khoản trừ lớn nhất ghi thành phát hiện.

## 4. Chấm điểm

Mỗi nhóm bắt đầu ở **A**. Mỗi phát hiện 🔴 hạ một bậc, mỗi 🟠 hạ nửa bậc, ⚪ không trừ.
A = có chủ ý, tinh tế · B = chắc tay, vài chỗ lệch · C = dùng được nhưng chung chung · D = thấy rõ cẩu thả · F = gây hại cho người xem.

| Nhóm | Trọng số |
|---|---|
| Thứ bậc thị giác | 15% |
| Chữ | 15% |
| Khoảng cách & bố cục | 15% |
| Màu & tương phản | 10% |
| Trạng thái tương tác | 10% |
| Responsive | 10% |
| Câu chữ | 10% |
| AI slop | 5% |
| Chuyển động | 5% |
| Hiệu năng cảm nhận | 5% |

Hai điểm đầu báo cáo: **Điểm thiết kế** (trung bình có trọng số) và **Điểm AI slop** (chấm riêng, kèm một câu nhận xét).

Ghi thêm `docs/audits/<ngày>/diem-thiet-ke.json` để lần sau so sánh:

```json
{
  "ngay": "2026-11-14",
  "diem_thiet_ke": "B",
  "diem_ai_slop": "C",
  "theo_nhom": { "thu-bac": "A", "chu": "B", "khoang-cach": "B", "mau": "A", "tuong-tac": "C",
                 "responsive": "B", "cau-chu": "B", "ai-slop": "C", "chuyen-dong": "B", "hieu-nang": "B" },
  "trunk_test": { "/": "ĐẠT", "/dac-lo": "TẠM" },
  "thien_cam": { "Trang chủ → Đắc Lộ → form cộng tác": 65 },
  "phat_hien": [{ "id": "TK-01", "muc": "cao", "nhom": "tuong-tac", "trang": "/lien-he", "tom_tat": "…" }]
}
```

Có file của lần trước → ghi bảng so sánh: nhóm nào lên/xuống bậc, phát hiện nào đã hết, phát hiện nào mới.

## Sửa nhanh (bắt buộc trong báo cáo)

Luôn có mục **Sửa nhanh**: 3–5 việc tác động lớn nhất mà mỗi việc làm dưới 30 phút.
Đây là thứ Midu duyệt đầu tiên.
