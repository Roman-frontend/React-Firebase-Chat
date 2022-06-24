import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SnackbarProvider } from "notistack";
import TestRenderer from "react-test-renderer";
// https://www.apollographql.com/docs/react/development-testing/testing
import { MockedProvider } from "@apollo/client/testing";
import DirectMessageRightBar from "./DirectMessageRightBar";
import "@testing-library/jest-dom";

describe("handleMouseDownPassword test", () => {
  test("test user link", async () => {
    expect(null).toBeNull();
  });
});
