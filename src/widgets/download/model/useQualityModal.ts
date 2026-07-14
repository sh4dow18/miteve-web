"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { DownloadQuality } from "@/shared/lib/hooks/useOfflineDownload";

interface UseQualityModalParams {
  contentTitle: string;
  onSelect: (quality: DownloadQuality) => void;
}

interface UseQualityModalReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  contentTitle: string;
  handleSelect: (quality: DownloadQuality) => void;
  handleClose: () => void;
}

export function useQualityModal({
  contentTitle,
  onSelect,
}: UseQualityModalParams): UseQualityModalReturn {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const handleSelect = useCallback(
    (quality: DownloadQuality) => {
      onSelect(quality);
      setIsOpen(false);
    },
    [onSelect]
  );

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const container = containerRef.current;
    container?.querySelector<HTMLElement>("button")?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleClose();
        return;
      }
      if (e.key !== "Tab") return;

      const focusables = container?.querySelectorAll<HTMLElement>(
        "button:not([disabled])"
      );
      if (!focusables?.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, handleClose]);

  return {
    isOpen,
    open,
    close,
    containerRef,
    contentTitle,
    handleSelect,
    handleClose,
  };
}
