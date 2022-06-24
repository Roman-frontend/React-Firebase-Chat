import React from 'react';
import { useQuery } from '@apollo/client';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/system';
import { Grid } from '@mui/material';
import EndActionButton from '../EndActionButton/EndActionButton.jsx';
import { GET_USERS } from '../../../GraphQLApp/queryes';

export const ConversationInputHeader = (props) => {
  const {
    popupMessage,
    closeBtnReplyMsg,
    setCloseBtnReplyMsg,
    setCloseBtnChangeMsg,
    inputRef,
    changeMessageRef,
  } = props;
  const theme = useTheme();
  const { data: users } = useQuery(GET_USERS);

  function setName() {
    if (closeBtnReplyMsg) {
      return users.users.find((user) => {
        return user.id === popupMessage.senderId;
      }).name;
    }
    return 'Edit';
  }

  function setText() {
    if (popupMessage.text.length > 20) {
      return `${popupMessage.text.slice(0, 20)}...`;
    }

    return popupMessage.text;
  }
  return (
    <Box
      sx={{
        position: 'relative',
        background: theme.palette.primary.main,
        margin: '0px 65px',
        borderLeft: `inset ${theme.palette.primary.contrastText}`,
      }}
    >
      <Grid container spacing={1}>
        <Grid item xs={11} style={{ padding: 0, lineHeight: 1 }}>
          <p
            style={{
              margin: 0,
              marginLeft: 20,
              color: theme.palette.primary.contrastText,
            }}
          >
            {setName()}
          </p>
          <p style={{ margin: 0, marginLeft: 20 }}>{setText()}</p>
        </Grid>
        <Grid item xs={1} style={{ padding: 0 }}>
          <EndActionButton
            closeBtnReplyMsg={closeBtnReplyMsg}
            setCloseBtnReplyMsg={setCloseBtnReplyMsg}
            setCloseBtnChangeMsg={setCloseBtnChangeMsg}
            inputRef={inputRef}
            changeMessageRef={changeMessageRef}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
