import React, { useContext, useMemo } from "react";
import { getAuth } from "firebase/auth";
// import { useQuery } from "@apollo/client";
import { useTheme } from "@mui/material/styles";
import { withStyles } from "@mui/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
// import { GET_USERS } from "../../../GraphQLApp/queryes";
import { SelectPeople } from "../SelectPeople/SelectPeople";
import { ChatContext } from "../../../Context/ChatContext";
import { DialogContent } from "@mui/material";
// import {
//   reactiveVarName,
//   reactiveVarId,
// } from "../../../GraphQLApp/reactiveVars";
// import { GET_DIRECT_MESSAGES } from "../../SetsUser/SetsUserGraphQL/queryes";

interface IProps {
  done: (action: string, invited?: string[]) => Promise<void>;
  classes: any;
  modalAddDmIsOpen: boolean;
  setModalAddDmIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isErrorInPopap: boolean;
}

const styles = (theme: any) => ({
  titleRoot: {
    padding: "24px 16px 0px 16px",
  },
});

export const AddDirectMessage = withStyles(styles)((props: IProps) => {
  // const { data: dUsers } = useQuery(GET_USERS);
  // const { data: dDms } = useQuery(GET_DIRECT_MESSAGES);
  const {
    done,
    classes,
    modalAddDmIsOpen,
    setModalAddDmIsOpen,
    isErrorInPopap,
  } = props;
  const auth = getAuth();
  const { allUsers, allDm, authId } = useContext(ChatContext);
  const theme = useTheme();

  const closePopap = () => {
    setModalAddDmIsOpen(false);
  };

  const listNotInvited = useMemo(() => {
    if (allUsers[0]) {
      console.log(allUsers);
      let allNotInvited = allUsers.filter((user) => user.uid !== authId);
      if (allDm[0]) {
        allDm.forEach((dm) => {
          dm.members.forEach((memberId: string) => {
            allNotInvited = allNotInvited.filter(
              (user) => user.uid !== memberId
            );
          });
        });
      }
      return allNotInvited;
      //return dUsers.users;
    }
  }, [allUsers, allDm, auth]);

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
          {"Invite people to" /* {reactiveVarName()} */}
        </DialogTitle>
        <DialogContent style={{ padding: "0px 24px 46px 24px" }}>
          <SelectPeople
            closePopap={closePopap}
            notInvitedRef={listNotInvited}
            done={done}
            isErrorInPopap={isErrorInPopap}
          />
        </DialogContent>
      </Dialog>
    </>
  );
});
