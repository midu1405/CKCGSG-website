import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import DacLoPage from './pages/DacLoPage';
import PlaysPage from './pages/PlaysPage';
import ActivitiesPage from './pages/ActivitiesPage';
import StoryPage from './pages/StoryPage';
import CastingPage from './pages/CastingPage';
import ContactPage from './pages/ContactPage';

/** Sang trang mới thì lên đầu trang; nếu link có #mục thì cuộn tới mục đó. */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 80);
      return () => clearTimeout(t);
    }
    window.scrollTo({ top: 0 });
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <div className="min-h-screen selection:bg-gold selection:text-black">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dac-lo" element={<DacLoPage />} />
          <Route path="/vo-dien" element={<PlaysPage />} />
          <Route path="/hoat-dong" element={<ActivitiesPage />} />
          <Route path="/cau-chuyen" element={<StoryPage />} />
          <Route path="/tuyen-dien-vien" element={<CastingPage />} />
          <Route path="/lien-he" element={<ContactPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
