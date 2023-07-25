import { signIn, signOut, useSession } from "next-auth/react";
import {
  useAuth as useThirdwebAuth,
  useConnectionStatus,
} from "@thirdweb-dev/react";
import { useEffect, useMemo } from "react";

export default function useAuth() {
  const auth = useThirdwebAuth();
  const connectionStatus = useConnectionStatus();
  const { data: session, status: sessionStatus } = useSession();

  const { isLogged, isLoading } = useMemo(() => {
    const isConnecting = Boolean(connectionStatus.match(/connecting|unknown/));
    const isConnected = connectionStatus === "connected";
    const hasSession = sessionStatus === "authenticated";
    return {
      isLoading:
        sessionStatus === "loading" ||
        isConnecting ||
        (!hasSession && isConnected),
      isLogged: hasSession && isConnected,
    };
  }, [connectionStatus, sessionStatus]);

  useEffect(() => {
    async function authFlow() {
      if (
        connectionStatus === "disconnected" &&
        sessionStatus === "authenticated"
      ) {
        await signOut({ redirect: false, callbackUrl: "/" });
      }

      if (
        sessionStatus === "unauthenticated" &&
        connectionStatus === "connected"
      ) {
        const payload = await auth?.login();

        await signIn("credentials", {
          payload: JSON.stringify(payload),
          redirect: false,
        });
      }
    }
    authFlow();
  }, [connectionStatus, sessionStatus]);

  return {
    isLogged,
    isLoading,
    session,
    sessionStatus,
  };
}
