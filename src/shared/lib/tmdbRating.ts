const RATING_MAP: Record<string, number> = {
  A: 7,
  G: 7,
  TVY: 7,
  TVY7: 7,
  TVG: 7,
  TVPG: 7,
  TV14: 14,
  TVMA: 18,
  B: 12,
  PG: 7,
  "B-15": 15,
  "PG-13": 13,
  C: 18,
  D: 18,
  R: 17,
  NC17: 18,
  "NC-17": 18,
  U: 7,
  U7: 7,
  U12: 12,
  U14: 14,
  U16: 16,
  U18: 18,
  M: 18,
  "M-18": 18,
  "12": 12,
  "13": 13,
  "14": 14,
  "15": 15,
  "16": 16,
  "17": 17,
  "18": 18,
};

const COUNTRY_PRIORITY = ["MX", "US"];

function normalizeRating(certification: string): number {
  const normalized = certification.replace(/[\s.\-]/g, "").toUpperCase();
  return RATING_MAP[normalized] ?? RATING_MAP[certification.toUpperCase()] ?? -1;
}

interface TmdbReleaseDate {
  iso_3166_1: string;
  release_dates: { certification: string }[];
}

interface TmdbContentRating {
  iso_3166_1: string;
  rating: string;
}

export function getAgeFromReleaseDates(
  releaseDates?: TmdbReleaseDate[]
): number {
  if (!releaseDates?.length) return -1;

  for (const country of COUNTRY_PRIORITY) {
    const entry = releaseDates.find((r) => r.iso_3166_1 === country);
    if (entry) {
      for (const rd of entry.release_dates) {
        const age = normalizeRating(rd.certification);
        if (age >= 0) return age;
      }
    }
  }

  for (const entry of releaseDates) {
    for (const rd of entry.release_dates) {
      const age = normalizeRating(rd.certification);
      if (age >= 0) return age;
    }
  }

  return -1;
}

export function getAgeFromContentRatings(
  contentRatings?: TmdbContentRating[]
): number {
  if (!contentRatings?.length) return -1;

  for (const country of COUNTRY_PRIORITY) {
    const entry = contentRatings.find((r) => r.iso_3166_1 === country);
    if (entry) {
      const age = normalizeRating(entry.rating);
      if (age >= 0) return age;
    }
  }

  for (const entry of contentRatings) {
    const age = normalizeRating(entry.rating);
    if (age >= 0) return age;
  }

  return -1;
}
