export const APP_INFO = {
  name: "Miteve",
  version: "1.0.0",
  lastUpdate: "Mayo 2026",
  githubUrl: "https://github.com/sh4dow18/miteve-web",
  description:
    "Miteve es una plataforma web de streaming que permite ver películas y series en un solo lugar a través de internet, con una experiencia de usuario moderna e intuitiva.",
  targetAudience:
    "Usuarios que buscan una experiencia de streaming centralizada, con acceso a películas y series sin necesidad de múltiples suscripciones.",
  problemSolved:
    "Elimina la necesidad de navegar entre múltiples plataformas para encontrar contenido, ofreciendo un catálogo unificado con reproducción directa desde el navegador.",
  mainBenefit:
    "Acceso inmediato a un catálogo de películas y series con reproducción de alta calidad, navegación optimizada y soporte para subtítulos.",
  technologies: {
    frontend: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS v4",
      "Framer Motion",
      "Lucide Icons",
      "Vitest",
    ],
    backend: [
      "Next.js API Routes",
      "TMDB API",
    ],
    deployment: [
      "Vercel",
      "Android TWA",
    ],
  },
  license: "MIT",
  source: "Código abierto",
} as const;
