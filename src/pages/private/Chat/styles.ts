import ITheme from "./Models/ITheme";
import darkBackgroundChat from "../../../images/test.png";
import lightBackgroundChat from "../../../images/test-2-chat.jpeg";

export default function setStylesChat(theme: ITheme) {
  const backgroundImage =
    theme.palette.mode === "light" ? lightBackgroundChat : darkBackgroundChat;
  return {
    root: {
      display: "flex",
      alignItems: "center",
      flexFlow: "column",
      height: "100vh",
      lineHeight: "normal",
      background: "#dfe0f7",
      minWidth: 890,
      backgroundImage: `url(${backgroundImage})`,
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
      backgroundSize: "cover",
    },
    workSpace: {
      minWidth: 550,
      maxWidth: 900,
      height: 600,
      background: theme.palette.primary.main,
      boxShadow:
        "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    },
    header: { paddingLeft: 8 },
    conversation: {
      height: 520,
      flexGrow: 1,
      p: "20px 0px 0px 0px",
      backgroundColor: theme.palette.primary.light,
    },
  };
}
