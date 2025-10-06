import { MirrorDuel } from '../duel/mirrorDuel';

describe('MirrorDuel', () => {
  let duel: MirrorDuel;

  beforeEach(() => {
    duel = new MirrorDuel(8, 100);
  });

  test('should initialize with correct pattern length', () => {
    const pattern = duel.getPattern();
    expect(pattern).toHaveLength(8);
  });

  test('should accept player inputs', () => {
    duel.addInput(5);
    const input = duel.getPlayerInput();
    expect(input).toHaveLength(1);
    expect(input[0]).toBe(5);
  });

  test('should calculate perfect score for exact match', () => {
    const pattern = duel.getPattern();
    pattern.forEach(value => {
      duel.addInput(value);
    });
    
    const score = duel.calculateScore();
    expect(score).toBeGreaterThanOrEqual(100);
  });

  test('should calculate partial score for partial match', () => {
    const pattern = duel.getPattern();
    duel.addInput(pattern[0]);
    duel.addInput(pattern[1]);
    duel.addInput(9); // wrong
    duel.addInput(9); // wrong
    duel.addInput(9); // wrong
    duel.addInput(9); // wrong
    duel.addInput(9); // wrong
    duel.addInput(9); // wrong
    
    const score = duel.calculateScore();
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(100);
  });

  test('should mark as complete when all inputs are provided', () => {
    const pattern = duel.getPattern();
    pattern.forEach(value => {
      duel.addInput(value);
    });
    
    expect(duel.isComplete()).toBe(true);
  });

  test('should not accept inputs beyond pattern length', () => {
    const pattern = duel.getPattern();
    pattern.forEach(value => {
      duel.addInput(value);
    });
    
    duel.addInput(5);
    expect(duel.getPlayerInput()).toHaveLength(8);
  });

  test('should return pattern data', () => {
    duel.addInput(1);
    duel.addInput(2);
    
    const data = duel.getPatternData();
    expect(data.pattern).toHaveLength(8);
    expect(data.playerInput).toHaveLength(2);
  });
});
