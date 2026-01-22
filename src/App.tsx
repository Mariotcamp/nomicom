import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Users, Sparkles } from 'lucide-react';
import { ProfileCard, DetailModal, SkeletonCard } from './components';
import { useProfiles } from './hooks';
import type { Profile } from './types';

function App() {
  const { profiles, isLoading, error } = useProfiles();
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
              {/* teamLab Logo */}
              <img 
                src={`${import.meta.env.BASE_URL}teamlab-logo.png`}
                alt="teamLab" 
                className="h-10 md:h-12 w-auto object-contain"
              />
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gradient">
                  Borderless Drinking
                </h1>
                <p className="text-xs text-gray-600 hidden md:block">
                  teamLab 社内飲み会 2026
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
      />

      {/* Footer */}
      <footer className="relative z-10 mt-12 py-6 border-t border-yellow-300/30">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-600">
            Made with 💜 for teamLab
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
