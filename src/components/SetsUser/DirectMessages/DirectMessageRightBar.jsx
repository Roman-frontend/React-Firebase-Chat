import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useReactiveVar } from "@apollo/client";
import { v4 } from "uuid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AssignmentIndSharpIcon from "@mui/icons-material/AssignmentIndSharp";
import PersonIcon from "@mui/icons-material/Person";
import DeleteIcon from "@mui/icons-material/Delete";
import { AUTH, GET_USERS } from "../../../GraphQLApp/queryes";
import { SEND_TO_GMAIL } from "../SetsUserGraphQL/queryes";
import { wsSend } from "../../../WebSocket/soket";
import {
  GET_DIRECT_MESSAGES,
  REMOVE_DIRECT_MESSAGE,
} from "../SetsUserGraphQL/queryes";
import {
  activeChatId,
  reactiveVarId,
  reactiveDirectMessages,
} from "../../../GraphQLApp/reactiveVars";
import { determineActiveChat } from "../../Helpers/determineActiveChat";
import { useSnackbar } from "notistack";

const DirectMessageRightBar = (props) => {
  const { data: auth } = useQuery(AUTH);
  const { data: users } = useQuery(GET_USERS);
  const { data: dDm } = useQuery(GET_DIRECT_MESSAGES);
  const activeDirectMessageId =
    useReactiveVar(activeChatId).activeDirectMessageId;
  const userId = useReactiveVar(reactiveVarId);
  const { enqueueSnackbar } = useSnackbar();
  const [stopSendGmail, setStopSendGmail] = useState(true);

  const mailOptions = {
    subject: "Мій тестовий лист з React-Chat",
    text: "Текст листа з React-Chat",
  };

  const { refetch } = useQuery(SEND_TO_GMAIL, {
    //Вимкнути автоматичний відправку
    skip: stopSendGmail,

    onError(error) {
      console.log(`Помилка відправки повідомлення на gmail ${error}`);
    },
    onCompleted(data) {
      console.log("Resolve after send to gmail...", data);
    },
  });

  const activeDirectMessage = useMemo(() => {
    if (activeDirectMessageId && dDm?.directMessages?.length) {
      return dDm.directMessages.find(
        (drMsg) => drMsg !== null && drMsg.id === activeDirectMessageId
      );
    }
  }, [activeDirectMessageId, dDm]);

  const name = useMemo(() => {
    if (activeDirectMessage) {
      return determineActiveChat(activeDirectMessage, users.users, auth.id);
    }
    return "#generall";
  }, [activeDirectMessage]);

  const [removeDirectMessage] = useMutation(REMOVE_DIRECT_MESSAGE, {
    update: (cache, { data: { directMessages } }) => {
      cache.modify({
        fields: {
          directMessages(existingDirectMessagesRefs, { readField }) {
            return existingDirectMessagesRefs.filter(
              (directMessageRef) =>
                directMessages.remove.recordId !==
                readField("id", directMessageRef)
            );
          },
          messages({ DELETE }) {
            return DELETE;
          },
        },
      });
    },
    onCompleted(data) {
      const removedDm = data.directMessages.remove.record;
      const removedUserId = removedDm.members.find((id) => id !== userId);
      const storage = JSON.parse(sessionStorage.getItem("storageData"));
      const newDrMsgIds = storage.directMessages.filter(
        (dmId) => dmId !== removedDm.id
      );
      const toStorage = JSON.stringify({
        ...storage,
        directMessages: newDrMsgIds,
      });
      enqueueSnackbar("Direct Message is a success removed!", {
        variant: "success",
      });
      activeChatId({});
      sessionStorage.setItem("storageData", toStorage);
      reactiveDirectMessages(newDrMsgIds);
      wsSend({ meta: "removedDm", userId, dmId: removedDm.id, removedUserId });
    },
    onError(error) {
      console.log(`Помилка при видаленні повідомлення ${error}`);
      enqueueSnackbar("Direct Message isn`t removed!", { variant: "error" });
    },
  });

  function gmailHandler() {
    setStopSendGmail(() => false);
    refetch({ ...mailOptions });
    setStopSendGmail(() => true);
  }

  return (
    <List data-testid="dm-right-bar">
      <ListItem button>
        <ListItemIcon>
          <PersonIcon
            style={{
              background: "cadetblue",
              borderRadius: "50%",
              fontSize: 40,
              cursor: "pointer",
            }}
          />
        </ListItemIcon>
        <ListItemText primary={name} />
      </ListItem>
      <ListItem
        button
        onClick={() =>
          removeDirectMessage({ variables: { id: activeDirectMessageId } })
        }
      >
        <ListItemIcon>
          <DeleteIcon />
        </ListItemIcon>
        <ListItemText primary="Remove chat" />
      </ListItem>
      {/* <ListItem button onClick={gmailHandler}>
        <ListItemText primary="Send to Gmail" />
      </ListItem> */}
    </List>
  );
};

export default React.memo(DirectMessageRightBar);
