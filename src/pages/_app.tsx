import "~/styles/globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { AppType } from "next/app";
import { Layout } from "~/components/layout";
import { api } from "~/utils/api";
import { Toaster } from "react-hot-toast";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <Toaster position="bottom-center" />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
