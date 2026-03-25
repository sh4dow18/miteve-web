import { Settings } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";

// Movies Page Metadata
export const metadata: Metadata = {
  title: "En mantenimiento",
  description:
    "Estamos mejorando tu experiencia. Volveremos pronto con novedades.",
};

export default function MaintenancePage() {
  return (
    <div className="relative min-h-screen bg-[#141414] flex flex-col items-center justify-center overflow-hidden px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute z-0 maintenance-bg-gradient"
      />
      <header className="relative z-10 animate-[fadeDown_0.6s_ease_both] mb-8">
        <Image
          src="/logo-letters.png"
          alt="Miteve"
          height={187}
          width={674}
          className="w-auto h-16"
        />
      </header>
      <div className="relative z-10 w-full max-w-md text-center animate-[fadeUp_0.7s_ease_both] maintenance-main-animation-delay">
        <div className="mb-8 flex justify-center">
          <div className="relative flex items-center justify-center rounded-full bg-primary-light p-4 maintenance-logo-bg">
            <Settings className="w-10 h-10 text-primary" />
          </div>
        </div>
        <h1 className="mb-3 font-bold tracking-tight text-white text-3xl">
          En mantenimiento
        </h1>
        <div className="mx-auto mb-6 h-px w-12 bg-primary opacity-70" />
        <p className="mx-auto mb-10 max-w-sm leading-relaxed text-[#a3a3a3]">
          Estamos mejorando tu experiencia. Volveremos pronto con novedades.
        </p>
        <div
          className="mx-auto mb-10 h-px w-48 overflow-hidden rounded-full bg-[#2a2a2a]"
          aria-hidden="true"
        >
          <div className="h-full rounded-full bg-primary animate-[progressPulse_2.5s_ease-in-out_infinite] w-[60%]" />
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-2">
          <span
            className="block h-2 w-2 rounded-full bg-primary animate-[pulse_1.8s_ease-in-out_infinite]"
            aria-hidden="true"
          />
          <span className="text-xs tracking-widest text-[#737373] uppercase">
            Trabajando en ello
          </span>
        </div>
      </div>
    </div>
  );
}
