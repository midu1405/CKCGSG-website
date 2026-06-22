import { Project } from './types';
import IMG_FEATURE from './assets/photos/feature-daclo.jpg';
import IMG_STAGE from './assets/photos/stage-wide.jpg';
import IMG_DUO from './assets/photos/duo.jpg';
import IMG_JERICHO1 from './assets/photos/jericho-1.jpg';
import IMG_JERICHO2 from './assets/photos/jericho-2.jpg';
import IMG_JERICHO3 from './assets/photos/jericho-3.jpg';

export const PLAYS: Project[] = [
  {
    id: 'dac-lo',
    title: 'Đắc Lộ',
    description: 'Dự án ca kịch sắp ra mắt của Nhóm Ca Kịch Công Giáo Sài Gòn.',
    content: 'Thông tin chi tiết về vở diễn "Đắc Lộ" sẽ được cập nhật sớm nhất. Vui lòng theo dõi fanpage và website của nhóm để không bỏ lỡ những thông tin mới nhất về dự án này.',
    imageUrl: IMG_FEATURE,
    status: 'upcoming',
    date: '2027'
  },
  {
    id: 'jericho',
    title: 'BỨC TƯỜNG JERICO',
    description: 'Vở ca kịch kể về câu chuyện hùng vĩ trong Kinh Thánh về sự sụp đổ của thành Jericho.',
    content: 'Vở ca kịch "Bức tường Jericho" là một trong những dự án tâm huyết nhất của nhóm trong năm nay. Vở diễn tái hiện lại hành trình đức tin của dân Israel dưới sự dẫn dắt của Joshua. Với âm nhạc hào hùng và những màn vũ đạo công phu, chúng tôi hy vọng sẽ mang đến cho khán giả một trải nghiệm tâm linh sâu sắc về sức mạnh của sự vâng phục và lòng tin vào Thiên Chúa.',
    imageUrl: IMG_JERICHO1,
    images: [
      IMG_JERICHO1,
      IMG_JERICHO2,
      IMG_JERICHO3
    ],
    status: 'archived',
    date: '2024'
  },
  {
    id: 'don-bosco',
    title: 'DON BOSCO',
    description: 'Vở diễn chính thức đầu tiên của Nhóm Ca Kịch Công Giáo Sài Gòn.',
    content: 'Vở Don Bosco là vở diễn chính thức đầu tiên của Nhóm Ca Kịch Công Giáo Sài Gòn.',
    imageUrl: 'https://picsum.photos/seed/donbosco/800/600',
    images: [
      'https://picsum.photos/seed/tet1/800/600',
      'https://picsum.photos/seed/tet2/800/600',
      'https://picsum.photos/seed/tet3/800/600'
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=placeholder1',
    status: 'archived',
    date: 'Thành lập'
  },
  {
    id: 'ten-tu-tu',
    title: 'TÊN TỬ TÙ',
    description: 'Vở ca kịch về sự hối cải, biểu diễn lần đầu vào năm 2015.',
    content: 'Vở ca kịch Tên Tử Tù được biểu diễn lần đầu vào năm 2015, trong chương trình Cafe Thánh ca số 3, Giới trẻ Giáo xứ Tân Hương. Sau đó là Giáo xứ Thanh Đa và Giáo xứ Mân Côi (Đa Minh).',
    imageUrl: 'https://picsum.photos/seed/tentutu/800/600',
    images: [
      'https://picsum.photos/seed/tentutu1/800/600',
      'https://picsum.photos/seed/tentutu2/800/600'
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=placeholder2',
    status: 'archived',
    date: '2015'
  },
  {
    id: '10-co-trinh-nu',
    title: '10 CÔ TRINH NỮ',
    description: 'Vở diễn về dụ ngôn 10 cô trinh nữ, công diễn năm 2015 và 2019.',
    content: 'Vở diễn 10 Cô Trinh Nữ được công diễn vào năm 2015. Sau đó, nhóm tiếp tục công diễn vở ca kịch vào năm 2019.',
    imageUrl: 'https://picsum.photos/seed/10virgins/800/600',
    images: [
      'https://picsum.photos/seed/10virgins1/800/600',
      'https://picsum.photos/seed/10virgins2/800/600',
      'https://picsum.photos/seed/10virgins3/800/600'
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=placeholder3',
    status: 'archived',
    date: '2015 - 2019'
  },
  {
    id: 'khi-long-da-tin',
    title: 'KHI LÒNG ĐÃ TIN',
    description: 'Vở diễn gây quỹ cho người dân Miền Trung năm 2016.',
    content: 'Khi lòng đã Tin - được thực hiện nhằm gây Quỹ cho người dân Miền Trung vào năm 2016 tại Dòng Chúa Cứu Thế - Nhà thờ Kỳ Đồng. Sân khấu của vở được dàn dựng khá đặc biệt, tái hiện lại quang cảnh của một vùng quê nghèo nơi đó có những con người vẫn luôn đặt niềm tin nơi Thiên Chúa.',
    imageUrl: 'https://picsum.photos/seed/faith/800/600',
    images: [
      'https://picsum.photos/seed/tet1/800/600',
      'https://picsum.photos/seed/tet2/800/600',
      'https://picsum.photos/seed/tet3/800/600'
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=placeholder4',
    status: 'archived',
    date: '2016'
  },
  {
    id: 'buc-linh-anh',
    title: 'BỨC LINH ẢNH BỊ ĐÁNH CẮP',
    description: 'Công diễn lần đầu vào năm 2015 tại Nhà Thờ Kỳ Đồng.',
    content: 'Vở diễn Bức Linh Ảnh Bị Đánh Cắp được công diễn lần đầu vào 10/2015 & 12/2015 tại Dòng Chúa Cứu Thế - Nhà Thờ Kỳ Đồng. Sau đó, nhóm tiếp tục công diễn vở ca kịch vào năm 2017 tại Phú Dòng - Gia Kiệm.',
    imageUrl: 'https://picsum.photos/seed/icon/800/600',
    images: [
      'https://picsum.photos/seed/tet1/800/600',
      'https://picsum.photos/seed/tet2/800/600',
      'https://picsum.photos/seed/tet3/800/600'
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=placeholder5',
    status: 'archived',
    date: '2015 - 2017'
  },
  {
    id: 'hai-nhi-la-ai',
    title: 'HÀI NHI LÀ AI',
    description: 'Vở ca kịch Giáng Sinh công diễn năm 2016 và 2017.',
    content: 'Vở ca kịch Hài Nhi Là Ai được công diễn vào năm 2016 tại Hội trường Anphong, nhà thờ Kỳ Đồng, Giáo xứ Đức Mẹ Hằng Cứu Giúp. Năm 2017, Nhóm đã tái diễn vớ ca kịch này tại Giáo Xứ Tam Hải và Đại Hội Giới trẻ FMA.',
    imageUrl: 'https://picsum.photos/seed/child/800/600',
    images: [
      'https://picsum.photos/seed/tet1/800/600',
      'https://picsum.photos/seed/tet2/800/600',
      'https://picsum.photos/seed/tet3/800/600'
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=placeholder6',
    status: 'archived',
    date: '2016 - 2017'
  },
  {
    id: 'hoang-tu-nho',
    title: 'HOÀNG TỬ NHỎ',
    description: 'Vở diễn mừng Giáng Sinh tại Nhà Thờ Kỳ Đồng năm 2016.',
    content: 'Vở Hoàng Tử Nhỏ được công diễn tại Nhà Thờ Kỳ Đồng - Giáo Xứ Đức Mẹ Hằng Cứu Giúp vào năm 2016 - trong khuôn khổ chương trình văn nghệ mừng Giáng Sinh của giáo xứ',
    imageUrl: 'https://picsum.photos/seed/prince/800/600',
    images: [
      'https://picsum.photos/seed/tet1/800/600',
      'https://picsum.photos/seed/tet2/800/600',
      'https://picsum.photos/seed/tet3/800/600'
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=placeholder7',
    status: 'archived',
    date: '2016'
  },
  {
    id: 'con-chien-khong-moi',
    title: 'CON CHIÊN KHÔNG MỎI',
    description: 'Vở ca kịch đánh dấu mốc quan trọng 10 năm hành trình của nhóm.',
    content: 'Vở Con Chiên Không Mỏi được công diễn 2 lần vào năm 2023 tại Nhà thờ Kỳ Đồng - Giáo xứ Đức Mẹ Hằng Cứu Giúp - thuộc DCCT Sài Gòn; và tại Dòng Đức Bà Truyền Giáo. Vở ca kịch tái hiện lịch sử cứu độ và cuộc thương khó của Chúa Giê-su. Đây là vở ca kịch mà nhóm đã ấp ủ từ ngày thành lập, cũng là vở diễn tạo nên dấu mốc quan trọng trong hành trình 10 năm của Nhóm Ca Kịch - Đó là sự tái hợp và quay trở lại chính thức của Nhóm.',
    imageUrl: IMG_STAGE,
    images: [
      'https://picsum.photos/seed/sheep1/800/600',
      'https://picsum.photos/seed/sheep2/800/600',
      'https://picsum.photos/seed/sheep3/800/600',
      'https://picsum.photos/seed/sheep4/800/600'
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=placeholder8',
    status: 'archived',
    date: '2023'
  },
  {
    id: 'mot-tinh-yeu',
    title: 'MỘT TÌNH YÊU',
    description: 'Trình diễn tại Đại Hội Giới Trẻ TGP Sài Gòn năm 2023.',
    content: '“Một Tình Yêu” được trình diễn trong Đại Hội Giới Trẻ của Tổng Giáo Phận Sài Gòn vào ngày 25.11.2023 tại Trung Tâm Mục Vụ, Tổng Giáo Phận Sài Gòn. Ngoài ra, nhóm đã công diễn lần thứ 2 vở ca kịch này tại Tu Viện Dòng Tên. “Một Tình Yêu” đã để lại nhiều ấn tượng và cảm xúc khác nhau nơi các tham dự viên. Dựa trên suy niệm về chặng đàng thánh giá của Đại Hội Giới Trẻ thế giới tại Lisbon 2023, đạo diễn Jean Kiệt cùng với các thành viên trong Nhóm đã tái hiện lại chặng đàng thánh giá trên hành trình cuộc đời mà người trẻ đang phải đối diện.',
    imageUrl: IMG_DUO,
    images: [
      'https://picsum.photos/seed/tet1/800/600',
      'https://picsum.photos/seed/tet2/800/600',
      'https://picsum.photos/seed/tet3/800/600'
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=placeholder9',
    status: 'archived',
    date: '2023'
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
