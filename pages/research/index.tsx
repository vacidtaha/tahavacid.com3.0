import React, { useState } from 'react';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import { Research, getResearches } from '../../lib/supabase';
import { DropdownMenu } from '@/components/components/ui/dropdown-menu';

// Sıralama seçenekleri
type SortOption = 'latest' | 'oldest' | 'alphabetical';

// Props tanımı
interface ResearchListPageProps {
  researches: Research[];
}

// Araştırmalar ana sayfası
export default function ResearchListPage({ researches }: ResearchListPageProps) {
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [searchTerm, setSearchTerm] = useState('');

  // Araştırmaları filtreleme ve sıralama
  const filteredAndSortedResearches = researches
    .filter(research => 
      // Arama filtreleme
      research.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      research.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'latest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });

  // Tarihi formatla (örn: 15 Nisan 2023)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Sıralama seçeneğini değiştirme
  const handleSortChange = (option: SortOption) => {
    setSortBy(option);
  };

  // Sıralama seçeneği için metinler
  const sortOptionText = {
    latest: 'En Yeni',
    oldest: 'En Eski',
    alphabetical: 'Alfabetik'
  };

  // Dropdown menü seçenekleri
  const sortOptions = [
    {
      label: 'En Yeni',
      onClick: () => handleSortChange('latest'),
    },
    {
      label: 'En Eski',
      onClick: () => handleSortChange('oldest'),
    },
    {
      label: 'Alfabetik',
      onClick: () => handleSortChange('alphabetical'),
    },
  ];

  return (
    <>
      <Head>
        <title>Araştırmalar | Vacid</title>
        <meta name="description" content="Vacid'in yapay zeka ve teknoloji alanındaki tüm araştırmaları" />
      </Head>
      
      <div className="container mx-auto px-8 sm:px-12 lg:px-20 pt-20 pb-10 max-w-6xl">
        {/* Ana başlık - Görüntüdeki gibi büyük ve sade */}
        <h1 className="text-4xl font-bold text-white mb-4">
          Araştırmalar
        </h1>
        
        {/* Sıralama seçenekleri */}
        <div className="flex items-center justify-end mb-10">
          <DropdownMenu options={sortOptions}>
            {sortOptionText[sortBy]}
          </DropdownMenu>
        </div>
        
        {/* Araştırma listesi */}
        <div className="mt-6">
          {filteredAndSortedResearches.length > 0 ? (
            <div className="space-y-6">
              {filteredAndSortedResearches.map((research) => (
                <div key={research.id} className="ml-0 border-b border-gray-800 group hover:border-gray-600 transition-colors duration-300 pb-4">
                  <Link href={`/research/${research.slug}`} className="block hover:bg-[#212529] transition-colors duration-300 rounded-xl p-3 -mx-3">
                    {research.image_url && (
                      <div className="mb-2 rounded-lg overflow-hidden">
                        <img 
                          src={research.image_url} 
                          alt={research.title} 
                          className="w-full h-32 object-cover"
                        />
                      </div>
                    )}
                    <div className="flex flex-col mb-2">
                      <h2 className="text-lg font-semibold text-white">{research.title}</h2>
                      <span className="text-gray-400 text-xs mt-1">{formatDate(research.created_at)}</span>
                    </div>
                    <p className="text-gray-400 max-w-prose text-xs line-clamp-2">{research.description}</p>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-400 text-lg">
                {searchTerm ? 'Arama kriterine uygun araştırma bulunamadı.' : 'Henüz araştırma eklenmemiş.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Statik veri getirme
export const getStaticProps: GetStaticProps = async () => {
  try {
    // Supabase'den verileri getir
    const researches = await getResearches();
    
    return {
      props: {
        researches,
      },
      // Her 10 dakikada bir yeniden oluştur
      revalidate: 600,
    };
  } catch (error) {
    console.error('Verileri alırken hata oluştu:', error);
    
    // Hata durumunda boş dizi döndür
    return {
      props: {
        researches: [],
      },
      revalidate: 60, // Hata durumunda daha sık kontrol et
    };
  }
}; 