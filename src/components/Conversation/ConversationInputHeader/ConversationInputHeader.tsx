import React, {
  useContext,
  Dispatch,
  SetStateAction,
  MutableRefObject,
} from "react";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/system";
import { Grid } from "@mui/material";
import EndActionButton from "../EndActionButton/EndActionButton";
import { ChatContext } from "../../../Context/ChatContext";
import { DocumentData } from "firebase/firestore";

interface IProps {
  closeBtnReplyMsg: boolean;
  setInputText: Dispatch<SetStateAction<string>>;
  setCloseBtnReplyMsg: Dispatch<SetStateAction<boolean>>;
  setCloseBtnChangeMsg: Dispatch<SetStateAction<boolean>>;
  popupMessage: null | DocumentData;
  changeMessageRef: null | MutableRefObject<DocumentData | null>;
}

export const ConversationInputHeader = (props: IProps) => {
  const {
    popupMessage,
    closeBtnReplyMsg,
    setInputText,
    setCloseBtnReplyMsg,
    setCloseBtnChangeMsg,
    changeMessageRef,
  } = props;
  const { allUsers } = useContext(ChatContext);
  const theme = useTheme();

  function setName() {
    if (closeBtnReplyMsg && Array.isArray(allUsers)) {
      return allUsers.find((user: DocumentData) => {
        return user?.uid === popupMessage?.senderId;
      })?.name;
    }
    return "Edit";
  }

  function setText() {
    if (popupMessage?.text?.length && popupMessage.text.length > 20) {
      return `${popupMessage.text.slice(0, 20)}...`;
    }

    return popupMessage?.text;
  }
  return (
    <Box
      sx={{
        background: theme.palette.primary.main,
        margin: "0px 65px",
        borderLeft: `inset ${theme.palette.primary.contrastText}`,
        width: "inherit",
        position: "absolute",
        top: 67,
        left: -27,
      }}
    >
      <Grid container spacing={1}>
        <Grid item xs={11} style={{ padding: 0, lineHeight: 1 }}>
          <p
            style={{
              margin: 0,
              marginLeft: 20,
              color: theme.palette.primary.contrastText,
            }}
          >
            {setName()}
          </p>
          <p style={{ margin: 0, marginLeft: 20 }}>{setText()}</p>
        </Grid>
        <Grid item xs={1} style={{ padding: 0 }}>
          <EndActionButton
            closeBtnReplyMsg={closeBtnReplyMsg}
            setInputText={setInputText}
            setCloseBtnReplyMsg={setCloseBtnReplyMsg}
            setCloseBtnChangeMsg={setCloseBtnChangeMsg}
            changeMessageRef={changeMessageRef}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
