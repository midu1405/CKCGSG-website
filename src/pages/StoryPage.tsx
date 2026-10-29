import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { PageHeader, Eyebrow, fadeUp } from '../components/PageParts';
import { GrowLine } from '../components/Motion';
import HEADER_IMG from '../assets/photos/value-gia-dinh.jpg';
import IMG_10_NAM from '../assets/photos/story-10-nam.jpg';
import IMG_STAGE from '../assets/photos/value-san-khau.jpg';
import IMG_PRAYER from '../assets/photos/value-cau-nguyen.jpg';
import IMG_MASS from '../assets/photos/value-thanh-le.jpg';
import IMG_FAMILY from '../assets/photos/value-gia-dinh.jpg';
import IMG_MISSION from '../assets/photos/mission.jpg';

/* Nội dung lấy từ phần "Đôi nét về CKCGSG" trong proposal Đắc Lộ 2027 và dữ liệu vở diễn. */
const TIMELINE = [
  { when: '05.2014', title: 'Thành lập', text: 'Anh Jean Kiệt thành lập nhóm với 33 thành viên, gồm cả người Công giáo và không Công giáo.' },
  { when: '04.2015', title: 'Vở diễn chính thức đầu tiên', text: '"Don Bosco" — mở đầu chuỗi vở ca kịch tại nhiều giáo xứ, dòng tu trong những năm tiếp theo.' },
  { when: '11.2016', title: 'Sân khấu cho miền Trung', text: '"Khi Lòng Đã Tin" được thực hiện để gây quỹ cho người dân miền Trung.' },
  { when: '04.2023', title: 'Tái hợp', text: '"Con Chiên Không Mỏi" — vở diễn nhóm ấp ủ từ ngày thành lập, đánh dấu sự quay trở lại chính thức.' },
  { when: '2024', title: '10 năm hành trình', text: 'Hơn 120 thành viên trên khắp Việt Nam; "Bức Tường Jericho" tại Đại hội Giới trẻ TGP Sài Gòn.' },
  { when: '06.2027', title: 'Đắc Lộ', text: 'Vở nhạc kịch kỷ niệm 400 năm Cha Đắc Lộ đến Đàng Ngoài, cùng Dòng Tên Việt Nam.' },
];

const VALUES = [
  { img: IMG_STAGE, title: 'Tự nguyện, không bán vé', text: 'Đến với nhau trong tinh thần tự nguyện: những buổi biểu diễn không bán vé, không trả lương cho diễn viên.' },
  { img: IMG_FAMILY, title: 'Cùng tôn trọng, cùng sáng tạo', text: 'Các thành viên từ nhiều tôn giáo cùng tôn trọng, cùng cầu nguyện, cùng sáng tạo.' },
  { img: IMG_PRAYER, title: 'Khởi sự trong Thiên Chúa', text: 'Mỗi dự án, mỗi lần gặp gỡ, mỗi buổi tập luyện đều bắt đầu bằng lời cầu nguyện dâng Thiên Chúa.' },
  { img: IMG_MASS, title: 'Đồng hành đức tin', text: 'Thánh lễ nhóm hằng tháng, những buổi đồng hành đức tin và trau dồi kỹ năng phục vụ cho nhóm.' },
];

export default function StoryPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Câu chuyện của chúng tôi"
        title={<>Bắt đầu từ 33 trái tim,<br />nay là một gia đình 120+.</>}
        image={HEADER_IMG}
      />

      {/* Đôi nét */}
      <section className="max-w-7xl mx-auto px-6 pb-24 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <motion.div {...fadeUp} className="space-y-6 text-white/65 text-lg font-light leading-relaxed">
          <p>
            Tập thể Ca Kịch Công Giáo Sài Gòn (CKCGSG) đã hình thành và phát triển hơn 10 năm, quy tụ các thế hệ thành viên trên khắp Việt Nam.
            Nhóm được thành lập vào tháng 5 năm 2014 bởi anh Jean Kiệt, bắt đầu với 33 thành viên bao gồm cả người Công giáo và không Công giáo.
          </p>
          <p>
            Điều đặc biệt của nhóm là các buổi diễn hoàn toàn miễn phí, không bán vé và không có cát-xê. Tất cả thành viên đều tham gia trên
            tinh thần tự nguyện và cống hiến, với mong muốn mang đến niềm vui và cảm hứng cho cộng đồng.
          </p>
          <p>
            Bước sang cột mốc 10 năm, nhóm đã có hơn 120 thành viên — những con người nhiệt thành, yêu nghệ thuật và cùng chia sẻ niềm tin vào sứ mệnh của nhóm.
            Trong mỗi vở diễn, mỗi lời ca đều là tâm huyết và tình cảm chân thành của từng người.
          </p>
        </motion.div>
        <motion.div {...fadeUp} className="rounded-3xl overflow-hidden border border-white/10 aspect-square">
          <img src={IMG_10_NAM} alt="Chương trình Nhìn lại 10 năm của CKCGSG" className="w-full h-full object-cover" loading="lazy" />
        </motion.div>
      </section>

      {/* Dòng thời gian */}
      <section className="py-20 md:py-28 bg-card/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp} className="mb-14">
            <Eyebrow>Hành trình</Eyebrow>
            <h2 className="text-4xl md:text-5xl font-bold serif">Những cột mốc</h2>
          </motion.div>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
            {TIMELINE.map((t, i) => (
              <motion.li key={t.when} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.15 }}>
                <GrowLine delay={(i % 3) * 0.15 + 0.1} />
                <div className="text-gold serif text-3xl font-bold mb-2">{t.when}</div>
                <h3 className="text-xl font-bold serif mb-2">{t.title}</h3>
                <p className="text-white/55 leading-relaxed">{t.text}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* Giá trị */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp} className="max-w-2xl mb-14">
            <Eyebrow>Cách chúng tôi sống cùng nhau</Eyebrow>
            <h2 className="text-4xl md:text-5xl font-bold serif leading-tight">Một gia đình trong đức tin</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-6">
            {VALUES.map(v => (
              <motion.div key={v.title} {...fadeUp} className="bg-card border border-white/8 rounded-3xl overflow-hidden">
                <div className="aspect-[16/9] overflow-hidden"><img src={v.img} alt="" className="w-full h-full object-cover" loading="lazy" /></div>
                <div className="p-7">
                  <h3 className="serif text-2xl font-bold mb-2">{v.title}</h3>
                  <p className="text-white/55 leading-relaxed">{v.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sứ mệnh */}
      <section className="relative py-24 md:py-36 overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMG_MISSION} alt="" className="w-full h-full object-cover opacity-30" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark/75 to-dark" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div {...fadeUp}>
            <Eyebrow center>Thông điệp & sứ mệnh</Eyebrow>
            <h2 className="text-4xl md:text-5xl font-bold serif mb-10">Nhóm ra đời với mong muốn</h2>
            <div className="grid md:grid-cols-3 gap-5 mb-14 text-left">
              {['Đem Chúa đến gần mọi người hơn', 'Sinh động hoá Kinh Thánh qua hình thức nghệ thuật', 'Người trẻ cùng nhau sống đam mê và lan tỏa Tin Mừng'].map((m, i) => (
                <div key={m} className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <div className="serif text-gold text-3xl font-bold mb-2">0{i + 1}</div>
                  <p className="text-white/80 text-lg leading-snug">{m}</p>
                </div>
              ))}
            </div>
            <blockquote className="serif italic text-xl md:text-2xl text-white/80 leading-relaxed mb-4">
              “Anh em là ánh sáng cho trần gian… ánh sáng của anh em phải chiếu giãi trước mặt thiên hạ, để họ thấy những công việc tốt đẹp
              anh em làm mà tôn vinh Cha anh em trên trời.”
            </blockquote>
            <cite className="not-italic text-gold text-xs font-bold uppercase tracking-[0.2em]">Mt 5,14–16</cite>
          </motion.div>
        </div>
      </section>

      {/* Tiếp theo */}
      <section className="py-20 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold serif mb-8">Cùng viết tiếp câu chuyện</h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/vo-dien" className="bg-gold text-black px-8 py-4 rounded-full font-bold hover:bg-white transition-all">XEM CÁC VỞ DIỄN</Link>
            <Link to="/tuyen-dien-vien" className="border border-white/25 px-8 py-4 rounded-full font-bold hover:border-gold hover:text-gold transition-all">THAM GIA CÙNG NHÓM</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
