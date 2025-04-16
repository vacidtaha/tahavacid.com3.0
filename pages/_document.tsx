import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="tr">
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="Vacid - Yapay zeka ve teknoloji araştırmaları" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: blob: https://vzqhhmuttflqirejiupw.supabase.co; connect-src 'self' https://vzqhhmuttflqirejiupw.supabase.co wss://vzqhhmuttflqirejiupw.supabase.co; frame-src 'self'; media-src 'self';"
        />
      </Head>
      <body className="bg-black text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 