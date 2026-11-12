import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import DacLoPage from './pages/DacLoPage';
import PlaysPage from './pages/PlaysPage';
import ActivitiesPage from './pages/ActivitiesPage';
import StoryPage from './pages/StoryPage';
import CastingPage from './pages/CastingPage';
import ContactPage from './pages/ContactPage';
import UpdateChecker from './components/UpdateChecker';

// Trang 3D nặng (three.js) — chỉ tải khi mở trang
const StageMapPage = lazy(() => import('./pages/StageMapPage'));
const CampusMapPage = lazy(() => import('./pages/CampusMapPage'));

/** Hiện trong lúc tải mã trang 3D, để không có màn hình đen trống. */
const Loading3D = ({ label }: { label: string }) => (
  <div className="h-screen flex flex-col items-center justify-center gap-4 text-white/60" role="status">
    <div className="w-8 h-8 rounded-full border-2 border-white/15 border-t-gold animate-spin" />
    <span className="text-sm tracking-wide">{label}</span>
  </div>
);

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
      {/* reducedMotion="user": máy bật "giảm chuyển động" thì tắt hiệu ứng trượt/phóng, chỉ giữ đổi độ mờ */}
      <MotionConfig reducedMotion="user">
      <UpdateChecker />
      <ScrollManager />
      <div className="min-h-screen selection:bg-gold selection:text-black">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dac-lo" element={<DacLoPage />} />
          <Route path="/dac-lo/so-do" element={<Suspense fallback={<Loading3D label="Đang tải sơ đồ sân khấu…" />}><StageMapPage /></Suspense>} />
          <Route path="/dac-lo/khuon-vien" element={<Suspense fallback={<Loading3D label="Đang tải bản đồ khuôn viên…" />}><CampusMapPage /></Suspense>} />
          <Route path="/vo-dien" element={<PlaysPage />} />
          <Route path="/hoat-dong" element={<ActivitiesPage />} />
          <Route path="/cau-chuyen" element={<StoryPage />} />
          <Route path="/tuyen-dien-vien" element={<CastingPage />} />
          <Route path="/lien-he" element={<ContactPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
        <Footer />
      </div>
      </MotionConfig>
    </BrowserRouter>
  );
}
