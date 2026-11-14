import { Project } from './types';
import IMG_DACLO_COVER from './assets/photos/daclo-cover.jpg';
import IMG_STAGE from './assets/photos/stage-wide.jpg';
import IMG_DUO from './assets/photos/duo.jpg';
import IMG_JERICHO1 from './assets/photos/jericho-1.jpg';
import IMG_JERICHO3 from './assets/photos/jericho-3.jpg';
import IMG_JERICHO_STAGE from './assets/photos/jericho-stage.jpg';
import IMG_INHAXIO from './assets/photos/di-tim-inhaxio.jpg';
import POSTER_DON_BOSCO from './assets/photos/poster-don-bosco.jpg';
import POSTER_TEN_TU_TU from './assets/photos/poster-ten-tu-tu.jpg';
import POSTER_BUC_LINH_ANH from './assets/photos/poster-buc-linh-anh.jpg';
import POSTER_10_CO_TRINH_NU from './assets/photos/poster-10-co-trinh-nu.jpg';
import POSTER_HAI_NHI from './assets/photos/poster-hai-nhi-la-ai.jpg';
import POSTER_KHI_LONG_DA_TIN from './assets/photos/poster-khi-long-da-tin.jpg';
import POSTER_HOANG_TU_NHO from './assets/photos/poster-hoang-tu-nho.jpg';
import POSTER_CON_CHIEN from './assets/photos/poster-con-chien-khong-moi.jpg';
import POSTER_MOT_TINH_YEU from './assets/photos/poster-mot-tinh-yeu.jpg';
// Ảnh vở diễn từ các album của nhóm (Midu gửi 14/11/2026), đã nén ≤1600px, bỏ EXIF.
import IMG_MUOI_CO_TRINH_NU_1 from './assets/photos/muoi-co-trinh-nu-1.jpg';
import IMG_MUOI_CO_TRINH_NU_2 from './assets/photos/muoi-co-trinh-nu-2.jpg';
import IMG_MUOI_CO_TRINH_NU_3 from './assets/photos/muoi-co-trinh-nu-3.jpg';
import IMG_MUOI_CO_TRINH_NU_4 from './assets/photos/muoi-co-trinh-nu-4.jpg';
import IMG_HAI_NHI_LA_AI_1 from './assets/photos/hai-nhi-la-ai-1.jpg';
import IMG_HAI_NHI_LA_AI_2 from './assets/photos/hai-nhi-la-ai-2.jpg';
import IMG_HAI_NHI_LA_AI_3 from './assets/photos/hai-nhi-la-ai-3.jpg';
import IMG_HAI_NHI_LA_AI_4 from './assets/photos/hai-nhi-la-ai-4.jpg';
import IMG_HAI_NHI_LA_AI_5 from './assets/photos/hai-nhi-la-ai-5.jpg';
import IMG_HAI_NHI_LA_AI_6 from './assets/photos/hai-nhi-la-ai-6.jpg';
import IMG_HAI_NHI_LA_AI_7 from './assets/photos/hai-nhi-la-ai-7.jpg';
import IMG_BUC_LINH_ANH_1 from './assets/photos/buc-linh-anh-1.jpg';
import IMG_BUC_LINH_ANH_2 from './assets/photos/buc-linh-anh-2.jpg';
import IMG_BUC_LINH_ANH_3 from './assets/photos/buc-linh-anh-3.jpg';
import IMG_BUC_LINH_ANH_4 from './assets/photos/buc-linh-anh-4.jpg';
import IMG_HOANG_TU_NHO_1 from './assets/photos/hoang-tu-nho-1.jpg';
import IMG_HOANG_TU_NHO_2 from './assets/photos/hoang-tu-nho-2.jpg';
import IMG_HOANG_TU_NHO_3 from './assets/photos/hoang-tu-nho-3.jpg';
import IMG_HOANG_TU_NHO_4 from './assets/photos/hoang-tu-nho-4.jpg';
import IMG_KHI_LONG_DA_TIN_1 from './assets/photos/khi-long-da-tin-1.jpg';
import IMG_KHI_LONG_DA_TIN_2 from './assets/photos/khi-long-da-tin-2.jpg';
import IMG_KHI_LONG_DA_TIN_3 from './assets/photos/khi-long-da-tin-3.jpg';
import IMG_KHI_LONG_DA_TIN_4 from './assets/photos/khi-long-da-tin-4.jpg';
import IMG_KHI_LONG_DA_TIN_5 from './assets/photos/khi-long-da-tin-5.jpg';
import IMG_KHI_LONG_DA_TIN_6 from './assets/photos/khi-long-da-tin-6.jpg';
import IMG_KHI_LONG_DA_TIN_7 from './assets/photos/khi-long-da-tin-7.jpg';
import IMG_CON_CHIEN_KHONG_MOI_1 from './assets/photos/con-chien-khong-moi-1.jpg';
import IMG_CON_CHIEN_KHONG_MOI_2 from './assets/photos/con-chien-khong-moi-2.jpg';
import IMG_CON_CHIEN_KHONG_MOI_3 from './assets/photos/con-chien-khong-moi-3.jpg';

/**
 * Kênh chính thức của nhóm. Nguồn: Midu cung cấp ngày 14/11/2026.
 * Mọi nơi trên web (chân trang, trang Liên hệ…) đọc link từ đây — đổi một chỗ là đủ.
 */
export const SOCIAL = {
  facebook: 'https://www.facebook.com/cakichconggiaosaigon',
  youtube: 'https://www.youtube.com/@CaKichCongGiaoSaiGon',
} as const;

/**
 * Công tắc tuyển diễn viên. Nguồn: Midu, 14/11/2026 — đợt 2026 đã đóng, dàn diễn viên Đắc Lộ đã đủ
 * và đang tập, chưa có dự kiến đợt mới.
 * - `open: false` → trang /tuyen-dien-vien hiện bản "đã khép lại", menu ẩn mục Tuyển diễn viên,
 *   các nút "Tham gia" ở trang chủ / Câu chuyện dẫn sang cộng tác Đắc Lộ.
 * - Mở đợt mới: đổi `open: true`, sửa `deadline` và `round`.
 */
export const CASTING = {
  open: false,
  round: '2026',
  deadline: '30/06/2026',
} as const;

/**
 * Ngày diễn hiển thị dạng "MM.YYYY" (theo poster trong proposal).
 * Dùng playSortKey() để sắp xếp từ mới đến cũ.
 */
export function playSortKey(date?: string): number {
  if (!date) return 0;
  const m = date.match(/(\d{1,2})\.(\d{4})/);
  if (m) return Number(m[2]) * 100 + Number(m[1]);
  const y = date.match(/\d{4}/);
  return y ? Number(y[0]) * 100 : 0;
}

// Link YouTube các vở: nguồn bảng "TƯ LIỆU HÌNH ẢNH/VIDEO CÁC VỞ DIỄN" của nhóm (Midu gửi 14/11/2026).
export const PLAYS: Project[] = [
  {
    id: 'dac-lo',
    title: 'Đắc Lộ',
    description: 'Vở nhạc kịch kỷ niệm 400 năm Cha Đắc Lộ đặt chân đến Đàng Ngoài (1627 – 2027).',
    content: 'Vở ca kịch "Đắc Lộ" không chỉ khắc họa chân dung một nhà truyền giáo thế kỷ XVII, mà làm nổi bật những biến cố, thành quả và ảnh hưởng lâu dài mà Cha Đắc Lộ cùng các cha Dòng Tên đã để lại cho Giáo Hội và xã hội Việt Nam.',
    imageUrl: IMG_DACLO_COVER,
    status: 'upcoming',
    date: '04.06.2027'
  },
  {
    id: 'di-tim-inhaxio',
    title: 'ĐI TÌM INHAXIO',
    description: 'Vở ca kịch trình diễn trong chương trình Tĩnh tâm Mùa Vọng, tháng 12/2025.',
    content: 'Vở ca kịch "Đi Tìm Inhaxio" được trình diễn trong chương trình Tĩnh tâm Mùa Vọng vào tháng 12/2025.',
    imageUrl: IMG_INHAXIO,
    status: 'archived',
    date: '12.2025'
  },
  {
    id: 'jericho',
    title: 'BỨC TƯỜNG JERICHO',
    description: 'Trình diễn tại Đại hội Giới trẻ TGP Sài Gòn, tháng 11/2024.',
    content: 'Vở ca kịch "Bức tường Jericho" được trình diễn tại Đại hội Giới trẻ Tổng Giáo phận Sài Gòn vào tháng 11/2024. Vở diễn tái hiện lại hành trình đức tin của dân Israel dưới sự dẫn dắt của Joshua. Với âm nhạc hào hùng và những màn vũ đạo công phu, chúng tôi hy vọng sẽ mang đến cho khán giả một trải nghiệm tâm linh sâu sắc về sức mạnh của sự vâng phục và lòng tin vào Thiên Chúa.',
    imageUrl: IMG_JERICHO_STAGE,
    images: [IMG_JERICHO1, IMG_JERICHO3],
    status: 'archived',
    date: '11.2024'
  },
  {
    id: 'don-bosco',
    title: 'DON BOSCO',
    description: 'Vở diễn chính thức đầu tiên của Nhóm Ca Kịch Công Giáo Sài Gòn.',
    content: 'Vở Don Bosco là vở diễn chính thức đầu tiên của Nhóm Ca Kịch Công Giáo Sài Gòn.',
    imageUrl: POSTER_DON_BOSCO,
    youtubeUrl: 'https://www.youtube.com/watch?v=lk1lkJfL2f4',
    status: 'archived',
    date: '04.2015'
  },
  {
    id: 'ten-tu-tu',
    title: 'TÊN TỬ TÙ – MỘT CHỨNG NHÂN',
    description: 'Vở ca kịch về sự hối cải, biểu diễn lần đầu vào năm 2015.',
    content: 'Vở ca kịch Tên Tử Tù được biểu diễn lần đầu vào năm 2015, trong chương trình Cafe Thánh ca số 3, Giới trẻ Giáo xứ Tân Hương. Sau đó là Giáo xứ Thanh Đa và Giáo xứ Mân Côi (Đa Minh).',
    imageUrl: POSTER_TEN_TU_TU,
    youtubeUrl: 'https://www.youtube.com/watch?v=kJ9jsb1zGXk',
    status: 'archived',
    date: '05.2015'
  },
  {
    id: '10-co-trinh-nu',
    title: 'MƯỜI CÔ TRINH NỮ',
    description: 'Vở diễn về dụ ngôn 10 cô trinh nữ, công diễn năm 2015 và 2019.',
    content: 'Vở diễn 10 Cô Trinh Nữ được công diễn vào năm 2015. Sau đó, nhóm tiếp tục công diễn vở ca kịch vào năm 2019.',
    imageUrl: POSTER_10_CO_TRINH_NU,
    images: [IMG_MUOI_CO_TRINH_NU_1, IMG_MUOI_CO_TRINH_NU_2, IMG_MUOI_CO_TRINH_NU_3, IMG_MUOI_CO_TRINH_NU_4], // nguồn ảnh: Kỳ Đồng 19/12/2015
    youtubeUrl: 'https://www.youtube.com/watch?v=UKyJb62B7xU&t=1800s', // bản 19/12/2015, vở bắt đầu từ phút 30
    status: 'archived',
    date: '12.2015 · 2019'
  },
  {
    id: 'khi-long-da-tin',
    title: 'KHI LÒNG ĐÃ TIN',
    description: 'Vở diễn gây quỹ cho người dân Miền Trung năm 2016.',
    content: 'Khi lòng đã Tin - được thực hiện nhằm gây Quỹ cho người dân Miền Trung vào năm 2016 tại Dòng Chúa Cứu Thế - Nhà thờ Kỳ Đồng. Sân khấu của vở được dàn dựng khá đặc biệt, tái hiện lại quang cảnh của một vùng quê nghèo nơi đó có những con người vẫn luôn đặt niềm tin nơi Thiên Chúa.',
    imageUrl: POSTER_KHI_LONG_DA_TIN,
    images: [IMG_KHI_LONG_DA_TIN_1, IMG_KHI_LONG_DA_TIN_2, IMG_KHI_LONG_DA_TIN_3, IMG_KHI_LONG_DA_TIN_4, IMG_KHI_LONG_DA_TIN_5, IMG_KHI_LONG_DA_TIN_6, IMG_KHI_LONG_DA_TIN_7], // nguồn ảnh: 1–5: ảnh Quang Hứa; 6–7: buổi tập (album Chạy sk)
    youtubeUrl: 'https://www.youtube.com/watch?v=lYcCvjpwycg',
    status: 'archived',
    date: '11.2016'
  },
  {
    id: 'buc-linh-anh',
    title: 'BỨC LINH ẢNH BỊ ĐÁNH CẮP',
    description: 'Công diễn lần đầu vào năm 2015 tại Nhà Thờ Kỳ Đồng.',
    content: 'Vở diễn Bức Linh Ảnh Bị Đánh Cắp được công diễn lần đầu vào 10/2015 & 12/2015 tại Dòng Chúa Cứu Thế - Nhà Thờ Kỳ Đồng. Sau đó, nhóm tiếp tục công diễn vở ca kịch vào năm 2017 tại Phú Dòng - Gia Kiệm.',
    imageUrl: POSTER_BUC_LINH_ANH,
    images: [IMG_BUC_LINH_ANH_1, IMG_BUC_LINH_ANH_2, IMG_BUC_LINH_ANH_3, IMG_BUC_LINH_ANH_4], // nguồn ảnh: đêm diễn tại Phú Dòng, ảnh Quỳnh–Gấu
    youtubeUrl: 'https://www.youtube.com/watch?v=qZ92bliEi5A', // lần 3 (01/2017, Phú Dòng – Gia Kiệm); lần 1 trên kênh a Kiệt, chưa có link
    status: 'archived',
    date: '10.2015 · 2017'
  },
  {
    id: 'hai-nhi-la-ai',
    title: 'HÀI NHI LÀ AI',
    description: 'Vở ca kịch Giáng Sinh công diễn năm 2016 và 2017.',
    content: 'Vở ca kịch Hài Nhi Là Ai được công diễn vào năm 2016 tại Hội trường Anphong, nhà thờ Kỳ Đồng, Giáo xứ Đức Mẹ Hằng Cứu Giúp. Năm 2017, Nhóm đã tái diễn vớ ca kịch này tại Giáo Xứ Tam Hải và Đại Hội Giới trẻ FMA.',
    imageUrl: POSTER_HAI_NHI,
    images: [IMG_HAI_NHI_LA_AI_1, IMG_HAI_NHI_LA_AI_2, IMG_HAI_NHI_LA_AI_3, IMG_HAI_NHI_LA_AI_4, IMG_HAI_NHI_LA_AI_5, IMG_HAI_NHI_LA_AI_6, IMG_HAI_NHI_LA_AI_7], // nguồn ảnh: 1–4: Kỳ Đồng 6/2016, ảnh Q+Gấu; 5–7: Đại hội Giới trẻ FMA 2017, ảnh Minh Phước
    youtubeUrl: 'https://www.youtube.com/watch?v=dCXOTQieO24',
    status: 'archived',
    date: '06.2016 · 2017'
  },
  {
    id: 'hoang-tu-nho',
    title: 'HOÀNG TỬ NHỎ',
    description: 'Vở diễn mừng Giáng Sinh tại Nhà Thờ Kỳ Đồng năm 2016.',
    content: 'Vở Hoàng Tử Nhỏ được công diễn tại Nhà Thờ Kỳ Đồng - Giáo Xứ Đức Mẹ Hằng Cứu Giúp vào năm 2016 - trong khuôn khổ chương trình văn nghệ mừng Giáng Sinh của giáo xứ',
    imageUrl: POSTER_HOANG_TU_NHO,
    images: [IMG_HOANG_TU_NHO_1, IMG_HOANG_TU_NHO_2, IMG_HOANG_TU_NHO_3, IMG_HOANG_TU_NHO_4], // nguồn ảnh: 23/12/2016, ảnh Q+Gấu
    youtubeUrl: 'https://www.youtube.com/watch?v=QoxzoKhE2JQ',
    status: 'archived',
    date: '12.2016'
  },
  {
    id: 'con-chien-khong-moi',
    title: 'CON CHIÊN KHÔNG MỎI',
    description: 'Vở ca kịch đánh dấu mốc quan trọng 10 năm hành trình của nhóm.',
    content: 'Vở Con Chiên Không Mỏi được công diễn 2 lần vào năm 2023 tại Nhà thờ Kỳ Đồng - Giáo xứ Đức Mẹ Hằng Cứu Giúp - thuộc DCCT Sài Gòn; và tại Dòng Đức Bà Truyền Giáo. Vở ca kịch tái hiện lịch sử cứu độ và cuộc thương khó của Chúa Giê-su. Đây là vở ca kịch mà nhóm đã ấp ủ từ ngày thành lập, cũng là vở diễn tạo nên dấu mốc quan trọng trong hành trình 10 năm của Nhóm Ca Kịch - Đó là sự tái hợp và quay trở lại chính thức của Nhóm.',
    imageUrl: POSTER_CON_CHIEN,
    images: [IMG_STAGE, IMG_CON_CHIEN_KHONG_MOI_1, IMG_CON_CHIEN_KHONG_MOI_2, IMG_CON_CHIEN_KHONG_MOI_3], // nguồn ảnh: tập luyện & làm cảnh trí lần dựng 2014, ảnh Mỹ Kim
    youtubeUrl: 'https://www.youtube.com/watch?v=PHdGP26BlKU', // lần 2 (25/5/2023); bản Official DP_G2BCHo98 đang Unlisted — chờ Midu duyệt
    status: 'archived',
    date: '04.2023'
  },
  {
    id: 'mot-tinh-yeu',
    title: 'MỘT TÌNH YÊU',
    description: 'Trình diễn tại Đại Hội Giới Trẻ TGP Sài Gòn năm 2023.',
    content: '“Một Tình Yêu” được trình diễn trong Đại Hội Giới Trẻ của Tổng Giáo Phận Sài Gòn vào ngày 25.11.2023 tại Trung Tâm Mục Vụ, Tổng Giáo Phận Sài Gòn. Ngoài ra, nhóm đã công diễn lần thứ 2 vở ca kịch này tại Tu Viện Dòng Tên. “Một Tình Yêu” đã để lại nhiều ấn tượng và cảm xúc khác nhau nơi các tham dự viên. Dựa trên suy niệm về chặng đàng thánh giá của Đại Hội Giới Trẻ thế giới tại Lisbon 2023, đạo diễn Jean Kiệt cùng với các thành viên trong Nhóm đã tái hiện lại chặng đàng thánh giá trên hành trình cuộc đời mà người trẻ đang phải đối diện.',
    imageUrl: POSTER_MOT_TINH_YEU,
    images: [IMG_DUO],
    youtubeUrl: 'https://www.youtube.com/watch?v=bUDv_nN7TMQ', // lần 1 (25/11/2023), Truyền thông TGP
    status: 'archived',
    date: '11.2023'
  }
];

export const CHARITY: Project[] = [
  {
    id: 'he-yeu-thuong',
    title: 'Hè Yêu Thương',
    description: 'Chương trình thiện nguyện phối hợp cùng The Friend of Friend.',
    content: 'Chương trình Thiện nguyện Hè Yêu Thương cùng The Friend of Friend mang niềm vui và sự hỗ trợ đến cho các em nhỏ và những hoàn cảnh khó khăn trong dịp hè.',
    imageUrl: 'https://picsum.photos/seed/summer/800/600',
    images: [
      'https://picsum.photos/seed/summer1/800/600',
      'https://picsum.photos/seed/summer2/800/600'
    ],
    status: 'archived',
    date: 'Hè Yêu Thương'
  },
  {
    id: 'tet-am-cho-em',
    title: 'Tết Ấm Cho Em',
    description: 'Mang không khí Tết ấm áp đến với các em nhỏ.',
    content: 'Chương trình Thiện nguyện Tết Ấm Cho Em nhằm mang lại một cái Tết ấm cúng, đầy đủ hơn cho các em nhỏ có hoàn cảnh đặc biệt.',
    imageUrl: 'https://picsum.photos/seed/tet/800/600',
    images: [
      'https://picsum.photos/seed/tet1/800/600',
      'https://picsum.photos/seed/tet2/800/600',
      'https://picsum.photos/seed/tet3/800/600'
    ],
    status: 'archived',
    date: 'Tết Ấm'
  },
  {
    id: 'con-chu-jrai',
    title: 'Con chữ Jrai - Pleiku',
    description: 'Hỗ trợ giáo dục cho trẻ em dân tộc Jrai tại Pleiku.',
    content: 'Chương trình Thiện nguyện Con chữ Jrai tại Pleiku năm 2018, tập trung vào việc hỗ trợ sách vở và điều kiện học tập cho các em nhỏ dân tộc thiểu số.',
    imageUrl: 'https://picsum.photos/seed/jrai/800/600',
    images: [
      'https://picsum.photos/seed/jrai1/800/600',
      'https://picsum.photos/seed/jrai2/800/600'
    ],
    status: 'archived',
    date: '2018'
  },
  {
    id: 'gioan-thien-chua',
    title: 'Dòng Gioan Thiên Chúa',
    description: 'Hoạt động thiện nguyện tại Dòng Gioan Thiên Chúa.',
    content: 'Chương trình Thiện nguyện tại Dòng Gioan Thiên Chúa năm 2017, chia sẻ và giúp đỡ các bệnh nhân và những người đang được chăm sóc tại đây.',
    imageUrl: 'https://picsum.photos/seed/gioan/800/600',
    images: [
      'https://picsum.photos/seed/tet1/800/600',
      'https://picsum.photos/seed/tet2/800/600',
      'https://picsum.photos/seed/tet3/800/600'
    ],
    status: 'archived',
    date: '2017'
  },
  {
    id: 'mai-am-thien-than',
    title: 'Mái Ấm Thiên Thần - Biên Hòa',
    description: 'Thăm và tặng quà tại Mái Ấm Thiên Thần.',
    content: 'Chương trình Thiện nguyện tại Mái Ấm Thiên Thần - Biên Hòa năm 2017, mang tình thương đến với các em nhỏ mồ côi và khuyết tật.',
    imageUrl: 'https://picsum.photos/seed/angel/800/600',
    images: [
      'https://picsum.photos/seed/angel1/800/600',
      'https://picsum.photos/seed/angel2/800/600'
    ],
    status: 'archived',
    date: '2017'
  },
  {
    id: 'trong-duc',
    title: 'Cơ sở Bảo Trợ Xã Hội Trọng Đức',
    description: 'Hỗ trợ các bệnh nhân tâm thần tại cơ sở Trọng Đức.',
    content: 'Hoạt động thiện nguyện tại Cơ sở Bảo Trợ Xã Hội Trọng Đức năm 2017, nơi chăm sóc các bệnh nhân tâm thần có hoàn cảnh khó khăn.',
    imageUrl: 'https://picsum.photos/seed/trongduc/800/600',
    images: [
      'https://picsum.photos/seed/tet1/800/600',
      'https://picsum.photos/seed/tet2/800/600',
      'https://picsum.photos/seed/tet3/800/600'
    ],
    status: 'archived',
    date: '2017'
  }
];

export const OTHER_PROGRAMS: Project[] = [
  {
    id: 'paussiere-de-vie',
    title: 'PAUSSIERE DE VIE',
    description: 'Chương trình nghệ thuật cộng đồng.',
    imageUrl: 'https://picsum.photos/seed/paussiere/800/600',
    images: [
      'https://picsum.photos/seed/tet1/800/600',
      'https://picsum.photos/seed/tet2/800/600',
      'https://picsum.photos/seed/tet3/800/600'
    ],
    status: 'archived',
    date: '2014'
  },
  {
    id: 'giang-sinh-man-coi-2014',
    title: 'ĐÊM THÁNH CA GIÁNG SINH',
    description: 'Biểu diễn tại Giáo xứ Mân Côi.',
    content: 'Chương trình Đêm Thánh Ca Giáng Sinh tại Giáo xứ Mân Côi năm 2014.',
    imageUrl: 'https://picsum.photos/seed/xmas2014/800/600',
    images: [
      'https://picsum.photos/seed/tet1/800/600',
      'https://picsum.photos/seed/tet2/800/600',
      'https://picsum.photos/seed/tet3/800/600'
    ],
    status: 'archived',
    date: '2014'
  },
  {
    id: 'nguon-cuu-do-2015',
    title: 'NGUỒN CỨU ĐỘ',
    description: 'Biểu diễn tại Giáo xứ Mân Côi.',
    content: 'Chương trình Nguồn Cứu Độ tại Giáo xứ Mân Côi năm 2015.',
    imageUrl: 'https://picsum.photos/seed/salvation2015/800/600',
    images: [
      'https://picsum.photos/seed/tet1/800/600',
      'https://picsum.photos/seed/tet2/800/600',
      'https://picsum.photos/seed/tet3/800/600'
    ],
    status: 'archived',
    date: '2015'
  },
  {
    id: 'giac-mo-dem-mua-dong',
    title: 'HỢP XƯỚNG GIẤC MƠ ĐÊM MÙA ĐÔNG',
    description: 'Hợp tác cùng MPU.',
    content: 'Chương trình hợp xướng Giấc Mơ Đêm Mùa Đông cùng MPU.',
    imageUrl: 'https://picsum.photos/seed/winterdream/800/600',
    images: [
      'https://picsum.photos/seed/tet1/800/600',
      'https://picsum.photos/seed/tet2/800/600',
      'https://picsum.photos/seed/tet3/800/600'
    ],
    status: 'archived',
    date: '2015'
  },
  {
    id: 'song-review-2016',
    title: 'SONG REVIEW - OCP',
    description: 'English Misal Songbook.',
    content: 'Chương trình Song Review năm 2016 - OCP (English Misal Songbook).',
    imageUrl: 'https://picsum.photos/seed/songreview/800/600',
    images: [
      'https://picsum.photos/seed/tet1/800/600',
      'https://picsum.photos/seed/tet2/800/600',
      'https://picsum.photos/seed/tet3/800/600'
    ],
    status: 'archived',
    youtubeUrl: 'https://www.youtube.com/watch?v=m7V-hCdyEAw',
    date: '2016'
  },
  {
    id: 'dem-hong-an-2017',
    title: 'HỢP XƯỚNG ĐÊM HỒNG ÂN',
    description: 'Biểu diễn tại Giáo xứ Cầu Kho.',
    content: 'Hợp xướng tại Đêm Hồng Ân Giáo xứ Cầu Kho năm 2017.',
    imageUrl: 'https://picsum.photos/seed/grace2017/800/600',
    images: [
      'https://picsum.photos/seed/tet1/800/600',
      'https://picsum.photos/seed/tet2/800/600',
      'https://picsum.photos/seed/tet3/800/600'
    ],
    status: 'archived',
    date: '2017'
  },
  {
    id: 'tot-nghiep-dong-ten-2014',
    title: 'LỄ TRAO BẰNG TỐT NGHIỆP',
    description: 'Học viện Thánh Giuse Dòng Tên.',
    content: 'Lễ trao bằng tốt nghiệp cho các tân khoa Thần sinh và Triết sinh tại Học viện Thánh Giuse Dòng Tên năm 2014.',
    imageUrl: 'https://picsum.photos/seed/graduation2014/800/600',
    images: [
      'https://picsum.photos/seed/tet1/800/600',
      'https://picsum.photos/seed/tet2/800/600',
      'https://picsum.photos/seed/tet3/800/600'
    ],
    status: 'archived',
    date: '2014'
  }
];
