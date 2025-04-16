import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { getCurrentUser, signOut, getResearches } from '../../lib/supabase';
import { Research } from '../../lib/supabase';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [researches, setResearches] = useState<Research[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Sayfa yüklendiğinde kullanıcı kontrolü ve verileri getir
    async function loadData() {
      try {
        const currentUser = await getCurrentUser();
        
        if (!currentUser) {
          // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
          router.push('/admin/login');
          return;
        }
        
        setUser(currentUser);
        
        // Araştırma verilerini getir
        const researchData = await getResearches();
        setResearches(researchData as Research[]);
        setTotalCount(researchData.length);
      } catch (error) {
        console.error('Veri yüklenirken hata:', error);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/admin/login');
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error);
    }
  };

  // En son 4 araştırmayı al
  const recentResearches = researches.slice(0, 4);

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
        <title>Yönetim Paneli | Taha Vacid</title>
        <meta name="description" content="Taha Vacid araştırma yönetim paneli" />
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
              <Link href="/admin/dashboard" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-[#212529] rounded-md bg-[#212529]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h2"></path>
                </svg>
                <span>Dashboard</span>
              </Link>
              
              <Link href="/admin/research/list" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-[#212529] rounded-md mt-1">
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
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{new Date().toLocaleDateString('tr-TR')}</span>
              </div>
            </div>
            
            {/* İstatistik Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Toplam Yayın</p>
                    <h2 className="text-3xl font-bold text-gray-800 mt-1">{totalCount}</h2>
                  </div>
                  <div className="bg-gray-100 rounded-full p-3">
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Görüntülenme</p>
                    <h2 className="text-3xl font-bold text-gray-800 mt-1">0</h2>
                  </div>
                  <div className="bg-gray-100 rounded-full p-3">
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Kategoriler</p>
                    <h2 className="text-3xl font-bold text-gray-800 mt-1">0</h2>
                  </div>
                  <div className="bg-gray-100 rounded-full p-3">
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Son Güncelleme</p>
                    <h2 className="text-3xl font-bold text-gray-800 mt-1">{researches.length > 0 ? new Date(researches[0].created_at).toLocaleDateString('tr-TR') : '-'}</h2>
                  </div>
                  <div className="bg-gray-100 rounded-full p-3">
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Hızlı Erişim Butonları */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <Link href="/admin/research/new" className="bg-black text-white rounded-lg shadow p-4 flex items-center space-x-3 hover:bg-gray-800 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                <span className="font-medium">Yeni Yayın Ekle</span>
              </Link>
              
              <Link href="/admin/research/list" className="bg-white text-gray-800 rounded-lg shadow p-4 flex items-center space-x-3 hover:bg-gray-50 transition-colors border border-gray-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                </svg>
                <span className="font-medium">Tüm Yayınları Listele</span>
              </Link>
            </div>
            
            {/* Son Yayınlar */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Son Yayınlar</h2>
                <Link href="/admin/research/list" className="text-sm text-black hover:underline">
                  Tümünü Gör &rarr;
                </Link>
              </div>
              
              <div className="divide-y divide-gray-200">
                {recentResearches.length > 0 ? (
                  recentResearches.map((research) => (
                    <div key={research.id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-medium text-gray-800">{research.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{research.description.substring(0, 60)}...</p>
                          <p className="text-xs text-gray-400 mt-2">{new Date(research.created_at).toLocaleDateString('tr-TR')}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Link href={`/admin/research/edit/${research.id}`} className="text-gray-600 hover:text-black">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                          </Link>
                          <button onClick={() => router.push(`/admin/research/delete/${research.id}`)} className="text-gray-600 hover:text-red-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    Henüz yayın bulunmuyor. Yeni bir yayın ekleyin.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 