import React, { useMemo, useContext } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  DocumentData,
  DocumentReference,
} from "firebase/firestore";
import { useFirestore } from "reactfire";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PersonIcon from "@mui/icons-material/Person";
import DeleteIcon from "@mui/icons-material/Delete";
import { ChatContext } from "../../../Context/ChatContext";
import { determineActiveChat } from "../../Helpers/determineActiveChat";
import { useSnackbar } from "notistack";

const DirectMessageRightBar = () => {
  const { activeDirectMessageId, allDm, allUsers, authId } =
    useContext(ChatContext);
  const { enqueueSnackbar } = useSnackbar();
  const firestore = useFirestore();

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

      activeDm?.members.forEach(async (memberId: string) => {
        const userRef: DocumentReference<DocumentData> = doc(
          firestore,
          "usersInfo",
          memberId
        );
        const userSnap = await getDoc(userRef);

        if (userSnap.exists() && activeDirectMessageId) {
          const userSnapData: DocumentData | undefined = userSnap.data();
          const filteredDms = userSnapData.directMessages.filter(
            (dmId: string) => {
              return dmId !== activeDirectMessageId;
            }
          );
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
    </List>
  );
};

export default React.memo(DirectMessageRightBar);
