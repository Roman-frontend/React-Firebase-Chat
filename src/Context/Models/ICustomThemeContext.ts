type SetThemeType = (name: string) => void;

export interface ICustomThemeContext {
  currentTheme: string;
  setTheme: SetThemeType | null;
}
