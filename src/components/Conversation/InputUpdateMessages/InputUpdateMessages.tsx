import React, { useMemo, memo, useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { AUTH } from "../../../GraphQLApp/queryes";
import {
  CREATE_MESSAGE,
  CHANGE_MESSAGE,
  GET_MESSAGES,
} from "../ConversationGraphQL/queryes";
import { wsSend } from "../../../WebSocket/soket";
import { activeChatId } from "../../../GraphQLApp/reactiveVars";
import { IQueryMessage } from "../Models/IMessage";

interface IProps {
  changeMessageRef: null | React.MutableRefObject<IQueryMessage | null>;
  closeBtnChangeMsg: boolean;
  setCloseBtnChangeMsg: React.Dispatch<React.SetStateAction<boolean>>;
  closeBtnReplyMsg: boolean;
  setCloseBtnReplyMsg: React.Dispatch<React.SetStateAction<boolean>>;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  popupMessage: null | IQueryMessage;
}

interface ICacheMessage {
  messages: {
    id: string;
    chatMessages: IQueryMessage[] | [];
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    flexGrow: 1,
    fontSize: "3rem",
    textAlign: "right",
  },
}));

export const InputUpdateMessages = memo((props: IProps) => {
  const {
    changeMessageRef,
    closeBtnChangeMsg,
    setCloseBtnChangeMsg,
    closeBtnReplyMsg,
    setCloseBtnReplyMsg,
    inputRef,
    popupMessage,
  } = props;
  const classes = useStyles();
  const { data: auth } = useQuery(AUTH);
  const activeChannelId = useReactiveVar(activeChatId).activeChannelId;
  const activeDirectMessageId =
    useReactiveVar(activeChatId).activeDirectMessageId;
  const [inputText, setInputText] = useState<string>("");

  const chatType = useMemo(() => {
    return activeDirectMessageId
      ? "DirectMessage"
      : activeChannelId
      ? "Channel"
      : null;
  }, [activeChannelId, activeDirectMessageId]);

  const chatId = useMemo(() => {
    return activeDirectMessageId || activeChannelId || null;
  }, [activeChannelId, activeDirectMessageId]);

  const [createMessage] = useMutation(CREATE_MESSAGE, {
    update: (cache, { data }) => {
      const cacheMsg: ICacheMessage | null = cache.readQuery({
        query: GET_MESSAGES,
        // variables: {
        //   chatId: chatId || "6288671cb24f6a89e861b98d",
        //   chatType: chatType || "DirectMessage",
        //   userId: auth?.id || "6288661c22cf8e8950762e14",
        // },
        variables: {
          chatId,
          chatType,
          userId: auth?.id,
        },
      });
      if (cacheMsg && data?.message) {
        const chatMessages = cacheMsg?.messages?.chatMessages || [];
        const newMsg = data.message.create;

        cache.writeQuery({
          query: GET_MESSAGES,
          data: {
            messages: {
              ...cacheMsg.messages,
              chatMessages: [...chatMessages, newMsg],
            },
          },
        });
      }
    },
    onCompleted(data) {
      sendMessageToWS(data.message.create);
    },
  });

  const [changeMessage] = useMutation(CHANGE_MESSAGE, {
    update: (cache, { data: { message } }) => {
      const cacheMsg: ICacheMessage | null = cache.readQuery({
        query: GET_MESSAGES,
        variables: { chatId, chatType, userId: auth.id },
      });
      if (cacheMsg && message?.change) {
        const cacheMessages: IQueryMessage[] | [] =
          cacheMsg?.messages?.chatMessages || [];
        const chatMessages = cacheMessages.map((msg) => {
          return msg.id === message.change.id ? message.change : msg;
        });
        cache.writeQuery({
          query: GET_MESSAGES,
          data: { messages: { ...cacheMsg.messages, chatMessages } },
        });
      }
    },
    onError(error) {
      console.log(`Помилка ${error}`);
    },
    onCompleted(data) {
      sendMessageToWS(data.message.change);
    },
  });

  function sendMessageToWS(data: IQueryMessage) {
    wsSend({
      meta: "sendMessage",
      action: "change",
      room: data.chatId,
      message: data,
    });
  }

  function inputUpdateMessages(event: React.KeyboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const value = inputRef?.current?.value || "";

    //event.shiftKey - містить значення true - коли користувач нажме деякі з клавіш утримуючи shift
    if (value.trim() !== "" && !event.shiftKey && event.key === "Enter") {
      if (closeBtnChangeMsg) changeMessageText(value);
      else if (closeBtnReplyMsg) messageInReply(value);
      else newMessage(value);
      if (inputRef?.current?.value && inputText) {
        inputRef.current.value = "";
        setInputText("");
      }
    }
  }

  async function changeMessageText(text: string) {
    const newMsg = { id: popupMessage?.id || "", text, chatType };
    changeMessage({
      variables: { input: newMsg },
      optimisticResponse: { message: { change: { ...popupMessage, text } } },
    });
    if (changeMessageRef?.current) changeMessageRef.current = null;
    setCloseBtnChangeMsg(false);
  }

  const messageInReply = (text: string) => {
    const replyMsg = {
      chatId,
      chatType,
      senderId: auth?.id || "6288661c22cf8e8950762e14",
      replyOn: popupMessage?.text || "",
      replySenderId: popupMessage?.senderId,
      text,
    };
    createMessage({
      variables: replyMsg,
      optimisticResponse: {
        message: {
          create: {
            chatId,
            chatType,
            createdAt: Date.now(),
            status: "sent",
            id: Date.now(),
            replyOn: popupMessage?.text || "",
            replySenderId: popupMessage?.senderId,
            text,
            updatedAt: "",
            senderId: auth?.id || "6288661c22cf8e8950762e14",
            __typename: "MessagePayload",
          },
        },
      },
    });
    setCloseBtnReplyMsg(false);
  };

  function newMessage(text: string) {
    const newMsg = {
      chatId: chatId || "6288671cb24f6a89e861b98d",
      chatType: chatType || "DirectMessage",
      senderId: auth?.id || "6288661c22cf8e8950762e14",
      text,
    };
    createMessage({
      variables: newMsg,
      optimisticResponse: {
        message: {
          create: {
            chatId,
            chatType,
            createdAt: Date.now(),
            status: "sent",
            id: Date.now(),
            replyOn: null,
            text,
            updatedAt: "",
            senderId: auth?.id || "6288661c22cf8e8950762e14",
            __typename: "MessagePayload",
          },
        },
      },
    });
  }

  function changeInput(event: React.ChangeEvent<HTMLInputElement>) {
    if (inputRef?.current?.value) inputRef.current.value = event.target.value;
    setInputText(event.target.value);
  }

  return (
    <div className={classes.root} id="mainInput">
      <Grid container spacing={1}>
        <Grid item xs={1}>
          <BorderColorIcon
            //color='input'
            style={{ fontSize: 40, top: "1rem", textAlign: "center" }}
          />
        </Grid>
        <Grid item xs={11}>
          <TextField
            inputProps={{ "data-testid": "on-key-up-main-input" }}
            //color='input'
            value={inputText}
            label="Enter text"
            variant="standard"
            inputRef={inputRef}
            autoFocus={true}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              changeInput(event)
            }
            onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>) =>
              inputUpdateMessages(event)
            }
            sx={{
              paddingRight: "6vw",
              width: "-webkit-fill-available",
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
});
