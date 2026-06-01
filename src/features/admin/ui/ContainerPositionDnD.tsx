"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { GripVertical, Loader2 } from "lucide-react";
import { GetTmdbImage } from "@/shared/api/tmdb";
import { FindContainerById } from "@/entities/content/api";

interface DragItem {
  /** null = the item being created/edited (not yet in the list) */
  contentId: string | null;
  cover: string;
  title: string;
  /** original index in the list, -1 for the new item */
  originalIndex: number;
}

interface Props {
  containerId: number;
  /** 1 = movies, 2 = tv-shows */
  typeId: number;
  /** id of the content being edited (null if creating) */
  currentContentId: string | null;
  currentTitle: string;
  currentCover: string;
  /** Called whenever the user changes position (0-based index in the result list) */
  onPositionChange: (position: number) => void;
  initialPosition: number;
}

export function ContainerPositionDnD({
  containerId,
  typeId,
  currentContentId,
  currentTitle,
  currentCover,
  onPositionChange,
  initialPosition,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<DragItem[]>([]);
  const dragIndexRef = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Build the item list from the container data, injecting the current item
  useEffect(() => {
    if (!containerId) return;
    setLoading(true);

    FindContainerById(containerId, typeId)
      .then((container) => {
        if (!container) { setLoading(false); return; }

        // Sort existing elements by position, exclude the item being edited
        const existing: DragItem[] = container.elementsList
          .filter((el) => el.content.id !== currentContentId)
          .sort((a, b) => a.position - b.position)
          .map((el, i) => ({
            contentId: el.content.id,
            cover: el.content.cover,
            title: el.content.title,
            originalIndex: i,
          }));

        const currentItem: DragItem = {
          contentId: currentContentId,
          cover: currentCover,
          title: currentTitle || "Este elemento",
          originalIndex: -1,
        };

        // Insert current item at initialPosition (clamped)
        const insertAt = Math.min(Math.max(0, initialPosition), existing.length);
        const merged = [
          ...existing.slice(0, insertAt),
          currentItem,
          ...existing.slice(insertAt),
        ];

        setItems(merged);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerId, typeId, currentContentId]);

  // Notify parent of current item's position whenever items change
  useEffect(() => {
    const idx = items.findIndex((it) => it.contentId === currentContentId);
    if (idx !== -1) onPositionChange(idx);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const handleDragStart = (index: number) => {
    dragIndexRef.current = index;
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (targetIndex: number) => {
    const fromIndex = dragIndexRef.current;
    if (fromIndex === null || fromIndex === targetIndex) {
      dragIndexRef.current = null;
      setDragOverIndex(null);
      return;
    }

    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });

    dragIndexRef.current = null;
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    dragIndexRef.current = null;
    setDragOverIndex(null);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-400 py-4">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Cargando contenidos del contenedor…</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 mt-2 max-h-72 overflow-y-auto pr-1">
      {items.map((item, index) => {
        const isCurrent = item.contentId === currentContentId;
        const isDragOver = dragOverIndex === index;

        return (
          <div
            key={item.contentId ?? "__current__"}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={() => handleDrop(index)}
            onDragEnd={handleDragEnd}
            className={`
              flex items-center gap-3 px-3 py-2 rounded-lg border transition-all duration-150 cursor-grab active:cursor-grabbing select-none
              ${isCurrent
                ? "bg-purple-600/20 border-purple-500/60 ring-1 ring-purple-500/40"
                : "bg-gray-800/60 border-gray-700/60 hover:bg-gray-700/60"
              }
              ${isDragOver ? "border-purple-400 bg-purple-900/20 scale-[1.01]" : ""}
            `}
          >
            {/* Position badge */}
            <span className="text-xs text-gray-500 w-5 text-center shrink-0 font-mono">
              {index + 1}
            </span>

            {/* Grip handle */}
            <GripVertical className="w-4 h-4 text-gray-500 shrink-0" />

            {/* Thumbnail */}
            <div className="relative w-8 h-12 rounded overflow-hidden bg-gray-700 shrink-0">
              {item.cover ? (
                <Image
                  src={GetTmdbImage(item.cover, 92)}
                  alt={item.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-gray-700" />
              )}
            </div>

            {/* Title */}
            <span
              className={`text-sm font-medium truncate flex-1 ${
                isCurrent ? "text-purple-200" : "text-gray-200"
              }`}
            >
              {item.title}
            </span>

            {isCurrent && (
              <span className="text-[10px] bg-purple-600 text-white px-1.5 py-0.5 rounded shrink-0">
                Este
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
