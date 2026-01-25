import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';

interface AIQuestionPanelProps {
  questions: string; // JSON配列文字列
  isMe?: boolean;
}

export const AIQuestionPanel = ({ questions, isMe = false }: AIQuestionPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // JSON文字列をパースして質問配列を取得
  const parsedQuestions = useMemo(() => {
    if (!questions) return [];
    try {
      const parsed = JSON.parse(questions);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      console.error('Failed to parse ai_questions:', questions);
      return [];
    }
  }, [questions]);

  // 自分のプロフィールまたは質問がない場合は非表示
  if (isMe || parsedQuestions.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
        aria-expanded={isExpanded}
        aria-controls="ai-questions-list"
      >
        <Lightbulb className="w-5 h-5" />
        <span>これを聞いてみて！</span>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            id="ai-questions-list"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-2">
              {parsedQuestions.map((question, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-amber-50 border border-amber-200 rounded-lg"
                >
                  <div className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      Q{index + 1}
                    </span>
                    <p className="text-gray-700 text-sm leading-relaxed">{question}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
