import React, {
  memo,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
} from "react";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
import MessageHeader from "./MessageHeader";
import MessageText from "./MessageText";
import MessageReplyOn from "./MessageReplyOn";
import MessageWithoutHeader from "./MessageWithoutHeader";
import { IMapedMessage } from "../../Models/IMessage";
import "./reply-message.sass";
import "./message.sass";
import { ChatContext } from "../../../../Context/ChatContext";
import { DocumentData } from "firebase/firestore";

interface IProps {
  arrMsgs: IMapedMessage[];
  openPopup: string;
  setOpenPopup: Dispatch<SetStateAction<string>>;
  setPopupMessage: Dispatch<SetStateAction<null | IMapedMessage>>;
  setCloseBtnChangeMsg: Dispatch<SetStateAction<boolean>>;
  setCloseBtnReplyMsg: Dispatch<SetStateAction<boolean>>;
}

const Message = memo(
  ({
    arrMsgs,
    openPopup,
    setOpenPopup,
    setPopupMessage,
    setCloseBtnChangeMsg,
    setCloseBtnReplyMsg,
  }: IProps) => {
    const { authId, allUsers } = useContext(ChatContext);
    const theme = useTheme();

    const getStyle = useCallback(
      (message: IMapedMessage): { root: React.CSSProperties } => {
        return {
          root: {
            cursor: "pointer",
            position: "relative",
            backgroundColor:
              openPopup === message.id
                ? theme.palette.primary.dark
                : theme.palette.primary.light,
          },
        };
      },
      [theme, openPopup]
    );

    const getSenderName = useCallback(
      (id: string): string => {
        return allUsers?.find((user: DocumentData) => {
          return user?.uid === id;
        })?.name;
      },
      [allUsers]
    );

    const handleClick = (message: IMapedMessage) => {
      setOpenPopup((prevState: string) =>
        prevState === message.id ? "" : message.id
      );
      setCloseBtnChangeMsg(false);
      setCloseBtnReplyMsg(false);
      setPopupMessage(message);
    };

    function drawMessages() {
      return arrMsgs.map((m, index) => {
        const position: string = index === 0 ? "footer" : "middle";
        const style = getStyle(m);
        const classMessage = m.replyOn ? "container-reply" : "container";
        const senderName = getSenderName(m.senderId);
        const replySenderName = m.replySenderId
          ? getSenderName(m.replySenderId)
          : senderName;

        return (
          <Box
            key={m.id}
            id={m.id}
            data-testid="main-message-div"
            style={style.root}
            onClick={() => handleClick(m)}
          >
            {m.replyOn || arrMsgs.length - 1 === index ? (
              <Box
                className={classMessage}
                style={{
                  margin:
                    authId === m.senderId ? "6px 0px 0px 6%" : "6px 6% 0px 30%",
                }}
                id={m.id}
              >
                <MessageHeader
                  status={m.status}
                  classMessage={classMessage}
                  senderName={senderName}
                />
                <MessageText
                  isOnceMsg={arrMsgs.length === 1}
                  status={m.status}
                  time={{
                    data: m.updatedAt || m.createdAt,
                    isUpdated: m.updatedAt !== m.createdAt,
                  }}
                  position="header"
                  text={m.text}
                  senderId={m.senderId}
                  className={`${classMessage}__message`}
                />
                {m.replyOn && (
                  <MessageReplyOn
                    classMessage={classMessage}
                    replyOn={m.replyOn}
                    replySenderName={replySenderName}
                  />
                )}
              </Box>
            ) : (
              <MessageWithoutHeader
                status={m.status}
                time={{
                  data: m.updatedAt || m.createdAt,
                  isUpdated: m.updatedAt !== m.createdAt,
                }}
                position={position}
                text={m.text}
                senderId={m.senderId}
                className="message-text"
              />
            )}
          </Box>
        );
      });
    }

    return <>{drawMessages()}</>;
  }
);

export default Message;
