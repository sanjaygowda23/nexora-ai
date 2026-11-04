import { useCallback, useEffect, useState } from "react";

/** Typed localStorage state. Never throws: storage can be unavailable (private mode, sandboxed previews). */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => readStorage(key, initial));

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage unavailable — keep in-memory state */
    }
  }, [key, value]);

  const reset = useCallback(() => setValue(initial), [initial]);
  return [value, setValue, reset] as const;
}

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}
