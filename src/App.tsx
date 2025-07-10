import React, { useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useGameState } from './hooks/useGameState';
import { useMetronome } from './hooks/useMetronome';
import { QuestionPanel } from './components/QuestionPanel';
import { GameBoard } from './components/GameBoard';
import { ActionPanel } from './components/ActionPanel';
import { GameStats } from './components/GameStats';
import { ToastNotification } from './components/ToastNotification';

function App() {
  const prevCombo = useRef(0);
  
  const {
    gameState,
    startGame,
    stopGame,
    selectAnswer,
    executeAction,
    updateBeat,
    toastMessage,
    clearToast
  } = useGameState();

  const { playSuccessSound, playErrorSound, playCelebrationSound } = useMetronome({
    bpm: 128,
    isPlaying: gameState.isPlaying,
    onBeat: updateBeat,
    onActionSuccess: () => {}
  });

  useEffect(() => {
    if (gameState.combo > prevCombo.current) {
      if (gameState.combo > 0) {
        playSuccessSound();
        
        if (gameState.combo === 5) {
          playCelebrationSound();
        }
      }
    } else if (gameState.combo === 0 && prevCombo.current > 0) {
      playErrorSound();
    }
    
    prevCombo.current = gameState.combo;
  }, [gameState.combo, playSuccessSound, playErrorSound, playCelebrationSound]);

  const handleGameToggle = () => {
    if (gameState.isPlaying) {
      stopGame();
    } else {
      startGame();
    }
  };

  const handleReset = () => {
    stopGame();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-black relative">
      {/* Animated background stars */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen p-4 pb-8">
        {/* Game Controls */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={handleGameToggle}
            className={`
              px-6 py-3 rounded-lg font-bold text-white transition-all duration-300
              flex items-center gap-2 shadow-lg hover:scale-105 text-lg
              border-2 neon-border
              ${gameState.isPlaying 
                ? 'bg-red-500/20 border-red-400 hover:bg-red-500/30 text-red-300' 
                : 'bg-green-500/20 border-green-400 hover:bg-green-500/30 text-green-300'
              }
            `}
          >
            {gameState.isPlaying ? (
              <>
                <Pause className="w-5 h-5" />
                暂停
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                开始
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="px-6 py-3 rounded-lg font-bold text-gray-300 bg-gray-500/20 border-2 border-gray-400 hover:bg-gray-500/30 transition-all duration-300 flex items-center gap-2 shadow-lg hover:scale-105 text-lg neon-border"
          >
            <RotateCcw className="w-5 h-5" />
            重置
          </button>
        </div>

        {/* Game Layout - 优化移动端高度 */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-1 lg:gap-6 landscape:grid-cols-3 landscape:gap-1">
          {/* Left Panel - Questions */}
          <div className="lg:col-span-3 order-1">
            <QuestionPanel
              question={gameState.currentQuestion}
              selectedAnswer={gameState.selectedAnswer}
              onSelectAnswer={selectAnswer}
              currentBeat={gameState.currentBeat}
            />
          </div>

          {/* Center Panel - Game Board & Stats */}
          <div className="lg:col-span-6 space-y-2 lg:space-y-4 order-2 relative">
            <GameStats 
              gameState={gameState} 
              currentBeat={gameState.currentBeat}
            />
            <GameBoard
              grid={gameState.gameGrid}
              character={gameState.character}
              currentBeat={gameState.currentBeat}
            />
            
            {/* Toast Notifications - 浮在中间区域 */}
            {toastMessage && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                <ToastNotification
                  message={toastMessage.message}
                  type={toastMessage.type}
                  isVisible={true}
                  onClose={clearToast}
                />
              </div>
            )}
          </div>

          {/* Right Panel - Actions */}
          <div className="lg:col-span-3 order-3">
            <ActionPanel
              onAction={executeAction}
              currentBeat={gameState.currentBeat}
              isPlaying={gameState.isPlaying}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;