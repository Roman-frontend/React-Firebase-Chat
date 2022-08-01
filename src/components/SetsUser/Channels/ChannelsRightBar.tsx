import React, { useContext, useMemo } from "react";
import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  DocumentData,
  DocumentReference,
} from "firebase/firestore";
import { useFirestore } from "reactfire";
import { useSnackbar } from "notistack";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import GroupIcon from "@mui/icons-material/Group";
import DeleteIcon from "@mui/icons-material/Delete";
import { ChatContext } from "../../../Context/ChatContext";

const ChannelsRightBar = () => {
  const { activeChannelId, allChannels, authId } = useContext(ChatContext);
  const firestore = useFirestore();
  const { enqueueSnackbar } = useSnackbar();

  const activeChannel = useMemo(() => {
    if (activeChannelId && allChannels[0]) {
      return allChannels.find((channel) => channel?.uid === activeChannelId);
    }
  }, [activeChannelId, allChannels]);

  function remove() {
    let name = "Leave channel";

    if (activeChannel?.admin === authId) {
      name = "Remove channel";
    }

    return (
      <ListItem button>
        <ListItemIcon>
          <DeleteIcon />
        </ListItemIcon>
        <ListItemText primary={name} onClick={removeChannel} />
      </ListItem>
    );
  }

  const removeChannel = async () => {
    if (authId) {
      await filterUserChannels();
      await filterChannels();
      enqueueSnackbar(`Channel removed`, { variant: "success" });
    }
  };

  const filterUserChannels = async () => {
    if (authId) {
      const userRef: DocumentReference<DocumentData> = doc(
        firestore,
        "usersInfo",
        authId
      );
      const userSnap = await getDoc(userRef);

      if (userSnap.exists() && activeChannel?.uid) {
        const userSnapData: DocumentData | undefined = userSnap.data();
        const filteredChannels = userSnapData.channels.filter(
          (c: DocumentData) => {
            return c !== activeChannel.uid;
          }
        );
        await setDoc(userRef, {
          ...userSnap.data(),
          channels: filteredChannels,
        });
      }
    }
  };

  const filterChannels = async () => {
    if (activeChannel?.uid) {
      const channelRef: DocumentReference<DocumentData> = doc(
        firestore,
        `channels`,
        activeChannel.uid
      );

      if (
        activeChannel?.members.length === 1 &&
        activeChannel.members[0] === authId
      ) {
        await deleteDoc(channelRef);
      } else {
        const channelSnap = await getDoc(channelRef);
        const channelSnapData: DocumentData | undefined = channelSnap.data();

        if (channelSnapData) {
          const filteredChannelMembers = channelSnapData?.members.filter(
            (m: DocumentData) => {
              if (typeof m === "string" && typeof authId === "string") {
                return m !== authId;
              }
            }
          );

          await setDoc(channelRef, {
            ...channelSnap.data(),
            members: filteredChannelMembers,
          });
        }
      }
    }
  };

  return (
    <List>
      <ListItem button>
        <ListItemIcon>
          <GroupIcon
            style={{
              background: "cadetblue",
              borderRadius: "50%",
            }}
          />
        </ListItemIcon>
        <ListItemText primary={activeChannel?.name || "#general"} />
      </ListItem>
      {remove()}
    </List>
  );
};

export default React.memo(ChannelsRightBar);
