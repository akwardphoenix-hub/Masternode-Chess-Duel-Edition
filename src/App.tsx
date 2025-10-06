import { useState } from 'react';
import type { GameState, Position, Theme, GovernanceModifier, Piece, DuelOutcome, LogEntry } from './types/game';
import { Board } from './components/Board';
import { DuelModal } from './components/DuelModal';
import { GameInfo } from './components/GameInfo';
import { GovernancePanel } from './components/GovernancePanel';
import { AuditLog } from './components/AuditLog';
import { getLegalMoves } from './utils/chessLogic';
import { getBounty, shouldLevelUp } from './utils/duelLogic';
import sampleMatch from '../data/sample-match.json';
import themesData from '../data/themes.json';
import governanceData from '../data/governance.json';
import gameRulesData from '../data/game.rules.json';

function App() {
  const [gameState, setGameState] = useState<GameState>(sampleMatch as unknown as GameState);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [legalMoves, setLegalMoves] = useState<Position[]>([]);
  const [duelState, setDuelState] = useState<{
    attacker: Piece;
    defender: Piece;
    attackerColor: 'white' | 'black';
    defenderColor: 'white' | 'black';
  } | null>(null);
  const [themes] = useState<Theme[]>(themesData.themes as unknown as Theme[]);
  const [whiteTheme, setWhiteTheme] = useState<Theme>(
    themesData.themes.find((t) => t.id === sampleMatch.themeWhite) as unknown as Theme
  );
  const [blackTheme, setBlackTheme] = useState<Theme>(
    themesData.themes.find((t) => t.id === sampleMatch.themeBlack) as unknown as Theme
  );
  const [governanceModifiers, setGovernanceModifiers] = useState<GovernanceModifier[]>(
    governanceData.modifiers as GovernanceModifier[]
  );

  const addLogEntry = (action: string, details: any) => {
    const entry: LogEntry = {
      turn: gameState.turnNumber,
      action,
      player: gameState.currentTurn,
      details,
      timestamp: Date.now(),
    };
    setGameState((prev) => ({
      ...prev,
      log: [...prev.log, entry],
    }));
  };

  const handleSquareClick = (position: Position) => {
    const [row, col] = position;
    const clickedPiece = gameState.board[row][col];

    if (selectedPosition === null) {
      // Selecting a piece
      if (!clickedPiece) return;

      const isWhite = clickedPiece === clickedPiece.toUpperCase();
      const currentPlayerIsWhite = gameState.currentTurn === 'white';

      if (isWhite !== currentPlayerIsWhite) return;

      const pieces = isWhite ? gameState.pieces.white : gameState.pieces.black;
      const piece = pieces.find(
        (p) => p.position[0] === row && p.position[1] === col && p.hp > 0
      );

      if (!piece) return;

      setSelectedPosition(position);
      const moves = getLegalMoves(piece.type, position, gameState.board, gameState.currentTurn);
      setLegalMoves(moves);
    } else {
      // Moving a piece
      const isLegalMove = legalMoves.some(([r, c]) => r === row && c === col);

      if (!isLegalMove) {
        // Deselect if clicking on invalid square
        setSelectedPosition(null);
        setLegalMoves([]);
        return;
      }

      const [fromRow, fromCol] = selectedPosition;
      const movingPiece = gameState.board[fromRow][fromCol];
      const targetPiece = gameState.board[row][col];

      if (targetPiece) {
        // Combat - trigger duel
        const isAttackerWhite = movingPiece === movingPiece!.toUpperCase();
        const isDefenderWhite = targetPiece === targetPiece.toUpperCase();

        const attackerPieces = isAttackerWhite ? gameState.pieces.white : gameState.pieces.black;
        const defenderPieces = isDefenderWhite ? gameState.pieces.white : gameState.pieces.black;

        const attacker = attackerPieces.find(
          (p) => p.position[0] === fromRow && p.position[1] === fromCol && p.hp > 0
        );
        const defender = defenderPieces.find(
          (p) => p.position[0] === row && p.position[1] === col && p.hp > 0
        );

        if (attacker && defender) {
          setDuelState({
            attacker,
            defender,
            attackerColor: isAttackerWhite ? 'white' : 'black',
            defenderColor: isDefenderWhite ? 'white' : 'black',
          });
          setSelectedPosition(null);
          setLegalMoves([]);
          return;
        }
      }

      // Non-combat move
      executeMove(selectedPosition, position);
      setSelectedPosition(null);
      setLegalMoves([]);
    }
  };

  const executeMove = (from: Position, to: Position) => {
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;

    const newBoard = gameState.board.map((row) => [...row]);
    const movingPiece = newBoard[fromRow][fromCol];
    newBoard[toRow][toCol] = movingPiece;
    newBoard[fromRow][fromCol] = null;

    const isWhite = movingPiece === movingPiece!.toUpperCase();
    const color = isWhite ? 'white' : 'black';

    // Update piece position
    const newPieces = { ...gameState.pieces };
    const pieceArray = color === 'white' ? newPieces.white : newPieces.black;
    const pieceIndex = pieceArray.findIndex(
      (p) => p.position[0] === fromRow && p.position[1] === fromCol
    );

    if (pieceIndex !== -1) {
      pieceArray[pieceIndex] = {
        ...pieceArray[pieceIndex],
        position: to,
      };
    }

    addLogEntry('move', {
      from: `${String.fromCharCode(97 + fromCol)}${8 - fromRow}`,
      to: `${String.fromCharCode(97 + toCol)}${8 - toRow}`,
    });

    setGameState((prev) => ({
      ...prev,
      board: newBoard,
      pieces: newPieces,
      currentTurn: prev.currentTurn === 'white' ? 'black' : 'white',
      turnNumber: prev.currentTurn === 'black' ? prev.turnNumber + 1 : prev.turnNumber,
    }));
  };

  const handleDuelComplete = (outcome: DuelOutcome) => {
    if (!duelState) return;

    const { attacker, defender, attackerColor, defenderColor } = duelState;

    // Apply damage
    const newAttackerHp = Math.max(0, attacker.hp - outcome.defender.damage);
    const newDefenderHp = Math.max(0, defender.hp - outcome.attacker.damage);

    // Apply XP
    const newAttackerXp = attacker.xp + outcome.attacker.xp;
    const newDefenderXp = defender.xp + outcome.defender.xp;

    // Check for level ups
    let newAttackerLevel = attacker.level;
    let newDefenderLevel = defender.level;

    if (shouldLevelUp(newAttackerXp, attacker.level)) {
      newAttackerLevel++;
      addLogEntry('level_up', {
        piece: attacker.type,
        level: newAttackerLevel,
      });
    }

    if (shouldLevelUp(newDefenderXp, defender.level)) {
      newDefenderLevel++;
      addLogEntry('level_up', {
        piece: defender.type,
        level: newDefenderLevel,
      });
    }

    // Update pieces
    const newPieces = { ...gameState.pieces };
    const attackerPieces = attackerColor === 'white' ? newPieces.white : newPieces.black;
    const defenderPieces = defenderColor === 'white' ? newPieces.white : newPieces.black;

    const attackerIndex = attackerPieces.findIndex(
      (p) => p.position[0] === attacker.position[0] && p.position[1] === attacker.position[1]
    );
    const defenderIndex = defenderPieces.findIndex(
      (p) => p.position[0] === defender.position[0] && p.position[1] === defender.position[1]
    );

    if (attackerIndex !== -1) {
      attackerPieces[attackerIndex] = {
        ...attackerPieces[attackerIndex],
        hp: newAttackerHp,
        xp: newAttackerXp,
        level: newAttackerLevel,
        maxHp: attacker.maxHp + (newAttackerLevel - attacker.level) * 10,
      };
    }

    if (defenderIndex !== -1) {
      defenderPieces[defenderIndex] = {
        ...defenderPieces[defenderIndex],
        hp: newDefenderHp,
        xp: newDefenderXp,
        level: newDefenderLevel,
        maxHp: defender.maxHp + (newDefenderLevel - defender.level) * 10,
      };
    }

    const newBoard = gameState.board.map((row) => [...row]);

    // Handle kills and bounty
    let newGold = { ...gameState.gold };

    if (newDefenderHp === 0) {
      // Defender dies
      newBoard[defender.position[0]][defender.position[1]] = null;
      newBoard[attacker.position[0]][attacker.position[1]] = null;
      newBoard[defender.position[0]][defender.position[1]] =
        gameState.board[attacker.position[0]][attacker.position[1]];

      // Update attacker position
      if (attackerIndex !== -1) {
        attackerPieces[attackerIndex] = {
          ...attackerPieces[attackerIndex],
          position: defender.position,
          xp: newAttackerXp + gameRulesData.progression.xpPerKill,
        };
      }

      // Award bounty
      const bounty = getBounty(defender.type);
      if (attackerColor === 'white') {
        newGold.white += bounty;
      } else {
        newGold.black += bounty;
      }

      addLogEntry('kill', {
        attacker: attacker.type,
        defender: defender.type,
        bounty,
      });
    } else if (newAttackerHp === 0) {
      // Attacker dies
      newBoard[attacker.position[0]][attacker.position[1]] = null;

      const bounty = getBounty(attacker.type);
      if (defenderColor === 'white') {
        newGold.white += bounty;
      } else {
        newGold.black += bounty;
      }

      addLogEntry('kill', {
        attacker: defender.type,
        defender: attacker.type,
        bounty,
      });
    }

    addLogEntry('duel', {
      attacker: {
        type: attacker.type,
        damage: outcome.attacker.damage,
        result: outcome.attacker.result,
      },
      defender: {
        type: defender.type,
        damage: outcome.defender.damage,
        result: outcome.defender.result,
      },
    });

    setGameState((prev) => ({
      ...prev,
      board: newBoard,
      pieces: newPieces,
      gold: newGold,
      currentTurn: prev.currentTurn === 'white' ? 'black' : 'white',
      turnNumber: prev.currentTurn === 'black' ? prev.turnNumber + 1 : prev.turnNumber,
    }));

    setDuelState(null);
  };

  const handleGovernanceToggle = (modifierId: string) => {
    setGovernanceModifiers((prev) =>
      prev.map((m) => (m.id === modifierId ? { ...m, enabled: !m.enabled } : m))
    );
  };

  const handleThemeChange = (player: 'white' | 'black', themeId: string) => {
    const theme = themes.find((t) => t.id === themeId);
    if (!theme) return;

    if (player === 'white') {
      setWhiteTheme(theme);
      setGameState((prev) => ({ ...prev, themeWhite: themeId }));
    } else {
      setBlackTheme(theme);
      setGameState((prev) => ({ ...prev, themeBlack: themeId }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-yellow-400 mb-2">
            ⚔️ Masternode Chess: Duel Edition
          </h1>
          <p className="text-gray-300 text-lg">
            Experience Chess Like Never Before
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel */}
          <div className="space-y-6">
            <GameInfo
              gameState={gameState}
              whiteTheme={whiteTheme}
              blackTheme={blackTheme}
              onThemeChange={handleThemeChange}
              availableThemes={themes}
            />
            <GovernancePanel
              modifiers={governanceModifiers}
              onToggle={handleGovernanceToggle}
            />
          </div>

          {/* Center - Board */}
          <div className="flex items-center justify-center">
            <Board
              gameState={gameState}
              selectedPosition={selectedPosition}
              legalMoves={legalMoves}
              whiteTheme={whiteTheme}
              blackTheme={blackTheme}
              onSquareClick={handleSquareClick}
            />
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            <AuditLog log={gameState.log} />
          </div>
        </div>

        {/* Duel Modal */}
        {duelState && (
          <DuelModal
            attacker={duelState.attacker}
            defender={duelState.defender}
            attackerTheme={duelState.attackerColor === 'white' ? whiteTheme : blackTheme}
            defenderTheme={duelState.defenderColor === 'white' ? whiteTheme : blackTheme}
            attackerColor={duelState.attackerColor}
            defenderColor={duelState.defenderColor}
            onComplete={handleDuelComplete}
            onCancel={() => setDuelState(null)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
