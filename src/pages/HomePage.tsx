import { useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Heart, Music, Calendar, Mail, Star } from 'lucide-react';
import HERO_IMG from '../assets/photos/hero.jpg';
import STORY_IMG from '../assets/photos/story.jpg';
import { PLAYS, CHARITY, OTHER_PROGRAMS } from '../constants';
import { Project } from '../types';
import Modal from '../components/Modal';
import ProjectCard from '../components/ProjectCard';
import CastingSection from '../components/CastingSection';
import { Link } from 'react-router-dom';

const STATS = [
  { label: 'Năm thành lập', value: '2014' },
  { label: 'Thành viên', value: '120+' },
  { label: 'Vở diễn', value: '15+' },
  { label: 'Sứ mệnh', value: 'Loan Báo' },
];

export default function HomePage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 800], [0, 280]);

  const years = Array.from(
    new Set(OTHER_PROGRAMS.map(p => p.date).filter(d => /^\d{4}$/.test(d)))
  ).sort((a, b) => Number(b) - Number(a));
  const [selectedYear, setSelectedYear] = useState(years[0] ?? '2017');
  const filteredOtherPrograms = OTHER_PROGRAMS.filter(p => p.date === selectedYear);

  const upcoming = PLAYS.find(p => p.status === 'upcoming');
  const archived = PLAYS.filter(p => p.status === 'archived')
    .sort((a, b) => parseInt(b.date?.toString() ?? '0') - parseInt(a.date?.toString() ?? '0'));
  const feature = archived[0];
  const restPlays = archived.slice(1, 5);

  return (
    <div>
      <AnimatePresence>
        {selectedProject && (
          <Modal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>

      {/* 1 — HERO */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
          <img src={HERO_IMG} alt="Sân khấu"
            className="w-full h-[120%] object-cover opacity-50" referrerPolicy="no-referrer" />
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
              <a href="#feature" className="bg-gold text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-white transition-all duration-300 shadow-lg shadow-gold/20">
                KHÁM PHÁ VỞ DIỄN
              </a>
              <a href="#contact" className="text-sm uppercase tracking-[0.15em] text-white/50 border-b border-white/20 pb-1 hover:text-gold hover:border-gold transition-all">
                Tham gia cùng chúng tôi
              </a>
            </div>
          </motion.div>
        </div>
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-gold rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* 2 — FEATURE: vở sắp ra mắt (full-bleed) */}
      {upcoming && (
        <section id="feature" className="relative min-h-[86vh] flex items-center overflow-hidden">
          <div className="absolute inset-0">
            <img src={upcoming.imageUrl} alt={upcoming.title}
              className="w-full h-full object-cover opacity-50" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/40 to-transparent" />
          </div>
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.8 }} className="max-w-xl">
              <div className="text-gold uppercase tracking-[0.3em] text-xs font-bold mb-4">
                Sắp ra mắt{upcoming.date ? ` · ${upcoming.date}` : ''}
              </div>
              <h3 className="text-5xl md:text-8xl font-bold serif leading-[0.98] mb-5">{upcoming.title}</h3>
              <p className="text-lg md:text-xl text-white/65 font-light leading-relaxed mb-8">{upcoming.description}</p>
              <Link to="/dac-lo" className="inline-block bg-gold text-black px-9 py-4 rounded-full font-bold hover:bg-white transition-all">
                XEM CHI TIẾT VỞ DIỄN
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* 3 — STORY (rút gọn) */}
      <section id="story" className="py-20 md:py-36 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <div className="flex items-center gap-3.5 mb-5">
                <span className="w-9 h-px bg-gold" />
                <span className="text-gold uppercase tracking-[0.25em] text-xs font-bold">Câu chuyện của chúng tôi</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold serif leading-[1.08] mb-6 text-balance">
                Bắt đầu từ 33 trái tim,<br />nay là một gia đình 120+.
              </h2>
              <p className="text-white/60 font-light text-lg leading-[1.8] max-w-md mb-8">
                Thành lập tháng 5 năm 2014, nhóm mang Tin Mừng đến mọi người qua nghệ thuật ca kịch — miễn phí, không bán vé, hoàn toàn trên tinh thần tự nguyện và cống hiến.
              </p>
              <a href="#plays" className="text-gold font-bold text-sm uppercase tracking-[0.08em] border-b border-gold pb-1 hover:text-white hover:border-white transition-all">
                Khám phá các vở diễn →
              </a>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-white/10">
                <img src={STORY_IMG} alt="Câu chuyện"
                  className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="absolute -bottom-8 -left-6 md:-left-8 bg-gold p-7 md:p-8 rounded-2xl text-black">
                <div className="text-4xl md:text-5xl font-bold serif leading-none mb-1">10+</div>
                <div className="text-xs font-bold uppercase tracking-[0.14em]">Năm Hành Trình</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats — ngay dưới Câu chuyện để các ý đồng bộ */}
      <section className="py-16 md:py-24 bg-card/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 text-center">
            {STATS.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                <div className="text-gold/50 text-2xl mb-2">◆</div>
                <div className="text-4xl md:text-5xl font-bold serif mb-2">{stat.value}</div>
                <div className="text-xs uppercase tracking-widest text-white/40 font-bold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tuyển diễn viên */}
      <CastingSection />

      {/* 4 — PLAYS: lưới không đều */}
      <section id="plays" className="py-16 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14 max-w-2xl">
            <div className="flex items-center gap-3.5 mb-4">
              <Music className="text-gold" size={22} />
              <span className="text-gold uppercase tracking-[0.25em] text-xs font-bold">Các vở ca kịch</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold serif leading-tight text-balance">Những câu chuyện đã sống trên sân khấu</h2>
          </motion.div>

          {feature && (
            <div className="grid lg:grid-cols-3 gap-5 auto-rows-fr">
              <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="lg:row-span-2 min-h-[340px] lg:min-h-0">
                <FeatureCard project={feature} onClick={setSelectedProject} />
              </motion.div>
              {restPlays.map((project, i) => (
                <motion.div key={project.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: (i % 2) * 0.1 }} className="min-h-[300px]">
                  <ProjectCard project={project} onClick={setSelectedProject} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <a href="#archive" className="inline-block border border-gold text-gold px-9 py-3.5 rounded-full font-bold hover:bg-gold hover:text-black transition-all">
              XEM TOÀN BỘ KHO LƯU TRỮ →
            </a>
          </div>
        </div>
      </section>

      {/* full archive (toàn bộ vở) */}
      <section id="archive" className="pb-16 md:pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-2xl font-semibold serif mb-8 flex items-center gap-3">
            <span className="w-8 h-px bg-gold" /> Kho lưu trữ vở diễn
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {archived.map(project => (
              <ProjectCard key={project.id} project={project} onClick={setSelectedProject} />
            ))}
          </div>
        </div>
      </section>

      {/* 6 — CHARITY */}
      <section id="charity" className="py-16 md:py-32 bg-card/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14 max-w-2xl">
            <div className="flex items-center gap-3.5 mb-4">
              <Heart className="text-gold" size={22} />
              <span className="text-gold uppercase tracking-[0.25em] text-xs font-bold">Thiện nguyện</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold serif leading-tight text-balance">Lan tỏa yêu thương đến cộng đồng</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {CHARITY.map(project => (
              <ProjectCard key={project.id} project={project} onClick={setSelectedProject} />
            ))}
          </div>
        </div>
      </section>

      {/* Other programs */}
      <section id="other" className="py-16 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 max-w-2xl">
            <div className="flex items-center gap-3.5 mb-4">
              <Star className="text-gold" size={22} />
              <span className="text-gold uppercase tracking-[0.25em] text-xs font-bold">Các chương trình khác</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold serif leading-tight text-balance">Hoạt động văn hóa & cộng đồng qua các năm</h2>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {years.map(year => (
              <button key={year} onClick={() => setSelectedYear(year)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                  selectedYear === year ? 'bg-gold text-black shadow-lg shadow-gold/20 scale-110' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                }`}>
                {year}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={selectedYear} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              {filteredOtherPrograms.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {filteredOtherPrograms.map(project => (
                    <ProjectCard key={project.id} project={project} onClick={setSelectedProject} />
                  ))}
                </div>
              ) : (
                <div className="bg-white/5 border border-white/10 rounded-3xl p-16 text-center">
                  <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center text-gold mx-auto mb-6">
                    <Calendar size={40} />
                  </div>
                  <h3 className="text-2xl font-bold serif mb-4">Đang cập nhật nội dung năm {selectedYear}</h3>
                  <p className="text-white/50 max-w-md mx-auto">Chúng tôi đang chuẩn bị tư liệu. Vui lòng quay lại sau.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* 7 — CONTACT */}
      <section id="contact" className="py-16 md:py-32 bg-card">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10 md:gap-20">
            <div>
              <div className="flex items-center gap-3.5 mb-4">
                <Mail className="text-gold" size={22} />
                <span className="text-gold uppercase tracking-[0.25em] text-xs font-bold">Liên hệ & Ủng hộ</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold serif leading-tight mb-4 text-balance">Đồng hành cùng sứ vụ</h2>
              <p className="text-white/50 text-lg leading-relaxed mb-10">Chúng tôi luôn trân trọng mọi sự đóng góp và đồng hành từ quý ân nhân để tiếp tục sứ vụ.</p>
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <div className="text-sm text-white/40 uppercase tracking-widest font-bold mb-1">Email</div>
                    <div className="text-xl">ckcgsg@gmail.com</div>
                  </div>
                </div>
                <div className="p-8 bg-white/5 rounded-2xl border border-white/5">
                  <h4 className="text-lg font-bold serif text-gold mb-4 uppercase tracking-widest">Thông tin chuyển khoản</h4>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-white/40">Chủ tài khoản</span>
                      <span className="font-bold">DINH NGUYEN NHA THANH</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-white/40">Số tài khoản</span>
                      <span className="font-bold text-gold">41353947</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Nội dung</span>
                      <span className="font-bold">[HO TEN]_UNG HO CKCGSG</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-black p-10 rounded-3xl border border-white/5 shadow-2xl">
              <h3 className="text-2xl font-bold serif mb-8">Gửi tin nhắn cho chúng tôi</h3>
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-white/40">Họ và tên</label>
                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gold outline-none transition-colors" placeholder="Nguyễn Văn A" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-white/40">Email</label>
                    <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gold outline-none transition-colors" placeholder="example@gmail.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-white/40">Chủ đề</label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gold outline-none transition-colors" placeholder="Hợp tác / Ủng hộ / Tham gia" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-white/40">Tin nhắn</label>
                  <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gold outline-none transition-colors" placeholder="Nội dung tin nhắn..." />
                </div>
                <button type="button" className="w-full bg-gold text-black font-bold py-4 rounded-xl hover:bg-white transition-all duration-300">
                  GỬI TIN NHẮN
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* Card lớn cho ô nổi bật trong lưới không đều */
function FeatureCard({ project, onClick }: { project: Project; onClick: (p: Project) => void }) {
  return (
    <div onClick={() => onClick(project)}
      className="group relative h-full w-full rounded-2xl overflow-hidden cursor-pointer border border-white/6 bg-card">
      <img src={project.imageUrl} alt={project.title} referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-8">
        <div className="text-gold/70 text-[10px] uppercase tracking-[0.2em] font-bold mb-2">Dấu mốc nổi bật</div>
        <h4 className="text-3xl md:text-4xl font-bold serif leading-[1.05] mb-3 text-balance">{project.title}</h4>
        {project.date && <div className="text-xs text-white/45 font-mono">{project.date}</div>}
      </div>
    </div>
  );
}
