import { motion } from 'framer-motion';
import type { Profile } from '../types';
import { SelfBadge } from './SelfBadge';

interface ProfileCardProps {
  profile: Profile;
  index: number;
  onClick: () => void;
  isMe?: boolean;
}

export const ProfileCard = ({ profile, index, onClick, isMe = false }: ProfileCardProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        ease: [0.23, 1, 0.32, 1]
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${profile.name}のプロフィールを開く${isMe ? '（あなた）' : ''}`}
      className={`glass-card p-6 md:p-8 cursor-pointer group relative overflow-hidden w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
        isMe ? 'ring-2 ring-yellow-400 ring-offset-2' : ''
      }`}
    >
      {/* Self badge */}
      {isMe && <SelfBadge variant="card" />}

      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/0 via-orange-500/0 to-amber-500/0 group-hover:from-yellow-500/3 group-hover:via-orange-500/3 group-hover:to-amber-500/3 transition-all duration-500" />

      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-amber-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Avatar placeholder with gradient */}
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-amber-500 p-[2px] mb-5">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100 flex items-center justify-center">
            <span className="text-2xl md:text-3xl font-bold text-amber-800 drop-shadow-sm">
              {profile.name.charAt(0)}
            </span>
          </div>
        </div>

        {/* Name */}
        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 group-hover:text-gradient transition-all duration-300">
          {profile.name}
        </h3>

        {/* Role badge */}
        <span className="inline-block text-xs md:text-sm px-3 py-1.5 rounded-full bg-yellow-100 text-amber-700 border border-yellow-300 mb-4">
          {profile.role}
        </span>

        {/* Hitokoto (一言) */}
        <p className="text-sm md:text-base text-gray-700 leading-relaxed line-clamp-2 px-2">
          「{profile.hitokoto}」
        </p>
      </div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.article>
  );
};
