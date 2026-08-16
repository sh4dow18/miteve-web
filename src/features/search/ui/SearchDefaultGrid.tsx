"use client";

import { useCallback, useEffect, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { motion } from "framer-motion";
import { ContentCard } from "@/shared/ui/ContentCard";
import { getToken, getMainProfile } from "@/shared/lib/auth";
import { API_HOST_IP } from "@/shared/config/env";
import type { MiniContent } from "@/entities/content/model/types";

function getColumnsCount() {
  if (typeof window === "undefined") return 2;
  if (window.innerWidth >= 1280) return 5;
  if (window.innerWidth >= 1024) return 4;
  if (window.innerWidth >= 640) return 3;
  return 2;
}

export function SearchDefaultGrid() {
  const [items, setItems] = useState<MiniContent[]>([]);
  const [title, setTitle] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);

  useEffect(() => {
    const token = getToken();
    const profile = getMainProfile();
    const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

    let url: string;
    if (profile) {
      url = `${API_HOST_IP}/contents/recommendations/${profile.id}`;
      setTitle("Recomendado para ti");
    } else {
      url = `${API_HOST_IP}/contents/top-watched`;
      setTitle("Tendencias");
    }

    fetch(url, { headers })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setItems(Array.isArray(data) ? data : (data.content ?? [])))
      .catch(() => {});
  }, []);

  const focusCard = useCallback((index: number) => {
    const card = document.querySelector(
      `[data-default-card="${index}"]`
    ) as HTMLElement | null;
    if (card) {
      card.focus({ preventScroll: false });
      card.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  }, []);

  const handleCardKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>, index: number) => {
      const columns = getColumnsCount();
      const lastIndex = items.length - 1;

      switch (event.key) {
        case "ArrowRight": {
          event.preventDefault();
          focusCard(Math.min(index + 1, lastIndex));
          break;
        }
        case "ArrowLeft": {
          event.preventDefault();
          focusCard(Math.max(index - 1, 0));
          break;
        }
        case "ArrowDown": {
          event.preventDefault();
          focusCard(Math.min(index + columns, lastIndex));
          break;
        }
        case "ArrowUp": {
          event.preventDefault();
          const upIndex = index - columns;
          if (upIndex >= 0) focusCard(upIndex);
          break;
        }
      }
    },
    [focusCard, items.length]
  );

  if (items.length === 0) return null;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-slate-200 mb-4">{title}</h2>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.16, ease: "easeOut" }}
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      >
        {items.map((item, index) => (
          <div
            key={item.id}
            data-default-card={index}
            onKeyDown={(e) => handleCardKeyDown(e, index)}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(-1)}
            tabIndex={0}
          >
            <ContentCard
              content={item}
              index={index}
              rowIndex={0}
              isFocused={focusedIndex === index}
              href={`/content/${item.id}`}
              onMouseEnter={() => setFocusedIndex(index)}
              onMouseLeave={() => setFocusedIndex(-1)}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
