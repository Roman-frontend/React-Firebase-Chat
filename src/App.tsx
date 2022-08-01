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
import "./css/style.sass";

export default function App() {
  const app = useFirebaseApp();
  const firestoreInstance = getFirestore(app);
  const auth = getAuth(app);
  const database = getDatabase(app);

  return (
    <FirestoreProvider sdk={firestoreInstance}>
      <AuthProvider sdk={auth}>
        <DatabaseProvider sdk={database}>
          <Router>
            <SnackbarProvider maxSnack={3}>
              <AppRoutes />
            </SnackbarProvider>
          </Router>
        </DatabaseProvider>
      </AuthProvider>
    </FirestoreProvider>
  );
}
