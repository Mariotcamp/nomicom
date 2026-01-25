import { motion } from 'framer-motion';
import { Beer, Loader2 } from 'lucide-react';
import { ProgressBar } from './ProgressBar';

interface VoteButtonProps {
  survivalRate: number;
  onClick: () => void;
  isLoading?: boolean;
}

export const VoteButton = ({ survivalRate, onClick, isLoading = false }: VoteButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={isLoading}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-4 right-4 z-50 flex flex-col items-center gap-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow min-w-[160px] sm:min-w-[200px] disabled:opacity-70 disabled:cursor-not-allowed"
      style={{
        paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))',
      }}
      aria-label={`2次会投票を開く（現在の生存率: ${survivalRate}%）`}
    >
      {/* パルスアニメーション */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.7, 0, 0.7],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="relative flex items-center gap-2">
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Beer className="w-5 h-5" />
        )}
        <span className="font-medium text-sm sm:text-base">2次会どうする？</span>
      </div>

      <div className="relative w-full mt-1">
        <ProgressBar percentage={survivalRate} variant="small" showLabel={true} />
      </div>
    </motion.button>
  );
};
