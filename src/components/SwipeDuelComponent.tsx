import React, { useState, useEffect } from 'react';
import { SwipeDuel } from '../duel/swipeDuel';

interface SwipeDuelComponentProps {
  duel: SwipeDuel;
  onComplete: (score: number) => void;
}

export const SwipeDuelComponent: React.FC<SwipeDuelComponentProps> = ({ duel, onComplete }) => {
  const [sequence, setSequence] = useState<('up' | 'down' | 'left' | 'right')[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    setSequence(duel.getSequence());
  }, [duel]);

  const handleSwipe = (direction: 'up' | 'down' | 'left' | 'right') => {
    duel.addInput(direction);
    setCurrentIndex(currentIndex + 1);

    if (duel.isComplete()) {
      const finalScore = duel.calculateScore();
      setScore(finalScore);
      onComplete(finalScore);
    }
  };

  const getArrowSymbol = (direction: 'up' | 'down' | 'left' | 'right') => {
    const arrows = { up: '↑', down: '↓', left: '←', right: '→' };
    return arrows[direction];
  };

  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <h2>Swipe Duel</h2>
      <p>Swipe in the correct direction!</p>
      
      <div style={{ 
        fontSize: '48px', 
        margin: '20px 0',
        minHeight: '60px'
      }}>
        {currentIndex < sequence.length && getArrowSymbol(sequence[currentIndex])}
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        Progress: {currentIndex}/{sequence.length}
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px',
        maxWidth: '300px',
        margin: '0 auto'
      }}>
        <div />
        <button 
          onClick={() => handleSwipe('up')}
          disabled={duel.isComplete()}
          style={{
            padding: '20px',
            fontSize: '24px',
            cursor: 'pointer',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '8px'
          }}
        >
          ↑
        </button>
        <div />
        
        <button 
          onClick={() => handleSwipe('left')}
          disabled={duel.isComplete()}
          style={{
            padding: '20px',
            fontSize: '24px',
            cursor: 'pointer',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '8px'
          }}
        >
          ←
        </button>
        <button 
          onClick={() => handleSwipe('down')}
          disabled={duel.isComplete()}
          style={{
            padding: '20px',
            fontSize: '24px',
            cursor: 'pointer',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '8px'
          }}
        >
          ↓
        </button>
        <button 
          onClick={() => handleSwipe('right')}
          disabled={duel.isComplete()}
          style={{
            padding: '20px',
            fontSize: '24px',
            cursor: 'pointer',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '8px'
          }}
        >
          →
        </button>
      </div>
      
      {duel.isComplete() && (
        <div style={{ marginTop: '20px', fontSize: '24px', fontWeight: 'bold' }}>
          Score: {score}
        </div>
      )}
    </div>
  );
};
