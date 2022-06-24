import React from "react";
import { MemoryRouter } from "react-router-dom";
import { AppRoutes } from "../src/router/routes";
import { SnackbarProvider } from "notistack";
import { render } from "@testing-library/react";

export const renderWithRouter = (component, initialRoute = "/") => {
  return render(
    <SnackbarProvider>
      <MemoryRouter initialEntries={[initialRoute]}>
        <AppRoutes />
        {component}
      </MemoryRouter>
    </SnackbarProvider>
  );
};
