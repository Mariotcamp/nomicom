import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToast } from './useToast';

describe('useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('初期状態ではtoastsが空配列', () => {
    const { result } = renderHook(() => useToast());
    expect(result.current.toasts).toEqual([]);
  });

  it('showToastでトーストを追加できる', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast('テストメッセージ');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe('テストメッセージ');
    expect(result.current.toasts[0].type).toBe('info');
  });

  it('typeを指定してトーストを追加できる', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast('成功', 'success');
    });

    expect(result.current.toasts[0].type).toBe('success');

    act(() => {
      result.current.showToast('エラー', 'error');
    });

    expect(result.current.toasts[1].type).toBe('error');
  });

  it('removeToastでトーストを削除できる', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast('メッセージ1');
      result.current.showToast('メッセージ2');
    });

    expect(result.current.toasts).toHaveLength(2);

    const toastId = result.current.toasts[0].id;

    act(() => {
      result.current.removeToast(toastId);
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe('メッセージ2');
  });

  it('3秒後に自動的にトーストが削除される', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast('自動削除メッセージ');
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.toasts).toHaveLength(0);
  });
});
