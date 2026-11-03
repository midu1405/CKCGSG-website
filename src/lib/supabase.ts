/**
 * Kết nối Supabase dùng chung (tải khi cần). Dự án "ckcgsg-dao-khuon-vien" (Singapore).
 * Khoá publishable được thiết kế để nằm công khai trong web; có thể ghi đè bằng
 * biến môi trường VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY.
 */
import type { SupabaseClient } from '@supabase/supabase-js';

export const SB_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || 'https://ichrodujamooijcyftji.supabase.co';
export const SB_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || 'sb_publishable_EhWG02gAMOkIv6vEWHZwJw_-yhvRzmh';

let client: Promise<SupabaseClient> | null = null;
export function getSupabase() {
  client ??= import('@supabase/supabase-js').then(({ createClient }) =>
    createClient(SB_URL, SB_KEY, { auth: { persistSession: false }, realtime: { params: { eventsPerSecond: 20 } } }));
  return client;
}
