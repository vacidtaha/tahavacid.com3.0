import React from 'react';
import Image from 'next/image';

// Footer bileşeni - Sadece logo2 içeren alt kısım
const Footer: React.FC = () => {
  return (
    <footer className="bg-black py-8">
      <div className="container mx-auto px-4 flex justify-center">
        {/* Sadece logo2 */}
        <div className="flex justify-center">
          <Image
            src="/images/logo2.png"
            alt="Vacid Logo"
            width={80}
            height={80}
            className="w-auto h-16"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer; 