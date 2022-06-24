import React from "react";
import { useLocation } from "react-router-dom";
import { Paper } from "@mui/material";
import { SignInPage } from "./SignInPage/SignInPage";
import { SignUpPage } from "./SignUpPage/SignUpPage";
// import conversationBackground from "../../images/Conversation-background.jpeg";
import backgroundChat from "../../images/test-2-chat.jpeg";

const styles = {
  root: {
    height: "100vh",
    width: "100vw",
    backgroundImage: `url(${backgroundChat})`,
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    backgroundSize: "cover",
  },
  auth: {
    display: "flex",
    justifyContent: "center",
  },
  span: {
    display: "flex",
    justifyContent: "center",
    fontSize: 25,
    margin: "20px 0px 0px",
  },
};

export function BackgroundAuth() {
  const path = useLocation().pathname;
  const spanText = path === "/signIn" ? "Авторизація" : "Реєстрація";
  const formComponent = path === "/signIn" ? <SignInPage /> : <SignUpPage />;

  return (
    <div style={styles.root}>
      <div style={styles.auth}>
        <Paper
          sx={{
            position: "relative",
            top: "15vh",
            boxShadow:
              "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 1)",
          }}
        >
          <span style={styles.span}>{spanText}</span>
          {formComponent}
        </Paper>
      </div>
    </div>
  );
}
