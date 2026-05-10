"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, UserPlus, Eye, EyeOff, Check } from "lucide-react";
import { useRegisterForm } from "./model/useRegisterForm";

const PERKS = [
  "Guarda películas y series favoritas",
  "Recomendaciones personalizadas",
  "Continúa donde lo dejaste",
  "Acceso sin anuncios",
];

export default function RegisterPage() {
  const {
    showPassword,
    toggleShowPassword,
    agreed,
    toggleAgreed,
    password,
    setPassword,
    strength,
    form,
    handleChange,
    handleSubmit,
  } = useRegisterForm();
  const strengthColors = ["bg-white/10", "bg-[#e50914]/60", "bg-orange-400/70", "bg-yellow-400/70", "bg-emerald-400/80"];
  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#050507]">
      {/* ── Ambient orbs ── */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute -right-28 -top-16 size-140 rounded-full"
          style={{
            background: "radial-gradient(circle,rgba(229,9,20,.16) 0%,transparent 70%)",
            animation: "breathe 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -bottom-20 left-0 size-110 rounded-full"
          style={{
            background: "radial-gradient(circle,rgba(229,9,20,.10) 0%,transparent 70%)",
            animation: "breathe 10s 1.5s ease-in-out infinite",
          }}
        />
        <div
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      {/* ════════ LEFT — Form panel ════════ */}
      <div
        className="relative z-10 flex flex-1 flex-col justify-center border-r border-white/6 bg-black/60 px-6 py-12 backdrop-blur-2xl sm:px-10 lg:max-w-125 xl:px-14"
        style={{ animation: "slideInLeft .85s cubic-bezier(.22,1,.36,1) both" }}
      >
        {/* Subtle top glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 40% at 50% 0%,rgba(229,9,20,.05) 0%,transparent 70%)",
          }}
        />

        <div className="relative">
          {/* Badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#e50914]/28 bg-[#e50914]/10 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[.15em] text-primary">
            <UserPlus className="size-3" />
            Nuevo usuario
          </div>

          <h1
              className="text-4xl font-semibold leading-[1.06] tracking-tight text-gray-400 xl:text-5xl"
          >
            Crea tu cuenta<br />en minutos
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Gratis. Sin compromisos. Cancela cuando quieras.
          </p>

          <form className="mt-7 space-y-4" onSubmit={handleSubmit}>

            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[.09em] text-gray-400">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  required
                  placeholder="Tu nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-gray-400 placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-[#e50914]/50 focus:bg-[#e50914]/4 focus:ring-2 focus:ring-[#e50914]/10"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[.09em] text-gray-400">
                  Apellido
                </label>
                <input
                  type="text"
                  name="apellido"
                  placeholder="Opcional"
                  value={form.apellido}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-gray-400 placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-[#e50914]/50 focus:bg-[#e50914]/4 focus:ring-2 focus:ring-[#e50914]/10"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[.09em] text-gray-400
              ">
                Correo electrónico
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="tu@email.com"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-gray-400 placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-[#e50914]/50 focus:bg-[#e50914]/4 focus:ring-2 focus:ring-[#e50914]/10"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[.09em] text-gray-400">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="Mínimo 8 caracteres"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-white/4 px-4 py-3 pr-12 text-sm text-gray-400 placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-[#e50914]/50 focus:bg-[#e50914]/4 focus:ring-2 focus:ring-[#e50914]/10"
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 transition-colors hover:text-[#e50914]"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {/* Strength bar */}
              <div className="mt-2 flex gap-1.5">
                {[0,1,2,3].map((i) => (
                  <div
                    key={i}
                    className={`h-0.75 flex-1 rounded-full transition-all duration-300 ${i < strength ? strengthColors[strength] : "bg-white/8"}`}
                  />
                ))}
              </div>
            </div>

            {/* Checkbox */}
            <button
              type="button"
              className="flex items-start gap-3 text-left"
              onClick={toggleAgreed}
            >
              <div
                className={`mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-md border transition-all duration-200 ${
                  agreed
                    ? "border-[#e50914]/80 bg-[#e50914]/80"
                    : "border-white/15 bg-white/4"
                }`}
              >
                {agreed && <Check className="size-2.5 text-gray-400" strokeWidth={3} />}
              </div>
              <span className="text-xs/relaxed text-gray-400">
                Acepto los{" "}
                <span className="underline underline-offset-2 text-gray-400">Términos de servicio</span>{" "}
                y la{" "}
                <span className="underline underline-offset-2 text-gray-400">Política de privacidad</span>{" "}
                de Miteve.
              </span>
            </button>

            {/* Submit */}
            <button
              type="submit"
              className="group relative mt-1 w-full overflow-hidden rounded-xl py-3.5 text-sm font-semibold tracking-wide text-gray-400 transition-all duration-200 hover:-translate-y-px hover:shadow-[0_8px_28px_rgba(229,9,20,.38)] active:translate-y-0"
              style={{ background: "linear-gradient(135deg,#e50914 0%,#b5060e 100%)" }}
            >
              <span
                className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                style={{ background: "linear-gradient(135deg,rgba(255,255,255,.10) 0%,transparent 60%)" }}
              />
              <span className="relative">Crear cuenta gratis</span>
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-gray-400">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/login"
              className="font-medium text-gray-400 transition-colors hover:text-[#ff4d57]"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>

      {/* ════════ RIGHT — Visual panel ════════ */}
      <div
        className="relative z-10 hidden flex-col justify-center p-10 lg:flex lg:flex-1 xl:p-14"
        style={{ animation: "slideInRight .85s .1s cubic-bezier(.22,1,.36,1) both" }}
      >
        <div className="max-w-lg">
          {/* Tag */}
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[.15em] text-primary">
            <Sparkles className="size-3" />
            Tu cuenta, tu ritmo
          </div>

          <h2
            className="text-5xl leading-[1.04] tracking-tight text-gray-400 xl:text-6xl"
          >
            Descubre el cine<br />
            como{" "}
            <em className="font-semibold not-italic text-primary">nunca antes.</em>
          </h2>
          <ul className="mt-8 space-y-3.5">
            {PERKS.map((perk, i) => (
              <li
                key={perk}
                className="flex items-center gap-3 text-sm text-gray-400"
                style={{ animation: `fadeItem .5s ${0.3 + i * 0.1}s ease both` }}
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-[#e50914]/25 bg-[#e50914]/10">
                  <Check className="size-3 text-primary" strokeWidth={2.5} />
                </span>
                {perk}
              </li>
            ))}
          </ul>

          <Link
            href="/home"
            className="mt-9 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/4 px-5 py-3 text-sm font-medium text-gray-400 transition-all duration-300 hover:translate-x-1 hover:border-white/22 hover:text-[#e50914]"
          >
            Seguir como invitado
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}