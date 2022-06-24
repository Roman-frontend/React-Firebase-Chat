import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

export function CreateDirectMsgName({ name }) {
  return (
    <Grid container style={{ alignItems: 'center' }}>
      <Grid item xs={2}>
        <PersonIcon
          style={{ background: 'cadetblue', borderRadius: '0.4rem' }}
        />
      </Grid>
      <Grid item xs={10}>
        {name}
      </Grid>
    </Grid>
  );
}

export function CreateChannelName({ isPrivate, name }) {
  const nameChannel = isPrivate ? <p>&#128274;{name}</p> : <p>{`#${name}`}</p>;

  return (
    <Grid container className='left-bar__title-name'>
      <Grid item xs={12}>
        {nameChannel}
      </Grid>
    </Grid>
  );
}

CreateDirectMsgName.defaultProps = {
  name: 'Невизначений',
};
CreateChannelName.defaultProps = {
  name: 'Невизначений',
};
