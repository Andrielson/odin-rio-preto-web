import { GetServerSideProps, NextPage } from "next";
import removeSubscriberByTokenServiceFactory from "@server/subscribers/services/remove-subscriber-by-token.service";
import Layout from "../../components/layout";
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

  const service = removeSubscriberByTokenServiceFactory();
  try {
    await service.removeByToken(token);
  } catch (err) {
    return { notFound };
  }
  return { props: { token } };
};

const Goodbye: NextPage<Props> = () => (
  <Layout>
    <main className={styles.main}>
      <p className={styles.description}>
        Sua inscrição foi cancelada com sucesso!
      </p>
    </main>
  </Layout>
);
export default Goodbye;
