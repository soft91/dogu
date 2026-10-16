/** 노드를 방문할 때 자식 노드 목록을 반환하는 함수입니다. */
export type ChildrenOf<T> = (node: T) => readonly T[] | undefined;

/** 노드가 검색 조건에 맞는지 확인하는 함수입니다. */
export type NodePredicate<T> = (node: T) => boolean;

/**
 * 너비 우선 탐색(BFS)으로 조건에 맞는 첫 노드를 반환합니다.
 *
 * 같은 노드를 여러 경로로 방문하거나 순환 참조가 있는 그래프에서도
 * 노드를 한 번만 방문합니다. 조건에 맞는 노드가 없으면 `undefined`를 반환합니다.
 */
export function findBfs<T>(
  root: T,
  getChildren: ChildrenOf<T>,
  predicate: NodePredicate<T>,
): T | undefined {
  const visited = new Set<T>([root]);
  const queue: T[] = [root];

  for (let index = 0; index < queue.length; index += 1) {
    const node = queue[index]!;
    if (predicate(node)) return node;

    for (const child of getChildren(node) ?? []) {
      if (visited.has(child)) continue;
      visited.add(child);
      queue.push(child);
    }
  }

  return undefined;
}

/**
 * 깊이 우선 탐색(DFS)으로 조건에 맞는 첫 노드를 반환합니다.
 *
 * 자식 배열의 작성 순서를 유지하며, 순환 참조가 있는 그래프도 안전하게 탐색합니다.
 */
export function findDfs<T>(
  root: T,
  getChildren: ChildrenOf<T>,
  predicate: NodePredicate<T>,
): T | undefined {
  const visited = new Set<T>();
  const stack: T[] = [root];

  while (stack.length > 0) {
    const node = stack.pop()!;
    if (visited.has(node)) continue;
    visited.add(node);

    if (predicate(node)) return node;

    const children = getChildren(node) ?? [];
    for (let index = children.length - 1; index >= 0; index -= 1) {
      const child = children[index]!;
      if (!visited.has(child)) stack.push(child);
    }
  }

  return undefined;
}
