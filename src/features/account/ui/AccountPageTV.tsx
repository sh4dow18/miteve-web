"use client";

import Link from "next/link";
import Image from "next/image";
import { LogOut, Mail, Shield, User, Users } from "lucide-react";
import { useAccount } from "../model/useAccount";

function getInitials(email: string) {
  return email.slice(0, 2).toUpperCase();
}

function profileInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

export default function AccountPageTV() {
  const { account, authorities, loading, error, handleLogout } = useAccount();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050507]">
        <div className="flex flex-col items-center gap-6">
          <div className="size-14 animate-spin rounded-full border-2 border-white/10 border-t-[#e50914]" />
          <p className="text-xl text-gray-400">Cargando cuenta…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050507] px-12">
        <div className="rounded-2xl border border-[#e50914]/30 bg-[#e50914]/10 px-12 py-14 text-center">
          <p className="text-lg text-[#e50914]">{error}</p>
          <Link
            href="/login"
            className="mt-6 inline-block text-base font-medium text-gray-400 underline underline-offset-4"
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
    <div className="min-h-screen bg-[#050507] px-10 py-8">

      {/* ── Profile banner (full width horizontal) ── */}
      <div className="mb-5 flex items-center gap-8 rounded-2xl border border-white/8 bg-white/[0.03] p-8">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div
            className="flex size-28 items-center justify-center rounded-full text-4xl font-bold text-white"
            style={{ background: "linear-gradient(135deg,#e50914 0%,#b5060e 100%)" }}
          >
            {getInitials(account.email)}
          </div>
          <div className="absolute -bottom-1 -right-1 size-7 rounded-full border-[3px] border-[#050507] bg-emerald-500" />
        </div>

        {/* Identity */}
        <div className="min-w-0 flex-1">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#e50914]/28 bg-[#e50914]/10 px-5 py-2 text-sm font-semibold uppercase tracking-[.15em] text-[#e50914]/90">
            <User className="size-4" />
            Mi cuenta
          </div>
          <p className="text-3xl font-semibold text-white truncate">{account.email}</p>
          <p className="mt-1 text-base text-gray-400">{account.role.name}</p>
          {isAdmin && (
            <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-[#e50914]/30 bg-[#e50914]/10 px-4 py-1.5 text-sm font-semibold uppercase tracking-[.12em] text-[#e50914]/90">
              <Shield className="size-4" />
              Administrador
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex shrink-0 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-7 py-4 text-lg font-medium text-gray-400 focus:border-[#e50914]/60 focus:bg-[#e50914]/10 focus:text-[#e50914] focus:outline-none focus:ring-2 focus:ring-[#e50914]/40"
        >
          <LogOut className="size-6" />
          Cerrar sesión
        </button>
      </div>

      {/* ── 2-col grid: info + profiles ── */}
      <div className={`grid gap-5 ${account.profilesList.length > 0 ? "grid-cols-2" : ""} mb-5`}>
        {/* Personal info */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[.12em] text-gray-400">
            Información personal
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-4 rounded-xl border border-white/6 bg-white/[0.02] px-5 py-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                <Mail className="size-5 text-gray-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[.08em] text-gray-500">
                  Correo electrónico
                </p>
                <p className="mt-1 truncate text-base font-medium text-white">{account.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-xl border border-white/6 bg-white/[0.02] px-5 py-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                <Shield className="size-5 text-gray-400" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[.08em] text-gray-500">Rol</p>
                <p className="mt-1 text-base font-medium text-white">{account.role.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profiles */}
        {account.profilesList.length > 0 && (
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6">
            <h2 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.12em] text-gray-400">
              <Users className="size-4" />
              Perfiles
            </h2>
            <div className="flex flex-wrap gap-3">
              {account.profilesList.map((profile) => (
                <Link
                  key={profile.id}
                  href={`/profile/${profile.id}`}
                  className="flex items-center gap-4 rounded-xl border border-white/8 bg-white/[0.03] px-5 py-3.5 text-base font-medium text-gray-300 focus:border-[#e50914]/50 focus:bg-[#e50914]/[0.08] focus:text-white focus:outline-none focus:ring-2 focus:ring-[#e50914]/30"
                >
                  {profile.avatar ? (
                    <div className="relative size-11 shrink-0 overflow-hidden rounded-full">
                      <Image src={profile.avatar} alt={profile.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div
                      className="flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                      style={{ background: "linear-gradient(135deg,#e50914 0%,#b5060e 100%)" }}
                    >
                      {profileInitials(profile.name)}
                    </div>
                  )}
                  {profile.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Permissions (full width) ── */}
      <div className="mb-5 rounded-2xl border border-white/8 bg-white/[0.03] p-6">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-[.12em] text-gray-400">
          Permisos de cuenta
        </h2>
        {authorities.length === 0 ? (
          <p className="text-base text-gray-500">Sin permisos especiales.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {authorities.map((auth) => (
              <span
                key={auth}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300"
              >
                <Shield className="size-4 text-[#e50914]/70" />
                {auth}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Admin shortcut (full width) ── */}
      {isAdmin && (
        <Link
          href="/admin"
          className="flex items-center justify-between rounded-2xl border border-[#e50914]/25 bg-[#e50914]/[0.08] p-6 focus:border-[#e50914]/60 focus:bg-[#e50914]/[0.16] focus:outline-none focus:ring-2 focus:ring-[#e50914]/40"
        >
          <div className="flex items-center gap-5">
            <div className="flex size-14 items-center justify-center rounded-xl border border-[#e50914]/30 bg-[#e50914]/15">
              <Shield className="size-7 text-[#e50914]" />
            </div>
            <div>
              <p className="text-xl font-semibold text-white">Panel de administración</p>
              <p className="text-sm text-gray-400">Gestiona contenido, géneros y episodios</p>
            </div>
          </div>
          <span className="text-2xl text-[#e50914]">→</span>
        </Link>
      )}
    </div>
  );
}
