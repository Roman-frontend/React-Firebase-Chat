import { messageDate } from "./DateCreators";

describe("messageDate function:", () => {
  test("correct return", () => {
    expect(messageDate(1653106468034)).toBe("7:14:28");
  });
});
