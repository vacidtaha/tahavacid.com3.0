import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Research } from '../lib/supabase';

// ResearchDetail bileşeni props tanımı
interface ResearchDetailProps {
  research: Research;
}

// Araştırma detay bileşeni
const ResearchDetail: React.FC<ResearchDetailProps> = ({ research }) => {
  const [scrolled, setScrolled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sayfa scroll edildiğinde geri düğmesini göster/gizle
  useEffect(() => {
    const handleScroll = () => {
      // Çok az kaydırma olduğunda bile geri düğmesini göster
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    // Scroll event listener ekle
    window.addEventListener('scroll', handleScroll);
    
    // Component unmount olunca listener'ı temizle
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Tarihi formatla (örn: 15 Nisan 2023)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' });
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

      {/* Minimal başlık bölümü */}
      <div className="bg-black text-center pt-12 pb-8">
        <div className="container mx-auto px-4">
          <div className="text-gray-400 text-xs mb-2">{formatDate(research.created_at)}</div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{research.title}</h1>
          <p className="text-base text-gray-300 max-w-2xl mx-auto mb-4">{research.description}</p>
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

      {/* İçerik alanı */}
      <div className="bg-black">
        <div className="container mx-auto max-w-2xl px-8 sm:px-12 py-12">
          <div className="prose prose-invert max-w-none">
            <div 
              dangerouslySetInnerHTML={{ __html: research.content }}
              className="[&_img]:w-full [&_img]:rounded-lg [&_img]:my-6 [&_img]:mx-auto [&_img]:max-h-[500px] [&_img]:object-contain [&_img]:max-w-3xl [&_img]:-mx-[15%] md:[&_img]:-mx-[25%] [&_pre]:max-w-3xl [&_pre]:-mx-[15%] md:[&_pre]:-mx-[25%] [&_pre]:rounded-lg [&_pre]:overflow-x-auto"
            />
          </div>
        </div>
      </div>
    </article>
  );
};

export default ResearchDetail;