import React, { memo, useContext } from "react";
import { useFirestore } from "reactfire";
import {
  doc,
  updateDoc,
  DocumentReference,
  DocumentData,
} from "firebase/firestore";
import { useTheme } from "@mui/material/styles";
import ListItem from "@mui/material/ListItem";
import Badge from "@mui/material/Badge";
import ListItemText from "@mui/material/ListItemText";
import { determineActiveChat } from "../../Helpers/determineActiveChat";
import { StyledBadgeWraper } from "../../Helpers/StyledBadge";
import { ChatContext } from "../../../Context/ChatContext";

interface IProps {
  drMsg: DocumentData;
  isOpenLeftBar: boolean;
}

export const DirectMessage = memo((props: IProps) => {
  const { drMsg, isOpenLeftBar } = props;
  const theme = useTheme();
  const {
    authId,
    activeChannelId,
    activeDirectMessageId,
    setActiveDirectMessageId,
    setActiveChannelId,
    allUsers,
    allDm,
    allChannels,
  } = useContext(ChatContext);
  const firestore = useFirestore();

  function drawItem(name: string) {
    const friendId =
      drMsg.members[0] === authId ? drMsg.members[1] : drMsg.members[0];
    const badge = drMsg.badge.find(({ uid }: { uid: string }) => {
      return uid === authId;
    });
    const friend = allUsers.find((user: DocumentData) => user.uid === friendId);
    const variantDot = friend?.online ? "dot" : "standard";

    return (
      <>
        <StyledBadgeWraper variant={variantDot} name={name} />
        {isOpenLeftBar && (
          <Badge badgeContent={badge.badgeNewMessages} color="error">
            <ListItemText
              primary={name}
              style={{ margin: "0px 4px 0px 15px" }}
            />
          </Badge>
        )}
      </>
    );
  }

  async function handleClick() {
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
      const dmWithNewBadge = prevChat?.badge.map(
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
        await updateDoc(chatRef, { badge: dmWithNewBadge });
      }
    }

    const dmRef: DocumentReference<DocumentData> = doc(
      firestore,
      "directMessages",
      drMsg.uid
    );
    let isUpdateDoc = false;
    const dmWithNewBadge = drMsg?.badge.map(
      (b: { uid: string; isOpen: boolean; badgeNewMessages: number }) => {
        if (b.uid === authId && !b.isOpen) {
          isUpdateDoc = true;
          return { ...b, isOpen: true, badgeNewMessages: 0 };
        }

        return b;
      }
    );
    if (isUpdateDoc) {
      updateDoc(dmRef, {
        badge: dmWithNewBadge,
      });
    }
    setActiveChannelId(null);
    setActiveDirectMessageId(drMsg.uid);
  }

  if (drMsg && typeof drMsg === "object" && Array.isArray(allUsers)) {
    const name: string = determineActiveChat(drMsg, allUsers, authId);
    return (
      <ListItem
        button
        key={drMsg.uid}
        sx={{
          "&.Mui-selected": {
            background: theme.palette.action.active,
            color: theme.palette.primary.light,
            "&:hover": {
              background: theme.palette.action.active,
            },
          },
          textAlign: "center",
        }}
        onClick={handleClick}
        selected={activeDirectMessageId === drMsg.uid ? true : false}
      >
        {drawItem(name)}
      </ListItem>
    );
  }
  return null;
});
