import React, { useContext, useEffect, useState } from "react";
// import { useQuery, useReactiveVar } from '@apollo/client';
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import { StyledBadge } from "./ConversationHeaderStyles";
// import { GET_USERS } from '../../../GraphQLApp/queryes';
// import { CHANNELS } from '../../SetsUser/SetsUserGraphQL/queryes';
// import {
//   activeChatId,
//   reactiveOnlineMembers,
// } from '../../../GraphQLApp/reactiveVars';
import { StyledBadgeWraper } from "../../Helpers/StyledBadge";
import { ChatContext } from "../../../Context/ChatContext";

export function Members(props) {
  const { activeChannel, setModalIsShowsMembers } = props;
  const { activeChannelId, allUsers, allChannels } = useContext(ChatContext);
  // const { data: users } = useQuery(GET_USERS);
  // const { data: channels } = useQuery(CHANNELS);
  const [iconMembers, setIconMembers] = useState([]);
  // const activeChannelId = useReactiveVar(activeChatId).activeChannelId;
  // const usersOnline = useReactiveVar(reactiveOnlineMembers);

  useEffect(() => {
    if (allUsers && activeChannel) {
      createAvatars();
    }
  }, [
    activeChannelId,
    allUsers,
    activeChannel,
    /* usersOnline, */ allChannels,
  ]);

  const createAvatars = () => {
    let avatars = [];
    activeChannel.members.forEach((memberId) => {
      allUsers.forEach((user) => {
        if (user.uid === memberId /* && usersOnline */) {
          // const variantDot = usersOnline.includes(user.id) ? 'dot' : 'standard';
          const variantDot = "standard";
          avatars = avatars.concat(
            <StyledBadgeWraper
              variant={variantDot}
              key={user.uid}
              name={user.name}
            />
          );
        }
      });
    });
    const readyIcons = createAvatar(avatars);
    setIconMembers(readyIcons);
  };

  function createAvatar(avatars) {
    return (
      <AvatarGroup
        max={3}
        style={{ fontSize: 30, cursor: "pointer", justifyContent: "flex-end" }}
        onClick={() => setModalIsShowsMembers(true)}
      >
        {avatars}
      </AvatarGroup>
    );
  }

  return iconMembers !== [] ? iconMembers : null;
}
