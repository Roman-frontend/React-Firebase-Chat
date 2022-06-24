import {
  validateName,
  validateEmail,
  validatePassword,
} from "./validateMethods.jsx";

describe("validateName function:", () => {
  test("correct return", () => {
    expect(validateName("Roman")).toBe(true);
  });
  // test.each([
  //   ["", "Введите пожалуйста ваше имя!"],
  //   ["g", "Слишком короткое имя"],
  //   ["g*%(*$@#", "Некоректне ім'я"],
  //   ["MustafaIbIvanVasilevych", "Слишком длинное имя"],
  // ])(".toBe(%s, %s)", (value, expected) => {
  //   expect(value).toBe(expected);
  // });
  test("failed return", () => {
    expect(validateName("")).toBe("Введите пожалуйста ваше имя!");
    expect(validateName("g")).toBe("Слишком короткое имя");
    expect(validateName("g*%(*$@#")).toBe("Некоректне ім'я");
    expect(validateName("MustafaIbIvanVasilevych")).toBe("Слишком длинное имя");
  });
});
describe("validateEmail function:", () => {
  test("correct return", () => {
    expect(validateEmail("r@gmail.com")).toBe(true);
  });
  test("failed return", () => {
    expect(validateEmail("Roman")).toBe("Некоректний емейл");
  });
});

describe("validatePassword function:", () => {
  test("correct return", () => {
    expect(validatePassword("RomanLitsevich")).toBe(true);
  });
  test("correct return", () => {
    expect(validatePassword("")).toBe("Введите пароль");
    expect(validatePassword("RomanLi")).toBe("Слишком короткий пароль");
    expect(
      validatePassword(
        "MustafaIbIvanVasilevych11e12dijqdjasva[v0ajsasncjksancasoichoiascnhewofh[ohgreqgerghohoscnaskjcnqowfhqwohfqwdnm,as.cba;sibcaiiheiwofhewohgwenfjska"
      )
    ).toBe("Слишком длинний пароль");
  });
});
