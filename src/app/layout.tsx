import "~/styles/globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/ui/themes";
import type { Metadata, Viewport } from "next";
import { Toaster } from "react-hot-toast";

import { PageLayout } from "~/components/layout";
import { RECENTLY_ACTIVE_INPUT } from "~/modules/profile/constants";
import { TRPCReactProvider } from "~/trpc/react";
import { getQueryClient, HydrateClient, trpc } from "~/trpc/server";

export const metadata: Metadata = {
  title: {
    default: "Chirp",
    template: "%s / Chirp",
  },
  description: "Share what's happening, in emojis only 🐦",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  void getQueryClient().prefetchQuery(
    trpc.profile.getRecentlyActive.queryOptions(RECENTLY_ACTIVE_INPUT),
  );

  return (
    <html lang="en">
      <body>
        <ClerkProvider
          appearance={{
            theme: dark,
            variables: {
              colorPrimary: "#1d9bf0",
              colorBackground: "#000000",
              colorInput: "#000000",
              colorForeground: "#e7e9ea",
              colorMutedForeground: "#71767b",
              borderRadius: "0.75rem",
            },
          }}
        >
          <TRPCReactProvider>
            <HydrateClient>
              <PageLayout>{children}</PageLayout>
            </HydrateClient>
            <Toaster
              position="bottom-center"
              containerStyle={{ bottom: 88 }}
              toastOptions={{
                style: {
                  background: "#1d9bf0",
                  color: "#ffffff",
                  borderRadius: 4,
                  fontSize: 15,
                  padding: "12px 16px",
                },
                success: { icon: null },
                error: { icon: null },
              }}
            />
          </TRPCReactProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
