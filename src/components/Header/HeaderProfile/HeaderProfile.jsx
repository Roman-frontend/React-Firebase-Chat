import React, { useContext } from "react";
import { useAuth } from "reactfire";
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

const HeaderProfile = () => {
  const { enqueueSnackbar } = useSnackbar();
  const authApp = useAuth();
  const auth = getAuth();
  const navigate = useNavigate();
  const { setTheme } = useContext(CustomThemeContext);

  function clearSideEffects() {
    clearFirestoreCache();
    setTheme("light");
  }

  async function handleLogout() {
    await signOut(authApp);
    clearSideEffects();
    navigate("/signIn");
  }

  async function handleRemoveAccount() {
    const isConfirmed = prompt("Enter your name to confirm", "");
    if (isConfirmed === auth.currentUser.displayName) {
      await auth.currentUser.delete();
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
          <Avatar alt="Remy Sharp" src={imageProfile} style={{ size: "5px" }} />
        </ListItemIcon>
        <ListItemText primary={authApp.currentUser.displayName} />
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
        <ListItemText primary="Logout" />
      </ListItem>
      <ListItem button onClick={handleRemoveAccount}>
        <ListItemIcon>
          <PersonRemoveIcon />
        </ListItemIcon>
        <ListItemText primary="Remove account" />
      </ListItem>
    </List>
  );
};

export default React.memo(HeaderProfile);
