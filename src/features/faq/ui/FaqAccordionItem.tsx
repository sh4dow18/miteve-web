import { ChevronDown, ChevronUp } from "lucide-react";
import type { FaqItem } from "@/features/faq/config/faq.constants";

type FaqAccordionItemProps = {
  item: FaqItem;
  isOpen: boolean;
  onToggle: (id: string) => void;
};

export function FaqAccordionItem({
  item,
  isOpen,
  onToggle,
}: FaqAccordionItemProps) {
  return (
    <article className="rounded-xl bg-[#061534]">
      <button
        type="button"
        className="w-full rounded-xl px-6 py-5 text-left sm:px-8 sm:py-6"
        onClick={() => onToggle(item.id)}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${item.id}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium leading-none text-red-500">{item.category}</p>
            <h3 className="mt-3 text-xl font-semibold tracking-tight text-white sm:text-2xl">
              {item.question}
            </h3>
          </div>

          <span
            className={`mt-1 shrink-0 text-slate-400 transition-transform duration-300 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          >
            {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </span>
        </div>

        <div
          className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out ${
            isOpen ? "mt-5 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <p
              id={`faq-answer-${item.id}`}
              className="max-w-4xl text-base font-normal leading-relaxed text-slate-300 sm:text-lg"
            >
              {item.answer}
            </p>
          </div>
        </div>
      </button>
    </article>
  );
}
