import React, { useState, useEffect } from 'react';
import { EditorJSData } from './EditorConfig';

interface EditorRendererProps {
  data: EditorJSData;
}

/**
 * Image bileşeni - görsel yükleme hatalarını izole et
 */
const ImageRenderer: React.FC<{block: any, index: number}> = ({ block, index }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Bileşen yüklendiğinde görsel URL'sini ön yükleme yapmaya çalış
  useEffect(() => {
    if (!block.data?.file?.url) {
      setImageError(true);
      setIsLoading(false);
      return;
    }

    // Görsel önbelleğe almayı dene
    const img = new Image();
    
    img.onload = () => {
      console.log('Görsel başarıyla yüklendi:', block.data.file.url);
      setIsLoading(false);
    };
    
    img.onerror = () => {
      console.error('Görsel yüklenirken hata:', block.data.file.url);
      // Hemen hata gösterme, tekrar dene
      setTimeout(() => {
        const retryImg = new Image();
        retryImg.onload = () => {
          console.log('Görsel tekrar denemede yüklendi:', block.data.file.url);
          setIsLoading(false);
        };
        
        retryImg.onerror = () => {
          console.error('Görsel ikinci denemede de yüklenemedi:', block.data.file.url);
          setImageError(true);
          setIsLoading(false);
        };
        
        retryImg.src = block.data.file.url + '?retry=1&t=' + new Date().getTime();
      }, 1500);
    };
    
    // Görsel yüklemeyi başlat
    img.src = block.data.file.url;
    
    // 5 saniye sonra hala yüklenmediyse zaman aşımı
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.warn('Görsel yükleme zaman aşımı, varsayılan duruma geçiliyor:', block.data.file.url);
        setIsLoading(false);
      }
    }, 5000);
    
    // Cleanup
    return () => {
      clearTimeout(timeoutId);
    };
  }, [block.data?.file?.url]);

  // Yükleme durumu göstergesini render et
  if (isLoading) {
    return (
      <figure key={`image-${index}`} className="my-6 relative">
        <div className="w-full h-40 bg-gray-800 animate-pulse rounded-lg flex items-center justify-center">
          <div className="text-gray-400">Görsel yükleniyor...</div>
        </div>
      </figure>
    );
  }

  // Hata durumunda hata mesajı göster
  if (imageError) {
    return (
      <figure key={`image-${index}`} className="my-6">
        <div className="w-full p-4 border border-red-300 bg-red-50 text-red-500 rounded-lg">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <p>Görsel yüklenemedi</p>
          </div>
          <div className="text-xs mt-2 break-all">URL: {block.data.file.url}</div>
        </div>
        {block.data.caption && (
          <figcaption className="text-center text-sm text-gray-400 mt-2">
            {block.data.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  // Normal görsel göster
  return (
    <figure key={`image-${index}`} className="my-6">
      <img 
        src={block.data.file.url}
        alt={block.data.caption || 'Görsel'} 
        className={`mx-auto rounded-lg ${block.data.stretched ? 'w-full' : 'max-w-full'} ${block.data.withBorder ? 'border border-gray-700' : ''} ${block.data.withBackground ? 'bg-gray-800 p-2' : ''}`}
        loading="lazy"
      />
      {block.data.caption && (
        <figcaption className="text-center text-sm text-gray-400 mt-2">
          {block.data.caption}
        </figcaption>
      )}
    </figure>
  );
};

/**
 * EditorJS içeriğini görüntülemek için bileşen
 */
const EditorRenderer: React.FC<EditorRendererProps> = ({ data }) => {
  if (!data || !data.blocks) {
    return <div className="text-gray-400">İçerik bulunamadı veya uygun formatta değil.</div>;
  }

  return (
    <div className="editor-renderer">
      {data.blocks.map((block, index) => {
        // Her blok tipine göre render işlemi
        switch (block.type) {
          case 'paragraph':
            return (
              <p 
                key={`paragraph-${index}`} 
                className="mb-4"
                dangerouslySetInnerHTML={{ __html: block.data.text }}
              />
            );
          
          case 'header':
            const HeaderTag = `h${block.data.level}` as keyof JSX.IntrinsicElements;
            return (
              <HeaderTag 
                key={`header-${index}`} 
                className="font-bold mb-4 mt-8"
                dangerouslySetInnerHTML={{ __html: block.data.text }}
              />
            );
          
          case 'image':
            // Görsel bloğunun geçerli olduğunu kontrol et
            if (!block.data || !block.data.file || !block.data.file.url) {
              console.error('Geçersiz görsel bloğu:', block);
              return (
                <div key={`image-error-${index}`} className="p-4 bg-red-50 text-red-500 rounded-lg my-6">
                  Geçersiz görsel verisi
                </div>
              );
            }
            // Görsel render bileşenini kullan
            return <ImageRenderer key={`image-${index}`} block={block} index={index} />;
          
          case 'list':
            const ListContainer = block.data.style === 'ordered' ? 'ol' : 'ul';
            return (
              <ListContainer key={`list-${index}`} className={block.data.style === 'ordered' ? 'list-decimal ml-6 mb-4' : 'list-disc ml-6 mb-4'}>
                {block.data.items.map((item: string, itemIndex: number) => (
                  <li 
                    key={`list-item-${index}-${itemIndex}`}
                    dangerouslySetInnerHTML={{ __html: item }}
                    className="mb-2"
                  />
                ))}
              </ListContainer>
            );
          
          case 'quote':
            return (
              <blockquote key={`quote-${index}`} className="border-l-4 border-gray-500 pl-4 italic my-4">
                <p dangerouslySetInnerHTML={{ __html: block.data.text }} />
                {block.data.caption && (
                  <footer className="text-sm text-gray-400 mt-1">— {block.data.caption}</footer>
                )}
              </blockquote>
            );
          
          case 'code':
            return (
              <pre key={`code-${index}`} className="bg-gray-800 rounded-lg p-4 overflow-x-auto my-4">
                <code>{block.data.code}</code>
              </pre>
            );
          
          case 'table':
            return (
              <div key={`table-${index}`} className="overflow-x-auto my-4">
                <table className="min-w-full border-collapse border border-gray-700">
                  <tbody>
                    {block.data.content.map((row: string[], rowIndex: number) => (
                      <tr key={`table-row-${index}-${rowIndex}`} className={rowIndex === 0 && block.data.withHeadings ? 'bg-gray-800' : 'border-t border-gray-700'}>
                        {row.map((cell: string, cellIndex: number) => {
                          const CellTag = rowIndex === 0 && block.data.withHeadings ? 'th' : 'td';
                          return (
                            <CellTag 
                              key={`table-cell-${index}-${rowIndex}-${cellIndex}`}
                              className="border border-gray-700 px-4 py-2 text-left"
                              dangerouslySetInnerHTML={{ __html: cell }}
                            />
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          
          case 'embed':
            return (
              <div key={`embed-${index}`} className="my-4">
                <iframe
                  src={block.data.embed}
                  className="w-full rounded-lg"
                  height={block.data.height || 350}
                  frameBorder="0"
                  allowFullScreen
                />
                {block.data.caption && (
                  <p className="text-center text-sm text-gray-400 mt-2">{block.data.caption}</p>
                )}
              </div>
            );
          
          case 'checklist':
            return (
              <div key={`checklist-${index}`} className="my-4">
                {block.data.items.map((item: any, itemIndex: number) => (
                  <div key={`checklist-item-${index}-${itemIndex}`} className="flex items-start mb-2">
                    <input 
                      type="checkbox" 
                      checked={item.checked} 
                      disabled 
                      className="mt-1 mr-2 h-4 w-4 rounded border-gray-600 text-blue-600 focus:ring-0"
                    />
                    <span dangerouslySetInnerHTML={{ __html: item.text }} />
                  </div>
                ))}
              </div>
            );
          
          default:
            // Bilinmeyen blok tipleri için
            console.warn(`Bilinmeyen blok tipi: ${block.type}`);
            return null;
        }
      })}
    </div>
  );
};

export default EditorRenderer; 