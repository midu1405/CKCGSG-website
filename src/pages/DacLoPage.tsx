import { useState, useEffect, useRef, type ReactNode } from 'react';
import { motion } from 'motion/react';
import {
  Calendar, MapPin, Clock, ArrowLeft, BookOpen, Church, Users, Flame, Mail, Phone,
  Camera, Building2, HandHeart, Map as MapIcon, Star, Send,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { CountUp } from '../components/Motion';
import IMG_PORTRAIT from '../assets/photos/daclo-portrait-2.jpg';
import IMG_SEED from '../assets/photos/stage-wide.jpg';
import IMG_HERO_BG from '../assets/photos/daclo-hero-bg.jpg';
import IMG_BOAT from '../assets/photos/hat-giong-thuyen.webp';
import IMG_STAGE from '../assets/photos/jericho-stage.jpg';
import IMG_M1 from '../assets/photos/jericho-3.jpg';
import IMG_M2 from '../assets/photos/hero.jpg';
import IMG_M3 from '../assets/photos/jericho-1.jpg';
import IMG_M4 from '../assets/photos/poster-khi-long-da-tin.jpg';
import IMG_M5 from '../assets/photos/story.jpg';

/*
 * Trang Đắc Lộ — theo Figma "Trang Đắc Lộ - Desktop (Kêu gọi hỗ trợ) - Draft 3".
 * Bảng màu: kem #f6ebd8 · thẻ #e8d7c2 · đỏ rượu #8b1a1a · nâu tiêu đề #5a3a2d · chữ #6f5a4a · vàng #e8c89a · nâu tối #381c1b.
 * Thông tin công diễn là dự kiến.
 */
const PREMIERE = new Date('2027-06-04T00:00:00+07:00');

const C = {
  cream: '#f6ebd8', card: '#e8d7c2', line: '#cdbe9f', icon: '#d9c2a5',
  wine: '#8b1a1a', head: '#5a3a2d', body: '#6f5a4a', gold: '#e8c89a', deep: '#381c1b',
};

const TIMELINE = [
  { year: '1593', text: 'Sinh ngày 15/03 tại Avignon, miền Nam nước Pháp.' },
  { year: '1612', text: 'Gia nhập Dòng Tên tại Rome.' },
  { year: '1624 – 1626', text: 'Truyền giáo tại Đàng Trong.' },
  { year: '1627 – 1630', text: 'Đến Đàng Ngoài, đặt nền móng cho Giáo hội tại Đàng Ngoài.' },
  { year: '1640 – 1645', text: 'Bị trục xuất nhiều lần nhưng vẫn tìm cách trở lại Đàng Trong.' },
  { year: '1651', text: 'Xuất bản “Dictionarium Annamiticum Lusitanum et Latinum” (Từ điển Việt – Bồ – Latinh) tại Rome, khoảng 8.000 mục từ.' },
  { year: '1660', text: 'Qua đời ngày 05/11.' },
];

const MESSAGES = [
  { icon: BookOpen, top: 'Hình thành', title: 'Chữ Quốc Ngữ', desc: 'Làm nổi bật vai trò của các cha Dòng Tên trong việc học hỏi, hệ thống hóa tiếng Việt và đặt nền móng cho chữ Quốc Ngữ.' },
  { icon: Church, top: 'Khai sinh', title: 'Giáo Đoàn Đàng Ngoài', desc: 'Năm 1627, Cha Đắc Lộ đã đặt nền tảng cho cộng đoàn tín hữu đầu tiên tại Đàng Ngoài, thắp lên ngọn lửa đức tin xuyên thế kỷ.' },
  { icon: Users, top: 'Gợi nhớ', title: 'Hội Thầy Giảng', desc: 'Tiền thân của đời sống thánh hiến bản địa – Hội Thầy Giảng, vai trò quan trọng của người Việt trong công cuộc xây dựng Giáo Hội.' },
  { icon: Flame, top: 'Khơi dậy tinh thần', title: 'Sống Đạo Kiên Trung', desc: 'Hành trình truyền giáo với chứng tá tử đạo – chân phước Anrê Phú Yên cho thấy hạt giống đức tin đã sinh hoa trái nơi chính người con đất Việt.' },
];

const STATS = [
  { value: '10.000+', label: 'Khán giả theo dõi', sub: 'Trực tiếp tại sân khấu & trực tuyến qua livestream' },
  { value: '200+', label: 'Phục trang biểu diễn', sub: 'Tái hiện bối cảnh lịch sử thế kỷ XVII' },
  { value: '130+', label: 'Diễn viên tham gia', sub: 'Kết hợp diễn xuất, vũ đạo & hợp xướng hoành tráng' },
  { value: '30+', label: 'Nhân sự hậu đài', sub: 'Phụ trách đạo cụ, cảnh trí, âm thanh, ánh sáng' },
  { value: '20+', label: 'Tác phẩm âm nhạc', sub: 'Được viết lại lời Việt và dàn dựng riêng theo kịch bản' },
];

const FIELDS = ['Chuyên môn', 'Địa điểm – Cơ sở', 'Tài trợ'] as const;
const COLLAB = [
  { icon: Camera, field: FIELDS[0], title: 'Hỗ trợ Chuyên môn', cta: 'Đăng ký cộng tác chuyên môn',
    items: ['Livestream, quay phim, chụp hình', 'Truyền thông trước, trong và sau chương trình', 'Phòng thu, sản xuất âm nhạc', 'Biên đạo múa, dàn dựng sân khấu', 'May phục trang theo thiết kế riêng'] },
  { icon: Building2, field: FIELDS[1], title: 'Hỗ trợ Địa điểm – Cơ sở', cta: 'Đề xuất địa điểm / cơ sở',
    items: ['Địa điểm tập hát, tập diễn, tập múa', 'Không gian gia công đạo cụ', 'Nơi lưu trữ đạo cụ – phục trang', 'Địa điểm tổng duyệt và chạy vở (tại Trung tâm Mục Vụ)'] },
  { icon: HandHeart, field: FIELDS[2], title: 'Đóng góp – tài trợ', cta: 'Trao đổi hạng mục tài trợ',
    items: ['Trang phục (thuê, thiết kế, may, tài trợ vải / công may)', 'Cảnh trí, đạo cụ (thiết kế, thi công)', 'Vận chuyển', 'Suất ăn, nước uống cho diễn viên trong các buổi tập', 'Âm thanh, ánh sáng, màn hình LED'] },
];

const PILLARS = [
  { tag: '2014 – 2027', title: 'Hơn 12 Năm Gắn Kết', desc: 'Một chặng đường âm thầm kiên trì, nơi các thế hệ người trẻ nâng đỡ nhau trong đức tin để phục vụ Giáo hội.' },
  { tag: 'Biểu diễn phi lợi nhuận', title: 'Sự Kiện Không Bán Vé', desc: 'Toàn bộ diễn viên tham gia trên tinh thần tự nguyện. Các buổi diễn miễn phí, không bán vé và không có cát xê.' },
  { tag: 'Sứ mạng', title: 'Loan Báo Tin Mừng', desc: 'Đưa Lời Chúa đến gần hơn với mọi người qua nghệ thuật ca kịch, nhóm hy vọng có thể lan tỏa tình yêu và đức tin đến mọi nơi.' },
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

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6 },
};

function Eyebrow({ children, center = false, light = false }: { children: ReactNode; center?: boolean; light?: boolean }) {
  const col = light ? C.gold : C.wine;
  return (
    <div className={`flex items-center gap-3 mb-4 ${center ? 'justify-center' : ''}`}>
      <span className="w-5 h-px" style={{ background: col }} />
      <span className="uppercase tracking-[0.22em] text-[11px] sm:text-xs font-bold" style={{ color: col }}>{children}</span>
      {center && <span className="w-5 h-px" style={{ background: col }} />}
    </div>
  );
}

const H2 = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <h2 className={`serif font-bold text-[2rem] sm:text-4xl lg:text-5xl leading-[1.15] text-balance ${className}`} style={{ color: C.head }}>{children}</h2>
);

const inputCls = 'w-full rounded-full px-5 py-3 text-sm outline-none border transition-colors focus:border-[#8b1a1a] placeholder:text-[#6f5a4a]/50';
const inputStyle = { background: C.cream, borderColor: C.line, color: C.head };

export default function DacLoPage() {
  const t = useCountdown(PREMIERE);
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState({ field: '', name: '', contact: '', org: '', note: '' });
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const pickField = (f: string) => {
    setForm(s => ({ ...s, field: f }));
    document.getElementById('dang-ky-cong-tac')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const submitCollab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.contact.trim()) return;
    const body = [
      `Lĩnh vực quan tâm: ${form.field || '(chưa chọn)'}`,
      `Họ tên: ${form.name}`,
      `Email / SĐT: ${form.contact}`,
      `Đơn vị: ${form.org || '—'}`,
      '', 'Lời nhắn:', form.note || '—',
    ].join('\n');
    window.location.href = `mailto:ckcgsg@gmail.com?subject=${encodeURIComponent(`[ĐẮC LỘ 2027] Đăng ký cộng tác – ${form.field || 'Chung'}`)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <div className="min-h-screen" style={{ background: C.cream, color: C.body }}>

      {/* 1 — HERO: ảnh nền (chân dung trong khung + rèm đỏ) từ Figma, phủ rgba(26,10,0,0.55) */}
      <section className="relative overflow-hidden" style={{ background: '#1a0a00' }}>
        <img src={IMG_HERO_BG} alt="Chân dung Cha Đắc Lộ trong khung tranh trước rèm sân khấu"
          className="absolute inset-0 w-full h-full object-cover object-[18%_center] lg:object-center" />
        <div className="absolute inset-0 lg:hidden" style={{ background: 'rgba(26,10,0,0.72)' }} />
        <div className="absolute inset-0 hidden lg:block" style={{ background: 'rgba(26,10,0,0.55)' }} />
        <div className="relative z-10 max-w-[1240px] mx-auto px-5 sm:px-8 pt-28 pb-16 lg:pt-36 lg:pb-24 lg:min-h-[734px] grid lg:grid-cols-[1fr_582px] gap-10 lg:gap-14 items-center">
          <div className="hidden lg:block" aria-hidden />
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="flex flex-col gap-6">
            <p className="text-[11px] sm:text-[13px] font-bold uppercase tracking-[0.22em] leading-relaxed" style={{ color: C.gold }}>
              Kỷ niệm 400 năm Cha Đắc Lộ đến Đàng Ngoài (1627 – 2027)
            </p>
            <div>
              <p className="text-base sm:text-xl font-extrabold uppercase tracking-wide mb-1" style={{ color: C.cream }}>Dự án vở ca kịch</p>
              <h1 className="serif font-bold leading-none text-[5rem] sm:text-[6.5rem] lg:text-[7.75rem]" style={{ color: C.cream }}>Đắc Lộ</h1>
            </div>
            <p className="text-base sm:text-lg lg:text-[21px] leading-relaxed" style={{ color: C.card }}>
              Hành trình của một hạt giống đức tin được gieo âm thầm từ thế kỷ XVII, nay sẽ bừng sáng trên sân khấu ca kịch với
              130+ diễn viên. Một câu chuyện về sự dấn thân tạo nên di sản trường tồn cho Giáo Hội và văn hóa dân tộc.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px]" style={{ color: C.card }}>
              <span className="flex items-center gap-2"><Calendar size={16} style={{ color: C.gold }} /> 04.06.2027</span>
              <span className="flex items-center gap-2"><MapPin size={16} style={{ color: C.gold }} /> Trung Tâm Mục Vụ TGP Sài Gòn</span>
              <span className="flex items-center gap-2"><Clock size={16} style={{ color: C.gold }} /> Thời lượng 1 giờ 45 phút</span>
            </div>
            <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-[444px]">
              {([['Ngày', t.days], ['Giờ', t.hours], ['Phút', t.minutes], ['Giây', t.seconds]] as const).map(([label, value]) => (
                <div key={label} className="rounded-2xl border h-[72px] sm:h-20 flex flex-col items-center justify-center"
                  style={{ background: 'rgba(42,16,8,0.6)', borderColor: C.gold }}>
                  <div className="serif text-[1.7rem] sm:text-4xl font-bold leading-none" style={{ color: C.cream }}>{String(value).padStart(2, '0')}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: C.gold }}>{label}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a href="#cong-tac" className="inline-flex items-center justify-center h-[58px] px-9 rounded-full font-bold text-sm tracking-wide transition-all hover:brightness-110"
                style={{ background: C.wine, color: C.cream }}>ĐỒNG HÀNH CÙNG DỰ ÁN</a>
              <a href="#cha-dac-lo" className="inline-flex items-center justify-center h-[58px] px-9 rounded-full font-bold text-sm tracking-wide border-[1.5px] transition-all hover:bg-white/10"
                style={{ borderColor: C.cream, color: C.cream }}>KHÁM PHÁ VỞ KỊCH</a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2 — SƠ NÉT VỀ CHA ĐẮC LỘ */}
      <section id="cha-dac-lo" className="scroll-mt-20 px-5 sm:px-8 lg:px-[100px] pt-14 pb-14 lg:pt-11 lg:pb-14">
        <div className="max-w-[1240px] mx-auto">
          <motion.p {...fadeUp} className="italic text-[13px] tracking-[0.2em] mb-6" style={{ color: C.wine }}>
            Người gieo giống ra đi gieo giống... (Mt 13,3b)
          </motion.p>
          <div className="grid lg:grid-cols-[489px_1fr] gap-12 lg:gap-16">
            <motion.div {...fadeUp}>
              <H2 className="mb-7">Alexandre de Rhodes</H2>
              <div className="flex flex-col sm:flex-row gap-6 sm:items-start mb-7">
                <img src={IMG_PORTRAIT} alt="Chân dung Cha Alexandre de Rhodes" loading="lazy"
                  className="w-40 h-[204px] object-cover rounded-2xl shrink-0 grayscale" />
                <dl className="space-y-3">
                  {[['Tên Việt Nam', 'Cha Đắc Lộ'], ['Dòng tu', 'Dòng Tên (Society of Jesus)'], ['Quê quán', 'Avignon, miền Nam nước Pháp'], ['Năm sinh – mất', '1593 – 1660']].map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-sm font-bold uppercase tracking-[0.08em]" style={{ color: C.head }}>{k}</dt>
                      <dd className="text-base sm:text-lg" style={{ color: C.body }}>{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <p className="text-lg sm:text-xl leading-relaxed">
                Nhân vật lịch sử then chốt trong quá trình hình thành chữ Quốc ngữ và đặt nền móng cho công cuộc truyền giáo tại Việt Nam.
              </p>
            </motion.div>

            <ol className="relative self-center">
              <span className="absolute left-[7px] top-3 bottom-3 w-px" style={{ background: C.line }} />
              {TIMELINE.map((e, i) => (
                <motion.li key={e.year} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="relative pl-10 pb-6 last:pb-0">
                  <span className="absolute left-0 top-2.5 w-[15px] h-[15px] rounded-full border-[3px]" style={{ background: C.wine, borderColor: C.cream, boxShadow: `0 0 0 1px ${C.wine}` }} />
                  <div className="grid sm:grid-cols-[170px_1fr] gap-x-6 gap-y-1 items-baseline">
                    <div className="serif font-bold text-2xl lg:text-[30px] leading-tight lining-nums" style={{ color: C.wine }}>{e.year}</div>
                    <p className="text-base lg:text-lg leading-relaxed">{e.text}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 3 — CỘT MỐC 400 NĂM: HẠT GIỐNG */}
      <section id="cot-moc" className="px-5 sm:px-8 lg:px-[100px] py-14 lg:py-[78px]">
        <div className="max-w-[1240px] mx-auto grid lg:grid-cols-[1fr_593px] gap-10 lg:gap-16 items-center">
          <motion.div {...fadeUp}>
            <H2 className="mb-6">Một hạt giống đã được gieo xuống...</H2>
            <p className="text-lg sm:text-xl lg:text-[25px] leading-relaxed">
              Năm 1627, chiếc thuyền mang Cha Đắc Lộ cùng các nhà truyền giáo Dòng Tên cập bến Đàng Ngoài, gieo hạt giống đức tin
              cùng mầm sống của chữ Quốc ngữ vào lòng đất Việt.
            </p>
          </motion.div>
          <motion.div {...fadeUp} className="relative rounded-[20px] overflow-hidden aspect-[593/384]">
            <img src={IMG_BOAT} alt="Chiếc thuyền mang các nhà truyền giáo cập bến Đàng Ngoài" loading="lazy" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'rgba(194,91,74,0.18)' }} />
            <div className="absolute inset-0" style={{ background: `linear-gradient(212.9deg, ${C.wine}cc 0%, transparent 47.5%)` }} />
          </motion.div>
        </div>
      </section>

      {/* 4 — BỐN THÔNG ĐIỆP */}
      <section id="thong-diep" className="px-5 sm:px-8 lg:px-[100px] py-12 lg:py-12">
        <div className="max-w-[1240px] mx-auto">
          <motion.div {...fadeUp} className="mb-10 max-w-4xl">
            <H2 className="mb-5">...bốn thế kỷ sau vẫn sinh hoa kết trái</H2>
            <p className="text-lg sm:text-xl lg:text-[25px] leading-relaxed">
              Rơi vào “đất tốt” qua bao thế hệ tín hữu Việt Nam, hạt giống ấy nay được tiếp nối trên sân khấu nghệ thuật với các thông điệp:
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {MESSAGES.map((m, i) => (
              <motion.div key={m.title} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.08 }}
                className="rounded-[18px] border p-7 flex flex-col gap-4 lg:min-h-[361px] hover:-translate-y-1 transition-transform"
                style={{ background: C.card, borderColor: C.line }}>
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: C.icon, color: C.wine }}><m.icon size={24} /></div>
                  <span className="serif text-4xl font-bold" style={{ color: C.head }}>0{i + 1}</span>
                </div>
                <h3 className="serif text-[22px] font-bold leading-snug" style={{ color: C.head }}>{m.top}<br />{m.title}</h3>
                <p className="text-base lg:text-lg leading-relaxed">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 — CÂU CHUYỂN (Ga 12,24) */}
      <section className="mt-10 px-5 sm:px-8 py-10 lg:py-12 flex items-center justify-center" style={{ background: C.deep }}>
        <motion.blockquote {...fadeUp} className="max-w-[980px] text-center">
          <p className="serif italic text-xl sm:text-2xl lg:text-[30px] leading-relaxed" style={{ color: C.cream }}>
            “Nếu hạt lúa gieo vào lòng đất mà không chết đi, nó vẫn trơ trọi một mình; nhưng nếu chết đi, nó mới sinh được nhiều hạt khác”
          </p>
          <cite className="block not-italic mt-3 text-sm font-bold tracking-[0.2em]" style={{ color: C.gold }}>(Ga 12,24)</cite>
        </motion.blockquote>
      </section>

      {/* 6 — QUY MÔ DÀN DỰNG */}
      <section id="dan-dung" style={{ background: '#1a0f0a' }}>
        <div className="relative overflow-hidden">
          <img src={IMG_STAGE} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a0f0a] via-[#1a0f0a]/75 to-[#1a0f0a]/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f0a] via-transparent to-[#1a0f0a]/60" />
          <div className="relative max-w-[1240px] mx-auto px-5 sm:px-8 pt-20 pb-14 lg:pt-28 lg:pb-16">
            <motion.div {...fadeUp} className="max-w-[560px]">
              <Eyebrow light>Từ lịch sử đến sân khấu nghệ thuật</Eyebrow>
              <h2 className="serif font-bold text-[2rem] sm:text-4xl lg:text-5xl leading-[1.15] mb-6" style={{ color: C.cream }}>
                Tất cả sẽ được tái hiện trong vở ca kịch “Đắc Lộ”
              </h2>
              <p className="text-base sm:text-lg leading-relaxed" style={{ color: C.card }}>
                Di sản 400 năm và ngọn lửa đức tin được sống lại trọn vẹn qua một công trình nghệ thuật sân khấu quy mô.
                Vở ca kịch quy tụ nguồn nhân lực lớn, dàn dựng công phu, mở ra một không gian thiêng liêng và giàu chiều kích mục vụ.
              </p>
            </motion.div>
            <div className="mt-14 lg:mt-24 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-8">
              {STATS.map((s, i) => (
                <motion.div key={s.label} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.07 }}>
                  <div className="serif font-bold text-[2.2rem] sm:text-5xl leading-none mb-3 whitespace-nowrap" style={{ color: C.gold }}><CountUp value={s.value} /></div>
                  <div className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.12em] mb-1.5" style={{ color: C.cream }}>{s.label}</div>
                  <div className="text-xs leading-relaxed text-white/45">{s.sub}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* mosaic ảnh */}
        <div className="relative grid grid-cols-2 lg:grid-cols-[780fr_330fr_330fr] gap-1 lg:h-[520px]">
          <figure className="relative col-span-2 lg:col-span-1 lg:row-span-2 aspect-[16/10] lg:aspect-auto overflow-hidden">
            <img src={IMG_M1} alt="Cảnh diễn của nhóm" loading="lazy" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f0a]/80 via-transparent to-[#1a0f0a]/50" />
            <figcaption className="absolute left-6 bottom-6 flex items-center gap-3 text-[11px] tracking-[0.15em] text-white/60">
              <span className="w-6 h-px" style={{ background: C.gold }} /> Hình ảnh tư liệu từ các vở diễn của nhóm
            </figcaption>
          </figure>
          {[IMG_M2, IMG_M3, IMG_M4, IMG_M5].map((src, i) => (
            <div key={i} className="relative aspect-[4/3] lg:aspect-auto overflow-hidden">
              <img src={src} alt="" loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          ))}
        </div>

        {/* dải Jericho + CTA sơ đồ 3D */}
        <div className="relative overflow-hidden">
          <img src={IMG_SEED} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-45" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a0f0a] via-[#1a0f0a]/40 to-[#1a0f0a]/70" />
          <motion.div {...fadeUp} className="relative max-w-[820px] mx-auto px-5 py-16 lg:py-0 lg:h-[340px] flex flex-col items-center justify-center text-center gap-5">
            <div className="flex items-center gap-3" style={{ color: C.gold }}><span className="w-14 h-px bg-current opacity-60" /><Star size={12} /><span className="w-14 h-px bg-current opacity-60" /></div>
            <p className="serif font-bold text-xl sm:text-2xl lg:text-[28px] leading-snug" style={{ color: C.cream }}>
              Cho vinh danh Thiên Chúa hơn – Để di sản tiền nhân tiếp tục sinh hoa kết trái!
            </p>
            <div className="flex items-center gap-3" style={{ color: C.gold }}><span className="w-14 h-px bg-current opacity-60" /><Star size={12} /><span className="w-14 h-px bg-current opacity-60" /></div>
            <Link to="/dac-lo/so-do" className="mt-2 inline-flex items-center gap-2 px-7 py-3.5 rounded-full border text-xs sm:text-sm font-bold tracking-[0.12em] transition-all hover:bg-white/10"
              style={{ borderColor: C.gold, color: C.cream }}>
              <MapIcon size={16} /> XEM SƠ ĐỒ SÂN KHẤU 3D
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 7 — LỜI MỜI GỌI CỘNG TÁC */}
      <section id="cong-tac" className="scroll-mt-16 px-5 sm:px-8 lg:px-[100px] pt-16 lg:pt-[72px] pb-20 lg:pb-[116px]">
        <div className="max-w-[1240px] mx-auto flex flex-col gap-10 lg:gap-12">
          <motion.div {...fadeUp}>
            <Eyebrow>Lời mời gọi cộng tác</Eyebrow>
            <H2 className="mb-6">Cùng tiếp nối câu chuyện đến thế hệ mai sau</H2>
            <p className="text-base sm:text-lg leading-relaxed max-w-[1000px]">
              Nằm trong chuỗi sự kiện kỷ niệm 400 năm, vở ca kịch ‘Đắc Lộ’ không chỉ là dự án riêng của nhóm mà là một dự án chung
              của Dòng Tên — công trình mang chiều kích lịch sử, mục vụ và văn hóa. Rất mong nhận được sự chung tay góp sức của
              quý Cha, quý Tu sĩ, quý Cộng đoàn và các đơn vị đồng hành:
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5 items-start">
            {COLLAB.map((c, i) => (
              <motion.div key={c.title} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.08 }}
                className="rounded-[18px] border p-6 lg:p-7 flex flex-col gap-5" style={{ background: C.card, borderColor: C.line }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0" style={{ background: C.icon, color: C.wine }}><c.icon size={20} /></div>
                  <h3 className="serif text-xl lg:text-[22px] font-bold" style={{ color: C.head }}>{c.title}</h3>
                </div>
                <ul className="space-y-2.5">
                  {c.items.map(it => (
                    <li key={it} className="flex gap-3 text-[15px] leading-relaxed">
                      <span className="mt-[9px] w-1.5 h-1.5 rounded-full shrink-0" style={{ background: C.wine }} />{it}
                    </li>
                  ))}
                </ul>
                <button type="button" onClick={() => pickField(c.field)}
                  className="mt-1 h-12 px-5 rounded-full font-bold text-sm transition-all hover:brightness-110"
                  style={{ background: C.wine, color: C.cream }}>{c.cta}</button>
              </motion.div>
            ))}
          </div>

          {/* form đăng ký */}
          <motion.div {...fadeUp} id="dang-ky-cong-tac" className="scroll-mt-24 rounded-[18px] border p-6 sm:p-8" style={{ background: C.card, borderColor: C.line }}>
            <h3 className="serif text-2xl lg:text-[28px] font-bold mb-6" style={{ color: C.head }}>Đăng ký cộng tác</h3>
            {sent ? (
              <div className="rounded-2xl p-6 border" style={{ background: C.cream, borderColor: C.line }}>
                <div className="font-bold mb-1" style={{ color: C.wine }}>Cảm ơn anh chị đã đồng hành!</div>
                <p className="text-sm">Ứng dụng email của anh chị đã được mở sẵn nội dung — chỉ cần bấm Gửi. Nếu chưa mở được,
                  xin gửi trực tiếp về <a href="mailto:ckcgsg@gmail.com" className="underline">ckcgsg@gmail.com</a> hoặc gọi 0908 033 357.</p>
                <button onClick={() => setSent(false)} className="mt-4 text-sm font-bold underline" style={{ color: C.wine }}>Sửa lại thông tin</button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={submitCollab} className="grid sm:grid-cols-2 gap-x-5 gap-y-4">
                <label className="block">
                  <span className="block text-xs font-bold mb-1.5" style={{ color: C.head }}>Lĩnh vực quan tâm</span>
                  <select value={form.field} onChange={e => setForm(s => ({ ...s, field: e.target.value }))} className={`${inputCls} appearance-none`} style={inputStyle}>
                    <option value="">Chuyên môn / Cơ sở / Tài trợ</option>
                    {FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="block text-xs font-bold mb-1.5" style={{ color: C.head }}>Họ tên *</span>
                  <input required value={form.name} onChange={e => setForm(s => ({ ...s, name: e.target.value }))} placeholder="Nhập họ tên" className={inputCls} style={inputStyle} />
                </label>
                <label className="block">
                  <span className="block text-xs font-bold mb-1.5" style={{ color: C.head }}>Email / SĐT *</span>
                  <input required value={form.contact} onChange={e => setForm(s => ({ ...s, contact: e.target.value }))} placeholder="Nhập liên hệ" className={inputCls} style={inputStyle} />
                </label>
                <label className="block">
                  <span className="block text-xs font-bold mb-1.5" style={{ color: C.head }}>Đơn vị (nếu có)</span>
                  <input value={form.org} onChange={e => setForm(s => ({ ...s, org: e.target.value }))} placeholder="Nhập đơn vị" className={inputCls} style={inputStyle} />
                </label>
                <label className="block sm:col-span-2">
                  <span className="block text-xs font-bold mb-1.5" style={{ color: C.head }}>Lời nhắn / lĩnh vực quan tâm</span>
                  <textarea rows={3} value={form.note} onChange={e => setForm(s => ({ ...s, note: e.target.value }))} placeholder="Mô tả chi tiết về hạng mục có thể hỗ trợ"
                    className={`${inputCls} rounded-2xl resize-y`} style={inputStyle} />
                </label>
                <div className="sm:col-span-2">
                  <button type="submit" className="inline-flex items-center gap-2 h-11 px-7 rounded-full font-bold text-sm transition-all hover:brightness-110"
                    style={{ background: C.wine, color: C.cream }}><Send size={15} /> Gửi thông tin</button>
                </div>
              </form>
            )}
          </motion.div>

          {/* liên hệ */}
          <motion.div {...fadeUp} className="rounded-[18px] p-7 sm:p-9 flex flex-col md:flex-row md:items-center justify-between gap-6" style={{ background: C.wine, color: C.cream }}>
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.2em] mb-2">Liên hệ cộng tác</div>
              <div className="text-sm mb-3" style={{ color: C.card }}><span className="font-bold" style={{ color: C.cream }}>Teresa Nguyễn Lan Nghi</span> · Đại diện phụ trách dự án</div>
              <div className="flex flex-col sm:flex-row gap-x-7 gap-y-1 font-bold text-lg lg:text-xl">
                <a href="tel:0908033357" className="lining-nums tabular-nums hover:underline underline-offset-4">0908 033 357</a>
                <a href="mailto:ckcgsg@gmail.com" className="break-all hover:underline underline-offset-4">ckcgsg@gmail.com</a>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a href="tel:0908033357" className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-full border text-sm font-bold transition-all hover:bg-white/10"
                style={{ borderColor: C.cream }}><Phone size={16} /> GỌI ĐIỆN</a>
              <a href={`mailto:ckcgsg@gmail.com?subject=${encodeURIComponent('[ĐẮC LỘ 2027] Cộng tác dự án')}`}
                className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-full text-sm font-bold transition-all hover:brightness-95"
                style={{ background: C.cream, color: C.wine }}><Mail size={16} /> GỬI EMAIL</a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 8 — ĐƠN VỊ PHỐI HỢP & THỰC HIỆN */}
      <section id="don-vi" className="py-16 lg:py-20 border-t" style={{ borderColor: C.line }}>
        <motion.div {...fadeUp} className="text-center px-5 mb-10 lg:mb-14">
          <Eyebrow center>Tổ chức & đồng hành</Eyebrow>
          <H2>Đơn Vị Phối Hợp & Thực Hiện</H2>
        </motion.div>

        {[
          { img: IMG_SEED, right: false, tag: 'Tổ chức & định hướng mục vụ', title: 'Dòng Tên Việt Nam',
            text: 'Là dòng tu của Cha Đắc Lộ, Dòng Tên Việt Nam nâng đỡ tâm linh, định hướng lịch sử và mục vụ cho tác phẩm trong chuỗi sự kiện kỷ niệm 400 năm.' },
          { img: IMG_STAGE, right: true, tag: 'Dàn dựng & thực hiện', title: 'Nhóm Ca Kịch Công Giáo Sài Gòn',
            text: 'Khởi đầu năm 2014 bởi Đạo diễn Jean Kiệt, nhóm nay quy tụ hơn 120 thành viên nhiệt thành, yêu nghệ thuật bao gồm cả người Công Giáo và không Công Giáo.' },
        ].map(b => (
          <div key={b.title} className="relative overflow-hidden">
            <img src={b.img} alt="" aria-hidden className={`absolute inset-y-0 ${b.right ? 'left-0' : 'right-0'} w-full lg:w-3/4 h-full object-cover opacity-60`} />
            <div className="absolute inset-0" style={{ background: `linear-gradient(${b.right ? 270 : 90}deg, ${C.cream} 30%, ${C.cream}cc 55%, ${C.cream}55 100%)` }} />
            <motion.div {...fadeUp} className={`relative max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-[100px] py-12 lg:py-16 flex ${b.right ? 'justify-end text-right' : ''}`}>
              <div className="max-w-[520px]">
                <span className="inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] mb-4" style={{ background: C.wine, color: C.cream }}>{b.tag}</span>
                <h3 className="serif font-bold text-3xl lg:text-[40px] leading-tight mb-4" style={{ color: C.head }}>{b.title}</h3>
                <p className="text-base leading-relaxed">{b.text}</p>
              </div>
            </motion.div>
          </div>
        ))}

        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-[100px] mt-10 lg:mt-12">
          <div className="grid md:grid-cols-3 border-y py-8" style={{ borderColor: C.line }}>
            {PILLARS.map((p, i) => (
              <motion.div key={p.title} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`py-5 md:py-0 md:px-7 ${i ? 'border-t md:border-t-0 md:border-l' : 'md:pl-0'}`} style={{ borderColor: C.line }}>
                <div className="text-[11px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: '#b8862e' }}>{p.tag}</div>
                <h4 className="serif text-2xl font-bold mb-2" style={{ color: C.head }}>{p.title}</h4>
                <p className="text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 9 — NHẬN THÔNG BÁO */}
      <section id="nhan-tin" className="py-16 lg:py-20 px-5">
        <motion.div {...fadeUp} className="max-w-2xl mx-auto text-center">
          <Eyebrow center>Đừng bỏ lỡ</Eyebrow>
          <H2 className="mb-4">Nhận thông báo về vở ca kịch Đắc Lộ</H2>
          <p className="mb-8">Lịch diễn chính thức, hành trình tập luyện và các thông tin mới nhất sẽ được gửi qua email.</p>
          {!subscribed ? (
            <form onSubmit={e => { e.preventDefault(); if (email) setSubscribed(true); }} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Email của bạn..."
                className={`${inputCls} flex-1`} style={{ ...inputStyle, background: 'transparent' }} />
              <button type="submit" className="h-12 px-7 rounded-full font-bold text-sm whitespace-nowrap transition-all hover:brightness-110"
                style={{ background: C.wine, color: C.cream }}>THÔNG BÁO TÔI</button>
            </form>
          ) : (
            <div className="max-w-md mx-auto rounded-2xl p-6 border" style={{ background: C.card, borderColor: C.line }}>
              <div className="font-bold mb-1" style={{ color: C.wine }}>Đã đăng ký thành công! 🎭</div>
              <div className="text-sm">Chúng tôi sẽ thông báo ngay khi có tin mới về vở Đắc Lộ.</div>
            </div>
          )}
        </motion.div>
        <div className="text-center mt-14">
          <Link to="/" className="inline-flex items-center gap-2 text-sm uppercase tracking-widest font-bold transition-colors hover:text-[#8b1a1a]" style={{ color: C.head }}>
            <ArrowLeft size={16} /> Quay về trang chủ
          </Link>
        </div>
      </section>
    </div>
  );
}
