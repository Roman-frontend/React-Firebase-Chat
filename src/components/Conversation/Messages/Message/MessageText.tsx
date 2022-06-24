import React, { memo } from "react";
import { useReactiveVar } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DoneIcon from "@mui/icons-material/Done";
import { reactiveVarId } from "../../../../GraphQLApp/reactiveVars";
import { messageDate } from "../../../Helpers/Date/DateCreators";
import "./reply-message.sass";
import "./message.sass";

interface IProps {
  isOnceMsg?: boolean;
  position: string;
  status: string;
  text: string;
  time: { data: string; isUpdated: boolean };
  senderId: string;
  className: string;
}

const MessageText = memo(
  ({
    isOnceMsg,
    position,
    text,
    time,
    senderId,
    className,
    status,
  }: IProps) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const authId = useReactiveVar(reactiveVarId);
    const borderRadius = isOnceMsg
      ? "0px 10px 10px"
      : position === "header" && !isOnceMsg
      ? "0px 10px 4px 4px"
      : position === "middle"
      ? 4
      : "4px 4px 10px 10px";
    const messageTime = `${
      time.isUpdated ? t("description.editedMessage") : ""
    } ${messageDate(parseInt(time.data))}`;
    const isAuthSender = authId === senderId;
    const marginBox =
      position === "header"
        ? "0px 0px 6px 0px"
        : isAuthSender
        ? "0px 0px 6px 85px"
        : "0px 0px 6px 293px";

    return (
      <Box
        className={className}
        style={{
          margin: marginBox,
          maxWidth: "fit-content",
          background: isAuthSender
            ? theme.palette.info.light
            : theme.palette.info.dark,
          padding: "4px 9px 0px 20px",
          borderRadius,
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.04), 0 6px 20px 0 rgba(0, 0, 0, 0.05)",
        }}
      >
        <p
          className={`${className}__text`}
          style={{ margin: 0, maxWidth: "max-content" }}
        >
          {text}
        </p>
        <p
          className={`${className}__time`}
          style={{
            margin: 0,
            fontSize: 11,
            alignSelf: "start",
            textAlign: "right",
          }}
        >
          {messageTime}
        </p>
        {status === "delivered" ? (
          <DoneIcon
            className={`${className}__status`}
            style={{ color: theme.palette.primary.contrastText }}
          />
        ) : (
          <AccessTimeIcon className={`${className}__status`} />
        )}
      </Box>
    );
  }
);

export default MessageText;
