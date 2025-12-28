import { motion } from 'motion/react';

export function WelcomeSlide() {
  return (
    <div className="text-center space-y-8 max-w-2xl">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
      >
        <h1 className="text-6xl md:text-8xl mb-4">
          <span className="text-green-500">Finance</span>
          <span className="text-emerald-400">Wrapped</span>
        </h1>
        <p className="text-2xl text-white/80">2024</p>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-xl text-white/90"
      >
        Your year in M-Pesa transactions
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-white/60"
      >
        Swipe to see your financial story →
      </motion.div>
    </div>
  );
}
