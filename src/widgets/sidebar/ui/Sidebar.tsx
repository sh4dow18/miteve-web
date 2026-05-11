"use client";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSidebar } from "@/widgets/sidebar/model/useSidebar";

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

export function Sidebar() {
  const { menuItems, authItem, mainProfile, isLoggedIn, drawerOpen, isActive, openDrawer, closeDrawer } =
    useSidebar();
  const AuthIcon = authItem.icon;

  return (
    <>
      {/* ── Desktop sidebar (md+) ─────────────────────────────────────────────── */}
      <div className="hidden md:flex fixed left-0 top-0 h-full w-20 bg-black/95 flex-col items-center py-8 z-50">
        {/* Logo */}
        <div className="mb-12">
          <Image
            src="/logo.png"
            alt="Miteve"
            width={40}
            height={40}
            style={{ width: "auto", height: "auto" }}
          />
        </div>

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex flex-col items-center gap-1 transition-all duration-200 relative group ${
                  active ? "text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                {active && (
                  <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#e50914] rounded-r" />
                )}
                <Icon
                  className={`w-6 h-6 transition-transform group-hover:scale-110 ${
                    active ? "scale-110" : ""
                  }`}
                />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-white/10 flex flex-col items-center gap-5">
          {/* Profile avatar — shown when logged in */}
          {isLoggedIn && mainProfile && (
            <Link
              href={`/profile/${mainProfile.id}`}
              title={mainProfile.name}
              className={`group relative flex flex-col items-center gap-1 transition-all duration-200 ${
                isActive(`/profile/${mainProfile.id}`) ? "text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              {isActive(`/profile/${mainProfile.id}`) && (
                <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#e50914] rounded-r" />
              )}
              {mainProfile.avatar ? (
                <div className="relative size-9 overflow-hidden rounded-full border-2 border-transparent group-hover:border-[#e50914]/60 transition-all duration-200">
                  <Image
                    src={mainProfile.avatar}
                    alt={mainProfile.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div
                  className="flex size-9 items-center justify-center rounded-full text-[11px] font-bold text-white border-2 border-transparent group-hover:border-[#e50914]/60 transition-all duration-200"
                  style={{ background: "linear-gradient(135deg,#e50914 0%,#b5060e 100%)" }}
                >
                  {initials(mainProfile.name)}
                </div>
              )}
              <span className="text-[10px] font-medium truncate max-w-14 text-center leading-tight">
                {mainProfile.name.split(" ")[0]}
              </span>
            </Link>
          )}

          <Link
            href={authItem.path}
            className={`flex flex-col items-center gap-1 transition-all duration-200 relative group ${
              isActive(authItem.path)
                ? "text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {isActive(authItem.path) && (
              <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#e50914] rounded-r" />
            )}
            <AuthIcon
              className={`w-6 h-6 transition-transform group-hover:scale-110 ${
                isActive(authItem.path) ? "scale-110" : ""
              }`}
            />
            <span className="text-[10px] font-medium">{authItem.label}</span>
          </Link>
        </div>
      </div>

      {/* ── Mobile top bar (< md) ─────────────────────────────────────────────── */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-black/95 flex items-center justify-between px-4 z-50">
        {/* Logo */}
        <Image
          src="/logo.png"
          alt="Miteve"
          width={32}
          height={32}
          style={{ width: "auto", height: "auto" }}
        />

        {/* Hamburger */}
        <button
          onClick={openDrawer}
          aria-label="Abrir menú"
          className="text-gray-400 hover:text-white transition-colors p-1"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* ── Drawer overlay ────────────────────────────────────────────────────── */}
      {drawerOpen && (
        <button
          className="md:hidden fixed inset-0 bg-black/60 z-50"
          onClick={closeDrawer}
          aria-label="Cerrar menú"
        />
      )}

      {/* ── Drawer panel ──────────────────────────────────────────────────────── */}
      <div
        className={`md:hidden fixed top-0 left-0 h-full w-64 bg-black/95 z-50
                    flex flex-col py-8
                    transform transition-transform duration-300 ease-in-out
                    ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 mb-10">
          <Image
            src="/logo.png"
            alt="Miteve"
            width={36}
            height={36}
            style={{ width: "auto", height: "auto" }}
          />
          <button
            onClick={closeDrawer}
            aria-label="Cerrar menú"
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav items — horizontal layout matching sidebar style */}
        <nav className="flex flex-col gap-2 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={closeDrawer}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg relative
                            transition-all duration-200 group
                            ${active
                              ? "text-white bg-white/5"
                              : "text-gray-400 hover:text-white hover:bg-white/5"
                            }`}
              >
                {/* Barra roja igual que en desktop */}
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#e50914] rounded-r" />
                )}
                <Icon
                  className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                    active ? "scale-110" : ""
                  }`}
                />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto px-4 pt-6 border-t border-white/10 flex flex-col gap-1">
          {/* Profile avatar link — shown when logged in */}
          {isLoggedIn && mainProfile && (
            <Link
              href={`/profile/${mainProfile.id}`}
              onClick={closeDrawer}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg relative transition-all duration-200 group ${
                isActive(`/profile/${mainProfile.id}`)
                  ? "text-white bg-white/5"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {isActive(`/profile/${mainProfile.id}`) && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#e50914] rounded-r" />
              )}
              {mainProfile.avatar ? (
                <div className="relative size-7 overflow-hidden rounded-full shrink-0">
                  <Image
                    src={mainProfile.avatar}
                    alt={mainProfile.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div
                  className="flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                  style={{ background: "linear-gradient(135deg,#e50914 0%,#b5060e 100%)" }}
                >
                  {initials(mainProfile.name)}
                </div>
              )}
              <span className="text-sm font-medium">{mainProfile.name}</span>
            </Link>
          )}

          <Link
            href={authItem.path}
            onClick={closeDrawer}
            className={`flex items-center gap-4 px-4 py-3 rounded-lg relative
                        transition-all duration-200 group
                        ${isActive(authItem.path)
                          ? "text-white bg-white/5"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
          >
            {isActive(authItem.path) && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#e50914] rounded-r" />
            )}
            <AuthIcon
              className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                isActive(authItem.path) ? "scale-110" : ""
              }`}
            />
            <span className="text-sm font-medium">{authItem.label}</span>
          </Link>
        </div>
      </div>
    </>
  );
}