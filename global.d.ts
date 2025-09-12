import { locales } from "@/i18n/config";
import { formats } from "@/i18n/request";

import messages from "./messages/en.json";

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof locales)[number];
    Messages: typeof messages;
    Formats: typeof formats;
  }
}
