import { memo, useCallback, useEffect, useState, useLayoutEffect } from "react";
import {
  collection,
  onSnapshot,
  query,
  DocumentData,
  doc,
  where,
  updateDoc,
  DocumentReference,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useFirestore } from "reactfire";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Header from "../../../components/Header/Header";
import Conversation from "../../../components/Conversation/Conversation";
import SetsUser from "../../../components/SetsUser/SetsUser";
import { Loader } from "../../../components/Helpers/Loader";
import setStylesChat from "./styles";
import IStyles from "./Models/IStyles";
import { CustomThemeContext } from "../../../Context/AppContext";
import { ICustomThemeContext } from "../../../Context/Models/ICustomThemeContext";
import getTheme from "../../../components/Theme/base";
import { ThemeProvider } from "@mui/material/styles";
import { ChatContext } from "../../../Context/ChatContext";
import { IChatContext } from "../../../Context/Models/IChatContext";
import "./chat.sass";

export const Chat = memo(() => {
  const currentTheme = localStorage.getItem("appTheme") || "light";
  const [themeName, _setThemeName] = useState(currentTheme);
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
  const [styles, setStyles] = useState<IStyles>({});
  const [modalAddChannelIsOpen, setModalAddChannelIsOpen] =
    useState<boolean>(false);
  const [modalAddDmIsOpen, setModalAddDmIsOpen] = useState<boolean>(false);
  const [conversation, setConversation] = useState<null | JSX.Element>(null);
  const theme = getTheme(themeName);
  const firestore = useFirestore();
  const [authId, setAuthId] = useState<string | null>(null);
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => user && setAuthId(user.uid));
  }, [auth]);

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
    async function getUsers() {
      const usersInfoCol = collection(firestore, "usersInfo");
      const q = query(usersInfoCol);
      onSnapshot(
        q,
        (snapshot) => {
          const results: DocumentData[] = [];
          snapshot.docs.forEach((snap) => {
            results.push({ ...snap.data() });
          });
          if (Array.isArray(results)) {
            setAllUsers(results);
          }
        },
        (error) => {
          console.log("error in snapshot... ", error);
        }
      );
    }

    getUsers();
  }, []);

  useEffect(() => {
    function unsubscribe() {
      if (!modalAddChannelIsOpen) {
        const channelsCol = collection(firestore, "channels");
        const q = query(
          channelsCol,
          where("members", "array-contains", authId)
        );

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
  }, [firestore, modalAddChannelIsOpen, authId]);

  useEffect(() => {
    function unsubscribe() {
      if (!modalAddDmIsOpen) {
        const dMCol = collection(firestore, "directMessages");
        const q = query(dMCol, where("members", "array-contains", authId));

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
  }, [firestore, modalAddDmIsOpen, authId]);

  useLayoutEffect(() => {
    function updateSize() {
      if (!isOpenLeftBar || window.innerWidth > 609) {
        showConversation(true);
      } else {
        showConversation(false);
      }
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, [isOpenLeftBar, window.innerWidth]);

  useEffect(() => {
    if ((allChannels || allDm) && (activeChannelId || activeDirectMessageId)) {
      showConversation(true);
    } else {
      showConversation(false);
    }
  }, [activeChannelId, activeDirectMessageId, allChannels, allDm]);

  async function offlineInDM() {
    const activeChatId = activeChannelId
      ? activeChannelId
      : activeDirectMessageId;
    const activeChatName = activeChannelId ? "channels" : "directMessages";
    if (activeChatId && activeChatName) {
      const chatRef: DocumentReference<DocumentData> = doc(
        firestore,
        activeChatName,
        activeChatId
      );

      const chat = activeChannelId
        ? allChannels.find((c) => c.uid === activeChannelId)
        : allDm.find((dm) => dm.uid === activeDirectMessageId);
      let isUpdateDoc;
      const chatWithNewBadge = chat?.badge.map(
        (
          b: { uid: string; isOpen: boolean; badgeNewMessages: number },
          index: number
        ) => {
          if (b.uid === authId && b.isOpen) {
            isUpdateDoc = index;
            return { ...b, isOpen: false };
          }

          return b;
        }
      );
      if (isUpdateDoc !== undefined) {
        await updateDoc(chatRef, { badge: chatWithNewBadge });
      }
    }
  }

  async function changeOnline(isOnline: boolean) {
    if (authId) {
      const userRef: DocumentReference<DocumentData> = doc(
        firestore,
        "usersInfo",
        authId
      );
      await updateDoc(userRef, { online: isOnline });
    }
  }

  useEffect(() => {
    changeOnline(true);

    function markAsOffline() {
      changeOnline(false);
    }

    return () => markAsOffline();
  }, [authId]);

  const showConversation = useCallback(
    (show: boolean) => {
      if (show) {
        return setConversation(
          <Conversation
            isErrorInPopap={isErrorInPopap}
            setIsErrorInPopap={setIsErrorInPopap}
          />
        );
      }

      return setConversation(null);
    },
    [isOpenLeftBar, window.innerWidth]
  );

  if (!allUsers || !authId) {
    return <Loader />;
  }

  const chatContextValue: IChatContext = {
    authId,
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
    modalAddPeopleIsOpen,
    setModalAddPeopleIsOpen,
    modalAddChannelIsOpen,
    setModalAddChannelIsOpen,
    modalAddDmIsOpen,
    setModalAddDmIsOpen,
  };

  window.onbeforeunload = function () {
    console.log("onbeforeunload");
    offlineInDM();
    changeOnline(false);
  };

  return (
    <ChatContext.Provider value={chatContextValue}>
      <CustomThemeContext.Provider value={contextValue}>
        <ThemeProvider theme={theme}>
          <Box data-testid="chat" style={styles.root}>
            <Grid
              container
              spacing={2}
              className="workSpace"
              style={styles.workSpace}
            >
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
                <main>{conversation}</main>
              </Box>
            </Grid>
          </Box>
        </ThemeProvider>
      </CustomThemeContext.Provider>
    </ChatContext.Provider>
  );
});
