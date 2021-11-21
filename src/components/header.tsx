import type { ReactElement } from "react";
import styles from "../styles/Header.module.css";

export default function Header(): ReactElement {
  return (
    <header className={styles.header}>
      <div className={styles.title_box}>
        <h1 className={styles.title_1}>Boletim do Diário Oficial</h1>
        <h2 className={styles.title_2}>São José do Rio Preto-SP</h2>
      </div>
    </header>
  );
}
