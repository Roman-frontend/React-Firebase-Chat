import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { gql, useQuery, useMutation, useReactiveVar } from "@apollo/client";
import { useSnackbar } from "notistack";
import { useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { AUTH } from "../../../GraphQLApp/queryes";
import {
  CREATE_DIRECT_MESSAGE,
  GET_DIRECT_MESSAGES,
} from "../../SetsUser/SetsUserGraphQL/queryes";
import {
  reactiveDirectMessages,
  reactiveVarId,
} from "../../../GraphQLApp/reactiveVars";
import { AddDirectMessage } from "../../Modals/AddDirectMessage/AddDirectMessage.jsx";
import { DirectMessage } from "./DirectMessage";
import { wsSend } from "../../../WebSocket/soket";
import { nanoid } from "nanoid";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
  },
}));

export function DirectMessages(props) {
  const {
    isOpenLeftBar,
    isErrorInPopap,
    setIsErrorInPopap,
    modalAddDmIsOpen,
    setModalAddDmIsOpen,
  } = props;
  const theme = useTheme();
  const { t } = useTranslation();
  const { data: auth } = useQuery(AUTH);
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const { data: dDms } = useQuery(GET_DIRECT_MESSAGES);
  const { enqueueSnackbar } = useSnackbar();
  const userId = useReactiveVar(reactiveVarId);

  const [createDirectMessage] = useMutation(CREATE_DIRECT_MESSAGE, {
    update(cache, { data: { directMessages } }) {
      cache.modify({
        fields: {
          directMessages(existingDrMsg) {
            const newCommentRef = directMessages.create.record.map(
              (newDrMsg) => {
                return cache.writeFragment({
                  data: newDrMsg,
                  fragment: gql`
                    fragment NewDirectMessage on DirectMessage {
                      id
                      members
                    }
                  `,
                });
              }
            );
            return [...existingDrMsg, ...newCommentRef];
          },
        },
      });
    },
    onError(error) {
      console.log(`Помилка ${error}`);
      enqueueSnackbar("Direct Message created!", { variant: "error" });
    },
    onCompleted(data) {
      const storage = JSON.parse(sessionStorage.getItem("storageData"));
      const newDrMsgIds = data.directMessages.create.record.map(({ id }) => id);
      const toStorage = JSON.stringify({
        ...storage,
        directMessages: [...storage.directMessages, ...newDrMsgIds],
      });
      sessionStorage.setItem("storageData", toStorage);
      reactiveDirectMessages([...reactiveDirectMessages(), ...newDrMsgIds]);
      enqueueSnackbar("Direct Message created!", { variant: "success" });
      const dms = data.directMessages.create.record;
      dms.forEach((dm) => {
        const invitedId = dm.members.find((memberId) => {
          return memberId !== userId;
        });
        console.log(invitedId);
        wsSend({ meta: "addedDm", userId, dmId: dm.id, invitedId });
      });
    },
  });

  function doneInvite(action, invited) {
    if (action === "done" && invited && invited[0]) {
      createDirectMessage({
        variables: { inviter: auth.id, invited },
      });
      setModalAddDmIsOpen(false);
    } else {
      setIsErrorInPopap(true);
    }
  }

  const createDMList = () => {
    if (dDms?.directMessages?.length) {
      // console.log(dDms?.directMessages);
      return (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List>
            {dDms.directMessages.map((drMsg) => (
              <React.Fragment key={drMsg.id}>
                <DirectMessage drMsg={drMsg} isOpenLeftBar={isOpenLeftBar} />
              </React.Fragment>
            ))}
          </List>
        </Collapse>
      );
    }
    return null;
  };

  return (
    <>
      <div>
        <List component="nav" className={classes.root}>
          {isOpenLeftBar ? (
            <ListItem
              sx={{ paddingLeft: 0 }}
              key={nanoid()}
              button
              onClick={() => setOpen(!open)}
            >
              <ListItemIcon style={{ justifyContent: "center" }}>
                <EmojiPeopleIcon color="action" />
              </ListItemIcon>
              <ListItemText
                style={{ textAlign: "center" }}
                primary={t("description.dirrectMessageTitle")}
              />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
          ) : (
            <ListItem
              style={{ padding: 0, margin: 0, justifyContent: "center" }}
              key={nanoid()}
              button
              onClick={() => setOpen(!open)}
            >
              <ListItemIcon style={{ padding: "0", justifyContent: "center" }}>
                <EmojiPeopleIcon color="action" />
              </ListItemIcon>
            </ListItem>
          )}
          {createDMList()}
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
        onClick={() => setModalAddDmIsOpen(true)}
      >
        {isOpenLeftBar ? `+ ${t("description.addDm")}` : "+"}
      </Button>
      <AddDirectMessage
        done={doneInvite}
        modalAddDmIsOpen={modalAddDmIsOpen}
        setModalAddDmIsOpen={setModalAddDmIsOpen}
        isErrorInPopap={isErrorInPopap}
      />
    </>
  );
}
