import { motion } from 'motion/react';
import { Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PLAYS, playSortKey } from '../constants';
import { PageHeader, ProjectGrid, Eyebrow, fadeUp } from '../components/PageParts';
import HEADER_IMG from '../assets/photos/jericho-1.jpg';

/** Các giai đoạn hiển thị trên trang (năm bắt đầu tính theo playSortKey). */
const ERAS = [
  { id: 'tro-lai', range: '2023 – nay', title: 'Hành trình trở lại', from: 202300, to: 999999,
    desc: 'Năm 2023, "Con Chiên Không Mỏi" đánh dấu sự tái hợp và quay trở lại chính thức của nhóm — mở ra những vở diễn quy mô lớn tại các đại hội giới trẻ và tĩnh tâm.' },
  { id: 'nhung-nam-dau', range: '2015 – 2019', title: 'Những năm đầu', from: 0, to: 202299,
    desc: 'Từ vở diễn chính thức đầu tiên "Don Bosco" năm 2015, nhóm đi qua nhiều giáo xứ, dòng tu với những vở ca kịch Kinh Thánh, Giáng Sinh và gây quỹ thiện nguyện.' },
];

export default function PlaysPage() {
  const upcoming = PLAYS.find(p => p.status === 'upcoming');
  const archived = PLAYS.filter(p => p.status === 'archived').sort((a, b) => playSortKey(b.date) - playSortKey(a.date));

  return (
    <div>
      <PageHeader
        eyebrow="Các vở ca kịch"
        title="Những câu chuyện đã sống trên sân khấu"
        intro={`${archived.length} vở ca kịch từ năm 2015 đến nay — tất cả đều miễn phí, không bán vé, do các thành viên tự nguyện thực hiện.`}
        image={HEADER_IMG}
      />

      {/* Lối tắt theo giai đoạn */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 -mt-6 mb-16 flex flex-wrap gap-3">
        {upcoming && <a href="#sap-dien" className="px-5 py-2 rounded-full border border-gold text-gold text-sm font-bold hover:bg-gold hover:text-black transition-all">Sắp diễn</a>}
        {ERAS.map(e => (
          <a key={e.id} href={`#${e.id}`} className="px-5 py-2 rounded-full bg-white/5 text-white/70 text-sm font-bold hover:bg-white/10 hover:text-white transition-all">{e.range}</a>
        ))}
      </div>

      {/* Sắp diễn */}
      {upcoming && (
        <section id="sap-dien" className="max-w-7xl mx-auto px-6 mb-24 scroll-mt-28">
          <motion.div {...fadeUp} className="grid md:grid-cols-2 bg-card border border-white/10 rounded-3xl overflow-hidden">
            <div className="aspect-[16/10] md:aspect-auto">
              <img src={upcoming.imageUrl} alt={upcoming.title} className="w-full h-full object-cover object-left" />
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="text-gold uppercase tracking-[0.25em] text-xs font-bold mb-4 flex items-center gap-2"><Calendar size={14} /> Sắp diễn · {upcoming.date}</div>
              <h2 className="serif text-5xl md:text-6xl font-bold mb-4">{upcoming.title}</h2>
              <p className="text-white/60 text-lg leading-relaxed mb-8">{upcoming.description}</p>
              <Link to="/dac-lo" className="self-start inline-flex items-center gap-2 bg-gold text-black px-7 py-3.5 rounded-full font-bold hover:bg-white transition-all">
                XEM CHI TIẾT <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </section>
      )}

      {ERAS.map(e => {
        const items = archived.filter(p => { const k = playSortKey(p.date); return k >= e.from && k <= e.to; });
        if (!items.length) return null;
        return (
          <section key={e.id} id={e.id} className="max-w-7xl mx-auto px-6 pb-24 scroll-mt-28">
            <motion.div {...fadeUp} className="grid lg:grid-cols-[0.8fr_1.2fr] gap-6 lg:gap-16 items-end mb-12 border-t border-white/10 pt-12">
              <div>
                <Eyebrow>{e.range}</Eyebrow>
                <h2 className="text-4xl md:text-5xl font-bold serif">{e.title}</h2>
              </div>
              <p className="text-white/55 text-lg font-light leading-relaxed">{e.desc}</p>
            </motion.div>
            <ProjectGrid items={items} />
          </section>
        );
      })}
    </div>
  );
}
