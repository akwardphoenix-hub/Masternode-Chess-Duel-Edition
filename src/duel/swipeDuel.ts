import { SwipeDirection } from '../types';

export class SwipeDuel {
  private sequence: ('up' | 'down' | 'left' | 'right')[];
  private playerInputs: SwipeDirection[];
  private maxScore: number;

  constructor(sequenceLength: number = 10, maxScore: number = 100) {
    this.maxScore = maxScore;
    this.sequence = this.generateSequence(sequenceLength);
    this.playerInputs = [];
  }

  private generateSequence(length: number): ('up' | 'down' | 'left' | 'right')[] {
    const directions: ('up' | 'down' | 'left' | 'right')[] = ['up', 'down', 'left', 'right'];
    const sequence: ('up' | 'down' | 'left' | 'right')[] = [];
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * directions.length);
      sequence.push(directions[randomIndex]);
    }
    
    return sequence;
  }

  public getSequence(): ('up' | 'down' | 'left' | 'right')[] {
    return [...this.sequence];
  }

  public addInput(direction: 'up' | 'down' | 'left' | 'right'): void {
    const index = this.playerInputs.length;
    if (index < this.sequence.length) {
      this.playerInputs.push({
        direction,
        expected: this.sequence[index]
      });
    }
  }

  public calculateScore(): number {
    let correctCount = 0;
    let wrongCount = 0;

    for (const input of this.playerInputs) {
      if (input.direction === input.expected) {
        correctCount++;
      } else {
        wrongCount++;
      }
    }

    const accuracy = correctCount / this.sequence.length;
    const penalty = wrongCount * 5; // 5 points penalty per wrong input
    const score = Math.max(0, Math.round(accuracy * this.maxScore) - penalty);

    return Math.min(score, this.maxScore);
  }

  public isComplete(): boolean {
    return this.playerInputs.length >= this.sequence.length;
  }

  public getProgress(): number {
    return this.playerInputs.length / this.sequence.length;
  }
}
