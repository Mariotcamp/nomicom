import { useState, useCallback } from 'react';
import { storage } from '../utils';

interface UseUserIdentityReturn {
  currentUserId: number | null;
  isRegistered: boolean;
  registerAsMe: (userId: number) => void;
  unregister: () => void;
  isMe: (userId: number) => boolean;
}

// LocalStorageから初期値を取得（レンダリング外で実行）
const getInitialUserId = (): number | null => {
  if (typeof window === 'undefined') return null;
  return storage.getUserId();
};

export const useUserIdentity = (): UseUserIdentityReturn => {
  const [currentUserId, setCurrentUserId] = useState<number | null>(getInitialUserId);

  // 自分として登録
  const registerAsMe = useCallback((userId: number) => {
    storage.setUserId(userId);
    setCurrentUserId(userId);
  }, []);

  // 登録解除
  const unregister = useCallback(() => {
    storage.clearUserId();
    storage.clearVoteStatus();
    setCurrentUserId(null);
  }, []);

  // 自分かどうかをチェック
  const isMe = useCallback(
    (userId: number) => {
      return currentUserId === userId;
    },
    [currentUserId]
  );

  return {
    currentUserId,
    isRegistered: currentUserId !== null,
    registerAsMe,
    unregister,
    isMe,
  };
};
