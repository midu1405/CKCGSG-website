import { Youtube, Mail } from 'lucide-react';

const Footer = () => (
  <footer className="py-12 border-t border-white/5">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="serif text-xl font-semibold tracking-[0.05em] text-white">
        CKCGSG
      </div>
      <div className="text-white/30 text-xs uppercase tracking-widest font-medium text-center">
        © {new Date().getFullYear()} Nhóm Ca Kịch Công Giáo Sài Gòn. All rights reserved.
      </div>
      <div className="flex gap-6">
        <a href="https://www.youtube.com/@CKCGSG" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-gold transition-colors">
          <Youtube size={20} />
        </a>
        <a href="https://www.facebook.com/CKCGSG" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-gold transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
          </svg>
        </a>
        <a href="mailto:ckcgsg@gmail.com" className="text-white/40 hover:text-gold transition-colors">
          <Mail size={20} />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;