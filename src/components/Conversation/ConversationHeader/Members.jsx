import React, { useEffect, useState } from 'react';
import { useQuery, useReactiveVar } from '@apollo/client';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import { StyledBadge } from './ConversationHeaderStyles';
import { GET_USERS } from '../../../GraphQLApp/queryes';
import { CHANNELS } from '../../SetsUser/SetsUserGraphQL/queryes';
import {
  activeChatId,
  reactiveOnlineMembers,
} from '../../../GraphQLApp/reactiveVars';
import { StyledBadgeWraper } from '../../Helpers/StyledBadge';

export function Members(props) {
  const { activeChannel, setModalIsShowsMembers } = props;
  const { data: users } = useQuery(GET_USERS);
  const { data: channels } = useQuery(CHANNELS);
  const [iconMembers, setIconMembers] = useState([]);
  const activeChannelId = useReactiveVar(activeChatId).activeChannelId;
  const usersOnline = useReactiveVar(reactiveOnlineMembers);

  useEffect(() => {
    if (users && Array.isArray(users.users) && activeChannel) {
      createAvatars();
    }
  }, [activeChannelId, users, activeChannel, usersOnline, channels]);

  const createAvatars = () => {
    let avatars = [];
    activeChannel.members.forEach((memberId) => {
      users.users.forEach((user) => {
        if (user.id === memberId && usersOnline) {
          const variantDot = usersOnline.includes(user.id) ? 'dot' : 'standard';
          avatars = avatars.concat(
            <StyledBadgeWraper
              variant={variantDot}
              key={user.id}
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
        style={{ fontSize: 30, cursor: 'pointer', justifyContent: 'flex-end' }}
        onClick={() => setModalIsShowsMembers(true)}
      >
        {avatars}
      </AvatarGroup>
    );
  }

  return iconMembers !== [] ? iconMembers : null;
}
