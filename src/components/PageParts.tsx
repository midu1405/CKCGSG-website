import { useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSearchParams } from 'react-router-dom';
import { Project } from '../types';
import Modal from './Modal';
import ProjectCard from './ProjectCard';

export function Eyebrow({ children, center = false }: { children: ReactNode; center?: boolean }) {
  return (
    <div className={`flex items-center gap-3.5 mb-5 ${center ? 'justify-center' : ''}`}>
      <span className="w-9 h-px bg-gold shrink-0" />
      <span className="text-gold uppercase tracking-[0.25em] text-xs font-bold">{children}</span>
      {center && <span className="w-9 h-px bg-gold shrink-0" />}
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

/**
 * Popup chi tiết gắn với tham số `?vo=<id>` trên địa chỉ trang — để link chia sẻ mở thẳng đúng vở.
 * `selected` là mục trong `items` khớp `?vo=`; id không có trong `items` → không mở gì (không báo lỗi).
 * `open(p)` đặt `?vo=p.id`, `close()` xoá tham số. Dùng `replace` nên không chồng thêm lịch sử trình duyệt.
 */
export function useVoParam(items: Project[]) {
  const [params, setParams] = useSearchParams();
  const id = params.get('vo');
  const selected = id ? items.find(p => p.id === id) ?? null : null;
  const open = useCallback((p: Project) => {
    setParams(prev => { const n = new URLSearchParams(prev); n.set('vo', p.id); return n; }, { replace: true, preventScrollReset: true });
  }, [setParams]);
  const close = useCallback(() => {
    setParams(prev => { const n = new URLSearchParams(prev); n.delete('vo'); return n; }, { replace: true, preventScrollReset: true });
  }, [setParams]);
  return { selected, open, close };
}

/** Lưới thẻ vở diễn / chương trình; bấm thẻ mở popup chi tiết (đồng bộ với `?vo=<id>`). */
export function ProjectGrid({ items }: { items: Project[] }) {
  const { selected, open, close } = useVoParam(items);
  return (
    <>
      <AnimatePresence>{selected && <Modal key={selected.id} project={selected} onClose={close} />}</AnimatePresence>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {items.map(p => <ProjectCard key={p.id} project={p} onClick={open} />)}
      </div>
    </>
  );
}
