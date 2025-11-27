import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Privacy() {
  return (
    <div className={styles.container}>
      <Head>
        <title>lynn's pfp</title>
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>privacy policy</h1>
        <div style={{ maxWidth: '800px', textAlign: 'left', lineHeight: '1.6' }}>
          <p><strong>Last updated:</strong> November 27, 2025</p>
          <h6>can't believe i had to make one of these....</h6>
          
          <h2>what we collect</h2>
          <p>when you use this service to change my pfp, we collect:</p>
          <ul>
            <li>your ip address (to determine your country)</li>
            <li>your country location</li>
            <li>your isp (internet service provider)</li>
          </ul>

          <h2>how we use your data</h2>
          <p>we use this information to:</p>
          <ul>
            <li>display which country the last person was from</li>
            <li>rate limit requests (2 minutes between changes)</li>
            <li>log changes for monitoring purposes</li>
          </ul>

          <h2>what we don't do</h2>
          <ul>
            <li>we don't store your ip address permanently</li>
            <li>we don't share your data with third parties</li>
            <li>we don't track you across other websites</li>
            <li>we don't sell your data</li>
          </ul>

          <h2>data retention</h2>
          <p>we only store your country location temporarily in our database. your ip address is only used during the request and is not saved.</p>

          <h2>logging</h2>
          <p>we log profile picture changes to our server logs for monitoring purposes. these logs include the filename, country, and isp. server logs are only accessible by the site owner and are not shared publicly.</p>
          <p>they are also deleted every single time this website is redeployed for an update.</p>

          <h2>contact</h2>
          <p>if you have questions, check out the <a href="https://github.com/whatbeato/pfp" style={{ color: '#ec3750' }}>source code on github</a>.</p>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <a href="/" style={{ color: '#ec3750' }}>← back to home</a>
          </div>
        </div>
      </main>
    </div>
  );
}
