import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible } from "next/font/google";
import { cookies } from "next/headers";
import { LANGUAGES, type Lang } from "@/lib/catalog";
import { PREFS_BOOT_SCRIPT } from "@/lib/storage";
import { PrefsProvider } from "@/components/PrefsProvider";
import { AppShell } from "@/components/AppShell";
import "./globals.css";

// Readable font offered as an adaptation (dyslexia, low vision). Self-hosted by next/font.
const readable = Atkinson_Hyperlegible({
  variable: "--font-readable",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Paso a paso al juzgado",
  description: "Prepara tu visita al juzgado, paso a paso. Prototipo del Reto 3 del Datathon Brecha Judicial.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f6f2",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const cookieLang = (await cookies()).get("bj_lang")?.value;
  const lang: Lang = LANGUAGES.includes(cookieLang as Lang) ? (cookieLang as Lang) : "es";

  return (
    <html lang={lang} data-font="m" className={readable.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PREFS_BOOT_SCRIPT }} />
      </head>
      <body>
        <PrefsProvider initialLang={lang}>
          <AppShell>{children}</AppShell>
        </PrefsProvider>
      </body>
    </html>
  );
}
