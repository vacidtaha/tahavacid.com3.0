import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { getCurrentUser, getResearches, deleteResearch, subscribeToResearches, signOut } from '../../../lib/supabase';
import { Research } from '../../../lib/supabase';

export default function ResearchList() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
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
        
        setUser(currentUser);
        
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
  
  // Çıkış yapma işlemi
  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/admin/login');
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error);
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
        <title>Yayın Listesi | Taha Vacid</title>
        <meta name="description" content="Taha Vacid yayın listesi" />
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
            {/* Başlık ve Ekleme Butonu */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-gray-800">Yayın Listesi</h1>
              <Link href="/admin/research/new" className="bg-black hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-md inline-flex items-center space-x-2 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                <span>Yeni Ekle</span>
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
                <p>{success}</p>
              </div>
            )}
            
            {/* Araştırma listesi */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Tüm Yayınlar ({researches.length})</h2>
              </div>
              
              {researches.length === 0 ? (
                <div className="p-8 text-center">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <h3 className="text-xl font-medium text-gray-500 mb-2">Henüz yayın bulunmuyor</h3>
                  <p className="text-gray-400 mb-6">İlk yayınınızı eklemek için "Yeni Ekle" butonuna tıklayın.</p>
                  <Link href="/admin/research/new" className="bg-black text-white rounded-lg px-4 py-2 inline-flex items-center space-x-2 hover:bg-gray-800 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    <span>Yeni Yayın Ekle</span>
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Başlık
                        </th>
                        {researches.some(r => r.category) && (
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Kategori
                          </th>
                        )}
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tarih
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          İşlemler
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {researches.map((research) => (
                        <tr key={research.id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{research.title}</div>
                                <div className="text-sm text-gray-500 truncate max-w-md">{research.description?.substring(0, 60)}...</div>
                              </div>
                            </div>
                          </td>
                          {researches.some(r => r.category) && (
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                {research.category || "Genel"}
                              </span>
                            </td>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(research.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-3">
                              <Link href={`/research/${research.slug}`} target="_blank" className="text-indigo-600 hover:text-indigo-900">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                </svg>
                              </Link>
                              <Link href={`/admin/research/edit/${research.id}`} className="text-blue-600 hover:text-blue-900">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                              </Link>
                              <button onClick={() => handleDeleteClick(research.id)} className="text-red-600 hover:text-red-900">
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
          </div>
        </div>
      </div>
      
      {/* Silme Onay Modalı */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm transition-opacity"></div>
          
          <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:max-w-lg sm:w-full">
              <div className="bg-white px-6 py-6">
                <div className="flex items-center mb-5">
                  <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0">
                    <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Yayını silmek istediğinizden emin misiniz?</h3>
                  </div>
                </div>
                
                <div className="mt-3">
                  <p className="text-sm text-gray-500">
                    Bu işlem geri alınamaz. Yayınınız kalıcı olarak silinecek ve bir daha erişilemeyecektir.
                  </p>
                </div>
                
                <div className="mt-6 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCancelDelete}
                    disabled={deleteLoading}
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#dee2e6] focus:ring-offset-2 transition-colors duration-200"
                  >
                    İptal
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    disabled={deleteLoading}
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
                  >
                    {deleteLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Siliniyor...</span>
                      </>
                    ) : (
                      <span>Evet, sil</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 