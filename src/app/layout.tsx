import type { Metadata } from "next";
import "@/app/globals.css"

export const metadata: Metadata = {
  title: "Miteve",
  description: "Miteve es una app web de streaming de series y películas gratuito de alta calidad, que funciona en cualquier dispositivo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preload logo for LCP — rendered before client-side Sidebar mounts */}
        <link rel="preload" href="/logo.png" as="image" />
      </head>
      <body>
        <div className="min-h-screen bg-[#141414] text-white">
          <main>{children}</main>
        </div>
        {/* Service Worker registration for PWA offline support */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(err) {
                    console.warn('[SW] Registration failed:', err);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
