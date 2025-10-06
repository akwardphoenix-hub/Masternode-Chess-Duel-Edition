import { RhythmNote } from '../types';

export class RhythmDuel {
  private notes: number[];
  private playerHits: RhythmNote[];
  private maxScore: number;
  private perfectWindow: number;
  private goodWindow: number;

  constructor(noteCount: number = 15, maxScore: number = 100) {
    this.maxScore = maxScore;
    this.perfectWindow = 50; // milliseconds
    this.goodWindow = 150; // milliseconds
    this.notes = this.generateNotes(noteCount);
    this.playerHits = [];
  }

  private generateNotes(count: number): number[] {
    const notes: number[] = [];
    let currentTime = 1000; // Start at 1 second

    for (let i = 0; i < count; i++) {
      notes.push(currentTime);
      currentTime += 300 + Math.random() * 400; // 300-700ms between notes
    }

    return notes;
  }

  public getNotes(): number[] {
    return [...this.notes];
  }

  public hitNote(timestamp: number): void {
    // Find the closest note that hasn't been hit yet
    let closestNoteIndex = -1;
    let minDiff = Infinity;

    for (let i = 0; i < this.notes.length; i++) {
      const alreadyHit = this.playerHits.some(hit => 
        Math.abs(hit.timestamp - this.notes[i]) < this.goodWindow
      );
      
      if (!alreadyHit) {
        const diff = Math.abs(timestamp - this.notes[i]);
        if (diff < minDiff) {
          minDiff = diff;
          closestNoteIndex = i;
        }
      }
    }

    if (closestNoteIndex === -1) {
      return; // No notes left to hit
    }

    const noteTimestamp = this.notes[closestNoteIndex];
    const diff = Math.abs(timestamp - noteTimestamp);

    let accuracy: 'perfect' | 'good' | 'miss';
    if (diff <= this.perfectWindow) {
      accuracy = 'perfect';
    } else if (diff <= this.goodWindow) {
      accuracy = 'good';
    } else {
      accuracy = 'miss';
    }

    this.playerHits.push({
      timestamp: noteTimestamp,
      hit: accuracy !== 'miss',
      accuracy
    });
  }

  public calculateScore(): number {
    let score = 0;
    const perfectValue = this.maxScore / this.notes.length;
    const goodValue = perfectValue * 0.7;

    for (const hit of this.playerHits) {
      if (hit.accuracy === 'perfect') {
        score += perfectValue;
      } else if (hit.accuracy === 'good') {
        score += goodValue;
      }
    }

    return Math.min(Math.round(score), this.maxScore);
  }

  public isComplete(): boolean {
    return this.playerHits.length >= this.notes.length;
  }

  public getProgress(): number {
    return this.playerHits.length / this.notes.length;
  }

  public getPlayerHits(): RhythmNote[] {
    return [...this.playerHits];
  }
}
