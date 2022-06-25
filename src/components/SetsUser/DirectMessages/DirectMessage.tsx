import React, { memo, useState, useContext } from "react";
// import { useQuery, useReactiveVar, useApolloClient } from "@apollo/client";
import { useTheme } from "@mui/material/styles";
import ListItem from "@mui/material/ListItem";
import Badge from "@mui/material/Badge";
import ListItemText from "@mui/material/ListItemText";
// import {
//   activeChatId,
//   reactiveVarId,
//   reactiveOnlineMembers,
// } from "../../../GraphQLApp/reactiveVars";
// import { GET_USERS } from "../../../GraphQLApp/queryes";
import { determineActiveChat } from "../../Helpers/determineActiveChat";
import { StyledBadgeWraper } from "../../Helpers/StyledBadge";
// import { GET_MESSAGES } from "../../Conversation/ConversationGraphQL/queryes";
import { DocumentData } from "firebase/firestore";
import { ChatContext } from "../../../Context/ChatContext";

interface IProps {
  drMsg: DocumentData;
  isOpenLeftBar: boolean;
}

export const DirectMessage = memo((props: IProps) => {
  const { drMsg, isOpenLeftBar } = props;
  // const { data: users } = useQuery(GET_USERS);
  // const usersOnline = useReactiveVar(reactiveOnlineMembers);
  // const authId = useReactiveVar(reactiveVarId);
  // const activeDirectMessageId =
  //   useReactiveVar(activeChatId).activeDirectMessageId;
  const theme = useTheme();
  // const client = useApolloClient();
  const {
    authId,
    newMsgsBadge,
    setNewMsgsBadge,
    activeDirectMessageId,
    setActiveDirectMessageId,
    setActiveChannelId,
    allUsers,
  } = useContext(ChatContext);

  function drawItem(name: string) {
    // const friendId =
    //   drMsg.members[0] === authId ? drMsg.members[1] : drMsg.members[0];
    // const friendIsOnline = usersOnline.includes(friendId);
    // const variantDot = friendIsOnline ? "dot" : "standard";
    const thisDmHasNewMsgs = newMsgsBadge.find((dm) => dm.id === drMsg.uid);
    const numNewMsgs = thisDmHasNewMsgs ? thisDmHasNewMsgs.num : 0;

    return (
      <>
        <StyledBadgeWraper variant={"standard"} name={name} />
        {isOpenLeftBar && (
          <Badge badgeContent={numNewMsgs} color="error">
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
    setActiveChannelId(null);
    setActiveDirectMessageId(drMsg.uid);
    if (newMsgsBadge[0]) {
      const thisDmHasNewMsgs = newMsgsBadge.find((dm) => dm.id === drMsg.id);
      if (thisDmHasNewMsgs) {
        const filteredChatHasNewMsgs = newMsgsBadge.filter(
          (dm) => dm.id !== drMsg.uid
        );
        setNewMsgsBadge(filteredChatHasNewMsgs);
        // await client.query({
        //   query: GET_MESSAGES,
        //   variables: {
        //     chatId: drMsg.id,
        //     chatType: "DirectMessage",
        //     userId: authId,
        //   },
        // });
      }
    }
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
