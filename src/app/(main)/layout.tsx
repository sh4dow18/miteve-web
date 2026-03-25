import type { Metadata } from "next";
import "@/app/globals.css";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Miteve",
  description: "Miteve es una app web de Streaming para ver películas y series en un solo lugar y a través de internet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <Sidebar />
      <main className="md:ml-20">{children}</main>
    </div>
  );
}
