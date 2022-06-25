import React, { useContext, useMemo } from "react";
// import { useQuery, useMutation, useReactiveVar } from "@apollo/client";
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
        <ListItemText
          primary={name}
          // onClick={() =>
          //   removeChannel({ variables: { channelId: activeChannelId, authId } })
          // }
        />
      </ListItem>
    );
  }

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
