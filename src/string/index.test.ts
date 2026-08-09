import { describe, expect, it } from "vitest";
import { camelCase, kebabCase, slugify, truncate } from "./index";

describe("string", () => {
  it("camelCase / kebabCase", () => {
    expect(camelCase("hello-world_test")).toBe("helloWorldTest");
    expect(kebabCase("helloWorldTest")).toBe("hello-world-test");
  });

  it("truncate", () => {
    expect(truncate("abcdef", 5)).toBe("ab...");
  });

  it("slugify", () => {
    expect(slugify("Hello World!")).toBe("hello-world");
  });
});
