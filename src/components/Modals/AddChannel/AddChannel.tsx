import React, { useState, useEffect, useRef } from "react";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  getDoc,
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
import "./add-channel.sass";

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
      const badge = invitedContainAuthUid.map((uid) => {
        if (uid === auth?.currentUser?.uid) {
          return { uid, badgeNewMessages: 0, isOpen: true };
        }
        return { uid, badgeNewMessages: 0, isOpen: false };
      });
      const channelsCol = collection(firestore, "channels");
      const newChannel = await addDoc(channelsCol, {
        name: form.name,
        admin: auth.currentUser.uid,
        description: form.discription,
        members: invitedContainAuthUid,
        badge,
        isPrivate: form.isPrivate,
        createdAt: serverTimestamp(),
      });

      await updateDoc(newChannel, {
        uid: newChannel.id,
      });

      invitedContainAuthUid.forEach(async (invitedUid) => {
        const docRef = doc(firebaseStore, `usersInfo`, invitedUid);
        const docSnap = await getDoc(docRef);
        const docSnapData: DocumentData | undefined = docSnap.data();

        if (docSnapData) {
          const userChannels = docSnapData.channels
            ? [...docSnapData.channels, newChannel.id]
            : [newChannel.id];

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
        className="add-channel_main"
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: theme.palette.primary.main,
          },
          // "& .MuiDialog-paperScrollBody": {
          //   maxWidth: "-webkit-fill-available !important",
          //   margin: 0,
          // },
        }}
      >
        <DialogTitle>Create a channel</DialogTitle>
        <DialogContent style={{ padding: "0px 24px 46px 24px" }}>
          <DialogContentText color="inherit">
            Channels are where your team communicates. They’re best when
            organized around a topic — #marketing, for example.
          </DialogContentText>

          <TextField
            variant="standard"
            label="Name"
            color="secondary"
            sx={{ display: "flex" }}
            name="name"
            required={true}
            helperText={isErrorInPopap ? "required" : ""}
            FormHelperTextProps={{ classes: helperTestClasses }}
            value={form.name}
            onChange={changeHandler}
          />

          <TextField
            variant="standard"
            label="Discription"
            color="secondary"
            sx={{ display: "flex", margin: "0px 0px 16px 0px" }}
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

          <div
            className="set-channel-forms"
            style={{ textAlign: "center" }}
            id="add-private-channel"
          >
            <label className="set-channel-forms__label">Private</label>
            <Checkbox
              color="error"
              checked={isPrivate}
              onClick={changeIsPrivate}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
