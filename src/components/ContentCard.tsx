"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { GetTmdbImage } from "@/services/api";
import { useRouter } from "next/navigation";

interface Props {
  content: MiniContent;
  index: number;
  rowIndex: number;
  onFocus?: () => void;
}

export function ContentCard({ content, index, rowIndex, onFocus }: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  return (
    // Usamos div nativo en vez de motion.div como raíz focusable
    // para que el foco nativo del browser/TV funcione correctamente
    <div
      className="group relative shrink-0 cursor-pointer
                 w-44 sm:w-52 md:w-60 lg:w-64 xl:w-72
                 outline-none"
      onClick={() => router.push(`/content/${content.id}`)}
      onKeyDown={(e) => {
        // Enter o Select en TV confirman la selección
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push(`/content/${content.id}`);
        }
      }}
      onFocus={() => {
        setIsFocused(true);
        onFocus?.();
      }}
      onBlur={() => setIsFocused(false)}
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
      tabIndex={0}
      role="button"
      aria-label={content.title}
      data-content-card
      data-row={rowIndex}
      data-col={index}
    >
      <motion.div
        className={`relative rounded overflow-hidden transition-shadow duration-300 ${
          isFocused ? "ring-4 ring-white shadow-2xl" : "ring-0"
        }`}
        animate={{ scale: isFocused ? 1.08 : 1, zIndex: isFocused ? 10 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <img
          src={GetTmdbImage(content.cover, 500)}
          alt={content.title}
          className="w-full aspect-2/3 object-cover"
          draggable={false}
        />

        {/* Overlay */}
        <motion.div
          className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent
                     flex flex-col justify-end p-3"
          animate={{ opacity: isFocused ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="text-sm font-semibold line-clamp-2 md:text-base md:mb-1">
            {content.title}
          </h3>
        </motion.div>
      </motion.div>
    </div>
  );
}
