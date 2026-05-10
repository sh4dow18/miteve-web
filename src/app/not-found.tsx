"use client";

import Link from "next/link";
import { Home, Search, ArrowLeft, Film } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#050507] px-6 text-center">
      {/* ── Ambient orbs ── */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute left-1/2 top-1/2 size-175 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle,rgba(229,9,20,.11) 0%,transparent 65%)",
            animation: "breathe 8s ease-in-out infinite",
          }}
        />
        {/* Film-grain */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
          }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.4) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* ── Film reel decorations ── */}
      <div className="pointer-events-none absolute left-8 top-8 opacity-10 hidden lg:block">
        <div
          className="size-24 rounded-full border-4 border-white/60"
          style={{ animation: "roll 12s linear infinite" }}
        >
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <div
              key={deg}
              className="absolute size-4 rounded-full bg-white/60"
              style={{
                top: "50%",
                left: "50%",
                transform: `rotate(${deg}deg) translateY(-34px) translate(-50%,-50%)`,
              }}
            />
          ))}
          <div className="absolute inset-[28%] rounded-full bg-white/60" />
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-8 right-8 opacity-10 hidden lg:block">
        <div
          className="size-20 rounded-full border-4 border-white/60"
          style={{ animation: "roll 10s linear infinite reverse" }}
        >
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <div
              key={deg}
              className="absolute size-3 rounded-full bg-white/60"
              style={{
                top: "50%",
                left: "50%",
                transform: `rotate(${deg}deg) translateY(-28px) translate(-50%,-50%)`,
              }}
            />
          ))}
          <div className="absolute inset-[28%] rounded-full bg-white/60" />
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Film icon */}
        <div
          className="mb-6 flex size-14 items-center justify-center rounded-2xl border border-[#e50914]/25 bg-[#e50914]/10"
          style={{ animation: "fadeUp .6s ease both" }}
        >
          <Film className="size-6 text-[#e50914]/80" />
        </div>

        {/* 404 glitch number */}
        <p className="text-[clamp(7rem,22vw,16rem)] font-black leading-none tracking-tighter text-white">
          404
        </p>

        {/* Divider line */}
        <div
          className="mb-6 mt-2 flex items-center gap-4"
          style={{ animation: "fadeUp .6s .2s ease both" }}
        >
          <div className="h-px w-16 bg-linear-to-r from-transparent to-[#e50914]/50" />
          <span className="text-[10px] uppercase tracking-[.25em] text-gray-400">
            Señal perdida
          </span>
          <div className="h-px w-16 bg-linear-to-l from-transparent to-[#e50914]/50" />
        </div>

        {/* Text */}
        <h1
          className="text-2xl font-semibold text-white sm:text-3xl"
          style={{
            animation: "fadeUp .6s .3s ease both",
          }}
        >
          Esta escena no existe
        </h1>
        <p
          className="mt-3 max-w-sm text-sm/relaxed text-gray-400"
          style={{ animation: "fadeUp .6s .4s ease both" }}
        >
          La página que buscas fue cortada en la edición final, o nunca formó
          parte del guión.
        </p>

        {/* CTA buttons */}
        <div
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
          style={{ animation: "fadeUp .6s .5s ease both" }}
        >
          <Link
            href="/home"
            className="group flex items-center gap-2 rounded-xl border border-transparent py-3 pl-4 pr-5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(229,9,20,.35)]"
            style={{
              background: "linear-gradient(135deg,#e50914 0%,#b5060e 100%)",
            }}
          >
            <Home className="size-4 transition-transform duration-200 group-hover:-translate-y-px" />
            Ir al inicio
          </Link>

          <Link
            href="/search"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-gray-400 backdrop-blur-sm transition-all duration-200 hover:border-white/20 hover:text-white"
          >
            <Search className="size-4" />
            Buscar contenido
          </Link>
        </div>

        {/* Back link */}
        <button
          onClick={() => window.history.back()}
          className="mt-6 flex items-center gap-1.5 text-xs text-gray-400 transition-colors hover:text-white/50"
          style={{ animation: "fadeUp .6s .6s ease both" }}
        >
          <ArrowLeft className="size-3" />
          Volver a la página anterior
        </button>
      </div>
    </div>
  );
}
