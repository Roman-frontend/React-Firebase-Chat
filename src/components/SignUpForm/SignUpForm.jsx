import React from "react";
import { makeStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";
import { colors } from "@mui/material";
import "./auth-form.sass";

const useStyles = makeStyles((theme) => ({
  inputIsValidated: {
    color: colors.lime[900],
  },
  inputIsNotValidated: {
    color: colors.red[900],
  },
  label: {
    margin: "0px 8px",
  },
}));

export function SignUpForm(props) {
  const {
    label,
    type,
    name,
    value,
    fieldError = true,
    handleChange,
    autoFocus = false,
  } = props;
  const classes = useStyles();
  const isError =
    fieldError === undefined || fieldError === true ? false : true;

  return (
    <>
      <TextField
        style={{ width: "33.7vw", margin: "0vh 1vw" }}
        label={label}
        name={name}
        value={value}
        type={type}
        InputLabelProps={{
          classes: { standard: classes.label },
        }}
        autoFocus={autoFocus}
        onChange={(event) => handleChange(event.target.value)}
        error={isError}
        size="small"
        variant="standard"
      />
      <p className={isError ? "auth-form__error" : null}>{fieldError}</p>
    </>
  );
}
