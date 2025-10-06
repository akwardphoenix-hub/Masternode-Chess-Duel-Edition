import React, { useState, useEffect } from 'react';
import { MirrorDuel } from '../duel/mirrorDuel';

interface MirrorDuelComponentProps {
  duel: MirrorDuel;
  onComplete: (score: number) => void;
}

export const MirrorDuelComponent: React.FC<MirrorDuelComponentProps> = ({ duel, onComplete }) => {
  const [pattern, setPattern] = useState<number[]>([]);
  const [showPattern, setShowPattern] = useState(true);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const p = duel.getPattern();
    setPattern(p);

    // Show pattern for 3 seconds, then hide
    const timer = setTimeout(() => {
      setShowPattern(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [duel]);

  const handleInput = (value: number) => {
    if (showPattern) return;
    
    duel.addInput(value);

    if (duel.isComplete()) {
      const finalScore = duel.calculateScore();
      setScore(finalScore);
      onComplete(finalScore);
    }
  };

  const playerInput = duel.getPlayerInput();

  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <h2>Mirror Duel</h2>
      <p>{showPattern ? 'Memorize the pattern!' : 'Repeat the pattern!'}</p>
      
      <div style={{ 
        minHeight: '60px',
        fontSize: '32px',
        margin: '20px 0',
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        flexWrap: 'wrap'
      }}>
        {showPattern ? (
          pattern.map((num, index) => (
            <div 
              key={index}
              style={{
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#9C27B0',
                color: 'white',
                borderRadius: '8px',
                fontWeight: 'bold'
              }}
            >
              {num}
            </div>
          ))
        ) : (
          <div style={{ color: '#999' }}>Pattern hidden</div>
        )}
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        Your input: {playerInput.join(', ')}
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        Progress: {playerInput.length}/{pattern.length}
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '10px',
        maxWidth: '400px',
        margin: '0 auto'
      }}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button 
            key={num}
            onClick={() => handleInput(num)}
            disabled={showPattern || duel.isComplete()}
            style={{
              padding: '20px',
              fontSize: '20px',
              cursor: showPattern || duel.isComplete() ? 'not-allowed' : 'pointer',
              backgroundColor: showPattern || duel.isComplete() ? '#ccc' : '#9C27B0',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold'
            }}
          >
            {num}
          </button>
        ))}
      </div>
      
      {duel.isComplete() && (
        <div style={{ marginTop: '20px', fontSize: '24px', fontWeight: 'bold' }}>
          Score: {score}
        </div>
      )}
    </div>
  );
};
