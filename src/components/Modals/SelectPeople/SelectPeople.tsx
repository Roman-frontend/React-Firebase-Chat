import React, { useContext, useEffect, useState } from "react";
import { DocumentData } from "firebase/firestore";
import { Button } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Select from "react-select";
import { ChatContext } from "../../../Context/ChatContext";

interface IProps {
  isDialogChanged?: boolean;
  closePopap: () => void;
  done: (action: string, invited?: string[]) => Promise<void>;
  isErrorInPopap: boolean;
  notInvitedRef: DocumentData[] | undefined;
}

interface IItemRenderer extends DocumentData {
  label?: string;
}

const selectStyles: any = {
  menu: () => ({
    overflowY: "scroll",
    background: "white",
  }),
};

export const SelectPeople = (props: IProps) => {
  const { closePopap, done, isErrorInPopap, notInvitedRef } = props;
  const [list, setList] = useState<IItemRenderer[]>([]);
  const [invited, setInvited] = useState<string[]>([]);
  const { allUsers } = useContext(ChatContext);

  useEffect(() => {
    if (notInvitedRef) {
      setList(notInvitedRef?.map((user) => ({ ...user, label: user.email })));
    }
  }, [notInvitedRef]);

  const styles = {
    root: {
      minWidth: 400,
      minHeight: 50,
      maxHeight: 300,
    },
  };

  function todo() {
    done("done", invited /* invitedRef.current */);
  }

  function addPeopleToInvited(selected: IItemRenderer) {
    if (Array.isArray(allUsers) && Array.isArray(list)) {
      const selectedIndex = list.indexOf(selected);
      setList((prevList) => {
        if (Array.isArray(prevList)) {
          prevList.splice(selectedIndex, 1);
        }
        return prevList;
      });
      setInvited((prev) => prev.concat(selected.uid));
    }
  }

  const handleChange = (selectedUser: any) => {
    addPeopleToInvited(selectedUser[0]);
  };

  return (
    <div style={styles.root}>
      <div>
        <Select
          styles={selectStyles}
          placeholder="Add member"
          value={null}
          isMulti
          onChange={handleChange}
          options={list}
        />
        {isErrorInPopap ? (
          <p
            style={{
              fontSize: 12,
              paddingLeft: 4,
              marginTop: 6,
              color: "red",
              fontWeight: 600,
            }}
          >
            required
          </p>
        ) : null}
      </div>
      <DialogContent
        style={{
          position: "absolute",
          bottom: 0,
          padding: 0,
        }}
      >
        <FormControl>
          <DialogActions>
            <Button
              size="small"
              variant="contained"
              color="error"
              onClick={closePopap}
            >
              Close
            </Button>
            <Button
              size="small"
              variant="contained"
              color="secondary"
              onClick={todo}
            >
              Add
            </Button>
          </DialogActions>
        </FormControl>
      </DialogContent>
    </div>
  );
};
