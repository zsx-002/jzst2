import React from 'react';
import { GameState } from '../types/game';

interface GameStatsProps {
  gameState: GameState;
  currentBeat: number;
}

export const GameStats: React.FC<GameStatsProps> = ({ gameState, currentBeat }) => {
  return (
    <div className="cyberpunk-panel p-6">
      <div className="flex items-center justify-between">
        {/* Combo Display */}
        <div className="text-center">
          <div className="relative">
            <p className="text-3xl font-bold text-yellow-400 mb-1">COMBO</p>
            <p className="text-5xl font-bold text-yellow-300 neon-text">
              x{gameState.combo}
            </p>
            {gameState.combo > 0 && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
            )}
          </div>
        </div>
        
        {/* Score */}
        <div className="text-center">
          <p className="text-lg text-cyan-400 mb-1">分数</p>
          <p className="text-3xl font-bold text-cyan-300">{gameState.score}</p>
        </div>
        
        {/* Round */}
        <div className="text-center">
          <p className="text-lg text-purple-400 mb-1">回合</p>
          <p className="text-3xl font-bold text-purple-300">{gameState.currentCycle}</p>
        </div>
      </div>

      {gameState.combo > 0 && (
        <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-400/50 rounded-lg neon-glow">
          <p className="text-yellow-300 text-sm font-medium text-center">
            🎉 连击 x{gameState.combo}！保持节奏！
          </p>
        </div>
      )}
    </div>
  );
};