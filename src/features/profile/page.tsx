"use client";

import Image from "next/image";
import Link from "next/link";
import { RefreshCw, User } from "lucide-react";
import { useProfile } from "./model/useProfile";

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

export default function ProfilePage({ id }: { id: string }) {
  const { profile, loading, error } = useProfile(id);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050507]">
        <div className="flex flex-col items-center gap-4">
          <div className="size-10 animate-spin rounded-full border-2 border-white/10 border-t-[#e50914]" />
          <p className="text-sm text-gray-400">Cargando perfil…</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050507] px-6">
        <div className="rounded-2xl border border-[#e50914]/30 bg-[#e50914]/10 px-8 py-10 text-center">
          <p className="text-sm text-[#e50914]">{error ?? "Perfil no encontrado."}</p>
          <Link
            href="/home"
            className="mt-5 inline-block text-xs font-medium text-gray-400 underline underline-offset-4 hover:text-white"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050507]">
      {/* Ambient orbs */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute -right-24 -top-20 size-140 rounded-full"
          style={{
            background: "radial-gradient(circle,rgba(229,9,20,.13) 0%,transparent 70%)",
            animation: "breathe 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -bottom-24 left-0 size-110 rounded-full"
          style={{
            background: "radial-gradient(circle,rgba(229,9,20,.08) 0%,transparent 70%)",
            animation: "breathe 11s 2s ease-in-out infinite",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl px-6 py-16 sm:px-10">
        {/* Badge */}
        <div
          className="mb-8"
          style={{ animation: "slideUp .7s cubic-bezier(.22,1,.36,1) both" }}
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#e50914]/28 bg-[#e50914]/10 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[.15em] text-[#e50914]/90">
            <User className="size-3" />
            Perfil activo
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-white">
            {profile.name}
          </h1>
        </div>

        {/* Profile card */}
        <div
          className="overflow-hidden rounded-2xl border border-white/8 bg-white/3 backdrop-blur-xl"
          style={{ animation: "slideUp .75s .08s cubic-bezier(.22,1,.36,1) both" }}
        >
          {/* Cover gradient */}
          <div
            className="h-32 w-full"
            style={{
              background:
                "linear-gradient(135deg,rgba(229,9,20,.35) 0%,rgba(181,6,14,.20) 50%,rgba(5,5,7,.80) 100%)",
            }}
          />

          <div className="px-8 pb-8">
            {/* Avatar */}
            <div className="-mt-12 mb-5">
              {profile.avatar ? (
                <div className="relative size-24 overflow-hidden rounded-full border-4 border-[#050507]">
                  <Image
                    src={profile.avatar}
                    alt={profile.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div
                  className="flex size-24 items-center justify-center rounded-full border-4 border-[#050507] text-3xl font-bold text-white"
                  style={{ background: "linear-gradient(135deg,#e50914 0%,#b5060e 100%)" }}
                >
                  {initials(profile.name)}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-4">
              <div className="rounded-xl border border-white/6 bg-white/2 px-4 py-3.5">
                <p className="text-[10px] uppercase tracking-[.08em] text-gray-500">Nombre del perfil</p>
                <p className="mt-0.5 text-sm font-medium text-white">{profile.name}</p>
              </div>
            </div>

            {/* Back link */}
            <div className="mt-7 flex gap-3">
              <Link
                href="/account"
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/4 px-4 py-2.5 text-sm font-medium text-gray-400 transition-all duration-200 hover:border-white/20 hover:text-white"
              >
                <User className="size-4" />
                Mi cuenta
              </Link>
              <Link
                href="/profile/switch"
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/4 px-4 py-2.5 text-sm font-medium text-gray-400 transition-all duration-200 hover:border-white/20 hover:text-white"
              >
                <RefreshCw className="size-4" />
                Cambiar perfil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
