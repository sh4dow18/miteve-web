import { useEffect, useRef, useState } from 'react';

interface UseFocusableOptions {
  onEnter?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  focusKey?: string;
}

export function useFocusable<T extends HTMLElement>(options: UseFocusableOptions = {}) {
  const ref = useRef<T>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFocused) return;

      switch (e.key) {
        case 'Enter':
          e.preventDefault();
          options.onEnter?.();
          break;
        case 'ArrowUp':
          e.preventDefault();
          options.onArrowUp?.();
          break;
        case 'ArrowDown':
          e.preventDefault();
          options.onArrowDown?.();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          options.onArrowLeft?.();
          break;
        case 'ArrowRight':
          e.preventDefault();
          options.onArrowRight?.();
          break;
      }
    };

    element.addEventListener('focus', handleFocus);
    element.addEventListener('blur', handleBlur);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      element.removeEventListener('focus', handleFocus);
      element.removeEventListener('blur', handleBlur);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFocused, options]);

  return { ref, isFocused };
}
