import React, { useState, useEffect } from 'react';
import type { Piece, Theme, Color, DuelOutcome } from '../types/game';
import { RhythmTaps } from './duels/RhythmTaps';
import { ShapeTracing } from './duels/ShapeTracing';
import { getDuelOutcome } from '../utils/duelLogic';

interface DuelModalProps {
  attacker: Piece;
  defender: Piece;
  attackerTheme: Theme;
  defenderTheme: Theme;
  attackerColor: Color;
  defenderColor: Color;
  onComplete: (outcome: DuelOutcome) => void;
  onCancel: () => void;
}

export const DuelModal: React.FC<DuelModalProps> = ({
  attacker,
  defender,
  attackerTheme,
  defenderTheme,
  attackerColor,
  defenderColor,
  onComplete,
  onCancel,
}) => {
  const [phase, setPhase] = useState<'attacker' | 'defender' | 'result'>('attacker');
  const [attackerScore, setAttackerScore] = useState(0);
  const [defenderScore, setDefenderScore] = useState(0);
  const [duelMode] = useState<'rhythm_taps' | 'shape_tracing'>(
    Math.random() > 0.5 ? 'rhythm_taps' : 'shape_tracing'
  );

  const handleAttackerComplete = (score: number) => {
    setAttackerScore(score);
    setPhase('defender');
  };

  const handleDefenderComplete = (score: number) => {
    setDefenderScore(score);
    setPhase('result');
  };

  useEffect(() => {
    if (phase === 'result') {
      const outcome = getDuelOutcome(
        attacker.type,
        defender.type,
        attackerScore,
        defenderScore
      );
      
      // Show result for a moment before completing
      const timer = setTimeout(() => {
        onComplete(outcome);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [phase, attacker.type, defender.type, attackerScore, defenderScore, onComplete]);

  const renderDuelGame = (_isAttacker: boolean, onComplete: (score: number) => void) => {
    if (duelMode === 'rhythm_taps') {
      return <RhythmTaps onComplete={onComplete} />;
    } else {
      return <ShapeTracing onComplete={onComplete} />;
    }
  };

  const outcome = phase === 'result'
    ? getDuelOutcome(attacker.type, defender.type, attackerScore, defenderScore)
    : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-8 max-w-2xl w-full border-4 border-yellow-500 shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-yellow-400 mb-2">DUEL!</h2>
          <p className="text-white text-lg">
            {attackerTheme.unitNames[attacker.type]} vs {defenderTheme.unitNames[defender.type]}
          </p>
        </div>

        {/* Combatants Info */}
        <div className="flex justify-between mb-6">
          <div className="text-center flex-1">
            <div
              className="text-6xl mb-2"
              style={{ color: attackerColor === 'white' ? '#FFFFFF' : attackerTheme.palette.primary }}
            >
              {getPieceSymbol(attacker.type)}
            </div>
            <div className="text-white font-bold">{attackerTheme.unitNames[attacker.type]}</div>
            <div className="text-gray-400 text-sm">
              HP: {attacker.hp}/{attacker.maxHp}
            </div>
            {phase === 'result' && (
              <div className="mt-2 text-yellow-400 font-bold">
                Score: {attackerScore}
              </div>
            )}
          </div>

          <div className="text-6xl text-red-500 flex items-center px-4">⚔️</div>

          <div className="text-center flex-1">
            <div
              className="text-6xl mb-2"
              style={{ color: defenderColor === 'white' ? '#FFFFFF' : defenderTheme.palette.primary }}
            >
              {getPieceSymbol(defender.type)}
            </div>
            <div className="text-white font-bold">{defenderTheme.unitNames[defender.type]}</div>
            <div className="text-gray-400 text-sm">
              HP: {defender.hp}/{defender.maxHp}
            </div>
            {phase === 'result' && (
              <div className="mt-2 text-yellow-400 font-bold">
                Score: {defenderScore}
              </div>
            )}
          </div>
        </div>

        {/* Duel Game Area */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 min-h-64">
          {phase === 'attacker' && (
            <div>
              <h3 className="text-xl text-yellow-400 mb-4 text-center">
                Attacker's Turn!
              </h3>
              {renderDuelGame(true, handleAttackerComplete)}
            </div>
          )}

          {phase === 'defender' && (
            <div>
              <h3 className="text-xl text-yellow-400 mb-4 text-center">
                Defender's Turn!
              </h3>
              {renderDuelGame(false, handleDefenderComplete)}
            </div>
          )}

          {phase === 'result' && outcome && (
            <div className="text-center text-white">
              <h3 className="text-2xl text-yellow-400 mb-4">Results!</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-bold">{attackerTheme.unitNames[attacker.type]}</p>
                  <p className="text-green-400">Deals {outcome.attacker.damage} damage ({outcome.attacker.result})</p>
                  <p className="text-blue-400">Gains {outcome.attacker.xp} XP</p>
                </div>
                <div className="text-red-500 text-2xl">⚡</div>
                <div>
                  <p className="font-bold">{defenderTheme.unitNames[defender.type]}</p>
                  <p className="text-green-400">Deals {outcome.defender.damage} damage ({outcome.defender.result})</p>
                  <p className="text-blue-400">Gains {outcome.defender.xp} XP</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {phase !== 'result' && (
          <div className="flex justify-center">
            <button
              onClick={onCancel}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

function getPieceSymbol(type: string): string {
  const symbols: Record<string, string> = {
    pawn: '♟',
    knight: '♞',
    bishop: '♝',
    rook: '♜',
    queen: '♛',
    king: '♚',
  };
  return symbols[type] || '?';
}
