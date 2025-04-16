import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { getCurrentUser, updateResearch, signOut, Research } from '../../../../lib/supabase';

// Belirli bir ID'ye göre araştırma getirme
async function getResearchById(id: string): Promise<Research | null> {
  try {
    const response = await fetch(`/api/research/${id}`);
    if (!response.ok) {
      throw new Error('Yayın getirilemedi');
    }
    return await response.json();
  } catch (error) {
    console.error('Yayın detayları alınırken hata:', error);
    return null;
  }
}

export default function EditResearch() {
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
  const [user, setUser] = useState<any>(null);
  const [research, setResearch] = useState<Research | null>(null);
  
  const router = useRouter();
  const { id } = router.query;
  
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
    
    if (title && !research?.slug) {
      setSlug(slugify(title));
    }
  }, [title, research]);
  
  // Sayfa yüklendiğinde kullanıcı kontrolü ve araştırma verilerini getirme
  useEffect(() => {
    async function loadData() {
      try {
        // Kullanıcı kontrolü
        const currentUser = await getCurrentUser();
        
        if (!currentUser) {
          // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
          router.push('/admin/login');
          return;
        }
        
        setUser(currentUser);
        
        // ID mevcutsa araştırma verilerini getir
        if (id) {
          const researchData = await getResearchById(id as string);
          
          if (!researchData) {
            setError('Yayın bulunamadı');
            return;
          }
          
          setResearch(researchData);
          setTitle(researchData.title);
          setDescription(researchData.description || '');
          setContent(researchData.content);
          setCategory(researchData.category || '');
          setSlug(researchData.slug);
        }
      } catch (error) {
        console.error('Veri yüklenirken hata:', error);
        setError('Veri yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    }

    if (router.isReady) {
      loadData();
    }
  }, [router.isReady, id, router]);
  
  // Araştırmayı güncelleme fonksiyonu
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) {
      setError('Yayın ID bulunamadı');
      return;
    }
    
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
      const updateData: any = {
        title,
        content,
        slug: finalSlug,
      };
      
      // Opsiyonel alanları sadece doluysa ekle
      if (description) updateData.description = description;
      if (category) updateData.category = category;
      
      const result = await updateResearch(id as string, updateData);
      
      if (result) {
        setSuccess(true);
        
        // 2 saniye sonra araştırma listesi sayfasına yönlendir
        setTimeout(() => {
          setSuccess(false);
          // Başarılı mesajı ile birlikte liste sayfasına yönlendir
          router.push('/admin/research/list?status=updated');
        }, 2000);
      }
    } catch (err: any) {
      console.error('Güncelleme hatası:', err);
      
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
  
  // Çıkış yapma işlemi
  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/admin/login');
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error);
    }
  };
  
  // Yükleniyor durumu
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-black border-t-transparent animate-spin mb-4"></div>
          <p className="text-gray-700">Yükleniyor...</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>Yayın Düzenle | Taha Vacid</title>
        <meta name="description" content="Taha Vacid yayın düzenleme sayfası" />
      </Head>
      
      <div className="flex h-screen bg-gray-50">
        {/* Sol Yan Menü */}
        <div className="w-64 bg-black text-white h-full flex flex-col shadow-xl rounded-tr-3xl rounded-br-3xl">
          <div className="p-4 border-b border-gray-800 flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
              <span className="text-black font-bold text-sm">TV</span>
            </div>
            <h1 className="text-lg font-bold text-white">Taha Vacid</h1>
          </div>
          
          <nav className="flex-1">
            <div className="px-2 py-4">
              <Link href="/admin/dashboard" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-[#212529] rounded-md">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h2"></path>
                </svg>
                <span>Dashboard</span>
              </Link>
              
              <Link href="/admin/research/list" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-[#212529] rounded-md mt-1 bg-[#212529]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                <span>Yayınlar</span>
              </Link>
              
              <Link href="/admin/research/new" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-[#212529] rounded-md mt-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                <span>Yeni Ekle</span>
              </Link>
            </div>
          </nav>
          
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                  <span className="text-sm text-white font-medium">{user?.email?.charAt(0).toUpperCase()}</span>
                </div>
                <div className="text-sm text-gray-300 truncate max-w-[120px]">
                  {user?.email}
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="text-gray-300 hover:text-white"
                title="Çıkış Yap"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Sağ İçerik Alanı */}
        <div className="flex-1 overflow-auto rounded-tl-3xl rounded-bl-3xl bg-white">
          <div className="p-8">
            {/* Başlık */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-gray-800">Yayın Düzenle</h1>
              <Link href="/admin/research/list" className="text-gray-600 hover:text-black font-medium py-2 px-4 rounded-md inline-flex items-center space-x-2 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                <span>Listeye Dön</span>
              </Link>
            </div>
            
            {/* Bildirimler */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg text-red-700 px-4 py-3">
                <p>{error}</p>
              </div>
            )}
            
            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg text-green-700 px-4 py-3">
                <p>Yayın başarıyla güncellendi!</p>
              </div>
            )}
            
            {/* Form */}
            <div className="bg-white rounded-lg shadow p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Başlık */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Başlık
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#dee2e6] focus:border-[#dee2e6]"
                    placeholder="Yayın başlığı"
                    required
                  />
                </div>
                
                {/* Slug */}
                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                    URL Slug (Otomatik oluşturulur)
                  </label>
                  <input
                    type="text"
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#dee2e6] focus:border-[#dee2e6]"
                    placeholder="yayin-slug-url"
                  />
                </div>
                
                {/* Kategori */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#dee2e6] focus:border-[#dee2e6]"
                  >
                    <option value="">Kategori Seçin</option>
                    <option value="AI">Yapay Zeka</option>
                    <option value="ML">Makine Öğrenmesi</option>
                    <option value="DL">Derin Öğrenme</option>
                    <option value="NLP">Doğal Dil İşleme</option>
                    <option value="CV">Bilgisayarlı Görü</option>
                    <option value="Algorithms">Algoritmalar</option>
                    <option value="Research">Araştırma</option>
                  </select>
                </div>
                
                {/* Açıklama */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Kısa Açıklama
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#dee2e6] focus:border-[#dee2e6]"
                    placeholder="Yayının kısa açıklaması (liste ve önizlemelerde gösterilir)"
                  ></textarea>
                </div>
                
                {/* İçerik */}
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                    İçerik
                  </label>
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={15}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#dee2e6] focus:border-[#dee2e6]"
                    placeholder="Yayın içeriği buraya yazılır"
                    required
                  ></textarea>
                  <p className="mt-1 text-sm text-gray-500">
                    Markdown formatını destekler. Başlıklar için # işareti, kalın metin için ** işareti kullanabilirsiniz.
                  </p>
                </div>
                
                {/* Kaydet Butonları */}
                <div className="flex justify-end space-x-3 pt-4">
                  <Link
                    href="/admin/research/list"
                    className="py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 font-medium"
                  >
                    İptal
                  </Link>
                  <button
                    type="submit"
                    disabled={saving}
                    className="py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800 font-medium flex items-center transition-colors"
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Kaydediliyor...
                      </>
                    ) : (
                      'Değişiklikleri Kaydet'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 