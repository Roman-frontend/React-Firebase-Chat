import AppRouter from "../../router/AppRouter";
import { MemoryRouter } from "react-router-dom";

export const renderTestApp = (component, options) => {
  return (
    <MemoryRouter initialEntries={[options?.route]}>
      <AppRouter />
      {component}
    </MemoryRouter>
  );
};
