import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2;

export const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameOver'>('idle');
  
  const snakeRef = useRef<Point[]>([{ x: 10, y: 10 }]);
  const foodRef = useRef<Point>({ x: 15, y: 15 });
  const directionRef = useRef<Point>({ x: 1, y: 0 });
  const nextDirectionRef = useRef<Point>({ x: 1, y: 0 });
  const speedRef = useRef(INITIAL_SPEED);
  const lastUpdateRef = useRef(0);

  const generateFood = useCallback(() => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = snakeRef.current.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOnSnake) break;
    }
    foodRef.current = newFood;
  }, []);

  const resetGame = () => {
    snakeRef.current = [{ x: 10, y: 10 }];
    directionRef.current = { x: 1, y: 0 };
    nextDirectionRef.current = { x: 1, y: 0 };
    speedRef.current = INITIAL_SPEED;
    setScore(0);
    generateFood();
    setGameState('playing');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (directionRef.current.y === 0) nextDirectionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          if (directionRef.current.y === 0) nextDirectionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          if (directionRef.current.x === 0) nextDirectionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          if (directionRef.current.x === 0) nextDirectionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (gameState !== 'playing') return;

    let animationFrameId: number;

    const update = (timestamp: number) => {
      if (timestamp - lastUpdateRef.current > speedRef.current) {
        lastUpdateRef.current = timestamp;
        directionRef.current = nextDirectionRef.current;

        const head = { ...snakeRef.current[0] };
        head.x += directionRef.current.x;
        head.y += directionRef.current.y;

        // Collision detection
        if (
          head.x < 0 ||
          head.x >= GRID_SIZE ||
          head.y < 0 ||
          head.y >= GRID_SIZE ||
          snakeRef.current.some((segment) => segment.x === head.x && segment.y === head.y)
        ) {
          setGameState('gameOver');
          if (score > highScore) setHighScore(score);
          return;
        }

        const newSnake = [head, ...snakeRef.current];

        // Food consumption
        if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
          setScore((s) => s + 10);
          speedRef.current = Math.max(50, speedRef.current - SPEED_INCREMENT);
          generateFood();
        } else {
          newSnake.pop();
        }

        snakeRef.current = newSnake;
      }

      draw();
      animationFrameId = requestAnimationFrame(update);
    };

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const cellSize = canvas.width / GRID_SIZE;

      // Clear
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid lines (subtle)
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvas.width, i * cellSize);
        ctx.stroke();
      }

      // Food
      ctx.fillStyle = '#ff00ff'; // Neon Magenta
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ff00ff';
      ctx.beginPath();
      ctx.arc(
        foodRef.current.x * cellSize + cellSize / 2,
        foodRef.current.y * cellSize + cellSize / 2,
        cellSize / 3,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.shadowBlur = 0;

      // Snake
      snakeRef.current.forEach((segment, index) => {
        const isHead = index === 0;
        ctx.fillStyle = isHead ? '#00ffff' : '#008888'; // Neon Cyan
        if (isHead) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#00ffff';
        }
        
        // Rounded segments
        const padding = 2;
        ctx.beginPath();
        ctx.roundRect(
          segment.x * cellSize + padding,
          segment.y * cellSize + padding,
          cellSize - padding * 2,
          cellSize - padding * 2,
          4
        );
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    };

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState, score, highScore, generateFood]);

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="flex justify-between w-full max-w-[400px] font-mono text-sm text-cyan-400">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4" />
          <span>SCORE: {score}</span>
        </div>
        <div>HIGH SCORE: {highScore}</div>
      </div>

      <div className="relative group">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="border-2 border-cyan-500/30 rounded-lg shadow-[0_0_30px_rgba(0,255,255,0.1)] bg-black"
        />
        
        <AnimatePresence>
          {gameState !== 'playing' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-lg"
            >
              {gameState === 'idle' ? (
                <div className="text-center space-y-6">
                  <h2 className="text-4xl font-bold text-cyan-400 tracking-tighter">NEON SNAKE</h2>
                  <p className="text-cyan-400/60 text-sm font-mono">USE ARROW KEYS TO NAVIGATE</p>
                  <Button 
                    onClick={resetGame}
                    className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 py-6 text-lg rounded-full shadow-[0_0_20px_rgba(0,255,255,0.5)] transition-all hover:scale-105"
                  >
                    <Play className="mr-2 fill-current" /> START GAME
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <h2 className="text-4xl font-bold text-magenta-500 tracking-tighter text-pink-500">GAME OVER</h2>
                  <div className="space-y-1">
                    <p className="text-cyan-400/60 text-sm font-mono uppercase">Final Score</p>
                    <p className="text-5xl font-black text-white">{score}</p>
                  </div>
                  <Button 
                    onClick={resetGame}
                    variant="outline"
                    className="border-cyan-500 text-cyan-500 hover:bg-cyan-500/10 font-bold px-8 py-6 text-lg rounded-full"
                  >
                    <RotateCcw className="mr-2" /> TRY AGAIN
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
