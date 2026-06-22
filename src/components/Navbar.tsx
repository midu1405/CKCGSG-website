import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LOGO_IMG from '../assets/LOGO_MAIN_W.png';

const navLinks = [
  { name: 'Câu Chuyện', section: 'story' },
  { name: 'Tuyển Diễn Viên', section: 'casting' },
  { name: 'Ca Kịch', section: 'plays' },
  { name: 'Thiện Nguyện', section: 'charity' },
  { name: 'Liên Hệ', section: 'contact' },
];

const Logo = ({ onClick }: { onClick?: () => void }) => (
  <Link to="/" onClick={onClick}>
    <img src={LOGO_IMG} alt="CKCGSG" className="h-12 w-auto object-contain" />
  </Link>
);

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goToSection = (section: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (location.pathname === '/') {
      document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' }), 120);
    }
  };

  const navClass = `fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
    isScrolled ? 'bg-black/90 backdrop-blur-md py-4 shadow-xl' : 'bg-transparent py-6'
  }`;

  return (
    <nav className={navClass}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Logo onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <a key={link.name} href={`/#${link.section}`} onClick={goToSection(link.section)}
              className="text-sm uppercase tracking-widest hover:text-gold transition-colors duration-300 font-medium cursor-pointer">
              {link.name}
            </a>
          ))}
          <Link to="/dac-lo"
            className="border border-white/20 px-5 py-2 rounded-full text-sm uppercase tracking-widest font-medium hover:bg-gold hover:text-black hover:border-gold transition-all duration-300">
            Vở Đắc Lộ →
          </Link>
        </div>

        <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-black border-t border-white/10 py-8 px-6 flex flex-col gap-6 md:hidden">
            {navLinks.map(link => (
              <a key={link.name} href={`/#${link.section}`} onClick={goToSection(link.section)}
                className="text-lg uppercase tracking-widest hover:text-gold transition-colors cursor-pointer">
                {link.name}
              </a>
            ))}
            <Link to="/dac-lo" onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg uppercase tracking-widest text-gold font-bold">
              Vở Đắc Lộ →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
