import { motion } from 'motion/react';
import { ChevronRight, Image as ImageIcon } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      onClick={() => onClick(project)}
      className="group relative bg-card border border-white/5 rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:blur-sm group-hover:opacity-40"
          referrerPolicy="no-referrer"
        />
        {project.images && project.images.length > 0 && (
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md p-2 rounded-lg text-gold flex items-center gap-2 z-10 border border-white/10">
            <ImageIcon size={16} />
            <span className="text-[10px] font-bold tracking-widest">+{project.images.length}</span>
          </div>
        )}
        <div className="absolute inset-0 flex flex-col justify-end p-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
          <div className="text-gold text-xs font-bold uppercase tracking-widest mb-2">Xem chi tiết</div>
          <h3 className="text-2xl font-bold serif text-white mb-3">{project.title}</h3>
          <p className="text-white/70 text-sm line-clamp-3 leading-relaxed mb-4">{project.description}</p>
          <div className="flex items-center text-gold text-sm font-bold gap-2">
            ĐỌC BÀI VIẾT <ChevronRight size={16} />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent group-hover:opacity-0 transition-opacity duration-500" />
        <div className="absolute bottom-0 left-0 w-full p-8 group-hover:opacity-0 transition-opacity duration-500">
          <div className="flex justify-between items-end">
            <div>
              <div className="text-gold/60 text-[10px] uppercase tracking-[0.2em] font-bold mb-1">CKCGSG</div>
              <h3 className="text-xl font-bold serif text-white">{project.title}</h3>
            </div>
            {project.date && <span className="text-[10px] text-white/30 font-mono">{project.date}</span>}
          </div>
        </div>
        {project.status === 'upcoming' && (
          <div className="absolute top-4 left-4 bg-gold text-black px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-tighter z-10">
            Sắp ra mắt
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectCard;