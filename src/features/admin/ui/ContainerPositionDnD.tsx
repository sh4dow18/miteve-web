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
    console.log("[DEBUG] ContainerPositionDnD - cargando contenedor", {
      containerId,
      typeId,
      currentContentId,
      currentTitle,
      initialPosition,
    });
    FindContainerById(containerId, typeId)
      .then((container) => {
        if (!container) {
          console.log("[DEBUG] ContainerPositionDnD - contenedor no encontrado", { containerId, typeId });
          setLoading(false);
          return;
        }

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

        console.log("[DEBUG] ContainerPositionDnD - contenedor cargado", {
          containerId,
          typeId,
          totalEnContenedor: container.elementsList.length,
          existentesFiltrados: existing.length,
          insertAt,
          initialPosition,
          ordenInicial: merged.map((it, idx) => ({
            posicion_1based: idx + 1,
            posicion_0based: idx,
            titulo: it.title,
            id: it.contentId ?? "__current__",
            esActual: it.contentId === currentContentId,
          })),
        });

        setItems(merged);
        setLoading(false);
      })
      .catch((err) => {
        console.log("[DEBUG] ContainerPositionDnD - error al cargar contenedor", { containerId, typeId, err });
        setLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerId, typeId, currentContentId]);

  // Notify parent of current item's position whenever items change
  useEffect(() => {
    const idx = items.findIndex((it) => it.contentId === currentContentId);
    if (idx !== -1) {
      console.log("[DEBUG] Orden contenido - posición actualizada", {
        containerId,
        currentContentId,
        currentTitle: currentTitle || items[idx]?.title,
        nuevaPosicion_0based: idx,
        nuevaPosicion_1based: idx + 1,
        totalItems: items.length,
        ordenActual: items.map((it, i) => ({
          pos_1based: i + 1,
          pos_0based: i,
          titulo: it.title,
          id: it.contentId ?? "__current__",
          esActual: it.contentId === currentContentId,
        })),
      });
      onPositionChange(idx);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const handleDragStart = (index: number) => {
    dragIndexRef.current = index;
    console.log("[DEBUG] Drag start - horizontal slider", {
      containerId,
      fromIndex_0based: index,
      fromPosicion_1based: index + 1,
      item: items[index],
      ordenPrevio: items.map((it, i) => ({ pos: i + 1, titulo: it.title, id: it.contentId ?? "__current__" })),
    });
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

    console.log("[DEBUG] Drop - cambio de orden horizontal", {
      containerId,
      typeId,
      currentContentId,
      fromIndex_0based: fromIndex,
      fromPosicion_1based: fromIndex + 1,
      targetIndex_0based: targetIndex,
      targetPosicion_1based: targetIndex + 1,
      itemMovido: items[fromIndex],
    });

    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(targetIndex, 0, moved);
      const newIdx = next.findIndex((it) => it.contentId === currentContentId);
      console.log("[DEBUG] Orden contenido - nuevo orden tras drop", {
        containerId,
        itemMovido: moved,
        from: fromIndex,
        to: targetIndex,
        nuevaPosicionActual_0based: newIdx,
        nuevaPosicionActual_1based: newIdx + 1,
        nuevoOrden: next.map((it, i) => ({
          pos_1based: i + 1,
          pos_0based: i,
          titulo: it.title,
          id: it.contentId ?? "__current__",
          esActual: it.contentId === currentContentId,
        })),
      });
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
    <div className="mt-2">
      <p className="text-xs text-gray-500 mb-2">
        Desliza horizontalmente y arrastra la tarjeta morada &quot;Este&quot; a la posición deseada (ej: 2da posición = soltar sobre el lugar 2).
      </p>
      {/* Slider horizontal - como ContentRow */}
      <div
        className="flex gap-3 overflow-x-auto overflow-y-hidden pb-4 pt-2 px-1 snap-x snap-mandatory scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600"
        style={{ scrollbarWidth: "thin" }}
      >
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
                flex flex-col items-center gap-2 p-2 rounded-lg border transition-all duration-150 cursor-grab active:cursor-grabbing select-none shrink-0 snap-start
                min-w-[130px] max-w-[130px] w-[130px]
                ${isCurrent
                  ? "bg-purple-600/20 border-purple-500/60 ring-1 ring-purple-500/40"
                  : "bg-gray-800/60 border-gray-700/60 hover:bg-gray-700/60"
                }
                ${isDragOver ? "border-purple-400 bg-purple-900/30 scale-[1.03] shadow-lg shadow-purple-500/20" : ""}
              `}
            >
              {/* Header: posición + grip */}
              <div className="flex items-center justify-between w-full">
                <span className={`text-xs font-mono font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${isCurrent ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300"}`}>
                  {index + 1}
                </span>
                <GripVertical className="w-4 h-4 text-gray-500 shrink-0" />
              </div>

              {/* Thumbnail tipo poster slider */}
              <div className="relative w-[110px] h-[156px] rounded overflow-hidden bg-gray-700 shrink-0 border border-gray-700/50">
                {item.cover ? (
                  <Image
                    src={GetTmdbImage(item.cover, 185)}
                    alt={item.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <span className="text-[10px] text-gray-500">Sin imagen</span>
                  </div>
                )}
                {isCurrent && (
                  <div className="absolute top-1 left-1 bg-purple-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                    Este
                  </div>
                )}
                {isDragOver && (
                  <div className="absolute inset-0 border-2 border-purple-400 bg-purple-500/10 pointer-events-none" />
                )}
              </div>

              {/* Title */}
              <span
                className={`text-xs font-medium text-center line-clamp-2 leading-tight h-8 w-full px-1 ${
                  isCurrent ? "text-purple-200" : "text-gray-200"
                }`}
                title={item.title}
              >
                {item.title}
              </span>
            </div>
          );
        })}
      </div>
      <p className="text-[11px] text-gray-600 mt-1">
        Tip: arrrastra &quot;Este&quot; sobre la tarjeta que ocupa la posición 2 para dejarla segunda. Revisa la consola (F12) para ver el log DEBUG del nuevo orden.
      </p>
    </div>
  );
}
