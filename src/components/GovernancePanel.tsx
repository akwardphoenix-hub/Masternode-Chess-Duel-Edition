import React from 'react';
import type { GovernanceModifier } from '../types/game';

interface GovernancePanelProps {
  modifiers: GovernanceModifier[];
  onToggle: (modifierId: string) => void;
}

export const GovernancePanel: React.FC<GovernancePanelProps> = ({ modifiers, onToggle }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 border-2 border-purple-500">
      <h3 className="text-xl font-bold text-purple-400 mb-4">⚖️ Governance Modifiers</h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {modifiers.map((modifier) => (
          <div
            key={modifier.id}
            className="flex items-start space-x-3 p-3 bg-gray-900 rounded hover:bg-gray-850 transition-colors"
          >
            <input
              type="checkbox"
              checked={modifier.enabled}
              onChange={() => onToggle(modifier.id)}
              className="mt-1 w-5 h-5 cursor-pointer"
              id={`modifier-${modifier.id}`}
            />
            <label
              htmlFor={`modifier-${modifier.id}`}
              className="flex-1 cursor-pointer"
            >
              <div className="font-bold text-white">{modifier.name}</div>
              <div className="text-sm text-gray-400">{modifier.description}</div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
