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
    let raw = localStorage.getItem(key);
    // Preserve demo data saved before the Alder rebrand, including model and node IDs.
    if (raw === null && key.startsWith("alder:v1:")) {
      const legacyKey = key.replace("alder:v1:", "nexora:v1:");
      const legacyRaw = localStorage.getItem(legacyKey);
      if (legacyRaw !== null) {
        const migrate = (value: unknown): unknown => {
          if (typeof value === "string") {
            if (value === "nexora") return "alder";
            if (/^nexora-(reason-l|swift-s|vision-m)$/.test(value)) return value.replace("nexora-", "alder-");
            if (value === "alex.morgan@nexora-demo.ai") return "alex.morgan@alder.example";
            return value;
          }
          if (Array.isArray(value)) return value.map(migrate);
          if (value !== null && typeof value === "object") {
            return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, migrate(v)]));
          }
          return value;
        };
        raw = JSON.stringify(migrate(JSON.parse(legacyRaw)));
        localStorage.setItem(key, raw);
      }
    }
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
