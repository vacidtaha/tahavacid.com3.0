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
  const [isHtmlContent, setIsHtmlContent] = useState(false);

  // İçeriği parse et
  useEffect(() => {
    try {
      if (typeof research.content === 'string') {
        // String ise ilk JSON olarak parse etmeyi dene
        try {
          const contentObj = JSON.parse(research.content);
          console.log('İçerik başarıyla parse edildi:', contentObj);
          
          // EditorJS formatını doğrula
          if (contentObj && contentObj.blocks && Array.isArray(contentObj.blocks)) {
            setParsedContent(contentObj as EditorJSData);
            setIsHtmlContent(false);
          } else {
            console.error('İçerik EditorJS formatında değil:', contentObj);
            // JSON formatında değilse HTML olabilir
            setIsHtmlContent(true);
            setParsedContent(null);
          }
        } catch (parseError) {
          console.error('JSON parse hatası:', parseError);
          // Parse hatası varsa, içerik muhtemelen HTML formatında
          setIsHtmlContent(true);
          setParsedContent(null);
        }
      } else if (typeof research.content === 'object') {
        // Zaten obje ise doğrudan kullan
        console.log('İçerik zaten obje formatında:', research.content);
        // EditorJS formatını doğrula
        const contentObj = research.content as any;
        if (contentObj && contentObj.blocks && Array.isArray(contentObj.blocks)) {
          setParsedContent(contentObj as EditorJSData);
          setIsHtmlContent(false);
        } else {
          console.error('İçerik EditorJS formatında değil:', research.content);
          setIsHtmlContent(false);
          setParsedContent(null);
        }
      } else {
        console.error('İçerik ne string ne de obje:', typeof research.content);
        setIsHtmlContent(false);
        setParsedContent(null);
      }
    } catch (error) {
      console.error('İçerik parse edilirken hata oluştu:', error);
      // Hata durumunda ham içeriği string olarak göster
      setIsHtmlContent(false);
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

      {/* İçerik bölümü - Farklı düzen */}
      <div className="bg-black">
        {/* Resim bölümü - Tam ekran genişliğinde */}
        {research.image_url && (
          <div className="w-full px-0 mb-10">
            <div className="overflow-hidden">
              <img 
                src={research.image_url} 
                alt={research.title} 
                className="w-full object-cover h-auto max-h-[500px]"
              />
            </div>
          </div>
        )}
        
        {/* Metin içerik bölümü - Responsive genişlikte */}
        <div className="mx-auto max-w-xl lg:max-w-2xl xl:max-w-3xl px-6 sm:px-8 md:px-10 py-10">
          <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none text-sm md:text-base [&_a]:!text-white [&_a]:!no-underline [&_a:hover]:!text-white [&_a:visited]:!text-white [&_a:active]:!text-white [&_p]:text-sm [&_p]:md:text-base [&_h2]:text-lg [&_h2]:md:text-xl [&_h3]:text-base [&_h3]:md:text-lg [&_ul]:text-sm [&_ul]:md:text-base [&_ol]:text-sm [&_ol]:md:text-base [&_li]:text-sm [&_li]:md:text-base">
            {parsedContent ? (
              <EditorRenderer data={parsedContent} />
            ) : isHtmlContent ? (
              <div dangerouslySetInnerHTML={{ __html: typeof research.content === 'string' ? research.content : '' }} />
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