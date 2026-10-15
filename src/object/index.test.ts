import { describe, expect, it } from "vitest";
import { get, set } from "./index";

describe("object paths", () => {
  it("reads and writes equivalent dot, bracket, and array paths", () => {
    const value: { users?: Array<{ name?: string }> } = {};

    set(value, "users[0].name", "Dogu");

    expect(value).toEqual({ users: [{ name: "Dogu" }] });
    expect(get(value, ["users", 0, "name"])).toBe("Dogu");
    expect(get(value, "users.1.name", "unknown")).toBe("unknown");
  });
});
