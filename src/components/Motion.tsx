import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useSpring } from 'motion/react';

/* ---------- Con số chạy ----------
 * Nhận chuỗi như "2014", "120+", "6.000 – 7.000", "10.000+", "Loan Báo".
 * Mọi cụm số trong chuỗi sẽ đếm lên khi cuộn tới; phần chữ giữ nguyên.
 */
const NUM = /\d{1,3}(?:\.\d{3})+|\d+/g;

function fmt(n: number, dotted: boolean) {
  const s = String(Math.round(n));
  return dotted ? s.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : s;
}

export function CountUp({ value, duration = 1.8, className }: { value: string; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const reduce = useReducedMotion();
  const parts = value.split(NUM);
  const nums = (value.match(NUM) ?? []).map(raw => {
    const dotted = raw.includes('.');
    const target = Number(raw.replace(/\./g, ''));
    // Năm (vd. 2014) đếm từ ~25 năm trước cho tự nhiên; số khác đếm từ 0
    const from = !dotted && raw.length === 4 && target >= 1900 ? target - 25 : 0;
    return { dotted, target, from };
  });
  const [t, setT] = useState(reduce ? 1 : 0);

  useEffect(() => {
    if (!inView || reduce || !nums.length) { if (reduce) setT(1); return; }
    let raf = 0; const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / (duration * 1000));
      setT(1 - Math.pow(1 - p, 3)); // easeOutCubic
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, duration, nums.length]);

  return (
    <span ref={ref} className={`tabular-nums ${className ?? ''}`} aria-label={value}>
      {parts.map((txt, i) => (
        <span key={i} aria-hidden="true">
          {txt}
          {i < nums.length && fmt(nums[i].from + (nums[i].target - nums[i].from) * t, nums[i].dotted)}
        </span>
      ))}
    </span>
  );
}

/* ---------- Dòng thời gian dọc: đường kẻ tự vẽ theo thanh cuộn ---------- */
export function DrawnTimeline({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 55%'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  return (
    <ol ref={ref} className={`relative ml-2 space-y-8 ${className}`}>
      <span className="absolute left-0 top-0 bottom-0 w-px bg-gold/15" aria-hidden="true" />
      <motion.span style={{ scaleY: reduce ? 1 : scaleY }} className="absolute left-0 top-0 bottom-0 w-px bg-gold origin-top" aria-hidden="true" />
      {children}
    </ol>
  );
}

export function TimelineItem({ year, text }: { year: string; text: string }) {
  return (
    <motion.li className="pl-8 relative"
      initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
      <motion.span className="absolute -left-[7px] top-1.5 w-3.5 h-3.5 rounded-full bg-gold ring-4 ring-dark"
        initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true, amount: 0.6 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.15 }} />
      <div className="text-gold serif text-2xl font-bold leading-none mb-1.5">{year}</div>
      <p className="text-white/65 leading-relaxed">{text}</p>
    </motion.li>
  );
}

/* ---------- Gạch vàng chạy ngang (dùng cho cột mốc dạng lưới) ---------- */
export function GrowLine({ delay = 0 }: { delay?: number }) {
  return (
    <div className="relative h-px bg-gold/15 mb-6 overflow-hidden" aria-hidden="true">
      <motion.div className="absolute inset-0 bg-gold origin-left"
        initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, amount: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }} />
    </div>
  );
}

/* ---------- Danh sách hiện lần lượt ---------- */
export const staggerParent = {
  initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.25 },
  variants: { hidden: {}, show: { transition: { staggerChildren: 0.12 } } },
} as const;
export const staggerChild = {
  variants: { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } },
} as const;
