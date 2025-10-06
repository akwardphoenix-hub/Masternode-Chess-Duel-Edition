import { RhythmDuel } from '../duel/rhythmDuel';

describe('RhythmDuel', () => {
  let duel: RhythmDuel;

  beforeEach(() => {
    duel = new RhythmDuel(10, 100);
  });

  test('should initialize with correct number of notes', () => {
    const notes = duel.getNotes();
    expect(notes).toHaveLength(10);
  });

  test('should register perfect hits', () => {
    const notes = duel.getNotes();
    duel.hitNote(notes[0]);
    
    const hits = duel.getPlayerHits();
    expect(hits).toHaveLength(1);
    expect(hits[0].accuracy).toBe('perfect');
  });

  test('should register good hits for slightly off timing', () => {
    const notes = duel.getNotes();
    duel.hitNote(notes[0] + 100);
    
    const hits = duel.getPlayerHits();
    expect(hits[0].accuracy).toBe('good');
  });

  test('should register miss for bad timing', () => {
    const notes = duel.getNotes();
    duel.hitNote(notes[0] + 200);
    
    const hits = duel.getPlayerHits();
    expect(hits[0].accuracy).toBe('miss');
  });

  test('should calculate score based on hit accuracy', () => {
    const notes = duel.getNotes();
    notes.forEach(note => {
      duel.hitNote(note);
    });
    
    const score = duel.calculateScore();
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  test('should mark as complete when all notes are hit', () => {
    const notes = duel.getNotes();
    notes.forEach(note => {
      duel.hitNote(note);
    });
    
    expect(duel.isComplete()).toBe(true);
  });
});
