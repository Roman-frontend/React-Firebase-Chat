import React, { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { useMutation, useReactiveVar } from "@apollo/client";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/system";
import Button from "@mui/material/Button";
import ReplyIcon from "@mui/icons-material/Reply";
import EditIcon from "@mui/icons-material/Edit";
import ForwardIcon from "@mui/icons-material/Forward";
import DeleteIcon from "@mui/icons-material/Delete";
import { REMOVE_MESSAGE } from "../ConversationGraphQL/queryes";
import { reactiveVarId, activeChatId } from "../../../GraphQLApp/reactiveVars";

const stylesButton = { margin: 1 /* border: '1px solid rebeccapurple' */ };

export function ConversationActionsMessage(props) {
  const {
    openPopup,
    setOpenPopup,
    setCloseBtnReplyMsg,
    inputRef,
    setCloseBtnChangeMsg,
    changeMessageRef,
    popupMessage,
  } = props;
  const theme = useTheme();
  const userId = useReactiveVar(reactiveVarId);
  const activeChannelId = useReactiveVar(activeChatId).activeChannelId;
  const activeDirectMessageId =
    useReactiveVar(activeChatId).activeDirectMessageId;
  const [focusRootInput, setFocusRootInput] = useState(false);

  useEffect(() => {
    setOpenPopup("");
    setCloseBtnReplyMsg(false);
    setCloseBtnChangeMsg(false);
  }, [activeChannelId, activeDirectMessageId]);

  useEffect(() => {
    if (focusRootInput) {
      inputRef.current.focus();
    }
  }, [focusRootInput]);

  const [removeMessage] = useMutation(REMOVE_MESSAGE, {
    update: (cache) => {
      cache.modify({
        fields: {
          messages({ DELETE }) {
            return DELETE;
          },
        },
      });
    },
    onError(error) {
      console.log(`Помилка при видаленні повідомлення ${error}`);
    },
  });

  const handleAnswer = () => {
    setOpenPopup("");
    setCloseBtnReplyMsg(true);
    setFocusRootInput(nanoid());
    inputRef.current.value = "";
  };

  const handleChange = () => {
    setCloseBtnChangeMsg(true);
    setOpenPopup("");
    changeMessageRef.current = popupMessage;
    setFocusRootInput(nanoid());
    inputRef.current.value = popupMessage.text;
  };

  const handleDelete = () => {
    setOpenPopup("");
    removeMessage({
      variables: { id: popupMessage.id, chatType: popupMessage.chatType },
    });
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
      style={{ display: !openPopup && "none" }}
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
      {popupMessage && popupMessage.senderId === userId && (
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
      {popupMessage && popupMessage.senderId === userId && (
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
