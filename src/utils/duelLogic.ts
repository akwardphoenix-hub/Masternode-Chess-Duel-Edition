import type { DuelResult, DuelOutcome, PieceType } from '../types/game';
import gameRules from '../../data/game.rules.json';

export function calculateDamage(
  pieceType: PieceType,
  result: DuelResult
): number {
  const baseDamage = gameRules.damageModel.baseDamage[pieceType];
  const multiplier = gameRules.damageModel.multipliers[result];
  return Math.floor(baseDamage * multiplier);
}

export function calculateXP(result: DuelResult): number {
  switch (result) {
    case 'perfect':
      return gameRules.progression.xpPerPerfect;
    case 'good':
    case 'hit':
      return gameRules.progression.xpPerHit;
    case 'miss':
      return 0;
    default:
      return 0;
  }
}

export function getDuelOutcome(
  attackerType: PieceType,
  defenderType: PieceType,
  attackerScore: number,
  defenderScore: number
): DuelOutcome {
  const attackerResult = scoreToResult(attackerScore);
  const defenderResult = scoreToResult(defenderScore);

  return {
    attacker: {
      damage: calculateDamage(attackerType, attackerResult),
      xp: calculateXP(attackerResult),
      result: attackerResult,
    },
    defender: {
      damage: calculateDamage(defenderType, defenderResult),
      xp: calculateXP(defenderResult),
      result: defenderResult,
    },
  };
}

function scoreToResult(score: number): DuelResult {
  if (score >= 90) return 'perfect';
  if (score >= 70) return 'good';
  if (score >= 50) return 'hit';
  return 'miss';
}

export function shouldLevelUp(currentXP: number, currentLevel: number): boolean {
  const thresholds = gameRules.progression.levelThresholds;
  return currentLevel < thresholds.length && currentXP >= thresholds[currentLevel];
}

export function getBounty(pieceType: PieceType): number {
  return gameRules.bounty[pieceType];
}
