import { useEffect } from 'react';
import {
  motion,
  animate,
  useMotionValue,
  useTransform,
  useReducedMotion,
} from 'motion/react';

interface CategoriesSlideProps {
  categories: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
}

const categoryEmojis: Record<string, string> = {
  'Airtime & Data': '📱',
  'Utilities': '💡',
  'Shopping': '🛍️',
  'Food & Dining': '🍽️',
  'Transport': '🚗',
  'Cash Withdrawal': '💵',
  'Income': '💰',
  'Transfers': '💸',
  'Other': '📊',
};

// One colour per rank so the bars read as a ranking, not decoration
const barColors = ['#4ade80', '#38bdf8', '#f472b6', '#fbbf24', '#a78bfa'];

const formatKES = (n: number) =>
  n >= 1000 ? `KES ${(n / 1000).toFixed(1)}K` : `KES ${Math.round(n)}`;

function CountUp({
  to,
  delay = 0,
  duration = 1.2,
  format = (n: number) => String(Math.round(n)),
}: {
  to: number;
  delay?: number;
  duration?: number;
  format?: (n: number) => string;
}) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(reduce ? to : 0);
  const text = useTransform(mv, format);

  useEffect(() => {
    if (reduce) {
      mv.set(to);
      return;
    }
    const controls = animate(mv, to, { duration, delay, ease: 'easeOut' });
    return () => controls.stop();
  }, [to, delay, duration, reduce, mv]);

  return <motion.span>{text}</motion.span>;
}

export function CategoriesSlide({ categories }: CategoriesSlideProps) {
  const reduce = useReducedMotion();
  const top = categories[0];
  if (!top) return null;

  const list = categories.slice(0, 5);
  const max = Math.max(...list.map((c) => c.value), 1);

  // Sequence: emoji pops -> % counts up -> bars fill one after another
  const BARS_START = 0.9;
  const STEP = 0.12;

  return (
    <div className="mx-auto flex h-full w-full max-w-md flex-col justify-center gap-8 px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      {/* Hero */}
      <div className="flex flex-col items-center text-center">
        <p className="mb-5 text-base text-white/70">Most of your money went to</p>

        <motion.div
          initial={reduce ? false : { scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 14 }}
          className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-white/10 text-6xl shadow-[0_0_60px_-10px_rgba(74,222,128,0.6)]"
        >
          {categoryEmojis[top.name] ?? '📊'}
        </motion.div>

        <h2 className="text-3xl font-semibold text-green-400">{top.name}</h2>

        <p className="mt-1 text-6xl font-bold tabular-nums text-white">
          <CountUp to={top.percentage} delay={0.3} format={(n) => `${Math.round(n)}%`} />
        </p>
        <p className="text-sm text-white/60">of your spending</p>
      </div>

      {/* Ranked bars */}
      <ul className="space-y-4">
        {list.map((c, i) => (
          <li key={c.name}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <span className="flex items-center gap-2 text-white">
                <span className="text-xl">{categoryEmojis[c.name] ?? '📊'}</span>
                {c.name}
              </span>
              <span className="text-sm tabular-nums text-white/80">
                <CountUp
                  to={c.value}
                  delay={BARS_START + i * STEP}
                  duration={0.9}
                  format={formatKES}
                />
              </span>
            </div>

            <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full origin-left rounded-full"
                style={{ width: `${(c.value / max) * 100}%`, backgroundColor: barColors[i] }}
                initial={reduce ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  delay: BARS_START + i * STEP,
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
