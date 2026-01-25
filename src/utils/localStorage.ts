// LocalStorage keys
const USER_ID_KEY = 'borderless_user_id';
const VOTE_STATUS_KEY = 'borderless_vote_status';

/**
 * LocalStorageユーティリティ
 * ユーザー識別と投票ステータスのキャッシュ管理
 */
export const storage = {
  // ユーザーID関連
  getUserId: (): number | null => {
    try {
      const id = localStorage.getItem(USER_ID_KEY);
      return id ? parseInt(id, 10) : null;
    } catch {
      return null;
    }
  },

  setUserId: (id: number): void => {
    try {
      localStorage.setItem(USER_ID_KEY, id.toString());
    } catch {
      console.error('Failed to save user ID to localStorage');
    }
  },

  clearUserId: (): void => {
    try {
      localStorage.removeItem(USER_ID_KEY);
    } catch {
      console.error('Failed to clear user ID from localStorage');
    }
  },

  // 投票ステータス関連（オフライン対応用キャッシュ）
  getVoteStatus: (): number | null => {
    try {
      const status = localStorage.getItem(VOTE_STATUS_KEY);
      return status ? parseInt(status, 10) : null;
    } catch {
      return null;
    }
  },

  setVoteStatus: (status: number): void => {
    try {
      localStorage.setItem(VOTE_STATUS_KEY, status.toString());
    } catch {
      console.error('Failed to save vote status to localStorage');
    }
  },

  clearVoteStatus: (): void => {
    try {
      localStorage.removeItem(VOTE_STATUS_KEY);
    } catch {
      console.error('Failed to clear vote status from localStorage');
    }
  },

  // 全データクリア
  clearAll: (): void => {
    storage.clearUserId();
    storage.clearVoteStatus();
  },
};
