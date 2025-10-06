import { Piece, DuelType, DuelResult, ThemeType } from '../types';
import { SwipeDuel } from './swipeDuel';
import { RhythmDuel } from './rhythmDuel';
import { MirrorDuel } from './mirrorDuel';
import { applyThemeBuff } from '../utils/themeUtils';

export class DuelManager {
  private theme: ThemeType;

  constructor(theme: ThemeType) {
    this.theme = theme;
  }

  public createDuel(type: DuelType): SwipeDuel | RhythmDuel | MirrorDuel {
    switch (type) {
      case 'swipe':
        return new SwipeDuel();
      case 'rhythm':
        return new RhythmDuel();
      case 'mirror':
        return new MirrorDuel();
      default:
        throw new Error(`Unknown duel type: ${type}`);
    }
  }

  public resolveDuel(
    attacker: Piece,
    defender: Piece,
    duelType: DuelType,
    attackerScore: number,
    defenderScore: number
  ): DuelResult {
    // Calculate effective attack and defense with equipment bonuses
    const attackerAttack = this.calculateAttack(attacker);
    const defenderDefense = this.calculateDefense(defender);

    // Apply theme buffs
    const buffedAttack = applyThemeBuff(attackerAttack, this.theme, 'attack');

    // Calculate damage based on score difference
    const scoreDiff = attackerScore - defenderScore;
    const baseDamage = Math.max(0, buffedAttack - defenderDefense);
    
    // Score multiplier: higher score difference means more damage
    const scoreMultiplier = 1 + (scoreDiff / 100);
    const damageDealt = Math.round(baseDamage * scoreMultiplier);

    // Determine result
    let result: 'attacker_wins' | 'defender_wins' | 'draw';
    if (attackerScore > defenderScore) {
      result = 'attacker_wins';
    } else if (defenderScore > attackerScore) {
      result = 'defender_wins';
    } else {
      result = 'draw';
    }

    // Calculate XP gained
    const xpGained = this.calculateXP(attacker, defender, result);

    return {
      attacker: attacker.id,
      defender: defender.id,
      duelType,
      attackerScore,
      defenderScore,
      damageDealt,
      result,
      xpGained
    };
  }

  private calculateAttack(piece: Piece): number {
    const baseAttack = this.getBaseAttack(piece.type);
    const weaponBonus = piece.equipment.weapon?.attack || 0;
    const levelBonus = (piece.level - 1) * 2;
    return baseAttack + weaponBonus + levelBonus;
  }

  private calculateDefense(piece: Piece): number {
    const armorBonus = piece.equipment.armor?.defense || 0;
    const levelBonus = (piece.level - 1) * 1.5;
    return armorBonus + levelBonus;
  }

  private getBaseAttack(type: string): number {
    const attackMap: { [key: string]: number } = {
      pawn: 5,
      knight: 15,
      bishop: 12,
      rook: 18,
      queen: 25,
      king: 20
    };
    return attackMap[type] || 5;
  }

  private calculateXP(
    attacker: Piece,
    defender: Piece,
    result: 'attacker_wins' | 'defender_wins' | 'draw'
  ): { attacker: number; defender: number } {
    const baseXP = 10;
    const levelDiff = defender.level - attacker.level;

    let attackerXP = baseXP;
    let defenderXP = baseXP * 0.5; // Defender gets less XP

    if (result === 'attacker_wins') {
      attackerXP += baseXP + (levelDiff > 0 ? levelDiff * 5 : 0);
    } else if (result === 'defender_wins') {
      defenderXP += baseXP;
      attackerXP = baseXP * 0.3; // Attacker gets minimal XP for losing
    }

    // Apply theme XP buff if applicable
    attackerXP = applyThemeBuff(attackerXP, this.theme, 'xp');
    defenderXP = applyThemeBuff(defenderXP, this.theme, 'xp');

    return {
      attacker: Math.round(attackerXP),
      defender: Math.round(defenderXP)
    };
  }

  public applyDuelResult(attacker: Piece, defender: Piece, result: DuelResult): void {
    // Apply damage to defender
    defender.hp = Math.max(0, defender.hp - result.damageDealt);

    // Award XP
    attacker.xp += result.xpGained.attacker;
    defender.xp += result.xpGained.defender;

    // Check for level up
    this.checkLevelUp(attacker);
    this.checkLevelUp(defender);
  }

  private checkLevelUp(piece: Piece): void {
    const xpThresholds = [0, 100, 250, 500, 1000, 1500, 2500, 4000, 6000, 10000];
    
    while (piece.level < xpThresholds.length && piece.xp >= xpThresholds[piece.level]) {
      piece.level++;
      // Increase max HP on level up
      piece.maxHP += 10;
      piece.hp = Math.min(piece.hp + 10, piece.maxHP);
    }
  }
}
