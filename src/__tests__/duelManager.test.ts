import { DuelManager } from '../duel/duelManager';
import { Piece } from '../types';

describe('DuelManager', () => {
  let manager: DuelManager;
  let attacker: Piece;
  let defender: Piece;

  beforeEach(() => {
    manager = new DuelManager('pirate');

    attacker = {
      id: 'test_knight',
      type: 'knight',
      position: { row: 0, col: 0 },
      hp: 60,
      maxHP: 60,
      xp: 0,
      level: 1,
      bounty: 30,
      equipment: {
        weapon: { id: 'sword', name: 'Sword', attack: 5 },
        armor: null,
        accessory: null
      }
    };

    defender = {
      id: 'test_pawn',
      type: 'pawn',
      position: { row: 1, col: 1 },
      hp: 30,
      maxHP: 30,
      xp: 0,
      level: 1,
      bounty: 10,
      equipment: {
        weapon: null,
        armor: null,
        accessory: null
      }
    };
  });

  test('should create swipe duel', () => {
    const duel = manager.createDuel('swipe');
    expect(duel).toBeDefined();
  });

  test('should create rhythm duel', () => {
    const duel = manager.createDuel('rhythm');
    expect(duel).toBeDefined();
  });

  test('should create mirror duel', () => {
    const duel = manager.createDuel('mirror');
    expect(duel).toBeDefined();
  });

  test('should resolve duel with attacker winning', () => {
    const result = manager.resolveDuel(attacker, defender, 'swipe', 80, 50);
    
    expect(result.attacker).toBe('test_knight');
    expect(result.defender).toBe('test_pawn');
    expect(result.result).toBe('attacker_wins');
    expect(result.damageDealt).toBeGreaterThan(0);
    expect(result.xpGained.attacker).toBeGreaterThan(0);
  });

  test('should resolve duel with defender winning', () => {
    const result = manager.resolveDuel(attacker, defender, 'rhythm', 40, 80);
    
    expect(result.result).toBe('defender_wins');
  });

  test('should resolve duel with draw', () => {
    const result = manager.resolveDuel(attacker, defender, 'mirror', 75, 75);
    
    expect(result.result).toBe('draw');
  });

  test('should apply duel result correctly', () => {
    const result = manager.resolveDuel(attacker, defender, 'swipe', 90, 50);
    const initialDefenderHP = defender.hp;
    const initialAttackerXP = attacker.xp;

    manager.applyDuelResult(attacker, defender, result);

    expect(defender.hp).toBeLessThan(initialDefenderHP);
    expect(attacker.xp).toBeGreaterThan(initialAttackerXP);
  });

  test('should level up piece when XP threshold is reached', () => {
    attacker.xp = 95;
    const result = manager.resolveDuel(attacker, defender, 'swipe', 90, 50);
    
    manager.applyDuelResult(attacker, defender, result);

    expect(attacker.level).toBeGreaterThan(1);
  });

  test('should not reduce HP below 0', () => {
    defender.hp = 5;
    const result = manager.resolveDuel(attacker, defender, 'swipe', 100, 20);
    
    manager.applyDuelResult(attacker, defender, result);

    expect(defender.hp).toBeGreaterThanOrEqual(0);
  });
});
