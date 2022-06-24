import { createTheme } from "@mui/material/styles";
import { red, yellow, grey, green, brown } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    background: {
      paper: yellow[100], //brown[800],
    },
    mode: "dark", //'light',
    primary: {
      light: "#737373", //'#272738',
      main: "#272738", //grey[900],
      dark: "#090912", //'#272738', //yellow[100],
      contrastText: yellow[100],
    },
    secondary: {
      light: "#090912",
      dark: "#ffffff",
      main: yellow[100],
      contrastText: green[100],
    },
    error: {
      main: red[500],
      contrastText: "#ffffff",
    },
    input: {
      main: "#ffffff", //lightGreen[400],
      contrastText: "#ffffff",
    },
    info: {
      light: "#35281D",
      dark: "#151B16",
      main: "#855B34",
    },
    leftBarItem: {
      light: "#ffffff",
      main: "#ffffff",
      contrastText: "#000000",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#FFFFFF",
      select: "#090912",
      disabled: grey[100],
    },
    //#37374f
    action: {
      active: yellow[100],
      hover: "#131329",
      hoverOpacity: 0.5,
      selected: yellow[100],
    },
    tonalOffset: 0.1,
  },
  shape: {
    borderRadius: 7,
  },
});

export default theme;
