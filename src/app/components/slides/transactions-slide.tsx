import { motion } from 'motion/react';
import { FinancialSummary } from '../../utils/data-processor';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface TransactionsSlideProps {
  data: FinancialSummary;
}

export function TransactionsSlide({ data }: TransactionsSlideProps) {
  return (
    <div className="text-center space-y-12 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-white/70 text-xl mb-4">You made</p>
        <h2 className="text-7xl md:text-9xl text-green-400 mb-4">
          {data.totalTransactions.toLocaleString()}
        </h2>
        <p className="text-white/70 text-2xl">transactions</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
        >
          <TrendingUp className="h-8 w-8 text-green-400 mb-3 mx-auto" />
          <p className="text-white/60 text-sm mb-2">Received</p>
          <p className="text-white text-2xl">
            KES {(data.totalReceived / 1000).toFixed(0)}K
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
        >
          <TrendingDown className="h-8 w-8 text-red-400 mb-3 mx-auto" />
          <p className="text-white/60 text-sm mb-2">Sent</p>
          <p className="text-white text-2xl">
            KES {(data.totalSent / 1000).toFixed(0)}K
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
        >
          <Activity className="h-8 w-8 text-blue-400 mb-3 mx-auto" />
          <p className="text-white/60 text-sm mb-2">Net Change</p>
          <p className={`text-2xl ${data.netChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {data.netChange >= 0 ? '+' : ''}KES {(Math.abs(data.netChange) / 1000).toFixed(0)}K
          </p>
        </motion.div>
      </div>
    </div>
  );
}
