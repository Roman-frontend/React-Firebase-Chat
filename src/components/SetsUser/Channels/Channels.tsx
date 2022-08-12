import React, { useState, useEffect, useContext } from "react";
import { DocumentData } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import { AddChannel } from "../../Modals/AddChannel/AddChannel";
import { Channel } from "./Channel";
import { nanoid } from "nanoid";
import { ChatContext } from "../../../Context/ChatContext";

interface IProps {
  isOpenLeftBar: boolean;
  setIsOpenLeftBar: React.Dispatch<React.SetStateAction<boolean>>;
  isErrorInPopap: boolean;
  setIsErrorInPopap: React.Dispatch<React.SetStateAction<boolean>>;
}

type TTheme = {
  palette: {
    leftBarItem: {
      light: string;
    };
  };
};

const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
  },
}));

export function Channels(props: IProps) {
  const { isOpenLeftBar, setIsOpenLeftBar, isErrorInPopap, setIsErrorInPopap } =
    props;
  const { t } = useTranslation();
  const theme: TTheme = useTheme();
  const classes = useStyles();
  const { allChannels, modalAddChannelIsOpen, setModalAddChannelIsOpen } =
    useContext(ChatContext);
  const [open, setOpen] = useState(true);

  return (
    <>
      <div>
        <List component="nav" className={classes.root}>
          {isOpenLeftBar ? (
            <ListItem
              key={nanoid()}
              style={{ paddingLeft: 0 }}
              button
              onClick={() => setOpen(!open)}
            >
              <ListItemIcon style={{ justifyContent: "center" }}>
                <SupervisedUserCircleIcon color="action" />
              </ListItemIcon>
              <ListItemText
                style={{ textAlign: "center" }}
                primary={t("description.channelTitle")}
              />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
          ) : (
            <ListItem
              key={nanoid()}
              style={{ padding: 0, margin: 0, justifyContent: "center" }}
              button
              onClick={() => setOpen(!open)}
            >
              <ListItemIcon style={{ padding: "0", justifyContent: "center" }}>
                <SupervisedUserCircleIcon color="action" />
              </ListItemIcon>
            </ListItem>
          )}
          {Array.isArray(allChannels) ? (
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List>
                {allChannels.map((channel: DocumentData) =>
                  channel ? (
                    <React.Fragment key={channel.uid}>
                      <Channel
                        channel={channel}
                        isOpenLeftBar={isOpenLeftBar}
                        setIsOpenLeftBar={setIsOpenLeftBar}
                      />
                    </React.Fragment>
                  ) : null
                )}
              </List>
            </Collapse>
          ) : null}
        </List>
      </div>
      <Button
        size="small"
        sx={{
          width: "100%",
          padding: 0,
          "&:hover": { color: theme.palette.leftBarItem.light },
        }}
        color="warning"
        onClick={() => setModalAddChannelIsOpen(true)}
      >
        {isOpenLeftBar ? `+ ${t("description.addChannel")}` : "+"}
      </Button>
      <AddChannel
        modalAddChannelIsOpen={modalAddChannelIsOpen}
        setModalAddChannelIsOpen={setModalAddChannelIsOpen}
        isErrorInPopap={isErrorInPopap}
        setIsErrorInPopap={setIsErrorInPopap}
      />
    </>
  );
}
