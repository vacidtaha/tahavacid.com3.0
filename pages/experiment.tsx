import React, { useState, useRef } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { SplashCursor } from '../components/components/ui/splash-cursor';
import { GooeyText } from '../components/components/ui/gooey-text-morphing';
import { PlaceholdersAndVanishInput } from '../components/components/ui/placeholders-and-vanish-input';
import { CustomTextGenerateEffect } from '../components/components/ui/custom-text-generate-effect';
import { TextShimmer } from '../components/components/ui/text-shimmer';

export default function ExperimentPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Kelime kelime gösterilecek metin
  const morphingTexts = [
    "Bir",
    "Videonun",
    "Özeti",
    "hemde",
    "Bir",
    "linkte.",
  ];

  // YouTube videosu için yer tutucu metinler
  const inputPlaceholders = [
    "Lütfen YouTube video linkini yazın",
    "Video URL'sini buraya yapıştırın",
    "YouTube video bağlantısını girin",
    "Özetlemek istediğiniz videoyu buraya ekleyin"
  ];

  // Özet metni
  const summaryText = `Video: "Apple'ın Yeni M1 Ultra Çipi Ne Kadar Güçlü?"
🧠 Yapay Zeka Özeti (Uzun ve Akıcı):
Apple, M1 Ultra çipiyle masaüstü işlemcilerde yeni bir dönem başlatıyor. Videoda, bu çipin aslında iki adet M1 Max'in özel bir bağlantı teknolojisiyle birleştirilmesiyle oluştuğu anlatılıyor. Apple'ın "UltraFusion" adı verilen bu teknoloji, gecikmeyi minimumda tutarak tek bir çip gibi çalışmasını sağlıyor. Teknik özelliklere göre M1 Ultra, 20 çekirdekli CPU ve 64 çekirdekli GPU'suyla hem çoklu görevlerde hem de grafik ağırlıklı işlemlerde dikkat çekici bir performans sunuyor.

İçerik üreticileri için önemli olan video düzenleme, 3D modelleme ve yüksek çözünürlüklü render gibi işlemlerde M1 Ultra, rakiplerine göre %60'a varan hız farkı yaratıyor. Videoda yapılan karşılaştırmalarda Intel ve AMD'nin üst düzey masaüstü işlemcilerine göre daha sessiz çalıştığı, daha az enerji tükettiği ve aynı zamanda daha az ısındığı vurgulanıyor.

Sonuç kısmında ise anlatıcı, M1 Ultra'nın özellikle profesyonel kullanıcılar için ideal bir seçenek olduğunu, fakat sıradan kullanıcıların bu gücün tamamına ihtiyaç duymayabileceğini belirtiyor. Genel görüş: Apple, M1 Ultra ile pazardaki çıtayı yine yukarı taşıyor, özellikle performans ve enerji verimliliği dengesinde.

Dilersen bunun daha da sadeleştirilmiş bir versiyonunu ya da "sohbet tarzında" özetini de çıkarabilirim.
Ayrıca videoyu görsel efektle, "M1 Ultra, bir değil iki çip." gibi spot cümlelerle bölmek istersen, ona göre de parçalayabiliriz.

Sayfanın kullanıcı kitlesi daha teknik mi, genel izleyici mi? Ona göre tonu biraz daha uzmanlaştırabiliriz veya basitleştirebiliriz.`;

  // Metni kopyala fonksiyonu
  const copyToClipboard = () => {
    navigator.clipboard.writeText(summaryText)
      .then(() => {
        // Kopyalandı durumunu göster
        setIsCopied(true);
        // 2 saniye sonra durumu sıfırla
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      })
      .catch(err => {
        console.error('Metni kopyalarken hata oluştu:', err);
      });
  };

  // Form işleyicileri
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Input değişti:", e.target.value);
    // Form gönderildiğinde "isSubmitted" false olmalı
    if (isSubmitted) {
      setIsSubmitted(false);
    }
    
    // Eğer özet gösteriliyorsa, gizle
    if (showSummary) {
      setShowSummary(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log("Form gönderildi");
    
    // Form gönderildiğinde, ilk etapta hiçbir şey gösterme
    setIsSubmitted(false);
    setShowSummary(false);
    
    // Kısa bir gecikme sonra yükleniyor mesajını göster
    setTimeout(() => {
      setIsSubmitted(true);
    }, 100);
    
    // 3 saniye sonra özeti göster
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    timerRef.current = setTimeout(() => {
      // Önce yükleme mesajını kaldır, sonra özeti göster
      setIsSubmitted(false);
      // Kısa bir gecikmeyle özeti göster
      setTimeout(() => {
        setShowSummary(true);
      }, 50);
    }, 3000);
  };

  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col justify-between">
      <Head>
        <title>YouTube Video Özetleyicisi</title>
        <meta name="description" content="YouTube videolarını hızlıca özetleyen araç" />
      </Head>

      {/* Splash Cursor Efekti */}
      <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none hidden md:block">
        <SplashCursor 
          SPLAT_FORCE={3000} 
          COLOR_UPDATE_SPEED={5} 
          DENSITY_DISSIPATION={4.5}
          SPLAT_RADIUS={0.15}
          TRANSPARENT={true}
        />
      </div>

      <div className="z-10 flex flex-col items-center w-full h-full">
        {/* Gooey Text Morphing bileşeni - en üstte */}
        <div className="w-full pt-12 pb-4 text-center">
          <GooeyText 
            texts={morphingTexts} 
            morphTime={1.5} 
            cooldownTime={0.60}
            className="w-full h-32 flex items-center justify-center" 
            textClassName="text-white font-bold"
          />
        </div>
          
        {/* YouTube Video Özetleyici - yukarıda */}
        <div className="flex flex-col items-center w-full px-4 mt-0">
          <div className="w-full max-w-4xl flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-6 text-white">YouTube Video Özetleyicisi</h2>
            
            <div className="w-full relative">
              <style jsx global>{`
                .placeholders-input-container form {
                  height: 3.5rem !important;
                }
                
                .placeholders-input-container input {
                  font-size: 1.125rem !important;
                  padding-left: 1.5rem !important;
                }
                
                .placeholders-input-container p {
                  padding-left: 1.5rem !important;
                  font-size: 1.125rem !important;
                }
                
                @media (min-width: 640px) {
                  .placeholders-input-container form {
                    height: 4rem !important;
                  }
                  
                  .placeholders-input-container input {
                    font-size: 1.25rem !important;
                    padding-left: 2rem !important;
                  }
                  
                  .placeholders-input-container p {
                    padding-left: 2rem !important;
                    font-size: 1.25rem !important;
                  }
                }

                /* Özel metin rengi için stil */
                .text-dee2e6 {
                  color: #dee2e6;
                }

                /* Özel arka plan rengi */
                .bg-343a40 {
                  background-color: #343a40;
                }

                /* Kopyala butonu */
                .copy-button {
                  position: absolute;
                  top: 8px;
                  right: 8px;
                  padding: 4px 8px;
                  background-color: rgba(255, 255, 255, 0.1);
                  border-radius: 4px;
                  cursor: pointer;
                  transition: all 0.2s ease;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 12px;
                  color: #dee2e6;
                  border: none;
                  opacity: 0.6;
                }

                .copy-button:hover {
                  background-color: rgba(255, 255, 255, 0.2);
                  opacity: 1;
                }

                .copy-button svg {
                  width: 14px;
                  height: 14px;
                  margin-right: 4px;
                }
              `}</style>
              
              <div className="placeholders-input-container w-full">
                <PlaceholdersAndVanishInput 
                  placeholders={inputPlaceholders}
                  onChange={handleInputChange}
                  onSubmit={handleFormSubmit}
                />
                
                {/* Form gönderildiğinde shimmer efektiyle gösterilecek mesaj */}
                <AnimatePresence mode="sync">
                  {isSubmitted && !showSummary && (
                    <motion.div 
                      className="pl-0 mt-1" 
                      style={{ marginLeft: '7.5rem' }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <TextShimmer 
                        className="font-medium text-[0.75rem] [--base-color:#9ca3af] [--base-gradient-color:#3b82f6]"
                        duration={2}
                      >
                        Özetiniz oluşturuluyor...
                      </TextShimmer>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Özet kutusu - görünürlüğü kesin olarak kontrol edildi */}
                {showSummary === true && isSubmitted === false && (
                  <div className="mt-4 w-full max-w-3xl mx-auto rounded-xl p-3 transition-all overflow-hidden bg-343a40 relative">
                    <button 
                      className="copy-button" 
                      onClick={copyToClipboard} 
                      title="Metni kopyala"
                    >
                      {isCopied ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          Kopyalandı
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                          </svg>
                          Kopyala
                        </>
                      )}
                    </button>
                    
                    <CustomTextGenerateEffect 
                      words={summaryText}
                      className="text-left whitespace-pre-wrap"
                      duration={0.01}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer - Powered by bilgisi */}
      <div className="z-10 w-full py-4 text-center">
        <p className="text-xs text-gray-500">powered by firudin mustafayev</p>
      </div>
    </div>
  );
} 