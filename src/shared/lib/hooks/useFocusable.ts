import { useEffect, useRef, useState } from "react";

interface UseFocusableOptions {
  onEnter?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
}

export function useFocusable<T extends HTMLElement>(
  options: UseFocusableOptions = {}
) {
  const ref = useRef<T | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onFocus = () => setIsFocused(true);
    const onBlur = () => setIsFocused(false);

    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Enter":
        case " ":
          options.onEnter?.();
          break;
        case "ArrowUp":
          options.onArrowUp?.();
          break;
        case "ArrowDown":
          options.onArrowDown?.();
          break;
        case "ArrowLeft":
          options.onArrowLeft?.();
          break;
        case "ArrowRight":
          options.onArrowRight?.();
          break;
      }
    };

    el.addEventListener("focus", onFocus);
    el.addEventListener("blur", onBlur);
    el.addEventListener("keydown", onKeyDown);

    return () => {
      el.removeEventListener("focus", onFocus);
      el.removeEventListener("blur", onBlur);
      el.removeEventListener("keydown", onKeyDown);
    };
  }, [options]);

  return { ref, isFocused };
}
