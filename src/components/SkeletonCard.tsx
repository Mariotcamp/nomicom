import { motion } from 'framer-motion';

interface SkeletonCardProps {
  index: number;
}

export const SkeletonCard = ({ index }: SkeletonCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.05 }}
      className="glass-card p-4 md:p-6 skeleton-glow w-[90%]"
    >
      {/* Avatar skeleton */}
      <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-yellow-500/10 to-orange-500/10 mb-3 md:mb-4 animate-pulse" />

      {/* Name skeleton */}
      <div className="h-4 md:h-5 w-20 md:w-24 rounded bg-white/5 mb-2 animate-pulse" />

      {/* Role skeleton */}
      <div className="h-4 md:h-5 w-28 md:w-32 rounded-full bg-yellow-500/5 mb-2 md:mb-3 animate-pulse" />

      {/* Text skeleton */}
      <div className="space-y-2">
        <div className="h-2.5 md:h-3 w-full rounded bg-white/5 animate-pulse" />
        <div className="h-2.5 md:h-3 w-3/4 rounded bg-white/5 animate-pulse" />
      </div>
    </motion.div>
  );
};
