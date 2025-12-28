import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface HighlightsSlideProps {
  highlights: string[];
}

export function HighlightsSlide({ highlights }: HighlightsSlideProps) {
  return (
    <div className="text-center space-y-12 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Sparkles className="h-16 w-16 text-yellow-400 mx-auto mb-6" />
        <h2 className="text-4xl md:text-5xl text-white mb-4">
          Year Highlights
        </h2>
        <p className="text-white/70 text-xl">
          Your 2024 financial moments
        </p>
      </motion.div>

      <div className="space-y-4">
        {highlights.map((highlight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-2xl p-6 border border-green-400/30"
          >
            <p className="text-white text-lg">{highlight}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
