import { Youtube, Mail } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import LOGO_IMG from '../assets/LOGO_MAIN_W.png';
import { NAV_LINKS } from './Navbar';

const Footer = () => {
  const { pathname } = useLocation();
  if (pathname === '/dac-lo/so-do') return null; // trang sơ đồ 3D dùng toàn màn hình
  return (
  <footer className="pt-16 pb-10 border-t border-white/5">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr] mb-14">
        <div>
          <img src={LOGO_IMG} alt="CKCGSG" className="h-14 w-auto object-contain mb-5" />
          <p className="text-white/45 text-sm leading-relaxed max-w-sm">
            Nhóm Ca Kịch Công Giáo Sài Gòn — mang Tin Mừng đến mọi người qua nghệ thuật ca kịch, miễn phí cho cộng đồng từ năm 2014.
          </p>
        </div>
        <div>
          <div className="text-gold uppercase tracking-[0.2em] text-xs font-bold mb-5">Khám phá</div>
          <ul className="space-y-3 text-sm">
            <li><Link to="/dac-lo" className="text-white/60 hover:text-gold transition-colors">Vở Đắc Lộ 2027</Link></li>
            {NAV_LINKS.map(l => (
              <li key={l.to}><Link to={l.to} className="text-white/60 hover:text-gold transition-colors">{l.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-gold uppercase tracking-[0.2em] text-xs font-bold mb-5">Kết nối</div>
          <ul className="space-y-3 text-sm text-white/60">
            <li><a href="mailto:ckcgsg@gmail.com" className="hover:text-gold transition-colors">ckcgsg@gmail.com</a></li>
            <li><a href="https://www.facebook.com/CKCGSG" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">Facebook</a></li>
            <li><a href="https://www.youtube.com/@CKCGSG" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">YouTube</a></li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/5">
        <div className="text-white/30 text-xs uppercase tracking-widest font-medium text-center">
          © {new Date().getFullYear()} Nhóm Ca Kịch Công Giáo Sài Gòn
        </div>
        <div className="flex gap-6">
          <a href="https://www.youtube.com/@CKCGSG" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-white/40 hover:text-gold transition-colors"><Youtube size={20} /></a>
          <a href="https://www.facebook.com/CKCGSG" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-white/40 hover:text-gold transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
          </a>
          <a href="mailto:ckcgsg@gmail.com" aria-label="Email" className="text-white/40 hover:text-gold transition-colors"><Mail size={20} /></a>
        </div>
      </div>
    </div>
  </footer>
  );
};

export default Footer;
