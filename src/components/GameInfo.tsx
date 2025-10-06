import React from 'react';
import type { GameState, Theme } from '../types/game';

interface GameInfoProps {
  gameState: GameState;
  whiteTheme: Theme;
  blackTheme: Theme;
  onThemeChange: (player: 'white' | 'black', themeId: string) => void;
  availableThemes: Theme[];
}

export const GameInfo: React.FC<GameInfoProps> = ({
  gameState,
  whiteTheme,
  blackTheme,
  onThemeChange,
  availableThemes,
}) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border-2 border-green-500 space-y-4">
      <div>
        <h3 className="text-2xl font-bold text-green-400 mb-2">Game Info</h3>
        <div className="text-white space-y-1">
          <p>Turn: {gameState.turnNumber}</p>
          <p>
            Current Player:{' '}
            <span
              className={
                gameState.currentTurn === 'white' ? 'text-blue-400' : 'text-red-400'
              }
            >
              {gameState.currentTurn.toUpperCase()}
            </span>
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-bold text-blue-400 mb-2">White</h4>
          <div className="text-white space-y-2">
            <div>
              <label className="text-sm text-gray-400">Theme:</label>
              <select
                value={whiteTheme.id}
                onChange={(e) => onThemeChange('white', e.target.value)}
                className="ml-2 bg-gray-700 text-white px-2 py-1 rounded"
              >
                {availableThemes.map((theme) => (
                  <option key={theme.id} value={theme.id}>
                    {theme.name}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-sm">Gold: {gameState.gold.white}</p>
            <p className="text-sm">
              Pieces: {gameState.pieces.white.filter((p) => p.hp > 0).length}
            </p>
            <div className="text-xs text-gray-400">
              {whiteTheme.buffs.description}
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold text-red-400 mb-2">Black</h4>
          <div className="text-white space-y-2">
            <div>
              <label className="text-sm text-gray-400">Theme:</label>
              <select
                value={blackTheme.id}
                onChange={(e) => onThemeChange('black', e.target.value)}
                className="ml-2 bg-gray-700 text-white px-2 py-1 rounded"
              >
                {availableThemes.map((theme) => (
                  <option key={theme.id} value={theme.id}>
                    {theme.name}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-sm">Gold: {gameState.gold.black}</p>
            <p className="text-sm">
              Pieces: {gameState.pieces.black.filter((p) => p.hp > 0).length}
            </p>
            <div className="text-xs text-gray-400">
              {blackTheme.buffs.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
