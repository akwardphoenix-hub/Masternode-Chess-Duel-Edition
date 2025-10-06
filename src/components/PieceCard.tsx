import React from 'react';
import { Piece } from '../types';

interface PieceCardProps {
  piece: Piece;
  onClick?: () => void;
}

export const PieceCard: React.FC<PieceCardProps> = ({ piece, onClick }) => {
  const hpPercentage = (piece.hp / piece.maxHP) * 100;

  return (
    <div 
      className="piece-card" 
      onClick={onClick}
      style={{
        border: '2px solid #333',
        borderRadius: '8px',
        padding: '12px',
        margin: '8px',
        cursor: onClick ? 'pointer' : 'default',
        backgroundColor: '#f5f5f5',
        minWidth: '200px'
      }}
    >
      <div style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px' }}>
        {piece.type.toUpperCase()} (Lv.{piece.level})
      </div>
      
      <div style={{ marginBottom: '4px' }}>
        HP: {piece.hp}/{piece.maxHP}
        <div style={{ 
          width: '100%', 
          height: '8px', 
          backgroundColor: '#ddd', 
          borderRadius: '4px',
          overflow: 'hidden',
          marginTop: '4px'
        }}>
          <div style={{ 
            width: `${hpPercentage}%`, 
            height: '100%', 
            backgroundColor: hpPercentage > 50 ? '#4caf50' : hpPercentage > 25 ? '#ff9800' : '#f44336',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>
      
      <div style={{ marginBottom: '4px' }}>XP: {piece.xp}</div>
      <div style={{ marginBottom: '4px' }}>Position: ({piece.position.row}, {piece.position.col})</div>
      
      {piece.equipment.weapon && (
        <div style={{ fontSize: '14px', color: '#666' }}>
          ⚔️ {piece.equipment.weapon.name} (+{piece.equipment.weapon.attack} ATK)
        </div>
      )}
      
      {piece.equipment.armor && (
        <div style={{ fontSize: '14px', color: '#666' }}>
          🛡️ {piece.equipment.armor.name} (+{piece.equipment.armor.defense} DEF)
        </div>
      )}
      
      {piece.equipment.accessory && (
        <div style={{ fontSize: '14px', color: '#666' }}>
          💍 {piece.equipment.accessory.name}
        </div>
      )}
    </div>
  );
};
