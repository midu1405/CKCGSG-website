/**
 * Tự cập nhật khi web có bản mới: trang mở lâu (tab cũ) vẫn chạy mã cũ — ví dụ form chưa nối Supabase.
 * - Khi chuyển trang: nếu đã có bản mới thì tải lại hẳn trang đích (người dùng không mất gì).
 * - Khi quay lại tab sau một lúc: hiện thanh nhỏ "Đã có phiên bản mới · Tải lại".
 */
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';

declare const __BUILD_ID__: string;
const CURRENT = typeof __BUILD_ID__ === 'string' ? __BUILD_ID__ : 'dev';

async function latestId(): Promise<string | null> {
  try {
    const r = await fetch('/version.json?t=' + Date.now(), { cache: 'no-store' });
    if (!r.ok) return null;
    return (await r.json()).id ?? null;
  } catch { return null; }
}

export default function UpdateChecker() {
  const { pathname } = useLocation();
  const [stale, setStale] = useState(false);
  const staleRef = useRef(false);
  const first = useRef(true);
  const lastCheck = useRef(0);

  const check = async () => {
    if (CURRENT === 'dev' || staleRef.current) return staleRef.current;
    const now = Date.now();
    if (now - lastCheck.current < 30_000) return false;
    lastCheck.current = now;
    const id = await latestId();
    if (id && id !== CURRENT) { staleRef.current = true; setStale(true); }
    return staleRef.current;
  };

  // chuyển trang khi đã có bản mới → tải lại trang đích
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (staleRef.current) { window.location.reload(); return; }
    check().then(s => { if (s) window.location.reload(); });
  }, [pathname]);

  // quay lại tab / định kỳ 5 phút → kiểm tra
  useEffect(() => {
    const onVis = () => { if (document.visibilityState === 'visible') check(); };
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('focus', onVis);
    const iv = setInterval(onVis, 5 * 60_000);
    return () => { document.removeEventListener('visibilitychange', onVis); window.removeEventListener('focus', onVis); clearInterval(iv); };
  }, []);

  if (!stale) return null;
  return (
    <button onClick={() => window.location.reload()}
      className="fixed z-[9999] bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-gold text-black px-5 py-2.5 text-sm font-bold shadow-2xl">
      <RefreshCw size={16} /> Đã có phiên bản mới · Tải lại
    </button>
  );
}
