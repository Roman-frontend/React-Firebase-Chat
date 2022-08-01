import React, { memo, useState } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import {
  User,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useAuth } from "reactfire";
import { useSnackbar } from "notistack";
import { Box, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import firebaseStore from "../../../common/firebaseStore";
import { useValidate } from "../../../hooks/validate.hook";
import {
  validateName,
  validateSurname,
  validateEmail,
  validatePassword,
} from "../../../components/Helpers/validateMethods/validateMethods.jsx";
import { SignUpForm } from "../../../components/SignUpForm/SignUpForm.jsx";
import { AuthLoader } from "../../../components/Helpers/Loader.jsx";
import "./auth-body.sass";

interface IFormData {
  name: string;
  email: string;
  password: string;
  surname: string;
}

export const SignUpPage = memo(() => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const authApp = useAuth();
  const { errors, validate } = useValidate({
    name: validateName,
    surname: validateSurname,
    email: validateEmail,
    password: validatePassword,
  });
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const addUserInfo = async (user: User, name: string, surname: string) => {
    if (user?.uid) {
      const docRef = doc(firebaseStore, `usersInfo`, user.uid);
      const docSnap = await getDoc(docRef);

      await setDoc(docRef, {
        ...docSnap.data(),
        name,
        surname,
        email: user.email,
        uid: user.uid,
        online: true,
        images: [],
      });
    }
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (name && surname && email && password) {
      const formData: IFormData = {
        name,
        surname,
        email,
        password,
      };
      setPassword("");
      const isValidForm = validate(formData);
      if (isValidForm && formData.email && formData.password && formData.name) {
        try {
          const { user } = await createUserWithEmailAndPassword(
            authApp,
            formData.email,
            formData.password
          );
          await updateProfile(user, {
            displayName: formData.name + " " + formData.surname,
            // photoURL: "https://example.com/jane-q-user/profile.jpg"
          });

          if (user) {
            navigate("/chat");
            addUserInfo(user, formData.name, formData.surname);
            enqueueSnackbar(`Succes register`, { variant: "success" });
          }
        } catch (e) {
          enqueueSnackbar(`${e}`, { variant: "error" });
        }
      }
    }
  };

  return (
    <form>
      <SignUpForm
        label="Name"
        placeholder="Введите имя"
        name="name"
        autoFocus={true}
        fieldError={errors.name}
        value={name}
        type="name"
        handleChange={setName}
      />
      <SignUpForm
        label="Surname"
        placeholder="Введите фамилию"
        name="surname"
        autoFocus={true}
        fieldError={errors.surname}
        value={surname}
        type="surname"
        handleChange={setSurname}
      />
      <SignUpForm
        label="Email"
        placeholder="Введите email"
        name="email"
        fieldError={errors.email}
        value={email}
        type="email"
        handleChange={setEmail}
      />
      <SignUpForm
        label="Password"
        placeholder="Введите пароль"
        name="password"
        fieldError={errors?.password}
        value={password}
        type="password"
        handleChange={setPassword}
      />

      <Box style={{ display: "flex", justifyContent: "space-evenly" }}>
        <Button
          size="small"
          variant="contained"
          type="submit"
          color="primary"
          style={{
            width: "13vw",
            margin: "15px",
          }}
          onClick={(e) => handleSubmit(e)}
        >
          Register
        </Button>

        <Link
          data-testid="link-to-login"
          to={`/signIn`}
          style={{
            textDecoration: "none",
            alignSelf: "center",
            color: "#0000b5",
          }}
        >
          Are you is registered?
        </Link>
      </Box>
      {/* {loading ? <AuthLoader /> : null} */}
    </form>
  );
});
