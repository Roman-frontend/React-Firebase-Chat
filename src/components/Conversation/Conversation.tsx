import React, { useState, useRef, useCallback, useContext } from "react";
import { DocumentData } from "firebase/firestore";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/system";
import { ConversationHeaderChannel } from "./ConversationHeader/ConversationHeaderChannel";
import { ConversationHeaderDrMsg } from "./ConversationHeader/ConversationHeaderDrMsg";
import { ChatContext } from "../../Context/ChatContext";
import { Messages } from "./Messages/Messages";
import { InputUpdateMessages } from "./InputUpdateMessages/InputUpdateMessages";
import { ConversationInputHeader } from "./ConversationInputHeader/ConversationInputHeader";
import { ConversationActionsMessage } from "./ConversationActionsMessage/ConversationActionsMessage";
import imageError from "../../images/error.png";
import { IMapedMessage } from "./Models/IMessage";
import "./conversation.sass";

interface IProps {
  isErrorInPopap: boolean;
  setIsErrorInPopap: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Conversation(props: IProps) {
  const { isErrorInPopap, setIsErrorInPopap } = props;
  const theme = useTheme();
  const { activeChannelId, activeDirectMessageId, allChannels, authId } =
    useContext(ChatContext);
  const [popupMessage, setPopupMessage] = useState<null | IMapedMessage>(null);
  const [closeBtnChangeMsg, setCloseBtnChangeMsg] = useState(false);
  const [closeBtnReplyMsg, setCloseBtnReplyMsg] = useState(false);
  const [openPopup, setOpenPopup] = useState("");
  const [inputText, setInputText] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const changeMessageRef = useRef<null | DocumentData>(null);

  const checkPrivate = useCallback(() => {
    if (allChannels?.length && activeChannelId) {
      const activeChannelIsPrivate = allChannels.find(
        (channel: DocumentData) =>
          channel !== null &&
          channel.uid === activeChannelId &&
          channel.isPrivate
      );
      return activeChannelIsPrivate
        ? activeChannelIsPrivate.members.includes(authId)
        : true;
    }
    return true;
  }, [allChannels, activeChannelId, authId]);

  const contentMessages = () => {
    const hasNotAccesToChat = checkPrivate();

    if (!hasNotAccesToChat) {
      return <img src={imageError} />;
    }
    if (activeChannelId || activeDirectMessageId) {
      return (
        <Messages
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
          setPopupMessage={setPopupMessage}
          setCloseBtnChangeMsg={setCloseBtnChangeMsg}
          setCloseBtnReplyMsg={setCloseBtnReplyMsg}
        />
      );
    }
    return null;
  };

  function inputHeader() {
    if ((closeBtnReplyMsg || closeBtnChangeMsg) && popupMessage) {
      return (
        <ConversationInputHeader
          popupMessage={popupMessage}
          closeBtnReplyMsg={closeBtnReplyMsg}
          setInputText={setInputText}
          setCloseBtnReplyMsg={setCloseBtnReplyMsg}
          setCloseBtnChangeMsg={setCloseBtnChangeMsg}
          changeMessageRef={changeMessageRef}
        />
      );
    }
    return null;
  }

  const setHeader = useCallback(() => {
    return activeChannelId ? (
      <ConversationHeaderChannel
        isErrorInPopap={isErrorInPopap}
        setIsErrorInPopap={setIsErrorInPopap}
      />
    ) : (
      <ConversationHeaderDrMsg />
    );
  }, [activeChannelId, activeDirectMessageId]);

  return (
    <Box
      data-testid="conversation-main-block"
      className="conversation-main-div"
    >
      {setHeader()}
      <Box
        style={{
          overflowY: "auto",
          flexDirection: "column-reverse",
          display: "flex",
          position: "absolute",
          width: "inherit",
          top: 60,
          maxHeight: "inherit",
          // height: closeBtnReplyMsg || closeBtnChangeMsg ? 360 : 385,
        }}
      >
        {contentMessages()}
      </Box>
      {inputHeader()}
      <ConversationActionsMessage
        inputRef={inputRef}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        setCloseBtnReplyMsg={setCloseBtnReplyMsg}
        setInputText={setInputText}
        setCloseBtnChangeMsg={setCloseBtnChangeMsg}
        changeMessageRef={changeMessageRef}
        popupMessage={popupMessage}
      />
      <Box
        style={{
          display: openPopup ? "none" : "block",
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "inherit",
        }}
      >
        <InputUpdateMessages
          popupMessage={popupMessage}
          changeMessageRef={changeMessageRef}
          closeBtnChangeMsg={closeBtnChangeMsg}
          inputRef={inputRef}
          inputText={inputText}
          setInputText={setInputText}
          setCloseBtnChangeMsg={setCloseBtnChangeMsg}
          closeBtnReplyMsg={closeBtnReplyMsg}
          setCloseBtnReplyMsg={setCloseBtnReplyMsg}
        />
      </Box>
    </Box>
  );
}
