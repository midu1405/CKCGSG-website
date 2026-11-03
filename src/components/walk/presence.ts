/**
 * Nhiều người cùng dạo khuôn viên — đồng bộ vị trí, động tác và tin nhắn theo thời gian thực.
 *
 * Ưu tiên Supabase Realtime (máy chủ chuyển tin qua WebSocket — chạy được trên mọi mạng) khi có
 * VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY (khai báo trong Vercel → Settings → Environment Variables).
 * Không có thì dùng Trystero (WebRTC ngang hàng qua relay Nostr) — hay bị mạng di động / wifi công ty chặn.
 * Ngoài ra còn kênh BroadcastChannel để các tab trên cùng một máy thấy nhau (tiện thử nghiệm).
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { getSupabase, SB_KEY, SB_URL } from '../../lib/supabase';

/** n tên · x y z vị trí · r hướng · m đang đi · e động tác · k số lần làm động tác (để biết khi nào bắt đầu lại) · s đang ngồi */
export type PlayerState = { [k: string]: string | number; n: string; x: number; y: number; z: number; r: number; m: number; e: string; k: number; s: number };
export type Remote = PlayerState & { t: number };
export type ChatMsg = { [k: string]: string; n: string; t: string };
export type ChatLine = { id: string; name: string; text: string; mine: boolean; ts: number };
export type Bubble = { text: string; t: number };
export type Net = {
  peers: React.MutableRefObject<Map<string, Remote>>;
  send: React.MutableRefObject<(s: PlayerState) => void>;
  /** bong bóng chat trên đầu: khoá 'me' là của mình */
  bubbles: React.MutableRefObject<Map<string, Bubble>>;
};
export type NetStatus = 'off' | 'connecting' | 'online' | 'local';

const APP_ID = 'ckcgsg-website-dac-lo-2027';
const ROOM = 'khuon-vien-ttmv-v1';
export const MAX_CHAT = 140;

export function usePresence(active: boolean, myName: string, room = ROOM) {
  const peers = useRef(new Map<string, Remote>());
  const bubbles = useRef(new Map<string, Bubble>());
  const send = useRef<(s: PlayerState) => void>(() => {});
  const chatOut = useRef<(m: ChatMsg) => void>(() => {});
  const lastChat = useRef(0);
  const [count, setCount] = useState(1);
  const [ids, setIds] = useState<string[]>([]);
  const [status, setStatus] = useState<NetStatus>('off');
  const [chat, setChat] = useState<ChatLine[]>([]);

  useEffect(() => {
    if (!active) return;
    let alive = true, last: PlayerState | null = null;
    let netSend: ((s: PlayerState) => void) | null = null, netChat: ((m: ChatMsg) => void) | null = null, leave: (() => void) | null = null;
    const myId = Math.random().toString(36).slice(2);
    const put = (id: string, s: PlayerState) => peers.current.set(id, { ...s, t: performance.now() });
    const got = (id: string, m: ChatMsg) => {
      const text = String(m.t || '').slice(0, MAX_CHAT).trim(); if (!text) return;
      bubbles.current.set(id, { text, t: performance.now() });
      setChat(c => [...c.slice(-49), { id, name: String(m.n || 'Khách').slice(0, 24), text, mine: false, ts: Date.now() }]);
    };

    let bc: BroadcastChannel | null = null;
    try {
      // ?nobc trên URL: tắt kênh cùng-máy để kiểm tra đường truyền qua máy chủ
      if (!location.search.includes('nobc')) bc = new BroadcastChannel('ckcgsg-' + room);
      bc.onmessage = e => {
        const d = e.data; if (!d || d.id === myId) return;
        const id = 'bc-' + d.id;
        if (d.bye) peers.current.delete(id); else if (d.chat) got(id, d.chat); else put(id, d.s);
      };
    } catch { /* trình duyệt cũ */ }

    setStatus('connecting');
    if (SB_URL && SB_KEY) {
      getSupabase().then(sb => {
        if (!alive) return;
        const ch = sb.channel(room, { config: { broadcast: { self: false }, presence: { key: myId } } });
        ch.on('broadcast', { event: 'st' }, ({ payload }) => { if (payload?.id) put(payload.id, payload.s); })
          .on('broadcast', { event: 'chat' }, ({ payload }) => { if (payload?.id) got(payload.id, payload.m); })
          .on('presence', { event: 'leave' }, ({ key }) => { peers.current.delete(key); bubbles.current.delete(key); })
          .on('presence', { event: 'join' }, () => { if (last) ch.send({ type: 'broadcast', event: 'st', payload: { id: myId, s: last } }); })
          .subscribe(st => {
            if (st === 'SUBSCRIBED') { setStatus('online'); ch.track({ at: Date.now() }); }
            else if (st === 'CHANNEL_ERROR' || st === 'TIMED_OUT') setStatus('local');
          });
        netSend = s => { ch.send({ type: 'broadcast', event: 'st', payload: { id: myId, s } }); };
        netChat = m => { ch.send({ type: 'broadcast', event: 'chat', payload: { id: myId, m } }); };
        leave = () => { sb.removeChannel(ch); };
      }).catch(() => alive && setStatus('local'));
    } else import('trystero').then(({ joinRoom }) => {
      if (!alive) return;
      const tr = joinRoom({ appId: APP_ID }, room, { onJoinError: () => setStatus('local') });
      const act = tr.makeAction<PlayerState>('st');
      const say = tr.makeAction<ChatMsg>('chat');
      act.onMessage = (d, ctx) => { put(ctx.peerId, d); setStatus('online'); };
      say.onMessage = (d, ctx) => got(ctx.peerId, d);
      tr.onPeerJoin = () => { setStatus('online'); if (last) act.send(last).catch(() => {}); };
      tr.onPeerLeave = id => { peers.current.delete(id); bubbles.current.delete(id); };
      netSend = s => { act.send(s).catch(() => {}); };
      netChat = m => { say.send(m).catch(() => {}); };
      leave = () => { tr.leave(); };
      setTimeout(() => alive && setStatus(s => (s === 'connecting' ? 'online' : s)), 4000);
    }).catch(() => alive && setStatus('local'));

    send.current = s => { last = s; bc?.postMessage({ id: myId, s }); netSend?.(s); };
    chatOut.current = m => { bc?.postMessage({ id: myId, chat: m }); netChat?.(m); };
    const iv = setInterval(() => {
      const now = performance.now();
      for (const [id, p] of peers.current) if (now - p.t > 8000) { peers.current.delete(id); bubbles.current.delete(id); }
      const list = [...peers.current.keys()];
      setIds(prev => (prev.length === list.length && prev.every((x, i) => x === list[i]) ? prev : list));
      setCount(list.length + 1);
    }, 700);

    return () => {
      alive = false;
      try { bc?.postMessage({ id: myId, bye: 1 }); bc?.close(); } catch { /* bỏ qua */ }
      leave?.(); clearInterval(iv); peers.current.clear(); bubbles.current.clear();
      send.current = () => {}; chatOut.current = () => {};
      setIds([]); setCount(1); setStatus('off'); setChat([]);
    };
  }, [active, room]);

  /** Gửi tin nhắn (tối đa 1 tin / giây) */
  const sendChat = useCallback((raw: string) => {
    const text = raw.replace(/\s+/g, ' ').trim().slice(0, MAX_CHAT);
    const now = performance.now();
    if (!text || now - lastChat.current < 1000) return false;
    lastChat.current = now;
    chatOut.current({ n: myName, t: text });
    bubbles.current.set('me', { text, t: now });
    setChat(c => [...c.slice(-49), { id: 'me', name: myName, text, mine: true, ts: Date.now() }]);
    return true;
  }, [myName]);

  return { net: { peers, send, bubbles } as Net, ids, count, status, chat, sendChat };
}
