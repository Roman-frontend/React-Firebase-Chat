import React, { useEffect, useContext } from "react";
import Divider from "@mui/material/Divider";
import { Channels } from "./Channels/Channels";
import { DirectMessages } from "./DirectMessages/DirectMessages";
import { ChatContext } from "../../Context/ChatContext";

interface IProps {
  isOpenLeftBar: boolean;
  setIsOpenLeftBar: React.Dispatch<React.SetStateAction<boolean>>;
  isErrorInPopap: boolean;
  setIsErrorInPopap: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IStyles {
  leftBar: React.CSSProperties;
}

export default function SetsUser(props: IProps) {
  const { isErrorInPopap, setIsErrorInPopap, isOpenLeftBar } = props;
  const { modalAddPeopleIsOpen, modalAddDmIsOpen, modalAddChannelIsOpen } =
    useContext(ChatContext);

  const styles: IStyles = {
    leftBar: {
      borderRight: "solid 1px",
      height: 500,
      minWidth: isOpenLeftBar ? 260 : 0,
      margin: "10px 0px",
      overflowY: "scroll",
    },
  };

  useEffect(() => {
    if (!modalAddChannelIsOpen && !modalAddDmIsOpen && !modalAddPeopleIsOpen) {
      setIsErrorInPopap(false);
    }
  }, [modalAddChannelIsOpen, modalAddDmIsOpen, modalAddPeopleIsOpen]);

  return (
    <div style={styles.leftBar}>
      <Divider />
      <Channels
        isOpenLeftBar={isOpenLeftBar}
        isErrorInPopap={isErrorInPopap}
        setIsErrorInPopap={setIsErrorInPopap}
      />
      <DirectMessages
        isOpenLeftBar={isOpenLeftBar}
        isErrorInPopap={isErrorInPopap}
        setIsErrorInPopap={setIsErrorInPopap}
      />
    </div>
  );
}
