import React from 'react';
import type { Piece as PieceType, Theme, Color } from '../types/game';

interface PieceProps {
  piece: PieceType;
  theme: Theme;
  color: Color;
}

const pieceSymbols: Record<string, string> = {
  pawn: '♟',
  knight: '♞',
  bishop: '♝',
  rook: '♜',
  queen: '♛',
  king: '♚',
};

export const Piece: React.FC<PieceProps> = ({ piece, theme, color }) => {
  const hpPercentage = (piece.hp / piece.maxHp) * 100;
  const unitName = theme.unitNames[piece.type];

  return (
    <div className="flex flex-col items-center justify-center w-full h-full relative">
      {/* Piece Symbol */}
      <div
        className="text-4xl font-bold"
        style={{ color: color === 'white' ? '#FFFFFF' : theme.palette.primary }}
        title={`${unitName} - Lvl ${piece.level}`}
      >
        {pieceSymbols[piece.type]}
      </div>

      {/* HP Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-800 overflow-hidden">
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${hpPercentage}%`,
            backgroundColor:
              hpPercentage > 60
                ? '#10B981'
                : hpPercentage > 30
                ? '#F59E0B'
                : '#EF4444',
          }}
        />
      </div>

      {/* Level indicator */}
      {piece.level > 1 && (
        <div
          className="absolute top-0 right-0 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold text-white"
          style={{ backgroundColor: theme.palette.accent }}
        >
          {piece.level}
        </div>
      )}
    </div>
  );
};
