import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Youtube } from 'lucide-react';
import { Project } from '../types';

const Modal = ({ project, onClose }: { project: Project, onClose: () => void }) => {
  const allImages = project.images ? [project.imageUrl, ...project.images] : [project.imageUrl];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };
  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: project.title, text: project.description, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Đã copy link!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className="bg-card border border-white/10 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white z-20 bg-black/50 p-2 rounded-full backdrop-blur-md">
          <X size={24} />
        </button>
        <div className="aspect-video w-full overflow-hidden relative group bg-black/20">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex} src={allImages[currentImageIndex]} alt={`${project.title} - ${currentImageIndex + 1}`}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }} className="w-full h-full object-cover" referrerPolicy="no-referrer"
            />
          </AnimatePresence>
          {allImages.length > 1 && (
            <>
              <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gold hover:text-black z-10">
                <ChevronLeft size={24} />
              </button>
              <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gold hover:text-black z-10">
                <ChevronRight size={24} />
              </button>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {allImages.map((_, i) => (
                  <button key={i} onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i); }}
                    className={`w-2 h-2 rounded-full transition-all ${i === currentImageIndex ? 'bg-gold w-6' : 'bg-white/30'}`} />
                ))}
              </div>
              <div className="absolute top-6 left-6 bg-black/50 px-3 py-1 rounded-full text-[10px] font-bold text-white tracking-widest uppercase backdrop-blur-md z-10">
                {currentImageIndex + 1} / {allImages.length}
              </div>
            </>
          )}
        </div>
        <div className="p-5 md:p-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-gold uppercase tracking-[0.3em] text-xs font-bold">Dự án CKCGSG</span>
            {project.date && <span className="text-white/30 text-xs font-mono">{project.date}</span>}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold serif mb-8 text-gold">{project.title}</h2>
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
            <button onClick={handleShare} className="bg-gold text-black px-8 py-3 rounded-full font-bold hover:bg-white transition-all">
              CHIA SẺ BÀI VIẾT
            </button>
            <button onClick={onClose} className="border border-white/10 px-8 py-3 rounded-full font-bold hover:bg-white/5 transition-all">
              QUAY LẠI
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Modal;