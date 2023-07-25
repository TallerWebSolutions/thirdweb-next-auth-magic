import { Mumbai } from "@thirdweb-dev/chains";
import { magicLink, useMagic as useThirdwebMagic } from "@thirdweb-dev/react";

const API_KEY = process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY;

export const magicLinkConnector = magicLink({
  apiKey: API_KEY,
});

export const useMagic = () => {
  const connect = useThirdwebMagic();

  return ({ email }) =>
    connect({
      email,
      apiKey: API_KEY,
      chainId: Mumbai.chainId,
      magicSdkConfiguration: {
        // testMode: true,
      },
    });
};
