import { getTheme, applyThemeBuff, getAllThemes, getThemeDescription } from '../utils/themeUtils';

describe('Theme Utils', () => {
  test('should get theme by type', () => {
    const theme = getTheme('pirate');
    expect(theme.name).toBe('Pirate Crew');
    expect(theme.buff.type).toBe('bounty');
  });

  test('should get all themes', () => {
    const themes = getAllThemes();
    expect(Object.keys(themes)).toContain('roman');
    expect(Object.keys(themes)).toContain('french');
    expect(Object.keys(themes)).toContain('cyberpunk');
  });

  test('should apply attack buff for roman theme', () => {
    const baseAttack = 100;
    const buffedAttack = applyThemeBuff(baseAttack, 'roman', 'attack');
    expect(buffedAttack).toBe(120); // 20% increase
  });

  test('should apply defense buff for french theme', () => {
    const baseDefense = 100;
    const buffedDefense = applyThemeBuff(baseDefense, 'french', 'defense');
    expect(buffedDefense).toBeCloseTo(115, 1); // 15% increase
  });

  test('should apply balanced buff for old english theme', () => {
    const baseValue = 100;
    const buffedValue = applyThemeBuff(baseValue, 'oldEnglish', 'attack');
    expect(buffedValue).toBeCloseTo(110, 1); // 10% increase to all stats
  });

  test('should not apply buff for non-matching stat type', () => {
    const baseValue = 100;
    const result = applyThemeBuff(baseValue, 'roman', 'defense');
    expect(result).toBe(100); // No change
  });

  test('should get theme description', () => {
    const description = getThemeDescription('cyberpunk');
    expect(description).toContain('15%');
    expect(description).toContain('critical');
  });
});
