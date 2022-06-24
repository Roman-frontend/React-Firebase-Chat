import React, { useRef, useEffect, useContext } from "react";
import { useQuery, useReactiveVar } from "@apollo/client";
import { useTheme } from "@mui/material/styles";
import { withStyles } from "@mui/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { SelectPeople } from "../SelectPeople/SelectPeople.jsx";
import { AUTH, GET_USERS } from "../../../GraphQLApp/queryes";
import { CHANNELS } from "../../SetsUser/SetsUserGraphQL/queryes";
import { activeChatId } from "../../../GraphQLApp/reactiveVars";
import { AppContext } from "../../../Context/AppContext";

const styles = (theme) => ({
  titleRoot: {
    padding: "24px 16px 0px 16px",
  },
});

export const AddPeopleToChannel = withStyles(styles)((props) => {
  const { chatNameRef, isErrorInPopap, doneInvite, classes } = props;
  const { modalAddPeopleIsOpen, setModalAddPeopleIsOpen } =
    useContext(AppContext);
  const theme = useTheme();
  const { data: auth } = useQuery(AUTH);
  const { data: dChannels } = useQuery(CHANNELS);
  const { data: allUsers } = useQuery(GET_USERS);
  const notInvitedRef = useRef();
  const activeChannelId = useReactiveVar(activeChatId).activeChannelId;

  useEffect(() => {
    if (allUsers && allUsers.users && auth && auth.id) {
      let allNotInvited = allUsers.users.filter((user) => user.id !== auth.id);
      if (activeChannelId && dChannels?.userChannels?.length) {
        dChannels.userChannels.forEach((channel) => {
          if (channel && channel.id === activeChannelId) {
            channel.members.forEach((memberId) => {
              allNotInvited = allNotInvited.filter((user) => {
                return user.id !== memberId;
              });
            });
          }
        });
      }
      notInvitedRef.current = allNotInvited;
      //notInvitedRef.current = allUsers.users;
    }
  }, [allUsers, dChannels, auth, activeChannelId]);

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
