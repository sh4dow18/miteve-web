import { Download, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function MaintenanceFeaturePage() {
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
        <p className="mx-auto mb-8 max-w-sm leading-relaxed text-[#a3a3a3]">
          Estamos mejorando tu experiencia. Volveremos pronto con novedades.
        </p>
        <Link
          href="/downloads"
          className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(45,156,219,.35)] transition-all duration-200 hover:-translate-y-px hover:scale-105 hover:shadow-[0_12px_32px_rgba(45,156,219,.45)] focus:outline-none focus:ring-2 focus:ring-primary/50"
          style={{
            background: "linear-gradient(135deg, #2d9cdb 0%, #1a7ab8 100%)",
          }}
        >
          <Download className="w-4 h-4 transition-transform duration-200 group-hover:-translate-y-px" />
          Descargas offline
        </Link>
        <div
          className="mx-auto mt-8 mb-10 h-px w-48 overflow-hidden rounded-full bg-[#2a2a2a]"
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
