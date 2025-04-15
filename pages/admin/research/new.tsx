import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getCurrentUser, addResearch } from '../../../lib/supabase';

export default function NewResearch() {
  // Form state'leri
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [slug, setSlug] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const router = useRouter();
  
  // Başlık değiştiğinde otomatik slug oluşturma
  useEffect(() => {
    // Türkçe karakterleri değiştirme ve boşlukları tire ile değiştirme
    const turkishToEnglish = (text: string) => {
      return text
        .replace(/ç/g, 'c')
        .replace(/ğ/g, 'g')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ş/g, 's')
        .replace(/ü/g, 'u')
        .replace(/Ç/g, 'C')
        .replace(/Ğ/g, 'G')
        .replace(/I/g, 'I')
        .replace(/İ/g, 'I')
        .replace(/Ö/g, 'O')
        .replace(/Ş/g, 'S')
        .replace(/Ü/g, 'U');
    };
    
    const slugify = (text: string) => {
      return turkishToEnglish(text)
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Alfanümerik olmayan karakterleri kaldır
        .replace(/[\s_-]+/g, '-') // Boşlukları ve alt çizgileri tire ile değiştir
        .replace(/^-+|-+$/g, ''); // Başlangıç ve sondaki tireleri kaldır
    };
    
    if (title) {
      setSlug(slugify(title));
    }
  }, [title]);
  
  // Sayfa yüklendiğinde kullanıcı kontrolü
  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser();
        
        if (!currentUser) {
          // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
          router.push('/admin/login');
          return;
        }
      } catch (error) {
        console.error('Kullanıcı bilgisi alınırken hata:', error);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [router]);
  
  // Araştırmayı kaydetme fonksiyonu
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form doğrulama - sadece başlık ve içerik zorunlu olsun
    if (!title || !content) {
      setError('Lütfen en azından başlık ve içerik alanlarını doldurun.');
      return;
    }
    
    setSaving(true);
    setError(null);
    
    try {
      // Eğer slug boş ise otomatik oluştur
      const finalSlug = slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      // Araştırmayı Supabase'e kaydet - sadece mevcut alanları gönder
      const researchData: any = {
        title,
        content,
        slug: finalSlug,
      };
      
      // Opsiyonel alanları sadece doluysa ekle
      if (description) researchData.description = description;
      if (category) researchData.category = category;
      
      const result = await addResearch(researchData);
      
      if (result) {
        setSuccess(true);
        // Formu temizle
        setTitle('');
        setDescription('');
        setContent('');
        setCategory('');
        setSlug('');
        
        // 2 saniye sonra araştırma listesi sayfasına yönlendir
        setTimeout(() => {
          setSuccess(false);
          // Başarılı mesajı ile birlikte liste sayfasına yönlendir
          router.push('/admin/research/list?status=added');
        }, 2000);
      }
    } catch (err: any) {
      console.error('Kayıt hatası:', err);
      
      // Oturum hatası ise login sayfasına yönlendir
      if (err.message && err.message.includes('Oturum süresi dolmuş')) {
        setError('Oturum süresi dolmuş. Yönlendiriliyorsunuz...');
        setTimeout(() => {
          router.push('/admin/login');
        }, 2000);
      } else {
        setError(`Bir hata oluştu: ${err.message || 'Bilinmeyen hata'}`);
      }
    } finally {
      setSaving(false);
    }
  };
  
  // Yükleniyor durumu
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin mb-4"></div>
          <p className="text-gray-300">Yükleniyor...</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>Yeni Araştırma Ekle | Vacid Admin</title>
        <meta name="description" content="Vacid araştırma ekleme sayfası" />
      </Head>
      
      <div className="min-h-screen bg-black">
        {/* Arkaplan gradient */}
        <div className="fixed inset-0 bg-gradient-to-b from-gray-900 via-black to-black opacity-60 z-0"></div>
        
        {/* Header */}
        <header className="sticky top-0 z-10 backdrop-blur-sm bg-gray-900/80 border-b border-gray-800 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-800 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight">Vacid Admin</h1>
            </div>
            
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="px-3 py-1.5 text-sm text-white bg-gradient-to-r from-gray-700 to-gray-800 rounded-md hover:from-gray-600 hover:to-gray-700 transition-all duration-200 flex items-center"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Panele Dön
            </button>
          </div>
        </header>
        
        {/* Ana içerik */}
        <main className="relative z-1 max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl shadow-xl border border-gray-800 p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Yeni Araştırma Ekle</h2>
            <p className="text-gray-400">Araştırma içeriğinizi oluşturmak için aşağıdaki formu doldurun.</p>
          </div>
          
          {/* Form */}
          <div className="bg-gray-900 rounded-lg shadow-xl border border-gray-800 p-6">
            {error && (
              <div className="mb-6 bg-red-900/50 border border-red-800 text-red-200 px-4 py-3 rounded-md">
                <p>{error}</p>
              </div>
            )}
            
            {success && (
              <div className="mb-6 bg-green-900/50 border border-green-800 text-green-200 px-4 py-3 rounded-md">
                <p>Araştırma başarıyla kaydedildi!</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Başlık */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                    Başlık
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Araştırma başlığı"
                  />
                </div>
                
                {/* Slug */}
                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-300 mb-1">
                    URL Slug (Otomatik oluşturulur)
                  </label>
                  <input
                    type="text"
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="araştırma-slug-url"
                  />
                </div>
                
                {/* Kategori */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
                    Kategori
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Kategori Seçin</option>
                    <option value="AI">Yapay Zeka</option>
                    <option value="ML">Makine Öğrenmesi</option>
                    <option value="DATA">Veri Bilimi</option>
                    <option value="TECH">Teknoloji</option>
                    <option value="OTHER">Diğer</option>
                  </select>
                </div>
                
                {/* Açıklama */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                    Açıklama
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Araştırma hakkında kısa açıklama"
                  />
                </div>
                
                {/* İçerik */}
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">
                    İçerik
                  </label>
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={10}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Araştırma içeriği (Markdown formatı desteklenir)"
                  />
                </div>
                
                {/* Form kontrolleri */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => router.push('/admin/dashboard')}
                    className="px-4 py-2 bg-gray-800 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 transition-colors duration-200"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className={`px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Kaydediliyor...
                      </>
                    ) : (
                      'Araştırmayı Kaydet'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="relative z-1 mt-auto border-t border-gray-800 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-xs text-gray-500">
              © {new Date().getFullYear()} Vacid | Tüm hakları saklıdır
            </p>
          </div>
        </footer>
      </div>
    </>
  );
} 