import React, { useState, useEffect } from 'react';
import { RhythmDuel } from '../duel/rhythmDuel';

interface RhythmDuelComponentProps {
  duel: RhythmDuel;
  onComplete: (score: number) => void;
}

export const RhythmDuelComponent: React.FC<RhythmDuelComponentProps> = ({ duel, onComplete }) => {
  const [startTime, setStartTime] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [score, setScore] = useState(0);
  const [notes] = useState(duel.getNotes());

  useEffect(() => {
    const start = Date.now();
    setStartTime(start);

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      setCurrentTime(elapsed);

      if (elapsed > notes[notes.length - 1] + 1000) {
        clearInterval(interval);
        const finalScore = duel.calculateScore();
        setScore(finalScore);
        onComplete(finalScore);
      }
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [duel, notes, onComplete]);

  const handleHit = () => {
    const elapsed = Date.now() - startTime;
    duel.hitNote(elapsed);
  };

  const getActiveNotes = () => {
    return notes.filter(noteTime => {
      const diff = noteTime - currentTime;
      return diff > -200 && diff < 1000;
    });
  };

  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      minHeight: '400px'
    }}>
      <h2>Rhythm Duel</h2>
      <p>Hit the notes at the right time!</p>
      
      <div style={{ 
        position: 'relative',
        height: '300px',
        backgroundColor: '#f0f0f0',
        margin: '20px 0',
        overflow: 'hidden',
        borderRadius: '8px'
      }}>
        {getActiveNotes().map((noteTime, index) => {
          const progress = (currentTime - (noteTime - 1000)) / 1000;
          const yPosition = 100 - (progress * 100);
          
          return (
            <div
              key={`${noteTime}-${index}`}
              style={{
                position: 'absolute',
                top: `${yPosition}%`,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60px',
                height: '20px',
                backgroundColor: '#FF5722',
                borderRadius: '4px',
                transition: 'top 0.016s linear'
              }}
            />
          );
        })}
        
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80px',
          height: '4px',
          backgroundColor: '#4CAF50'
        }} />
      </div>
      
      <button 
        onClick={handleHit}
        disabled={duel.isComplete()}
        style={{
          padding: '20px 40px',
          fontSize: '24px',
          cursor: 'pointer',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 'bold'
        }}
      >
        HIT!
      </button>
      
      <div style={{ marginTop: '20px' }}>
        Progress: {duel.getPlayerHits().length}/{notes.length}
      </div>
      
      {duel.isComplete() && (
        <div style={{ marginTop: '20px', fontSize: '24px', fontWeight: 'bold' }}>
          Score: {score}
        </div>
      )}
    </div>
  );
};
