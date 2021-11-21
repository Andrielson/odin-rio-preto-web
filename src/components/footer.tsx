import type { ReactElement } from "react";
import styles from "../styles/Footer.module.css";

export default function Footer(): ReactElement {
  return (
    <footer className={styles.footer}>
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
    </footer>
  );
}
