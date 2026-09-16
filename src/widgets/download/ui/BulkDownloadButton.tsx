"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Download, Loader2, AlertTriangle, Check } from "lucide-react";
import { useBulkOfflineDownload, type BulkEpisode } from "@/shared/lib/hooks/useBulkOfflineDownload";
import { BulkDownloadModal } from "@/widgets/download/ui/BulkDownloadModal";
import type { DownloadQuality } from "@/shared/lib/hooks/useOfflineDownload";

interface BulkDownloadButtonProps {
  contentId: string;
  contentTitle: string;
  cover: string;
  seasonNumber: number;
  episodes: { episodeNumber: number; title: string; cover: string }[];
  className?: string;
}

export function BulkDownloadButton({
  contentId,
  contentTitle,
  cover,
  seasonNumber,
  episodes,
  className = "",
}: BulkDownloadButtonProps) {
  const minEpisode = useMemo(() => {
    if (episodes.length === 0) return 1;
    return Math.min(...episodes.map((e) => e.episodeNumber));
  }, [episodes]);

  const maxEpisode = useMemo(() => {
    if (episodes.length === 0) return 1;
    return Math.max(...episodes.map((e) => e.episodeNumber));
  }, [episodes]);

  const [fromEpisode, setFromEpisode] = useState(minEpisode);
  const [toEpisode, setToEpisode] = useState(maxEpisode);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Keep range in sync when season changes
  useEffect(() => {
    setFromEpisode(minEpisode);
    setToEpisode(maxEpisode);
  }, [minEpisode, maxEpisode, seasonNumber]);

  const bulkEpisodes: BulkEpisode[] = useMemo(() => {
    const list: BulkEpisode[] = [];
    // If range invalid, return empty (modal will disable download)
    if (fromEpisode > toEpisode) return [];
    // Clamp to sensible bounds and cap at 100 episodes to avoid abuse
    const safeFrom = Math.max(1, Math.floor(fromEpisode));
    const safeTo = Math.max(safeFrom, Math.floor(toEpisode));
    const cappedTo = Math.min(safeTo, safeFrom + 99); // max 100
    for (let n = safeFrom; n <= cappedTo; n++) {
      const found = episodes.find((e) => e.episodeNumber === n);
      list.push({
        seasonNumber,
        episodeNumber: n,
        episodeTitle: found?.title,
        cover: found?.cover || cover,
      });
    }
    return list;
  }, [fromEpisode, toEpisode, episodes, seasonNumber, cover]);

  const bulk = useBulkOfflineDownload({
    contentId,
    contentTitle,
    type: "tv-show",
    episodes: bulkEpisodes,
  });

  const handleOpen = useCallback(() => {
    // Reset previous bulk result when reopening after done/partial
    if (bulk.state === "done" || bulk.state === "partial" || bulk.state === "error") {
      bulk.reset();
    }
    setIsOpen(true);
  }, [bulk]);

  const handleClose = useCallback(() => {
    if (bulk.state === "downloading") return;
    setIsOpen(false);
    // Keep success state visible until next open; reset only on next open
  }, [bulk.state]);

  const handleSelect = useCallback(
    (quality: DownloadQuality) => {
      bulk.download(quality);
    },
    [bulk]
  );

  // Focus trap + Esc handling similar to QualityModal
  useEffect(() => {
    if (!isOpen) return;
    const container = containerRef.current;
    container?.querySelector<HTMLElement>("button:not([disabled])")?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && bulk.state !== "downloading") {
        setIsOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = container?.querySelectorAll<HTMLElement>(
        "button:not([disabled]), input:not([disabled])"
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, bulk.state]);

  const isDownloading = bulk.state === "downloading";
  const isPartial = bulk.state === "partial";

  // Button appearance based on bulk state
  if (isDownloading) {
    return (
      <>
        <button
          disabled
          title={`Descargando… ${bulk.progress}%`}
          className={`flex items-center justify-center gap-2 bg-gray-800/80 text-white rounded transition-colors disabled:opacity-80 ${className}`}
        >
          <Loader2 className="w-5 h-5 animate-spin shrink-0" />
          <span className="text-sm font-medium">
            {bulk.currentEpisode
              ? `T${bulk.currentEpisode.seasonNumber}E${bulk.currentEpisode.episodeNumber} ${bulk.progress}%`
              : `${bulk.progress}%`}
          </span>
        </button>
        <BulkDownloadModal
          isOpen={isOpen}
          containerRef={containerRef}
          contentTitle={contentTitle}
          seasonNumber={seasonNumber}
          episodes={episodes}
          fromEpisode={fromEpisode}
          toEpisode={toEpisode}
          onFromChange={setFromEpisode}
          onToChange={setToEpisode}
          minEpisode={minEpisode}
          maxEpisode={maxEpisode}
          bulkState={bulk.state}
          bulkProgress={bulk.progress}
          currentEpisode={bulk.currentEpisode}
          failed={bulk.failed}
          succeeded={bulk.succeeded}
          total={bulk.total}
          onSelect={handleSelect}
          onClose={handleClose}
        />
      </>
    );
  }

  if (isPartial) {
    return (
      <>
        <button
          onClick={handleOpen}
          title={`Descarga parcial: ${bulk.succeeded.length}/${bulk.total}. Click para ver detalles`}
          className={`flex items-center justify-center gap-2 bg-amber-600/80 hover:bg-amber-700/80 text-white rounded transition-colors ${className}`}
        >
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">Descarga parcial</span>
        </button>
        <BulkDownloadModal
          isOpen={isOpen}
          containerRef={containerRef}
          contentTitle={contentTitle}
          seasonNumber={seasonNumber}
          episodes={episodes}
          fromEpisode={fromEpisode}
          toEpisode={toEpisode}
          onFromChange={setFromEpisode}
          onToChange={setToEpisode}
          minEpisode={minEpisode}
          maxEpisode={maxEpisode}
          bulkState={bulk.state}
          bulkProgress={bulk.progress}
          currentEpisode={bulk.currentEpisode}
          failed={bulk.failed}
          succeeded={bulk.succeeded}
          total={bulk.total}
          onSelect={handleSelect}
          onClose={handleClose}
        />
      </>
    );
  }

  if (bulk.state === "done") {
    return (
      <>
        <button
          onClick={handleOpen}
          title="Temporada descargada"
          className={`flex items-center justify-center gap-2 bg-green-700/80 hover:bg-green-800/80 text-white rounded transition-colors ${className}`}
        >
          <Check className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">Temporada descargada</span>
        </button>
        <BulkDownloadModal
          isOpen={isOpen}
          containerRef={containerRef}
          contentTitle={contentTitle}
          seasonNumber={seasonNumber}
          episodes={episodes}
          fromEpisode={fromEpisode}
          toEpisode={toEpisode}
          onFromChange={setFromEpisode}
          onToChange={setToEpisode}
          minEpisode={minEpisode}
          maxEpisode={maxEpisode}
          bulkState={bulk.state}
          bulkProgress={bulk.progress}
          currentEpisode={bulk.currentEpisode}
          failed={bulk.failed}
          succeeded={bulk.succeeded}
          total={bulk.total}
          onSelect={handleSelect}
          onClose={handleClose}
        />
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleOpen}
        title="Descargar temporada o rango de capítulos"
        className={`flex items-center justify-center gap-2 bg-gray-800/80 hover:bg-gray-700/80 text-white rounded transition-colors ${className}`}
      >
        <Download className="w-5 h-5 shrink-0" />
        <span className="text-sm font-medium">Descargar capítulos</span>
      </button>

      <BulkDownloadModal
        isOpen={isOpen}
        containerRef={containerRef}
        contentTitle={contentTitle}
        seasonNumber={seasonNumber}
        episodes={episodes}
        fromEpisode={fromEpisode}
        toEpisode={toEpisode}
        onFromChange={setFromEpisode}
        onToChange={setToEpisode}
        minEpisode={minEpisode}
        maxEpisode={maxEpisode}
        bulkState={bulk.state}
        bulkProgress={bulk.progress}
        currentEpisode={bulk.currentEpisode}
        failed={bulk.failed}
        succeeded={bulk.succeeded}
        total={bulk.total}
        onSelect={handleSelect}
        onClose={handleClose}
      />
    </>
  );
}
