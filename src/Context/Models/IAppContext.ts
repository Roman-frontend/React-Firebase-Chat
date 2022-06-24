import React, { Dispatch, SetStateAction } from "react";
import IBadge from "../../Models/IBadge";

export interface IAppContext {
  activeChannelId: null | string;
  setActiveChannelId: Dispatch<SetStateAction<null | string>>;
  activeDirectMessageId: null | string;
  setActiveDirectMessageId: Dispatch<SetStateAction<null | string>>;
  newMsgsBadge: [] | IBadge[];
  setNewMsgsBadge: Dispatch<SetStateAction<[] | IBadge[]>>;
  modalAddPeopleIsOpen: boolean;
  setModalAddPeopleIsOpen: Dispatch<SetStateAction<boolean>>;
}
