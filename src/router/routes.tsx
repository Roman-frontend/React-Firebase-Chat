import React, { ReactElement } from "react";
import { Routes, Route, RouteObject } from "react-router-dom";
import { RequireAuth } from "../components/Helpers/RequireAuth.jsx";
import { BackgroundAuth } from "../pages/public/BackgroundAuth.jsx";
import { Chat } from "../pages/private/Chat/Chat";

export const routes: RouteObject[] = [
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
  {
    path: "/",
    element: <RequireAuth redirectTo="/chat" children={<BackgroundAuth />} />,
  },
];

const createRoutes = () => {
  return routes.map((route: RouteObject) => {
    return <Route path={route.path} element={route.element} key={route.path} />;
  });
};

export function AppRoutes(): ReactElement {
  return <Routes>{createRoutes()}</Routes>;
}
