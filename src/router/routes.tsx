import React, { ReactElement } from "react";
import { Routes, Route, RouteObject } from "react-router-dom";
import { RequireAuth } from "../components/Helpers/RequireAuth.jsx";
import { BackgroundAuth } from "../pages/public/BackgroundAuth.jsx";
import { Chat } from "../pages/private/Chat/Chat";
// import MainVideoCall from "../pages/private/MainVideoRoom/MainVideoCall.jsx";
// import Room from "../pages/private/Room/index.js";

export const routes: RouteObject[] = [
  // {
  //   path: "/",
  //   element: <BackgroundAuth />,
  // },
  {
    path: "/signIn",
    element: <BackgroundAuth />,
  },
  {
    path: "/signUp",
    element: <BackgroundAuth />,
  },
  {
    path: "/chat",
    element: <Chat />,
  },
  // {
  //   path: "/rooms",
  //   element: <MainVideoCall />,
  // },
  // {
  //   path: "/room/:id",
  //   element: <Room />,
  // },
  {
    path: "/",
    element: <RequireAuth redirectTo="/chat" children={<BackgroundAuth />} />,
  },
];

const createRoutes = () => {
  // console.log("createRoutes... ");
  return routes.map((route: RouteObject) => {
    return <Route path={route.path} element={route.element} key={route.path} />;
  });
};

export function AppRoutes(): ReactElement {
  // console.log("AppRoutes");
  return <Routes>{createRoutes()}</Routes>;
}
