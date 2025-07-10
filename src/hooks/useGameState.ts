import { useState, useCallback } from 'react';
import { useEffect } from 'react';
import { GameState, Question, GridCell, CharacterState, ToastMessage } from '../types/game';

const GRID_WIDTH = 10;
const GRID_HEIGHT = 9;
const BEATS_PER_CYCLE = 8; // 恢复8拍循环

const initialCharacterState: CharacterState = {
  x: 1,
  y: 4,
  action: 'idle',
  isMoving: false
};

const createInitialGrid = (): GridCell[][] => {
  return Array(GRID_HEIGHT).fill(null).map((_, y) =>
    Array(GRID_WIDTH).fill(null).map((_, x) => ({
      x,
      y,
      occupied: false,
      type: 'normal'
    }))
  );
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentBeat: 0,
    currentCycle: 0,
    score: 0,
    combo: 0,
    isPlaying: false,
    character: initialCharacterState,
    currentQuestion: null,
    selectedAnswer: null,
    lastActionTime: 0,
    lastBeatTime: Date.now(),
    gameGrid: createInitialGrid()
  });

  const [toastMessage, setToastMessage] = useState<ToastMessage | null>(null);

  const generateQuestion = useCallback((): Question => {
    const num1 = Math.floor(Math.random() * 50) + 1;
    const num2 = Math.floor(Math.random() * 50) + 1;
    const operation = Math.random() > 0.5 ? '+' : '-';
    
    let correctAnswer: number;
    let question: string;
    
    if (operation === '+') {
      correctAnswer = num1 + num2;
      question = `${num1} + ${num2} = ?`;
    } else {
      // Ensure positive result for subtraction
      const larger = Math.max(num1, num2);
      const smaller = Math.min(num1, num2);
      correctAnswer = larger - smaller;
      question = `${larger} - ${smaller} = ?`;
    }
    
    // Generate wrong answer
    const wrongAnswer = correctAnswer + (Math.random() > 0.5 ? 
      Math.floor(Math.random() * 10) + 1 : 
      -(Math.floor(Math.random() * 10) + 1));
    
    const options = Math.random() > 0.5 ? 
      [correctAnswer, wrongAnswer] : 
      [wrongAnswer, correctAnswer];
    
    return {
      question,
      options,
      correctAnswer,
      timestamp: Date.now()
    };
  }, []);

  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      currentBeat: 0,
      currentCycle: 0,
      currentQuestion: generateQuestion(),
      lastBeatTime: Date.now()
    }));
  }, [generateQuestion]);

  const stopGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPlaying: false
    }));
  }, []);

  const selectAnswer = useCallback((answerIndex: number) => {
    setGameState(prev => ({
      ...prev,
      selectedAnswer: answerIndex
    }));
  }, []);

  const executeAction = useCallback((action: 'jump' | 'forward' | 'crouch') => {
    const now = Date.now();
    
    setGameState(prev => {
      const newCharacter = { ...prev.character };
      let newScore = prev.score;
      let newCombo = prev.combo;
      let actionResult: 'perfect' | 'good' | 'miss' = 'miss';
      
      // Check if action is on beat 8 (action beat)
      const isActionBeat = prev.currentBeat === 7; // 0-indexed, so beat 8 is index 7
      
      if (isActionBeat && prev.currentQuestion && prev.selectedAnswer !== null) {
        const isCorrectAnswer = prev.currentQuestion.options[prev.selectedAnswer] === prev.currentQuestion.correctAnswer;
        
        if (isCorrectAnswer) {
          // 计算与节拍点的时间差
          const beatInterval = (60 / 140) * 1000; // 140 BPM
          const timeSinceLastBeat = now - prev.lastBeatTime;
          const timeToNextBeat = beatInterval - timeSinceLastBeat;
          const timingOffset = Math.min(timeSinceLastBeat, timeToNextBeat);
          
          // 200ms窗口判定
          if (timingOffset <= 200) {
            // 100ms内为Perfect
            if (timingOffset <= 100) {
              actionResult = 'perfect';
              newScore += 20; // Perfect给更高分数
            } else {
              actionResult = 'good';
              newScore += 10;
            }
            newCombo += 1;
            
            // Execute character action
            switch (action) {
              case 'jump':
                newCharacter.y = Math.max(0, newCharacter.y - 1);
                break;
              case 'forward':
                newCharacter.x = Math.min(GRID_WIDTH - 1, newCharacter.x + 1);
                break;
              case 'crouch':
                newCharacter.y = Math.min(GRID_HEIGHT - 1, newCharacter.y + 1);
                break;
            }
          } else {
            // 超出时间窗口 - miss
            newCombo = 0;
            actionResult = 'miss';
          }
        } else {
          // Wrong answer - miss
          newCombo = 0;
          actionResult = 'miss';
        }
      } else if (!isActionBeat) {
        // Action executed on wrong beat - miss
        newCombo = 0;
        actionResult = 'miss';
      } else {
        // Action executed on correct beat but no answer selected - miss
        newCombo = 0;
        actionResult = 'miss';
      }
      
      newCharacter.action = action;
      newCharacter.isMoving = true;
      
      return {
        ...prev,
        character: newCharacter,
        score: newScore,
        combo: newCombo,
        lastActionTime: now,
        actionResult
      };
    });
    
    // Show appropriate toast based on action result
    setTimeout(() => {
      setGameState(prev => {
        if (prev.actionResult === 'perfect') {
          setToastMessage({
            message: 'Perfect! 完美时机！',
            type: 'perfect',
            timestamp: now
          });
        } else if (prev.actionResult === 'miss') {
          setToastMessage({
            message: 'MISS! 连击中断',
            type: 'miss',
            timestamp: now
          });
        }
        return {
          ...prev,
          actionResult: undefined // Clear the temporary flag
        };
      });
    }, 50);
  }, []);

  // Reset character action after animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        character: {
          ...prev.character,
          action: 'idle',
          isMoving: false
        }
      }));
    }, 300);
    
    return () => clearTimeout(timer);
  }, [gameState.character.action]);

  const updateBeat = useCallback(() => {
    const now = Date.now();
    
    setGameState(prev => {
      const newBeat = (prev.currentBeat + 1) % BEATS_PER_CYCLE;
      const newCycle = newBeat === 0 ? prev.currentCycle + 1 : prev.currentCycle;
      
      // Generate new question on beat 1 (index 0)
      const newQuestion = newBeat === 0 ? generateQuestion() : prev.currentQuestion;
      const newSelectedAnswer = newBeat === 0 ? null : prev.selectedAnswer;
      
      // Auto-move character forward each cycle (if combo > 0)
      const newCharacter = { ...prev.character };
      if (newBeat === 0 && prev.combo > 0) {
        newCharacter.x = Math.min(GRID_WIDTH - 1, newCharacter.x + 1);
      }
      
      return {
        ...prev,
        currentBeat: newBeat,
        currentCycle: newCycle,
        currentQuestion: newQuestion,
        selectedAnswer: newSelectedAnswer,
        character: newCharacter,
        lastBeatTime: now
      };
    });
  }, [generateQuestion]);

  const clearToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  return {
    gameState,
    startGame,
    stopGame,
    selectAnswer,
    executeAction,
    updateBeat,
    toastMessage,
    clearToast
  };
};