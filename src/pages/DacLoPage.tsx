import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;
      if (distance <= 0) { clearInterval(interval); return; }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

export default function DacLoPage() {
  const premiereDate = new Date('2027-12-31T00:00:00');
  const timeLeft = useCountdown(premiereDate);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!email) return;
    // TODO: kết nối EmailJS hoặc Google Sheets
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://picsum.photos/seed/daclo-hero/1920/1080?blur=2"
            alt="Đắc Lộ Background"
            className="w-full h-full object-cover opacity-30"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-32 pb-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="text-gold uppercase tracking-[0.5em] text-xs font-bold mb-4 block">Dự án sắp ra mắt • CKCGSG</span>
            <h1 className="text-6xl sm:text-7xl md:text-9xl font-bold serif mb-6 leading-none">
              Đắc Lộ
            </h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto mb-16 leading-relaxed">
              Vở ca kịch mới nhất của Nhóm Ca Kịch Công Giáo Sài Gòn. Thông tin chi tiết sẽ sớm được công bố.
            </p>

            {/* Countdown */}
            <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto mb-16">
              {[
                { label: 'Ngày', value: timeLeft.days },
                { label: 'Giờ', value: timeLeft.hours },
                { label: 'Phút', value: timeLeft.minutes },
                { label: 'Giây', value: timeLeft.seconds },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm"
                >
                  <div className="text-3xl sm:text-4xl font-bold serif text-gold mb-1">
                    {String(item.value).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{item.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Email signup */}
            {!submitted ? (
              <div className="max-w-md mx-auto">
                <p className="text-white/50 text-sm mb-4">Đăng ký để nhận thông báo khi có thông tin mới nhất</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email của bạn..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-3 focus:border-gold outline-none transition-colors text-sm"
                  />
                  <button
                    onClick={handleSubmit}
                    className="bg-gold text-black px-8 py-3 rounded-full font-bold text-sm hover:bg-white transition-all duration-300 whitespace-nowrap"
                  >
                    THÔNG BÁO TÔI
                  </button>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md mx-auto bg-gold/10 border border-gold/30 rounded-2xl p-6"
              >
                <div className="text-gold font-bold mb-1">Đã đăng ký thành công! 🎭</div>
                <div className="text-white/50 text-sm">Chúng tôi sẽ thông báo ngay khi có tin mới về vở Đắc Lộ.</div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Coming Soon Content */}
      <section className="py-24 bg-card/30">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-gold uppercase tracking-[0.3em] text-xs font-bold mb-4 block">Về vở diễn</span>
            <h2 className="text-4xl font-bold serif mb-6">Đang được chuẩn bị</h2>
            <p className="text-white/50 text-lg leading-relaxed max-w-2xl mx-auto mb-16">
              Nhóm Ca Kịch Công Giáo Sài Gòn đang dồn toàn bộ tâm huyết vào dự án mới nhất này.
              Hãy theo dõi để không bỏ lỡ những thông tin đầu tiên về vở diễn Đắc Lộ.
            </p>

            {/* Placeholder cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Calendar, title: 'Lịch diễn', desc: 'Sẽ được công bố sớm' },
                { icon: Calendar, title: 'Địa điểm', desc: 'Sẽ được công bố sớm' },
                { icon: Calendar, title: 'Nội dung', desc: 'Sẽ được công bố sớm' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/5 border border-white/5 rounded-2xl p-8 text-center"
                >
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold mx-auto mb-4">
                    <item.icon size={24} />
                  </div>
                  <h3 className="font-bold serif text-lg mb-2">{item.title}</h3>
                  <p className="text-white/30 text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Back to home */}
      <section className="py-16 text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white/40 hover:text-gold transition-colors text-sm uppercase tracking-widest font-bold"
        >
          <ArrowLeft size={16} />
          Quay về trang chủ
        </Link>
      </section>

    </div>
  );
}