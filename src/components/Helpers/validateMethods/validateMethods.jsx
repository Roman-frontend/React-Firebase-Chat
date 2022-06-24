const PASSWORD_MAX_LENGTH = 50;
const PASSWORD_MIN_LENGTH = 8;

const NAME_MAX_LENGTH = 15;
const NAME_MIN_LENGTH = 3;

const emptyName = "Введите пожалуйста ваше имя!";
const shortName = "Слишком короткое имя";
const longName = "Слишком длинное имя";
const incorrectName = "Некоректне ім'я";

const emptySarname = "Введите пожалуйста вашу фамилию!";
const shortSurname = "Слишком короткая фамилия";
const longSurname = "Слишком длинная фамилия";
const incorrectSurname = "Некоректная фамилия";

const incorrectEmail = "Некоректний емейл";
const emptyEmail = "Введите пожалуйста емейл";

const emptyPassword = "Введите пароль";
const shortPassword = "Слишком короткий пароль";
const longPassword = "Слишком длинний пароль";

export const validateName = (name) => {
  const regExp = /^([A-Za-z0-9]){3,15}$/gi;

  if (!name) return emptyName;
  if (typeof name !== "string") {
    console.error(name, "is not type of string");
    return incorrectName;
  }
  if (name.length < NAME_MIN_LENGTH) return shortName;
  if (name.length > NAME_MAX_LENGTH) return longName;
  if (!name.match(regExp)) return incorrectName;
  return true;
};

export const validateSurname = (surname) => {
  const regExp = /^([A-Za-z0-9]){3,15}$/gi;

  if (!surname) return emptySarname;
  if (typeof surname !== "string") {
    console.error(surname, "is not type of string");
    return incorrectSurname;
  }
  if (surname.length < NAME_MIN_LENGTH) return shortSurname;
  if (surname.length > NAME_MAX_LENGTH) return longSurname;
  if (!surname.match(regExp)) return incorrectSurname;
  return true;
};

export const validateEmail = (email) => {
  const regExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  if (!email) return emptyEmail;
  if (!email.match(regExp)) return incorrectEmail;
  if (email.match(regExp)) return true;
  return true;
};

export const validatePassword = (password) => {
  if (!password) return emptyPassword;
  if (password.length < PASSWORD_MIN_LENGTH) return shortPassword;
  if (password.length > PASSWORD_MAX_LENGTH) return longPassword;

  return true;
};
