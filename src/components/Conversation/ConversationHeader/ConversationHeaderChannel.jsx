import React, { useState, useMemo, useRef, useEffect, useContext } from "react";
import { useSnackbar } from "notistack";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import Drawer from "@mui/material/Drawer";
import { Box } from "@mui/system";
import { Members } from "./Members";
import { ConversationMembers } from "../../Modals/ConversationHeader/ConversationMembers";
import { AddPeopleToChannel } from "../../Modals/AddPeopleToChannel/AddPeopleToChannel";
import {
  CHANNELS,
  ADD_MEMBER_CHANNEL,
} from "../../SetsUser/SetsUserGraphQL/queryes";
import { activeChatId } from "../../../GraphQLApp/reactiveVars";
import ChannelsRightBar from "../../SetsUser/Channels/ChannelsRightBar";
import { AppContext } from "../../../Context/AppContext";

export const ConversationHeaderChannel = (props) => {
  const { isErrorInPopap, setIsErrorInPopap } = props;
  const { setModalAddPeopleIsOpen } = useContext(AppContext);
  const theme = useTheme();
  const { data: dChannels } = useQuery(CHANNELS);
  const { enqueueSnackbar } = useSnackbar();
  const [modalIsShowsMembers, setModalIsShowsMembers] = useState(false);
  const [isOpenRightBarChannels, setIsOpenRightBarChannels] = useState(false);
  const chatNameRef = useRef("#general");
  const activeChannelId = useReactiveVar(activeChatId).activeChannelId;

  const [addMemberToChannel] = useMutation(ADD_MEMBER_CHANNEL, {
    update: (cache, { data: { channel } }) => {
      if (dChannels?.userChannels?.length) {
        const channelsWithChannelHasMember = dChannels.userChannels.map(
          (userChannel) => {
            if (userChannel && userChannel.id === channel.addMember.id) {
              return { ...userChannel, members: channel.addMember.members };
            }
            return userChannel;
          }
        );
        cache.writeQuery({
          query: CHANNELS,
          data: { ...dChannels, userChannels: channelsWithChannelHasMember },
        });
      }
    },
    onCompleted(data) {
      enqueueSnackbar("User successfully added", { variant: "success" });
    },
    onError(error) {
      console.log(`Помилка при додаванні учасника ${error}`);
      enqueueSnackbar("User isn`t added", { variant: "error" });
    },
  });

  const activeChannel = useMemo(() => {
    if (activeChannelId && dChannels?.userChannels?.length) {
      return dChannels.userChannels.find(
        (channel) => channel !== null && channel.id === activeChannelId
      );
    }
  }, [activeChannelId, dChannels]);

  useEffect(() => {
    if (activeChannel) {
      chatNameRef.current = activeChannel.name;
    }
  }, [activeChannel]);

  function doneInvite(action, invited = []) {
    if (action === "done" && invited[0]) {
      addMemberToChannel({ variables: { invited, chatId: activeChannelId } });
      setModalAddPeopleIsOpen(false);
    } else {
      setIsErrorInPopap(true);
    }
  }

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return null;
    }

    setIsOpenRightBarChannels(open);
  };

  return (
    <div style={{ background: theme.palette.primary.main }}>
      <Grid
        container
        spacing={1}
        style={{ alignItems: "center", height: "4.3rem" }}
        justify="space-between"
      >
        <Grid
          item
          xs={8}
          style={{
            height: "inherit",
            padding: "0vw 1.5vw",
            margin: "0vw 0.5vw",
            cursor: "pointer",
          }}
          sx={{
            "&:hover": {
              color: theme.palette.action.active,
              background: theme.palette.action.hover,
            },
          }}
          onClick={toggleDrawer(true)}
        >
          <p
            className="conversation__name"
            style={{ fontWeight: "bold", marginTop: "1.5rem" }}
          >
            ✩ {activeChannel ? activeChannel.name : ""}
          </p>
        </Grid>
        <Grid
          item
          xs={3}
          style={{
            alignSelf: "center",
            flexBasis: "min-content",
            margin: "0px 8px",
          }}
        >
          <Members
            activeChannel={activeChannel}
            setModalIsShowsMembers={setModalIsShowsMembers}
          />
        </Grid>
      </Grid>
      <div>
        <React.Fragment>
          <Drawer
            anchor="right"
            sx={{
              "& .MuiDrawer-paperAnchorRight": {
                background: theme.palette.primary.main,
              },
            }}
            open={isOpenRightBarChannels}
            onClose={toggleDrawer(false)}
          >
            <Box
              sx={{ width: 250, margin: "56px 0px 0px 0px" }}
              role="presentation"
              onClick={toggleDrawer(false)}
              onKeyDown={toggleDrawer(false)}
            >
              <ChannelsRightBar />
            </Box>
          </Drawer>
        </React.Fragment>
      </div>
      <ConversationMembers
        activeChannel={activeChannel}
        modalIsShowsMembers={modalIsShowsMembers}
        setModalIsShowsMembers={setModalIsShowsMembers}
        chatNameRef={chatNameRef}
        doneInvite={doneInvite}
        isErrorInPopap={isErrorInPopap}
      />
      <AddPeopleToChannel
        chatNameRef={chatNameRef}
        doneInvite={doneInvite}
        isErrorInPopap={isErrorInPopap}
      />
    </div>
  );
};
