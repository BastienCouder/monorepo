import "@/styles/globals.css";

import { fontGeist, fontHeading, fontSans, fontUrban } from "@/assets/fonts";
import { ThemeProvider } from "next-themes";

import { cn, constructMetadata } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@/components/analytics";
import ModalProvider from "@/components/modals/providers";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import Provider from "@/providers/session-provider";
import { ReactNode } from "react";

interface RootLayoutProps {
  children: ReactNode;
}

// export const metadata = constructMetadata();

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontUrban.variable,
          fontHeading.variable,
          fontGeist.variable
        )}
      >
        {/* <Provider> */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ModalProvider>{children}</ModalProvider>
          <Analytics />
          <Toaster richColors closeButton />
          <TailwindIndicator />
        </ThemeProvider>
        {/* </Provider> */}
      </body>
    </html>
  );
}
