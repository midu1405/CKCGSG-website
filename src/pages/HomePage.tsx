import { useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Calendar, MapPin, Music, Heart, Star, ArrowRight, Mic2, HandHeart } from 'lucide-react';
import { Link } from 'react-router-dom';
import HERO_IMG from '../assets/photos/hero.jpg';
import STORY_IMG from '../assets/photos/story.jpg';
import CASTING_BG from '../assets/photos/casting-banner.jpg';
import { PLAYS, CHARITY, OTHER_PROGRAMS, playSortKey } from '../constants';
import { Project } from '../types';
import Modal from '../components/Modal';
import ProjectCard from '../components/ProjectCard';
import { Eyebrow, fadeUp } from '../components/PageParts';

const STATS = [
  { label: 'Năm thành lập', value: '2014' },
  { label: 'Thành viên', value: '120+' },
  { label: 'Vở diễn', value: '15+' },
  { label: 'Sứ mệnh', value: 'Loan Báo' },
];

export default function HomePage() {
  const [selected, setSelected] = useState<Project | null>(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 800], [0, 240]);

  const upcoming = PLAYS.find(p => p.status === 'upcoming');
  const archived = PLAYS.filter(p => p.status === 'archived').sort((a, b) => playSortKey(b.date) - playSortKey(a.date));
  const recent = archived.slice(0, 3);

  const ACTIVITIES = [
    { icon: Music, title: 'Ca kịch', count: `${archived.length} vở diễn`, desc: 'Sinh động hóa Kinh Thánh và lịch sử đức tin qua những vở ca kịch — miễn phí, không bán vé.', to: '/vo-dien' },
    { icon: Heart, title: 'Thiện nguyện', count: `${CHARITY.length} chương trình`, desc: 'Mang niềm vui và sự nâng đỡ đến các em nhỏ, bệnh nhân và những hoàn cảnh khó khăn.', to: '/hoat-dong#thien-nguyen' },
    { icon: Star, title: 'Thánh ca & hợp xướng', count: `${OTHER_PROGRAMS.length} chương trình`, desc: 'Đêm thánh ca, hợp xướng và các chương trình nghệ thuật cùng giáo xứ, dòng tu, cộng đoàn.', to: '/hoat-dong#chuong-trinh' },
  ];

  return (
    <div>
      <AnimatePresence>{selected && <Modal project={selected} onClose={() => setSelected(null)} />}</AnimatePresence>

      {/* 1 — HERO (giữ theme cũ) */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
          <img src={HERO_IMG} alt="Sân khấu" className="w-full h-[120%] object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark/30 to-dark" />
        </motion.div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="text-gold uppercase tracking-[0.5em] text-sm font-bold mb-6 block">Hành trình 10 năm +</span>
            <h1 className="text-4xl sm:text-5xl md:text-8xl font-bold serif mb-8 leading-[1.04] text-balance">
              Mang Tin Mừng Qua <br />
              <span className="text-gold italic">Nghệ Thuật Ca Kịch</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              Nhóm Ca Kịch Công Giáo Sài Gòn lan tỏa tình yêu và đức tin qua những vở diễn đầy ý nghĩa — hoàn toàn miễn phí cho cộng đồng.
            </p>
            <div className="flex flex-col items-center gap-5">
              <a href="#vo-sap-toi" className="bg-gold text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-white transition-all duration-300 shadow-lg shadow-gold/20">
                KHÁM PHÁ VỞ DIỄN
              </a>
              <Link to="/tuyen-dien-vien" className="text-sm uppercase tracking-[0.15em] text-white/50 border-b border-white/20 pb-1 hover:text-gold hover:border-gold transition-all">
                Tham gia cùng chúng tôi
              </Link>
            </div>
          </motion.div>
        </div>
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1"><div className="w-1 h-2 bg-gold rounded-full" /></div>
        </motion.div>
      </section>

      {/* 2 — VỞ DIỄN SẮP TỚI */}
      {upcoming && (
        <section id="vo-sap-toi" className="relative min-h-[86vh] flex items-center overflow-hidden scroll-mt-0">
          <div className="absolute inset-0">
            <img src={upcoming.imageUrl} alt="Chân dung Cha Đắc Lộ" className="w-full h-full object-cover object-left opacity-60" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-b from-dark/70 via-dark/55 to-dark lg:bg-gradient-to-l lg:from-dark lg:via-dark/75 lg:to-transparent" />
          </div>
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-24 flex lg:justify-end">
            <motion.div {...fadeUp} className="w-full lg:max-w-xl text-center lg:text-left">
              <span className="text-gold uppercase tracking-[0.3em] text-xs font-bold mb-5 block">Vở diễn sắp tới · Kỷ niệm 400 năm</span>
              <h2 className="text-7xl md:text-9xl font-bold serif leading-none mb-6">{upcoming.title}</h2>
              <p className="text-white/70 text-lg md:text-xl font-light leading-relaxed mb-8">{upcoming.description}</p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-3 text-sm text-white/70 mb-10">
                <span className="flex items-center gap-2"><Calendar size={16} className="text-gold" /> {upcoming.date}</span>
                <span className="flex items-center gap-2"><MapPin size={16} className="text-gold" /> Trung Tâm Mục Vụ TGP Sài Gòn</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link to="/dac-lo" className="bg-gold text-black px-8 py-4 rounded-full font-bold hover:bg-white transition-all text-center">XEM VỞ ĐẮC LỘ</Link>
                <Link to="/dac-lo#cong-tac" className="border border-white/25 px-8 py-4 rounded-full font-bold hover:border-gold hover:text-gold transition-all text-center">ĐỒNG HÀNH CÙNG DỰ ÁN</Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* 3 — NHÓM LÀM GÌ */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp} className="max-w-3xl mb-14">
            <Eyebrow>Nhóm Ca Kịch Công Giáo Sài Gòn</Eyebrow>
            <h2 className="text-4xl md:text-5xl font-bold serif leading-tight mb-5 text-balance">Nhóm làm những gì?</h2>
            <p className="text-white/60 text-lg font-light leading-relaxed">
              Hơn 10 năm qua, nhóm lan tỏa tình yêu và đức tin qua sân khấu, thánh ca và những chuyến thiện nguyện — hoàn toàn
              miễn phí, trên tinh thần tự nguyện và cống hiến.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {ACTIVITIES.map((a, i) => (
              <motion.div key={a.title} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.08 }}>
                <Link to={a.to} className="group block h-full bg-card border border-white/8 rounded-3xl p-8 hover:border-gold/50 transition-colors">
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center text-gold"><a.icon size={26} /></div>
                    <span className="text-xs uppercase tracking-widest text-white/40 font-bold">{a.count}</span>
                  </div>
                  <h3 className="serif text-3xl font-bold mb-3">{a.title}</h3>
                  <p className="text-white/55 leading-relaxed mb-8">{a.desc}</p>
                  <span className="inline-flex items-center gap-2 text-gold text-sm font-bold uppercase tracking-[0.1em]">
                    Xem thêm <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 — CÂU CHUYỆN (rút gọn) */}
      <section className="py-20 md:py-28 bg-card/50 border-y border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20 items-center">
          <motion.div {...fadeUp}>
            <Eyebrow>Câu chuyện của chúng tôi</Eyebrow>
            <h2 className="text-3xl md:text-5xl font-bold serif leading-[1.08] mb-6 text-balance">Bắt đầu từ 33 trái tim,<br />nay là một gia đình 120+.</h2>
            <p className="text-white/60 font-light text-lg leading-[1.8] max-w-md mb-10">
              Thành lập tháng 5 năm 2014, quy tụ cả người Công giáo và không Công giáo — cùng tôn trọng, cùng cầu nguyện, cùng sáng tạo.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
              {STATS.map(s => (
                <div key={s.label}>
                  <div className="text-3xl font-bold serif">{s.value}</div>
                  <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold mt-1">{s.label}</div>
                </div>
              ))}
            </div>
            <Link to="/cau-chuyen" className="text-gold font-bold text-sm uppercase tracking-[0.08em] border-b border-gold pb-1 hover:text-white hover:border-white transition-all">
              Đọc câu chuyện của nhóm →
            </Link>
          </motion.div>
          <motion.div {...fadeUp} className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-white/10">
              <img src={STORY_IMG} alt="Một cảnh diễn của CKCGSG" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="absolute -bottom-6 -left-4 md:-left-8 bg-gold p-6 md:p-8 rounded-2xl text-black">
              <div className="text-4xl md:text-5xl font-bold serif leading-none mb-1">10+</div>
              <div className="text-xs font-bold uppercase tracking-[0.14em]">Năm hành trình</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5 — VỞ DIỄN GẦN ĐÂY */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <motion.div {...fadeUp}>
              <Eyebrow>Vở diễn gần đây</Eyebrow>
              <h2 className="text-3xl md:text-5xl font-bold serif leading-tight text-balance">Những câu chuyện đã sống trên sân khấu</h2>
            </motion.div>
            <Link to="/vo-dien" className="shrink-0 inline-flex items-center gap-2 border border-gold text-gold px-7 py-3 rounded-full font-bold hover:bg-gold hover:text-black transition-all">
              TẤT CẢ {archived.length} VỞ DIỄN <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {recent.map(p => <ProjectCard key={p.id} project={p} onClick={setSelected} />)}
          </div>
        </div>
      </section>

      {/* 6 — THAM GIA / ĐỒNG HÀNH */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src={CASTING_BG} alt="" className="w-full h-full object-cover opacity-30" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark/80 to-dark" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-5">
          {[
            { icon: Mic2, title: 'Tham gia cùng nhóm', desc: 'Bạn yêu ca hát, vũ đạo và muốn loan báo Tin Mừng qua sân khấu? Xem cách ứng tuyển diễn viên.', cta: 'TUYỂN DIỄN VIÊN', to: '/tuyen-dien-vien' },
            { icon: HandHeart, title: 'Đồng hành & ủng hộ', desc: 'Mọi đóng góp giúp nhóm tiếp tục những vở diễn miễn phí cho cộng đồng.', cta: 'LIÊN HỆ & ỦNG HỘ', to: '/lien-he' },
          ].map(c => (
            <motion.div key={c.title} {...fadeUp} className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-10">
              <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold mb-6"><c.icon size={24} /></div>
              <h3 className="serif text-3xl font-bold mb-3">{c.title}</h3>
              <p className="text-white/60 leading-relaxed mb-8">{c.desc}</p>
              <Link to={c.to} className="inline-block bg-gold text-black px-7 py-3 rounded-full font-bold hover:bg-white transition-all">{c.cta}</Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
