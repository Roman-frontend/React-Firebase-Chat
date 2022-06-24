import React, { memo } from "react";
import { useTheme } from "@mui/material/styles";
import "./reply-message.sass";
import "./message.sass";

interface IProps {
  classMessage: string;
  replyOn: string;
  replySenderName: string;
}

const MessageReplyOn = memo(
  ({ classMessage, replyOn, replySenderName }: IProps) => {
    const theme = useTheme();

    return (
      <div
        className={`${classMessage}__reply`}
        style={{ background: theme.palette.info.main }}
      >
        <p
          style={{
            fontWeight: 600,
            color: theme.palette.primary.contrastText,
            margin: "10px 0px 16px 0px",
            fontSize: 12,
          }}
        >
          {replySenderName}
        </p>
        <p style={{ margin: "0px 0px 10px 0px", fontSize: 14 }}>
          {replyOn.length > 18 ? `${replyOn.slice(0, 21)}...` : replyOn}
        </p>
      </div>
    );
  }
);

export default MessageReplyOn;
