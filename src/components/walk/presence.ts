/**
 * Nhiều người cùng dạo khuôn viên — đồng bộ vị trí theo thời gian thực.
 *
 * Bản thử dùng Trystero (WebRTC ngang hàng, tìm nhau qua các relay Nostr công cộng): không cần máy chủ hay tài khoản.
 * Phù hợp vài chục người cùng lúc. Khi cần đông hơn / ổn định hơn, chỉ cần đổi `import('trystero')`
 * sang `import('trystero/supabase')` hoặc `'trystero/firebase'` kèm cấu hình của dịch vụ đó.
 * Ngoài ra còn kênh BroadcastChannel để các tab trên cùng một máy thấy nhau (tiện thử nghiệm).
 */
import { useEffect, useRef, useState } from 'react';

export type PlayerState = { [k: string]: string | number; n: string; c: string; x: number; y: number; z: number; r: number; m: number };
export type Remote = PlayerState & { t: number };
export type Net = { peers: React.MutableRefObject<Map<string, Remote>>; send: React.MutableRefObject<(s: PlayerState) => void> };
export type NetStatus = 'off' | 'connecting' | 'online' | 'local';

const APP_ID = 'ckcgsg-website-dac-lo-2027';
const ROOM = 'khuon-vien-ttmv-v1';

export function usePresence(active: boolean) {
  const peers = useRef(new Map<string, Remote>());
  const send = useRef<(s: PlayerState) => void>(() => {});
  const [count, setCount] = useState(1);
  const [ids, setIds] = useState<string[]>([]);
  const [status, setStatus] = useState<NetStatus>('off');

  useEffect(() => {
    if (!active) return;
    let alive = true, last: PlayerState | null = null;
    let netSend: ((s: PlayerState) => void) | null = null, leave: (() => void) | null = null;
    const myId = Math.random().toString(36).slice(2);
    const put = (id: string, s: PlayerState) => peers.current.set(id, { ...s, t: performance.now() });

    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('ckcgsg-dao-khuon-vien');
      bc.onmessage = e => { const d = e.data; if (!d || d.id === myId) return; if (d.bye) peers.current.delete('bc-' + d.id); else put('bc-' + d.id, d.s); };
    } catch { /* trình duyệt cũ */ }

    setStatus('connecting');
    import('trystero').then(({ joinRoom }) => {
      if (!alive) return;
      const room = joinRoom({ appId: APP_ID }, ROOM, { onJoinError: () => setStatus('local') });
      const act = room.makeAction<PlayerState>('st');
      act.onMessage = (d, ctx) => { put(ctx.peerId, d); setStatus('online'); };
      room.onPeerJoin = () => { setStatus('online'); if (last) act.send(last).catch(() => {}); };
      room.onPeerLeave = id => peers.current.delete(id);
      netSend = s => { act.send(s).catch(() => {}); };
      leave = () => { room.leave(); };
      // sau vài giây chưa ai vào thì vẫn coi là đã kết nối (đang chờ người khác)
      setTimeout(() => alive && setStatus(s => (s === 'connecting' ? 'online' : s)), 4000);
    }).catch(() => alive && setStatus('local'));

    send.current = s => { last = s; bc?.postMessage({ id: myId, s }); netSend?.(s); };
    const iv = setInterval(() => {
      const now = performance.now();
      for (const [id, p] of peers.current) if (now - p.t > 8000) peers.current.delete(id);
      const list = [...peers.current.keys()];
      setIds(prev => (prev.length === list.length && prev.every((x, i) => x === list[i]) ? prev : list));
      setCount(list.length + 1);
    }, 700);

    return () => {
      alive = false;
      try { bc?.postMessage({ id: myId, bye: 1 }); bc?.close(); } catch { /* bỏ qua */ }
      leave?.(); clearInterval(iv); peers.current.clear(); send.current = () => {};
      setIds([]); setCount(1); setStatus('off');
    };
  }, [active]);

  return { net: { peers, send } as Net, ids, count, status };
}
