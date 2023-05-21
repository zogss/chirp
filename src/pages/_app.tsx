import "~/styles/globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import type { AppType } from "next/app";
import { api } from "~/utils/api";
import { Toaster } from "react-hot-toast";
import Head from "next/head";

const elements = {
  card: "bg-black shadow-outline-white text-white",
  headerTitle: "text-white",
  headerSubtitle: "text-gray-400",
  modalCloseButton: "text-white",
  socialButtonsBlockButton:
    "bg-black text-white border border-slate-400 hover:bg-white hover:bg-opacity-10",
  dividerLine: "bg-slate-400",
  dividerText: "text-slate-400",
  formFieldLabel: "text-white",
  formFieldInput: "bg-black text-white border-slate-400 placeholder-gray-400",
  formButtonPrimary:
    "bg-black shadow-outline-white text-white hover:bg-white hover:bg-opacity-10",
  footerActionText: "text-white",
};

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider
      {...pageProps}
      appearance={{
        elements,
      }}
    >
      <Head>
        <title>Chirp</title>
        <meta name="description" content="💭" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster position="bottom-center" />
      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
