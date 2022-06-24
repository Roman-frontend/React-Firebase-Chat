import React, { memo } from "react";
import { useTheme } from "@mui/material/styles";
import imageProfile from "../../../../images/User-Icon.png";
import "./message.sass";

interface IProps {
  status: string;
  classMessage: string;
  senderName: string;
}

const MessageHeader = memo(({ status, classMessage, senderName }: IProps) => {
  const theme = useTheme();

  return (
    <>
      <img
        src={imageProfile}
        className={`${classMessage}__icon`}
        style={{
          borderRadius: 0,
          height: 35,
          width: 35,
        }}
      />
      <p
        style={{ color: theme.palette.primary.contrastText }}
        className={`${classMessage}__messager`}
      >
        {senderName}
      </p>
    </>
  );
});

export default MessageHeader;
