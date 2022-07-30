import React, { Dispatch, SetStateAction } from "react";
import { DocumentData } from "firebase/firestore";
import IBadge from "../../Models/IBadge";

export interface IChatContext {
  authId: string | null;
  allDm: DocumentData[];
  setAllDm: Dispatch<SetStateAction<DocumentData[]>>;
  allChannels: DocumentData[];
  setAllChannels: Dispatch<SetStateAction<DocumentData[]>>;
  allUsers: DocumentData[];
  setAllUsers: Dispatch<SetStateAction<DocumentData[]>>;
  activeChannelId: null | string;
  setActiveChannelId: Dispatch<SetStateAction<null | string>>;
  activeDirectMessageId: null | string;
  setActiveDirectMessageId: Dispatch<SetStateAction<null | string>>;
  modalAddPeopleIsOpen: boolean;
  setModalAddPeopleIsOpen: Dispatch<SetStateAction<boolean>>;
  modalAddChannelIsOpen: boolean;
  setModalAddChannelIsOpen: Dispatch<SetStateAction<boolean>>;
  modalAddDmIsOpen: boolean;
  setModalAddDmIsOpen: Dispatch<SetStateAction<boolean>>;
}
