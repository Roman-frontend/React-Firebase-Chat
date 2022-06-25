import React, { createContext } from "react";
import { IChatContext } from "./Models/IChatContext";

const noop = () => {};

export const ChatContext = createContext<IChatContext>({
  authId: null,
  allDm: [],
  setAllDm: noop,
  allChannels: [],
  setAllChannels: noop,
  allUsers: [],
  setAllUsers: noop,
  activeChannelId: null,
  setActiveChannelId: noop,
  activeDirectMessageId: null,
  setActiveDirectMessageId: noop,
  newMsgsBadge: [],
  setNewMsgsBadge: noop,
  modalAddPeopleIsOpen: false,
  setModalAddPeopleIsOpen: noop,
  modalAddChannelIsOpen: false,
  setModalAddChannelIsOpen: noop,
  modalAddDmIsOpen: false,
  setModalAddDmIsOpen: noop,
});
