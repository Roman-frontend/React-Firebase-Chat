import React, { useState, useRef, useCallback, useContext } from "react";
import { Box } from "@mui/system";
import { ConversationHeaderChannel } from "./ConversationHeader/ConversationHeaderChannel.jsx";
import { ConversationHeaderDrMsg } from "./ConversationHeader/ConversationHeaderDrMsg.jsx";
import { ChatContext } from "../../Context/ChatContext";
// import { Messages } from "./Messages/Messages";
// import { InputUpdateMessages } from "./InputUpdateMessages/InputUpdateMessages";
// import { ConversationInputHeader } from "./ConversationInputHeader/ConversationInputHeader";
// import { ConversationActionsMessage } from "./ConversationActionsMessage/ConversationActionsMessage.jsx";
// import imageError from "../../images/error.png";
// import { useQuery, useReactiveVar } from "@apollo/client";
// import { CHANNELS } from "../SetsUser/SetsUserGraphQL/queryes";
// import { activeChatId, reactiveVarId } from "../../GraphQLApp/reactiveVars";
// import { IQueryMessage, IMapedMessage } from "./Models/IMessage";
// import IChannel from "../Models/IChannel";
// import IBadge from "../../Models/IBadge";

interface IProps {
  isErrorInPopap: boolean;
  setIsErrorInPopap: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Conversation(props: IProps) {
  const { isErrorInPopap, setIsErrorInPopap } = props;
  const { activeChannelId, activeDirectMessageId } = useContext(ChatContext);
  // const { data: dChannels } = useQuery(CHANNELS);
  // const [popupMessage, setPopupMessage] = useState<null | IMapedMessage>(null);
  // const [closeBtnChangeMsg, setCloseBtnChangeMsg] = useState(false);
  // const [closeBtnReplyMsg, setCloseBtnReplyMsg] = useState(false);
  // const inputRef = useRef<HTMLInputElement>(null);
  // const changeMessageRef = useRef<null | IQueryMessage>(null);
  // const activeChannelId = useReactiveVar(activeChatId).activeChannelId;
  // const activeDirectMessageId =
  //   useReactiveVar(activeChatId).activeDirectMessageId;
  // const userId = useReactiveVar(reactiveVarId);
  // const [openPopup, setOpenPopup] = useState("");

  // const checkPrivate = useCallback(() => {
  //   if (dChannels?.userChannels?.length && activeChannelId) {
  //     const activeChannelIsPrivate = dChannels.userChannels.find(
  //       (channel: IChannel) =>
  //         channel !== null &&
  //         channel.uid === activeChannelId &&
  //         channel.isPrivate
  //     );
  //     return activeChannelIsPrivate
  //       ? activeChannelIsPrivate.members.includes(userId)
  //       : true;
  //   }
  //   return true;
  // }, [dChannels, activeChannelId, userId]);

  // const contentMessages = () => {
  //   const hasNotAccesToChat = checkPrivate();

  //   if (!hasNotAccesToChat) {
  //     return <img src={imageError} />;
  //   }
  //   if (activeChannelId || activeDirectMessageId) {
  //     return (
  //       <Messages
  //         openPopup={openPopup}
  //         setOpenPopup={setOpenPopup}
  //         setPopupMessage={setPopupMessage}
  //         setCloseBtnChangeMsg={setCloseBtnChangeMsg}
  //         setCloseBtnReplyMsg={setCloseBtnReplyMsg}
  //       />
  //     );
  //   }
  //   return null;
  // };

  // function inputHeader() {
  //   if ((closeBtnReplyMsg || closeBtnChangeMsg) && popupMessage) {
  //     return (
  //       <ConversationInputHeader
  //         popupMessage={popupMessage}
  //         closeBtnReplyMsg={closeBtnReplyMsg}
  //         setCloseBtnReplyMsg={setCloseBtnReplyMsg}
  //         setCloseBtnChangeMsg={setCloseBtnChangeMsg}
  //         inputRef={inputRef}
  //         changeMessageRef={changeMessageRef}
  //       />
  //     );
  //   }
  //   return null;
  // }

  const setHeader = useCallback(() => {
    return (
      <ConversationHeaderChannel
        isErrorInPopap={isErrorInPopap}
        setIsErrorInPopap={setIsErrorInPopap}
      />
    );
    // return activeChannelId ? (
    //   <ConversationHeaderChannel
    //     isErrorInPopap={isErrorInPopap}
    //     setIsErrorInPopap={setIsErrorInPopap}
    //   />
    // ) : (
    //   <ConversationHeaderDrMsg />
    // );
  }, [activeChannelId, activeDirectMessageId]);

  // console.log(
  //   "activeDirectMessageId: ",
  //   activeDirectMessageId,
  //   "activeChannelId: ",
  //   activeChannelId
  // );

  return (
    <Box data-testid="conversation-main-block">
      {setHeader()}
      {/* <Box
        style={{
          overflowY: "auto",
          flexDirection: "column-reverse",
          display: "flex",
          height: closeBtnReplyMsg || closeBtnChangeMsg ? 360 : 385,
        }}
      >
        {contentMessages()}
      </Box>
      {inputHeader()}
      <ConversationActionsMessage
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        setCloseBtnReplyMsg={setCloseBtnReplyMsg}
        inputRef={inputRef}
        setCloseBtnChangeMsg={setCloseBtnChangeMsg}
        changeMessageRef={changeMessageRef}
        popupMessage={popupMessage}
      />
      <Box style={{ display: openPopup ? "none" : "block" }}>
        <InputUpdateMessages
          popupMessage={popupMessage}
          inputRef={inputRef}
          changeMessageRef={changeMessageRef}
          closeBtnChangeMsg={closeBtnChangeMsg}
          setCloseBtnChangeMsg={setCloseBtnChangeMsg}
          closeBtnReplyMsg={closeBtnReplyMsg}
          setCloseBtnReplyMsg={setCloseBtnReplyMsg}
        />
      </Box> */}
    </Box>
  );
}
