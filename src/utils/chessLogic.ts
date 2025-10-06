import type { PieceType, Position } from '../types/game';

export function isValidMove(
  pieceType: PieceType,
  from: Position,
  to: Position,
  board: (string | null)[][],
  color: 'white' | 'black'
): boolean {
  const [fromRow, fromCol] = from;
  const [toRow, toCol] = to;

  // Can't move to same position
  if (fromRow === toRow && fromCol === toCol) return false;

  // Can't capture own piece
  const targetPiece = board[toRow]?.[toCol];
  if (targetPiece) {
    const isTargetWhite = targetPiece === targetPiece.toUpperCase();
    const isMovingWhite = color === 'white';
    if (isTargetWhite === isMovingWhite) return false;
  }

  switch (pieceType) {
    case 'pawn':
      return isValidPawnMove(from, to, board, color);
    case 'knight':
      return isValidKnightMove(from, to);
    case 'bishop':
      return isValidBishopMove(from, to, board);
    case 'rook':
      return isValidRookMove(from, to, board);
    case 'queen':
      return isValidQueenMove(from, to, board);
    case 'king':
      return isValidKingMove(from, to);
    default:
      return false;
  }
}

function isValidPawnMove(
  from: Position,
  to: Position,
  board: (string | null)[][],
  color: 'white' | 'black'
): boolean {
  const [fromRow, fromCol] = from;
  const [toRow, toCol] = to;
  const direction = color === 'white' ? -1 : 1;

  // Move forward one square
  if (toCol === fromCol && toRow === fromRow + direction && !board[toRow][toCol]) {
    return true;
  }

  // Move forward two squares from starting position
  const startRow = color === 'white' ? 6 : 1;
  if (
    fromRow === startRow &&
    toCol === fromCol &&
    toRow === fromRow + 2 * direction &&
    !board[fromRow + direction][toCol] &&
    !board[toRow][toCol]
  ) {
    return true;
  }

  // Capture diagonally
  if (
    Math.abs(toCol - fromCol) === 1 &&
    toRow === fromRow + direction &&
    board[toRow][toCol]
  ) {
    return true;
  }

  return false;
}

function isValidKnightMove(from: Position, to: Position): boolean {
  const [fromRow, fromCol] = from;
  const [toRow, toCol] = to;
  const rowDiff = Math.abs(toRow - fromRow);
  const colDiff = Math.abs(toCol - fromCol);
  return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
}

function isValidBishopMove(
  from: Position,
  to: Position,
  board: (string | null)[][]
): boolean {
  const [fromRow, fromCol] = from;
  const [toRow, toCol] = to;
  const rowDiff = Math.abs(toRow - fromRow);
  const colDiff = Math.abs(toCol - fromCol);

  if (rowDiff !== colDiff) return false;

  return !isPathBlocked(from, to, board);
}

function isValidRookMove(
  from: Position,
  to: Position,
  board: (string | null)[][]
): boolean {
  const [fromRow, fromCol] = from;
  const [toRow, toCol] = to;

  if (fromRow !== toRow && fromCol !== toCol) return false;

  return !isPathBlocked(from, to, board);
}

function isValidQueenMove(
  from: Position,
  to: Position,
  board: (string | null)[][]
): boolean {
  return isValidBishopMove(from, to, board) || isValidRookMove(from, to, board);
}

function isValidKingMove(from: Position, to: Position): boolean {
  const [fromRow, fromCol] = from;
  const [toRow, toCol] = to;
  return Math.abs(toRow - fromRow) <= 1 && Math.abs(toCol - fromCol) <= 1;
}

function isPathBlocked(
  from: Position,
  to: Position,
  board: (string | null)[][]
): boolean {
  const [fromRow, fromCol] = from;
  const [toRow, toCol] = to;
  const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
  const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;

  let currentRow = fromRow + rowStep;
  let currentCol = fromCol + colStep;

  while (currentRow !== toRow || currentCol !== toCol) {
    if (board[currentRow][currentCol]) return true;
    currentRow += rowStep;
    currentCol += colStep;
  }

  return false;
}

export function getLegalMoves(
  pieceType: PieceType,
  position: Position,
  board: (string | null)[][],
  color: 'white' | 'black'
): Position[] {
  const moves: Position[] = [];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (isValidMove(pieceType, position, [row, col], board, color)) {
        moves.push([row, col]);
      }
    }
  }

  return moves;
}
