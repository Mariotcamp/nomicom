import { useCallback, useRef, useEffect } from 'react';
import type { PanInfo } from 'framer-motion';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface UseSwipeGestureOptions {
  /** スワイプと判定する最小距離（px） */
  threshold?: number;
  /** スワイプと判定する最小速度（px/s） */
  velocityThreshold?: number;
}

interface UseSwipeGestureReturn {
  /** framer-motionのonDragEndに渡すハンドラ */
  handleDragEnd: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
}

/**
 * スワイプジェスチャーを処理するフック
 */
export const useSwipeGesture = (
  handlers: SwipeHandlers,
  options: UseSwipeGestureOptions = {}
): UseSwipeGestureReturn => {
  const { threshold = 50, velocityThreshold = 300 } = options;
  const handlersRef = useRef(handlers);

  // ハンドラを最新に保つ
  useEffect(() => {
    handlersRef.current = handlers;
  });

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const { offset, velocity } = info;
      const absX = Math.abs(offset.x);
      const absY = Math.abs(offset.y);

      // 速度が十分に速い場合は閾値を下げる
      const effectiveThreshold =
        Math.abs(velocity.x) > velocityThreshold || Math.abs(velocity.y) > velocityThreshold
          ? threshold * 0.5
          : threshold;

      // 水平方向のスワイプが優勢
      if (absX > absY && absX > effectiveThreshold) {
        if (offset.x > 0 && handlersRef.current.onSwipeRight) {
          handlersRef.current.onSwipeRight();
        } else if (offset.x < 0 && handlersRef.current.onSwipeLeft) {
          handlersRef.current.onSwipeLeft();
        }
      }
      // 垂直方向のスワイプが優勢
      else if (absY > absX && absY > effectiveThreshold) {
        if (offset.y > 0 && handlersRef.current.onSwipeDown) {
          handlersRef.current.onSwipeDown();
        } else if (offset.y < 0 && handlersRef.current.onSwipeUp) {
          handlersRef.current.onSwipeUp();
        }
      }
    },
    [threshold, velocityThreshold]
  );

  return { handleDragEnd };
};
