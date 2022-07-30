import React, {
  useEffect,
  useState,
  useContext,
  Dispatch,
  SetStateAction,
  MutableRefObject,
} from "react";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  DocumentData,
  DocumentReference,
} from "firebase/firestore";
import { useFirestore } from "reactfire";
import { nanoid } from "nanoid";
// import { useMutation, useReactiveVar } from "@apollo/client";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/system";
import Button from "@mui/material/Button";
import ReplyIcon from "@mui/icons-material/Reply";
import EditIcon from "@mui/icons-material/Edit";
import ForwardIcon from "@mui/icons-material/Forward";
import DeleteIcon from "@mui/icons-material/Delete";
import { ChatContext } from "../../../Context/ChatContext";
// import { REMOVE_MESSAGE } from "../ConversationGraphQL/queryes";
// import { reactiveVarId, activeChatId } from "../../../GraphQLApp/reactiveVars";
import { IMapedMessage } from "../Models/IMessage";

interface IProps {
  inputRef: MutableRefObject<HTMLInputElement | null>;
  openPopup: string;
  setOpenPopup: Dispatch<SetStateAction<string>>;
  setCloseBtnReplyMsg: Dispatch<SetStateAction<boolean>>;
  setCloseBtnChangeMsg: Dispatch<SetStateAction<boolean>>;
  popupMessage: null | IMapedMessage;
  changeMessageRef: null | MutableRefObject<DocumentData | null>;
}

const stylesButton = { margin: 1 /* border: '1px solid rebeccapurple' */ };

export function ConversationActionsMessage(props: IProps) {
  const {
    openPopup,
    setOpenPopup,
    setCloseBtnReplyMsg,
    inputRef,
    setCloseBtnChangeMsg,
    changeMessageRef,
    popupMessage,
  } = props;
  const { authId, activeChannelId, activeDirectMessageId } =
    useContext(ChatContext);
  const theme = useTheme();
  const firestore = useFirestore();
  // const userId = useReactiveVar(reactiveVarId);
  // const activeChannelId = useReactiveVar(activeChatId).activeChannelId;
  // const activeDirectMessageId =
  //   useReactiveVar(activeChatId).activeDirectMessageId;
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

  // const [removeMessage] = useMutation(REMOVE_MESSAGE, {
  //   update: (cache) => {
  //     cache.modify({
  //       fields: {
  //         messages({ DELETE }) {
  //           return DELETE;
  //         },
  //       },
  //     });
  //   },
  //   onError(error) {
  //     console.log(`Помилка при видаленні повідомлення ${error}`);
  //   },
  // });

  const handleAnswer = () => {
    setOpenPopup("");
    setCloseBtnReplyMsg(true);
    setFocusRootInput(nanoid());
    if (inputRef?.current) {
      inputRef.current.value = "";
    }
  };

  const handleChange = () => {
    setCloseBtnChangeMsg(true);
    setOpenPopup("");
    if (changeMessageRef?.current && popupMessage) {
      changeMessageRef.current = popupMessage;
    }
    setFocusRootInput(nanoid());
    if (inputRef?.current?.value && popupMessage?.text) {
      inputRef.current.value = popupMessage?.text;
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
        background: theme.palette.primary.main,
        maxWidth: "initial",
      }}
      style={{ display: openPopup ? "initial" : "none" }}
    >
      <Button
        sx={stylesButton}
        size="small"
        variant="contained"
        color="primary"
        startIcon={<ReplyIcon />}
        onClick={handleAnswer}
      >
        ANSWER
      </Button>
      {popupMessage && popupMessage.senderId === authId && (
        <Button
          sx={stylesButton}
          size="small"
          variant="contained"
          color="primary"
          startIcon={<EditIcon />}
          onClick={handleChange}
        >
          EDIT
        </Button>
      )}
      <Button
        sx={stylesButton}
        size="small"
        variant="contained"
        color="primary"
        startIcon={<ForwardIcon />}
        onClick={() => setOpenPopup("")}
      >
        FORWARD
      </Button>
      {popupMessage && popupMessage.senderId === authId && (
        <Button
          sx={stylesButton}
          size="small"
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDelete}
        >
          DELETE
        </Button>
      )}
      <Button
        sx={stylesButton}
        size="small"
        variant="contained"
        color="info"
        onClick={handleCancel}
      >
        CANCEL
      </Button>
    </Box>
  );
}
