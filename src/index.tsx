import React from "react";
import { createRoot } from "react-dom/client";
import { FirebaseAppProvider } from "reactfire";
import firebaseApp from "./common/firebaseApp";
import firebaseConfig from "./common/firebaseConfig";

import App from "./App";
import "./i18n";

const container = document.getElementById("root");
const root = createRoot(container!); // createRoot(container!) if you use TypeScript

const app = (
  <FirebaseAppProvider
    firebaseConfig={firebaseConfig}
    firebaseApp={firebaseApp}
  >
    <App />
  </FirebaseAppProvider>
);
root.render(app);
