/**
 * Dữ liệu cầu nguyện trong Nhà nguyện (Supabase):
 * - Thắp nến: hàm light_candle (giới hạn chung 60 nến / phút). Giá nến hiện số nến trong 24 giờ.
 * - Ý cầu nguyện: chọn trong danh sách CÓ SẴN (bảng intention_presets — sửa / thêm / ẩn ý trong Table Editor),
 *   hàm pray_intention ghi nhận ngay (không cần duyệt). Bảng ý hiện số người cùng cầu nguyện cho từng ý (hàm intention_counts).
 * Khi ai đó thắp nến / gửi ý, một tín hiệu được phát qua kênh realtime để mọi người cập nhật số liệu.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { getSupabase } from '../../lib/supabase';

export type Intention = { id: number; body: string; total: number; today: number };
export type Stats = { candlesToday: number; candlesTotal: number; notes: number };
const MINE_KEY = 'ckcgsg-y-cau-nguyen-da-chon';
const loadMine = (): number[] => { try { return JSON.parse(localStorage.getItem(MINE_KEY) || '[]'); } catch { return []; } };

export function usePrayer(active: boolean) {
  const [stats, setStats] = useState<Stats>({ candlesToday: 0, candlesTotal: 0, notes: 0 });
  const [list, setList] = useState<Intention[]>([]);
  const [mine, setMine] = useState<number[]>(loadMine);
  const [error, setError] = useState('');
  const ch = useRef<RealtimeChannel | null>(null);
  const lastCandle = useRef(0);
  const lastPray = useRef(0);

  const refresh = useCallback(async () => {
    try {
      const sb = await getSupabase();
      const [s, l] = await Promise.all([
        sb.rpc('chapel_stats').single<{ candles_today: number; candles_total: number; notes: number }>(),
        sb.rpc('intention_counts'),
      ]);
      if (s.data) setStats({ candlesToday: Number(s.data.candles_today), candlesTotal: Number(s.data.candles_total), notes: Number(s.data.notes) });
      if (l.data) setList((l.data as Intention[]).map(r => ({ ...r, total: Number(r.total), today: Number(r.today) })));
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

  /** Hiệp ý cầu nguyện theo một hay nhiều ý có sẵn (mỗi người cách nhau ít nhất 10 giây) */
  const pray = useCallback(async (ids: number[]) => {
    if (!ids.length) { setError('Xin chọn ít nhất một ý cầu nguyện.'); return false; }
    const now = Date.now();
    if (now - lastPray.current < 10000) { setError('Bạn vừa dâng ý cầu nguyện — xin đợi một chút.'); return false; }
    lastPray.current = now; setError('');
    try {
      const sb = await getSupabase();
      for (const id of ids.slice(0, 5)) { const { error: e } = await sb.rpc('pray_intention', { p_preset: id }); if (e) throw e; }
      const next = [...new Set([...ids, ...mine])].slice(0, 20);
      setMine(next); try { localStorage.setItem(MINE_KEY, JSON.stringify(next)); } catch { /* bỏ qua */ }
      setList(l => l.map(r => (ids.includes(r.id) ? { ...r, total: r.total + 1, today: r.today + 1 } : r)));
      setStats(s => ({ ...s, notes: s.notes + ids.length }));
      ping(); return true;
    } catch (e) { setError((e as { message?: string }).message || 'Chưa gửi được, xin thử lại.'); refresh(); return false; }
  }, [mine, refresh]);

  return { stats, list, mine, error, setError, lightCandle, pray, refresh };
}
