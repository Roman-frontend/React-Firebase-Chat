import React, { useRef, useEffect, useState, useContext } from "react";
// import { useQuery, useReactiveVar } from "@apollo/client";
import Divider from "@mui/material/Divider";
// import { CHANNELS, GET_DIRECT_MESSAGES } from "./SetsUserGraphQL/queryes";
import { activeChatId } from "../../GraphQLApp/reactiveVars";
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
  const { isErrorInPopap, setIsErrorInPopap, isOpenLeftBar, setIsOpenLeftBar } =
    props;
  const { modalAddPeopleIsOpen, modalAddDmIsOpen, modalAddChannelIsOpen } =
    useContext(ChatContext);
  // const { data: dChannels } = useQuery(CHANNELS);
  // const { data: dDms } = useQuery(GET_DIRECT_MESSAGES);
  // const activeChannelId = useReactiveVar(activeChatId).activeChannelId;
  // const activeDirectMessageId =
  //   useReactiveVar(activeChatId).activeDirectMessageId;
  const prevActiveChatIdRef = useRef("");

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

  // useEffect(() => {
  //   if (!activeChannelId && !activeDirectMessageId) {
  //     if (
  //       dChannels?.userChannels?.length &&
  //       dChannels.userChannels[0].id &&
  //       (dChannels.userChannels[0].id !== prevActiveChatIdRef.current ||
  //         (dChannels.userChannels[1] && dChannels.userChannels[1].id))
  //     ) {
  //       if (dChannels.userChannels[0].id !== prevActiveChatIdRef.current) {
  //         activeChatId({
  //           activeChannelId: dChannels.userChannels[0].id,
  //           activeDirectMessageId: "",
  //         });
  //       } else {
  //         activeChatId({
  //           activeChannelId: dChannels.userChannels[1].id,
  //           activeDirectMessageId: "",
  //         });
  //       }
  //     } else if (
  //       dDms?.directMessages?.length &&
  //       dDms.directMessages[0].id &&
  //       (dDms.directMessages[0].id !== prevActiveChatIdRef.current ||
  //         (dDms.directMessages[1] && dDms.directMessages[1].id))
  //     ) {
  //       if (dDms.directMessages[0].id !== prevActiveChatIdRef.current) {
  //         activeChatId({
  //           activeDirectMessageId: dDms.directMessages[0].id,
  //           activeChannelId: "",
  //         });
  //       } else {
  //         activeChatId({
  //           activeDirectMessageId: dDms.directMessages[1].id,
  //           activeChannelId: "",
  //         });
  //       }
  //     }
  //   }

  //   if (prevActiveChatIdRef?.current) {
  //     prevActiveChatIdRef.current = activeChatId().activeChannelId
  //       ? activeChatId().activeChannelId
  //       : activeChatId().activeDirectMessageId
  //       ? activeChatId().activeDirectMessageId
  //       : "";
  //   }
  // }, [dChannels, dDms, activeChannelId, activeDirectMessageId]);

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
