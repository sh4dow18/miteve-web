import { useCallback, useMemo, useState } from "react";

type GridKey = `${number}:${number}`;

interface RegisteredNode {
  row: number;
  col: number;
  node: HTMLElement;
}

export function useKeyboardNavigation() {
  const [nodes, setNodes] = useState<Map<GridKey, RegisteredNode>>(new Map());

  const register = useCallback((row: number, col: number, node: HTMLElement) => {
    setNodes((prev) => {
      const next = new Map(prev);
      next.set(`${row}:${col}`, { row, col, node });
      return next;
    });
  }, []);

  const unregister = useCallback((row: number, col: number) => {
    setNodes((prev) => {
      const next = new Map(prev);
      next.delete(`${row}:${col}`);
      return next;
    });
  }, []);

  const moveFocus = useCallback((row: number, col: number) => {
    const target = nodes.get(`${row}:${col}`);
    if (!target) return;
    target.node.focus({ preventScroll: false });
    target.node.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [nodes]);

  const api = useMemo(
    () => ({ register, unregister, moveFocus }),
    [register, unregister, moveFocus]
  );

  return api;
}
