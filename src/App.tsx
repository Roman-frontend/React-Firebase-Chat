import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./router/routes";
import {
  FirestoreProvider,
  AuthProvider,
  DatabaseProvider,
  useFirebaseApp,
} from "reactfire";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { SnackbarProvider } from "notistack";
// import { ApolloProvider } from "@apollo/client";
// import { client } from "./GraphQLApp/apolloClient";
import { IAppContext } from "./Context/Models/IAppContext";
import IBadge from "./Models/IBadge";
import { AppContext } from "./Context/AppContext";
import "./css/style.sass";

export default function App() {
  const app = useFirebaseApp();
  const firestoreInstance = getFirestore(app);
  const auth = getAuth(app);
  const database = getDatabase(app);
  const [activeChannelId, setActiveChannelId] = useState<null | string>(null);
  const [activeDirectMessageId, setActiveDirectMessageId] = useState<
    null | string
  >(null);
  const [newMsgsBadge, setNewMsgsBadge] = useState<[] | IBadge[]>([]);
  const [modalAddPeopleIsOpen, setModalAddPeopleIsOpen] = useState(false);

  const appContextValue: IAppContext = {
    activeChannelId,
    setActiveChannelId,
    activeDirectMessageId,
    setActiveDirectMessageId,
    newMsgsBadge,
    setNewMsgsBadge,
    modalAddPeopleIsOpen,
    setModalAddPeopleIsOpen,
  };

  return (
    <FirestoreProvider sdk={firestoreInstance}>
      <AuthProvider sdk={auth}>
        <DatabaseProvider sdk={database}>
          <Router>
            {/* <ApolloProvider client={client}> */}
            <SnackbarProvider maxSnack={3}>
              <AppContext.Provider value={appContextValue}>
                <AppRoutes />
              </AppContext.Provider>
            </SnackbarProvider>
            {/* </ApolloProvider> */}
          </Router>
        </DatabaseProvider>
      </AuthProvider>
    </FirestoreProvider>
  );
}
