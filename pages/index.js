import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useState, useEffect } from 'react'

export default function Home() {
  const [lastLocation, setLastLocation] = useState(null);
  const [password, setPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  useEffect(() => {
    fetch('/api/last-changer')
      .then(res => res.json())
      .then(data => setLastLocation(data.location))
      .catch(() => setLastLocation(null));
  }, []);

  const handleBypassSubmit = (e) => {
    e.preventDefault();
    if (password) {
      window.location.href = `/api/set-profile?bypass=${encodeURIComponent(password)}`;
    }
  };

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
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          {!showPasswordInput ? (
            <button 
              onClick={() => setShowPasswordInput(true)}
              style={{
                background: 'transparent',
                border: '1px solid #333',
                color: '#888',
                padding: '0.5rem 1rem',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              bypass rate limit?
            </button>
          ) : (
            <form onSubmit={handleBypassSubmit} style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
              <input
                type="password"
                placeholder="enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  background: '#252525',
                  border: '1px solid #333',
                  color: '#e0e0e0',
                  padding: '0.5rem',
                  borderRadius: '5px',
                  fontSize: '0.9rem'
                }}
              />
              <button
                type="submit"
                style={{
                  background: '#ec3750',
                  border: 'none',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                go
              </button>
              <button
                type="button"
                onClick={() => setShowPasswordInput(false)}
                style={{
                  background: 'transparent',
                  border: '1px solid #333',
                  color: '#888',
                  padding: '0.5rem 1rem',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                cancel
              </button>
            </form>
          )}
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