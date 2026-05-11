"use client";

import { useFaqPage } from "@/features/faq/model/useFaqPage";
import { FaqAccordionItem } from "@/features/faq/ui/FaqAccordionItem";

export default function FaqPage() {
  const {
    categories,
    filteredItems,
    activeCategory,
    openItemId,
    handleCategoryChange,
    handleToggleItem,
  } = useFaqPage();

  return (
    <section className="min-h-screen bg-black px-4 pb-16 pt-20 text-white sm:px-8 md:px-14 md:pt-12">
      <div className="mx-auto max-w-245">
        <header>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Preguntas Frecuentes
          </h1>
          <p className="mt-3 text-base text-slate-400 sm:text-lg">
            Encuentra respuestas a las preguntas mas comunes
          </p>
        </header>

        <div className="mt-10 flex flex-wrap gap-3">
          {categories.map((category) => {
            const isActive = category === activeCategory;

            return (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryChange(category)}
                className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-colors sm:text-base ${
                  isActive
                    ? "bg-[#e50914] text-white"
                    : "bg-[#112241] text-slate-200 hover:bg-[#17325b]"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div
          key={activeCategory}
          className="mt-10 space-y-4 animate-[fadeUp_280ms_ease-out]"
        >
          {filteredItems.map((item) => (
            <FaqAccordionItem
              key={item.id}
              item={item}
              isOpen={item.id === openItemId}
              onToggle={handleToggleItem}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
