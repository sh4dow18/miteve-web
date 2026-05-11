"use client";

import { useMemo, useState } from "react";
import {
  FAQ_CATEGORIES,
  FAQ_ITEMS,
  type FaqCategory,
} from "@/features/faq/config/faq.constants";

export function useFaqPage() {
  const [activeCategory, setActiveCategory] = useState<FaqCategory>("Todas");
  const [openItemId, setOpenItemId] = useState<string>(FAQ_ITEMS[0]?.id ?? "");

  const filteredItems = useMemo(() => {
    if (activeCategory === "Todas") return FAQ_ITEMS;

    return FAQ_ITEMS.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const handleCategoryChange = (category: FaqCategory) => {
    setActiveCategory(category);

    const firstItemInCategory =
      category === "Todas"
        ? FAQ_ITEMS[0]
        : FAQ_ITEMS.find((item) => item.category === category);

    setOpenItemId(firstItemInCategory?.id ?? "");
  };

  const handleToggleItem = (itemId: string) => {
    setOpenItemId((currentItemId) => (currentItemId === itemId ? "" : itemId));
  };

  return {
    categories: FAQ_CATEGORIES,
    filteredItems,
    activeCategory,
    openItemId,
    handleCategoryChange,
    handleToggleItem,
  };
}
