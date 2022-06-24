import React from "react";
import { Box } from "@mui/system";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";

export const Loader = () => {
  const stylesAppLoader = { position: "fixed", left: "50%", top: "50%" };

  return (
    <Box sx={stylesAppLoader} data-testid="circular-loader">
      <CircularProgress color="secondary" />
    </Box>
  );
};

export function AuthLoader() {
  return (
    <Box>
      <LinearProgress />
      <LinearProgress color="secondary" />
    </Box>
  );
}
