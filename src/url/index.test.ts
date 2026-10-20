import { describe, expect, it } from "vitest";
import { joinUrl, parseQuery, parseQueryEntries, stringifyQuery, withQuery } from "./index";

describe("url", () => {
  it("stringifyQuery / parseQuery", () => {
    const qs = stringifyQuery({ q: "dogu", page: 1, tags: ["a", "b"] });
    expect(qs).toContain("q=dogu");
    expect(parseQuery(qs)).toEqual({ q: "dogu", page: "1", tags: ["a", "b"] });
  });

  it("extracts query entries from a URL", () => {
    const url = "https://example.com/search?q=dogu&tag=ts&tag=react#results";

    expect(parseQueryEntries(url)).toEqual([
      { key: "q", value: "dogu" },
      { key: "tag", value: "ts" },
      { key: "tag", value: "react" },
    ]);
    expect(parseQuery(url)).toEqual({ q: "dogu", tag: ["ts", "react"] });
    expect(parseQuery("https://example.com/search#results")).toEqual({});
  });

  it("joinUrl", () => {
    expect(joinUrl("https://example.com/", "/api/", "/users")).toBe(
      "https://example.com/api/users",
    );
  });

  it("withQuery", () => {
    expect(withQuery("/search", { q: "react" })).toBe("/search?q=react");
    expect(withQuery("/search?sort=asc", { q: "next" })).toBe("/search?sort=asc&q=next");
  });
});
