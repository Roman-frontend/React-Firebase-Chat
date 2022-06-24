import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import PersonIcon from "@mui/icons-material/Person";
import { Drawer, Box } from "@mui/material";
import { useQuery, useReactiveVar } from "@apollo/client";
import { AUTH, GET_USERS } from "../../../GraphQLApp/queryes";
import { GET_DIRECT_MESSAGES } from "../../SetsUser/SetsUserGraphQL/queryes";
import { activeChatId } from "../../../GraphQLApp/reactiveVars";
import { determineActiveChat } from "../../Helpers/determineActiveChat";
import DirectMessageRightBar from "../../SetsUser/DirectMessages/DirectMessageRightBar";

export const ConversationHeaderDrMsg = (props) => {
  const theme = useTheme();
  const { data: auth } = useQuery(AUTH);
  const { data: listDirectMessages } = useQuery(GET_DIRECT_MESSAGES);
  const { data: allUsers } = useQuery(GET_USERS);
  const activeDirectMessageId =
    useReactiveVar(activeChatId).activeDirectMessageId;
  const [isOpenRightBarDrMsg, setIsOpenRightBarDrMsg] = useState(false);

  function createName() {
    if (
      activeDirectMessageId &&
      listDirectMessages?.directMessages?.length &&
      allUsers?.users?.length
    ) {
      const activeDirectMessage = listDirectMessages.directMessages.find(
        (directMessage) => {
          return directMessage.id === activeDirectMessageId;
        }
      );
      if (activeDirectMessage && auth && auth.id) {
        const name = determineActiveChat(
          activeDirectMessage,
          allUsers.users,
          auth.id
        );
        return <b className="conversation__name">✩ {name}</b>;
      }
    }
    return null;
  }

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return null;
    }

    setIsOpenRightBarDrMsg(open);
  };

  return (
    <div style={{ background: theme.palette.primary.main, marginLeft: 8 }}>
      <Grid
        container
        spacing={1}
        style={{
          alignItems: "center",
          height: "4.3rem",
          cursor: "pointer",
          padding: "0vh 2vw",
        }}
        sx={{
          "&:hover": {
            color: theme.palette.action.active,
            background: theme.palette.action.hover,
          },
        }}
        justify="space-between"
        onClick={toggleDrawer(true)}
      >
        {createName()}
      </Grid>
      <div>
        <React.Fragment>
          <Drawer
            sx={{
              "& .MuiDrawer-paperAnchorRight": {
                background: theme.palette.primary.main,
              },
            }}
            anchor="right"
            open={isOpenRightBarDrMsg}
            onClose={toggleDrawer(false)}
          >
            <Box
              sx={{
                width: 250,
                margin: "56px 0px 0px 0px",
              }}
              role="presentation"
              onClick={toggleDrawer(false)}
              onKeyDown={toggleDrawer(false)}
            >
              <DirectMessageRightBar />
            </Box>
          </Drawer>
        </React.Fragment>
      </div>
    </div>
  );
};
