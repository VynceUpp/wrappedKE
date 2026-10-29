import { motion, useReducedMotion } from 'motion/react';

interface WelcomeSlideProps {
  /** Statement year. Falls back to the current year. */
  year?: number;
  /** Optional teaser: "We went through 1,240 transactions." */
  transactionCount?: number;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export function WelcomeSlide({
  year = new Date().getFullYear(),
  transactionCount,
}: WelcomeSlideProps) {
  const reduce = useReducedMotion();

  // Each word rises out of its own mask. This is the one big moment on the slide.
  const rise = (delay: number) => ({
    initial: reduce ? (false as const) : { y: '110%' },
    animate: { y: 0 },
    transition: { delay, duration: 0.7, ease: EASE },
  });

  const fade = (delay: number) => ({
    initial: reduce ? (false as const) : { opacity: 0 },
    animate: { opacity: 1 },
    transition: { delay, duration: 0.6 },
  });

  return (
    <div className="relative mx-auto flex h-full w-full max-w-md flex-col items-center justify-center px-6 pb-[max(2rem,env(safe-area-inset-bottom))] text-center">
      {/* Soft green glow behind the title */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[38%] h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/25 blur-3xl"
        initial={reduce ? false : { opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />

      {/* Stacked so it never wraps mid-word on a 360px screen */}
      <h1 className="relative text-6xl font-extrabold leading-[0.95] tracking-tight">
        <span className="block overflow-hidden pb-1">
          <motion.span className="block text-green-500" {...rise(0.1)}>
            Finance
          </motion.span>
        </span>
        <span className="block overflow-hidden pb-1">
          <motion.span className="block text-emerald-300" {...rise(0.25)}>
            Wrapped
          </motion.span>
        </span>
      </h1>

      <motion.p
        className="relative mt-5 text-2xl font-medium tabular-nums text-white/80"
        {...fade(0.6)}
      >
        {year}
      </motion.p>

      <motion.p className="relative mt-3 text-lg text-white/90" {...fade(0.8)}>
        Your year in M-Pesa
      </motion.p>

      {typeof transactionCount === 'number' && transactionCount > 0 && (
        <motion.p className="relative mt-1 text-sm text-white/60" {...fade(1)}>
          We went through {transactionCount.toLocaleString()} transactions.
        </motion.p>
      )}

      {/* Hint sits near the thumb zone; a gentle bob keeps it noticeable */}
      <motion.p
        className="absolute bottom-[max(2rem,env(safe-area-inset-bottom))] text-sm text-white/60"
        initial={reduce ? false : { opacity: 0 }}
        animate={reduce ? { opacity: 1 } : { opacity: 1, y: [0, -4, 0] }}
        transition={{
          opacity: { delay: 1.3, duration: 0.5 },
          y: { delay: 1.8, duration: 1.6, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        Tap to start
      </motion.p>
    </div>
  );
}
