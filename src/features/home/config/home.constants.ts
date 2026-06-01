export const HOME_ROWS = {
  recent: "Recien Agregados",
  comingSoon: "Próximamente en Miteve",
  recommendations: "Recomendado para ti",
  trending: "Tendencias",
  favorites: "Mis favoritos",
  watchAgain: "Vuelve a ver",
} as const;

/**
 * Sequential row indices matching visual render order in the Home page.
 * -1 is reserved for ContinueWatching (special hardcoded handling in useContentRow).
 */
export const HOME_ROW_INDICES = {
  continueWatching: -1,
  recommendations: 0,
  recent: 1,
  comingSoon: 2,
  trending: 3,
  favorites: 4,
  watchAgain: 5,
} as const;

/** Total number of home rows (used as `totalRows` in every row so ArrowDown works). */
export const HOME_TOTAL_ROWS = 6;
