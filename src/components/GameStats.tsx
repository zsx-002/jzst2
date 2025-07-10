import React from 'react';
import { GameState } from '../types/game';

interface GameStatsProps {
  gameState: GameState;
  currentBeat: number;
}

export const GameStats: React.FC<GameStatsProps> = ({ gameState, currentBeat }) => {
  return (
    <div className="cyberpunk-panel p-3 lg:p-6 relative">
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Combo Display */}
        <div className="text-center">
          <div className="relative">
            <p className="text-lg lg:text-3xl font-bold text-yellow-400 mb-1">COMBO</p>
            <p className="text-2xl lg:text-5xl font-bold text-yellow-300 neon-text">
              x{gameState.combo}
            </p>
            {gameState.combo > 0 && (
              <div className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 w-3 h-3 lg:w-6 lg:h-6 bg-yellow-400 rounded-full animate-ping"></div>
            )}
          </div>
        </div>
        
        {/* Score */}
        <div className="text-center">
          <p className="text-sm lg:text-lg text-cyan-400 mb-1">分数</p>
          <p className="text-xl lg:text-3xl font-bold text-cyan-300">{gameState.score}</p>
        </div>
        
        {/* Round */}
        <div className="text-center">
          <p className="text-sm lg:text-lg text-purple-400 mb-1">回合</p>
          <p className="text-xl lg:text-3xl font-bold text-purple-300">{gameState.currentCycle}</p>
        </div>
      </div>

      {/* 只有在没有miss/perfect toast时才显示连击提示 */}
      {gameState.combo > 0 && !gameState.actionResult && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-40 px-4 py-2 bg-yellow-500/20 border border-yellow-400/50 rounded-lg neon-glow">
          <p className="text-yellow-300 text-sm font-medium text-center">
            🎉 连击 x{gameState.combo}！保持节奏！
          </p>
        </div>
      )}
      
      {/* Toast notifications positioned at top center */}
      {gameState.actionResult && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-50">
          <div className={`
            px-4 py-2 rounded-lg shadow-lg transition-all duration-300
            ${gameState.actionResult === 'miss' 
              ? 'bg-red-500 text-white'
              : 'bg-cyan-400 text-gray-800'
            }
          `}>
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {gameState.actionResult === 'miss' ? '❌' : '⭐'}
              </span>
              <span className="font-bold text-sm">
                {gameState.actionResult === 'miss' ? 'MISS! 连击中断' : 'Perfect! 完美时机！'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};