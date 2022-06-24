import React, { useContext, useMemo, useState } from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { AddPeopleToChannel } from "../../Modals/AddPeopleToChannel/AddPeopleToChannel";
import { CreateListMembers } from "./CreateListMembers";
import { AppContext } from "../../../Context/AppContext";

export const ConversationMembers = (props) => {
  const {
    activeChannel,
    modalIsShowsMembers,
    setModalIsShowsMembers,
    chatNameRef,
    doneInvite,
    isErrorInPopap,
  } = props;
  const { setModalAddPeopleIsOpen } = useContext(AppContext);
  const theme = useTheme();
  const [search, setSearch] = useState("[A-Z]");

  const title = useMemo(() => {
    const quantityMembers = activeChannel ? activeChannel.members.length : 1;
    const channelName = activeChannel ? `#${activeChannel.name}` : "#general";
    return (
      <p style={{ margin: 0 }}>
        {`${quantityMembers} members in ${channelName}`}
      </p>
    );
  }, [activeChannel]);

  function handleInput(event) {
    setSearch(event.target.value);
  }

  return (
    <div className="set-channel">
      <Dialog
        sx={{
          position: "absolute",
          top: "18vh",
          maxHeight: "400px",
          "& .MuiDialog-paper": {
            backgroundColor: theme.palette.primary.main,
          },
        }}
        open={modalIsShowsMembers}
        onClose={() => setModalIsShowsMembers(false)}
        aria-labelledby="form-dialog-title"
      >
        <Box style={{ textAlign: "center" }}>
          <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        </Box>
        <Box style={{ textAlign: "center" }}>
          <Button
            color="warning"
            variant="text"
            onClick={() => setModalAddPeopleIsOpen(true)}
          >
            Add people
          </Button>
        </Box>
        <Box>
          <TextField
            autoFocus
            color="secondary"
            variant="standard"
            label="Search people"
            style={{ minWidth: "350px", margin: "0px 25px" }}
            onChange={(event) => handleInput(event)}
          />
        </Box>
        <DialogContent>
          <CreateListMembers activeChannel={activeChannel} search={search} />
        </DialogContent>
      </Dialog>
      <AddPeopleToChannel
        chatNameRef={chatNameRef}
        doneInvite={doneInvite}
        isErrorInPopap={isErrorInPopap}
      />
    </div>
  );
};
