"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { GetTmdbImage } from "@/services/api";

interface Props {
  content: MiniContent;
  index: number;
  rowIndex: number;
  onFocus?: () => void;
}

export function ContentCard({ content, index, rowIndex, onFocus }: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <Link href={`/content/${content.id}`}>
      <motion.div
        ref={cardRef}
        className="group relative shrink-0 cursor-pointer"
        style={{ width: "280px" }}
        onFocus={() => {
          setIsFocused(true);
          onFocus?.();
        }}
        onBlur={() => setIsFocused(false)}
        onMouseEnter={() => setIsFocused(true)}
        onMouseLeave={() => setIsFocused(false)}
        tabIndex={0}
        data-content-card
        data-row={rowIndex}
        data-col={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ scale: 1.1, zIndex: 10 }}
        whileFocus={{ scale: 1.1, zIndex: 10 }}
      >
        <div
          className={`relative rounded overflow-hidden transition-all duration-300 ${
            isFocused ? "ring-4 ring-white shadow-2xl" : ""
          }`}
        >
          <img
            src={GetTmdbImage(content.cover, 500)}
            alt={content.title}
            className="w-full h-105 object-cover"
          />

          {/* Overlay on hover/focus */}
          <motion.div
            className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: isFocused ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-2 line-clamp-2">{content.title}</h3>
          </motion.div>
        </div>
      </motion.div>
    </Link>
  );
}
