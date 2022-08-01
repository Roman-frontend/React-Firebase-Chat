import React, { useState, useMemo, useRef, useEffect, useContext } from "react";
import { useFirestore } from "reactfire";
import { useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Drawer from "@mui/material/Drawer";
import { Box } from "@mui/system";
import { Members } from "./Members";
import { ConversationMembers } from "../../Modals/ConversationHeader/ConversationMembers";
import ChannelsRightBar from "../../SetsUser/Channels/ChannelsRightBar";
import { ChatContext } from "../../../Context/ChatContext";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  DocumentReference,
  DocumentData,
} from "firebase/firestore";

interface IProps {
  isErrorInPopap: boolean;
  setIsErrorInPopap: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ConversationHeaderChannel = ({
  isErrorInPopap,
  setIsErrorInPopap,
}: IProps) => {
  const { setModalAddPeopleIsOpen, allChannels, activeChannelId } =
    useContext(ChatContext);
  const firestore = useFirestore();
  const theme = useTheme();
  const [modalIsShowsMembers, setModalIsShowsMembers] = useState(false);
  const [isOpenRightBarChannels, setIsOpenRightBarChannels] = useState(false);
  const chatNameRef = useRef("#general");

  const activeChannel = useMemo(() => {
    if (activeChannelId && allChannels) {
      return allChannels.find((channel) => channel?.uid === activeChannelId);
    }
  }, [activeChannelId, allChannels]);

  useEffect(() => {
    if (activeChannel) {
      chatNameRef.current = activeChannel.name;
    }
  }, [activeChannel]);

  async function doneInvite(action: string, invited: string[] = []) {
    if (action === "done" && invited[0]) {
      await updateChannel(invited);

      invited.forEach(async (invitedId: string) => {
        await addChannelToInvitedUser(invitedId);
      });
      setModalAddPeopleIsOpen(false);
    } else {
      setIsErrorInPopap(true);
    }
  }

  async function updateChannel(invited: string[]) {
    const channelRef: DocumentReference<DocumentData> = doc(
      firestore,
      "channels",
      activeChannel?.uid
    );
    await updateDoc(channelRef, {
      members: activeChannel?.members.concat(invited),
    });
  }

  async function addChannelToInvitedUser(invitedId: string) {
    const userRef: DocumentReference<DocumentData> = doc(
      firestore,
      "usersInfo",
      invitedId
    );
    const userSnap = await getDoc(userRef);

    if (userSnap.exists() && invitedId && activeChannel?.uid) {
      const userSnapData: DocumentData | undefined = userSnap.data();
      const updatedChannels = userSnapData.channels.concat(activeChannel.uid);
      await setDoc(userRef, {
        ...userSnap.data(),
        channels: updatedChannels,
      });
    }
  }

  const toggleDrawer = (open: boolean) => (event: any) => {
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
        style={{
          alignItems: "center",
          height: "4.3rem",
          justifyContent: "space-between",
        }}
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
    </div>
  );
};
