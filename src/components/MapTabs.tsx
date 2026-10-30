import { Link } from 'react-router-dom';

/** Thanh chuyển giữa 2 sơ đồ của Đắc Lộ */
export default function MapTabs({ active }: { active: 'stage' | 'campus' }) {
  const cls = (on: boolean) => `px-3 py-1.5 rounded-full text-xs font-bold transition-all ${on ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`;
  return (
    <div className="inline-flex bg-black/70 backdrop-blur border border-white/10 rounded-full p-1">
      <Link to="/dac-lo/so-do" className={cls(active === 'stage')}>Sân khấu 3D</Link>
      <Link to="/dac-lo/khuon-vien" className={cls(active === 'campus')}>Khuôn viên</Link>
    </div>
  );
}

