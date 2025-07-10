import React from 'react';
import { ChevronUp, ChevronRight, ChevronDown } from 'lucide-react';

interface ActionPanelProps {
  onAction: (action: 'jump' | 'forward' | 'crouch') => void;
  currentBeat: number;
  isPlaying: boolean;
}

export const ActionPanel: React.FC<ActionPanelProps> = ({
  onAction,
  currentBeat,
  isPlaying
}) => {
  const isActionBeat = currentBeat === 7;

  return (
    <div className="cyberpunk-panel h-full flex flex-col p-6">
      <div className="space-y-6 flex-1 flex flex-col">
        <button
          onClick={() => onAction('jump')}
          disabled={!isPlaying}
          className={`
            flex-1 rounded-lg border-2 font-bold text-2xl transition-all duration-300
            flex items-center justify-center gap-3 cyberpunk-button min-h-[100px]
            ${isActionBeat 
              ? 'bg-green-500/30 text-green-300 border-green-400 neon-glow animate-pulse' 
              : 'bg-cyan-900/30 text-cyan-300 border-cyan-400/50 hover:border-cyan-400'
            }
            ${!isPlaying ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
          `}
        >
          <ChevronUp className="w-8 h-8" />
          上跳
        </button>

        <button
          onClick={() => onAction('forward')}
          disabled={!isPlaying}
          className={`
            flex-1 rounded-lg border-2 font-bold text-2xl transition-all duration-300
            flex items-center justify-center gap-3 cyberpunk-button min-h-[100px]
            ${isActionBeat 
              ? 'bg-blue-500/30 text-blue-300 border-blue-400 neon-glow animate-pulse' 
              : 'bg-cyan-900/30 text-cyan-300 border-cyan-400/50 hover:border-cyan-400'
            }
            ${!isPlaying ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
          `}
        >
          <ChevronRight className="w-8 h-8" />
          前进
        </button>

        <button
          onClick={() => onAction('crouch')}
          disabled={!isPlaying}
          className={`
            flex-1 rounded-lg border-2 font-bold text-2xl transition-all duration-300
            flex items-center justify-center gap-3 cyberpunk-button min-h-[100px]
            ${isActionBeat 
              ? 'bg-purple-500/30 text-purple-300 border-purple-400 neon-glow animate-pulse' 
              : 'bg-cyan-900/30 text-cyan-300 border-cyan-400/50 hover:border-cyan-400'
            }
            ${!isPlaying ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
          `}
        >
          <ChevronDown className="w-8 h-8" />
          下蹲
        </button>
      </div>

      {isActionBeat && (
        <div className="mt-4 p-3 bg-green-500/20 border border-green-400/50 rounded-lg neon-glow">
          <p className="text-green-300 text-sm font-medium text-center">
            ⚡ 动作时间！点击执行动作 ⚡
          </p>
        </div>
      )}
    </div>
  );
};