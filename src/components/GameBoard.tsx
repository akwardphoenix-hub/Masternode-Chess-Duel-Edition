import React, { useState } from 'react';
import { GameState, DuelType, ThemeType } from '../types';
import { PieceCard } from './PieceCard';
import { SwipeDuelComponent } from './SwipeDuelComponent';
import { RhythmDuelComponent } from './RhythmDuelComponent';
import { MirrorDuelComponent } from './MirrorDuelComponent';
import { DuelManager } from '../duel/duelManager';
import { SwipeDuel } from '../duel/swipeDuel';
import { RhythmDuel } from '../duel/rhythmDuel';
import { MirrorDuel } from '../duel/mirrorDuel';
import { getThemeDescription } from '../utils/themeUtils';
import sampleMatch from '../../game.rules.json';

export const GameBoard: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(sampleMatch.sampleMatch as GameState);
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);
  const [duelState, setDuelState] = useState<{
    active: boolean;
    type: DuelType | null;
    duel: SwipeDuel | RhythmDuel | MirrorDuel | null;
    attacker: string | null;
    defender: string | null;
  }>({
    active: false,
    type: null,
    duel: null,
    attacker: null,
    defender: null
  });

  const duelManager = new DuelManager(gameState.theme);

  const startDuel = (attackerId: string, defenderId: string, duelType: DuelType) => {
    const duel = duelManager.createDuel(duelType);
    setDuelState({
      active: true,
      type: duelType,
      duel,
      attacker: attackerId,
      defender: defenderId
    });
  };

  const handleDuelComplete = (score: number) => {
    if (!duelState.attacker || !duelState.defender) return;

    // Simulate defender score (in real game, both players would play)
    const defenderScore = Math.floor(Math.random() * 100);

    const attacker = [...gameState.whitePlayer.pieces, ...gameState.blackPlayer.pieces]
      .find(p => p.id === duelState.attacker);
    const defender = [...gameState.whitePlayer.pieces, ...gameState.blackPlayer.pieces]
      .find(p => p.id === duelState.defender);

    if (attacker && defender && duelState.type) {
      const result = duelManager.resolveDuel(attacker, defender, duelState.type, score, defenderScore);
      duelManager.applyDuelResult(attacker, defender, result);

      setGameState({
        ...gameState,
        lastDuel: result
      });

      setDuelState({
        active: false,
        type: null,
        duel: null,
        attacker: null,
        defender: null
      });
    }
  };

  const renderDuel = () => {
    if (!duelState.active || !duelState.duel) return null;

    switch (duelState.type) {
      case 'swipe':
        return <SwipeDuelComponent duel={duelState.duel as SwipeDuel} onComplete={handleDuelComplete} />;
      case 'rhythm':
        return <RhythmDuelComponent duel={duelState.duel as RhythmDuel} onComplete={handleDuelComplete} />;
      case 'mirror':
        return <MirrorDuelComponent duel={duelState.duel as MirrorDuel} onComplete={handleDuelComplete} />;
      default:
        return null;
    }
  };

  if (duelState.active) {
    return (
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        {renderDuel()}
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>Masternode Chess: Duel Edition</h1>
        <div style={{ fontSize: '18px', marginTop: '10px' }}>
          Theme: <strong>{gameState.theme}</strong> - {getThemeDescription(gameState.theme as ThemeType)}
        </div>
        <div style={{ fontSize: '16px', marginTop: '5px' }}>
          Turn: {gameState.turn}
        </div>
      </div>

      {gameState.lastDuel && (
        <div style={{
          backgroundColor: '#e3f2fd',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <h3>Last Duel Result</h3>
          <p>
            {gameState.lastDuel.attacker} vs {gameState.lastDuel.defender} ({gameState.lastDuel.duelType})
          </p>
          <p>
            Scores: {gameState.lastDuel.attackerScore} - {gameState.lastDuel.defenderScore}
          </p>
          <p>
            Damage: {gameState.lastDuel.damageDealt} | Result: {gameState.lastDuel.result}
          </p>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        <div>
          <h2>White Pieces</h2>
          {gameState.whitePlayer.pieces.map(piece => (
            <PieceCard 
              key={piece.id} 
              piece={piece}
              onClick={() => setSelectedPiece(piece.id)}
            />
          ))}
        </div>

        <div>
          <h2>Black Pieces</h2>
          {gameState.blackPlayer.pieces.map(piece => (
            <PieceCard 
              key={piece.id} 
              piece={piece}
              onClick={() => setSelectedPiece(piece.id)}
            />
          ))}
        </div>
      </div>

      {selectedPiece && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 1000
        }}>
          <div>Selected: {selectedPiece}</div>
          <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
            <button onClick={() => startDuel(selectedPiece, 'b_pawn1', 'swipe')} style={buttonStyle}>
              Swipe Duel
            </button>
            <button onClick={() => startDuel(selectedPiece, 'b_pawn1', 'rhythm')} style={buttonStyle}>
              Rhythm Duel
            </button>
            <button onClick={() => startDuel(selectedPiece, 'b_pawn1', 'mirror')} style={buttonStyle}>
              Mirror Duel
            </button>
            <button onClick={() => setSelectedPiece(null)} style={{ ...buttonStyle, backgroundColor: '#f44336' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const buttonStyle: React.CSSProperties = {
  padding: '10px 20px',
  fontSize: '14px',
  cursor: 'pointer',
  backgroundColor: '#2196F3',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  fontWeight: 'bold'
};
