import type { NextPage } from "next";
import Script from "next/script";
import React, { useEffect, useState } from "react";
import Layout from "../components/layout";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [email, setEmail] = useState("");
  const [keyword, setKeyword] = useState("");
  const [keywords, setKeywords] = useState<string[]>(["*"]);
  const [keywordsBackup, setKeywordsBackup] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [subscribeToAll, setSubscribeToAll] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showFailureMessage, setShowFailureMessage] = useState(false);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!;

  useEffect(
    () => setDisableSubmit(!email || keywords.length === 0 || sending),
    [email, keywords, sending]
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
    grecaptcha.ready(async () => {
      try {
        const token = await grecaptcha.execute(siteKey, { action: "submit" });
        const response = await fetch("/api/subscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email, keywords }),
        });
        const { ok, status } = response;
        if (ok && status === 201) setShowSuccessMessage(true);
        else setShowFailureMessage(true);
      } catch (_) {
        setShowFailureMessage(true);
      } finally {
        setSending(false);
      }
    });
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
    <Layout>
      <>
        <Script
          src={`https://www.google.com/recaptcha/api.js?trustedtypes=true&render=${siteKey}`}
          strategy="beforeInteractive"
        />
        <main className={styles.main}>
          <section className={styles.subscribe_section}>
            <h1>Inscreva-se gratuitamente!</h1>
            <div className={styles.input_email}>
              <label htmlFor="inputEmail">
                <b>E-mail:</b>
              </label>
              <input
                id="inputEmail"
                type="email"
                placeholder="digite um e-mail v??lido"
                required={true}
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
                <b>Quero receber todas as publica????es</b>
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
              </label>
            </div>
            {!subscribeToAll && renderKeywords()}
            <div className={styles.submit}>
              <button
                type="submit"
                onClick={handleSubscribeClick}
                disabled={disableSubmit}
              >
                {sending ? "Enviando..." : "Enviar"}
              </button>
            </div>
          </section>
        </main>
        {showSuccessMessage && (
          <section className={styles.message_background}>
            <div className={styles.success_message} role="dialog">
              <h3>Cadastro efetuado com sucesso!</h3>
              <p>
                Por favor, confirme sua inscri????o clicando no link que foi
                enviado por e-mail.
              </p>
              <button onClick={() => setShowSuccessMessage(false)}>OK</button>
            </div>
          </section>
        )}
        {showFailureMessage && (
          <section className={styles.message_background}>
            <div className={styles.failure_message} role="dialog">
              <h3>Falha ao efetuar cadastro!</h3>
              <p>
                Por favor, verifique sua conex??o com a internet e tente
                novamente.
              </p>
              <button onClick={() => setShowFailureMessage(false)}>OK</button>
            </div>
          </section>
        )}
      </>
    </Layout>
  );
};

export default Home;
