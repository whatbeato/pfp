import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
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
      </footer>
    </div>
  );
}