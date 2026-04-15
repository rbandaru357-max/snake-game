import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Point, GameState } from '../types';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from '../constants';
import { Trophy, RefreshCw, Play, Pause } from 'lucide-react';

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [gameState, setGameState] = useState<GameState>('START');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setFood(generateFood(INITIAL_SNAKE));
    setGameState('PLAYING');
  };

  const gameOver = () => {
    setGameState('GAME_OVER');
    if (score > highScore) setHighScore(score);
  };

  const moveSnake = useCallback(() => {
    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        gameOver();
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, generateFood, score, highScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          if (gameState === 'PLAYING') setGameState('PAUSED');
          else if (gameState === 'PAUSED') setGameState('PLAYING');
          else if (gameState === 'START' || gameState === 'GAME_OVER') resetGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameState]);

  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const loop = (time: number) => {
      if (time - lastUpdateRef.current > GAME_SPEED) {
        moveSnake();
        lastUpdateRef.current = time;
      }
      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, moveSnake]);

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-black/40 backdrop-blur-xl rounded-3xl border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)]">
      <div className="flex justify-between w-full px-4 items-center">
        <div className="flex flex-col">
          <span className="text-cyan-400/60 text-[10px] font-digital uppercase tracking-[0.3em] mb-1">Score</span>
          <div className="relative">
            <motion.span 
              key={`score-base-${score}`}
              className="text-6xl font-digital font-black text-cyan-400 tracking-tighter relative z-10"
              animate={{ 
                x: [0, -1, 1, 0],
                opacity: [1, 0.8, 1]
              }}
              transition={{ duration: 0.1, repeat: score > 0 ? 2 : 0 }}
            >
              {score.toString().padStart(4, '0')}
            </motion.span>
            {/* Glitch Overlays */}
            <AnimatePresence>
              {score > 0 && (
                <>
                  <motion.span 
                    key={`score-glitch-1-${score}`}
                    initial={{ opacity: 0, x: 0 }}
                    animate={{ opacity: [0, 1, 0], x: [-5, 5, -2] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 text-6xl font-digital font-black text-pink-500 tracking-tighter z-0 select-none pointer-events-none"
                  >
                    {score.toString().padStart(4, '0')}
                  </motion.span>
                  <motion.span 
                    key={`score-glitch-2-${score}`}
                    initial={{ opacity: 0, x: 0 }}
                    animate={{ opacity: [0, 0.8, 0], x: [5, -5, 2] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: 0.05 }}
                    className="absolute inset-0 text-6xl font-digital font-black text-blue-500 tracking-tighter z-0 select-none pointer-events-none"
                  >
                    {score.toString().padStart(4, '0')}
                  </motion.span>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-pink-400/60 text-[10px] font-digital uppercase tracking-[0.3em] mb-1">High Score</span>
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-pink-400" />
            <motion.span 
              key={highScore}
              className="text-5xl font-digital font-black text-pink-400 tracking-tighter drop-shadow-[0_0_15px_rgba(244,114,182,0.8)]"
              animate={score > 0 && score === highScore ? {
                scale: [1, 1.05, 1],
                filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)']
              } : {}}
            >
              {highScore.toString().padStart(4, '0')}
            </motion.span>
          </div>
        </div>
      </div>

      <div 
        className="relative bg-gray-900/80 rounded-xl overflow-hidden border-2 border-cyan-500/20"
        style={{ 
          width: GRID_SIZE * 20, 
          height: GRID_SIZE * 20,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Snake segments */}
        {snake.map((segment, i) => (
          <motion.div
            key={`${i}-${segment.x}-${segment.y}`}
            initial={false}
            animate={{ x: 0, y: 0 }}
            className="absolute rounded-sm"
            style={{
              width: 20,
              height: 20,
              left: segment.x * 20,
              top: segment.y * 20,
              background: i === 0 ? '#22d3ee' : '#0891b2',
              boxShadow: i === 0 ? '0 0 15px #22d3ee' : 'none',
              zIndex: i === 0 ? 10 : 1
            }}
          />
        ))}

        {/* Food */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="absolute rounded-full"
          style={{
            width: 16,
            height: 16,
            left: food.x * 20 + 2,
            top: food.y * 20 + 2,
            background: '#f472b6',
            boxShadow: '0 0 15px #f472b6'
          }}
        />

        {/* Overlays */}
        <AnimatePresence>
          {gameState !== 'PLAYING' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 p-6 text-center"
            >
              {gameState === 'START' && (
                <>
                  <h2 className="text-4xl font-bold text-cyan-400 mb-4 tracking-tighter italic">NEON SNAKE</h2>
                  <p className="text-gray-400 mb-8 text-sm">Use arrow keys to move. Press space to start.</p>
                  <button 
                    onClick={resetGame}
                    className="group relative px-8 py-3 bg-cyan-500 text-black font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                    <span className="relative flex items-center gap-2">
                      <Play className="w-5 h-5 fill-current" /> START GAME
                    </span>
                  </button>
                </>
              )}

              {gameState === 'PAUSED' && (
                <>
                  <h2 className="text-4xl font-bold text-yellow-400 mb-8 tracking-tighter italic">PAUSED</h2>
                  <button 
                    onClick={() => setGameState('PLAYING')}
                    className="group relative px-8 py-3 bg-yellow-500 text-black font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                    <span className="relative flex items-center gap-2">
                      <Play className="w-5 h-5 fill-current" /> RESUME
                    </span>
                  </button>
                </>
              )}

              {gameState === 'GAME_OVER' && (
                <>
                  <h2 className="text-4xl font-bold text-pink-500 mb-2 tracking-tighter italic">GAME OVER</h2>
                  <p className="text-gray-400 mb-8">Final Score: {score}</p>
                  <button 
                    onClick={resetGame}
                    className="group relative px-8 py-3 bg-pink-500 text-black font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                    <span className="relative flex items-center gap-2">
                      <RefreshCw className="w-5 h-5" /> TRY AGAIN
                    </span>
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-4 text-gray-500 text-xs font-mono uppercase tracking-widest">
        <div className="flex items-center gap-1">
          <kbd className="px-2 py-1 bg-gray-800 rounded border border-gray-700 text-gray-300">ARROWS</kbd> MOVE
        </div>
        <div className="flex items-center gap-1">
          <kbd className="px-2 py-1 bg-gray-800 rounded border border-gray-700 text-gray-300">SPACE</kbd> PAUSE/START
        </div>
      </div>
    </div>
  );
};
