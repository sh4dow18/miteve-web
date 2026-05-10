export function timeToSeconds(time: string): number | null {
  const raw = time.trim();
  if (!raw) return null;

  const parts = raw.split(":").map((p) => Number(p));
  if (parts.some((p) => Number.isNaN(p) || p < 0)) {
    return undefined as unknown as number;
  }

  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    if (seconds > 59) return undefined as unknown as number;
    return minutes * 60 + seconds;
  }

  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    if (minutes > 59 || seconds > 59) return undefined as unknown as number;
    return hours * 3600 + minutes * 60 + seconds;
  }

  return undefined as unknown as number;
}

export function secondsToTime(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
