export const FAQ_CATEGORIES = [
  "Todas",
  "Cuenta",
  "Perfiles",
  "Reproduccion",
  "Soporte",
  "Contenido",
] as const;

export type FaqCategory = (typeof FAQ_CATEGORIES)[number];

export type FaqItem = {
  id: string;
  category: Exclude<FaqCategory, "Todas">;
  question: string;
  answer: string;
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "account-plan",
    category: "Cuenta",
    question: "¿Como puedo cambiar mi plan de suscripcion?",
    answer:
      "Puedes cambiar tu plan en cualquier momento desde la seccion de Cuenta > Suscripcion. Los cambios se aplicaran en el siguiente ciclo de facturacion.",
  },
  {
    id: "profiles-limit",
    category: "Perfiles",
    question: "¿Cuantos perfiles puedo crear?",
    answer:
      "Puedes crear hasta 5 perfiles por cuenta para personalizar recomendaciones y controlar el historial de reproduccion por usuario.",
  },
  {
    id: "playback-offline",
    category: "Reproduccion",
    question: "¿Puedo descargar contenido para ver sin conexion?",
    answer: "Por ahora no ofrecemos descargas offline en la version web.",
  },
  {
    id: "support-report",
    category: "Soporte",
    question: "¿Como reporto un problema tecnico?",
    answer:
      "Ve a página de Reportar problema y adjunta una descripcion breve con capturas. Nuestro equipo revisa los reportes en orden de prioridad.",
  },
  {
    id: "content-updates",
    category: "Contenido",
    question: "¿Cada cuanto se actualiza el catalogo?",
    answer:
      "Incorporamos nuevos titulos de manera semanal y destacamos estrenos en la pantalla de inicio y en la seccion de proximamente.",
  },
];
