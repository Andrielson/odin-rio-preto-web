import { GetServerSideProps, NextPage } from "next";
import verifySubscriberByTokenServiceFactory from "@server/subscribers/services/verify-subscriber-by-token.service";
import styles from "../../styles/Temp.module.css";

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

  const service = verifySubscriberByTokenServiceFactory();
  try {
    await service.verifyByToken(token);
  } catch (err) {
    return { notFound };
  }
  return { props: { token } };
};

const Welcome: NextPage<Props> = () => (
  <main className={styles.main}>
    <p className={styles.description}>
      Parabéns! Sua inscrição foi confirmada com sucesso!
    </p>
  </main>
);
export default Welcome;
