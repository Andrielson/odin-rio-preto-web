import { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import Head from "next/head";
import { SubscribersServiceImpl } from "@server/subscribers/subscribers.service";
import styles from "../../styles/Home.module.css";

type Params = {
  token: string;
};

type Props = Params;

export const getServerSideProps: GetServerSideProps<Props, Params> = async (
  context
) => {
  const notFound = true;

  const { method } = context.req;
  if (!method || method.toUpperCase() !== "GET") return { notFound };

  const token = context.params?.token;
  if (!token) return { notFound };

  const service = SubscribersServiceImpl();
  try {
    await service.unsubscribeByToken(token);
  } catch (err) {
    return { notFound };
  }
  return { props: { token } };
};

const Goodbye: NextPage<Props> = () => (
  <div className={styles.container}>
    <Head>
      <title>Até logo! - ODIN Rio Preto</title>
      <meta name="description" content="Generated by create next app" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main className={styles.main}>
      <h1 className={styles.title}>Boletim Diário Oficial</h1>
      <h2>São José do Rio Preto/SP</h2>

      <p className={styles.description}>
        Você pediu pra sair do nosso boletim! 😥
      </p>
    </main>

    <footer className={styles.footer}>
      <a
        href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
        target="_blank"
        rel="noopener noreferrer"
      >
        Powered by{" "}
        <span className={styles.logo}>
          <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
        </span>
      </a>
    </footer>
  </div>
);
export default Goodbye;
