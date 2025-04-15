import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getCurrentUser, signOut } from '../../lib/supabase';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Sayfa yüklendiğinde kullanıcı kontrolü
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser();
        
        if (!currentUser) {
          // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
          router.push('/admin/login');
          return;
        }
        
        setUser(currentUser);
      } catch (error) {
        console.error('Kullanıcı bilgisi alınırken hata:', error);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/admin/login');
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error);
    }
  };

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
        <title>Yönetim Paneli | Vacid</title>
        <meta name="description" content="Vacid araştırma yönetim paneli" />
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
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-300 text-sm">
                  {user?.email}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="px-3 py-1.5 text-sm text-white bg-gradient-to-r from-red-600 to-red-700 rounded-md hover:from-red-700 hover:to-red-800 transition-all duration-200 flex items-center"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                Çıkış
              </button>
            </div>
          </div>
        </header>
        
        {/* Ana içerik */}
        <main className="relative z-1 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Karşılama kartı */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl shadow-xl border border-gray-800 p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Hoş Geldiniz, Admin</h2>
            <p className="text-gray-400">Araştırma içeriklerinizi bu panel üzerinden yönetebilirsiniz.</p>
          </div>
          
          {/* İstatistik kartları */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800 p-5 transition-all duration-300 hover:border-blue-600/50 hover:shadow-blue-900/10">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-md bg-blue-600/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Araştırmalar</h3>
                  <p className="text-2xl font-bold text-white">0</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800 p-5 transition-all duration-300 hover:border-indigo-600/50 hover:shadow-indigo-900/10">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-md bg-indigo-600/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Görüntülenmeler</h3>
                  <p className="text-2xl font-bold text-white">0</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800 p-5 transition-all duration-300 hover:border-purple-600/50 hover:shadow-purple-900/10">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-md bg-purple-600/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Son Güncelleme</h3>
                  <p className="text-2xl font-bold text-white">-</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Araştırma yönetim kartı */}
          <div className="bg-gray-900 rounded-lg shadow-xl border border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              Araştırma Yönetimi
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                className="px-4 py-3 text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-md hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg flex items-center justify-center"
                onClick={() => router.push('/admin/research/new')}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Yeni Araştırma Ekle
              </button>
              
              <button
                className="px-4 py-3 text-white bg-gradient-to-r from-gray-700 to-gray-800 rounded-md hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg flex items-center justify-center"
                onClick={() => router.push('/admin/research/list')}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                </svg>
                Araştırmaları Listele
              </button>
            </div>
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