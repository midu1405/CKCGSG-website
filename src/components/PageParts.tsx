import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project } from '../types';
import Modal from './Modal';
import ProjectCard from './ProjectCard';

export function Eyebrow({ children, center = false }: { children: ReactNode; center?: boolean }) {
  return (
    <div className={`flex items-center gap-3.5 mb-5 ${center ? 'justify-center' : ''}`}>
      <span className="w-9 h-px bg-gold" />
      <span className="text-gold uppercase tracking-[0.25em] text-xs font-bold">{children}</span>
      {center && <span className="w-9 h-px bg-gold" />}
    </div>
  );
}

export const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

/** Đầu trang cho các trang con: nhãn, tiêu đề, đoạn giới thiệu, ảnh nền tuỳ chọn. */
export function PageHeader({ eyebrow, title, intro, image }: { eyebrow: string; title: ReactNode; intro?: ReactNode; image?: string }) {
  return (
    <section className="relative pt-40 pb-20 md:pt-48 md:pb-28 overflow-hidden">
      {image && (
        <div className="absolute inset-0">
          <img src={image} alt="" className="w-full h-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/80 via-dark/70 to-dark" />
        </div>
      )}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-3xl">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="text-5xl md:text-7xl font-bold serif leading-[1.02] mb-6 text-balance">{title}</h1>
          {intro && <p className="text-white/60 text-lg md:text-xl font-light leading-relaxed">{intro}</p>}
        </motion.div>
      </div>
    </section>
  );
}

/** Lưới thẻ vở diễn / chương trình; bấm thẻ mở popup chi tiết. */
export function ProjectGrid({ items }: { items: Project[] }) {
  const [selected, setSelected] = useState<Project | null>(null);
  return (
    <>
      <AnimatePresence>{selected && <Modal project={selected} onClose={() => setSelected(null)} />}</AnimatePresence>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {items.map(p => <ProjectCard key={p.id} project={p} onClick={setSelected} />)}
      </div>
    </>
  );
}
