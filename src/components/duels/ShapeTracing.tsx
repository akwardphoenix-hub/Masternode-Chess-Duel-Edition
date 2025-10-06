import React, { useState, useEffect, useRef } from 'react';

interface ShapeTracingProps {
  onComplete: (score: number) => void;
}

interface Point {
  x: number;
  y: number;
}

export const ShapeTracing: React.FC<ShapeTracingProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [userPath, setUserPath] = useState<Point[]>([]);
  const [targetShape, setTargetShape] = useState<Point[]>([]);
  const [countdown, setCountdown] = useState(3);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !started) {
      setStarted(true);
      generateShape();
    }
  }, [countdown, started]);

  const generateShape = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 80;
    const points = 6;

    const shape: Point[] = [];
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      shape.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
      });
    }
    setTargetShape(shape);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw target shape
    if (targetShape.length > 0) {
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(targetShape[0].x, targetShape[0].y);
      for (let i = 1; i < targetShape.length; i++) {
        ctx.lineTo(targetShape[i].x, targetShape[i].y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw user path
    if (userPath.length > 0) {
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(userPath[0].x, userPath[0].y);
      for (let i = 1; i < userPath.length; i++) {
        ctx.lineTo(userPath[i].x, userPath[i].y);
      }
      ctx.stroke();
    }
  }, [targetShape, userPath]);

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const getTouchPos = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  };

  const startDrawing = (point: Point) => {
    if (!started || completed) return;
    setIsDrawing(true);
    setUserPath([point]);
  };

  const draw = (point: Point) => {
    if (!isDrawing || !started || completed) return;
    setUserPath((prev) => [...prev, point]);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    if (userPath.length > 10) {
      calculateScore();
    }
  };

  const calculateScore = () => {
    if (userPath.length === 0 || targetShape.length === 0) {
      onComplete(0);
      return;
    }

    // Calculate accuracy based on how close the user's path is to the target
    let totalDistance = 0;
    const samplePoints = Math.min(userPath.length, 50);
    
    for (let i = 0; i < samplePoints; i++) {
      const userIndex = Math.floor((i / samplePoints) * userPath.length);
      const targetIndex = Math.floor((i / samplePoints) * targetShape.length);
      
      const userPoint = userPath[userIndex];
      const targetPoint = targetShape[targetIndex];
      
      const distance = Math.sqrt(
        Math.pow(userPoint.x - targetPoint.x, 2) +
        Math.pow(userPoint.y - targetPoint.y, 2)
      );
      
      totalDistance += distance;
    }

    const avgDistance = totalDistance / samplePoints;
    const maxAllowedDistance = 50;
    const accuracy = Math.max(0, 1 - avgDistance / maxAllowedDistance);
    const score = Math.floor(accuracy * 100);

    setCompleted(true);
    setTimeout(() => {
      onComplete(score);
    }, 500);
  };

  if (countdown > 0) {
    return (
      <div className="text-center">
        <div className="text-6xl font-bold text-yellow-400 animate-pulse">
          {countdown}
        </div>
        <p className="text-white mt-4">Get ready to trace!</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <p className="text-white text-lg mb-4">
        Trace the shape as accurately as possible!
      </p>
      
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        className="border-2 border-yellow-400 rounded-lg mx-auto bg-gray-900 cursor-crosshair"
        onMouseDown={(e) => startDrawing(getMousePos(e))}
        onMouseMove={(e) => draw(getMousePos(e))}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={(e) => {
          e.preventDefault();
          startDrawing(getTouchPos(e));
        }}
        onTouchMove={(e) => {
          e.preventDefault();
          draw(getTouchPos(e));
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          stopDrawing();
        }}
      />

      {!completed && (
        <button
          onClick={calculateScore}
          className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors"
          disabled={userPath.length < 10}
        >
          Submit
        </button>
      )}
    </div>
  );
};
