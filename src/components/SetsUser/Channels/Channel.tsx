import React, { useContext } from "react";
import { useFirestore } from "reactfire";
import {
  doc,
  updateDoc,
  DocumentReference,
  DocumentData,
} from "firebase/firestore";
import { useTheme } from "@mui/material/styles";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import { Badge } from "@mui/material";
import { ChatContext } from "../../../Context/ChatContext";

interface IProps {
  isOpenLeftBar: boolean;
  setIsOpenLeftBar: React.Dispatch<React.SetStateAction<boolean>>;
  channel: DocumentData;
}

type TTheme = {
  palette: {
    leftBarItem: {
      contrastText: string;
    };
    action: {
      active: string;
    };
  };
};

export const Channel = (props: IProps) => {
  const { channel, isOpenLeftBar, setIsOpenLeftBar } = props;
  const {
    allDm,
    allChannels,
    activeChannelId,
    setActiveChannelId,
    activeDirectMessageId,
    setActiveDirectMessageId,
    authId,
  } = useContext(ChatContext);
  const firestore = useFirestore();
  const theme: TTheme = useTheme();

  function drawItem() {
    const badge = channel?.badge.find(({ uid }: { uid: string }) => {
      return uid === authId;
    });

    return (
      <>
        <Avatar alt={channel.name}>{channel.name[0]}</Avatar>
        {isOpenLeftBar && (
          <Badge badgeContent={badge?.badgeNewMessages} color="error">
            <ListItemText
              primary={channel.name}
              style={{ margin: "0px 4px 0px 15px" }}
            />
          </Badge>
        )}
      </>
    );
  }

  async function handleClick() {
    console.log("handleClick");
    const prevActiveChatId = activeChannelId
      ? activeChannelId
      : activeDirectMessageId;
    const prevActiveChatName = activeChannelId ? "channels" : "directMessages";
    if (prevActiveChatId && prevActiveChatName) {
      const chatRef: DocumentReference<DocumentData> = doc(
        firestore,
        prevActiveChatName,
        prevActiveChatId
      );

      const prevChat = activeChannelId
        ? allChannels.find((c) => c.uid === prevActiveChatId)
        : allDm.find((dm) => dm.uid === prevActiveChatId);
      let isUpdateDoc;
      const channelWithNewBadge = prevChat?.badge.map(
        (
          b: { uid: string; isOpen: boolean; badgeNewMessages: number },
          index: number
        ) => {
          if (b.uid === authId && b.isOpen) {
            isUpdateDoc = index;
            return { ...b, isOpen: false };
          }

          return b;
        }
      );
      if (isUpdateDoc !== undefined) {
        await updateDoc(chatRef, { badge: channelWithNewBadge });
      }
    }

    const channelRef: DocumentReference<DocumentData> = doc(
      firestore,
      "channels",
      channel.uid
    );
    let isUpdateDoc = false;
    const channelWithNewBadge = channel?.badge.map(
      (b: { uid: string; isOpen: boolean; badgeNewMessages: number }) => {
        if (b.uid === authId && !b.isOpen) {
          isUpdateDoc = true;
          return { ...b, isOpen: true, badgeNewMessages: 0 };
        }

        return b;
      }
    );
    if (isUpdateDoc) {
      updateDoc(channelRef, {
        badge: channelWithNewBadge,
      });
    }
    setActiveChannelId(channel.uid);
    setActiveDirectMessageId(null);
    if (window.innerWidth < 610) {
      setIsOpenLeftBar(false);
    }
  }

  if (
    typeof channel === "object" &&
    channel?.uid &&
    theme?.palette?.leftBarItem?.contrastText
  ) {
    return (
      <ListItem
        key={channel.uid}
        button
        sx={{
          "&.Mui-selected": {
            background: theme.palette.action.active,
            color: theme.palette.leftBarItem.contrastText,
            "&:hover": {
              background: theme.palette.action.active,
            },
          },
          justifyContent: "center",
        }}
        onClick={handleClick}
        selected={activeChannelId === channel.uid && true}
      >
        {drawItem()}
      </ListItem>
    );
  }
  return null;
};
