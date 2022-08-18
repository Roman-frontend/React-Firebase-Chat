import React, { Dispatch, SetStateAction, MutableRefObject } from "react";
import { DocumentData } from "firebase/firestore";
import { Button } from "@mui/material";

interface IProps {
  setInputText: Dispatch<SetStateAction<string>>;
  closeBtnReplyMsg: boolean;
  setCloseBtnReplyMsg: Dispatch<SetStateAction<boolean>>;
  setCloseBtnChangeMsg: Dispatch<SetStateAction<boolean>>;
  changeMessageRef: null | MutableRefObject<DocumentData | null>;
}

export default function EndActionButton(props: IProps) {
  const {
    setInputText,
    setCloseBtnChangeMsg,
    // closeBtnReplyMsg,
    setCloseBtnReplyMsg,
    changeMessageRef,
  } = props;
  // const topInput = document
  //   .getElementById('mainInput')
  //   .getBoundingClientRect().top;
  // const topButtonClose = closeBtnReplyMsg ? topInput - 56 : topInput;

  function hideButtonExit() {
    setCloseBtnReplyMsg(false);
    setCloseBtnChangeMsg(false);
    if (changeMessageRef?.current) changeMessageRef.current = null;
    setInputText("");
  }

  return (
    <Button
      size="small"
      style={{ color: "black" }}
      // fontSize='large'
      // type='checkbox'
      // id='checkbox'
      // name='checkbox'
      onClick={hideButtonExit}
      // inputprops={{ 'aria-label': 'primary checkbox' }}
    >
      X
    </Button>
  );
}
