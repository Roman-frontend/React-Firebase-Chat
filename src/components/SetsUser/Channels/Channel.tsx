import React from "react";
import { useReactiveVar } from "@apollo/client";
import { useTheme } from "@mui/material/styles";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import { activeChatId } from "../../../GraphQLApp/reactiveVars";
import IChannel from "../../Models/IChannel";

interface IProps {
  isOpenLeftBar: boolean;
  channel: IChannel;
}

type TTheme = {
  palette: {
    leftBarItem: {
      contrastText: string;
    };
    action: {
      active: string;
    };
  };
};

export const Channel = (props: IProps) => {
  const { channel, isOpenLeftBar } = props;
  const activeChannelId = useReactiveVar(activeChatId).activeChannelId;
  const theme: TTheme = useTheme();

  if (
    typeof channel === "object" &&
    channel?.uid &&
    theme?.palette?.leftBarItem?.contrastText
  ) {
    return (
      <ListItem
        button
        sx={{
          "&.Mui-selected": {
            background: theme.palette.action.active,
            color: theme.palette.leftBarItem.contrastText,
            "&:hover": {
              background: theme.palette.action.active,
            },
          },
        }}
        onClick={() =>
          activeChatId({
            activeChannelId: channel.uid,
            activeDirectMessageId: "",
          })
        }
        selected={activeChannelId === channel.uid && true}
      >
        <>
          <Avatar alt={channel.name}>{channel.name[0]}</Avatar>
          {isOpenLeftBar && (
            <ListItemText
              primary={channel.name}
              style={{ textAlign: "center" }}
            />
          )}
        </>
      </ListItem>
    );
  }
  return null;
};
