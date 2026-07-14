"use client";

import { useCallback } from "react";
import {
  useOfflineDownload,
  type DownloadState,
  type DownloadQuality,
} from "@/shared/lib/hooks/useOfflineDownload";
import { useQualityModal } from "@/widgets/download/model/useQualityModal";

interface UseDownloadButtonParams {
  contentId: string;
  contentTitle: string;
  cover: string;
  type: "movie" | "tv-show";
  seasonNumber?: number;
  episodeNumber?: number;
  episodeTitle?: string;
}

interface UseDownloadButtonReturn {
  state: DownloadState;
  progress: number;
  onRemove: () => void;
  onDownloadClick: () => void;
  modal: {
    isOpen: boolean;
    containerRef: React.RefObject<HTMLDivElement | null>;
    contentTitle: string;
    handleSelect: (quality: DownloadQuality) => void;
    handleClose: () => void;
  };
}

export function useDownloadButton(
  params: UseDownloadButtonParams
): UseDownloadButtonReturn {
  const { state, progress, download, remove } = useOfflineDownload(params);

  const modal = useQualityModal({
    contentTitle: params.episodeTitle
      ? `${params.contentTitle} – ${params.episodeTitle}`
      : params.contentTitle,
    onSelect: useCallback(
      (quality: DownloadQuality) => {
        download(quality);
      },
      [download]
    ),
  });

  const onDownloadClick = useCallback(() => {
    modal.open();
  }, [modal]);

  const onRemove = useCallback(() => {
    remove();
  }, [remove]);

  return {
    state,
    progress,
    onRemove,
    onDownloadClick,
    modal: {
      isOpen: modal.isOpen,
      containerRef: modal.containerRef,
      contentTitle: modal.contentTitle,
      handleSelect: modal.handleSelect,
      handleClose: modal.handleClose,
    },
  };
}
