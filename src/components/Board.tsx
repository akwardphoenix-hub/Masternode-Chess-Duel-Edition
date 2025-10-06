import React from 'react';
import type { Position, GameState, Theme } from '../types/game';
import { Piece as PieceComponent } from './Piece';

interface BoardProps {
  gameState: GameState;
  selectedPosition: Position | null;
  legalMoves: Position[];
  whiteTheme: Theme;
  blackTheme: Theme;
  onSquareClick: (position: Position) => void;
}

export const Board: React.FC<BoardProps> = ({
  gameState,
  selectedPosition,
  legalMoves,
  whiteTheme,
  blackTheme,
  onSquareClick,
}) => {
  const isSquareSelected = (row: number, col: number) => {
    return selectedPosition?.[0] === row && selectedPosition?.[1] === col;
  };

  const isLegalMove = (row: number, col: number) => {
    return legalMoves.some(([r, c]) => r === row && c === col);
  };

  const getPieceAtPosition = (row: number, col: number) => {
    const boardPiece = gameState.board[row][col];
    if (!boardPiece) return null;

    const isWhite = boardPiece === boardPiece.toUpperCase();
    const pieces = isWhite ? gameState.pieces.white : gameState.pieces.black;
    return pieces.find(
      (p) => p.position[0] === row && p.position[1] === col
    );
  };

  return (
    <div className="inline-block border-4 border-gray-800 shadow-2xl">
      <div className="grid grid-cols-8 gap-0">
        {gameState.board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isLight = (rowIndex + colIndex) % 2 === 0;
            const isSelected = isSquareSelected(rowIndex, colIndex);
            const isLegal = isLegalMove(rowIndex, colIndex);
            const piece = getPieceAtPosition(rowIndex, colIndex);
            const isWhitePiece = cell === cell?.toUpperCase();

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  w-16 h-16 flex items-center justify-center relative cursor-pointer
                  transition-all duration-200
                  ${isLight ? 'bg-amber-100' : 'bg-amber-700'}
                  ${isSelected ? 'ring-4 ring-blue-500 ring-inset' : ''}
                  ${isLegal ? 'ring-4 ring-green-400 ring-inset' : ''}
                  hover:brightness-110
                `}
                onClick={() => onSquareClick([rowIndex, colIndex])}
                role="button"
                tabIndex={0}
                aria-label={`Square ${String.fromCharCode(97 + colIndex)}${8 - rowIndex}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onSquareClick([rowIndex, colIndex]);
                  }
                }}
              >
                {isLegal && !cell && (
                  <div className="w-4 h-4 bg-green-500 rounded-full opacity-50" />
                )}
                {piece && (
                  <PieceComponent
                    piece={piece}
                    theme={isWhitePiece ? whiteTheme : blackTheme}
                    color={isWhitePiece ? 'white' : 'black'}
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
