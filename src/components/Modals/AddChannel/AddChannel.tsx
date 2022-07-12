import React, { useState, useEffect, useRef } from "react";
import { nanoid } from "nanoid";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  addDoc,
  updateDoc,
  serverTimestamp,
  DocumentData,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useFirestore } from "reactfire";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { useTheme } from "@mui/material/styles";
import firebaseStore from "../../../common/firebaseStore";
import { SelectPeople } from "../SelectPeople/SelectPeople";

interface IProps {
  setModalAddChannelIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalAddChannelIsOpen: boolean;
  isErrorInPopap: boolean;
  setIsErrorInPopap: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IForm {
  name: string;
  discription: string;
  isPrivate: boolean;
}

const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    minWidth: "520px",
    minHeight: "380px",
    margin: 0,
  },
  input: {
    height: "30px",
    width: "220px",
  },
}));

const helperTextStyles = makeStyles((theme) => ({
  root: {
    margin: 4,
    color: "red",
  },
}));

export const AddChannel = (props: IProps) => {
  const {
    setModalAddChannelIsOpen,
    modalAddChannelIsOpen,
    isErrorInPopap,
    setIsErrorInPopap,
  } = props;
  const firestore = useFirestore();
  const auth = getAuth();
  const popapClasses = useStyles();
  const helperTestClasses = helperTextStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [isPrivate, setIsPrivate] = useState(false);
  const notInvitedRef = useRef<DocumentData[]>();
  const [form, setForm] = useState<IForm>({
    name: "",
    discription: "",
    isPrivate: false,
  });
  const theme = useTheme();

  useEffect(() => {
    // (async function () {
    //   const usersInfoCol = collection(firestore, "usersInfo");
    //   const q = query(usersInfoCol);
    //   const snapshot = await getDocs(q);
    //   const results = [];
    //   snapshot.docs.forEach((snap) => {
    //     if (snap.data().uid !== auth.currentUser.uid) {
    //       results.push({ ...snap.data() });
    //     }
    //   });
    //   notInvitedRef.current = results;
    //   console.log(results);
    // })();

    function unsubscribe() {
      if (!modalAddChannelIsOpen) {
        const usersInfoCol = collection(firestore, "usersInfo");
        const q = query(usersInfoCol);

        onSnapshot(
          q,
          (snapshot) => {
            const results: DocumentData[] = [];
            snapshot.docs.forEach((snap) => {
              if (snap.data().uid !== auth?.currentUser?.uid) {
                const snapData: DocumentData = snap.data();
                results.push({ ...snapData });
              }
            });
            notInvitedRef.current = results;
          },
          (error) => {
            console.log("error in snapshot... ", error);
          }
        );
      }
    }

    return unsubscribe();
  }, [firestore, modalAddChannelIsOpen, auth]);

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const doneCreate = async (action: string, invited: string[] = []) => {
    if (
      action === "done" &&
      form.name.trim() !== "" &&
      auth?.currentUser?.uid
    ) {
      const invitedContainAuthUid = invited.concat(auth.currentUser.uid);
      const channelsCol = collection(firestore, "channels");

      console.log(invitedContainAuthUid);

      const newChannel = await addDoc(channelsCol, {
        name: form.name,
        admin: auth.currentUser.uid,
        description: form.discription,
        members: invitedContainAuthUid,
        isPrivate: form.isPrivate,
        createdAt: serverTimestamp(),
      });

      await updateDoc(newChannel, {
        uid: newChannel.id,
      });

      console.log(newChannel.id);

      invitedContainAuthUid.forEach(async (invitedUid) => {
        const docRef = doc(firebaseStore, `usersInfo`, invitedUid);
        const docSnap = await getDoc(docRef);
        const docSnapData: DocumentData | undefined = docSnap.data();

        if (docSnapData) {
          const userChannels = docSnapData.channels
            ? [...docSnapData.channels, newChannel.id]
            : [newChannel.id];
          console.log(docSnapData);

          await setDoc(docRef, {
            ...docSnap.data(),
            channels: userChannels,
          });
        }
      });

      setIsErrorInPopap(false);
      setModalAddChannelIsOpen(false);
      enqueueSnackbar(`Channel created`, { variant: "success" });
    } else {
      setIsErrorInPopap(true);
    }
  };

  const closePopap = () => {
    setIsErrorInPopap(false);
    setModalAddChannelIsOpen(false);
  };

  function changeIsPrivate() {
    setForm((prev) => {
      return { ...prev, isPrivate: !isPrivate };
    });
    setIsPrivate(!isPrivate);
  }

  return (
    <div>
      <Dialog
        open={modalAddChannelIsOpen}
        onClose={() => setModalAddChannelIsOpen(false)}
        scroll="body"
        classes={{ paper: popapClasses.dialogPaper }}
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: theme.palette.primary.main,
          },
        }}
      >
        <DialogTitle>Create a channel</DialogTitle>
        <DialogContent style={{ padding: "0px 24px 46px 24px" }}>
          <DialogContentText color="inherit">
            Channels are where your team communicates. They’re best when
            organized around a topic — #marketing, for example.
          </DialogContentText>

          <div className="set-channel-forms" id="add-private-channel">
            <label className="set-channel-forms__label">Private</label>
            <Checkbox
              color="warning"
              checked={isPrivate}
              onClick={changeIsPrivate}
            />
          </div>
          <TextField
            variant="standard"
            label="Name"
            color="secondary"
            classes={{ root: popapClasses.input }}
            sx={{ color: "white" }}
            name="name"
            required={true}
            helperText={isErrorInPopap ? "required" : ""}
            FormHelperTextProps={{ classes: helperTestClasses }}
            value={form.name}
            onChange={changeHandler}
          />

          <TextField
            variant="standard"
            color="secondary"
            label="Discription"
            sx={{ display: "flex", margin: "27px 0px 20px" }}
            name="discription"
            value={form.discription}
            onChange={changeHandler}
          />
          <SelectPeople
            isDialogChanged={true}
            closePopap={closePopap}
            notInvitedRef={notInvitedRef.current}
            isErrorInPopap={isErrorInPopap}
            done={doneCreate}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
