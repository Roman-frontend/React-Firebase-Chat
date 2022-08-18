import React, {
  memo,
  useState,
  useContext,
  Dispatch,
  SetStateAction,
  MutableRefObject,
} from "react";
import {
  doc,
  DocumentReference,
  DocumentData,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { useFirestore } from "reactfire";
import { nanoid } from "nanoid";
import { makeStyles } from "@mui/styles";
import SendIcon from "@mui/icons-material/Send";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/system";
import { ChatContext } from "../../../Context/ChatContext";
import { Button } from "@mui/material";

interface IProps {
  changeMessageRef: null | MutableRefObject<DocumentData | null>;
  closeBtnChangeMsg: boolean;
  inputText: string;
  setInputText: Dispatch<SetStateAction<string>>;
  setCloseBtnChangeMsg: Dispatch<SetStateAction<boolean>>;
  closeBtnReplyMsg: boolean;
  setCloseBtnReplyMsg: Dispatch<SetStateAction<boolean>>;
  inputRef: MutableRefObject<HTMLInputElement | null>;
  popupMessage: null | DocumentData;
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    flexGrow: 1,
    fontSize: "3rem",
    textAlign: "right",
    margin: "0px 6%",
  },
}));

export const InputUpdateMessages = memo((props: IProps) => {
  const {
    changeMessageRef,
    closeBtnChangeMsg,
    inputText,
    setInputText,
    setCloseBtnChangeMsg,
    closeBtnReplyMsg,
    setCloseBtnReplyMsg,
    inputRef,
    popupMessage,
  } = props;
  const { activeChannelId, activeDirectMessageId, authId, allDm, allChannels } =
    useContext(ChatContext);
  const theme = useTheme();
  const { t } = useTranslation();
  const firestore = useFirestore();
  const classes = useStyles();

  function inputUpdateMessages(event: React.KeyboardEvent<HTMLInputElement>) {
    event.preventDefault();

    //event.shiftKey - містить значення true - коли користувач нажме деякі з клавіш утримуючи shift
    if (!event.shiftKey && event.key === "Enter") {
      handleSend();
    }
  }

  function handleSend() {
    const value = inputText;
    if (value.trim() !== "") {
      if (closeBtnChangeMsg) changeMessageText(value);
      // else if (closeBtnReplyMsg) messageInReply(value);
      else newMessage(value);
      if (inputText) {
        setInputText("");
      }
      if (closeBtnReplyMsg) {
        setCloseBtnReplyMsg(false);
      }
    }
  }

  const changeMessageDoc = async (chatId: string, text: string) => {
    if (popupMessage?.chatType && popupMessage.id) {
      const messageRef: DocumentReference<DocumentData> = doc(
        firestore,
        `${popupMessage.chatType}/${chatId}/messages`,
        popupMessage.id
      );

      await updateDoc(messageRef, {
        text,
      });
    }
  };

  async function changeMessageText(text: string) {
    if (activeChannelId) {
      changeMessageDoc(activeChannelId, text);
    } else if (activeDirectMessageId) {
      changeMessageDoc(activeDirectMessageId, text);
    }

    if (changeMessageRef?.current) changeMessageRef.current = null;
    setCloseBtnChangeMsg(false);
  }

  async function newMessage(text: string) {
    let chatId: string = "";
    let chatType;

    if (activeChannelId) {
      chatId = activeChannelId;
      chatType = "channels";
    } else if (activeDirectMessageId) {
      chatId = activeDirectMessageId;
      chatType = "directMessages";
    }

    if (chatId && chatType) {
      const messageId = nanoid();
      await setDoc(
        doc(firestore, `${chatType}/${chatId}/messages`, messageId),
        {
          senderId: authId,
          text,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          status: "delivered",
          replyOn: (closeBtnReplyMsg && popupMessage?.text) || null,
          replySenderId: (closeBtnReplyMsg && popupMessage?.senderId) || null,
          chatType,
          chatId,
          id: messageId,
        }
      );

      if (activeDirectMessageId) {
        const dm = allDm.find((dm) => dm.uid === chatId);
        let isUpdateDoc;
        const dmWithNewBadge = dm?.badge.map(
          (
            b: { uid: string; isOpen: boolean; badgeNewMessages: number },
            index: number
          ) => {
            if (b.uid !== authId && !b.isOpen) {
              isUpdateDoc = index;
              return { ...b, badgeNewMessages: b.badgeNewMessages + 1 };
            }

            return b;
          }
        );

        if (isUpdateDoc !== undefined) {
          const chatRef: DocumentReference<DocumentData> = doc(
            firestore,
            chatType,
            chatId
          );
          updateDoc(chatRef, { badge: dmWithNewBadge });
        }
      }

      if (activeChannelId) {
        const channel = allChannels.find((c) => c.uid === chatId);
        let isUpdateDoc;
        const dmWithNewBadge = channel?.badge.map(
          (
            b: { uid: string; isOpen: boolean; badgeNewMessages: number },
            index: number
          ) => {
            if (b.uid !== authId && !b.isOpen) {
              isUpdateDoc = index;
              return { ...b, badgeNewMessages: b.badgeNewMessages + 1 };
            }

            return b;
          }
        );

        if (isUpdateDoc !== undefined) {
          const chatRef: DocumentReference<DocumentData> = doc(
            firestore,
            chatType,
            chatId
          );
          updateDoc(chatRef, { badge: dmWithNewBadge });
        }
      }
    }
  }

  function changeInput(event: React.ChangeEvent<HTMLInputElement>) {
    setInputText(event.target.value);
  }

  return (
    <div
      className={classes.root}
      style={{
        position: "relative",
      }}
      id="mainInput"
    >
      <Grid container spacing={1}>
        <Grid item xs={11}>
          <TextField
            multiline={true}
            maxRows={4}
            style={{ background: theme.palette.secondary.contrastText }}
            inputProps={{
              "data-testid": "on-key-up-main-input",
            }}
            value={inputText}
            label={t("description.inputMain")}
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
              width: "-webkit-fill-available",
            }}
            color="secondary"
          />
        </Grid>
        <Grid
          onClick={handleSend}
          item
          xs={1}
          style={{
            alignSelf: "self-end",
            cursor: "pointer",
            padding: 0,
            textAlign: "left",
          }}
        >
          <SendIcon
            sx={{
              "&:hover": {
                color: theme.palette.primary.contrastText,
              },
            }}
            style={{
              fontSize: 28,
              top: "1rem",
              textAlign: "center",
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
});
