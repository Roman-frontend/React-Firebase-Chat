import React, {
  useEffect,
  useState,
  useContext,
  Dispatch,
  SetStateAction,
  MutableRefObject,
} from "react";
import {
  doc,
  deleteDoc,
  DocumentData,
  DocumentReference,
} from "firebase/firestore";
import { useFirestore } from "reactfire";
import { nanoid } from "nanoid";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/system";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import ReplyIcon from "@mui/icons-material/Reply";
import EditIcon from "@mui/icons-material/Edit";
import ForwardIcon from "@mui/icons-material/Forward";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import { ChatContext } from "../../../Context/ChatContext";
import { IMapedMessage } from "../Models/IMessage";
import "./conversation-actions-message.sass";

interface IProps {
  inputRef: MutableRefObject<HTMLInputElement | null>;
  setInputText: Dispatch<SetStateAction<string>>;
  openPopup: string;
  setOpenPopup: Dispatch<SetStateAction<string>>;
  setCloseBtnReplyMsg: Dispatch<SetStateAction<boolean>>;
  setCloseBtnChangeMsg: Dispatch<SetStateAction<boolean>>;
  popupMessage: null | IMapedMessage;
  changeMessageRef: null | MutableRefObject<DocumentData | null>;
}

const useStyles = makeStyles((theme) => ({
  icon: {
    margin: 0,
  },
}));

export function ConversationActionsMessage(props: IProps) {
  const {
    openPopup,
    setInputText,
    setOpenPopup,
    setCloseBtnReplyMsg,
    inputRef,
    setCloseBtnChangeMsg,
    changeMessageRef,
    popupMessage,
  } = props;
  const { authId, activeChannelId, activeDirectMessageId } =
    useContext(ChatContext);
  const classes = useStyles();
  const theme = useTheme();
  const firestore = useFirestore();
  const [focusRootInput, setFocusRootInput] = useState<string | null>(null);

  useEffect(() => {
    setOpenPopup("");
    setCloseBtnReplyMsg(false);
    setCloseBtnChangeMsg(false);
  }, [activeChannelId, activeDirectMessageId]);

  useEffect(() => {
    if (focusRootInput && inputRef?.current) {
      inputRef?.current.focus();
    }
  }, [focusRootInput]);

  const handleAnswer = () => {
    setOpenPopup("");
    setCloseBtnReplyMsg(true);
    setFocusRootInput(nanoid());
    setInputText("");
  };

  const handleChange = () => {
    setCloseBtnChangeMsg(true);
    setOpenPopup("");
    if (changeMessageRef?.current && popupMessage) {
      changeMessageRef.current = popupMessage;
    }
    setFocusRootInput(nanoid());
    if (popupMessage?.text) {
      setInputText(popupMessage?.text);
    }
  };

  const handleDelete = async () => {
    setOpenPopup("");
    if (activeDirectMessageId) {
      removeMessage(activeDirectMessageId);
    } else if (activeChannelId) {
      removeMessage(activeChannelId);
    }
  };

  const removeMessage = async (chatId: string) => {
    if (popupMessage?.chatType && popupMessage.id) {
      const messageRef: DocumentReference<DocumentData> = doc(
        firestore,
        `${popupMessage.chatType}/${chatId}/messages`,
        popupMessage.id
      );

      await deleteDoc(messageRef);
    }
  };

  const handleCancel = () => {
    setOpenPopup("");
  };

  return (
    <Box
      sx={{
        background: theme.palette.primary.light,
        maxWidth: "initial",
      }}
      style={{
        display: openPopup ? "initial" : "none",
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "inherit",
      }}
    >
      <Box
        style={{
          margin: "0% 6%",
          background: theme.palette.primary.main,
          borderRadius: "0px 24px 0px 0px",
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.01)",
          height: 56,
        }}
      >
        <Button
          classes={{ startIcon: classes.icon }}
          className="action-buttons"
          size="small"
          variant="contained"
          color="info"
          startIcon={<ReplyIcon className="action-buttons-icon" />}
          onClick={handleAnswer}
        >
          ANSWER
        </Button>
        {popupMessage && popupMessage.senderId === authId && (
          <Button
            classes={{ startIcon: classes.icon }}
            className="action-buttons"
            size="small"
            variant="contained"
            color="info"
            startIcon={<EditIcon className="action-buttons-icon" />}
            onClick={handleChange}
          >
            EDIT
          </Button>
        )}
        <Button
          classes={{ startIcon: classes.icon }}
          className="action-buttons"
          size="small"
          variant="contained"
          color="info"
          startIcon={<ForwardIcon className="action-buttons-icon" />}
          onClick={() => setOpenPopup("")}
        >
          FORWARD
        </Button>
        {popupMessage && popupMessage.senderId === authId && (
          <Button
            style={{ color: "white" }}
            classes={{ startIcon: classes.icon }}
            className="action-buttons"
            size="small"
            variant="contained"
            color="error"
            startIcon={<DeleteIcon className="action-buttons-icon" />}
            onClick={handleDelete}
          >
            DELETE
          </Button>
        )}
        <Button
          style={{ color: "white" }}
          classes={{ startIcon: classes.icon }}
          className="action-buttons"
          size="small"
          variant="contained"
          color="warning"
          startIcon={<CancelIcon className="action-buttons-icon" />}
          onClick={handleCancel}
        >
          CANCEL
        </Button>
      </Box>
    </Box>
  );
}
