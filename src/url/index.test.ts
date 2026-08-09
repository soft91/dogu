import { describe, expect, it } from "vitest";
import { joinUrl, parseQuery, stringifyQuery, withQuery } from "./index";

describe("url", () => {
  it("stringifyQuery / parseQuery", () => {
    const qs = stringifyQuery({ q: "dogu", page: 1, tags: ["a", "b"] });
    expect(qs).toContain("q=dogu");
    expect(parseQuery(qs)).toEqual({ q: "dogu", page: "1", tags: ["a", "b"] });
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
