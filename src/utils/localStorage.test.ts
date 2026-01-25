import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { storage } from './localStorage';

describe('storage utility', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getUserId', () => {
    it('returns null when no user ID is stored', () => {
      expect(storage.getUserId()).toBeNull();
    });

    it('returns the stored user ID as a number', () => {
      localStorage.setItem('borderless_user_id', '42');
      expect(storage.getUserId()).toBe(42);
    });

    it('returns null when localStorage throws an error', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('Storage error');
      });
      expect(storage.getUserId()).toBeNull();
    });
  });

  describe('setUserId', () => {
    it('stores the user ID in localStorage', () => {
      storage.setUserId(123);
      expect(localStorage.getItem('borderless_user_id')).toBe('123');
    });

    it('overwrites existing user ID', () => {
      storage.setUserId(1);
      storage.setUserId(2);
      expect(localStorage.getItem('borderless_user_id')).toBe('2');
    });
  });

  describe('clearUserId', () => {
    it('removes the user ID from localStorage', () => {
      localStorage.setItem('borderless_user_id', '42');
      storage.clearUserId();
      expect(localStorage.getItem('borderless_user_id')).toBeNull();
    });
  });

  describe('getVoteStatus', () => {
    it('returns null when no vote status is stored', () => {
      expect(storage.getVoteStatus()).toBeNull();
    });

    it('returns the stored vote status as a number', () => {
      localStorage.setItem('borderless_vote_status', '1');
      expect(storage.getVoteStatus()).toBe(1);
    });
  });

  describe('setVoteStatus', () => {
    it('stores the vote status in localStorage', () => {
      storage.setVoteStatus(2);
      expect(localStorage.getItem('borderless_vote_status')).toBe('2');
    });
  });

  describe('clearVoteStatus', () => {
    it('removes the vote status from localStorage', () => {
      localStorage.setItem('borderless_vote_status', '1');
      storage.clearVoteStatus();
      expect(localStorage.getItem('borderless_vote_status')).toBeNull();
    });
  });

  describe('clearAll', () => {
    it('clears both user ID and vote status', () => {
      localStorage.setItem('borderless_user_id', '42');
      localStorage.setItem('borderless_vote_status', '1');
      storage.clearAll();
      expect(localStorage.getItem('borderless_user_id')).toBeNull();
      expect(localStorage.getItem('borderless_vote_status')).toBeNull();
    });
  });
});
