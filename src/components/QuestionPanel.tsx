import React from 'react';
import { Question } from '../types/game';

interface QuestionPanelProps {
  question: Question | null;
  selectedAnswer: number | null;
  onSelectAnswer: (answerIndex: number) => void;
  currentBeat: number;
}

export const QuestionPanel: React.FC<QuestionPanelProps> = ({
  question,
  selectedAnswer,
  onSelectAnswer,
  currentBeat
}) => {
  if (!question) {
    return (
      <div className="cyberpunk-panel h-full flex items-center justify-center">
        <p className="text-cyan-400 text-lg">等待题目...</p>
      </div>
    );
  }

  const isAnswerPhase = currentBeat < 7;

  return (
    <div className="cyberpunk-panel h-full flex flex-col p-6">
      {/* Question Display */}
      <div className="mb-8">
        <div className="text-center p-6 rounded-lg bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-cyan-400/50">
          <p className="text-4xl font-bold text-white mb-2">{question.question}</p>
        </div>
      </div>

      {/* Answer Options */}
      <div className="space-y-6 flex-1">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => isAnswerPhase && onSelectAnswer(index)}
            disabled={!isAnswerPhase}
            className={`
              w-full p-8 rounded-lg font-bold text-3xl transition-all duration-300
              border-2 cyberpunk-button
              ${!isAnswerPhase ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
              ${selectedAnswer === index
                ? 'bg-cyan-500/30 border-cyan-400 text-cyan-300 neon-glow'
                : 'bg-purple-900/30 border-purple-400/50 text-purple-300 hover:border-purple-400'
              }
            `}
          >
            {option}
          </button>
        ))}
      </div>

      {!isAnswerPhase && (
        <div className="mt-4 p-3 bg-orange-500/20 border border-orange-400/50 rounded-lg">
          <p className="text-orange-300 text-sm font-medium text-center">
            答题时间结束！准备执行动作
          </p>
        </div>
      )}
    </div>
  );
};