import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Rocket, Beer, Home, Search, Loader2 } from 'lucide-react';
import { useSwipeGesture } from '../hooks';

interface VoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: number | null;
  onVote: (status: 1 | 2 | 3) => Promise<void>;
  isLoading?: boolean;
  onFindSelf?: () => void;
}

const voteOptions = [
  {
    status: 1 as const,
    icon: Rocket,
    label: '行く！',
    description: '絶対行きたい！',
    gradient: 'from-green-500 to-emerald-500',
    hoverGradient: 'hover:from-green-600 hover:to-emerald-600',
  },
  {
    status: 2 as const,
    icon: Beer,
    label: '流れに任せる',
    description: 'みんな次第で',
    gradient: 'from-amber-500 to-orange-500',
    hoverGradient: 'hover:from-amber-600 hover:to-orange-600',
  },
  {
    status: 3 as const,
    icon: Home,
    label: 'お先に！',
    description: '今日はここまで',
    gradient: 'from-gray-500 to-slate-500',
    hoverGradient: 'hover:from-gray-600 hover:to-slate-600',
  },
];

export const VoteModal = ({
  isOpen,
  onClose,
  currentUserId,
  onVote,
  isLoading = false,
  onFindSelf,
}: VoteModalProps) => {
  const isRegistered = currentUserId !== null;

  // Escキーで閉じる
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  const handleVote = async (status: 1 | 2 | 3) => {
    await onVote(status);
  };

  // 下スワイプで閉じる
  const { handleDragEnd } = useSwipeGesture({
    onSwipeDown: onClose,
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.3}
            onDragEnd={handleDragEnd}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="vote-modal-title"
          >
            {/* ヘッダー */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2
                id="vote-modal-title"
                className="flex items-center gap-2 text-lg font-bold text-gray-800"
              >
                <Beer className="w-6 h-6 text-amber-500" />
                2次会どうする？
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="閉じる"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* コンテンツ */}
            <div className="p-6">
              {isRegistered ? (
                <>
                  <p className="text-center text-gray-600 mb-6">
                    あなたの参加意向を教えてください
                  </p>

                  <div className="space-y-3">
                    {voteOptions.map((option) => (
                      <motion.button
                        key={option.status}
                        onClick={() => handleVote(option.status)}
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full flex items-center gap-4 p-4 bg-gradient-to-r ${option.gradient} ${option.hoverGradient} text-white rounded-xl shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed`}
                      >
                        {isLoading ? (
                          <Loader2 className="w-8 h-8 animate-spin" />
                        ) : (
                          <option.icon className="w-8 h-8" />
                        )}
                        <div className="text-left">
                          <div className="font-bold text-lg">{option.label}</div>
                          <div className="text-sm opacity-90">{option.description}</div>
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  <div className="mt-6 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      💡 「お先に」を選んでも、誰にもバレません。
                      <br />
                      アプリは引き続き利用できます。
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                    <span className="text-3xl">⚠️</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    まずは自分を設定してください
                  </h3>
                  <p className="text-gray-600 mb-6">
                    投票するには、プロフィール詳細画面から
                    <br />
                    「これは自分です！」ボタンを押して
                    <br />
                    ご自身を登録してください。
                  </p>
                  {onFindSelf && (
                    <motion.button
                      onClick={() => {
                        onClose();
                        onFindSelf();
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
                    >
                      <Search className="w-5 h-5" />
                      自分を探す
                    </motion.button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
