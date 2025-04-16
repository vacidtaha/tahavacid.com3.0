import React, { useState, useEffect } from 'react';
import Header from './Header';

// Ana layout bileşeni - Header ve içeriği bir araya getirir
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Header'dan gelen menü durumunu dinle
  useEffect(() => {
    const handleMenuToggle = (e: CustomEvent) => {
      setIsMenuOpen(e.detail.isOpen);
    };

    window.addEventListener('menuToggle', handleMenuToggle as EventListener);
    
    return () => {
      window.removeEventListener('menuToggle', handleMenuToggle as EventListener);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white overflow-hidden">
      <Header />
      
      {/* Ana içerik - menü açıkken sağa itilir, mobilde daha fazla, masaüstünde daha az */}
      <div 
        className={`flex flex-col flex-grow transition-all duration-500 ease-out ${
          isMenuOpen 
            ? 'translate-x-[calc(100%-3.5rem)] blur-sm backdrop-blur-md sm:blur-0 sm:backdrop-blur-0 sm:-translate-x-32' 
            : 'translate-x-0 blur-0'
        }`}
      >
        <main className="flex-grow pt-16">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout; 