import "./globals.css";

import { Roboto, Roboto_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";

import { AppProvider, ThemeProvider } from "@/components";
import { Toaster } from "@/components/ui/sonner";
import { routing } from "@/i18n/routing";
import { setLayoutLocale } from "@/services/locales";
import { LayoutProps } from "@/types/others";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});
const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export async function generateMetadata({ params }: LayoutProps) {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "HomePage",
  });

  return {
    title: {
      template: `%s | ${t("title")}`,
      default: t("title"),
    },
    description: t("description"),
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default function RootLayout({ children, params }: LayoutProps) {
  setLayoutLocale(params);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.variable} ${robotoMono.variable} antialiased`}>
        <NextIntlClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster />
            <AppProvider>{children}</AppProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
