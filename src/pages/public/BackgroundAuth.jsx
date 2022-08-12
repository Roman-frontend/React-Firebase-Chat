import React from "react";
import { useLocation } from "react-router-dom";
import { Paper } from "@mui/material";
import { SignInPage } from "./SignInPage/SignInPage";
import { SignUpPage } from "./SignUpPage/SignUpPage";
import backgroundChat from "../../images/test-2-chat.jpeg";
import "./auth-body.sass";

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
  const spanText = path === "/signUp" ? "Реєстрація" : "Авторизація";
  const formComponent = path === "/signUp" ? <SignUpPage /> : <SignInPage />;

  return (
    <div style={styles.root}>
      <div style={styles.auth}>
        <Paper className="sign-paper">
          <span style={styles.span}>{spanText}</span>
          {formComponent}
        </Paper>
      </div>
    </div>
  );
}
