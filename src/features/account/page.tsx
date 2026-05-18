"use client";

import Link from "next/link";
import Image from "next/image";
import { LogOut, Mail, Shield, User, Users } from "lucide-react";
import { useAccount } from "./model/useAccount";

function getInitials(email: string): string {
  return email.slice(0, 2).toUpperCase();
}

function profileInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

export default function AccountPage() {
  const { account, authorities, loading, error, handleLogout } = useAccount();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050507]">
        <div className="flex flex-col items-center gap-4">
          <div className="size-10 animate-spin rounded-full border-2 border-white/10 border-t-[#e50914]" />
          <p className="text-sm text-gray-400">Cargando cuenta…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050507] px-6">
        <div className="rounded-2xl border border-[#e50914]/30 bg-[#e50914]/10 px-8 py-10 text-center">
          <p className="text-sm text-[#e50914]">{error}</p>
          <Link
            href="/login"
            className="mt-5 inline-block text-xs font-medium text-gray-400 underline underline-offset-4 hover:text-white"
          >
            Volver al login
          </Link>
        </div>
      </div>
    );
  }

  if (!account) return null;

  const isAdmin = authorities.includes("read-admin-page");

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050507]">
      {/* Ambient orbs */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute -left-32 -top-24 size-150 rounded-full"
          style={{
            background: "radial-gradient(circle,rgba(229,9,20,.14) 0%,transparent 70%)",
            animation: "breathe 9s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -bottom-28 right-0 size-120 rounded-full"
          style={{
            background: "radial-gradient(circle,rgba(229,9,20,.09) 0%,transparent 70%)",
            animation: "breathe 11s 2s ease-in-out infinite",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 pt-20 pb-12 sm:px-10 sm:pt-16">
        {/* Header */}
        <div
          className="mb-10"
          style={{ animation: "slideUp .7s cubic-bezier(.22,1,.36,1) both" }}
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#e50914]/28 bg-[#e50914]/10 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[.15em] text-[#e50914]/90">
            <User className="size-3" />
            Mi cuenta
          </div>
          <h1 className="text-xl sm:text-3xl font-semibold tracking-tight text-white break-all">
            {account.email}
          </h1>
          <p className="mt-1.5 text-sm text-gray-400">
            Gestiona tu información y preferencias
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-5">
          {/* ── Avatar card ── */}
          <div
            className="flex flex-col items-center gap-5 rounded-2xl border border-white/8 bg-white/3 p-5 sm:p-8 backdrop-blur-xl lg:col-span-2"
            style={{ animation: "slideUp .75s .05s cubic-bezier(.22,1,.36,1) both" }}
          >
            {/* Avatar */}
            <div className="relative">
              <div
                className="flex size-24 items-center justify-center rounded-full text-3xl font-bold text-white"
                style={{ background: "linear-gradient(135deg,#e50914 0%,#b5060e 100%)" }}
              >
                {getInitials(account.email)}
              </div>
              <div className="absolute -bottom-1 -right-1 size-6 rounded-full border-2 border-[#050507] bg-emerald-500" />
            </div>

            <div className="text-center w-full">
              <p className="text-base font-semibold text-white break-all">{account.email.split("@")[0]}</p>
              <p className="mt-0.5 text-xs text-gray-400">{account.role.name}</p>
            </div>

            {isAdmin && (
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#e50914]/30 bg-[#e50914]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[.12em] text-[#e50914]/90">
                <Shield className="size-3" />
                Administrador
              </div>
            )}

            <button
              onClick={handleLogout}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/4 py-2.5 text-sm font-medium text-gray-400 transition-all duration-200 hover:border-[#e50914]/40 hover:bg-[#e50914]/10 hover:text-[#e50914]"
            >
              <LogOut className="size-4" />
              Cerrar sesión
            </button>
          </div>

          {/* ── Info cards ── */}
          <div
            className="flex flex-col gap-5 lg:col-span-3"
            style={{ animation: "slideUp .75s .1s cubic-bezier(.22,1,.36,1) both" }}
          >
            {/* Personal info card */}
            <div className="rounded-2xl border border-white/8 bg-white/3 p-6 backdrop-blur-xl">
              <h2 className="mb-5 text-xs font-semibold uppercase tracking-[.12em] text-gray-400">
                Información personal
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 rounded-xl border border-white/6 bg-white/2 px-4 py-3.5">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                    <Mail className="size-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[.08em] text-gray-500">
                      Correo electrónico
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-white break-all">
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-xl border border-white/6 bg-white/2 px-4 py-3.5">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                    <Shield className="size-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[.08em] text-gray-500">
                      Rol
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-white">
                      {account.role.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profiles card */}
            {account.profilesList.length > 0 && (
              <div className="rounded-2xl border border-white/8 bg-white/3 p-6 backdrop-blur-xl">
                <h2 className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.12em] text-gray-400">
                  <Users className="size-3.5" />
                  Perfiles
                </h2>
                <div className="flex flex-wrap gap-3">
                  {account.profilesList.map((profile) => (
                    <Link
                      key={profile.id}
                      href={`/profile/${profile.id}`}
                      className="group flex items-center gap-3 rounded-xl border border-white/8 bg-white/3 px-4 py-3 transition-all duration-200 hover:border-white/20 hover:bg-white/6"
                    >
                      {profile.avatar ? (
                        <div className="relative size-9 overflow-hidden rounded-full shrink-0">
                          <Image
                            src={profile.avatar}
                            alt={profile.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div
                          className="flex size-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                          style={{ background: "linear-gradient(135deg,#e50914 0%,#b5060e 100%)" }}
                        >
                          {profileInitials(profile.name)}
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                        {profile.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Authorities / permissions card */}
            <div className="rounded-2xl border border-white/8 bg-white/3 p-6 backdrop-blur-xl">
              <h2 className="mb-5 text-xs font-semibold uppercase tracking-[.12em] text-gray-400">
                Permisos de cuenta
              </h2>
              {authorities.length === 0 ? (
                <p className="text-sm text-gray-500">Sin permisos especiales.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {authorities.map((auth) => (
                    <span
                      key={auth}
                      className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-gray-300"
                    >
                      <Shield className="size-3 text-[#e50914]/70" />
                      {auth}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Admin shortcut */}
            {isAdmin && (
              <Link
                href="/admin"
                className="group flex items-center justify-between rounded-2xl border border-[#e50914]/25 bg-[#e50914]/8 p-5 backdrop-blur-xl transition-all duration-200 hover:border-[#e50914]/50 hover:bg-[#e50914]/14"
              >
                <div className="flex items-center gap-4">
                  <div className="flex size-10 items-center justify-center rounded-xl border border-[#e50914]/30 bg-[#e50914]/15">
                    <Shield className="size-5 text-[#e50914]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Panel de administración</p>
                    <p className="text-xs text-gray-400">Gestiona contenido, géneros y episodios</p>
                  </div>
                </div>
                <span className="text-[#e50914] transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
