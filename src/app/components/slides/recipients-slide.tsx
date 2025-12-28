import { motion } from 'motion/react';
import { Users } from 'lucide-react';

interface RecipientsSlideProps {
  recipients: Array<{
    name: string;
    amount: number;
    count: number;
  }>;
}

export function RecipientsSlide({ recipients }: RecipientsSlideProps) {
  if (recipients.length === 0) {
    return (
      <div className="text-center space-y-8 max-w-2xl">
        <p className="text-white/70 text-xl">No recipient data available</p>
      </div>
    );
  }

  const topRecipient = recipients[0];

  return (
    <div className="text-center space-y-12 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Users className="h-16 w-16 text-green-400 mx-auto mb-6" />
        <p className="text-white/70 text-xl mb-4">You sent the most money to</p>
        <h2 className="text-4xl md:text-5xl text-white mb-6">
          {topRecipient.name}
        </h2>
        <div className="flex justify-center gap-8 mb-6">
          <div>
            <p className="text-3xl text-green-400">
              KES {(topRecipient.amount / 1000).toFixed(0)}K
            </p>
            <p className="text-white/60 text-sm">Total sent</p>
          </div>
          <div>
            <p className="text-3xl text-emerald-400">{topRecipient.count}×</p>
            <p className="text-white/60 text-sm">Transactions</p>
          </div>
        </div>
      </motion.div>

      <div className="space-y-3">
        <p className="text-white/70 mb-4">Top 5 Recipients</p>
        {recipients.slice(0, 5).map((recipient, index) => (
          <motion.div
            key={recipient.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between border border-white/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white">
                {index + 1}
              </div>
              <span className="text-white">{recipient.name}</span>
            </div>
            <div className="text-right">
              <p className="text-white">KES {(recipient.amount / 1000).toFixed(1)}K</p>
              <p className="text-white/60 text-sm">{recipient.count} times</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
