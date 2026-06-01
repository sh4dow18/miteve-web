"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { GetTmdbImage } from "@/shared/api/tmdb";
import { FindSimilarContent } from "@/entities/content/api";
import type { MiniContent } from "@/entities/content/model/types";

interface Props {
  contentId: string;
  visible: boolean;
  onDismiss: () => void;
}

export function EndTimeOverlay({ contentId, visible, onDismiss }: Props) {
  const [items, setItems] = useState<MiniContent[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  function sendYTCommand(func: string) {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args: "" }),
      "*"
    );
  }

  function toggleMute() {
    const next = !isMuted;
    sendYTCommand(next ? "mute" : "unMute");
    setIsMuted(next);
  }

  function selectCard(idx: number) {
    setSelectedIndex(idx);
    setIsMuted(true);
  }

  useEffect(() => {
    if (!visible) return;
    FindSimilarContent(contentId, 5)
      .then((data) => {
        const unique = Array.from(
          new Map(data.map((item: MiniContent) => [item.id, item])).values()
        );
        setItems(unique);
        setSelectedIndex(0);
        setIsMuted(true);
      })
      .catch(() => setItems([]));
  }, [contentId, visible]);

  const selected = items[selectedIndex] ?? null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 z-30 bg-black"
        >
          {/* ── Full-screen trailer ── */}
          {selected?.trailer ? (
            <>
              <iframe
                key={selected.id}
                ref={iframeRef}
                src={`https://www.youtube.com/embed/${selected.trailer}?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&loop=1&playlist=${selected.trailer}&enablejsapi=1`}
                allow="autoplay; fullscreen"
                className="absolute inset-0 w-full h-full border-0 pointer-events-none"
                title={selected.title}
              />
              {/* Transparent blocker to prevent iframe interaction */}
              <div className="absolute inset-0" />
            </>
          ) : selected?.cover ? (
            <Image
              src={GetTmdbImage(selected.cover, 780)}
              alt={selected.title}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 bg-gray-900" />
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />

          {/* Top-left back button */}
          <Link
            href={`/content/${contentId}`}
            className="absolute top-4 left-4 flex items-center gap-1.5 px-4 py-2 bg-black/50 hover:bg-black/75 text-white text-sm font-medium rounded-full transition-colors backdrop-blur-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Volver al contenido
          </Link>

          {/* Top-right controls */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {selected?.trailer && (
              <button
                type="button"
                onClick={toggleMute}
                className="p-2 bg-black/50 hover:bg-black/75 text-white rounded-full transition-colors backdrop-blur-sm"
                aria-label={isMuted ? "Activar audio" : "Silenciar"}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            )}
            <button
              type="button"
              onClick={onDismiss}
              className="flex items-center gap-2 px-4 py-2 bg-black/50 hover:bg-black/75 text-white text-sm font-medium rounded-full transition-colors backdrop-blur-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Continuar viendo
            </button>
          </div>

          {/* ── Bottom overlay: title + cards ── */}
          <div className="absolute bottom-0 inset-x-0 px-6 pb-5">
            {/* Selected title + play */}
            {selected && (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 mb-4"
              >
                <Link
                  href={`/content/${selected.id}`}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white text-black font-semibold rounded-full text-sm hover:bg-white/90 transition-colors"
                >
                  <Play className="w-4 h-4 fill-black" />
                  Ver ahora
                </Link>
                <span className="text-white text-lg font-semibold drop-shadow-md">
                  {selected.title}
                </span>
              </motion.div>
            )}

            {/* Cards strip */}
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-3">
              Contenido similar
            </p>
            <div className="flex gap-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              {items.map((item, idx) => (
                <Link
                  key={`${item.id}-${idx}`}
                  ref={(el) => { cardRefs.current[idx] = el; }}
                  href={`/content/${item.id}`}
                  tabIndex={0}
                  onMouseEnter={() => selectCard(idx)}
                  onFocus={() => selectCard(idx)}
                  className={`relative flex-shrink-0 w-28 sm:w-36 rounded-lg transition-all duration-200 ring-2 outline-none ${
                    selectedIndex === idx
                      ? "ring-white scale-105 shadow-lg shadow-white/10"
                      : "ring-transparent hover:ring-white/40 focus-visible:ring-white/60"
                  }`}
                >
                  <div className="aspect-[2/3] relative bg-gray-800 rounded-t-lg overflow-hidden">
                    {item.cover ? (
                      <Image
                        src={GetTmdbImage(item.cover, 185)}
                        alt={item.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-rose-900/60 to-purple-900/60" />
                    )}
                    {selectedIndex === idx && (
                      <div className="absolute inset-0 bg-white/10" />
                    )}
                  </div>
                  <div className="px-2 py-1.5 bg-gray-900 rounded-b-lg">
                    <p className="text-white text-xs font-medium line-clamp-2 leading-tight">
                      {item.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
