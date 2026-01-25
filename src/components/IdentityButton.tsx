import { useState } from 'react';
import { motion } from 'framer-motion';
import { Smile, Check, X } from 'lucide-react';

interface IdentityButtonProps {
  userId: number;
  currentUserId: number | null;
  onRegister: (userId: number) => void;
  onUnregister: () => void;
}

export const IdentityButton = ({
  userId,
  currentUserId,
  onRegister,
  onUnregister,
}: IdentityButtonProps) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const isMe = currentUserId === userId;
  const isOtherRegistered = currentUserId !== null && currentUserId !== userId;

  // 他のユーザーとして登録済みの場合は非表示
  if (isOtherRegistered) {
    return null;
  }

  // 自分として登録済みの場合
  if (isMe) {
    return (
      <div className="flex flex-col items-center gap-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg"
        >
          <Check className="w-5 h-5" />
          <span className="font-medium">自分として登録済み</span>
        </motion.div>

        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="text-sm text-gray-500 hover:text-gray-700 underline focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded"
            aria-label="自分の登録を解除する"
          >
            解除する
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
            role="alertdialog"
            aria-labelledby="unregister-confirm"
          >
            <span id="unregister-confirm" className="text-sm text-red-700">本当に解除しますか？</span>
            <button
              onClick={() => {
                onUnregister();
                setShowConfirm(false);
              }}
              className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              aria-label="登録を解除する"
            >
              解除
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded"
              aria-label="キャンセル"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </div>
    );
  }

  // 未登録の場合
  return (
    <motion.button
      onClick={() => onRegister(userId)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label="このプロフィールを自分として登録する"
    >
      <Smile className="w-5 h-5" aria-hidden="true" />
      <span>これは自分です！</span>
    </motion.button>
  );
};
