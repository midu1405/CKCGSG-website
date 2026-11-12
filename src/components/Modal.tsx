import React, { useEffect, useId, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Youtube, Check } from 'lucide-react';
import { Project } from '../types';

/** Link chia sẻ trỏ thẳng tới popup này: trang hiện tại + `?vo=<id>`. */
function shareUrl(id: string) {
  const u = new URL(window.location.href);
  u.hash = '';
  u.search = '';
  u.searchParams.set('vo', id);
  return u.toString();
}

const Modal = ({ project, onClose }: { project: Project, onClose: () => void }) => {
  const allImages = project.images ? [project.imageUrl, ...project.images] : [project.imageUrl];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; });

  // Mở popup: khoá cuộn trang phía sau, focus vào nút X, Esc để đóng, Tab không thoát ra ngoài popup.
  // Đóng popup: trả lại cuộn trang và focus về chỗ cũ (thẻ vở vừa bấm).
  useEffect(() => {
    const body = document.body;
    const prev = [body.style.overflow, body.style.paddingRight];
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onCloseRef.current(); return; }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const items = dialogRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      [body.style.overflow, body.style.paddingRight] = prev;
      opener?.focus?.({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };
  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleShare = async () => {
    const url = shareUrl(project.id);
    if (navigator.share) {
      try { await navigator.share({ title: project.title, text: project.description, url }); return; }
      catch (e) { if ((e as Error)?.name === 'AbortError') return; }
    }
    try { await navigator.clipboard.writeText(url); setCopied(true); }
    catch { window.prompt('Sao chép link bài viết:', url); }
  };

  // Mũi tên: điện thoại / màn cảm ứng luôn hiện; máy có chuột (từ md) hiện khi rê chuột hoặc khi dùng phím Tab.
  const arrowCls = 'absolute top-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full text-white transition-opacity hover:bg-gold hover:text-black focus-visible:opacity-100 z-10 md:pointer-fine:opacity-0 md:pointer-fine:group-hover:opacity-100';

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        ref={dialogRef}
        role="dialog" aria-modal="true" aria-labelledby={titleId}
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className="bg-card border border-white/10 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút X nằm ngoài vùng cuộn → luôn thấy khi đọc dài */}
        <button ref={closeRef} onClick={onClose} aria-label="Đóng"
          className="absolute top-4 right-4 md:top-6 md:right-6 text-white/80 hover:text-white z-20 bg-black/60 p-2.5 rounded-full backdrop-blur-md focus-visible:outline-2 focus-visible:outline-gold">
          <X size={24} />
        </button>
        <div className="overflow-y-auto overscroll-contain">
        <div className="aspect-video w-full overflow-hidden relative group bg-black/20">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex} src={allImages[currentImageIndex]} alt={`${project.title} - ảnh ${currentImageIndex + 1}`}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }} className="w-full h-full object-cover" referrerPolicy="no-referrer"
            />
          </AnimatePresence>
          {allImages.length > 1 && (
            <>
              <button onClick={prevImage} aria-label="Ảnh trước" className={`${arrowCls} left-3 md:left-4`}>
                <ChevronLeft size={24} />
              </button>
              <button onClick={nextImage} aria-label="Ảnh sau" className={`${arrowCls} right-3 md:right-4`}>
                <ChevronRight size={24} />
              </button>
              <div className="absolute bottom-3 md:bottom-5 left-1/2 -translate-x-1/2 flex z-10">
                {allImages.map((_, i) => (
                  <button key={i} onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i); }}
                    aria-label={`Xem ảnh ${i + 1}`} aria-current={i === currentImageIndex ? 'true' : undefined}
                    className="h-7 min-w-7 px-1 flex items-center justify-center">
                    <span className={`block h-2 rounded-full transition-all ${i === currentImageIndex ? 'bg-gold w-6' : 'bg-white/50 w-2'}`} />
                  </button>
                ))}
              </div>
              <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-black/50 px-3 py-1 rounded-full text-[10px] font-bold text-white tracking-widest uppercase backdrop-blur-md z-10">
                {currentImageIndex + 1} / {allImages.length}
              </div>
            </>
          )}
        </div>
        <div className="p-5 md:p-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-gold uppercase tracking-[0.3em] text-xs font-bold">Dự án CKCGSG</span>
            {project.date && <span className="text-white/40 text-xs tabular-nums tracking-wider whitespace-nowrap">{project.date}</span>}
          </div>
          <h2 id={titleId} className="text-4xl md:text-5xl font-bold serif mb-8 text-gold text-balance">{project.title}</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-xl text-white/80 leading-relaxed mb-8 font-light italic border-l-4 border-gold pl-6">
              {project.description}
            </p>
            <div className="text-white/60 leading-relaxed space-y-6 text-lg">
              {project.content?.split('\n').map((para, i) => <p key={i}>{para}</p>)}
            </div>
          </div>
          <div className="mt-12 pt-12 border-t border-white/5 flex flex-wrap gap-4">
            {project.youtubeUrl && (
              <a href={project.youtubeUrl} target="_blank" rel="noopener noreferrer"
                className="bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition-all flex items-center gap-2">
                <Youtube size={20} /> XEM TRÊN YOUTUBE
              </a>
            )}
            <button onClick={handleShare} aria-live="polite"
              className="bg-gold text-black px-8 py-3 rounded-full font-bold hover:bg-white transition-all inline-flex items-center gap-2">
              {copied ? <><Check size={18} /> ĐÃ SAO CHÉP LINK</> : 'CHIA SẺ BÀI VIẾT'}
            </button>
            <button onClick={onClose} className="border border-white/10 px-8 py-3 rounded-full font-bold hover:bg-white/5 transition-all">
              QUAY LẠI
            </button>
          </div>
        </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Modal;
