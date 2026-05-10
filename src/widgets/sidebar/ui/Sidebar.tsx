"use client";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSidebar } from "@/widgets/sidebar/model/useSidebar";

export function Sidebar() {
  const { menuItems, authItem, drawerOpen, isActive, openDrawer, closeDrawer } =
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

        <div className="pt-6 border-t border-white/10">
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

        <div className="mt-auto px-4 pt-6 border-t border-white/10">
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