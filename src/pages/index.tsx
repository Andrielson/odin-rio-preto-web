import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import GithubIcon from "/public/assets/github-white.png";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [email, setEmail] = useState("");
  const [keyword, setKeyword] = useState("");
  const [keywords, setKeywords] = useState<string[]>(["*"]);
  const [keywordsBackup, setKeywordsBackup] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [subscribeToAll, setSubscribeToAll] = useState(true);

  useEffect(
    () => setDisableSubmit(!email || keywords.length === 0),
    [email, keywords]
  );

  const handleSubscribeToAllChecked = (value: boolean) => {
    if (value) {
      setKeywordsBackup([...keywords.filter((it) => it !== "*")]);
      setKeywords(["*"]);
    } else setKeywords([...keywordsBackup]);
    setSubscribeToAll(value);
  };

  const addKeyword = () => {
    const lowerCaseValue = keyword.trim().toLocaleLowerCase();
    if (keywords.includes(lowerCaseValue) || lowerCaseValue.length < 3) return;
    setKeywords(
      [...keywords, lowerCaseValue].sort((a, b) => a.localeCompare(b))
    );
    setKeyword("");
  };

  const delKeyword = (value: string) => {
    setKeywords([...keywords.filter((it) => it !== value)]);
  };

  const handleKeyPressOnKeywordInput = (key: string) => {
    if (key === "Enter" && keyword.trim().length > 2) addKeyword();
  };

  const handleSubscribeClick = async () => {
    setSending(true);
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, keywords }),
      });
      const { ok, status } = response;
    } catch (error) {
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  const renderKeywords = () => (
    <>
      <div className={styles.input_keywords}>
        <input
          id="inputKeywords"
          type="text"
          placeholder="adicionar palavra-chave"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyPress={(e) => handleKeyPressOnKeywordInput(e.key)}
        />
        {keyword.trim().length > 2 && (
          <button
            type="button"
            disabled={keyword.trim().length < 3}
            onClick={() => addKeyword()}
          >
            +
          </button>
        )}
      </div>
      <div>
        <ul className={styles.list_keywords}>
          {keywords.map((k) => (
            <li key={k} className={styles.keyword_item}>
              <i>{k}</i>
              <button type="button" onClick={() => delKeyword(k)}>
                [remover]
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );

  return (
    <>
      <Head>
        <title>Boletim Diário - Rio Preto</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.title_box}>
            <h1 className={styles.title_1}>Boletim do Diário Oficial</h1>
            <h2 className={styles.title_2}>São José do Rio Preto-SP</h2>
          </div>
        </header>
        <main className={styles.main}>
          <section className={styles.subscribe_section}>
            <h1>Inscreva-se gratuitamente!</h1>
            <div className={styles.input_email}>
              <label htmlFor="inputEmail">
                <b>E-mail:</b>
                <button type="button" className={styles.keywords_help_button}>
                  ?
                </button>
              </label>
              <input
                id="inputEmail"
                type="email"
                placeholder="digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={styles.input_radio}>
              <input
                id="inputRadioAllPublications"
                type="radio"
                name="keywords-flag"
                defaultChecked
                onClick={() => handleSubscribeToAllChecked(true)}
              />
              <label htmlFor="inputRadioAllPublications">
                <b>Quero receber todas as publicações</b>
              </label>
            </div>
            <div className={styles.input_radio}>
              <input
                id="inputRadioByKeywords"
                type="radio"
                name="keywords-flag"
                onClick={() => handleSubscribeToAllChecked(false)}
              />
              <label htmlFor="inputRadioByKeywords">
                <b>Quero escolher as palavras-chave</b>
                <button type="button" className={styles.keywords_help_button}>
                  ?
                </button>
              </label>
            </div>
            {!subscribeToAll && renderKeywords()}
            <div className={styles.submit}>
              <button
                type="submit"
                onClick={handleSubscribeClick}
                className={styles.submit_button}
                disabled={!email || keywords.length === 0}
              >
                Enviar
              </button>
            </div>
            <p className={styles.message}>Sucesso!</p>
          </section>
        </main>
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
      </div>
    </>
  );
};

export default Home;
