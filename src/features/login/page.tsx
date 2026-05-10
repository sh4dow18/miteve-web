"use client";

import Link from "next/link";
import { ArrowRight, LogIn, Eye, EyeOff } from "lucide-react";
import { useLoginForm } from "./model/useLoginForm";

export default function LoginPage() {
  const {
    showPassword,
    toggleShowPassword,
    form,
    handleChange,
    handleSubmit,
  } = useLoginForm();

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#050507]">
      {/* ── Ambient orbs ── */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute -left-32 -top-20 size-130 rounded-full"
          style={{
            background:
              "radial-gradient(circle,rgba(229,9,20,.20) 0%,transparent 70%)",
            animation: "breathe 7s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -bottom-24 right-0 size-105 rounded-full"
          style={{
            background:
              "radial-gradient(circle,rgba(229,9,20,.12) 0%,transparent 70%)",
            animation: "breathe 9s 2s ease-in-out infinite",
          }}
        />
        {/* Film grain */}
        <div
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      {/* ════════ LEFT — Visual panel ════════ */}
      <div
        className="relative z-10 hidden flex-col justify-end border-r border-white/6 p-10 lg:flex lg:flex-1 xl:p-14"
        style={{ animation: "slideUp .8s cubic-bezier(.22,1,.36,1) both" }}
      >
        {/* Film-reel accent */}
        <div
          className="absolute right-0 top-0 h-full w-px"
          style={{
            background:
              "repeating-linear-gradient(to bottom,rgba(229,9,20,.45) 0px,rgba(229,9,20,.45) 18px,transparent 18px,transparent 26px)",
          }}
        />

        <div className="max-w-xl">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#e50914]/30 bg-[#e50914]/10 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[.15em] text-[#e50914]/90">
            <LogIn className="size-3" />
            Acceso opcional
          </div>

          <h1 className="text-6xl leading-[1.04] tracking-tight text-gray-400 xl:text-7xl">
            Tu pantalla.
            <br />
            <em className="font-semibold not-italic text-[#e50914]/80">
              Tu historia.
            </em>
          </h1>

          <p className="mt-5 text-sm/relaxed text-gray-400 xl:text-base">
            Inicia sesión para guardar favoritos, retomar reproducciones y
            recibir recomendaciones personalizadas. O continúa como invitado.
          </p>

          <Link
            href="/home"
            className="mt-8 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-gray-400 backdrop-blur-sm transition-all duration-300 hover:translate-x-1 hover:border-white/25 hover:bg-white/10 hover:text-[#e50914]"
          >
            Continuar como invitado
            <ArrowRight className="size-4" />
          </Link>

          {/* Stats */}
          <div className="mt-12 flex gap-10 border-t border-white/[.07] pt-8">
            {[
              { num: "Full HD", label: "Resolución" },
              { num: "∞", label: "Entretenimiento" },
            ].map(({ num, label }) => (
              <div key={label}>
                <p className="text-3xl font-semibold text-gray-400">{num}</p>
                <p className="mt-1 text-[10px] uppercase tracking-widest text-gray-400">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════ RIGHT — Form panel ════════ */}
      <div
        className="relative z-10 flex flex-1 flex-col justify-center bg-black/55 px-6 py-12 backdrop-blur-2xl sm:px-10 lg:max-w-120 xl:max-w-130 xl:px-14"
        style={{
          animation: "fadeInRight .9s .15s cubic-bezier(.22,1,.36,1) both",
        }}
      >
        {/* Inner top glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 0%,rgba(229,9,20,.06) 0%,transparent 70%)",
          }}
        />

        <div className="relative">
          <h2 className="text-4xl font-semibold text-gray-400">
            Bienvenido de vuelta
          </h2>
          <p className="mt-1.5 text-sm text-gray-400">
            Ingresa tus datos para retomar tu contenido
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="mb-2 block text-[11px] font-medium uppercase tracking-[.09em] text-gray-400">
                Correo electrónico
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="tu@email.com"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/4 px-4 py-3.5 text-sm text-gray-400 placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-[#e50914]/50 focus:bg-[#e50914]/4 focus:ring-2 focus:ring-[#e50914]/10"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-[11px] font-medium uppercase tracking-[.09em] text-gray-400">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-white/4 px-4 py-3.5 pr-12 text-sm text-gray-400 placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-[#e50914]/50 focus:bg-[#e50914]/4 focus:ring-2 focus:ring-[#e50914]/10"
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 transition-colors hover:text-[#e50914]"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              <a
                href="#"
                className="mt-2 block text-right text-xs text-gray-400 transition-colors hover:text-[#e50914]/80"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="group relative mt-1 w-full overflow-hidden rounded-xl py-3.5 text-sm font-semibold tracking-wide text-white transition-all duration-200 hover:-translate-y-px hover:shadow-[0_8px_28px_rgba(229,9,20,.38)] active:translate-y-0"
              style={{
                background: "linear-gradient(135deg,#e50914 0%,#b5060e 100%)",
              }}
            >
              <span
                className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(135deg,rgba(255,255,255,.10) 0%,transparent 60%)",
                }}
              />
              <span className="relative">Iniciar sesión</span>
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/[.07]" />
            <span className="text-[10px] uppercase tracking-widest text-gray-400">
              o
            </span>
            <div className="h-px flex-1 bg-white/[.07]" />
          </div>

          {/* Register CTA */}
          <Link
            href="/register"
            className="flex items-center justify-center rounded-xl border border-white/10 bg-white/3 py-3.5 text-sm font-medium text-gray-400 transition-all duration-200 hover:border-white/20 hover:text-[#e50914]"
          >
            Crear cuenta nueva
          </Link>

          <p className="mt-6 text-center text-xs text-gray-400">
            ¿Prefieres explorar?{" "}
            <Link
              href="/home"
              className="font-medium text-gray-400 transition-colors hover:text-[#ff4d57]"
            >
              Entra como invitado
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
