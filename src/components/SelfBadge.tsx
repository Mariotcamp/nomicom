import { motion } from 'framer-motion';

interface SelfBadgeProps {
  variant?: 'card' | 'modal';
  className?: string;
}

export const SelfBadge = ({ variant = 'modal', className = '' }: SelfBadgeProps) => {
  if (variant === 'card') {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={`absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md z-10 ${className}`}
        title="あなた"
      >
        ★
      </motion.div>
    );
  }

  return (
    <motion.span
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`inline-flex items-center gap-1 px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-sm font-medium ${className}`}
    >
      <span>★</span>
      <span>あなた</span>
    </motion.span>
  );
};
