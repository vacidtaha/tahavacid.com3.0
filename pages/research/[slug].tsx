import React from 'react';
import Head from 'next/head';
import { GetStaticProps, GetStaticPaths } from 'next';
import { Research, getResearchBySlug, getResearches } from '../../lib/supabase';
import ResearchDetail from '../../components/ResearchDetail';

// Props tanımı
interface ResearchDetailPageProps {
  research: Research;
}

// Araştırma detay sayfası
export default function ResearchDetailPage({ research }: ResearchDetailPageProps) {
  // Eğer araştırma yoksa
  if (!research) {
    return (
      <div className="container mx-auto px-8 py-12 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Araştırma bulunamadı</h1>
        <p className="text-gray-400 mb-8">
          Aradığınız araştırma mevcut değil veya silinmiş olabilir.
        </p>
        <a href="/research" className="text-white underline hover:text-gray-300">
          Araştırmalara Dön
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Head>
        <title>{research.title} | Vacid Advanced Science and Technology Institute</title>
        <meta name="description" content={research.description} />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap" />
      </Head>
      
      {/* ResearchDetail bileşenini kullan */}
      <ResearchDetail research={research} />
    </div>
  );
}

// Statik yolları önceden oluşturma
export const getStaticPaths: GetStaticPaths = async () => {
  try {
    // Supabase'den tüm araştırmaları getir
    const researches = await getResearches();
    
    const paths = researches.map((research) => ({
      params: { slug: research.slug },
    }));
    
    return {
      paths,
      fallback: 'blocking',
    };
  } catch (error) {
    console.error('Yolları oluştururken hata oluştu:', error);
    
    // Hata durumunda boş paths döndür ve fallback true olsun
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
};

// Statik veri getirme
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  
  try {
    // Supabase'den slug'a göre araştırma getir
    const research = await getResearchBySlug(slug);
    
    if (research) {
      return {
        props: {
          research,
        },
        // 3 dakikada bir yeniden oluştur
        revalidate: 180,
      };
    }
    
    // Eğer bulunamazsa 404 döndür
    return {
      notFound: true,
    };
  } catch (error) {
    console.error('Araştırma alınırken hata oluştu:', error);
    
    // Hata durumunda 404 döndür
    return {
      notFound: true,
    };
  }
}; 