  export function timeToSeconds(time: string): number | null {
    if (!time || time.trim() === "") return null;

    const parts = time.split(":").map(Number);

    if (parts.some(isNaN)) return null;

    if (parts.length === 2) {
      const [minutes, seconds] = parts;
      if (minutes < 0 || seconds < 0 || seconds >= 60) return null;
      return minutes * 60 + seconds;
    }

    if (parts.length === 3) {
      const [hours, minutes, seconds] = parts;
      if (
        hours < 0 ||
        minutes < 0 ||
        minutes >= 60 ||
        seconds < 0 ||
        seconds >= 60
      )
        return null;
      return hours * 3600 + minutes * 60 + seconds;
    }

    return null;
  }

  export function secondsToTime(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }