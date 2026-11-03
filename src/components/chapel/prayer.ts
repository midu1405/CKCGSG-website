/**
 * Dữ liệu cầu nguyện trong Nhà nguyện (Supabase):
 * - Thắp nến: hàm light_candle (giới hạn chung 60 nến / phút). Giá nến hiện số nến trong 24 giờ.
 * - Ý cầu nguyện: hàm submit_intention lưu ở trạng thái CHỜ DUYỆT; chỉ ý đã duyệt (approved = true) mới hiện cho mọi người.
 *   Duyệt trong Supabase → Table Editor → bảng intentions → tích cột approved.
 * Khi ai đó thắp nến / gửi ý, một tín hiệu được phát qua kênh realtime để mọi người cập nhật số liệu.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { getSupabase } from '../../lib/supabase';

export type Intention = { id: number; created_at: string; name: string | null; body: string };
export type Stats = { candlesToday: number; candlesTotal: number; notes: number };
const PENDING_KEY = 'ckcgsg-y-cau-nguyen-cho-duyet';

const loadPending = (): string[] => { try { return JSON.parse(localStorage.getItem(PENDING_KEY) || '[]'); } catch { return []; } };

export function usePrayer(active: boolean) {
  const [stats, setStats] = useState<Stats>({ candlesToday: 0, candlesTotal: 0, notes: 0 });
  const [list, setList] = useState<Intention[]>([]);
  const [pending, setPending] = useState<string[]>(loadPending);
  const [error, setError] = useState('');
  const ch = useRef<RealtimeChannel | null>(null);
  const lastCandle = useRef(0);

  const refresh = useCallback(async () => {
    try {
      const sb = await getSupabase();
      const [s, l] = await Promise.all([
        sb.rpc('chapel_stats').single<{ candles_today: number; candles_total: number; notes: number }>(),
        sb.from('intentions').select('id, created_at, name, body').order('created_at', { ascending: false }).limit(60),
      ]);
      if (s.data) setStats({ candlesToday: Number(s.data.candles_today), candlesTotal: Number(s.data.candles_total), notes: Number(s.data.notes) });
      if (l.data) setList(l.data as Intention[]);
    } catch { /* mất mạng: giữ số cũ */ }
  }, []);

  useEffect(() => {
    if (!active) return;
    let alive = true;
    refresh();
    getSupabase().then(sb => {
      if (!alive) return;
      ch.current = sb.channel('nha-nguyen-su-kien').on('broadcast', { event: 'refresh' }, () => refresh()).subscribe();
    });
    const iv = setInterval(refresh, 60000);
    return () => { alive = false; clearInterval(iv); if (ch.current) getSupabase().then(sb => { sb.removeChannel(ch.current!); ch.current = null; }); };
  }, [active, refresh]);

  const ping = () => ch.current?.send({ type: 'broadcast', event: 'refresh', payload: {} });

  /** Thắp một ngọn nến (mỗi người cách nhau ít nhất 20 giây) */
  const lightCandle = useCallback(async () => {
    const now = Date.now();
    if (now - lastCandle.current < 20000) { setError('Nến của bạn đang cháy — xin đợi một chút rồi thắp tiếp.'); return false; }
    lastCandle.current = now; setError('');
    setStats(s => ({ ...s, candlesToday: s.candlesToday + 1, candlesTotal: s.candlesTotal + 1 }));
    try {
      const sb = await getSupabase();
      const { error: e } = await sb.rpc('light_candle');
      if (e) throw e;
      ping(); return true;
    } catch (e) { setError((e as { message?: string }).message || 'Chưa thắp được nến, xin thử lại.'); refresh(); return false; }
  }, [refresh]);

  /** Gửi ý cầu nguyện (chờ duyệt) */
  const submit = useCallback(async (name: string, body: string) => {
    const b = body.replace(/\s+/g, ' ').trim();
    if (b.length < 3) { setError('Ý cầu nguyện cần ít nhất 3 ký tự.'); return false; }
    setError('');
    try {
      const sb = await getSupabase();
      const { error: e } = await sb.rpc('submit_intention', { p_name: name.trim().slice(0, 40) || null, p_body: b.slice(0, 300) });
      if (e) throw e;
      const next = [b, ...pending].slice(0, 10);
      setPending(next); try { localStorage.setItem(PENDING_KEY, JSON.stringify(next)); } catch { /* bỏ qua */ }
      return true;
    } catch (e) { setError((e as { message?: string }).message || 'Chưa gửi được, xin thử lại.'); return false; }
  }, [pending]);

  return { stats, list, pending, error, setError, lightCandle, submit, refresh };
}
