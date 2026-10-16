import { describe, expect, it } from "vitest";
import { findBfs, findDfs } from "./index";

type Node = { id: string; children?: Node[] };

const children = (node: Node) => node.children;

describe("tree search", () => {
  const root: Node = {
    id: "root",
    children: [
      { id: "left", children: [{ id: "middle", children: [{ id: "deep-match" }] }] },
      { id: "right", children: [{ id: "shallow-match" }] },
    ],
  };

  it("finds the shallowest matching node with BFS", () => {
    expect(findBfs(root, children, (node) => node.id.endsWith("match"))?.id).toBe("shallow-match");
  });

  it("finds the first depth-first matching node with DFS", () => {
    expect(findDfs(root, children, (node) => node.id.endsWith("match"))?.id).toBe("deep-match");
  });

  it("does not revisit nodes in a cyclic graph", () => {
    const first: Node = { id: "first" };
    const second: Node = { id: "second", children: [first] };
    first.children = [second];

    expect(findBfs(first, children, (node) => node.id === "missing")).toBeUndefined();
    expect(findDfs(first, children, (node) => node.id === "missing")).toBeUndefined();
  });
});
