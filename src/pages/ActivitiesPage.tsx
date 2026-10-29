import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Star, Calendar } from 'lucide-react';
import { CHARITY, OTHER_PROGRAMS } from '../constants';
import { PageHeader, ProjectGrid, Eyebrow, fadeUp } from '../components/PageParts';
import HEADER_IMG from '../assets/photos/value-gia-dinh.jpg';

export default function ActivitiesPage() {
  const years = Array.from(new Set(OTHER_PROGRAMS.map(p => p.date).filter((d): d is string => !!d && /^\d{4}$/.test(d))))
    .sort((a, b) => Number(b) - Number(a));
  const [year, setYear] = useState(years[0] ?? '');
  const programs = OTHER_PROGRAMS.filter(p => p.date === year);

  return (
    <div>
      <PageHeader
        eyebrow="Hoạt động"
        title="Không chỉ trên sân khấu"
        intro="Bên cạnh các vở ca kịch, nhóm còn đến với những hoàn cảnh khó khăn qua các chuyến thiện nguyện, và cùng giáo xứ, dòng tu thực hiện những đêm thánh ca, hợp xướng."
        image={HEADER_IMG}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 -mt-6 mb-16 flex flex-wrap gap-3">
        <a href="#thien-nguyen" className="px-5 py-2 rounded-full bg-white/5 text-white/70 text-sm font-bold hover:bg-white/10 hover:text-white transition-all">Thiện nguyện</a>
        <a href="#chuong-trinh" className="px-5 py-2 rounded-full bg-white/5 text-white/70 text-sm font-bold hover:bg-white/10 hover:text-white transition-all">Thánh ca & hợp xướng</a>
      </div>

      {/* THIỆN NGUYỆN */}
      <section id="thien-nguyen" className="max-w-7xl mx-auto px-6 pb-24 scroll-mt-28">
        <motion.div {...fadeUp} className="mb-12 max-w-2xl">
          <Eyebrow><span className="inline-flex items-center gap-2"><Heart size={14} /> Thiện nguyện</span></Eyebrow>
          <h2 className="text-4xl md:text-5xl font-bold serif leading-tight text-balance">Lan tỏa yêu thương đến cộng đồng</h2>
        </motion.div>
        <ProjectGrid items={CHARITY} />
      </section>

      {/* CHƯƠNG TRÌNH KHÁC */}
      <section id="chuong-trinh" className="py-20 md:py-28 bg-card/40 border-t border-white/5 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp} className="mb-10 max-w-2xl">
            <Eyebrow><span className="inline-flex items-center gap-2"><Star size={14} /> Thánh ca & hợp xướng</span></Eyebrow>
            <h2 className="text-4xl md:text-5xl font-bold serif leading-tight text-balance">Các chương trình nghệ thuật khác</h2>
          </motion.div>
          <div className="flex flex-wrap gap-2 mb-12">
            {years.map(y => (
              <button key={y} onClick={() => setYear(y)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${year === y ? 'bg-gold text-black shadow-lg shadow-gold/20' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'}`}>
                {y}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={year} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              {programs.length ? <ProjectGrid items={programs} /> : (
                <div className="bg-white/5 border border-white/10 rounded-3xl p-16 text-center">
                  <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center text-gold mx-auto mb-6"><Calendar size={40} /></div>
                  <h3 className="text-2xl font-bold serif mb-4">Đang cập nhật nội dung năm {year}</h3>
                  <p className="text-white/50 max-w-md mx-auto">Chúng tôi đang chuẩn bị tư liệu. Vui lòng quay lại sau.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
