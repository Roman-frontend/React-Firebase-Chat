import React, { useState, useEffect } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { StyledBadge } from '../../Conversation/ConversationHeader/ConversationHeaderStyles';
import { useQuery, useReactiveVar } from '@apollo/client';
import { GET_USERS } from '../../../GraphQLApp/queryes';
import { reactiveOnlineMembers } from '../../../GraphQLApp/reactiveVars';

export function CreateListMembers(props) {
  const { activeChannel, search, classes } = props;
  const [members, setMembers] = useState(null);
  const { data: allUsers } = useQuery(GET_USERS);
  const usersOnline = useReactiveVar(reactiveOnlineMembers);

  useEffect(() => {
    if (allUsers && Array.isArray(allUsers.users) && activeChannel) {
      createListMembers();
    }
  }, [usersOnline, activeChannel, allUsers, search]);

  const createListMembers = () => {
    const listMembers = getMembersActiveChannel();
    const readyList = (
      <List dense>
        {listMembers.map(({ id, email }) => {
          return (
            <ListItem key={id} button>
              <ListItemAvatar>{createAvatar(id)}</ListItemAvatar>
              <ListItemText id={id} primary={email} />
            </ListItem>
          );
        })}
      </List>
    );
    setMembers(readyList);
  };

  function getMembersActiveChannel() {
    const regExp = new RegExp(`${search}`, 'gi');
    if (activeChannel && allUsers && Array.isArray(allUsers.users)) {
      return allUsers.users.filter((user) => {
        return (
          activeChannel.members.includes(user.id) && user.email.match(regExp)
        );
      });
    }
    return [];
  }

  function createAvatar(memberId) {
    return (
      <StyledBadge
        overlap='circular'
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        variant={usersOnline.includes(memberId) ? 'dot' : 'standard'}
      >
        <Box>
          <PersonIcon
            style={{ fontSize: 30, background: 'cadetblue' }}
            alt='icon-user'
          />
        </Box>
      </StyledBadge>
    );
  }

  return <>{members}</>;
}
