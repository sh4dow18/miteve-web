"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
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

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

export default function AccountPageWeb() {
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
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-[#e50914]/30 bg-[#e50914]/10 px-8 py-10 text-center"
        >
          <p className="text-sm text-[#e50914]">{error}</p>
          <Link
            href="/login"
            className="mt-5 inline-block text-xs font-medium text-gray-400 underline underline-offset-4 hover:text-white"
          >
            Volver al login
          </Link>
        </motion.div>
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
          className="absolute -left-32 -top-24 size-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle,rgba(229,9,20,.14) 0%,transparent 70%)",
            animation: "breathe 9s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -bottom-28 right-0 size-[480px] rounded-full"
          style={{
            background: "radial-gradient(circle,rgba(229,9,20,.09) 0%,transparent 70%)",
            animation: "breathe 11s 2s ease-in-out infinite",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 pt-20 pb-16 sm:px-8 sm:pt-14">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-5"
        >
          {/* ── Profile banner (full width, horizontal) ── */}
          <motion.div
            variants={item}
            className="flex flex-col gap-5 rounded-2xl border border-white/8 bg-white/[0.03] p-6 backdrop-blur-xl sm:flex-row sm:items-center sm:gap-6 sm:p-8"
          >
            {/* Avatar */}
            <div className="relative shrink-0 self-start sm:self-auto">
              <div
                className="flex size-20 items-center justify-center rounded-full text-2xl font-bold text-white"
                style={{ background: "linear-gradient(135deg,#e50914 0%,#b5060e 100%)" }}
              >
                {getInitials(account.email)}
              </div>
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-1 -right-1 size-5 rounded-full border-2 border-[#050507] bg-emerald-500"
              />
            </div>

            {/* Identity */}
            <div className="min-w-0 flex-1">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#e50914]/28 bg-[#e50914]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[.15em] text-[#e50914]/90">
                <User className="size-3" />
                Mi cuenta
              </div>
              <h1 className="text-xl font-semibold tracking-tight text-white truncate sm:text-2xl">
                {account.email}
              </h1>
              <p className="mt-0.5 text-sm text-gray-400">{account.role.name}</p>
              {isAdmin && (
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[#e50914]/30 bg-[#e50914]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[.12em] text-[#e50914]/90">
                  <Shield className="size-3" />
                  Administrador
                </div>
              )}
            </div>

            {/* Logout */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleLogout}
              className="flex shrink-0 items-center gap-2 self-start rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-gray-400 transition-colors duration-200 hover:border-[#e50914]/40 hover:bg-[#e50914]/10 hover:text-[#e50914] sm:self-auto"
            >
              <LogOut className="size-4" />
              Cerrar sesión
            </motion.button>
          </motion.div>

          {/* ── Info + Profiles (2-col) ── */}
          <div className={`grid gap-5 ${account.profilesList.length > 0 ? "md:grid-cols-2" : ""}`}>
            {/* Personal info */}
            <motion.div
              variants={item}
              className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 backdrop-blur-xl"
            >
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-[.12em] text-gray-400">
                Información personal
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-4 rounded-xl border border-white/6 bg-white/[0.02] px-4 py-3.5">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                    <Mail className="size-4 text-gray-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[.08em] text-gray-500">
                      Correo electrónico
                    </p>
                    <p className="mt-0.5 truncate text-sm font-medium text-white">
                      {account.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-xl border border-white/6 bg-white/[0.02] px-4 py-3.5">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                    <Shield className="size-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[.08em] text-gray-500">Rol</p>
                    <p className="mt-0.5 text-sm font-medium text-white">{account.role.name}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Profiles */}
            {account.profilesList.length > 0 && (
              <motion.div
                variants={item}
                className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 backdrop-blur-xl"
              >
                <h2 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.12em] text-gray-400">
                  <Users className="size-3.5" />
                  Perfiles
                </h2>
                <div className="flex flex-wrap gap-3">
                  {account.profilesList.map((profile) => (
                    <motion.div
                      key={profile.id}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 400, damping: 22 }}
                    >
                      <Link
                        href={`/profile/${profile.id}`}
                        className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 transition-colors duration-200 hover:border-white/20 hover:bg-white/[0.06]"
                      >
                        {profile.avatar ? (
                          <div className="relative size-9 shrink-0 overflow-hidden rounded-full">
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
                        <span className="text-sm font-medium text-gray-300 transition-colors duration-200 group-hover:text-white">
                          {profile.name}
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* ── Permissions (full width) ── */}
          <motion.div
            variants={item}
            className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 backdrop-blur-xl"
          >
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[.12em] text-gray-400">
              Permisos de cuenta
            </h2>
            {authorities.length === 0 ? (
              <p className="text-sm text-gray-500">Sin permisos especiales.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {authorities.map((auth, i) => (
                  <motion.span
                    key={auth}
                    initial={{ opacity: 0, scale: 0.88 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.06, duration: 0.35, ease: "easeOut" }}
                    className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-gray-300"
                  >
                    <Shield className="size-3 text-[#e50914]/70" />
                    {auth}
                  </motion.span>
                ))}
              </div>
            )}
          </motion.div>

          {/* ── Admin shortcut ── */}
          {isAdmin && (
            <motion.div variants={item}>
              <Link href="/admin">
                <motion.div
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  className="flex items-center justify-between rounded-2xl border border-[#e50914]/25 bg-[#e50914]/[0.08] p-5 backdrop-blur-xl transition-colors duration-200 hover:border-[#e50914]/50 hover:bg-[#e50914]/[0.14]"
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
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    className="text-lg text-[#e50914]"
                  >
                    →
                  </motion.span>
                </motion.div>
              </Link>
            </motion.div>
          )}

        </motion.div>
      </div>
    </div>
  );
}
