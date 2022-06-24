import React, { memo, Dispatch, SetStateAction, useCallback } from "react";
import { useQuery, useReactiveVar } from "@apollo/client";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
import { reactiveVarId } from "../../../../GraphQLApp/reactiveVars";
import { GET_USERS } from "../../../../GraphQLApp/queryes";
import { Loader } from "../../../Helpers/Loader";
import MessageHeader from "./MessageHeader";
import MessageText from "./MessageText";
import MessageReplyOn from "./MessageReplyOn";
import { IMapedMessage } from "../../Models/IMessage";
import "./reply-message.sass";
import "./message.sass";

interface IProps {
  arrMsgs: IMapedMessage[];
  openPopup: string;
  setOpenPopup: Dispatch<SetStateAction<string>>;
  setPopupMessage: Dispatch<SetStateAction<null | IMapedMessage>>;
  setCloseBtnChangeMsg: Dispatch<SetStateAction<boolean>>;
  setCloseBtnReplyMsg: Dispatch<SetStateAction<boolean>>;
}

interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  channels: string[];
  directMessages: string[];
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
    const theme = useTheme();
    const authId = useReactiveVar(reactiveVarId);
    const { data: users, loading } = useQuery(GET_USERS);

    console.log("message");

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
        return users.users.find((user: IUser) => {
          return user.id === id;
        }).name;
      },
      [users]
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
        console.log(m);

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
                    authId === m.senderId
                      ? "6px 0px 0px 35px"
                      : "6px 0px 0px 38%",
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
              <MessageText
                status={m.status}
                time={{
                  data: m.updatedAt || m.createdAt,
                  isUpdated: m.updatedAt !== m.createdAt,
                }}
                position={position}
                text={m.text}
                senderId={m.senderId}
                className={"message-text"}
              />
            )}
          </Box>
        );
      });
    }

    if (loading) return <Loader />;

    return <>{drawMessages()}</>;
  }
);

export default Message;
