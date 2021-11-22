import type { ReactElement } from "react";
import Head from "next/head";
import Footer from "./footer";
import Header from "./header";
import styles from "../styles/Layout.module.css";

export default function Layout({ children }: { children: ReactElement }) {
  return (
    <>
      <Head>
        <title>Boletim Diário - Rio Preto</title>
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width"
          key="viewport"
        />
        <meta
          name="description"
          content="Receba as publicações do Diário Oficial de Rio Preto diretamente no seu e-mail!"
        />
        <meta name="twitter:site" content="@andrielson_FS" />
        <meta name="twitter:title" content="Boletim Diário - Rio Preto" />
        <meta
          name="twitter:description"
          content="Receba as publicações do Diário Oficial de Rio Preto diretamente no seu e-mail!"
        />
        <meta name="twitter:creator" content="@andrielson_FS" />
        <meta property="og:title" content="Boletim Diário - Rio Preto" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://riopreto.diario.tk" />
        <meta
          property="og:image"
          content="https://raw.githubusercontent.com/andrielson/odin-rio-preto-mail/main/assets/logo-white.png"
        />
        <meta property="og:site_name" content="Boletim Diário - Rio Preto" />
        <meta
          property="og:description"
          content="Receba as publicações do Diário Oficial de Rio Preto diretamente no seu e-mail!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <Header />
        {children}
        <Footer />
      </div>
    </>
  );
}
