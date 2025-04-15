import React, { ReactNode } from 'react';

// Container props tanımı
interface ContainerProps {
  children: ReactNode;
  className?: string;
}

// Container bileşeni - İçeriğin genişliğini ve konumunu düzenleyen yapı
const Container: React.FC<ContainerProps> = ({ children, className = '' }) => {
  return (
    <div className={`container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl ${className}`}>
      {children}
    </div>
  );
};

export default Container; 