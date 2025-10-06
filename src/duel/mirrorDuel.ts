import { MirrorPattern } from '../types';

export class MirrorDuel {
  private pattern: number[];
  private playerInput: number[];
  private maxScore: number;

  constructor(patternLength: number = 8, maxScore: number = 100) {
    this.maxScore = maxScore;
    this.pattern = this.generatePattern(patternLength);
    this.playerInput = [];
  }

  private generatePattern(length: number): number[] {
    const pattern: number[] = [];
    const maxValue = 9; // 0-9 for a 10-button interface

    for (let i = 0; i < length; i++) {
      pattern.push(Math.floor(Math.random() * (maxValue + 1)));
    }

    return pattern;
  }

  public getPattern(): number[] {
    return [...this.pattern];
  }

  public addInput(value: number): void {
    if (this.playerInput.length < this.pattern.length) {
      this.playerInput.push(value);
    }
  }

  public getPlayerInput(): number[] {
    return [...this.playerInput];
  }

  public calculateScore(): number {
    let correctCount = 0;
    let correctInSequence = 0;
    let maxSequence = 0;

    // Count correct matches
    for (let i = 0; i < this.playerInput.length && i < this.pattern.length; i++) {
      if (this.playerInput[i] === this.pattern[i]) {
        correctCount++;
        correctInSequence++;
        maxSequence = Math.max(maxSequence, correctInSequence);
      } else {
        correctInSequence = 0;
      }
    }

    // Calculate score based on accuracy and sequence bonus
    const accuracy = correctCount / this.pattern.length;
    const sequenceBonus = (maxSequence / this.pattern.length) * 0.2; // 20% bonus for longest sequence
    
    const score = (accuracy + sequenceBonus) * this.maxScore;
    return Math.min(Math.round(score), this.maxScore);
  }

  public isComplete(): boolean {
    return this.playerInput.length >= this.pattern.length;
  }

  public getProgress(): number {
    return this.playerInput.length / this.pattern.length;
  }

  public getPatternData(): MirrorPattern {
    return {
      pattern: [...this.pattern],
      playerInput: [...this.playerInput]
    };
  }
}
