import type { ReactElement } from "react";
import Link from "next/link";
import styles from "../styles/Footer.module.css";

export default function Footer(): ReactElement {
  return (
    <footer className={styles.footer}>
      <h5>
        <Link href="/privacy-policy">
          <a>Política de Privacidade</a>
        </Link>
      </h5>
      <h4>
        &copy;{" "}
        <a
          href="https://github.com/andrielson/odin-rio-preto-web"
          target="_blank"
          rel="noopener noreferrer"
        >
          Andrielson Silva
        </a>
      </h4>
      <h5>
        <Link href="/terms-of-use">
          <a>Termos de Uso</a>
        </Link>
      </h5>
    </footer>
  );
}
