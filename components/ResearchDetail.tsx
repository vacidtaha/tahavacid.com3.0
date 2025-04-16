import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Research } from '../lib/supabase';
import dynamic from 'next/dynamic';
import { EditorJSData } from './editor/EditorConfig';

// Dinamik olarak EditorJS renderer'ı yükle
const EditorRenderer: React.ComponentType<{data: EditorJSData}> = dynamic(
  () => import('@/components/editor/EditorRenderer'),
  {
    ssr: false, 
    loading: () => <div className="animate-pulse bg-gray-700 h-32 rounded-md"></div>
  }
);

// ResearchDetail bileşeni props tanımı
interface ResearchDetailProps {
  research: Research;
}

// Araştırma detay bileşeni
const ResearchDetail: React.FC<ResearchDetailProps> = ({ research }) => {
  const [scrolled, setScrolled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [parsedContent, setParsedContent] = useState<EditorJSData | null>(null);

  // İçeriği parse et
  useEffect(() => {
    try {
      if (typeof research.content === 'string') {
        // String ise JSON olarak parse et
        try {
          const contentObj = JSON.parse(research.content);
          console.log('İçerik başarıyla parse edildi:', contentObj);
          
          // EditorJS formatını doğrula
          if (contentObj && contentObj.blocks && Array.isArray(contentObj.blocks)) {
            setParsedContent(contentObj as EditorJSData);
          } else {
            console.error('İçerik EditorJS formatında değil:', contentObj);
            // Hatalı format durumunda null döndür
            setParsedContent(null);
          }
        } catch (parseError) {
          console.error('JSON parse hatası:', parseError);
          setParsedContent(null);
        }
      } else if (typeof research.content === 'object') {
        // Zaten obje ise doğrudan kullan
        console.log('İçerik zaten obje formatında:', research.content);
        // EditorJS formatını doğrula
        const contentObj = research.content as any;
        if (contentObj && contentObj.blocks && Array.isArray(contentObj.blocks)) {
          setParsedContent(contentObj as EditorJSData);
        } else {
          console.error('İçerik EditorJS formatında değil:', research.content);
          setParsedContent(null);
        }
      } else {
        console.error('İçerik ne string ne de obje:', typeof research.content);
        setParsedContent(null);
      }
    } catch (error) {
      console.error('İçerik parse edilirken hata oluştu:', error);
      // Hata durumunda ham içeriği string olarak göster
      setParsedContent(null);
    }
  }, [research.content]);

  // Scroll olayları
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const position = containerRef.current.getBoundingClientRect().top;
        setScrolled(position < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Tarih formatlayıcı
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  return (
    <article ref={containerRef} className="relative pb-16">
      {/* Geri düğmesi - Scroll edildiğinde görünür */}
      <div className={`fixed left-4 top-4 z-20 transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <Link href="/research" className="flex items-center justify-center w-10 h-10 bg-black bg-opacity-40 backdrop-blur-md rounded-full text-white hover:bg-opacity-60 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
      </div>

      {/* Minimal başlık bölümü - Padding artırıldı ve yazı boyutları büyütüldü */}
      <div className="bg-black text-center pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-gray-400 text-sm mb-3">{formatDate(research.created_at)}</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{research.title}</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6">{research.description}</p>
        </div>
      </div>

      {/* Resim */}
      {research.image_url && (
        <div className="bg-black">
          <div className="container mx-auto max-w-3xl px-4">
            <div className="mb-8 rounded-xl overflow-hidden">
              <img 
                src={research.image_url} 
                alt={research.title} 
                className="w-full object-cover max-h-96"
              />
            </div>
          </div>
        </div>
      )}

      {/* İçerik alanı - Metin boyutu büyütüldü ve sınırları genişletildi */}
      <div className="bg-black">
        <div className="container mx-auto max-w-4xl px-6 sm:px-10 py-14">
          <div className="prose prose-invert prose-lg max-w-none [&_a]:!text-white [&_a]:!no-underline [&_a:hover]:!text-white [&_a:visited]:!text-white [&_a:active]:!text-white">
            {parsedContent ? (
              <EditorRenderer data={parsedContent} />
            ) : (
              <div className="text-red-500 bg-red-100 p-4 rounded-md mb-4">
                <h3 className="font-bold">İçerik Görüntüleme Hatası</h3>
                <p>İçerik düzgün biçimde görüntülenemiyor. Lütfen yönetici ile iletişime geçin.</p>
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm">Teknik Detaylar</summary>
                  <pre className="text-xs mt-2 p-2 bg-red-50 rounded overflow-auto">
                    {typeof research.content === 'string' 
                      ? research.content.substring(0, 500) + (research.content.length > 500 ? '...' : '') 
                      : JSON.stringify(research.content, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ResearchDetail;