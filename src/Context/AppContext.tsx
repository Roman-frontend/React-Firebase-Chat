import { createContext } from "react";
import { IAppContext } from "./Models/IAppContext";
import { ICustomThemeContext } from "./Models/ICustomThemeContext";

const noop = () => {};

export const AppContext = createContext<IAppContext>({
  activeChannelId: null,
  setActiveChannelId: noop,
  activeDirectMessageId: null,
  setActiveDirectMessageId: noop,
  newMsgsBadge: [],
  setNewMsgsBadge: noop,
  modalAddPeopleIsOpen: false,
  setModalAddPeopleIsOpen: noop,
});

export const CustomThemeContext = createContext<ICustomThemeContext>({
  currentTheme: "light",
  setTheme: null,
});
