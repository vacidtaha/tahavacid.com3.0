import React from 'react';
import Image from 'next/image';

// Hero bileşeni - Anasayfanın üst kısmındaki tam sayfa hero alanı
const Hero: React.FC = () => {
  return (
    <div className="bg-black min-h-[70vh] flex items-center justify-center">
      {/* Ortada logo2 */}
      <div className="text-center">
        <Image
          src="/images/logo2.png"
          alt="Vacid Logo"
          width={250}
          height={250}
          className="w-auto h-auto max-w-[250px]"
          priority
        />
      </div>
    </div>
  );
};

export default Hero; 