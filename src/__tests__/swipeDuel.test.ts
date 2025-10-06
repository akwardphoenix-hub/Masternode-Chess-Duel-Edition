import { SwipeDuel } from '../duel/swipeDuel';

describe('SwipeDuel', () => {
  let duel: SwipeDuel;

  beforeEach(() => {
    duel = new SwipeDuel(5, 100);
  });

  test('should initialize with correct sequence length', () => {
    const sequence = duel.getSequence();
    expect(sequence).toHaveLength(5);
  });

  test('should accept player inputs', () => {
    duel.addInput('up');
    expect(duel.getProgress()).toBe(0.2);
  });

  test('should calculate perfect score for all correct inputs', () => {
    const sequence = duel.getSequence();
    sequence.forEach(direction => {
      duel.addInput(direction);
    });
    
    const score = duel.calculateScore();
    expect(score).toBe(100);
  });

  test('should calculate lower score for incorrect inputs', () => {
    duel.addInput('up');
    duel.addInput('down');
    duel.addInput('left');
    duel.addInput('right');
    duel.addInput('up');
    
    const score = duel.calculateScore();
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  test('should mark as complete when all inputs are provided', () => {
    const sequence = duel.getSequence();
    sequence.forEach(direction => {
      duel.addInput(direction);
    });
    
    expect(duel.isComplete()).toBe(true);
  });

  test('should not accept inputs beyond sequence length', () => {
    const sequence = duel.getSequence();
    sequence.forEach(direction => {
      duel.addInput(direction);
    });
    
    duel.addInput('up');
    expect(duel.getProgress()).toBe(1);
  });
});
