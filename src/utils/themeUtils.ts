import { ThemeType, Theme, ThemeBuff } from '../types';
import gameRules from '../../game.rules.json';

export function getTheme(themeType: ThemeType): Theme {
  const theme = gameRules.gameRules.themes[themeType];
  if (!theme) {
    throw new Error(`Theme ${themeType} not found`);
  }
  return theme as Theme;
}

export function applyThemeBuff(
  baseValue: number,
  themeType: ThemeType,
  statType: string
): number {
  const theme = getTheme(themeType);
  
  // Check if the theme buff applies to this stat
  if (theme.buff.type === statType || theme.buff.type === 'balanced') {
    return baseValue * theme.buff.value;
  }
  
  return baseValue;
}

export function getAllThemes(): Record<ThemeType, Theme> {
  return gameRules.gameRules.themes as Record<ThemeType, Theme>;
}

export function getThemeDescription(themeType: ThemeType): string {
  const theme = getTheme(themeType);
  return theme.description;
}

export function getThemeBuff(themeType: ThemeType): ThemeBuff {
  const theme = getTheme(themeType);
  return theme.buff;
}
