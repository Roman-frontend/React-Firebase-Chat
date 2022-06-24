import React, { useMemo } from "react";
import { useQuery } from "@apollo/client";
import { useTheme } from "@mui/material/styles";
import { withStyles } from "@mui/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { GET_USERS } from "../../../GraphQLApp/queryes";
import { SelectPeople } from "../SelectPeople/SelectPeople.jsx";
import {
  reactiveVarName,
  reactiveVarId,
} from "../../../GraphQLApp/reactiveVars";
import { GET_DIRECT_MESSAGES } from "../../SetsUser/SetsUserGraphQL/queryes";

const styles = (theme) => ({
  titleRoot: {
    padding: "24px 16px 0px 16px",
  },
});

export const AddDirectMessage = withStyles(styles)((props) => {
  const { data: dUsers } = useQuery(GET_USERS);
  const { data: dDms } = useQuery(GET_DIRECT_MESSAGES);
  const {
    done,
    classes,
    modalAddDmIsOpen,
    setModalAddDmIsOpen,
    isErrorInPopap,
  } = props;
  const theme = useTheme();

  const closePopap = () => {
    setModalAddDmIsOpen(false);
  };

  const listNotInvited = useMemo(() => {
    if (dUsers?.users?.length && reactiveVarId()) {
      let allNotInvited = dUsers.users.filter(
        (user) => user.id !== reactiveVarId()
      );
      if (dDms?.directMessages?.length) {
        dDms.directMessages.forEach((directMessage) => {
          directMessage.members.forEach((memberId) => {
            allNotInvited = allNotInvited.filter(
              (user) => user.id !== memberId
            );
          });
        });
      }
      return allNotInvited;
      //return dUsers.users;
    }
  }, [dUsers, dDms, reactiveVarId()]);

  return (
    <>
      <Dialog
        data-testid="add-dm-modal"
        open={modalAddDmIsOpen}
        onClose={() => setModalAddDmIsOpen(false)}
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: theme.palette.primary.main,
          },
        }}
      >
        <DialogTitle
          id="form-dialog-title"
          classes={{ root: classes.titleRoot }}
        >
          Invite people to {reactiveVarName()}
        </DialogTitle>
        <SelectPeople
          closePopap={closePopap}
          notInvitedRef={listNotInvited}
          done={done}
          isErrorInPopap={isErrorInPopap}
        />
      </Dialog>
    </>
  );
});
