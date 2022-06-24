import React, { useState } from "react";
import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useAuth } from "reactfire";
//https://github.com/jquense/yup  - Силка на додаткові методи yup
import { useFormik } from "formik";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import { FormHelperText, InputLabel, FormControl, Input } from "@mui/material";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import firebaseStore from "../../../common/firebaseStore";
import { AuthLoader } from "../../../components/Helpers/Loader";

const useStyles = makeStyles((theme) => ({
  label: {
    margin: "0px 8px",
  },
}));

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
});

export const handleMouseDownPassword = (
  event: React.MouseEvent<HTMLButtonElement>
) => {
  event.preventDefault();
};

export const SignInPage = () => {
  const provider = new GoogleAuthProvider();
  const authApp = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "r@gmail.com",
      password: "11111111",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        resetForm({
          values: {
            email: values.email,
            password: "",
          },
        });
        const { user } = await signInWithEmailAndPassword(
          authApp,
          values.email,
          values.password
        );
        console.log(user);
        if (user) {
          navigate("/chat");

          enqueueSnackbar(`Succes login`, { variant: "success" });
        }
      } catch (e) {
        enqueueSnackbar(`${e}`, { variant: "error" });
      }
    },
  });

  const addUserInfo = async (user: User, name: string, surname: string) => {
    if (user?.uid) {
      const docRef = doc(firebaseStore, `usersInfo`, user.uid);
      const docSnap = await getDoc(docRef);

      console.log(user);
      if (!docSnap.data()) {
        await setDoc(docRef, {
          ...docSnap.data(),
          name,
          surname,
          email: user.email,
          uid: user.uid,
          images: [],
        });
      }
    }
  };

  async function loginGoogle() {
    const { user } = await signInWithPopup(authApp, provider);

    const arrInfoUser: undefined | string[] = user.displayName?.split(" ");
    if (user && arrInfoUser?.length === 2) {
      const name = arrInfoUser[0];
      const surname = arrInfoUser[1];
      addUserInfo(user, name, surname);
      navigate("/chat");
    }
  }

  const prevHandleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      // Дозволяє запускати formik.handleSubmit натиском Enter над формою
      // onKeyDown={(e) => {
      //   if (e.key === "Enter") {
      //     formik.handleSubmit();
      //   }
      // }}
    >
      <Box>
        <TextField
          id="email"
          name="email"
          label="Email"
          style={{ width: "33.7vw", margin: "2vh 1vw" }}
          variant="standard"
          value={formik.values.email}
          onChange={formik.handleChange}
          inputProps={{ "data-testid": "login-email-input" }}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          //зупиняє анімацію
          //InputLabelProps={{ shrink: true }}
          autoFocus={true}
          InputLabelProps={{
            classes: { standard: classes.label },
          }}
        />
      </Box>
      <Box>
        <FormControl
          style={{ width: "33.7vw", margin: "2vh 0vw" }}
          error={formik.touched.password && Boolean(formik.errors.password)}
        >
          <InputLabel style={{ margin: "0px 8px" }}>Password</InputLabel>
          <Input
            id="password"
            name="password"
            inputProps={{ "data-testid": "login-password-input" }}
            style={{ width: "33.7vw", marginLeft: 14, marginTop: 10 }}
            type={showPassword ? "text" : "password"}
            value={formik.values.password}
            error={formik.touched.password && Boolean(formik.errors.password)}
            onChange={formik.handleChange}
            endAdornment={
              <InputAdornment position="end">
                {" "}
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={prevHandleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
          <FormHelperText>
            {formik.touched.password && Boolean(formik.errors.password)
              ? formik.errors.password
              : null}
          </FormHelperText>
        </FormControl>
      </Box>
      <Box>
        <Button
          size="small"
          variant="contained"
          style={{
            width: "33.7vw",
            margin: "2vh 1vw",
            color: "black",
            background: "white",
            boxShadow:
              "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2)",
          }}
          onClick={() => loginGoogle()}
        >
          Google
        </Button>
      </Box>
      <Box style={{ display: "flex", justifyContent: "space-evenly" }}>
        <Button
          data-testid="button-login"
          size="small"
          variant="contained"
          style={{
            width: "13vw",
            margin: "15px 0px",
            color: "black",
          }}
          type="submit"
        >
          Enter
        </Button>

        <Link
          to={`/signUp`}
          data-testid="link-to-register"
          style={{
            textDecoration: "none",
            alignSelf: "center",
            color: "#0000b5",
          }}
        >
          Are you is`nt registered?
        </Link>
      </Box>
      {/* {loading ? <AuthLoader /> : null} */}
    </form>
  );
};
