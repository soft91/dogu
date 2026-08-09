import { describe, expect, it } from "vitest";
import { chunk, groupBy, unique, uniqueBy } from "./index";

describe("array", () => {
  it("unique", () => {
    expect(unique([1, 2, 2, 3])).toEqual([1, 2, 3]);
  });

  it("uniqueBy", () => {
    expect(uniqueBy([{ id: 1 }, { id: 1 }, { id: 2 }], (item) => item.id)).toEqual([
      { id: 1 },
      { id: 2 },
    ]);
  });

  it("chunk", () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it("groupBy", () => {
    expect(groupBy(["a", "bb", "c"], (item) => item.length)).toEqual({
      1: ["a", "c"],
      2: ["bb"],
    });
  });
});
