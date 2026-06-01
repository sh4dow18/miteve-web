"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { GetTmdbImage } from "@/shared/api/tmdb";
import { FindSimilarContent } from "@/entities/content/api";
import type { MiniContent } from "@/entities/content/model/types";

interface Props {
  contentId: string;
  visible: boolean;
  onDismiss: () => void;
}

export function EndTimeOverlayTV({ contentId, visible, onDismiss }: Props) {
  const [items, setItems] = useState<MiniContent[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const dismissRef = useRef<HTMLButtonElement>(null);
  const backRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!visible) return;
    FindSimilarContent(contentId, 5)
      .then((data) => {
        const unique = Array.from(
          new Map(data.map((item: MiniContent) => [item.id, item])).values()
        );
        setItems(unique);
        setSelectedIndex(0);
      })
      .catch(() => setItems([]));
  }, [contentId, visible]);

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

  // Focus first card (or dismiss button if no items) when overlay appears
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      if (items.length > 0) {
        cardRefs.current[0]?.focus();
      } else {
        dismissRef.current?.focus();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [visible, items.length]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!visible) return;

    // All focusable elements: back | dismiss | cards[0..n]
    // We manage left/right within the cards row only.
    // Up/down move between rows (cards ↔ buttons).
    const focusedCard = cardRefs.current.findIndex(
      (el) => el === document.activeElement
    );

    switch (e.key) {
      case "ArrowRight":
        if (focusedCard >= 0 && focusedCard < items.length - 1) {
          e.preventDefault();
          cardRefs.current[focusedCard + 1]?.focus();
          selectCard(focusedCard + 1);
        }
        break;
      case "ArrowLeft":
        if (focusedCard > 0) {
          e.preventDefault();
          cardRefs.current[focusedCard - 1]?.focus();
          selectCard(focusedCard - 1);
        }
        break;
      case "ArrowUp":
        // Move from cards row → top buttons row
        if (focusedCard >= 0) {
          e.preventDefault();
          dismissRef.current?.focus();
        }
        break;
      case "ArrowDown":
        // Move from top buttons → cards row
        if (
          document.activeElement === dismissRef.current ||
          document.activeElement === backRef.current
        ) {
          e.preventDefault();
          cardRefs.current[selectedIndex]?.focus();
        }
        break;
      case "Escape":
      case "Backspace":
        e.preventDefault();
        onDismiss();
        break;
    }
  }

  if (!visible) return null;

  const selected = items[selectedIndex] ?? null;

  return (
    <div
      className="absolute inset-0 z-30 bg-black flex flex-col"
      onKeyDown={handleKeyDown}
    >
      {/* ── Full-screen trailer or cover ── */}
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
          {/* Transparent blocker */}
          <div className="absolute inset-0" />
        </>
      ) : selected?.cover ? (
        <Image
          src={GetTmdbImage(selected.cover, 780)}
          alt={selected.title}
          fill
          className="object-cover opacity-30"
          unoptimized
        />
      ) : null}

      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40 pointer-events-none" />

      {/* ── Top bar ── */}
      <div className="relative z-10 flex items-center justify-between px-12 pt-10 pb-4">
        <Link
          ref={backRef}
          href={`/content/${contentId}`}
          data-focusable
          className="flex items-center gap-2 text-white/80 hover:text-white px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors
            focus:outline-none focus-visible:ring-4 focus-visible:ring-white"
        >
          <ChevronLeft className="w-6 h-6" />
          <span className="text-lg font-medium">Volver al contenido</span>
        </Link>

        <button
          ref={dismissRef}
          type="button"
          onClick={onDismiss}
          data-focusable
          className="flex items-center gap-2 text-white/80 hover:text-white px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors
            focus:outline-none focus-visible:ring-4 focus-visible:ring-white"
        >
          <RotateCcw className="w-6 h-6" />
          <span className="text-lg font-medium">Continuar viendo</span>
        </button>

        {selected?.trailer && (
          <button
            type="button"
            onClick={toggleMute}
            data-focusable
            className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors
              focus:outline-none focus-visible:ring-4 focus-visible:ring-white"
            aria-label={isMuted ? "Activar audio" : "Silenciar"}
          >
            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </button>
        )}
      </div>

      {/* ── Main area: selected content info ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-12 pb-6">
        {selected && (
          <>
            <h2 className="text-white text-4xl font-bold drop-shadow-lg mb-3 text-center">
              {selected.title}
            </h2>
            <Link
              href={`/content/${selected.id}`}
              className="flex items-center gap-3 mt-4 px-8 py-4 bg-white text-black font-bold text-lg rounded-full hover:bg-white/90 transition-colors
                focus:outline-none focus-visible:ring-4 focus-visible:ring-white"
            >
              <Play className="w-6 h-6 fill-black" />
              Ver ahora
            </Link>
          </>
        )}
        {items.length === 0 && (
          <p className="text-white/50 text-xl">No hay recomendaciones disponibles.</p>
        )}
      </div>

      {/* ── Bottom cards strip ── */}
      {items.length > 0 && (
        <div className="relative z-10 px-12 pb-10">
          <p className="text-gray-400 text-sm font-semibold uppercase tracking-widest mb-4">
            Contenido similar
          </p>
          <div className="flex gap-5">
            {items.map((item, idx) => (
              <Link
                key={`${item.id}-${idx}`}
                ref={(el) => { cardRefs.current[idx] = el; }}
                href={`/content/${item.id}`}
                data-focusable
                tabIndex={visible ? 0 : -1}
                onFocus={() => selectCard(idx)}
                className={`relative flex-shrink-0 w-36 rounded-xl overflow-hidden transition-all duration-150 ring-4 outline-none ${
                  selectedIndex === idx
                    ? "ring-white scale-110 shadow-2xl shadow-white/20"
                    : "ring-transparent focus-visible:ring-white/60"
                }`}
              >
                <div className="aspect-[2/3] relative bg-gray-800">
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
                <div className="px-2 py-2 bg-gray-900">
                  <p className="text-white text-sm font-medium line-clamp-2 leading-tight">
                    {item.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
