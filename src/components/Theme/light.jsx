import { createTheme } from "@mui/material/styles";
import { red, yellow, grey, green, brown, blue } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    background: {
      paper: "#f5f5f5",
      default: "#ffffff",
    },
    mode: "light",
    primary: {
      light: "#ffffff",
      main: "#f5f5f5",
      dark: "#c9c9c9", //#636363
      contrastText: "#0000b5",
    },
    secondary: {
      main: "#000000", //lightGreen[400],
      dark: "#ffffff",
      contrastText: "#FFFFFF",
    },
    input: {
      main: "#000000", //lightGreen[400],
      contrastText: "#FFFFFF",
    },
    info: {
      light: "#CFE8EF",
      dark: "#F7C4A5",
      main: "#EDFFE5",
    },
    leftBarItem: {
      light: "#ffffff",
      main: "#000000",
      contrastText: "#ffffff",
    },
    error: {
      main: "#ff0000",
      contrastText: red[100],
    },
    text: {
      primary: "#000000",
      secondary: "#000000",
      select: "#0000b5",
      disabled: grey[500],
    },
    action: {
      active: "#0000b5",
      hover: "#c9c9c9",
      hoverOpacity: 0.5,
      selected: "#0000b5",
      focus: red[400],
      focusOpacity: grey[900],
      activatedOpacity: 0.3,
    },
    tonalOffset: 0.1,
    contrastThreshold: 8,
  },
  shape: {
    borderRadius: 7,
  },
  typography: {
    caption: {
      fontWeight: 600,
    },
  },
  //Зміна кольору тексту кнопки
  /* overrides: {
    MuiButton: {
      label: {
        color: '#f1f1f1',
      },
    },
  }, */

  /* components: {
    MuiListItem: {
      styleOverrides: {
        selected: {
          backgroundColor: 'red',
          color: 'black',
        },
      },
    },
  }, */
});

export default theme;
