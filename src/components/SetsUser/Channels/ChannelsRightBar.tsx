import React, { useContext, useMemo } from "react";
// import { useQuery, useMutation, useReactiveVar } from "@apollo/client";
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
import AssignmentIndSharpIcon from "@mui/icons-material/AssignmentIndSharp";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import DeleteIcon from "@mui/icons-material/Delete";
import { ChatContext } from "../../../Context/ChatContext";
// import { CHANNELS, REMOVE_CHANNEL } from "../SetsUserGraphQL/queryes";
// import { activeChatId, reactiveVarId } from "../../../GraphQLApp/reactiveVars";

const ChannelsRightBar = () => {
  const { activeChannelId, allChannels, authId } = useContext(ChatContext);
  // const { data: dChannels } = useQuery(CHANNELS);
  // const activeChannelId = useReactiveVar(activeChatId).activeChannelId;
  // const userId = useReactiveVar(reactiveVarId);
  const firestore = useFirestore();
  const { enqueueSnackbar } = useSnackbar();

  const activeChannel = useMemo(() => {
    if (activeChannelId && allChannels[0]) {
      return allChannels.find((channel) => channel?.uid === activeChannelId);
    }
  }, [activeChannelId, allChannels]);

  // const [removeChannel] = useMutation(REMOVE_CHANNEL, {
  //   update: (cache, { data: { channel } }) => {
  //     cache.modify({
  //       fields: {
  //         userChannels(existingChannelRefs, { readField }) {
  //           return existingChannelRefs.filter(
  //             (channelRef) =>
  //               channel.remove.recordId !== readField("id", channelRef)
  //           );
  //         },
  //         messages({ DELETE }) {
  //           return DELETE;
  //         },
  //       },
  //     });
  //   },
  //   onError(error) {
  //     console.log(`Помилка при видаленні повідомлення ${error}`);
  //     enqueueSnackbar("Channel isn`t removed!", { variant: "error" });
  //   },
  //   onCompleted(data) {
  //     enqueueSnackbar("Channel is a success removed!", {
  //       variant: "success",
  //     });
  //     activeChatId({});
  //   },
  // });

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
        console.log(userSnapData, authId);
        const filteredChannels = userSnapData.channels.filter(
          (c: DocumentData) => {
            return c !== activeChannel.uid;
          }
        );
        console.log(filteredChannels);
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
      // console.log(
      //   activeChannel?.members.length,
      //   activeChannel?.members[0],
      //   authId
      // );
      if (
        activeChannel?.members.length === 1 &&
        activeChannel.members[0] === authId
      ) {
        console.log(
          activeChannel?.members.length,
          activeChannel.members,
          authId
        );
        await deleteDoc(channelRef);
      } else {
        const channelSnap = await getDoc(channelRef);
        const channelSnapData: DocumentData | undefined = channelSnap.data();

        console.log(channelSnap.exists(), channelSnap, channelSnapData);
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
