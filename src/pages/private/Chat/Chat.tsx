import { memo, useCallback, useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  DocumentData,
  getDocs,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useFirestore } from "reactfire";
// import { useQuery, useReactiveVar } from "@apollo/client";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
// import {
//   reactiveOnlineMembers,
//   reactiveVarPrevAuth,
// } from "../../../GraphQLApp/reactiveVars";
// import { GET_USERS } from "../../../GraphQLApp/queryes";
import Header from "../../../components/Header/Header";
import Conversation from "../../../components/Conversation/Conversation";
import SetsUser from "../../../components/SetsUser/SetsUser";
// import {
//   registerEnterPage,
//   registerOnlineUser,
//   registerUnloadPage,
//   registerOfflineUser,
// } from "../../../components/Helpers/registerUnload";
// import {
//   CHANNELS,
//   GET_DIRECT_MESSAGES,
// } from "../../../components/SetsUser/SetsUserGraphQL/queryes";
import { Loader } from "../../../components/Helpers/Loader";
// import { activeChatId } from "../../../GraphQLApp/reactiveVars";
import setStylesChat from "./styles";
import IStyles from "./Models/IStyles";
import { CustomThemeContext } from "../../../Context/AppContext";
import { ICustomThemeContext } from "../../../Context/Models/ICustomThemeContext";
import getTheme from "../../../components/Theme/base";
import { ThemeProvider } from "@mui/material/styles";
import { ChatContext } from "../../../Context/ChatContext";
import IBadge from "../../../Models/IBadge";
import { IChatContext } from "../../../Context/Models/IChatContext";

export const Chat = memo(() => {
  const currentTheme = localStorage.getItem("appTheme") || "light";
  const [themeName, _setThemeName] = useState(currentTheme);
  // const usersOnline = useReactiveVar(reactiveOnlineMembers);
  // const activeChat = useReactiveVar(activeChatId);
  // const activeChannelId = useReactiveVar(activeChatId).activeChannelId;
  // const activeDirectMessageId =
  //   useReactiveVar(activeChatId).activeDirectMessageId;
  // const { loading: lUsers } = useQuery(GET_USERS);
  // const { loading: lChannels, data: dChannels } = useQuery(CHANNELS);
  // const { loading: lDms, data: dDms } = useQuery(GET_DIRECT_MESSAGES);
  const [newMsgsBadge, setNewMsgsBadge] = useState<[] | IBadge[]>([]);
  const [activeChannelId, setActiveChannelId] = useState<null | string>(null);
  const [activeDirectMessageId, setActiveDirectMessageId] = useState<
    null | string
  >(null);
  const [allUsers, setAllUsers] = useState<DocumentData[]>([]);
  const [allChannels, setAllChannels] = useState<DocumentData[]>([]);
  const [allDm, setAllDm] = useState<DocumentData[]>([]);
  const [modalAddPeopleIsOpen, setModalAddPeopleIsOpen] = useState(false);
  const [isErrorInPopap, setIsErrorInPopap] = useState(false);
  const [isOpenLeftBar, setIsOpenLeftBar] = useState(true);
  const [show, setShow] = useState(false);
  const [styles, setStyles] = useState<IStyles>({});
  const [modalAddChannelIsOpen, setModalAddChannelIsOpen] =
    useState<boolean>(false);
  const [modalAddDmIsOpen, setModalAddDmIsOpen] = useState<boolean>(false);
  const theme = getTheme(themeName);
  const firestore = useFirestore();
  const auth = getAuth();

  const setThemeName = useCallback((name: string): void => {
    localStorage.setItem("appTheme", name);
    _setThemeName(name);
  }, []);

  const contextValue: ICustomThemeContext = {
    currentTheme: themeName,
    setTheme: setThemeName,
  };

  useEffect(() => {
    setStyles(setStylesChat(theme));
  }, [theme]);

  useEffect(() => {
    (async function () {
      const usersInfoCol = collection(firestore, "usersInfo");
      const q = query(usersInfoCol);
      const snapshot = await getDocs(q);
      console.log(snapshot);
      const results: DocumentData[] = snapshot.docs.map(
        (snap: DocumentData) => ({
          ...snap.data(),
        })
      );
      setAllUsers(results);
    })();
  }, []);

  useEffect(() => {
    function unsubscribe() {
      console.log(modalAddChannelIsOpen);
      if (!modalAddChannelIsOpen) {
        const channelsCol = collection(firestore, "channels");
        const q = query(channelsCol);

        onSnapshot(
          q,
          (snapshot) => {
            const results: DocumentData[] = [];
            snapshot.docs.forEach((snap) => {
              results.push({ ...snap.data() });
            });
            if (Array.isArray(results)) {
              setAllChannels(results);
            }
          },
          (error) => {
            console.log("error in snapshot... ", error);
          }
        );
      }
    }

    return unsubscribe();
  }, [firestore, modalAddChannelIsOpen, auth]);

  useEffect(() => {
    function unsubscribe() {
      if (!modalAddDmIsOpen) {
        const dMCol = collection(firestore, "directMessages");
        const q = query(dMCol);

        onSnapshot(
          q,
          (snapshot) => {
            const results: DocumentData[] = [];
            snapshot.docs.forEach((snap) => {
              results.push({ ...snap.data() });
            });
            if (Array.isArray(results)) {
              setAllDm(results);
            }
          },
          (error) => {
            console.log("error in snapshot... ", error);
          }
        );
      }
    }

    return unsubscribe();
  }, [firestore, modalAddDmIsOpen, auth]);

  useEffect(() => {
    showConversation();
  }, [activeChannelId, activeDirectMessageId]);

  useEffect(() => {
    if ((allChannels || allDm) && (activeChannelId || activeDirectMessageId)) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [activeChannelId, activeDirectMessageId, allChannels, allDm]);

  // useEffect(() => {
  //   const storage = sessionStorage.getItem("storageData");
  //   if (storage) {
  //     const parsedStorage = JSON.parse(storage);
  //     reactiveVarPrevAuth(parsedStorage);
  //   }
  //   registerOnlineUser(usersOnline);
  //   registerEnterPage();
  //   return () => registerUnloadPage("Leaving page", registerOfflineUser);
  // }, []);

  const showConversation = useCallback(() => {
    if (show) {
      return (
        <Conversation
          isErrorInPopap={isErrorInPopap}
          setIsErrorInPopap={setIsErrorInPopap}
        />
      );
    }

    return null;
  }, [show]);

  if (!allUsers || !auth) {
    return <Loader />;
  }

  const chatContextValue: IChatContext = {
    authId: auth?.currentUser?.uid || null,
    allChannels,
    setAllChannels,
    allDm,
    setAllDm,
    allUsers,
    setAllUsers,
    activeChannelId,
    setActiveChannelId,
    activeDirectMessageId,
    setActiveDirectMessageId,
    newMsgsBadge,
    setNewMsgsBadge,
    modalAddPeopleIsOpen,
    setModalAddPeopleIsOpen,
    modalAddChannelIsOpen,
    setModalAddChannelIsOpen,
    modalAddDmIsOpen,
    setModalAddDmIsOpen,
  };

  return (
    <ChatContext.Provider value={chatContextValue}>
      <CustomThemeContext.Provider value={contextValue}>
        <ThemeProvider theme={theme}>
          <Box data-testid="chat" style={styles.root}>
            <Grid container spacing={2} style={styles.workSpace}>
              <CssBaseline />
              <Grid item xs={12} style={styles.header}>
                <Header
                  isOpenLeftBar={isOpenLeftBar}
                  setIsOpenLeftBar={setIsOpenLeftBar}
                />
              </Grid>
              <SetsUser
                isErrorInPopap={isErrorInPopap}
                setIsErrorInPopap={setIsErrorInPopap}
                isOpenLeftBar={isOpenLeftBar}
                setIsOpenLeftBar={setIsOpenLeftBar}
              />
              <Box component="main" sx={styles.conversation}>
                <main>{showConversation()}</main>
              </Box>
            </Grid>
          </Box>
        </ThemeProvider>
      </CustomThemeContext.Provider>
    </ChatContext.Provider>
  );
});
