import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { RiMenu4Line } from 'react-icons/ri';

// Header bileşeni - Navigasyon menüsü ve logo içerir
const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isLoginClicked, setIsLoginClicked] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  // Aktif rotaya göre stil veren NavLink bileşeni
  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const isActive = router.pathname === href || 
                     (href !== '/' && router.pathname.startsWith(href));
    
    return (
      <Link 
        href={href} 
        className={`relative px-5 py-3 transition-all duration-300 hover:text-gray-200 ${
          isActive 
            ? 'text-white font-medium' 
            : 'text-gray-300'
        }`}
      >
        {children}
        {isActive && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-300 transform"></span>}
      </Link>
    );
  };

  // Menü açıkken body scroll'u engelle
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Menü durum değişikliğini Layout'a bildir
  useEffect(() => {
    const event = new CustomEvent('menuToggle', { detail: { isOpen: isMenuOpen } });
    window.dispatchEvent(event);
  }, [isMenuOpen]);

  // Scroll'a göre header'ı göster/gizle
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  // Menü açma/kapama fonksiyonu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Sayfa değiştiğinde menüyü kapat
  useEffect(() => {
    setIsMenuOpen(false);
  }, [router.pathname]);

  // Giriş Yap tıklama işlemi
  const handleLoginClick = () => {
    setIsLoginClicked(true);
    
    // 1.5 saniye sonra yönlendirme ve menüyü kapatma
    setTimeout(() => {
      setIsMenuOpen(false);
      router.push('/login');
    }, 1500);
  };

  // Menü öğesinin arka plan stilini belirle
  const getMenuItemStyle = (path: string) => {
    // Giriş Yap butonu için sabit pastel kırmızı arka plan, tıklanınca yeşil
    if (path === '/login') {
      return isLoginClicked ? 'bg-green-500/40' : 'bg-red-500/15';
    }
    
    // Hover efektlerini kaldırdık
    return '';
  };

  // Arama işlemi
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Arama işlemini gerçekleştir
      console.log('Aranan:', searchQuery);
      // Örnek olarak araştırma sayfasına yönlendir
      router.push(`/research?q=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      {/* Sabit Menü Simgesi */}
      <div className="fixed top-5 right-5 z-50">
        <button 
          onClick={toggleMenu}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700/40 text-white transition-all duration-300 focus:outline-none"
          aria-label={isMenuOpen ? "Menüyü Kapat" : "Menüyü Aç"}
        >
          <RiMenu4Line size={16} />
        </button>
      </div>

      {/* Modern Tam Ekran Menü - Mobilde soldan, masaüstünde sağdan açılır */}
      <div 
        className={`fixed top-0 h-full z-40 transform transition-all duration-500 ease-out 
          w-[calc(100%-3.5rem)] left-0 sm:left-auto sm:right-0 sm:w-40 
          ${isMenuOpen 
            ? 'translate-x-0' 
            : '-translate-x-full sm:translate-x-full'
          }`}
      >
        {/* Mobil kenar geçişi */}
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black via-black/50 to-transparent sm:hidden"></div>
        
        {/* Menü içeriği */}
        <div className="flex flex-col h-full bg-black shadow-[10px_0_30px_rgba(0,0,0,0.8)] sm:shadow-none">
          {/* Logo ve Arama Bölümü - Sadece mobilde görünür */}
          <div className="p-6 sm:hidden">
            <div className="flex justify-start mb-8">
              <Image
                src="/images/logo1.png"
                alt="Vacid Logo"
                width={120}
                height={40}
                className="w-auto h-auto max-h-[40px]"
              />
            </div>
            
            {/* Arama formu - Sadece mobilde görünür */}
            <form onSubmit={handleSearch} className="mb-8 mt-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 text-sm text-left focus:outline-none rounded-lg text-[#ced4da] bg-[#212529]"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                  style={{
                    backgroundColor: '#212529',
                    color: '#ced4da',
                  }}
                />
              </div>
            </form>
          </div>
          
          {/* Menü Linkleri - Mobilde normal akış, desktop'ta dikeyde ortada */}
          <nav className="flex flex-col px-6 space-y-3 sm:justify-center sm:h-full sm:items-center">
            <div className="max-w-[200px] w-full">
              <Link 
                href="/" 
                className={`py-2 px-4 text-sm text-left sm:text-center rounded-lg transition-all duration-300 w-full block flex items-center justify-start sm:justify-center h-10 font-semibold ${
                  router.pathname === '/' 
                    ? 'text-white' 
                    : 'text-gray-300'
                }`}
                onClick={toggleMenu}
              >
                <span>Ana Sayfa</span>
              </Link>
            </div>
            <div className="max-w-[200px] w-full">
              <Link 
                href="/research" 
                className={`py-2 px-4 text-sm text-left sm:text-center rounded-lg transition-all duration-300 w-full block flex items-center justify-start sm:justify-center h-10 font-semibold ${
                  router.pathname.startsWith('/research') 
                    ? 'text-white' 
                    : 'text-gray-300'
                }`}
                onClick={toggleMenu}
              >
                <span>Araştırmalar</span>
              </Link>
            </div>
          </nav>
          
          {/* Aşağıda Giriş Yap Butonu - mobilde altta, desktop'ta menü linklerinin altında */}
          <div className="mt-auto px-6 pb-10 sm:pb-6 sm:mt-0">
            <div className="max-w-[200px] w-full sm:mx-auto">
              <button 
                className={`py-2 px-4 text-sm text-left rounded-lg w-auto block flex items-center justify-start 
                  sm:text-center sm:w-full sm:justify-center
                  bg-[#212529] text-[#ced4da] 
                  transition-all duration-300 ease-in-out sm:rounded-lg sm:bg-red-500/15 sm:text-red-400 sm:hover:bg-red-500/25`}
                onClick={handleLoginClick}
                disabled={isLoginClicked}
                style={{
                  backgroundColor: '#212529',
                  color: '#ced4da',
                }}
              >
                <span>{isLoginClicked ? "Yönlendiriliyor..." : "Giriş Yap"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;