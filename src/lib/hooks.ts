import { useEffect, useRef, useState } from "react";

export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => setMounted(false);
  }, []);

  return mounted;
}

export function useUniqueRunning<
  T extends (...args: unknown[]) => ReturnType<T>,
>(fn: T): T {
  const fnRef = useRef<T | null>(null);
  const isRunningRef = useRef(false);

  if (!fnRef.current) {
    fnRef.current = ((...args: Parameters<T>) => {
      if (isRunningRef.current) {
        return;
      }

      isRunningRef.current = true;
      try {
        return fn(...args);
      } finally {
        isRunningRef.current = false;
      }
    }) as T;
  }

  return fnRef.current as T;
}
