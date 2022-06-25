import React, { useRef, useEffect, useContext } from "react";
// import { useQuery, useReactiveVar } from "@apollo/client";
import { useTheme } from "@mui/material/styles";
import { withStyles } from "@mui/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { SelectPeople } from "../SelectPeople/SelectPeople";
// import { AUTH, GET_USERS } from "../../../GraphQLApp/queryes";
// import { CHANNELS } from "../../SetsUser/SetsUserGraphQL/queryes";
// import { activeChatId } from "../../../GraphQLApp/reactiveVars";
import { ChatContext } from "../../../Context/ChatContext";

const styles = (theme) => ({
  titleRoot: {
    padding: "24px 16px 0px 16px",
  },
});

export const AddPeopleToChannel = withStyles(styles)((props) => {
  const { chatNameRef, isErrorInPopap, doneInvite, classes } = props;
  const {
    allChannels,
    allUsers,
    activeChannelId,
    modalAddPeopleIsOpen,
    setModalAddPeopleIsOpen,
    authId,
  } = useContext(ChatContext);
  const theme = useTheme();
  // const { data: auth } = useQuery(AUTH);
  // const { data: dChannels } = useQuery(CHANNELS);
  // const { data: allUsers } = useQuery(GET_USERS);
  // const activeChannelId = useReactiveVar(activeChatId).activeChannelId;
  const notInvitedRef = useRef();

  useEffect(() => {
    if (allUsers && authId) {
      let allNotInvited = allUsers.filter((user) => user.uid !== authId);
      if (activeChannelId && allChannels) {
        allChannels.forEach((channel) => {
          if (channel?.uid === activeChannelId) {
            channel.members.forEach((memberId) => {
              allNotInvited = allNotInvited.filter((user) => {
                return user.uid !== memberId;
              });
            });
          }
        });
      }
      notInvitedRef.current = allNotInvited;
      //notInvitedRef.current = allUsers.users;
    }
  }, [allUsers, allChannels, authId, activeChannelId]);

  const closePopap = () => {
    setModalAddPeopleIsOpen(false);
  };

  console.log("modalAddPeopleIsOpen: ", modalAddPeopleIsOpen);

  return (
    <>
      <Dialog
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: theme.palette.primary.main,
          },
        }}
        open={modalAddPeopleIsOpen}
        onClose={closePopap}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle
          id="form-dialog-title"
          classes={{ root: classes.titleRoot }}
        >
          Invite people to #{chatNameRef.current}
        </DialogTitle>
        <SelectPeople
          closePopap={closePopap}
          isErrorInPopap={isErrorInPopap}
          notInvitedRef={notInvitedRef.current}
          done={doneInvite}
        />
      </Dialog>
    </>
  );
});
