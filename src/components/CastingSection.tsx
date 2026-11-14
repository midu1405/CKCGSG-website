import { motion } from 'motion/react';
import { Mic2, Footprints, FolderUp, Mail, Clock, CalendarCheck, ChevronDown, Hammer, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CASTING, SOCIAL } from '../constants';
import { FacebookIcon } from './SocialIcons';
import CASTING_BG from '../assets/photos/casting-banner.jpg';

const SUBJECT = encodeURIComponent('[HỌ VÀ TÊN] - ỨNG TUYỂN CASTING [HÁT/MÚA]');
const BODY = encodeURIComponent(
  'Xin chào CKCGSG,\n\nEm xin ứng tuyển vị trí [HÁT / MÚA].\n\nHọ tên (kèm Tên Thánh nếu có): \nSố điện thoại liên hệ: \nGiới thiệu ngắn về bản thân: \n\nLink Google Drive hồ sơ (đã mở quyền xem cho ckcgsg@gmail.com và jeankiet@gmail.com): \n\nTrân trọng.'
);
const MAILTO = `mailto:ckcgsg@gmail.com?subject=${SUBJECT}&body=${BODY}`;

const singRequirements = [
  '1 video giới thiệu bản thân (ngắn gọn, thấy rõ mặt, nghe rõ giọng)',
  '1 video hát (thấy rõ khuôn mặt)',
  '2 file audio thu âm giọng hát (2 bài khác phong cách)',
];
const danceRequirements = [
  '1 video giới thiệu bản thân (ngắn gọn, thấy rõ mặt, nghe rõ giọng)',
  '1 video múa tập thể',
  '1 video múa đơn',
];
const steps = [
  { icon: FolderUp, title: 'Chuẩn bị hồ sơ', desc: 'Tập trung tất cả file vào 1 folder Google Drive. Đặt tên folder: [Tên của bạn].' },
  { icon: Mail, title: 'Mở quyền xem', desc: 'Mở quyền xem file cho ckcgsg@gmail.com và jeankiet@gmail.com.' },
  { icon: Mail, title: 'Gửi hồ sơ', desc: 'Gửi về ckcgsg@gmail.com, tiêu đề: [HỌ VÀ TÊN] - ỨNG TUYỂN CASTING [HÁT/MÚA].' },
];

/** `asPage`: đứng riêng thành trang /tuyen-dien-vien → tiêu đề là h1; nhúng trong trang khác → h2. */
export default function CastingSection(props: { id?: string; asPage?: boolean }) {
  return CASTING.open ? <OpenCasting {...props} /> : <ClosedCasting {...props} />;
}

/** Đang nhận hồ sơ. */
function OpenCasting({ id = 'casting', asPage = false }: { id?: string; asPage?: boolean }) {
  const Title = asPage ? 'h1' : 'h2';
  return (
    <section id={id} className="relative py-20 md:py-32 overflow-hidden">
      {/* nền banner */}
      <div className="absolute inset-0 z-0">
        <img src={CASTING_BG} alt="Tuyển diễn viên" className="w-full h-full object-cover opacity-50" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-b from-dark/90 via-dark/65 to-dark/90" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 text-gold px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.15em] mb-5">
            <Clock size={14} /> Hạn chót: {CASTING.deadline}
          </div>
          <Title className="text-4xl md:text-6xl font-bold serif leading-tight mb-4 text-balance">Tuyển Diễn Viên</Title>
          <p className="text-gold text-lg font-bold uppercase tracking-[0.3em] mb-5">Hát · Múa</p>
          <p className="text-white/60 font-light text-lg leading-relaxed">
            Nhóm Ca Kịch Công Giáo Sài Gòn tìm kiếm những tài năng cùng đồng hành trong các dự án sắp tới. Nếu bạn yêu nghệ thuật và mong muốn loan báo Tin Mừng qua sân khấu — hãy gia nhập cùng chúng tôi.
          </p>
        </motion.div>

        {/* 2 cột Hát / Múa */}
        <div className="grid md:grid-cols-2 gap-6 mb-14">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold"><Mic2 size={24} /></div>
              <h3 className="text-2xl font-bold serif text-balance">Diễn viên Hát</h3>
            </div>
            <ul className="space-y-3">
              {singRequirements.map((r, i) => (
                <li key={i} className="flex gap-3 text-white/70 leading-relaxed">
                  <span className="text-gold font-bold shrink-0">{String.fromCharCode(65 + i)}.</span>{r}
                </li>
              ))}
            </ul>
            <p className="text-white/40 text-sm mt-5 italic">Lưu ý: rõ ca từ. KHÔNG dùng autotune hoặc chỉnh sửa giọng. Có thể hát với nhạc nền hoặc hát chay.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold"><Footprints size={24} /></div>
              <h3 className="text-2xl font-bold serif text-balance">Diễn viên Múa</h3>
            </div>
            <ul className="space-y-3">
              {danceRequirements.map((r, i) => (
                <li key={i} className="flex gap-3 text-white/70 leading-relaxed">
                  <span className="text-gold font-bold shrink-0">{String.fromCharCode(65 + i)}.</span>{r}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Cách thức ứng tuyển */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
          <h3 className="text-center text-sm uppercase tracking-[0.25em] text-gold font-bold mb-8">Cách thức ứng tuyển</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="relative bg-white/5 border border-white/5 rounded-2xl p-7">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-gold text-black rounded-full flex items-center justify-center font-bold text-sm">{i + 1}</div>
                <div className="w-11 h-11 bg-gold/10 rounded-xl flex items-center justify-center text-gold mb-4"><s.icon size={22} /></div>
                <h4 className="font-bold serif text-lg mb-2 text-balance">{s.title}</h4>
                <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <div className="text-center">
          <a href={MAILTO} className="inline-flex items-center gap-3 bg-gold text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-white transition-all duration-300 shadow-lg shadow-gold/20">
            <Mail size={20} /> GỬI HỒ SƠ ỨNG TUYỂN
          </a>
          <p className="text-white/40 text-sm mt-4">Nút sẽ mở email với tiêu đề mẫu sẵn — bạn chỉ cần đính kèm link hồ sơ.</p>
        </div>
      </div>
    </section>
  );
}

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold';

/** Đợt tuyển đã đóng (CASTING.open = false): cảm ơn, chỉ đường đi tiếp, giữ yêu cầu cũ để tham khảo. */
function ClosedCasting({ id = 'casting', asPage = false }: { id?: string; asPage?: boolean }) {
  const Title = asPage ? 'h1' : 'h2';
  return (
    <section id={id} className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={CASTING_BG} alt="" className="w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-dark/80 via-dark/85 to-dark" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/15 text-white/70 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <CalendarCheck size={16} aria-hidden="true" /> Đã đóng nhận hồ sơ · {CASTING.deadline}
          </div>
          <Title className="text-4xl md:text-6xl font-bold serif leading-tight mb-5 text-balance">
            Đợt tuyển diễn viên {CASTING.round} đã khép lại
          </Title>
          <p className="text-white/75 text-lg leading-relaxed">
            Cảm ơn tất cả các bạn đã gửi hồ sơ. Dàn diễn viên cho vở nhạc kịch <span className="text-gold font-semibold whitespace-nowrap">Đắc Lộ</span> đã
            đủ và đang tập luyện. Hiện nhóm chưa có dự kiến đợt tuyển mới.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5 mb-10">
          <div className="bg-card border border-gold/30 rounded-3xl p-7 md:p-8 flex flex-col">
            <Hammer className="text-gold mb-5" size={26} aria-hidden="true" />
            <h3 className="serif text-2xl font-bold mb-3 text-balance">Vẫn muốn góp sức?</h3>
            <p className="text-white/70 leading-relaxed mb-7">
              Vở Đắc Lộ cần người cộng tác hậu trường: trang phục, cảnh trí – đạo cụ, vận chuyển,
              suất ăn cho buổi tập, âm thanh – ánh sáng.
            </p>
            <Link to="/dac-lo#cong-tac" className={`mt-auto self-start inline-flex items-center min-h-11 bg-gold text-black px-7 py-3 rounded-full font-bold hover:bg-white transition-colors ${focusRing}`}>
              CỘNG TÁC CHO ĐẮC LỘ
            </Link>
          </div>

          <div className="bg-card border border-white/10 rounded-3xl p-7 md:p-8 flex flex-col">
            <Mail className="text-gold mb-5" size={26} aria-hidden="true" />
            <h3 className="serif text-2xl font-bold mb-3 text-balance">Chờ đợt tuyển sau</h3>
            <p className="text-white/70 leading-relaxed mb-7">
              Theo dõi trang Facebook của nhóm để nhận thông báo khi mở đợt tuyển mới.
            </p>
            <div className="mt-auto flex flex-wrap gap-3">
              <a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 min-h-11 px-5 py-2.5 rounded-full border border-white/25 font-bold hover:border-gold hover:text-gold transition-colors ${focusRing}`}>
                <FacebookIcon size={18} /> Facebook
              </a>
              <a href={SOCIAL.youtube} target="_blank" rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 min-h-11 px-5 py-2.5 rounded-full border border-white/25 font-bold hover:border-gold hover:text-gold transition-colors ${focusRing}`}>
                <Youtube size={18} aria-hidden="true" /> YouTube
              </a>
            </div>
          </div>
        </div>

        <details className="group bg-white/[0.03] border border-white/10 rounded-2xl">
          <summary className={`flex items-center justify-between gap-4 cursor-pointer list-none min-h-11 px-6 py-4 rounded-2xl ${focusRing}`}>
            <span>
              <span className="font-bold">Yêu cầu hồ sơ đợt {CASTING.round}</span>
              <span className="text-white/60 text-sm block sm:inline sm:ml-2">— tham khảo để chuẩn bị cho đợt sau</span>
            </span>
            <ChevronDown size={20} aria-hidden="true" className="shrink-0 text-white/60 transition-transform group-open:rotate-180" />
          </summary>
          <div className="grid md:grid-cols-2 gap-8 px-6 pb-7 pt-2">
            {[
              { icon: Mic2, title: 'Diễn viên Hát', items: singRequirements, note: 'Rõ ca từ. Không dùng autotune hoặc chỉnh sửa giọng. Có thể hát với nhạc nền hoặc hát chay.' },
              { icon: Footprints, title: 'Diễn viên Múa', items: danceRequirements },
            ].map(g => (
              <div key={g.title}>
                <h4 className="flex items-center gap-2 font-bold serif text-lg mb-3"><g.icon size={18} className="text-gold" aria-hidden="true" /> {g.title}</h4>
                <ul className="space-y-2 text-white/70 leading-relaxed">
                  {g.items.map(r => <li key={r} className="flex gap-2"><span className="text-gold" aria-hidden="true">·</span>{r}</li>)}
                </ul>
                {g.note && <p className="text-white/55 text-sm mt-3">{g.note}</p>}
              </div>
            ))}
          </div>
        </details>
      </div>
    </section>
  );
}
