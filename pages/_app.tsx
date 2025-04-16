import React, { useEffect } from 'react'
import type { AppProps } from 'next/app'
import Layout from '../components/layout/Layout'
import '../styles/globals.css'
import { useRouter } from 'next/router'
import Head from 'next/head'

// Uygulama ana bileşeni
export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  // Eğer araştırma detay sayfası veya admin sayfası ise Layout kullanma
  const isResearchDetailPage = router.pathname.startsWith('/research/[slug]');
  const isAdminPage = router.pathname.startsWith('/admin');
  const isHomePage = router.pathname === '/';
  
  // Sadece ana sayfada mobil cihazlarda scrolling'i engelle
  useEffect(() => {
    if (isHomePage) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [isHomePage]);
  
  // Admin sayfaları veya araştırma detay sayfalarında Layout kullanma
  if (isResearchDetailPage || isAdminPage) {
    return (
      <>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, orientation=portrait" />
        </Head>
        <Component {...pageProps} />
      </>
    );
  }
  
  return (
    <>
      <Head>
        <link rel="icon" href="/images/logo2.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, orientation=portrait" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  )
} 