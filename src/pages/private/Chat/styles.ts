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
      backgroundImage: `url(${backgroundImage})`,
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
      backgroundSize: "cover",
    },
    workSpace: {
      background: theme.palette.primary.main,
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
