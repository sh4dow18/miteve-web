"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Monitor, Smartphone } from "lucide-react";
import type { DownloadQuality } from "@/shared/lib/hooks/useOfflineDownload";

interface QualityModalProps {
  isOpen: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  contentTitle: string;
  onSelect: (quality: DownloadQuality) => void;
  onClose: () => void;
}

export function QualityModal({
  isOpen,
  containerRef,
  contentTitle,
  onSelect,
  onClose,
}: QualityModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="quality-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={onClose}
        >
          <motion.div
            ref={containerRef}
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#111116] p-8 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2
                id="quality-modal-title"
                className="text-lg font-semibold text-white"
              >
                Seleccionar calidad
              </h2>
              <button
                onClick={onClose}
                aria-label="Cerrar diálogo"
                className="flex size-10 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white focus:outline-none focus:ring-2 focus:ring-white"
              >
                <X className="size-5" />
              </button>
            </div>

            <p className="mb-6 text-sm text-gray-400">
              Elige la calidad de descarga para &quot;{contentTitle}&quot;
            </p>

            <div className="space-y-3">
              <button
                onClick={() => onSelect("fhd")}
                className="flex w-full items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 text-left transition-colors hover:border-white/30 hover:bg-white/10 focus:border-white/30 focus:bg-white/10 focus:outline-none"
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-blue-500/20">
                  <Monitor className="size-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">Full HD</p>
                  <p className="text-sm text-gray-400">
                    Mayor calidad, mayor tamaño
                  </p>
                </div>
              </button>

              <button
                onClick={() => onSelect("sd")}
                className="flex w-full items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 text-left transition-colors hover:border-white/30 hover:bg-white/10 focus:border-white/30 focus:bg-white/10 focus:outline-none"
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-green-500/20">
                  <Smartphone className="size-6 text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">SD</p>
                  <p className="text-sm text-gray-400">
                    Calidad estándar, menor tamaño
                  </p>
                </div>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
