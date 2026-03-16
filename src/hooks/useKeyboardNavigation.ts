import { useEffect, useRef, useCallback } from 'react';

export interface NavigationItem {
  element: HTMLElement;
  row: number;
  col: number;
}

export function useKeyboardNavigation(
  enabled: boolean = true,
  onEnter?: (element: HTMLElement) => void
) {
  const itemsRef = useRef<Map<string, NavigationItem>>(new Map());
  const currentFocusRef = useRef<{ row: number; col: number }>({ row: 0, col: 0 });

  const registerItem = useCallback((key: string, element: HTMLElement, row: number, col: number) => {
    itemsRef.current.set(key, { element, row, col });
  }, []);

  const unregisterItem = useCallback((key: string) => {
    itemsRef.current.delete(key);
  }, []);

  const getItemsInRow = useCallback((row: number): NavigationItem[] => {
    return Array.from(itemsRef.current.values())
      .filter(item => item.row === row)
      .sort((a, b) => a.col - b.col);
  }, []);

  const getAllRows = useCallback((): number[] => {
    const rows = new Set<number>();
    itemsRef.current.forEach(item => rows.add(item.row));
    return Array.from(rows).sort((a, b) => a - b);
  }, []);

  const focusItem = useCallback((row: number, col: number) => {
    const item = Array.from(itemsRef.current.values()).find(
      item => item.row === row && item.col === col
    );

    if (item) {
      item.element.focus();
      item.element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      currentFocusRef.current = { row, col };
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const { row, col } = currentFocusRef.current;
      const currentRowItems = getItemsInRow(row);
      const allRows = getAllRows();

      switch (e.key) {
        case 'ArrowRight': {
          e.preventDefault();
          const nextCol = col + 1;
          if (nextCol < currentRowItems.length) {
            focusItem(row, nextCol);
          }
          break;
        }
        case 'ArrowLeft': {
          e.preventDefault();
          const prevCol = col - 1;
          if (prevCol >= 0) {
            focusItem(row, prevCol);
          }
          break;
        }
        case 'ArrowDown': {
          e.preventDefault();
          const currentRowIndex = allRows.indexOf(row);
          if (currentRowIndex < allRows.length - 1) {
            const nextRow = allRows[currentRowIndex + 1];
            const nextRowItems = getItemsInRow(nextRow);
            const targetCol = Math.min(col, nextRowItems.length - 1);
            focusItem(nextRow, targetCol);
          }
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          const currentRowIndex = allRows.indexOf(row);
          if (currentRowIndex > 0) {
            const prevRow = allRows[currentRowIndex - 1];
            const prevRowItems = getItemsInRow(prevRow);
            const targetCol = Math.min(col, prevRowItems.length - 1);
            focusItem(prevRow, targetCol);
          }
          break;
        }
        case 'Enter': {
          e.preventDefault();
          const item = Array.from(itemsRef.current.values()).find(
            item => item.row === row && item.col === col
          );
          if (item && onEnter) {
            onEnter(item.element);
          } else if (item) {
            item.element.click();
          }
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, focusItem, getItemsInRow, getAllRows, onEnter]);

  return {
    registerItem,
    unregisterItem,
    focusItem,
    setCurrentFocus: (row: number, col: number) => {
      currentFocusRef.current = { row, col };
    },
  };
}
