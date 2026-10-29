import { Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageParts';

export default function ContactPage() {
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
            <form className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <label className="space-y-2 block">
                  <span className="text-xs uppercase tracking-widest font-bold text-white/40">Họ và tên</span>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gold outline-none transition-colors" placeholder="Nguyễn Văn A" />
                </label>
                <label className="space-y-2 block">
                  <span className="text-xs uppercase tracking-widest font-bold text-white/40">Email</span>
                  <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gold outline-none transition-colors" placeholder="example@gmail.com" />
                </label>
              </div>
              <label className="space-y-2 block">
                <span className="text-xs uppercase tracking-widest font-bold text-white/40">Chủ đề</span>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gold outline-none transition-colors" placeholder="Hợp tác / Ủng hộ / Tham gia" />
              </label>
              <label className="space-y-2 block">
                <span className="text-xs uppercase tracking-widest font-bold text-white/40">Tin nhắn</span>
                <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-gold outline-none transition-colors" placeholder="Nội dung tin nhắn..." />
              </label>
              <button type="button" className="w-full bg-gold text-black font-bold py-4 rounded-xl hover:bg-white transition-all duration-300">GỬI TIN NHẮN</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
