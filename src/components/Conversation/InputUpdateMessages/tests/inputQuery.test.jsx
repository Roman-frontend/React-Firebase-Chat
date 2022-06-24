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

describe("InputUpdateMessages graphql query", () => {
  afterEach(() => cleanup());

  test("get messages - test loading after", async () => {
    act(() =>
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <InputUpdateMessages />
        </MockedProvider>
      )
    );

    await TestRenderer.create(
      <MockedProvider mocks={mocks} addTypename={false}>
        <InputUpdateMessages />
      </MockedProvider>
    );

    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
    // Для тестування видалення лоадингу, після виконання строчки що нижче в screen.debug(); потрапить сторінка після лоадингу
    // await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
    // screen.debug();
  });

  test("get messages - test responce data after", async () => {
    await act(async () =>
      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <InputUpdateMessages />
        </MockedProvider>
      )
    );

    await TestRenderer.create(
      <MockedProvider mocks={mocks} addTypename={false}>
        <InputUpdateMessages />
      </MockedProvider>
    );

    // await act(() => sleep(500));
    // const tree = component.toJSON();
    // expect(tree).toMatchSnapshot();
    expect(await screen.findByLabelText("Enter text")).toBeInTheDocument();
    // expect(await screen.findByText("22")).toBeInTheDocument();
    // screen.debug();
  });
});
