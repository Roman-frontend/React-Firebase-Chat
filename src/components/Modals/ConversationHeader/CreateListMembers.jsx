import React, { useState, useEffect, useContext } from "react";
import PersonIcon from "@mui/icons-material/Person";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import { StyledBadge } from "../../Conversation/ConversationHeader/ConversationHeaderStyles";
import { ChatContext } from "../../../Context/ChatContext";

export function CreateListMembers(props) {
  const { activeChannel, search, classes } = props;
  const { allUsers } = useContext(ChatContext);
  const [members, setMembers] = useState(null);

  useEffect(() => {
    if (allUsers && activeChannel) {
      createListMembers();
    }
  }, [activeChannel, allUsers, search]);

  const createListMembers = () => {
    const listMembers = getMembersActiveChannel();
    const readyList = (
      <List dense>
        {listMembers.map(({ uid, email, online }) => {
          return (
            <ListItem key={uid} button>
              <ListItemAvatar>{createAvatar(online)}</ListItemAvatar>
              <ListItemText id={uid} primary={email} />
            </ListItem>
          );
        })}
      </List>
    );
    setMembers(readyList);
  };

  function getMembersActiveChannel() {
    const regExp = new RegExp(`${search}`, "gi");
    if (activeChannel && allUsers) {
      return allUsers.filter((user) => {
        return (
          activeChannel.members.includes(user.uid) && user.email.match(regExp)
        );
      });
    }
    return [];
  }

  function createAvatar(online) {
    return (
      <StyledBadge
        overlap="circular"
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        variant={online ? "dot" : "standard"}
      >
        <Box>
          <PersonIcon
            style={{ fontSize: 30, background: "cadetblue" }}
            alt="icon-user"
          />
        </Box>
      </StyledBadge>
    );
  }

  return <>{members}</>;
}
