import React, { useContext } from "react";
// import { useReactiveVar } from "@apollo/client";
import { useTheme } from "@mui/material/styles";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
// import { activeChatId } from "../../../GraphQLApp/reactiveVars";
import IChannel from "../../Models/IChannel";
import { DocumentData } from "firebase/firestore";
import { ChatContext } from "../../../Context/ChatContext";

interface IProps {
  isOpenLeftBar: boolean;
  channel: DocumentData;
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
  const { activeChannelId, setActiveChannelId, setActiveDirectMessageId } =
    useContext(ChatContext);
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
        onClick={() => {
          setActiveChannelId(channel.uid);
          setActiveDirectMessageId(null);
        }}
        selected={activeChannelId === channel.uid && true}
      >
        <>
          <Avatar alt={channel.name}>{channel.name[0]}</Avatar>
          {isOpenLeftBar && (
            <ListItemText
              primary={channel.name}
              style={{ margin: "0px 4px 0px 15px" }}
            />
          )}
        </>
      </ListItem>
    );
  }
  return null;
};
