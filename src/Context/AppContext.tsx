import { createContext } from "react";
import { IAppContext } from "./Models/IAppContext";
import { ICustomThemeContext } from "./Models/ICustomThemeContext";

const noop = () => {};

export const AppContext = createContext<IAppContext>({});

export const CustomThemeContext = createContext<ICustomThemeContext>({
  currentTheme: "light",
  setTheme: null,
});
