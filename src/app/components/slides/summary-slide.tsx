import { motion } from 'motion/react';
import { BarChart3, Share2 } from 'lucide-react';
import { Button } from '../ui/button';
import { FinancialSummary } from '../../utils/data-processor';

interface SummarySlideProps {
  data: FinancialSummary;
  onViewDashboard: () => void;
}

export function SummarySlide({ data, onViewDashboard }: SummarySlideProps) {
  return (
    <div className="text-center space-y-12 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-4xl md:text-6xl text-white mb-4">
          That's your year!
        </h2>
        <p className="text-xl text-white/70">
          Thanks for trusting M-Pesa in 2024
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl p-8 space-y-4"
      >
        <h3 className="text-2xl text-white mb-4">Your Year in Numbers</h3>
        <div className="grid grid-cols-2 gap-4 text-left">
          <div>
            <p className="text-white/80 text-sm">Transactions</p>
            <p className="text-white text-2xl">{data.totalTransactions}</p>
          </div>
          <div>
            <p className="text-white/80 text-sm">Personality</p>
            <p className="text-white text-xl">{data.spendingPersonality}</p>
          </div>
          <div>
            <p className="text-white/80 text-sm">Top Category</p>
            <p className="text-white text-xl">{data.categoryBreakdown[0]?.name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-white/80 text-sm">Net Change</p>
            <p className={`text-2xl ${data.netChange >= 0 ? 'text-green-200' : 'text-red-200'}`}>
              {data.netChange >= 0 ? '+' : ''}KES {(Math.abs(data.netChange) / 1000).toFixed(0)}K
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Button
          onClick={onViewDashboard}
          size="lg"
          className="bg-green-600 hover:bg-green-700"
        >
          <BarChart3 className="mr-2 h-5 w-5" />
          View Full Dashboard
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="bg-white/10 border-white/30 text-white hover:bg-white/20"
        >
          <Share2 className="mr-2 h-5 w-5" />
          Share Your Wrapped
        </Button>
      </motion.div>

      <p className="text-white/50 text-sm">
        Here's to even better financial decisions in 2025! 🎉
      </p>
    </div>
  );
}
