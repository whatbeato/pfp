import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function Home() {
  const [lastLocation, setLastLocation] = useState(null);

  useEffect(() => {
    fetch('/api/last-changer')
      .then(res => res.json())
      .then(data => setLastLocation(data.location))
      .catch(() => setLastLocation(null));
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>lynn's pfp</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <img src='/api/current/' className={styles.avatar} />
        <h1 className={styles.title + ' header-title-name'}>
          lynn beato
        </h1>
        {lastLocation && (
          <p style={{ marginBottom: '2rem', color: '#666' }}>
            last person that changed my pfp was based in <strong>{lastLocation}</strong>
          </p>
        )}
        <div className={styles.grid}>
          <a
            href={"/api/photo" }
            className={styles.card + ' post'}
          >
            <h3>pull a random image &rarr;</h3>
            <p>idk why you want ts but you can have it</p>
          </a>
          <a
            href={"/api/set-profile"}
            className={styles.card + ' post'}
          >
            <h3>change my pfp &rarr;</h3>
            <p>changes my pfp on the hack club slack, have fun with it!</p>
          </a>
        </div>
      </main>
      <footer className={styles.footer}>
        <a href="https://github.com/whatbeato/pfp">source code here</a>
        {' • '}
        <a href="/privacy">privacy policy</a>
      </footer>
    </div>
  );
}