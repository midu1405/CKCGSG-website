/**
 * Tự cập nhật khi web có bản mới: trang mở lâu (tab cũ) vẫn chạy mã cũ — ví dụ form chưa nối Supabase.
 * - Khi chuyển trang: nếu đã có bản mới thì tải lại hẳn trang đích (người dùng không mất gì).
 *   Riêng khi trang đích có ô đang nhập dở → không tự tải lại, chỉ hiện thanh báo.
 * - Khi quay lại tab sau một lúc: hiện thanh nhỏ "Đã có phiên bản mới · Tải lại".
 *   Đang có chữ gõ dở thì lần bấm đầu chỉ cảnh báo, bấm lần nữa mới tải lại.
 *   Nút ✕ ẩn thanh; 10 phút sau thanh hiện lại.
 */
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { RefreshCw, X } from 'lucide-react';

declare const __BUILD_ID__: string;
const CURRENT = typeof __BUILD_ID__ === 'string' ? __BUILD_ID__ : 'dev';
const SNOOZE_MS = 10 * 60_000;
const ARM_MS = 8_000;

async function latestId(): Promise<string | null> {
  try {
    const r = await fetch('/version.json?t=' + Date.now(), { cache: 'no-store' });
    if (!r.ok) return null;
    return (await r.json()).id ?? null;
  } catch { return null; }
}

/** Trang đang có ô nhập chữ đã gõ (input chữ / textarea có nội dung, hoặc select đã chọn khác lựa chọn trống đầu tiên). */
const SKIP_TYPES = new Set(['hidden', 'submit', 'button', 'reset', 'checkbox', 'radio', 'range', 'color', 'file', 'image']);
function hasUnsavedInput(): boolean {
  for (const el of document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('input, textarea, select')) {
    if (el.disabled) continue;
    if (el instanceof HTMLSelectElement) {
      if (el.value !== '' && el.options[0]?.value === '') return true;
      continue;
    }
    if (el instanceof HTMLInputElement && SKIP_TYPES.has(el.type)) continue;
    if (el.value.trim() !== '') return true;
  }
  return false;
}

export default function UpdateChecker() {
  const { pathname } = useLocation();
  const [stale, setStale] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [armed, setArmed] = useState(false);
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

  // chuyển trang khi đã có bản mới → tải lại trang đích (trừ khi trang đích đã có ô nhập dở)
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const reloadIfSafe = () => { if (!hasUnsavedInput()) window.location.reload(); };
    if (staleRef.current) { reloadIfSafe(); return; }
    check().then(s => { if (s) reloadIfSafe(); });
  }, [pathname]);

  // quay lại tab / định kỳ 5 phút → kiểm tra
  useEffect(() => {
    const onVis = () => { if (document.visibilityState === 'visible') check(); };
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('focus', onVis);
    const iv = setInterval(onVis, 5 * 60_000);
    return () => { document.removeEventListener('visibilitychange', onVis); window.removeEventListener('focus', onVis); clearInterval(iv); };
  }, []);

  // ẩn thanh → 10 phút sau hiện lại
  useEffect(() => {
    if (!hidden) return;
    const t = setTimeout(() => setHidden(false), SNOOZE_MS);
    return () => clearTimeout(t);
  }, [hidden]);

  // lời cảnh báo tự trở lại như cũ nếu không bấm lần hai
  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), ARM_MS);
    return () => clearTimeout(t);
  }, [armed]);

  const reload = () => {
    if (!armed && hasUnsavedInput()) { setArmed(true); return; }
    window.location.reload();
  };

  if (!stale || hidden) return null;
  return (
    <div role="status"
      className="fixed z-[9999] bottom-4 left-1/2 -translate-x-1/2 w-max max-w-[calc(100vw-2rem)] flex items-center rounded-full bg-dark/95 backdrop-blur-md border border-gold/70 text-white shadow-2xl">
      <button onClick={reload}
        className={`flex items-center gap-2 min-h-11 pl-5 pr-2 py-2 text-sm font-bold text-left hover:text-gold transition-colors ${armed ? 'text-balance' : 'whitespace-nowrap'}`}>
        <RefreshCw size={16} className="shrink-0 text-gold" />
        {armed
          ? <span className="text-gold">Bấm lần nữa để tải lại — chữ đang gõ sẽ mất</span>
          : <span>Đã có phiên bản mới · <span className="text-gold underline underline-offset-2">Tải lại</span></span>}
      </button>
      <button onClick={() => { setHidden(true); setArmed(false); }} aria-label="Ẩn thông báo phiên bản mới"
        className="shrink-0 w-11 h-11 flex items-center justify-center rounded-full text-white/70 hover:text-white">
        <X size={18} />
      </button>
    </div>
  );
}
