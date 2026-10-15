import { describe, expect, it } from "vitest";
import { addDays, endOfDay, startOfDay } from "./index";

describe("date", () => {
  it("does not mutate Date inputs", () => {
    const input = new Date(2024, 0, 10, 12, 30, 15, 123);

    expect(addDays(input, 2)).toEqual(new Date(2024, 0, 12, 12, 30, 15, 123));
    expect(startOfDay(input)).toEqual(new Date(2024, 0, 10));
    expect(endOfDay(input)).toEqual(new Date(2024, 0, 10, 23, 59, 59, 999));
    expect(input).toEqual(new Date(2024, 0, 10, 12, 30, 15, 123));
  });
});
