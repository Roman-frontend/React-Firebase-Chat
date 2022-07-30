import { memo, useCallback, useEffect, useState } from "react";
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
import IBadge from "../../../Models/IBadge";
import { IChatContext } from "../../../Context/Models/IChatContext";

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
  const [show, setShow] = useState(false);
  const [styles, setStyles] = useState<IStyles>({});
  const [modalAddChannelIsOpen, setModalAddChannelIsOpen] =
    useState<boolean>(false);
  const [modalAddDmIsOpen, setModalAddDmIsOpen] = useState<boolean>(false);
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

  // onSnapshot with async await
  // useEffect(() => {
  //   let unsubscribe: any;

  //   const allChannelsId = async () => {
  //     if (authId) {
  //       const userRef = doc(firestore, `usersInfo`, authId);
  //       const userSnap = await getDoc(userRef);
  //       const userChannels = userSnap.data()?.channels;
  //       console.log(userChannels)

  //       const channelsCol = collection(firestore, "channels");
  //       const q = query(
  //         channelsCol,
  //         where("members", "array-contains", `${authId}`)
  //       );

  //       onSnapshot(
  //         q,
  //         (snapshot) => {
  //           const results: DocumentData[] = [];
  //           snapshot.docs.forEach((snap) => {
  //             results.push({ ...snap.data() });
  //           });
  //           if (Array.isArray(results)) {
  //             setAllChannels(results);
  //           }
  //         },
  //         (error) => {
  //           console.log("error in snapshot... ", error);
  //         }
  //       );
  //     }
  //   };

  //   const getChatAndSubscribe = async () => {
  //     unsubscribe = await allChannelsId();
  //   };

  //   getChatAndSubscribe();

  //   return () => {
  //     unsubscribe?.();
  //   };
  // }, [authId]);

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

  useEffect(() => {
    function unsubscribe() {
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
          ? allChannels.find((c) => c.uid === activeChatId)
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
          updateDoc(chatRef, { badge: chatWithNewBadge });
        }
      }
    }

    window.onbeforeunload = function () {
      unsubscribe();
    };

    window.onunload = function () {
      unsubscribe();
    };
  }, [firestore, activeChannelId, activeDirectMessageId]);

  async function changeOnline(isOnline: boolean) {
    console.log(authId);
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
