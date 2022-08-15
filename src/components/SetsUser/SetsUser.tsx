import React, { useEffect, useContext, useLayoutEffect, useState } from "react";
import Divider from "@mui/material/Divider";
import { Channels } from "./Channels/Channels";
import { DirectMessages } from "./DirectMessages/DirectMessages";
import { ChatContext } from "../../Context/ChatContext";
import "./sets-user.sass";

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
  const { isErrorInPopap, setIsErrorInPopap, isOpenLeftBar, setIsOpenLeftBar } =
    props;
  const { modalAddPeopleIsOpen, modalAddDmIsOpen, modalAddChannelIsOpen } =
    useContext(ChatContext);
  const [adaptiveStyles, setAdaptiveStyles] = useState<{
    minWidth?: number;
    maxWidth?: number | string;
    width?: number | string;
    display?: string;
  }>({
    maxWidth: window.innerWidth < 610 && isOpenLeftBar ? 610 : 0,
  });

  useLayoutEffect(() => {
    function updateSize() {
      if (window.innerWidth < 610 && isOpenLeftBar) {
        setAdaptiveStyles({ width: "-webkit-fill-available" });
      } else if (window.innerWidth < 610 && !isOpenLeftBar) {
        setAdaptiveStyles({ width: 0 });
      } else if (window.innerWidth < 800 && isOpenLeftBar) {
        setAdaptiveStyles({ maxWidth: 200 });
      } else if (!isOpenLeftBar) {
        setAdaptiveStyles({ minWidth: 0 });
      } else {
        setAdaptiveStyles({ maxWidth: 260 });
      }
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, [isOpenLeftBar, window.innerWidth]);

  useEffect(() => {
    if (!modalAddChannelIsOpen && !modalAddDmIsOpen && !modalAddPeopleIsOpen) {
      setIsErrorInPopap(false);
    }
  }, [modalAddChannelIsOpen, modalAddDmIsOpen, modalAddPeopleIsOpen]);

  return (
    <div className="main" style={adaptiveStyles}>
      <Divider />
      <Channels
        isOpenLeftBar={isOpenLeftBar}
        setIsOpenLeftBar={setIsOpenLeftBar}
        isErrorInPopap={isErrorInPopap}
        setIsErrorInPopap={setIsErrorInPopap}
      />
      <DirectMessages
        isOpenLeftBar={isOpenLeftBar}
        setIsOpenLeftBar={setIsOpenLeftBar}
        isErrorInPopap={isErrorInPopap}
        setIsErrorInPopap={setIsErrorInPopap}
      />
    </div>
  );
}
