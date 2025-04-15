import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getCurrentUser, getResearches, deleteResearch, subscribeToResearches } from '../../../lib/supabase';
import { Research } from '../../../lib/supabase';

export default function ResearchList() {
  const [loading, setLoading] = useState(true);
  const [researches, setResearches] = useState<Research[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const router = useRouter();
  
  // Sayfa yüklendiğinde kullanıcı kontrolü ve araştırmaları getirme
  useEffect(() => {
    async function init() {
      try {
        // Kullanıcı kontrolü
        const currentUser = await getCurrentUser();
        
        if (!currentUser) {
          // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
          router.push('/admin/login');
          return;
        }
        
        // URL parametrelerini kontrol et
        const { status } = router.query;
        if (status === 'added') {
          setSuccess('Araştırma başarıyla eklendi.');
          // URL'den parametreyi kaldır
          router.replace('/admin/research/list', undefined, { shallow: true });
          
          // 2 saniye sonra başarı mesajını kaldır
          setTimeout(() => {
            setSuccess(null);
          }, 2000);
        }
        
        // Real-time veri aboneliği başlat
        subscribeToResearches((data) => {
          console.log('Real-time araştırmalar alındı:', data.length);
          setResearches(data);
          // Yükleme durumunu güncelleyerek sayfayı render et
          setLoading(false);
        });
      } catch (error) {
        console.error('Sayfa yüklenirken hata:', error);
        router.push('/admin/login');
        setLoading(false);
      }
    }

    init();
  }, [router]);
  
  // Silme sonrası tekrar yükleme yapmaya gerek yok artık (real-time güncelleme var)
  
  // Araştırma silme modalını gösterme
  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };
  
  // Silme iptal
  const handleCancelDelete = () => {
    setDeleteId(null);
    setShowDeleteModal(false);
  };
  
  // Araştırma silme işlemi
  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    
    setDeleteLoading(true);
    
    try {
      const success = await deleteResearch(deleteId);
      
      // Başarılı silme işlemi
      setSuccess('Araştırma başarıyla silindi.');
      
      // Real-time güncelleme otomatik olarak yapılacak
      
      // Modal'ı kapat
      setShowDeleteModal(false);
      setDeleteId(null);
      
      // 2 saniye sonra başarı mesajını kaldır
      setTimeout(() => {
        setSuccess(null);
      }, 2000);
    } catch (err: any) {
      console.error('Silme hatası:', err);
      
      // Oturum hatası ise login sayfasına yönlendir
      if (err.message && err.message.includes('Oturum süresi dolmuş')) {
        setError('Oturum süresi dolmuş. Yönlendiriliyorsunuz...');
        setTimeout(() => {
          router.push('/admin/login');
        }, 2000);
      } else {
        setError(`Silme sırasında bir hata oluştu: ${err.message || 'Bilinmeyen hata'}`);
      }
    } finally {
      setDeleteLoading(false);
    }
  };
  
  // Tarih formatı
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
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
        <title>Araştırma Listesi | Vacid Admin</title>
        <meta name="description" content="Vacid araştırma listesi" />
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
        <main className="relative z-1 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl shadow-xl border border-gray-800 p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Araştırma Listesi</h2>
                <p className="text-gray-400">Mevcut araştırma içeriklerinizi yönetin. ({researches.length} araştırma)</p>
              </div>
              <button
                onClick={() => router.push('/admin/research/new')}
                className="mt-4 sm:mt-0 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center w-full sm:w-auto"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Yeni Araştırma Ekle
              </button>
            </div>
          </div>
          
          {/* Bildirimler */}
          {error && (
            <div className="mb-6 bg-red-900/50 border border-red-800 text-red-200 px-4 py-3 rounded-md">
              <p>{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mb-6 bg-green-900/50 border border-green-800 text-green-200 px-4 py-3 rounded-md">
              <p>{success}</p>
            </div>
          )}
          
          {/* Araştırma listesi */}
          <div className="bg-gray-900 rounded-lg shadow-xl border border-gray-800 overflow-hidden">
            {researches.length === 0 ? (
              <div className="p-8 text-center">
                <svg className="w-16 h-16 text-gray-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <h3 className="text-xl font-medium text-gray-400 mb-2">Henüz araştırma bulunmuyor</h3>
                <p className="text-gray-500 mb-6">İlk araştırmanızı eklemek için "Yeni Araştırma Ekle" butonuna tıklayın.</p>
                <button
                  onClick={() => router.push('/admin/research/new')}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md hover:from-blue-700 hover:to-blue-800 transition-all duration-200 inline-flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Yeni Araştırma Ekle
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-gray-800">
                  <thead className="bg-gray-900">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Başlık
                      </th>
                      {researches.some(r => r.category) && (
                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Kategori
                        </th>
                      )}
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Tarih
                      </th>
                      <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-900 divide-y divide-gray-800">
                    {researches.map((research) => (
                      <tr key={research.id} className="hover:bg-gray-800/50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-10 h-10 rounded bg-gray-800 flex items-center justify-center">
                              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                              </svg>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white">{research.title}</div>
                              <div className="text-sm text-gray-400 truncate max-w-xs">{research.description?.substring(0, 60) || ''}...</div>
                            </div>
                          </div>
                        </td>
                        {researches.some(r => r.category) && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {research.category ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-900 text-blue-200">
                                {research.category}
                              </span>
                            ) : (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-800 text-gray-400">
                                Kategorisiz
                              </span>
                            )}
                          </td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {formatDate(research.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-3">
                            <button
                              onClick={() => router.push(`/research/${research.slug}`)}
                              className="text-indigo-400 hover:text-indigo-300 transition-colors duration-150"
                              title="Görüntüle"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                              </svg>
                            </button>
                            <button
                              onClick={() => router.push(`/admin/research/edit/${research.id}`)}
                              className="text-blue-400 hover:text-blue-300 transition-colors duration-150"
                              title="Düzenle"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteClick(research.id)}
                              className="text-red-400 hover:text-red-300 transition-colors duration-150"
                              title="Sil"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
      
      {/* Silme onay modalı */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-30 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div className="fixed inset-0 bg-black opacity-75 transition-opacity"></div>
            
            <div className="relative inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle bg-gray-900 rounded-lg shadow-xl border border-gray-800 transform transition-all">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium leading-6 text-white mb-2">
                  Araştırma Silinecek
                </h3>
                <p className="text-sm text-gray-400">
                  Bu işlem geri alınamaz. Bu araştırmayı silmek istediğinizden emin misiniz?
                </p>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  onClick={handleCancelDelete}
                  className="px-4 py-2 bg-gray-800 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 transition-colors duration-200"
                >
                  İptal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={deleteLoading}
                  className={`px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-all duration-200 flex items-center ${deleteLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {deleteLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Siliniyor...
                    </>
                  ) : (
                    'Evet, Sil'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 