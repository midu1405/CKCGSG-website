import { useState, useEffect, type ReactNode } from 'react';
import { motion } from 'motion/react';
import {
  Calendar, MapPin, Clock, ArrowLeft, BookOpen, Church, Users, Flame, Mail, Phone, User,
  Music, Shirt, Lightbulb, ScrollText, Theater, Camera, Building2, HandHeart,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import CastingSection from '../components/CastingSection';
import { CountUp, DrawnTimeline, TimelineItem, staggerParent, staggerChild } from '../components/Motion';
import IMG_COVER from '../assets/photos/daclo-cover.jpg';
import IMG_PORTRAIT from '../assets/photos/daclo-portrait-2.jpg';
import IMG_ENGRAVING from '../assets/photos/daclo-engraving.jpg';
import IMG_TTMV from '../assets/photos/ttmv-stage.jpg';
import IMG_AUDIENCE from '../assets/photos/audience.jpg';
import IMG_CURTAIN from '../assets/photos/curtain-call.jpg';

/* Nội dung lấy từ "CKCGSG – Proposal Đắc Lộ 2027". Thông tin công diễn là dự kiến. */
const PREMIERE = new Date('2027-06-04T00:00:00+07:00');

const MESSAGES = [
  { icon: BookOpen, title: 'Nhắc nhớ sự hình thành chữ Quốc Ngữ', desc: 'Làm nổi bật vai trò của các cha Dòng Tên trong việc học hỏi, hệ thống hóa tiếng Việt và đặt nền móng cho chữ Quốc Ngữ.' },
  { icon: Church, title: 'Khai sinh giáo đoàn Đàng Ngoài (1627)', desc: 'Tái hiện dấu mốc Cha Đắc Lộ đặt nền tảng cho cộng đoàn tín hữu tại Đàng Ngoài – sự kiện trung tâm của chương trình kỷ niệm 400 năm.' },
  { icon: Users, title: 'Gợi nhớ Hội Thầy Giảng', desc: 'Hội Thầy Giảng – tiền thân của đời sống thánh hiến bản địa, cho thấy vai trò quan trọng của người Việt trong công cuộc xây dựng Giáo Hội.' },
  { icon: Flame, title: 'Tinh thần sống đạo kiên trung', desc: 'Liên kết hành trình truyền giáo với chứng tá tử đạo của chân phước Anrê Phú Yên – hạt giống đức tin sinh hoa trái nơi chính người con đất Việt.' },
];

const TIMELINE = [
  { year: '1593', text: 'Sinh ngày 15/03 tại Avignon, miền Nam nước Pháp.' },
  { year: '1612', text: 'Gia nhập Dòng Tên tại Rome.' },
  { year: '1624 – 1626', text: 'Truyền giáo tại Đàng Trong.' },
  { year: '1627 – 1630', text: 'Đến Đàng Ngoài, đặt nền móng cho cộng đoàn tín hữu.' },
  { year: '1640 – 1645', text: 'Nhiều lần trở lại Đàng Trong; bị trục xuất nhiều lần nhưng vẫn tìm cách trở lại.' },
  { year: '1651', text: 'Xuất bản "Dictionarium Annamiticum Lusitanum et Latinum" (Từ điển Việt – Bồ – La) tại Rome, khoảng 8.000 mục từ.' },
  { year: '1660', text: 'Qua đời ngày 05/11.' },
];

const STATS = [
  { value: '130+', label: 'Diễn viên' },
  { value: '30+', label: 'Nhân sự hậu đài' },
  { value: '6.000 – 7.000', label: 'Khán giả trực tiếp' },
  { value: '10.000+', label: 'Người theo dõi (trực tiếp & trực tuyến)' },
];

const PRODUCTION = [
  { icon: ScrollText, title: 'Kịch bản', desc: 'Mở rộng góc nhìn: không chỉ hành trình cá nhân của Cha Đắc Lộ, mà nhấn mạnh di sản lịch sử và đức tin ngài để lại cho Giáo Hội và dân tộc Việt Nam.' },
  { icon: Theater, title: 'Diễn viên', desc: 'Khoảng 130+ diễn viên và 30+ nhân sự hậu đài, kết hợp diễn xuất, hợp xướng và vũ đạo.' },
  { icon: Shirt, title: 'Phục trang & sân khấu', desc: 'Tái hiện bối cảnh thế kỷ XVII, chuyển cảnh linh hoạt theo mạch thời gian Đàng Trong – Đàng Ngoài.' },
  { icon: Music, title: 'Âm nhạc', desc: 'Lời Việt viết lại trên các tác phẩm có sẵn, dàn dựng phù hợp với nội dung lịch sử – mục vụ.' },
  { icon: Lightbulb, title: 'Âm thanh – ánh sáng', desc: 'Hệ thống chuyên nghiệp, bảo đảm chất lượng nghệ thuật và hiệu quả trình diễn.' },
];

const COLLAB = [
  { icon: Camera, title: 'Chuyên môn', items: ['Livestream, quay phim, chụp hình', 'Truyền thông – lan tỏa trước, trong và sau chương trình', 'Thu âm – phòng thu – sản xuất âm nhạc', 'Biên đạo múa, dàn dựng chuyển động sân khấu', 'May phục trang theo thiết kế của ekip'] },
  { icon: Building2, title: 'Địa điểm – cơ sở', items: ['Địa điểm tập hát, tập diễn, tập múa', 'Không gian thực hiện và gia công đạo cụ', 'Nơi lưu trữ đạo cụ – phục trang', 'Địa điểm tổng duyệt và chạy vở (tại Trung tâm Mục vụ)'] },
  { icon: HandHeart, title: 'Đóng góp – tài trợ', items: ['Trang phục (thuê, thiết kế, may, tài trợ vải / công may)', 'Cảnh trí, đạo cụ – thiết kế và thi công', 'Vận chuyển', 'Suất ăn, nước uống cho diễn viên trong các buổi tập', 'Âm thanh, ánh sáng, màn hình LED'] },
];

function useCountdown(target: Date) {
  const calc = () => {
    const d = Math.max(0, target.getTime() - Date.now());
    return {
      days: Math.floor(d / 86_400_000),
      hours: Math.floor((d % 86_400_000) / 3_600_000),
      minutes: Math.floor((d % 3_600_000) / 60_000),
      seconds: Math.floor((d % 60_000) / 1000),
    };
  };
  const [left, setLeft] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setLeft(calc()), 1000);
    return () => clearInterval(id);
  }, [target]);
  return left;
}

function Eyebrow({ children, center = false }: { children: ReactNode; center?: boolean }) {
  return (
    <div className={`flex items-center gap-3.5 mb-5 ${center ? 'justify-center' : ''}`}>
      <span className="w-9 h-px bg-gold" />
      <span className="text-gold uppercase tracking-[0.25em] text-xs font-bold">{children}</span>
      {center && <span className="w-9 h-px bg-gold" />}
    </div>
  );
}

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export default function DacLoPage() {
  const t = useCountdown(PREMIERE);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!email) return;
    // TODO: kết nối EmailJS hoặc Google Sheets
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen">

      {/* 1 — HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={IMG_COVER} alt="Chân dung Cha Đắc Lộ trên sân khấu"
            className="w-full h-full object-cover object-left opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/70 via-dark/60 to-dark lg:bg-gradient-to-l lg:from-dark lg:via-dark/80 lg:to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-32 pb-20 flex lg:justify-end">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="w-full lg:max-w-xl text-center lg:text-left">
            <span className="text-gold uppercase tracking-[0.3em] text-xs font-bold mb-5 block">
              Kỷ niệm 400 năm Cha Đắc Lộ đến Đàng Ngoài · 1627 – 2027
            </span>
            <h1 className="text-7xl md:text-9xl font-bold serif mb-6 leading-none">Đắc Lộ</h1>
            <p className="text-white/70 text-lg md:text-xl font-light leading-relaxed mb-8">
              Vở nhạc kịch của Nhóm Ca Kịch Công Giáo Sài Gòn — câu chuyện về sự dấn thân, hội nhập và trao truyền,
              từ hành trình truyền giáo thế kỷ XVII đến hôm nay.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-3 text-sm text-white/70 mb-10">
              <span className="flex items-center gap-2"><Calendar size={16} className="text-gold" /> 04.06.2027</span>
              <span className="flex items-center gap-2"><MapPin size={16} className="text-gold" /> Trung Tâm Mục Vụ TGP Sài Gòn</span>
              <span className="flex items-center gap-2"><Clock size={16} className="text-gold" /> Khoảng 1 giờ 45 phút</span>
            </div>

            <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-md mx-auto lg:mx-0 mb-10">
              {[['Ngày', t.days], ['Giờ', t.hours], ['Phút', t.minutes], ['Giây', t.seconds]].map(([label, value]) => (
                <div key={label} className="bg-white/5 border border-white/10 rounded-2xl py-3 text-center backdrop-blur-sm">
                  <div className="text-2xl sm:text-4xl font-bold serif text-gold">{String(value).padStart(2, '0')}</div>
                  <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <a href="#cong-tac" className="bg-gold text-black px-8 py-4 rounded-full font-bold hover:bg-white transition-all text-center">
                ĐỒNG HÀNH CÙNG DỰ ÁN
              </a>
              <a href="#nhan-tin" className="border border-white/25 px-8 py-4 rounded-full font-bold hover:border-gold hover:text-gold transition-all text-center">
                NHẬN THÔNG BÁO
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2 — CỘT MỐC 400 NĂM */}
      <section id="cot-moc" className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div {...fadeUp}>
            <Eyebrow>Cột mốc 400 năm</Eyebrow>
            <h2 className="text-4xl md:text-5xl font-bold serif leading-tight mb-6 text-balance">
              Một hạt giống được gieo xuống, bốn thế kỷ sau vẫn sinh hoa kết trái
            </h2>
            <div className="space-y-5 text-white/60 text-lg font-light leading-relaxed">
              <p>
                Kỷ niệm 400 năm Cha Đắc Lộ đặt chân đến Đàng Ngoài không chỉ là dịp nhìn lại một biến cố lịch sử, nhưng còn là
                cơ hội suy tư về một di sản vẫn đang tiếp tục sinh hoa trái trong đời sống đức tin và văn hóa Việt Nam hôm nay.
              </p>
              <p>
                Vở diễn được thực hiện như một phần của chương trình kỷ niệm chung, với lời nhắn nhủ: những hạt giống được gieo
                trong âm thầm và thử thách có thể tạo nên những chuyển biến vượt xa một đời người.
              </p>
            </div>
          </motion.div>
          <motion.div {...fadeUp} className="relative">
            <div className="rounded-3xl overflow-hidden border border-white/10">
              <img src={IMG_ENGRAVING} alt="Tranh khắc về hoạt động truyền giáo thế kỷ XVII" className="w-full h-auto grayscale" loading="lazy" />
            </div>
            <blockquote className="lg:absolute lg:-bottom-10 lg:-left-10 mt-6 lg:mt-0 bg-gold text-black p-7 rounded-2xl max-w-sm shadow-2xl">
              <p className="serif italic text-xl leading-snug mb-3">
                “Nếu hạt lúa gieo vào lòng đất mà không chết đi, nó vẫn trơ trọi một mình; nhưng nếu chết đi, nó mới sinh được nhiều hạt khác.”
              </p>
              <cite className="not-italic text-xs font-bold uppercase tracking-[0.15em]">Ga 12,24</cite>
            </blockquote>
          </motion.div>
        </div>
      </section>

      {/* 3 — Ý TƯỞNG & THÔNG ĐIỆP */}
      <section id="thong-diep" className="py-20 md:py-32 bg-card/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center mb-14">
            <Eyebrow center>Ý tưởng chủ đạo</Eyebrow>
            <h2 className="text-4xl md:text-5xl font-bold serif leading-tight mb-6 text-balance">Bốn thông điệp của vở diễn</h2>
            <p className="text-white/60 text-lg font-light leading-relaxed">
              Không chỉ khắc họa chân dung một nhà truyền giáo, vở diễn làm nổi bật những biến cố, thành quả và ảnh hưởng lâu dài
              mà Cha Đắc Lộ cùng các cha Dòng Tên đã để lại cho Giáo Hội và xã hội Việt Nam.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {MESSAGES.map((m, i) => (
              <motion.div key={m.title} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.08 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-7">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold"><m.icon size={24} /></div>
                  <span className="serif text-4xl text-white/15 font-bold">0{i + 1}</span>
                </div>
                <h3 className="serif text-xl font-bold mb-3 text-balance">{m.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 — CHA ĐẮC LỘ */}
      <section id="cha-dac-lo" className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20">
          <motion.div {...fadeUp}>
            <Eyebrow>Sơ nét về Cha Đắc Lộ</Eyebrow>
            <h2 className="text-4xl md:text-5xl font-bold serif leading-tight mb-8">Alexandre de Rhodes</h2>
            <div className="flex gap-6 items-start mb-8">
              <img src={IMG_PORTRAIT} alt="Chân dung Cha Alexandre de Rhodes" loading="lazy"
                className="w-32 sm:w-40 rounded-2xl border border-white/10 shrink-0" />
              <dl className="text-sm space-y-3">
                {[['Tên Việt Nam', 'Cha Đắc Lộ'], ['Dòng tu', 'Dòng Tên (Society of Jesus)'], ['Quê quán', 'Avignon, miền Nam nước Pháp'], ['Năm sinh – mất', '1593 – 1660']].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-white/40 uppercase tracking-widest text-[10px] font-bold">{k}</dt>
                    <dd className="text-white/85">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <p className="text-white/60 font-light leading-relaxed">
              Nhân vật then chốt trong giai đoạn hình thành và phát triển chữ Quốc ngữ — hệ thống chữ viết tiếng Việt dùng ký tự
              Latinh. Ngài truyền giảng Tin Mừng khắp các vùng từ miền Trung ra Bắc và có được sự tin yêu của nhiều người Việt lúc bấy giờ.
            </p>
          </motion.div>

          <DrawnTimeline className="self-center">
            {TIMELINE.map(e => <TimelineItem key={e.year} year={e.year} text={e.text} />)}
          </DrawnTimeline>
        </div>
      </section>

      {/* 5 — KẾ HOẠCH CÔNG DIỄN */}
      <section id="cong-dien" className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMG_TTMV} alt="" className="w-full h-full object-cover opacity-25" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark/85 to-dark" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
            <Eyebrow center>Kế hoạch công diễn</Eyebrow>
            <h2 className="text-4xl md:text-5xl font-bold serif leading-tight text-balance">Hướng tới hơn 10.000 người tham dự</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
            {[
              { icon: Calendar, k: 'Thời gian', v: 'Ngày 04/06/2027', sub: 'Kỷ niệm 400 năm Cha Đắc Lộ đến Đàng Ngoài' },
              { icon: MapPin, k: 'Địa điểm (dự kiến)', v: 'Trung Tâm Mục Vụ – TGP Sài Gòn', sub: '6bis Tôn Đức Thắng, Bến Nghé, Quận 1, TP.HCM' },
              { icon: Clock, k: 'Thể loại · Thời lượng', v: 'Nhạc kịch · khoảng 1 giờ 45 phút', sub: 'Sân khấu quy mô lớn, có phát sóng trực tuyến' },
              { icon: User, k: 'Đạo diễn', v: 'Jean Kiệt', sub: 'Thực hiện: Nhóm Ca Kịch Công Giáo Sài Gòn' },
              { icon: Church, k: 'Ban tổ chức', v: 'Dòng Tên Việt Nam', sub: 'Một phần của chương trình kỷ niệm 400 năm' },
              { icon: Users, k: 'Dành cho', v: 'Mọi người', sub: 'Linh mục, tu sĩ, chủng sinh · giới trẻ, sinh viên Công giáo · người yêu lịch sử, văn hóa và chữ Quốc Ngữ' },
            ].map(c => (
              <motion.div key={c.k} {...fadeUp} className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-7 flex gap-5">
                <div className="w-11 h-11 bg-gold/10 rounded-xl flex items-center justify-center text-gold shrink-0"><c.icon size={22} /></div>
                <div>
                  <div className="text-white/40 uppercase tracking-widest text-[10px] font-bold mb-1">{c.k}</div>
                  <div className="text-lg font-bold serif mb-1">{c.v}</div>
                  <div className="text-white/50 text-sm leading-relaxed">{c.sub}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center border-t border-white/10 pt-12">
            {STATS.map(s => (
              <div key={s.label}>
                <div className="text-3xl md:text-5xl font-bold serif text-gold mb-2"><CountUp value={s.value} /></div>
                <div className="text-xs uppercase tracking-widest text-white/45 font-bold">{s.label}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-white/35 text-xs mt-8">Thông tin dự kiến, có thể thay đổi.</p>
        </div>
      </section>

      {/* 6 — QUY MÔ DÀN DỰNG */}
      <section id="dan-dung" className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div {...fadeUp} className="space-y-4 order-2 lg:order-1">
            <div className="rounded-3xl overflow-hidden border border-white/10 aspect-[4/3]">
              <img src={IMG_CURTAIN} alt="Các diễn viên CKCGSG chào khán giả" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="rounded-3xl overflow-hidden border border-white/10 aspect-[16/7]">
              <img src={IMG_AUDIENCE} alt="Khán giả tại một đêm diễn" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </motion.div>
          <motion.div {...fadeUp} className="order-1 lg:order-2">
            <Eyebrow>Quy mô dàn dựng</Eyebrow>
            <h2 className="text-4xl md:text-5xl font-bold serif leading-tight mb-10 text-balance">Sân khấu tái hiện thế kỷ XVII</h2>
            <motion.ol {...staggerParent} className="space-y-7">
              {PRODUCTION.map((p, i) => (
                <motion.li key={p.title} {...staggerChild} className="flex gap-5">
                  <div className="w-11 h-11 bg-gold/10 rounded-xl flex items-center justify-center text-gold shrink-0"><p.icon size={22} /></div>
                  <div>
                    <h3 className="font-bold serif text-xl mb-1"><span className="text-gold/60 mr-2">0{i + 1}.</span>{p.title}</h3>
                    <p className="text-white/55 leading-relaxed">{p.desc}</p>
                  </div>
                </motion.li>
              ))}
            </motion.ol>
          </motion.div>
        </div>
      </section>

      {/* 7 — LỜI MỜI CỘNG TÁC */}
      <section id="cong-tac" className="py-20 md:py-32 bg-card border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp} className="max-w-3xl mb-14">
            <Eyebrow>Lời mời gọi cộng tác</Eyebrow>
            <h2 className="text-4xl md:text-5xl font-bold serif leading-tight mb-6 text-balance">Cùng nhau thực hiện một chương trình xứng đáng với cột mốc 400 năm</h2>
            <p className="text-white/60 text-lg font-light leading-relaxed">
              “Đắc Lộ” không chỉ là dự án riêng của nhóm, mà là dự án chung của Dòng Tên, đòi hỏi sự đồng hành, cộng tác và nâng đỡ
              ở nhiều lĩnh vực. Dự án đang trong giai đoạn chuẩn bị và xây dựng kế hoạch tổng thể — rất mong được quý Cha, quý Tu sĩ,
              quý Cộng đoàn và các đơn vị cùng trao đổi, góp ý và đồng hành.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5 mb-12">
            {COLLAB.map(c => (
              <motion.div key={c.title} {...fadeUp} className="bg-white/5 border border-white/10 rounded-3xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold"><c.icon size={24} /></div>
                  <h3 className="text-2xl font-bold serif">{c.title}</h3>
                </div>
                <motion.ul {...staggerParent} className="space-y-3">
                  {c.items.map(it => (
                    <motion.li key={it} {...staggerChild} className="flex gap-3 text-white/65 leading-relaxed text-[15px]">
                      <span className="text-gold mt-1.5 w-1.5 h-1.5 rounded-full bg-gold shrink-0" />{it}
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp} className="bg-gold text-black rounded-3xl p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <div className="uppercase tracking-[0.2em] text-xs font-bold mb-2">Liên hệ cộng tác</div>
              <div className="serif text-xl md:text-2xl font-bold mb-1">Teresa Nguyễn Lan Nghi</div>
              <div className="text-black/70">Đại diện phụ trách dự án</div>
              <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 font-bold">
                <a href="tel:0908033357" className="hover:underline">0908 033 357</a>
                <a href="mailto:ckcgsg@gmail.com" className="hover:underline">ckcgsg@gmail.com</a>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a href="tel:0908033357"
                className="inline-flex items-center justify-center gap-3 border-2 border-black px-7 py-3.5 rounded-full font-bold hover:bg-black hover:text-white transition-all">
                <Phone size={18} /> GỌI ĐIỆN
              </a>
              <a href={`mailto:ckcgsg@gmail.com?subject=${encodeURIComponent('[ĐẮC LỘ 2027] Cộng tác dự án')}`}
                className="inline-flex items-center justify-center gap-3 bg-black text-white px-7 py-3.5 rounded-full font-bold hover:bg-dark/80 transition-all">
                <Mail size={18} /> GỬI EMAIL
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 8 — NHẬN THÔNG BÁO */}
      <section id="nhan-tin" className="py-20 md:py-28">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <Eyebrow center>Đừng bỏ lỡ</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-bold serif mb-4 text-balance">Nhận thông báo về vở diễn Đắc Lộ</h2>
          <p className="text-white/50 mb-8">Lịch diễn chính thức, hành trình tập luyện và các thông tin mới nhất sẽ được gửi qua email.</p>
          {!submitted ? (
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email của bạn..."
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-3 focus:border-gold outline-none transition-colors text-sm" />
              <button onClick={handleSubmit}
                className="bg-gold text-black px-8 py-3 rounded-full font-bold text-sm hover:bg-white transition-all whitespace-nowrap">
                THÔNG BÁO TÔI
              </button>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto bg-gold/10 border border-gold/30 rounded-2xl p-6">
              <div className="text-gold font-bold mb-1">Đã đăng ký thành công! 🎭</div>
              <div className="text-white/50 text-sm">Chúng tôi sẽ thông báo ngay khi có tin mới về vở Đắc Lộ.</div>
            </motion.div>
          )}
        </div>
      </section>

      {/* 9 — TUYỂN DIỄN VIÊN */}
      <CastingSection id="casting-daclo" />

      {/* Quay về */}
      <section className="py-16 text-center">
        <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-gold transition-colors text-sm uppercase tracking-widest font-bold">
          <ArrowLeft size={16} /> Quay về trang chủ
        </Link>
      </section>
    </div>
  );
}
