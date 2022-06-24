import React, { useEffect, useState } from "react";
import { collection, getDocs, query, DocumentData } from "firebase/firestore";
import { useFirestore } from "reactfire";
import { Button } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Select from "react-select";
// import Select, {SelectItemRenderer} from "react-dropdown-select";
import { useTheme } from "@mui/material/styles";
import { StyledBadgeWraper } from "../../Helpers/StyledBadge";

interface IProps {
  authUid: string | undefined;
  isDialogChanged: boolean;
  closePopap: () => void;
  done: (action: string, invited?: string[]) => Promise<void>;
  isErrorInPopap: boolean;
  notInvitedRef: DocumentData[] | undefined;
}

// interface IItemRenderer {
//   channels: string[];
//   email: string[];
//   images: string[];
//   name: string;
//   surname: string;
//   uid: string;
//   label?: string;
// }

interface IItemRenderer extends DocumentData {
  label?: string;
}

export const SelectPeople = (props: IProps) => {
  const {
    authUid,
    isDialogChanged,
    closePopap,
    done,
    isErrorInPopap,
    notInvitedRef,
  } = props;
  const firestore = useFirestore();
  const theme = useTheme();
  const [list, setList] = useState<IItemRenderer[]>([]);
  const [invited, setInvited] = useState<string[]>([]);
  const [allUsers, setAllUsers] = useState<DocumentData[] | null>(null);

  useEffect(() => {
    if (notInvitedRef) {
      setList(notInvitedRef?.map((user) => ({ ...user, label: user.email })));
    }
  }, [notInvitedRef]);

  useEffect(() => {
    (async function () {
      const usersInfoCol = collection(firestore, "usersInfo");
      const q = query(usersInfoCol);
      const snapshot = await getDocs(q);
      console.log(snapshot);
      const results: DocumentData[] = snapshot.docs.map((snap) => ({
        ...snap.data(),
      }));
      setAllUsers(results);
    })();
  }, []);

  const styles = {
    root: {
      minWidth: 400,
      minHeight: 120,
      maxHeight: 300,
    },
  };

  function todo() {
    done("done", invited /* invitedRef.current */);
  }

  function addPeopleToInvited(selected: IItemRenderer) {
    if (Array.isArray(allUsers) && Array.isArray(list)) {
      const selectedIndex = list.indexOf(selected);
      const electData = allUsers.filter((user) => user.uid === selected.uid);
      setList((prevList) => {
        if (Array.isArray(prevList)) {
          prevList.splice(selectedIndex, 1);
        }
        return prevList;
      });
      setInvited((prev) => {
        if (!prev[0]) {
          return prev.concat([selected.uid, authUid]);
        }

        return prev.concat(selected.uid);
      });
      //invitedRef.current = invitedRef.current.concat(electData[0].id);
    }
  }

  const handleChange = (selectedUser: any) => {
    addPeopleToInvited(selectedUser[0]);
  };

  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

  console.log(list);

  return (
    <div style={styles.root}>
      <Select
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
      <DialogContent
        style={{
          position: "absolute",
          bottom: 0,
          padding: isDialogChanged ? 8 : 0,
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
