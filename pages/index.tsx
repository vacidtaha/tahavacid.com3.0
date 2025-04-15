import React from 'react';
import Head from 'next/head';
import Hero from '../components/home/Hero';
import Intro from '../components/home/Intro';
import { GetStaticProps } from 'next';

// Ana sayfa props tanımı
interface HomePageProps {
}

// Anasayfa - Hero ve Intro bileşenlerini içerir
export default function HomePage({}: HomePageProps) {
  return (
    <>
      <Head>
        <title>Vacid | Yapay Zeka ve Teknoloji Araştırmaları</title>
        <meta name="description" content="Vacid, yapay zeka ve teknoloji alanında yenilikçi araştırmalar yapan bir araştırma kuruluşudur." />
      </Head>

      {/* Hero alanı - Logo ile tam ekran giriş */}
      <Hero />
      
      {/* Tanıtım metni */}
      <Intro />
    </>
  );
}

// Statik veri getirme
export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  return {
    props: {
    },
    // Her 10 dakikada bir yeniden oluştur
    revalidate: 600,
  };
};
