// Function that transforms String Time in Seconds as Number
export function TimeToSeconds(hourString: string) {
  const hourParts = hourString.split(":").map(Number);
  const [hour, minutes, seconds] = hourParts;
  return hour * 3600 + minutes * 60 + seconds;
}