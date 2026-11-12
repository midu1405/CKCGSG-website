import { useRef, useState } from 'react';
import { Mail, ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageParts';
import { getSupabase } from '../lib/supabase';
import { friendlyError, EMAIL_RE } from '../lib/errors';

const TOPICS = ['Ủng hộ / dâng cúng', 'Hợp tác – tài trợ', 'Mời nhóm biểu diễn', 'Tham gia nhóm / tuyển diễn viên', 'Góp ý website', 'Khác'];
const field = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gold outline-none transition-colors placeholder:text-white/40 aria-[invalid=true]:border-amber-300/70';
const FALLBACK_ERR = 'Chưa gửi được — có thể do mạng yếu. Xin thử lại hoặc email ckcgsg@gmail.com.';

type Fields = { name: string; email: string; topic: string; message: string };
type FieldErrors = Partial<Record<'name' | 'email' | 'message', string>>;

/** Kiểm dữ liệu sau khi trim; trả câu lỗi tiếng Việt cho từng ô. */
function validate(v: Fields): FieldErrors {
  const e: FieldErrors = {};
  if (!v.name) e.name = 'Xin nhập họ và tên.';
  if (!v.email) e.email = 'Xin nhập email để nhóm phản hồi.';
  else if (!EMAIL_RE.test(v.email)) e.email = 'Email chưa đúng dạng — ví dụ ten@gmail.com.';
  if (v.message.length < 5) e.message = 'Tin nhắn cần ít nhất 5 ký tự.';
  return e;
}

const FieldError = ({ id, text }: { id: string; text?: string }) =>
  text ? <span id={id} className="block text-sm text-amber-300">{text}</span> : null;

export default function ContactPage() {
  const [f, setF] = useState({ name: '', email: '', topic: '', message: '' });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');
  const [fe, setFe] = useState<FieldErrors>({});
  const formRef = useRef<HTMLFormElement>(null);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setF(s => ({ ...s, [k]: e.target.value }));
    if (k in fe) setFe(s => ({ ...s, [k]: undefined }));
  };

  /** Lưu vào Supabase (bảng contact_messages) → tự đổ về Google Sheet */
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    const v: Fields = { name: f.name.trim(), email: f.email.trim(), topic: f.topic, message: f.message.trim() };
    const errors = validate(v);
    setFe(errors); setErr('');
    const firstBad = (['name', 'email', 'message'] as const).find(k => errors[k]);
    if (firstBad) { formRef.current?.querySelector<HTMLElement>(`[name="${firstBad}"]`)?.focus(); return; }
    setBusy(true);
    try {
      const sb = await getSupabase();
      const { error } = await sb.rpc('submit_contact', { p_topic: v.topic, p_name: v.name, p_email: v.email, p_message: v.message });
      if (error) throw error;
      setSent(true); setF({ name: '', email: '', topic: '', message: '' });
    } catch (x) { setErr(friendlyError(x, FALLBACK_ERR)); }
    finally { setBusy(false); }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Liên hệ & Ủng hộ"
        title="Đồng hành cùng sứ vụ"
        intro="Chúng tôi luôn trân trọng mọi sự đóng góp và đồng hành từ quý ân nhân để tiếp tục những vở diễn miễn phí cho cộng đồng."
      />

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-16">
          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold shrink-0"><Mail size={24} /></div>
              <div>
                <div className="text-sm text-white/40 uppercase tracking-widest font-bold mb-1">Email</div>
                <a href="mailto:ckcgsg@gmail.com" className="text-xl hover:text-gold transition-colors">ckcgsg@gmail.com</a>
              </div>
            </div>

            <div className="p-8 bg-white/5 rounded-2xl border border-white/5">
              <h2 className="text-lg font-bold serif text-gold mb-4 uppercase tracking-widest">Thông tin chuyển khoản</h2>
              <dl className="space-y-4 text-sm">
                {[['Chủ tài khoản', 'DINH NGUYEN NHA THANH'], ['Số tài khoản', '41353947'], ['Nội dung', '[HO TEN]_UNG HO CKCGSG']].map(([k, v]) => (
                  <div key={k} className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b border-white/5 pb-3 last:border-0">
                    <dt className="text-white/40">{k}</dt>
                    <dd className={`font-bold ${k === 'Số tài khoản' ? 'text-gold' : ''}`}>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <Link to="/dac-lo#cong-tac" className="group flex items-center justify-between gap-6 bg-gold text-black rounded-2xl p-7">
              <div>
                <div className="uppercase tracking-[0.2em] text-xs font-bold mb-1">Dự án 2027</div>
                <div className="serif text-2xl font-bold">Cộng tác cho vở nhạc kịch Đắc Lộ</div>
              </div>
              <ArrowRight className="shrink-0 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="bg-black p-8 md:p-10 rounded-3xl border border-white/5 shadow-2xl">
            <h2 className="text-2xl font-bold serif mb-8">Gửi tin nhắn cho chúng tôi</h2>
            {sent ? (
              <div className="text-center py-10">
                <CheckCircle2 size={48} className="text-gold mx-auto mb-4" />
                <div className="serif text-2xl font-bold mb-2">Cảm ơn bạn đã liên hệ!</div>
                <p className="text-white/60 mb-6">Nhóm đã nhận được tin nhắn và sẽ phản hồi qua email trong vài ngày tới.</p>
                <button onClick={() => setSent(false)} className="text-gold font-bold underline underline-offset-4">Gửi thêm tin nhắn khác</button>
              </div>
            ) : (
            <form ref={formRef} onSubmit={submit} noValidate className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <label className="space-y-2 block">
                  <span className="text-xs uppercase tracking-widest font-bold text-white/40">Họ và tên *</span>
                  <input type="text" name="name" required maxLength={80} value={f.name} onChange={set('name')} className={field} placeholder="Nguyễn Văn A"
                    aria-invalid={!!fe.name} aria-describedby={fe.name ? 'lh-name-err' : undefined} />
                  <FieldError id="lh-name-err" text={fe.name} />
                </label>
                <label className="space-y-2 block">
                  <span className="text-xs uppercase tracking-widest font-bold text-white/40">Email *</span>
                  <input type="email" name="email" inputMode="email" autoComplete="email" required maxLength={160} value={f.email} onChange={set('email')} className={field} placeholder="example@gmail.com"
                    aria-invalid={!!fe.email} aria-describedby={fe.email ? 'lh-email-err' : undefined} />
                  <FieldError id="lh-email-err" text={fe.email} />
                </label>
              </div>
              <label className="space-y-2 block">
                <span className="text-xs uppercase tracking-widest font-bold text-white/40">Chủ đề</span>
                <span className="relative block">
                  <select name="topic" value={f.topic} onChange={set('topic')} className={`${field} appearance-none pr-11 cursor-pointer ${f.topic ? '' : 'text-white/50'}`}>
                    <option value="" className="bg-card">Chọn chủ đề…</option>
                    {TOPICS.map(t => <option key={t} value={t} className="bg-card text-white">{t}</option>)}
                  </select>
                  <ChevronDown size={18} aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/60" />
                </span>
              </label>
              {f.topic === 'Hợp tác – tài trợ' && (
                <div className="rounded-xl border border-gold/30 bg-gold/5 px-4 py-3 text-sm text-white/75">
                  Nếu bạn muốn đồng hành cùng <b>vở ca kịch Đắc Lộ 2027</b>, xin điền{' '}
                  <a href="/dac-lo#dang-ky-cong-tac" target="_blank" rel="noopener" className="text-gold font-bold underline underline-offset-2">form đăng ký cộng tác (mở trang mới)</a>{' '}
                  để Ban tổ chức sắp xếp đúng hạng mục.
                </div>
              )}
              <label className="space-y-2 block">
                <span className="text-xs uppercase tracking-widest font-bold text-white/40">Tin nhắn *</span>
                <textarea name="message" rows={4} required maxLength={3000} value={f.message} onChange={set('message')} className={field} placeholder="Nội dung tin nhắn..."
                  aria-invalid={!!fe.message} aria-describedby={fe.message ? 'lh-message-err' : undefined} />
                <FieldError id="lh-message-err" text={fe.message} />
              </label>
              {err && <p role="alert" className="text-sm text-amber-300">{err}</p>}
              <button type="submit" disabled={busy} className="w-full bg-gold text-black font-bold py-4 rounded-xl hover:bg-white transition-all duration-300 disabled:opacity-60">
                {busy ? 'ĐANG GỬI…' : 'GỬI TIN NHẮN'}
              </button>
            </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
