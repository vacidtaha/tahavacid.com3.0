import type { AppProps } from 'next/app'
import Layout from '../components/layout/Layout'
import '../styles/globals.css'
import { useRouter } from 'next/router'

// Uygulama ana bileşeni
export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  // Eğer araştırma detay sayfası ise Layout kullanma
  const isResearchDetailPage = router.pathname.startsWith('/research/[slug]');
  
  if (isResearchDetailPage) {
    return <Component {...pageProps} />;
  }
  
  return (
    // Diğer tüm sayfaları Layout içinde render et
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
} 