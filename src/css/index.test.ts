import { describe, expect, it } from "vitest";
import { cn } from "./index";

describe("css", () => {
  it("cn", () => {
    expect(cn("btn", false && "hidden", { active: true, disabled: false }, ["px-2"])).toBe(
      "btn active px-2",
    );
  });
});
