import React, { useState, useContext } from "react";
import { useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import { Drawer, Box } from "@mui/material";
import { ChatContext } from "../../../Context/ChatContext";
import { determineActiveChat } from "../../Helpers/determineActiveChat";
import DirectMessageRightBar from "../../SetsUser/DirectMessages/DirectMessageRightBar";

export const ConversationHeaderDrMsg = () => {
  const { activeDirectMessageId, allDm, allUsers, authId } =
    useContext(ChatContext);
  const theme = useTheme();
  const [isOpenRightBarDrMsg, setIsOpenRightBarDrMsg] = useState(false);

  function createName() {
    if (activeDirectMessageId && allDm?.length && allUsers?.length) {
      const activeDirectMessage = allDm.find((dm) => {
        return dm.uid === activeDirectMessageId;
      });
      if (activeDirectMessage && authId) {
        const name = determineActiveChat(activeDirectMessage, allUsers, authId);
        return <b className="conversation__name">✩ {name}</b>;
      }
    }
    return null;
  }

  const toggleDrawer = (open: boolean) => (event: any) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return null;
    }

    setIsOpenRightBarDrMsg(open);
  };

  return (
    <div
      style={{
        background: theme.palette.primary.main,
        marginLeft: 8,
        position: "absolute",
        width: "inherit",
      }}
    >
      <Grid
        container
        spacing={1}
        style={{
          alignItems: "center",
          height: "4.3rem",
          cursor: "pointer",
          padding: "0vh 2vw",
          justifyContent: "space-between",
        }}
        sx={{
          "&:hover": {
            color: theme.palette.action.active,
            background: theme.palette.action.hover,
          },
        }}
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
