import { useState, useCallback } from 'react';
import type { VoteStatus, VoteStatusValue } from '../types';
import { GAS_API_URL } from '../constants';
import { storage } from '../utils';

interface UseVoteReturn {
  voteStatus: VoteStatus | null;
  isLoading: boolean;
  error: string | null;
  fetchVoteStatus: (userId?: number) => Promise<void>;
  submitVote: (userId: number, status: 1 | 2 | 3) => Promise<boolean>;
  clearError: () => void;
}

// モック用の投票状況
const MOCK_VOTE_STATUS: VoteStatus = {
  survivalRate: 75,
  totalVoted: 20,
  totalMembers: 24,
  myStatus: null,
  goCount: 5,
  maybeCount: 10,
  homeCount: 5,
  goMembers: [
    { id: 1, name: '田中 太郎' },
    { id: 3, name: '佐藤 健一' },
    { id: 5, name: '伊藤 大輔' },
    { id: 7, name: '山本 翔太' },
    { id: 9, name: '小林 勇気' },
  ],
  maybeMembers: [
    { id: 2, name: '鈴木 花子' },
    { id: 4, name: '高橋 美咲' },
    { id: 6, name: '渡辺 さくら' },
    { id: 8, name: '中村 麻衣' },
    { id: 10, name: '加藤 理恵' },
  ],
};

export const useVote = (): UseVoteReturn => {
  const [voteStatus, setVoteStatus] = useState<VoteStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 投票状況を取得
  const fetchVoteStatus = useCallback(async (userId?: number) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!GAS_API_URL) {
        // APIがない場合はモックデータを使用
        setVoteStatus(MOCK_VOTE_STATUS);
        return;
      }

      const url = new URL(GAS_API_URL);
      url.searchParams.set('action', 'getVoteStatus');
      if (userId) {
        url.searchParams.set('user_id', userId.toString());
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        mode: 'cors',
        redirect: 'follow',
      });

      const data = await response.json();

      if (data.success) {
        const status: VoteStatus = {
          survivalRate: data.data.survival_rate,
          totalVoted: data.data.total_voted,
          totalMembers: data.data.total_members,
          myStatus: data.data.my_status as VoteStatusValue,
          goCount: data.data.go_count,
          maybeCount: data.data.maybe_count,
          homeCount: data.data.home_count,
          goMembers: data.data.go_members || [],
          maybeMembers: data.data.maybe_members || [],
        };
        setVoteStatus(status);

        // ローカルキャッシュも更新
        if (status.myStatus) {
          storage.setVoteStatus(status.myStatus);
        }
      } else {
        throw new Error(data.error || '投票状況の取得に失敗しました');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : '投票状況の取得に失敗しました';
      setError(message);
      console.error('Failed to fetch vote status:', err);
      // エラー時はモックデータを使用
      setVoteStatus(MOCK_VOTE_STATUS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 投票を送信
  const submitVote = useCallback(
    async (userId: number, status: 1 | 2 | 3): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        if (!GAS_API_URL) {
          // APIがない場合はモックで成功を返す
          storage.setVoteStatus(status);
          setVoteStatus((prev) =>
            prev
              ? {
                  ...prev,
                  myStatus: status,
                }
              : null
          );
          return true;
        }

        // GETパラメータ方式（CORS回避）
        const url = new URL(GAS_API_URL);
        url.searchParams.set('action', 'vote');
        url.searchParams.set('user_id', userId.toString());
        url.searchParams.set('status', status.toString());

        const response = await fetch(url.toString(), {
          method: 'GET',
          mode: 'cors',
          redirect: 'follow',
        });

        const data = await response.json();

        if (data.success) {
          // 投票成功後、ローカルキャッシュを更新
          storage.setVoteStatus(status);
          // 最新のステータスを取得
          await fetchVoteStatus(userId);
          return true;
        } else {
          throw new Error(data.error || '投票の送信に失敗しました');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : '投票の送信に失敗しました';
        setError(message);
        console.error('Failed to submit vote:', err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchVoteStatus]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    voteStatus,
    isLoading,
    error,
    fetchVoteStatus,
    submitVote,
    clearError,
  };
};
