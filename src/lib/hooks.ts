import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { I18nSchemaKeys } from "@/types/others";

export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => setMounted(false);
  }, []);

  return mounted;
}

// The error's message is the key of the schema translation
export function useSchemaTranslation(error?: { message?: string | undefined }) {
  const t = useTranslations("Schema");

  if (!error?.message) {
    return "";
  }

  if (t.has(error.message as I18nSchemaKeys)) {
    return t(error.message as I18nSchemaKeys);
  }

  return error.message;
}
