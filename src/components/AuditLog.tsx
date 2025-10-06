import React from 'react';
import type { LogEntry } from '../types/game';

interface AuditLogProps {
  log: LogEntry[];
}

export const AuditLog: React.FC<AuditLogProps> = ({ log }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 border-2 border-blue-500">
      <h3 className="text-xl font-bold text-blue-400 mb-4">📜 Audit Log</h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {log.length === 0 ? (
          <p className="text-gray-400 text-sm">No actions yet...</p>
        ) : (
          log.slice().reverse().map((entry, index) => (
            <div
              key={`${entry.turn}-${index}`}
              className="p-2 bg-gray-900 rounded text-sm"
            >
              <div className="flex justify-between items-start">
                <span className="text-gray-400">Turn {entry.turn}</span>
                <span className="text-xs text-gray-500">
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="text-white mt-1">
                <span className={entry.player === 'white' ? 'text-blue-400' : 'text-red-400'}>
                  {entry.player.toUpperCase()}
                </span>
                {' - '}
                {entry.action}
              </div>
              {entry.details && (
                <div className="text-gray-400 text-xs mt-1">
                  {JSON.stringify(entry.details)}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
