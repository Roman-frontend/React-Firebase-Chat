import { createContext } from "react";
import { ICustomThemeContext } from "./Models/ICustomThemeContext";

export const CustomThemeContext = createContext<ICustomThemeContext>({
  currentTheme: "light",
  setTheme: null,
});
