import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import { signIn } from '../../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signIn(email, password);
      if (result.error) {
        setError('Giriş yapılamadı. E-posta veya şifre hatalı.');
      } else {
        // Başarılı giriş sonrası dashboard'a yönlendirme
        router.push('/admin/dashboard');
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      console.error('Login hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Vacid Advanced Science and Technology Institute</title>
        <meta name="description" content="Taha Vacid admin paneli giriş" />
      </Head>
      
      <div className="min-h-screen bg-black flex flex-col md:flex-row overflow-hidden">
        {/* Sol Bölüm - Siyah Arka Plan ve Logo - Mobil ve Masaüstü */}
        <div className="flex flex-col items-center justify-center pt-12 pb-8 px-6 md:p-10 md:w-1/2 bg-black">
          <div className="flex flex-col items-center">
            <div className="w-52 h-52 md:w-[450px] md:h-[450px] relative">
              <Image 
                src="/images/logo3.PNG" 
                alt="Taha Vacid Logo" 
                fill
                sizes="(max-width: 768px) 208px, 450px"
                className="object-contain"
                priority
              />
            </div>
            <p className="text-xs md:text-sm italic font-medium -mt-3 md:-mt-6 text-center md:self-end md:pr-5">
              <span className="text-gray-400">The Veiled Virgin</span>
              <span className="text-gray-500 ml-1">- Giovanni Strazza</span>
            </p>
          </div>
        </div>
        
        {/* Mobil için login formu - Sadece mobilde görünür */}
        <div className="flex flex-col items-center w-full px-6 pb-8 md:hidden bg-black">
          <div className="w-full max-w-xs flex flex-col items-center mt-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold text-white">Kurucu Üye Girişi</h1>
              <p className="mt-1 text-sm text-gray-400">Sayın üye, lütfen erişim bilgilerinizi girin</p>
            </div>
            
            {/* Login Formu - Mobil */}
            <form className="w-full space-y-6" onSubmit={handleSubmit} autoComplete="off">
              <div className="space-y-1">
                <label htmlFor="email" className="block text-xs font-medium text-gray-300">
                  E-posta Adresi
                </label>
                <input
                  id="email"
                  name="username"
                  type="email"
                  autoComplete="nope"
                  autoCorrect="off"
                  spellCheck="false"
                  autoCapitalize="off"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 border-0 bg-[#212529] text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-white/30"
                  data-lpignore="true"
                />
              </div>
              
              <div className="space-y-1">
                <label htmlFor="password" className="block text-xs font-medium text-gray-300">
                  Şifre
                </label>
                <input
                  id="password"
                  name="pwd"
                  type="password"
                  autoComplete="nope"
                  autoCorrect="off"
                  spellCheck="false"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 border-0 bg-[#212529] text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-white/30"
                  data-lpignore="true"
                />
              </div>
              
              {/* Hata mesajı */}
              {error && (
                <div className="p-2.5 bg-red-900/20 border border-red-800/30 rounded-xl text-red-300 text-xs">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1.5 text-red-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                    {error}
                  </div>
                </div>
              )}
              
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-3 border-0 text-sm font-medium rounded-full text-black bg-white hover:bg-gray-100 focus:outline-none transition-colors duration-200"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-black" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Giriş yapılıyor...
                    </span>
                  ) : (
                    'Oturum Aç'
                  )}
                </button>
              </div>
            </form>
            
            {/* Footer - Mobil */}
            <div className="text-center pt-10 mt-auto">
              <p className="text-xs text-gray-500">
                © {new Date().getFullYear()} Taha Vacid | Tüm hakları saklıdır
              </p>
            </div>
          </div>
        </div>
        
        {/* Masaüstü için sağ bölüm - Sadece masaüstünde görünür */}
        <div className="hidden md:flex md:w-1/2 md:bg-black items-center justify-center p-10">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-semibold text-white">Kurucu Üye Girişi</h1>
              <p className="mt-2 text-gray-400">Sayın üye, lütfen erişim bilgilerinizi girin</p>
            </div>
            
            {/* Hata mesajı */}
            {error && (
              <div className="p-3 bg-red-900/20 border border-red-800/30 rounded-xl text-red-300 text-sm">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-red-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                  {error}
                </div>
              </div>
            )}
            
            {/* Login Formu - Masaüstü */}
            <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
              <div className="space-y-2">
                <label htmlFor="desktop-email" className="block text-sm font-medium text-gray-300">
                  E-posta Adresi
                </label>
                <input
                  id="desktop-email"
                  name="username"
                  type="email"
                  autoComplete="nope"
                  autoCorrect="off"
                  spellCheck="false"
                  autoCapitalize="off"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-3.5 border-0 bg-[#212529] text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-white/30"
                  data-lpignore="true"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="desktop-password" className="block text-sm font-medium text-gray-300">
                  Şifre
                </label>
                <input
                  id="desktop-password"
                  name="pwd"
                  type="password"
                  autoComplete="nope"
                  autoCorrect="off"
                  spellCheck="false"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3.5 border-0 bg-[#212529] text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-white/30"
                  data-lpignore="true"
                />
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-4 px-4 border-0 text-base font-medium rounded-full text-black bg-white hover:bg-gray-100 focus:outline-none transition-colors duration-200"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Giriş yapılıyor...
                    </span>
                  ) : (
                    'Oturum Aç'
                  )}
                </button>
              </div>
            </form>
            
            {/* Footer - Masaüstü KALDIRILIYOR */}
            {/* <div className="text-center pt-10">
              <p className="text-xs text-gray-500">
                © {new Date().getFullYear()} Taha Vacid | Tüm hakları saklıdır
              </p>
            </div> */}
          </div>
        </div>
        
        {/* Masaüstünde orta altında telif hakkı yazısı */}
        <div className="hidden md:block absolute bottom-4 left-0 right-0 text-center">
          <p className="text-xs text-gray-500">
            © 2025 Taha Vacid | Tüm hakları saklıdır
          </p>
        </div>
      </div>
    </>
  );
} 