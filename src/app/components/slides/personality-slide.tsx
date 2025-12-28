import { motion } from 'motion/react';

interface PersonalitySlideProps {
  personality: string;
}

const personalityMessages: Record<string, string> = {
  '💰 The Saver': 'You know how to keep your coins! Your saving game is strong.',
  '🎉 The Spender': 'YOLO is your motto! You believe money is meant to be enjoyed.',
  '👑 The High Roller': 'You like the finer things! Big transactions are your style.',
  '🛍️ The Shopaholic': 'Shopping is your therapy. Your cart is never empty!',
  '🍽️ The Foodie': 'Good food = Good mood. Your taste buds live large!',
  '⚖️ The Balanced': 'You found the sweet spot between saving and spending!'
};

export function PersonalitySlide({ personality }: PersonalitySlideProps) {
  const message = personalityMessages[personality] || 'You have a unique financial style!';

  return (
    <div className="text-center space-y-12 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-white/70 text-xl mb-6">Your spending personality</p>
      </motion.div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="text-9xl mb-8"
      >
        {personality.split(' ')[0]}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-4xl md:text-5xl text-white mb-6">
          {personality.substring(personality.indexOf(' ') + 1)}
        </h2>
        <p className="text-xl text-white/80 max-w-lg mx-auto">
          {message}
        </p>
      </motion.div>
    </div>
  );
}
