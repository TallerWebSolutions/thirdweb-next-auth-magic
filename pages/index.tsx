import { useAddress, useDisconnect } from "@thirdweb-dev/react";

import type { NextPage } from "next";
import Image from "next/image";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import useAuth from "../lib/auth-hook";
import { useMagic } from "../lib/magic";

const Home: NextPage = () => {
  const connect = useMagic();
  const disconnect = useDisconnect();
  const { isLogged, isLoading, session } = useAuth();
  const address = useAddress();
  const [secret, setSecret] = useState();

  // Hit our example secret endpoint to show the flow for using an authenticated endpoint
  const getSecret = async () => {
    const res = await fetch("/api/secret");
    const data = await res.json();
    setSecret(data);
  };

  function handleLogin(event) {
    event.preventDefault();
    const email = new FormData(event.target).get("email").toString();
    // Uncomment to test without email confirmation.
    // @see /lib/magic.ts
    // connect({ email: "test+success@magic.link" });
    connect({ email });
  }

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.iconContainer}>
          <Image
            className={styles.icon}
            src="/thirdweb.png"
            alt="thirdweb icon"
            width={100}
            height={100}
          />
          <Image
            className={styles.icon}
            src="/next-auth.png"
            alt="next auth icon"
            width={100}
            height={100}
          />
        </div>

        <h1 className={styles.h1}>thirdweb + Next Auth</h1>

        <p className={styles.explain}>
          In this flow, you can login to a Next Auth backend using either Google
          OAuth, or login with wallet via thirdweb Auth. They are both
          compatible with the same system.
        </p>

        {!isLoading ? (
          <div className={styles.stack}>
            {!isLogged && (
              <form onSubmit={handleLogin}>
                <input type="email" name="email" />
                <button className={styles.mainButton} type="submit">
                  Login
                </button>
              </form>
            )}

            {isLogged && (
              <button
                onClick={() => disconnect()}
                className={styles.mainButton}
              >
                Logout
              </button>
            )}

            {isLogged && (
              <>
                <button onClick={getSecret} className={styles.mainButton}>
                  Get Secret
                </button>
              </>
            )}
          </div>
        ) : (
          <h2>loading...</h2>
        )}

        <hr className={styles.divider} />

        <h2>Information</h2>

        <p>
          <b>Conencted Wallet: </b>
          {address}
        </p>

        <p>
          <b>User: </b>
          {JSON.stringify(session?.user || "N/A")}
        </p>

        <p>
          <b>Secret: </b>
          {JSON.stringify(secret || "N/A")}
        </p>
      </div>
    </div>
  );
};

export default Home;
