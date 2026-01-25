import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Sparkles, Target, MessageCircle, Heart } from 'lucide-react';
import type { Profile } from '../types';
import { SelfBadge } from './SelfBadge';
import { IdentityButton } from './IdentityButton';
import { AIQuestionPanel } from './AIQuestionPanel';
import { useSwipeGesture } from '../hooks';

interface DetailModalProps {
  profile: Profile | null;
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  totalCount: number;
  currentIndex: number;
  currentUserId?: number | null;
  onRegister?: (userId: number) => void;
  onUnregister?: () => void;
}

export const DetailModal = ({
  profile,
  isOpen,
  onClose,
  onPrev,
  onNext,
  totalCount,
  currentIndex,
  currentUserId = null,
  onRegister,
  onUnregister,
}: DetailModalProps) => {
  const isMe = profile ? currentUserId === profile.id : false;
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          onPrev();
          break;
        case 'ArrowRight':
          onNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onPrev, onNext]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;

      // Lock scroll with position fixed
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        // Restore scroll position
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // Swipe handler（横スワイプで前後、下スワイプで閉じる）
  const { handleDragEnd } = useSwipeGesture({
    onSwipeLeft: onNext,
    onSwipeRight: onPrev,
    onSwipeDown: onClose,
  });

  if (!profile) return null;

  const sections = [
    {
      icon: Sparkles,
      title: 'Now',
      subtitle: '今やっていること',
      content: profile.now,
      color: 'yellow',
      bgClass: 'bg-yellow-100',
      borderClass: 'border-yellow-300',
      iconClass: 'text-yellow-700',
      textClass: 'text-yellow-700',
    },
    {
      icon: MessageCircle,
      title: 'Topic',
      subtitle: '最近のトピック',
      content: profile.topic,
      color: 'orange',
      bgClass: 'bg-orange-100',
      borderClass: 'border-orange-300',
      iconClass: 'text-orange-700',
      textClass: 'text-orange-700',
    },
    {
      icon: Heart,
      title: 'Core',
      subtitle: '大切にしていること',
      content: profile.core,
      color: 'amber',
      bgClass: 'bg-amber-100',
      borderClass: 'border-amber-300',
      iconClass: 'text-amber-700',
      textClass: 'text-amber-700',
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-0"
          onClick={onClose}
          onTouchMove={(e) => e.preventDefault()}
        >
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/80 backdrop-blur-md"
            onTouchMove={(e) => e.preventDefault()}
          />

          {/* Navigation buttons - Desktop only */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white/80 border border-yellow-300/40 hover:bg-white transition-all duration-300 group shadow-lg"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700 group-hover:text-amber-700 transition-colors" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white/80 border border-yellow-300/40 hover:bg-white transition-all duration-300 group shadow-lg"
          >
            <ChevronRight className="w-6 h-6 text-gray-700 group-hover:text-amber-700 transition-colors" />
          </button>

          {/* Modal content - Card style like Tapple */}
          <motion.div
            key={profile.id}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.3}
            onDragEnd={handleDragEnd}
            onClick={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="relative flex flex-col w-[90%] max-w-lg mx-4 md:mx-auto max-h-[85vh] rounded-3xl bg-white/95 border border-yellow-300/40 shadow-2xl overflow-hidden"
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/30 via-orange-50/20 to-amber-50/30 rounded-3xl pointer-events-none" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/80 hover:bg-white border border-gray-200 transition-colors shadow-sm"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>

            {/* Content - Scrollable */}
            <div className="relative flex-1 overflow-y-auto overscroll-contain">
              <div className="p-8 md:p-10 pb-6">
                {/* Header - Card style */}
                <div className="text-center mb-8">
                  {/* Large avatar */}
                  <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-amber-500 p-[3px] mx-auto mb-5">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100 flex items-center justify-center">
                      <span className="text-4xl md:text-5xl font-bold text-amber-800 drop-shadow-sm">
                        {profile.name.charAt(0)}
                      </span>
                    </div>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    {profile.name}
                  </h2>

                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 border border-yellow-300 mb-4">
                    <Target className="w-4 h-4 text-amber-700" />
                    <span className="text-amber-800 text-sm md:text-base">{profile.role}</span>
                  </div>

                  {/* Self Badge */}
                  {isMe && (
                    <div className="mb-4">
                      <SelfBadge variant="modal" />
                    </div>
                  )}

                  {/* Hitokoto */}
                  <p className="text-gray-700 text-base md:text-lg italic px-4">
                    「{profile.hitokoto}」
                  </p>
                </div>

                {/* Identity Button */}
                {onRegister && onUnregister && (
                  <div className="mb-6">
                    <IdentityButton
                      userId={profile.id}
                      currentUserId={currentUserId}
                      onRegister={onRegister}
                      onUnregister={onUnregister}
                    />
                  </div>
                )}

                {/* Divider */}
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-yellow-300/40 to-transparent mb-8" />

                {/* Sections */}
                <div className="space-y-5">
                  {sections.map((section, idx) => (
                    <motion.div
                      key={section.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 + 0.2 }}
                      className="group"
                    >
                      <h3 className="text-base md:text-lg font-bold text-gray-900 mb-4">
                        {section.subtitle}
                      </h3>
                      <div className="p-5 rounded-xl bg-yellow-50 border border-yellow-200">
                        <p className="text-sm md:text-base text-gray-700 leading-relaxed break-words whitespace-pre-wrap">{section.content}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* AI Question Panel */}
                {profile.ai_questions && (
                  <AIQuestionPanel questions={profile.ai_questions} isMe={isMe} />
                )}

                {/* Page indicator - Inside card at bottom */}
                <div className="mt-10 pt-8 border-t border-yellow-300/30">
                  <div className="flex flex-col items-center gap-3">
                    {/* Page dots */}
                    <div className="flex gap-2">
                      {Array.from({ length: Math.min(totalCount, 10) }).map((_, idx) => {
                        const actualIdx = currentIndex < 5 ? idx :
                          currentIndex > totalCount - 6 ? totalCount - 10 + idx :
                            currentIndex - 4 + idx;
                        return (
                          <div
                            key={idx}
                            className={`rounded-full transition-all duration-300 ${actualIdx === currentIndex
                              ? 'w-7 h-2.5 bg-yellow-400'
                              : 'w-2.5 h-2.5 bg-gray-300'
                              }`}
                          />
                        );
                      })}
                    </div>

                    {/* Counter and hint */}
                    <div className="text-center">
                      <span className="text-sm md:text-base text-gray-600 font-medium">
                        {currentIndex + 1} / {totalCount}
                      </span>
                      <p className="text-xs md:text-sm text-gray-500 mt-1">
                        ← スワイプで切り替え →
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
