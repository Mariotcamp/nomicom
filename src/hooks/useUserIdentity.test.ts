import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUserIdentity } from './useUserIdentity';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useUserIdentity', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('初期状態ではcurrentUserIdがnull', () => {
    const { result } = renderHook(() => useUserIdentity());
    expect(result.current.currentUserId).toBeNull();
    expect(result.current.isRegistered).toBe(false);
  });

  it('registerAsMeでユーザーIDを登録できる', () => {
    const { result } = renderHook(() => useUserIdentity());

    act(() => {
      result.current.registerAsMe(123);
    });

    expect(result.current.currentUserId).toBe(123);
    expect(result.current.isRegistered).toBe(true);
  });

  it('unregisterで登録を解除できる', () => {
    const { result } = renderHook(() => useUserIdentity());

    act(() => {
      result.current.registerAsMe(123);
    });

    expect(result.current.isRegistered).toBe(true);

    act(() => {
      result.current.unregister();
    });

    expect(result.current.currentUserId).toBeNull();
    expect(result.current.isRegistered).toBe(false);
  });

  it('isMeが正しく判定できる', () => {
    const { result } = renderHook(() => useUserIdentity());

    expect(result.current.isMe(123)).toBe(false);

    act(() => {
      result.current.registerAsMe(123);
    });

    expect(result.current.isMe(123)).toBe(true);
    expect(result.current.isMe(456)).toBe(false);
  });
});
