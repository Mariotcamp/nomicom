import { motion } from 'framer-motion';

interface ProgressBarProps {
  percentage: number;
  showLabel?: boolean;
  variant?: 'small' | 'large';
  className?: string;
}

export const ProgressBar = ({
  percentage,
  showLabel = true,
  variant = 'large',
  className = '',
}: ProgressBarProps) => {
  // 0-100の範囲に制限
  const clampedPercentage = Math.min(100, Math.max(0, percentage));

  // パーセンテージに応じた色を決定
  const getBarColor = () => {
    if (clampedPercentage >= 70) return 'from-green-400 to-green-500';
    if (clampedPercentage >= 40) return 'from-yellow-400 to-orange-400';
    return 'from-red-400 to-red-500';
  };

  if (variant === 'small') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${clampedPercentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`h-full bg-gradient-to-r ${getBarColor()}`}
          />
        </div>
        {showLabel && (
          <span className="text-xs font-medium text-white/90">{clampedPercentage}%</span>
        )}
      </div>
    );
  }

  return (
    <div className={`text-center ${className}`}>
      {showLabel && (
        <div className="mb-2">
          <span className="text-sm text-gray-500">生存率</span>
          <motion.span
            key={clampedPercentage}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="block text-4xl font-bold text-gray-800"
          >
            {clampedPercentage}%
          </motion.span>
        </div>
      )}
      <div className="h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clampedPercentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full bg-gradient-to-r ${getBarColor()} shadow-md`}
        />
      </div>
    </div>
  );
};
