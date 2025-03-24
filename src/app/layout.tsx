import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { Light, Logo, Nav } from "@/components";

export const metadata: Metadata = {
  title: "Miteve",
  description: "Descripción por crear",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="font-inter bg-gray-950">
      <body className="flex flex-col h-dvh">
        <header>
          <Nav />
        </header>
        <main className="flex flex-1">
          <Light direction="tl" />
          <div className="flex flex-col place-content-center w-full z-10 text-gray-400">
            {children}
          </div>
          <Light direction="br" />
        </main>
        <footer className="text-center py-8 text-gray-200 sm:flex sm:place-content-between sm:items-center sm:px-8">
          {/* Logos Container */}
          <div className="flex gap-4 justify-center max-w-fit mx-auto mb-5 sm:order-3 sm:m-0">
            {/* Github Logo */}
            <Logo
              href="https://github.com/sh4dow18/mateory"
              icon="github"
              width={24}
              height={24}
            />
            {/* MIT License Logo */}
            <Logo
              href="https://opensource.org/license/mit"
              icon="mit"
              width={24}
              height={24}
            />
          </div>
          {/* Copyright Text */}
          <p className="text-xs sm:order-2 md:text-sm">
            ©{" "}
            <Link
              href="https://github.com/sh4dow18"
              target="_blank"
              className="hover:text-primary"
            >
              Ramsés Solano
            </Link>
            . Todos los Derechos Reservados.
          </p>
          {/* Last Update */}
          <p className="text-xs sm:order-1 md:text-sm">11 de Marzo del 2025</p>
        </footer>
      </body>
    </html>
  );
}
