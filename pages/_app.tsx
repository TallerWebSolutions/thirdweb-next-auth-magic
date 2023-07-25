import type { AppProps } from "next/app";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { Mumbai } from "@thirdweb-dev/chains";

import "../styles/globals.css";
import { magicLinkConnector } from "../lib/magic";

const activeChain = Mumbai;

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <SessionProvider session={session}>
      <ThirdwebProvider
        activeChain={activeChain}
        autoSwitch={true}
        supportedChains={[activeChain]}
        clientId={process.env.NEXT_PUBLIC_THIRDWEB_API_KEY || ""}
        supportedWallets={[magicLinkConnector]}
        authConfig={{
          domain: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN || "",
        }}
      >
        <Component {...pageProps} />
      </ThirdwebProvider>
    </SessionProvider>
  );
}

export default MyApp;
