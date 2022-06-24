import React from "react";
import {
  render,
  screen,
  act,
  waitForElementToBeRemoved,
  waitFor,
  fireEvent,
  cleanup,
} from "@testing-library/react";
import renderer from "react-test-renderer";
import userEvent from "@testing-library/user-event";
import TestRenderer from "react-test-renderer";
// https://www.apollographql.com/docs/react/development-testing/testing
import { MockedProvider } from "@apollo/client/testing";
// import { handleMouseDownPassword } from "./SignInPage";
import { LOGIN } from "../../../../GraphQLApp/queryes";
import "@testing-library/jest-dom";
import App from "../../../../App";
import { GraphQLError } from "graphql";

const successMocks = [
  {
    request: {
      query: LOGIN,
      variables: { email: "j@gmail.com", password: "11111111" },
    },
    result: {
      login: {
        __typename: "LoginPayload",
        record: {
          id: "6288661c22cf8e8950762e14",
          name: "John",
          email: "j@gmail.com",
          channels: [],
          directMessages: [
            "6288671cb24f6a89e861b98d",
            "628cd1739b2063839aef7129",
          ],
          token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2Mjg4NjYxYzIyY2Y4ZTg5NTA3NjJlMTQiLCJpYXQiOjE2NTQwOTMzMzN9.XWZOkdwf1bdzNRdJsFEmhhVJAWj-k8c9IpovnqWKeXE",
          __typename: "Auth",
        },
        status: "OK",
        error: null,
      },
    },
  },
];

const errorMocks = [
  {
    request: {
      query: LOGIN,
      variables: { email: "aswwcs@gmail.com", password: "11111111" },
    },
    result: {
      // To simulate GraphQL errors, you define an errors field inside a mock's result field. The value of this field is an array of instantiated GraphQLError objects
      errors: [new GraphQLError("Error!")],
    },
    // To simulate a network error, you can include an error field in your test's mock object, instead of the result field
    // error: new Error('An error occurred'),
  },
];

describe("SignInPage", () => {
  describe("success tests", () => {
    let component;

    beforeEach(async () => {
      await act(() => render(<App />));
      component = await TestRenderer.create(
        <MockedProvider mocks={successMocks}>
          <App />
        </MockedProvider>
      );
    });

    it("To be DOM elements in the SignInPage", async () => {
      const span = screen.getByText("Авторизація");
      expect(span).toBeInTheDocument();

      const allInputs = component.root.findAllByType("input");
      expect(allInputs.length).toBe(2);

      const emailInput = screen.getByLabelText("Email");
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).not.toBeRequired();
      expect(emailInput).toBeVisible();
      expect(emailInput).toHaveValue();

      const passwordInput = screen.getByText("Password");
      expect(passwordInput).toBeInTheDocument();

      const allButtons = component.root.findAllByType("button");
      expect(allButtons.length).toBe(2);

      const loginButton = screen.getByTestId("button-login");
      expect(loginButton).toBeInTheDocument();

      const registerButton = screen.getByTestId("link-to-register");
      expect(registerButton).toBeInTheDocument();
    });

    it("success navigate to /signUp route", async () => {
      const registerLink = screen.getByTestId("link-to-register");
      expect(registerLink).toBeInTheDocument();
      // Замість userEvent можна використати fireEvent
      await userEvent.click(registerLink);

      expect(screen.getByText("Реєстрація")).toBeInTheDocument();
      expect(screen.getByTestId("link-to-login")).toBeInTheDocument();
      await userEvent.click(screen.getByTestId("link-to-login"));

      expect(screen.getByTestId("link-to-register")).toBeInTheDocument();
    });

    it("do login", async () => {
      const loginBtn = screen.getByTestId("button-login");
      expect(loginBtn).toBeInTheDocument();

      const loginInputEmail = screen.getByTestId("login-email-input");
      expect(loginInputEmail).toBeInTheDocument();
      fireEvent.change(loginInputEmail, { target: { value: "j@gmail.com" } });
      expect(loginInputEmail).toHaveValue("j@gmail.com");
      const loginInputPassword = screen.getByTestId("login-password-input");
      expect(loginInputPassword).toBeInTheDocument();
      fireEvent.change(loginInputPassword, { target: { value: "11111111" } });
      expect(loginInputPassword).toHaveValue("11111111");
      await userEvent.click(loginBtn);

      const loader = await screen.findByTestId("circular-loader");
      expect(loader).toBeInTheDocument();
      waitForElementToBeRemoved(() => loader);
      expect(await screen.findByTestId("chat")).toBeInTheDocument();
      expect(
        await screen.findByTestId("conversation-main-block")
      ).toBeInTheDocument();

      const messageDiv = await screen.findAllByTestId("main-message-div");
      expect(messageDiv).toHaveLength(7);

      // const profileBtn = await screen.findByTestId("profile-button");
      // expect(profileBtn).toBeInTheDocument();
      // await userEvent.click(profileBtn);

      // const allBtn = screen.getAllByRole("button");
      // expect(allBtn).toHaveLength(3);

      // const logoutButton = await screen.findByTestId("logout-button");
      // expect(logoutButton).toBeInTheDocument();
      // // expect(logoutButton).toMatchSnapshot();

      // userEvent.click(logoutButton);

      // const loginButton = await screen.findByTestId("button-login");
      // expect(loginButton).toBeInTheDocument();

      // screen.debug();
    });

    it("success login", async () => {
      screen.debug();
    });
  });
});
