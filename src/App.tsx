import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Sparkles } from 'lucide-react';
import {
  ProfileCard,
  DetailModal,
  SkeletonCard,
  VoteButton,
  VoteModal,
  VoteResultModal,
} from './components';
import { useProfiles, useVote, useUserIdentity } from './hooks';
import type { Profile } from './types';

function App() {
  const { profiles, isLoading, error } = useProfiles();
  const { voteStatus, isLoading: isVoteLoading, fetchVoteStatus, submitVote } = useVote();
  const { currentUserId, isRegistered, registerAsMe, unregister } = useUserIdentity();

  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);

  // 初期ロード時に投票状況を取得
  useEffect(() => {
    fetchVoteStatus(currentUserId ?? undefined);
  }, [currentUserId, fetchVoteStatus]);

  const handleCardClick = useCallback((profile: Profile, index: number) => {
    setSelectedProfile(profile);
    setSelectedIndex(index);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    // Delay clearing selected profile for exit animation
    setTimeout(() => setSelectedProfile(null), 300);
  }, []);

  const handlePrevProfile = useCallback(() => {
    if (profiles.length === 0) return;
    const newIndex = selectedIndex === 0 ? profiles.length - 1 : selectedIndex - 1;
    setSelectedIndex(newIndex);
    setSelectedProfile(profiles[newIndex]);
  }, [profiles, selectedIndex]);

  const handleNextProfile = useCallback(() => {
    if (profiles.length === 0) return;
    const newIndex = selectedIndex === profiles.length - 1 ? 0 : selectedIndex + 1;
    setSelectedIndex(newIndex);
    setSelectedProfile(profiles[newIndex]);
  }, [profiles, selectedIndex]);

  // 投票FABクリック
  const handleVoteButtonClick = useCallback(() => {
    if (isRegistered && voteStatus?.myStatus) {
      // 既に投票済みの場合は結果を表示
      setIsResultModalOpen(true);
    } else {
      // 未投票の場合は投票モーダルを表示
      setIsVoteModalOpen(true);
    }
  }, [isRegistered, voteStatus?.myStatus]);

  // 投票送信
  const handleVote = useCallback(
    async (status: 1 | 2 | 3) => {
      if (!currentUserId) return;
      const success = await submitVote(currentUserId, status);
      if (success) {
        setIsVoteModalOpen(false);
        setIsResultModalOpen(true);
      }
    },
    [currentUserId, submitVote]
  );

  // 投票変更
  const handleChangeVote = useCallback(() => {
    setIsResultModalOpen(false);
    setIsVoteModalOpen(true);
  }, []);

  // 自分を探す（未登録時）
  const handleFindSelf = useCallback(() => {
    setIsVoteModalOpen(false);
    // 最初のプロフィールを開く
    if (profiles.length > 0) {
      setSelectedProfile(profiles[0]);
      setSelectedIndex(0);
      setIsModalOpen(true);
    }
  }, [profiles]);

  return (
    <div className="min-h-screen relative z-10">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/60 border-b border-yellow-300/30">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <img
                src={`${import.meta.env.BASE_URL}teamlab-logo.png`}
                alt="Logo"
                className="h-10 md:h-12 w-auto object-contain"
              />
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gradient">
                  Borderless Drinking
                </h1>
                <p className="text-xs text-gray-600 hidden md:block">
                  社内飲み会 2026
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{profiles.length} Members</span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6 md:py-12">
        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3 md:p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs md:text-sm max-w-2xl mx-auto"
          >
            <p>⚠️ データの取得中にエラーが発生しました。モックデータを表示しています。</p>
            <p className="text-xs text-red-600 mt-1">{error}</p>
          </motion.div>
        )}

        {/* Profile grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6 max-w-6xl mx-auto justify-items-center">
          {isLoading
            ? // Skeleton cards
            Array.from({ length: 16 }).map((_, index) => (
              <SkeletonCard key={index} index={index} />
            ))
            : // Profile cards
            profiles.map((profile, index) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                index={index}
                onClick={() => handleCardClick(profile, index)}
                isMe={currentUserId === profile.id}
              />
            ))
          }
        </div>

        {/* Empty state */}
        {!isLoading && profiles.length === 0 && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600">メンバー情報がありません</p>
          </motion.div>
        )}
      </main>

      {/* Detail Modal */}
      <DetailModal
        profile={selectedProfile}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onPrev={handlePrevProfile}
        onNext={handleNextProfile}
        totalCount={profiles.length}
        currentIndex={selectedIndex}
        currentUserId={currentUserId}
        onRegister={registerAsMe}
        onUnregister={unregister}
      />

      {/* Vote Button (FAB) */}
      <VoteButton
        survivalRate={voteStatus?.survivalRate ?? 0}
        onClick={handleVoteButtonClick}
        isLoading={isVoteLoading}
      />

      {/* Vote Modal */}
      <VoteModal
        isOpen={isVoteModalOpen}
        onClose={() => setIsVoteModalOpen(false)}
        currentUserId={currentUserId}
        onVote={handleVote}
        isLoading={isVoteLoading}
        onFindSelf={handleFindSelf}
      />

      {/* Vote Result Modal */}
      {voteStatus && (
        <VoteResultModal
          isOpen={isResultModalOpen}
          onClose={() => setIsResultModalOpen(false)}
          voteStatus={voteStatus}
          onChangeVote={handleChangeVote}
        />
      )}

      {/* Footer */}
      <footer className="relative z-10 mt-12 py-6 border-t border-yellow-300/30">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-600">
            Made with team❤️
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
