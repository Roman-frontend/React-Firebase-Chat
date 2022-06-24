import React from 'react';
import { Button } from '@mui/material';

export default function EndActionButton(props) {
  const {
    setCloseBtnChangeMsg,
    closeBtnReplyMsg,
    setCloseBtnReplyMsg,
    inputRef,
    changeMessageRef,
  } = props;
  const topInput = document
    .getElementById('mainInput')
    .getBoundingClientRect().top;
  const topButtonClose = closeBtnReplyMsg ? topInput - 56 : topInput;

  function hideButtonExit() {
    setCloseBtnReplyMsg(false);
    setCloseBtnChangeMsg(false);
    changeMessageRef.current = null;
    inputRef.current.value = '';
  }

  return (
    <Button
      //className='conversation-input__end-action-button'
      size='small'
      style={{ color: 'black' }}
      fontSize='large'
      type='checkbox'
      id='checkbox'
      name='checkbox'
      onClick={hideButtonExit}
      inputprops={{ 'aria-label': 'primary checkbox' }}
    >
      X
    </Button>
  );
}
