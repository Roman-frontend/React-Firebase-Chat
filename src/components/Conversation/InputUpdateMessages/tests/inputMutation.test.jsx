import React from "react";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { act } from "react-dom/test-utils";
// fireEvent vs userEvent - https://www.youtube.com/watch?v=3YrxcAXkUKQ
import userEvent from "@testing-library/user-event";
import { SnackbarProvider } from "notistack";
import TestRenderer from "react-test-renderer";
// https://www.apollographql.com/docs/react/development-testing/testing
import { MockedProvider } from "@apollo/client/testing";
import mocks from "./mocks";
import { InputUpdateMessages } from "../InputUpdateMessages";
import "@testing-library/jest-dom";
import "@testing-library/dom";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("InputUpdateMessages graphql mutation", () => {
  test("create message", async () => {
    try {
      await act(async () =>
        render(
          <MockedProvider mocks={mocks} addTypename={false}>
            <InputUpdateMessages inputRef={{ current: null }} />
          </MockedProvider>
        )
      );

      const component = await TestRenderer.create(
        <MockedProvider mocks={mocks} addTypename={false}>
          <InputUpdateMessages />
        </MockedProvider>
      );

      // const inputForKeyUp = await waitFor(() =>
      //   screen.getByTestId("on-key-up-main-input").querySelector("input")
      // );
      const inputForKeyUp = await waitFor(() =>
        screen.getByTestId("on-key-up-main-input")
      );
      expect(inputForKeyUp).toBeInTheDocument();
      fireEvent.change(inputForKeyUp, { target: { value: "222" } });
      // expect(inputForKeyUp).toHaveValue("222");
      expect(inputForKeyUp.value).toBe("222");
      expect(inputForKeyUp).toHaveAttribute("value", "222");
      expect(inputForKeyUp).toMatchSnapshot();
      await fireEvent.keyUp(inputForKeyUp, { key: "Enter" });
      const successNotificationAfterCreate = await waitFor(() =>
        screen.getByTestId("success-created-message")
      );
      expect(successNotificationAfterCreate).toBeInTheDocument();
      // userEvent.keyUp(inputForKeyUp, "Enter");
      // userEvent.clear(inputForKeyUp);

      // await waitFor(() => screen.debug());
    } catch (error) {
      console.log(error);
    }
  });
});
