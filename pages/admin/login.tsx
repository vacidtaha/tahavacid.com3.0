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
        <title>Kurucu Üye Girişi. | Taha Vacid</title>
        <meta name="description" content="Taha Vacid admin paneli giriş" />
      </Head>
      
      <div className="h-screen flex flex-col md:flex-row overflow-hidden">
        {/* Sol Bölüm - Siyah Arka Plan ve Logo */}
        <div className="w-full md:w-1/2 bg-black flex items-center justify-center p-6 md:rounded-tr-3xl md:rounded-br-3xl">
          <div className="max-w-xs">
            <Image 
              src="/images/logo2.png" 
              alt="Taha Vacid Logo" 
              width={300} 
              height={300}
              className="mx-auto"
              priority
            />
          </div>
        </div>
        
        {/* Sağ Bölüm - Beyaz Arka Plan ve Login Formu */}
        <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-6 md:rounded-tl-3xl md:rounded-bl-3xl">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">Kurucu Üye Girişi</h1>
              <p className="mt-2 text-gray-600">Hesabınıza giriş yapın</p>
            </div>
            
            {/* Hata mesajı */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-red-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                  {error}
                </div>
              </div>
            )}
            
            {/* Login Formu */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta Adresi
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="off"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-[#dee2e6] focus:border-[#dee2e6]"
                  placeholder="eposta@ornek.com"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Şifre
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-[#dee2e6] focus:border-[#dee2e6]"
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Giriş yapılıyor...
                    </span>
                  ) : (
                    'Giriş Yap'
                  )}
                </button>
              </div>
            </form>
            
            {/* Footer */}
            <div className="text-center">
              <p className="text-xs text-gray-600">
                © {new Date().getFullYear()} Taha Vacid | Tüm hakları saklıdır
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 