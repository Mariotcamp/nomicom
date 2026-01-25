import { useEffect, useRef, useCallback, useSyncExternalStore } from 'react';

interface UsePollingOptions {
  /** ポーリング間隔（ミリ秒） */
  interval: number;
  /** 自動開始するかどうか */
  enabled?: boolean;
  /** ページがアクティブな時のみポーリングするかどうか */
  pauseOnHidden?: boolean;
}

interface UsePollingReturn {
  /** ポーリングが実行中かどうか */
  isPolling: boolean;
  /** ポーリングを開始 */
  start: () => void;
  /** ポーリングを停止 */
  stop: () => void;
  /** 手動で即座に実行 */
  trigger: () => void;
}

/**
 * 定期的にコールバックを実行するポーリングフック
 */
export const usePolling = (
  callback: () => void | Promise<void>,
  options: UsePollingOptions
): UsePollingReturn => {
  const { interval, enabled = true, pauseOnHidden = true } = options;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const callbackRef = useRef(callback);
  const isPollingRef = useRef(false);
  const subscribersRef = useRef(new Set<() => void>());

  // コールバックを最新に保つ
  useEffect(() => {
    callbackRef.current = callback;
  });

  // useSyncExternalStore用のsubscribe関数
  const subscribe = useCallback((onStoreChange: () => void) => {
    subscribersRef.current.add(onStoreChange);
    return () => {
      subscribersRef.current.delete(onStoreChange);
    };
  }, []);

  // useSyncExternalStore用のgetSnapshot関数
  const getSnapshot = useCallback(() => isPollingRef.current, []);

  // 外部ストアとしてポーリング状態を取得
  const isPolling = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  // 状態変更を通知
  const notifySubscribers = useCallback(() => {
    subscribersRef.current.forEach((callback) => callback());
  }, []);

  // ポーリングを停止
  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (isPollingRef.current) {
      isPollingRef.current = false;
      notifySubscribers();
    }
  }, [notifySubscribers]);

  // ポーリングを開始
  const startPolling = useCallback(() => {
    stopPolling();
    intervalRef.current = setInterval(() => {
      callbackRef.current();
    }, interval);
    isPollingRef.current = true;
    notifySubscribers();
  }, [interval, stopPolling, notifySubscribers]);

  // 手動トリガー
  const trigger = useCallback(() => {
    callbackRef.current();
  }, []);

  // ポーリングの開始・停止制御
  useEffect(() => {
    const shouldPoll = enabled && (!pauseOnHidden || !document.hidden);

    if (shouldPoll) {
      stopPolling();
      intervalRef.current = setInterval(() => {
        callbackRef.current();
      }, interval);
      isPollingRef.current = true;
      notifySubscribers();
    } else {
      stopPolling();
    }

    // ページの可視性変更ハンドラ
    const handleVisibilityChange = () => {
      if (!pauseOnHidden) return;

      if (document.hidden) {
        stopPolling();
      } else if (enabled) {
        stopPolling();
        intervalRef.current = setInterval(() => {
          callbackRef.current();
        }, interval);
        isPollingRef.current = true;
        notifySubscribers();
      }
    };

    if (pauseOnHidden) {
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    return () => {
      stopPolling();
      if (pauseOnHidden) {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      }
    };
  }, [enabled, interval, pauseOnHidden, stopPolling, notifySubscribers]);

  return {
    isPolling,
    start: startPolling,
    stop: stopPolling,
    trigger,
  };
};

// デフォルトのポーリング間隔（30秒）
export const DEFAULT_POLLING_INTERVAL = 30000;
