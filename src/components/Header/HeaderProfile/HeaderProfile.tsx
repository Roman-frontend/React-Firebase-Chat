import React, { useContext } from "react";
import {
  DocumentReference,
  DocumentData,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { useTranslation } from "react-i18next";
import { useAuth, useFirestore } from "reactfire";
import { getAuth, signOut } from "firebase/auth";
import { useSnackbar } from "notistack";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
} from "@mui/material";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { CustomThemeContext } from "../../../Context/AppContext";
import imageProfile from "../../../images/User-Icon.png";
import { useNavigate } from "react-router-dom";
import clearFirestoreCache from "../../../common/clearFirestoreCache";
import { ChatContext } from "../../../Context/ChatContext";

const HeaderProfile = () => {
  const { enqueueSnackbar } = useSnackbar();
  const authApp = useAuth();
  const auth = getAuth();
  const firestore = useFirestore();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setTheme } = useContext(CustomThemeContext);
  const { authId } = useContext(ChatContext);

  function clearSideEffects() {
    clearFirestoreCache();
    if (setTheme) {
      setTheme("light");
    }
  }

  async function handleLogout() {
    await signOut(authApp);
    clearSideEffects();
    navigate("/signIn");
  }

  async function handleRemoveAccount() {
    const isConfirmed = prompt(
      `Please enter: ${auth?.currentUser?.displayName} `,
      ""
    );
    if (isConfirmed === auth?.currentUser?.displayName && authId) {
      await auth?.currentUser?.delete();
      const userRef: DocumentReference<DocumentData> = doc(
        firestore,
        `usersInfo`,
        authId
      );

      await deleteDoc(userRef);
      clearSideEffects();
      enqueueSnackbar(`Account removed`, { variant: "success" });
      navigate("/signIn");
    } else {
      enqueueSnackbar(`Account isn't removed`, { variant: "info" });
    }
  }

  return (
    <List>
      <ListItem button>
        <ListItemIcon>
          <Avatar
            alt="Remy Sharp"
            src={imageProfile}
            style={{ height: 40, width: 40 }}
          />
        </ListItemIcon>
        <ListItemText primary={authApp?.currentUser?.displayName} />
      </ListItem>
      {/* <ListItem button onClick={() => navigate(`/video`)}>
        <ListItemIcon>
          <MeetingRoomIcon />
        </ListItemIcon>
        <ListItemText primary="Enter to call-rooms" />
      </ListItem> */}
      <ListItem data-testid="logout-button" button onClick={handleLogout}>
        <ListItemIcon>
          <MeetingRoomIcon />
        </ListItemIcon>
        <ListItemText primary={t("description.logout")} />
      </ListItem>
      <ListItem button onClick={handleRemoveAccount}>
        <ListItemIcon>
          <PersonRemoveIcon />
        </ListItemIcon>
        <ListItemText primary={t("description.removeAccount")} />
      </ListItem>
    </List>
  );
};

export default React.memo(HeaderProfile);
