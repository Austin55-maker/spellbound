export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export interface SpellingWord {
  word: string;
  hint: string;
}

export interface CustomWord extends SpellingWord {
  id: string;
  difficulty: Difficulty;
}

export enum GameState {
  MENU = 'MENU',
  LOADING = 'LOADING',
  PLAYING = 'PLAYING',
  VICTORY = 'VICTORY',
  ADMIN = 'ADMIN',
  SETTINGS = 'SETTINGS',
  PROFILE = 'PROFILE'
}

export interface LetterStatus {
  char: string;
  status: 'empty' | 'correct' | 'current';
}

export type ThemeMode = 'light' | 'dark';
export type FontFamily = 'sans' | 'serif' | 'mono' | 'comic';

export interface AppSettings {
  theme: ThemeMode;
  font: FontFamily;
  timerEnabled: boolean;
}

export interface PlayerProfile {
  name: string;
  score: number;
  level: number;
  rewards: string[]; // Array of reward emojis or names
}
