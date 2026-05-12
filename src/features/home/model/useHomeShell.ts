import { useState } from "react";

export function useHomeShell() {
  const [ready, setReady] = useState(false);
  return { ready, onLoaded: () => setReady(true) };
}
