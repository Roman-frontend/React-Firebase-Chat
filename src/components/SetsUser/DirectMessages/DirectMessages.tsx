import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  addDoc,
  serverTimestamp,
  DocumentData,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useFirestore } from "reactfire";
// import { gql, useQuery, useMutation, useReactiveVar } from "@apollo/client";
import { useSnackbar } from "notistack";
import { useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
// import { AUTH } from "../../../GraphQLApp/queryes";
// import {
//   CREATE_DIRECT_MESSAGE,
//   GET_DIRECT_MESSAGES,
// } from "../../SetsUser/SetsUserGraphQL/queryes";
// import {
//   reactiveDirectMessages,
//   reactiveVarId,
// } from "../../../GraphQLApp/reactiveVars";
import { AddDirectMessage } from "../../Modals/AddDirectMessage/AddDirectMessage";
import { DirectMessage } from "./DirectMessage";
// import { wsSend } from "../../../WebSocket/soket";
import { nanoid } from "nanoid";
import { ChatContext } from "../../../Context/ChatContext";

interface IProps {
  isOpenLeftBar: boolean;
  isErrorInPopap: boolean;
  setIsErrorInPopap: React.Dispatch<React.SetStateAction<boolean>>;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
  },
}));

export function DirectMessages(props: IProps) {
  const { isOpenLeftBar, isErrorInPopap, setIsErrorInPopap } = props;
  const firestore = useFirestore();
  const auth = getAuth();
  const theme = useTheme();
  const { t } = useTranslation();
  // const { data: auth } = useQuery(AUTH);
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  // const { data: dDms } = useQuery(GET_DIRECT_MESSAGES);
  const { enqueueSnackbar } = useSnackbar();
  const { allDm, modalAddDmIsOpen, setModalAddDmIsOpen } =
    useContext(ChatContext);
  // const userId = useReactiveVar(reactiveVarId);

  // const [createDirectMessage] = useMutation(CREATE_DIRECT_MESSAGE, {
  //   update(cache, { data: { directMessages } }) {
  //     cache.modify({
  //       fields: {
  //         directMessages(existingDrMsg) {
  //           const newCommentRef = directMessages.create.record.map(
  //             (newDrMsg) => {
  //               return cache.writeFragment({
  //                 data: newDrMsg,
  //                 fragment: gql`
  //                   fragment NewDirectMessage on DirectMessage {
  //                     id
  //                     members
  //                   }
  //                 `,
  //               });
  //             }
  //           );
  //           return [...existingDrMsg, ...newCommentRef];
  //         },
  //       },
  //     });
  //   },
  //   onError(error) {
  //     console.log(`Помилка ${error}`);
  //     enqueueSnackbar("Direct Message created!", { variant: "error" });
  //   },
  //   onCompleted(data) {
  //     const storage = JSON.parse(sessionStorage.getItem("storageData"));
  //     const newDrMsgIds = data.directMessages.create.record.map(({ id }) => id);
  //     const toStorage = JSON.stringify({
  //       ...storage,
  //       directMessages: [...storage.directMessages, ...newDrMsgIds],
  //     });
  //     sessionStorage.setItem("storageData", toStorage);
  //     reactiveDirectMessages([...reactiveDirectMessages(), ...newDrMsgIds]);
  //     enqueueSnackbar("Direct Message created!", { variant: "success" });
  //     const dms = data.directMessages.create.record;
  //     dms.forEach((dm) => {
  //       const invitedId = dm.members.find((memberId) => {
  //         return memberId !== userId;
  //       });
  //       console.log(invitedId);
  //       wsSend({ meta: "addedDm", userId, dmId: dm.id, invitedId });
  //     });
  //   },
  // });

  async function doneInvite(
    action: string,
    invited: string[] = []
  ): Promise<void> {
    if (action === "done" && invited && invited[0] && auth.currentUser?.uid) {
      console.log("done: ", invited);
      const dmCol = collection(firestore, "directMessages");

      invited.forEach(async (invitedUid) => {
        const dmUid = nanoid();
        await addDoc(dmCol, {
          members: [invitedUid, auth.currentUser?.uid],
          uid: dmUid,
          createdAt: serverTimestamp(),
        });

        const docRef = doc(firestore, `usersInfo`, invitedUid);
        const docSnap = await getDoc(docRef);
        const docSnapData: DocumentData | undefined = docSnap.data();

        if (docSnapData) {
          await setDoc(docRef, {
            ...docSnap.data(),
            directMessages: docSnapData.directMessages
              ? [...docSnapData.directMessages, dmUid]
              : [dmUid],
          });
        }

        if (auth.currentUser?.uid) {
          const authDocRef = doc(firestore, `usersInfo`, auth.currentUser?.uid);
          const authDocSnap = await getDoc(docRef);
          const authDocSnapData: DocumentData | undefined = docSnap.data();

          if (authDocSnapData) {
            await setDoc(authDocRef, {
              ...authDocSnap.data(),
              directMessages: authDocSnapData.directMessages
                ? [...authDocSnapData.directMessages, dmUid]
                : [dmUid],
            });
          }
        }
      });

      enqueueSnackbar(`Direct message created`, { variant: "success" });
      setModalAddDmIsOpen(false);
    } else {
      setIsErrorInPopap(true);
    }
  }

  const createDMList = () => {
    if (allDm[0]) {
      // console.log(dDms?.directMessages);
      return (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List>
            {allDm.map((dm) => (
              <React.Fragment key={dm.uid}>
                <DirectMessage drMsg={dm} isOpenLeftBar={isOpenLeftBar} />
              </React.Fragment>
            ))}
          </List>
        </Collapse>
      );
    }
    return null;
  };

  return (
    <>
      <div>
        <List component="nav" className={classes.root}>
          {isOpenLeftBar ? (
            <ListItem
              sx={{ paddingLeft: 0 }}
              key={nanoid()}
              button
              onClick={() => setOpen(!open)}
            >
              <ListItemIcon style={{ justifyContent: "center" }}>
                <EmojiPeopleIcon color="action" />
              </ListItemIcon>
              <ListItemText
                style={{ textAlign: "center" }}
                primary={t("description.dirrectMessageTitle")}
              />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
          ) : (
            <ListItem
              style={{ padding: 0, margin: 0, justifyContent: "center" }}
              key={nanoid()}
              button
              onClick={() => setOpen(!open)}
            >
              <ListItemIcon style={{ padding: "0", justifyContent: "center" }}>
                <EmojiPeopleIcon color="action" />
              </ListItemIcon>
            </ListItem>
          )}
          {createDMList()}
        </List>
      </div>
      <Button
        size="small"
        sx={{
          width: "100%",
          padding: 0,
          "&:hover": { color: theme.palette.primary.light },
        }}
        color="warning"
        onClick={() => setModalAddDmIsOpen(true)}
      >
        {isOpenLeftBar ? `+ ${t("description.addDm")}` : "+"}
      </Button>
      <AddDirectMessage
        done={doneInvite}
        modalAddDmIsOpen={modalAddDmIsOpen}
        setModalAddDmIsOpen={setModalAddDmIsOpen}
        isErrorInPopap={isErrorInPopap}
      />
    </>
  );
}
