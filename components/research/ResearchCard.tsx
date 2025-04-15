import React from 'react';
import Link from 'next/link';

// Araştırma kartı için prop türleri
interface ResearchCardProps {
  id: string;
  title: string;
  date: string;
  description: string;
  slug: string;
}

// ResearchCard bileşeni - Araştırma listesinde görüntülenen kart
const ResearchCard: React.FC<ResearchCardProps> = ({ id, title, date, description, slug }) => {
  // Açıklamayı 150 karakterle sınırlama
  const truncatedDescription = description.length > 150 
    ? `${description.substring(0, 147)}...` 
    : description;
  
  return (
    <div className="border-b border-dim-gray py-6">
      <Link href={`/research/${slug}`} className="block hover:bg-black rounded-lg transition-all p-4 -mx-4">
        <div className="flex flex-col md:flex-row justify-between mb-2">
          <h3 className="text-xl font-semibold text-platinum">{title}</h3>
          <span className="text-sm text-taupe-gray mt-1 md:mt-0">{date}</span>
        </div>
        <p className="text-sm text-taupe-gray leading-relaxed mt-2">
          {truncatedDescription}
        </p>
      </Link>
    </div>
  );
};

export default ResearchCard; 