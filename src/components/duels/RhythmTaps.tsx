import React, { useState, useEffect, useCallback } from 'react';

interface RhythmTapsProps {
  onComplete: (score: number) => void;
}

interface Target {
  id: number;
  timestamp: number;
  hit: boolean;
  accuracy?: 'perfect' | 'good' | 'hit' | 'miss';
}

export const RhythmTaps: React.FC<RhythmTapsProps> = ({ onComplete }) => {
  const [targets, setTargets] = useState<Target[]>([]);
  const [currentTarget, setCurrentTarget] = useState(0);
  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const totalTargets = 5;

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !started) {
      setStarted(true);
      // Generate targets
      const newTargets: Target[] = [];
      for (let i = 0; i < totalTargets; i++) {
        newTargets.push({
          id: i,
          timestamp: Date.now() + (i + 1) * 1000,
          hit: false,
        });
      }
      setTargets(newTargets);
    }
  }, [countdown, started, totalTargets]);

  const handleTap = useCallback(() => {
    if (!started || currentTarget >= targets.length) return;

    const target = targets[currentTarget];
    const now = Date.now();
    const timeDiff = Math.abs(now - target.timestamp);

    let accuracy: 'perfect' | 'good' | 'hit' | 'miss';
    let points = 0;

    if (timeDiff < 150) {
      accuracy = 'perfect';
      points = 100;
    } else if (timeDiff < 300) {
      accuracy = 'good';
      points = 75;
    } else if (timeDiff < 500) {
      accuracy = 'hit';
      points = 50;
    } else {
      accuracy = 'miss';
      points = 0;
    }

    setTargets((prev) =>
      prev.map((t, i) => (i === currentTarget ? { ...t, hit: true, accuracy } : t))
    );
    setScore((prev) => prev + points);
    setCurrentTarget((prev) => prev + 1);

    if (currentTarget + 1 >= totalTargets) {
      setTimeout(() => {
        const finalScore = score + points;
        onComplete(Math.min(100, (finalScore / (totalTargets * 100)) * 100));
      }, 500);
    }
  }, [started, currentTarget, targets, score, totalTargets, onComplete]);

  useEffect(() => {
    if (started && currentTarget < targets.length) {
      const target = targets[currentTarget];
      const timeout = setTimeout(() => {
        // Auto-miss if not hit in time
        if (!target.hit) {
          setTargets((prev) =>
            prev.map((t, i) =>
              i === currentTarget ? { ...t, hit: true, accuracy: 'miss' } : t
            )
          );
          setCurrentTarget((prev) => prev + 1);

          if (currentTarget + 1 >= totalTargets) {
            setTimeout(() => {
              onComplete(Math.min(100, (score / (totalTargets * 100)) * 100));
            }, 500);
          }
        }
      }, Math.max(0, target.timestamp - Date.now() + 500));

      return () => clearTimeout(timeout);
    }
  }, [started, currentTarget, targets, score, totalTargets, onComplete]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleTap();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleTap]);

  if (countdown > 0) {
    return (
      <div className="text-center">
        <div className="text-6xl font-bold text-yellow-400 animate-pulse">
          {countdown}
        </div>
        <p className="text-white mt-4">Get ready to tap!</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="mb-4">
        <p className="text-white text-lg mb-2">
          Tap when the target appears! Press SPACE or ENTER
        </p>
        <div className="text-2xl font-bold text-yellow-400">
          Score: {score} / {totalTargets * 100}
        </div>
      </div>

      <div className="relative h-48 flex items-center justify-center">
        {started && currentTarget < targets.length && (
          <button
            onClick={handleTap}
            className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-red-500 hover:from-yellow-300 hover:to-red-400 transform hover:scale-110 transition-all duration-200 text-white text-4xl font-bold shadow-lg animate-pulse"
            aria-label="Tap target"
          >
            TAP!
          </button>
        )}
      </div>

      <div className="mt-4 flex justify-center space-x-2">
        {targets.map((target, index) => (
          <div
            key={target.id}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              target.hit
                ? target.accuracy === 'perfect'
                  ? 'bg-green-500'
                  : target.accuracy === 'good'
                  ? 'bg-blue-500'
                  : target.accuracy === 'hit'
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
                : 'bg-gray-600'
            }`}
          >
            {index === currentTarget && !target.hit ? '◉' : target.hit ? '✓' : '○'}
          </div>
        ))}
      </div>
    </div>
  );
};
