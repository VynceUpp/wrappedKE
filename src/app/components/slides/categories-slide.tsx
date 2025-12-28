import { motion } from 'motion/react';

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
  'Other': '📊'
};

export function CategoriesSlide({ categories }: CategoriesSlideProps) {
  const topCategory = categories[0];

  return (
    <div className="text-center space-y-12 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-white/70 text-xl mb-4">Your top spending category</p>
        <div className="text-7xl mb-6">{categoryEmojis[topCategory.name] || '📊'}</div>
        <h2 className="text-4xl md:text-5xl text-green-400 mb-4">
          {topCategory.name}
        </h2>
        <p className="text-white/70 text-xl">
          {topCategory.percentage}% of your spending
        </p>
      </motion.div>

      <div className="space-y-3">
        {categories.slice(0, 5).map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between border border-white/20"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{categoryEmojis[category.name] || '📊'}</span>
              <span className="text-white">{category.name}</span>
            </div>
            <div className="text-right">
              <p className="text-white">KES {(category.value / 1000).toFixed(1)}K</p>
              <p className="text-white/60 text-sm">{category.percentage}%</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
