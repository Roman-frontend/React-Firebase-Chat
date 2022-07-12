import React, { useState, useMemo, useContext } from "react";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  DocumentData,
  DocumentReference,
} from "firebase/firestore";
import { useFirestore } from "reactfire";
// import { useQuery, useMutation, useReactiveVar } from "@apollo/client";
// import { v4 } from "uuid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AssignmentIndSharpIcon from "@mui/icons-material/AssignmentIndSharp";
import PersonIcon from "@mui/icons-material/Person";
import DeleteIcon from "@mui/icons-material/Delete";
// import { AUTH, GET_USERS } from "../../../GraphQLApp/queryes";
// import { SEND_TO_GMAIL } from "../SetsUserGraphQL/queryes";
// import { wsSend } from "../../../WebSocket/soket";
// import {
//   GET_DIRECT_MESSAGES,
//   REMOVE_DIRECT_MESSAGE,
// } from "../SetsUserGraphQL/queryes";
// import {
//   activeChatId,
//   reactiveVarId,
//   reactiveDirectMessages,
// } from "../../../GraphQLApp/reactiveVars";
import { ChatContext } from "../../../Context/ChatContext";
import { determineActiveChat } from "../../Helpers/determineActiveChat";
import { useSnackbar } from "notistack";

const DirectMessageRightBar = () => {
  // const { data: auth } = useQuery(AUTH);
  // const { data: users } = useQuery(GET_USERS);
  // const { data: dDm } = useQuery(GET_DIRECT_MESSAGES);
  // const activeDirectMessageId =
  //   useReactiveVar(activeChatId).activeDirectMessageId;
  // const userId = useReactiveVar(reactiveVarId);
  const { activeDirectMessageId, allDm, allUsers, authId } =
    useContext(ChatContext);
  const { enqueueSnackbar } = useSnackbar();
  const firestore = useFirestore();
  const [stopSendGmail, setStopSendGmail] = useState(true);

  const mailOptions = {
    subject: "Мій тестовий лист з React-Chat",
    text: "Текст листа з React-Chat",
  };

  // const { refetch } = useQuery(SEND_TO_GMAIL, {
  //   //Вимкнути автоматичний відправку
  //   skip: stopSendGmail,

  //   onError(error) {
  //     console.log(`Помилка відправки повідомлення на gmail ${error}`);
  //   },
  //   onCompleted(data) {
  //     console.log("Resolve after send to gmail...", data);
  //   },
  // });

  const activeDirectMessage = useMemo(() => {
    if (activeDirectMessageId && allDm?.length) {
      return allDm.find((dm) => dm?.uid === activeDirectMessageId);
    }
  }, [activeDirectMessageId, allDm]);

  const name = useMemo(() => {
    if (activeDirectMessage) {
      return determineActiveChat(activeDirectMessage, allUsers, authId);
    }
    return "#generall";
  }, [activeDirectMessage]);

  // const [removeDirectMessage] = useMutation(REMOVE_DIRECT_MESSAGE, {
  //   update: (cache, { data: { directMessages } }) => {
  //     cache.modify({
  //       fields: {
  //         directMessages(existingDirectMessagesRefs, { readField }) {
  //           return existingDirectMessagesRefs.filter(
  //             (directMessageRef) =>
  //               directMessages.remove.recordId !==
  //               readField("id", directMessageRef)
  //           );
  //         },
  //         messages({ DELETE }) {
  //           return DELETE;
  //         },
  //       },
  //     });
  //   },
  //   onCompleted(data) {
  //     const removedDm = data.directMessages.remove.record;
  //     const removedUserId = removedDm.members.find((id) => id !== userId);
  //     const storage = JSON.parse(sessionStorage.getItem("storageData"));
  //     const newDrMsgIds = storage.directMessages.filter(
  //       (dmId) => dmId !== removedDm.id
  //     );
  //     const toStorage = JSON.stringify({
  //       ...storage,
  //       directMessages: newDrMsgIds,
  //     });
  //     enqueueSnackbar("Direct Message is a success removed!", {
  //       variant: "success",
  //     });
  //     activeChatId({});
  //     sessionStorage.setItem("storageData", toStorage);
  //     reactiveDirectMessages(newDrMsgIds);
  //     wsSend({ meta: "removedDm", userId, dmId: removedDm.id, removedUserId });
  //   },
  //   onError(error) {
  //     console.log(`Помилка при видаленні повідомлення ${error}`);
  //     enqueueSnackbar("Direct Message isn`t removed!", { variant: "error" });
  //   },
  // });

  function gmailHandler() {
    setStopSendGmail(() => false);
    // refetch({ ...mailOptions });
    setStopSendGmail(() => true);
  }

  async function remove() {
    if (authId) {
      await filterAllDms();
      await filterDmInUser();
      enqueueSnackbar(`Channel removed`, { variant: "success" });
    }
  }

  const filterDmInUser = async () => {
    if (authId) {
      const activeDm = allDm.find((dm) => dm.uid === activeDirectMessageId);
      console.log(activeDm);

      activeDm?.members.forEach(async (memberId: string) => {
        const userRef: DocumentReference<DocumentData> = doc(
          firestore,
          "usersInfo",
          memberId
        );
        const userSnap = await getDoc(userRef);

        if (userSnap.exists() && activeDirectMessageId) {
          const userSnapData: DocumentData | undefined = userSnap.data();
          console.log(userSnapData, authId);
          const filteredDms = userSnapData.directMessages.filter(
            (dmId: string) => {
              return dmId !== activeDirectMessageId;
            }
          );
          console.log(filteredDms);
          await updateDoc(userRef, { directMessages: filteredDms });
        }
      });
    }
  };

  const filterAllDms = async () => {
    if (activeDirectMessageId) {
      const channelRef: DocumentReference<DocumentData> = doc(
        firestore,
        `directMessages`,
        activeDirectMessageId
      );
      await deleteDoc(channelRef);
    }
  };

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
      <ListItem button onClick={remove}>
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
