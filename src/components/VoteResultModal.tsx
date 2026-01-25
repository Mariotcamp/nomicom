import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Beer, Rocket, Home } from 'lucide-react';
import type { VoteStatus } from '../types';
import { ProgressBar } from './ProgressBar';
import { useSwipeGesture } from '../hooks';

interface VoteResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  voteStatus: VoteStatus;
  onChangeVote: () => void;
}

const getStatusLabel = (status: 1 | 2 | 3 | null) => {
  switch (status) {
    case 1:
      return { icon: Rocket, label: '行く！', color: 'text-green-600' };
    case 2:
      return { icon: Beer, label: '流れに任せる', color: 'text-amber-600' };
    case 3:
      return { icon: Home, label: 'お先に！', color: 'text-gray-600' };
    default:
      return null;
  }
};

export const VoteResultModal = ({
  isOpen,
  onClose,
  voteStatus,
  onChangeVote,
}: VoteResultModalProps) => {
  const isHome = voteStatus.myStatus === 3;
  const canSeeMembers = voteStatus.myStatus === 1 || voteStatus.myStatus === 2;
  const statusInfo = getStatusLabel(voteStatus.myStatus);

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
            className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="result-modal-title"
          >
            {/* ヘッダー */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2
                id="result-modal-title"
                className="flex items-center gap-2 text-lg font-bold text-gray-800"
              >
                <Beer className="w-6 h-6 text-amber-500" />
                2次会ステータス
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
            <div className="flex-1 overflow-y-auto p-6">
              {/* 生存率 */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <ProgressBar percentage={voteStatus.survivalRate} variant="large" />
              </div>

              {isHome ? (
                // Home選択者向け表示
                <div className="text-center py-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Home className="w-8 h-8 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">お疲れさまでした！</h3>
                  <p className="text-gray-600">
                    今日は早めに帰られるんですね。
                    <br />
                    ゆっくり休んでください！
                  </p>
                  <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                    <p className="text-sm text-gray-600">
                      ※参加者リストは「行く」「流れに任せる」を
                      <br />
                      選択した方のみ閲覧できます
                    </p>
                  </div>
                </div>
              ) : canSeeMembers ? (
                // Go/Maybe選択者向け表示
                <div className="space-y-4">
                  {/* Goメンバー */}
                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <Rocket className="w-5 h-5 text-green-600" />
                      <span className="font-bold text-green-700">
                        行く！（{voteStatus.goCount}人）
                      </span>
                    </div>
                    {voteStatus.goMembers.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {voteStatus.goMembers.map((member) => (
                          <span
                            key={member.id}
                            className="px-3 py-1 bg-white text-green-700 rounded-full text-sm shadow-sm"
                          >
                            {member.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-green-600 text-sm">まだいません</p>
                    )}
                  </div>

                  {/* Maybeメンバー */}
                  <div className="p-4 bg-amber-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <Beer className="w-5 h-5 text-amber-600" />
                      <span className="font-bold text-amber-700">
                        流れに任せる（{voteStatus.maybeCount}人）
                      </span>
                    </div>
                    {voteStatus.maybeMembers.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {voteStatus.maybeMembers.map((member) => (
                          <span
                            key={member.id}
                            className="px-3 py-1 bg-white text-amber-700 rounded-full text-sm shadow-sm"
                          >
                            {member.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-amber-600 text-sm">まだいません</p>
                    )}
                  </div>
                </div>
              ) : null}
            </div>

            {/* フッター */}
            <div className="p-4 border-t bg-gray-50">
              {statusInfo && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">あなたの選択:</span>
                    <span className={`flex items-center gap-1 font-medium ${statusInfo.color}`}>
                      <statusInfo.icon className="w-4 h-4" />
                      {statusInfo.label}
                    </span>
                  </div>
                  <button
                    onClick={onChangeVote}
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    選択を変更する
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
