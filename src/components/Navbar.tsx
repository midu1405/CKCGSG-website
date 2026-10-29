import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import LOGO_IMG from '../assets/LOGO_MAIN_W.png';

export const NAV_LINKS = [
  { name: 'Vở diễn', to: '/vo-dien' },
  { name: 'Hoạt động', to: '/hoat-dong' },
  { name: 'Câu chuyện', to: '/cau-chuyen' },
  { name: 'Tuyển diễn viên', to: '/tuyen-dien-vien' },
  { name: 'Liên hệ', to: '/lien-he' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setIsOpen(false), [pathname]);

  const solid = isScrolled || isOpen;
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm uppercase tracking-widest font-medium transition-colors duration-300 hover:text-gold ${isActive ? 'text-gold' : ''}`;

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${solid ? 'bg-black/90 backdrop-blur-md py-4 shadow-xl' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" aria-label="Trang chủ">
          <img src={LOGO_IMG} alt="CKCGSG" className="h-12 w-auto object-contain" />
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map(l => <NavLink key={l.to} to={l.to} className={linkClass}>{l.name}</NavLink>)}
          <Link to="/dac-lo"
            className="bg-gold text-black px-5 py-2 rounded-full text-sm uppercase tracking-widest font-bold hover:bg-white transition-all duration-300">
            Vở Đắc Lộ →
          </Link>
        </div>

        <button className="lg:hidden text-white" aria-label="Mở menu" onClick={() => setIsOpen(o => !o)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-black border-t border-white/10 py-8 px-6 flex flex-col gap-6 lg:hidden">
            {NAV_LINKS.map(l => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => `text-lg uppercase tracking-widest ${isActive ? 'text-gold' : ''}`}>{l.name}</NavLink>
            ))}
            <Link to="/dac-lo" className="text-lg uppercase tracking-widest text-gold font-bold">Vở Đắc Lộ →</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
