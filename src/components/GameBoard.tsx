import React from 'react';
import { CharacterState, GridCell } from '../types/game';

interface GameBoardProps {
  grid: GridCell[][];
  character: CharacterState;
  currentBeat: number;
}

export const GameBoard: React.FC<GameBoardProps> = ({ grid, character, currentBeat }) => {
  const getCharacterSprite = () => {
    switch (character.action) {
      case 'jump':
        return '🦘';
      case 'forward':
        return '🏃';
      case 'crouch':
        return '🙇';
      default:
        return '🧙‍♂️';
    }
  };

  const getCharacterTransform = () => {
    const baseTransform = `translate(${character.x * 100}%, ${character.y * 100}%)`;
    if (character.action === 'jump') {
      return `${baseTransform} translateY(-20px)`;
    }
    return baseTransform;
  };

  return (
    <div className="cyberpunk-panel relative">
      {/* Game area with cyberpunk cityscape background */}
      <div className="relative w-full h-96 bg-gradient-to-b from-purple-900/50 to-indigo-900/50 rounded-lg overflow-hidden">
        {/* Cyberpunk cityscape background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/20 to-indigo-900/40">
          {/* Building silhouettes */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          {/* Grid lines for cyberpunk effect */}
          <div className="absolute inset-0 opacity-20">
            <div className="grid grid-cols-10 grid-rows-9 h-full w-full">
              {grid.map((row, y) =>
                row.map((cell, x) => (
                  <div
                    key={`${x}-${y}`}
                    className={`
                      border border-cyan-400/20
                      ${cell.type === 'obstacle' ? 'bg-red-500/30' : ''}
                      ${cell.type === 'target' ? 'bg-yellow-500/30' : ''}
                    `}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Character */}
        <div
          className={`
            absolute w-12 h-12 flex items-center justify-center text-3xl
            transition-all duration-300 ease-in-out z-10
            ${character.isMoving ? 'scale-110' : 'scale-100'}
          `}
          style={{
            transform: getCharacterTransform(),
            left: '5%',
            top: '5%'
          }}
        >
          <div className="animate-bounce filter drop-shadow-lg">
            {getCharacterSprite()}
          </div>
        </div>

        {/* Action indicator */}
        <div className="absolute top-4 right-4">
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center text-2xl
            ${currentBeat === 7 ? 'animate-pulse bg-green-400/30 border-2 border-green-400' : 'bg-gray-600/30 border border-gray-400'}
          `}>
            ⚡
          </div>
        </div>

        {/* Beat progress bar */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex space-x-1">
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className={`
                  flex-1 h-2 rounded-full transition-all duration-150
                  ${currentBeat === i
                    ? 'bg-cyan-400 shadow-lg shadow-cyan-400/50'
                    : currentBeat > i
                    ? 'bg-purple-400'
                    : 'bg-gray-600/50'
                  }
                `}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};