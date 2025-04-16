import React, { useEffect, useRef, useState } from 'react';
import { EditorJSConfig, EditorJSData, EMPTY_EDITOR_DATA } from './EditorConfig';
import ImageUploader from './ImageUploader';

// Tip uyumsuzluğu sorununu önlemek için dynamic import yerine client-side kontrol kullanacağız
const isClient = typeof window !== 'undefined';

// Props tipi
interface EditorProps {
  data?: EditorJSData;
  onChange?: (data: EditorJSData) => void;
  readOnly?: boolean;
  placeholder?: string;
  autofocus?: boolean;
  autoSave?: boolean; // Otomatik kaydetme özelliği için yeni prop
}

/**
 * Editor.js kullanan zengin metin editörü
 */
const Editor: React.FC<EditorProps> = ({
  data = EMPTY_EDITOR_DATA,
  onChange,
  readOnly = false,
  placeholder = 'İçeriğinizi buraya yazın...',
  autofocus = false,
  autoSave = false, // Varsayılan olarak otomatik kaydetme kapalı
}) => {
  // Editor.js örneğini saklamak için ref
  const editorRef = useRef<any>(null);
  // Modüllerin yüklenme durumunu tutacak state
  const [loaded, setLoaded] = useState(false);
  // Editorun tutulacağı HTML element ID'si
  const EDITOR_ID = 'editorjs-container';
  // Değişim olduğunu kontrol etmek için state
  const [hasChanges, setHasChanges] = useState(false);

  // Manuel kaydetme fonksiyonu
  const saveContent = async () => {
    if (!editorRef.current || !onChange) return;
    
    try {
      const savedData = await editorRef.current.save();
      
      // Veri kontrolü ve temizliği yapılıyor
      if (savedData && savedData.blocks) {
        // Her bloğu kontrol et ve temizle
        savedData.blocks = savedData.blocks.filter((block: any) => {
          // Blok tipini ve data varlığını kontrol et
          if (!block || !block.type || block.data === undefined || block.data === null) {
            console.warn(`Geçersiz blok atlanıyor: ${JSON.stringify(block)}`);
            return false;
          }
          
          // Paragraf bloklarını kontrol et
          if (block.type === 'paragraph') {
            if (!block.data) block.data = {};
            if (block.data.text === undefined || block.data.text === null) {
              block.data.text = '';
            }
            // Boş nesne olmadığını kontrol et
            return true;
          }
          
          // Image bloklarını kontrol et
          if (block.type === 'image') {
            if (!block.data) block.data = {};
            if (!block.data.file || typeof block.data.file !== 'object') {
              console.warn('Geçersiz resim bloğu atlanıyor: Dosya verisi eksik');
              return false;
            }
            
            if (!block.data.file.url || typeof block.data.file.url !== 'string') {
              console.warn('Geçersiz resim bloğu atlanıyor: URL eksik veya geçersiz');
              return false;
            }
            
            // Diğer gerekli alanları varsayılan değerlerle doldur
            if (!block.data.caption) block.data.caption = '';
            if (!block.data.withBorder) block.data.withBorder = false;
            if (!block.data.withBackground) block.data.withBackground = false;
            if (!block.data.stretched) block.data.stretched = false;
          }
          
          return true;
        });
        
        // Son blok kontrolü ve ekleme
        if (savedData.blocks.length === 0) {
          savedData.blocks.push({
            type: 'paragraph',
            data: {
              text: ''
            }
          });
        }
      }
      
      onChange(savedData);
      setHasChanges(false);
    } catch (error) {
      console.error('Editor data kaydetme hatası:', error);
    }
  };

  // Komponent yüklendiğinde editor'ı başlat
  useEffect(() => {
    // Server tarafında çalışmasını engelle
    if (!isClient) return;
    
    let isMounted = true;

    const initEditor = async () => {
      try {
        // Modülleri dinamik olarak import et
        const [
          EditorJS,
          Header,
          List,
          Checklist,
          Quote,
          Code,
          Image,
          Embed,
          LinkTool,
          Table
        ] = await Promise.all([
          import('@editorjs/editorjs').then(({ default: module }) => module),
          import('@editorjs/header').then(({ default: module }) => module),
          import('@editorjs/list').then(({ default: module }) => module),
          import('@editorjs/checklist').then(({ default: module }) => module),
          import('@editorjs/quote').then(({ default: module }) => module),
          import('@editorjs/code').then(({ default: module }) => module),
          import('@editorjs/image').then(({ default: module }) => module),
          import('@editorjs/embed').then(({ default: module }) => module),
          import('@editorjs/link').then(({ default: module }) => module),
          import('@editorjs/table').then(({ default: module }) => module)
        ]);

        // EditorJS örneği mevcut ise önce temizle
        if (editorRef.current) {
          await editorRef.current.destroy();
          editorRef.current = null;
        }

        if (!isMounted) return;

        // Özel CSS ekle - WYSIWYG editörünün içindeki renkleri düzelt
        const styleElement = document.createElement('style');
        styleElement.textContent = `
          #${EDITOR_ID} {
            color: #1a202c !important;
          }
          #${EDITOR_ID} .ce-block__content, 
          #${EDITOR_ID} .ce-toolbar__content {
            max-width: 100% !important;
          }
          #${EDITOR_ID} .cdx-block {
            color: #1a202c !important;
          }
          #${EDITOR_ID} .ce-paragraph {
            color: #1a202c !important;
            font-size: 16px !important;
            line-height: 1.5 !important;
          }
          #${EDITOR_ID} h2.ce-header {
            color: #1a202c !important;
            font-size: 24px !important;
          }
          #${EDITOR_ID} h3.ce-header {
            color: #1a202c !important;
            font-size: 20px !important;
          }
          #${EDITOR_ID} h4.ce-header {
            color: #1a202c !important;
            font-size: 18px !important;
          }
          
          /* İmleç sorunu düzeltmesi */
          #${EDITOR_ID} .ce-block {
            position: relative;
          }
          #${EDITOR_ID} .ce-paragraph[data-placeholder]:empty::before {
            position: absolute;
            opacity: 0.5;
          }
          
          /* İçerik bloklarını ortalama */
          #${EDITOR_ID} .ce-block__content {
            margin: 0 auto !important;
            padding: 0 15px !important;
          }
          
          /* / menüsü pozisyon düzeltmesi */
          #${EDITOR_ID} .ce-popover {
            left: 50% !important;
            transform: translateX(-50%) !important;
            max-width: 600px !important;
            width: 90% !important;
          }
          
          /* / menüsü butonlarını düzenle */
          #${EDITOR_ID} .ce-popover-item {
            padding: 8px 10px !important;
          }
          
          /* Click to tune düğmesini belirgin hale getir ve köşeye hizala */
          #${EDITOR_ID} .ce-toolbar__settings-btn {
            right: 10px !important;
            left: auto !important;
            top: 10px !important;
            transform: none !important;
            position: absolute !important;
            background-color: #f3f4f6 !important;
            width: 30px !important;
            height: 30px !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            border: 1px solid #e5e7eb !important;
            opacity: 1 !important;
            visibility: visible !important;
            z-index: 100 !important;
          }
          
          /* Settings butonu hover efekti */
          #${EDITOR_ID} .ce-toolbar__settings-btn:hover {
            background-color: #e5e7eb !important;
          }
          
          /* Artı tuşunu tamamen gizle, sadece / komutunu kullan */
          #${EDITOR_ID} .ce-toolbar__plus {
            display: none !important;
          }
          
          /* Araç çubuğunu düzenle */
          #${EDITOR_ID} .ce-toolbar {
            position: absolute !important;
            width: 100% !important;
            height: 100% !important;
            top: 0 !important;
            left: 0 !important;
            pointer-events: none !important;
          }
          
          /* Araç çubuğu içindeki butonlara tıklanabilir özelliği geri ver */
          #${EDITOR_ID} .ce-toolbar__settings-btn {
            pointer-events: auto !important;
          }
          
          /* Seçenekler menüsünü düzenle */
          #${EDITOR_ID} .ce-settings {
            right: 0 !important;
            left: auto !important;
          }
        `;
        document.head.appendChild(styleElement);

        // Editor.js yapılandırmasını oluştur
        const config: EditorJSConfig = {
          holder: EDITOR_ID,
          data: data,
          readOnly: readOnly,
          autofocus: autofocus,
          placeholder: placeholder,
          inlineToolbar: true,
          onReady: () => {
            setLoaded(true);
          },
          tools: {
            header: {
              class: Header,
              config: {
                levels: [2, 3, 4],
                defaultLevel: 2
              }
            },
            list: {
              class: List,
              inlineToolbar: true
            },
            checklist: {
              class: Checklist,
              inlineToolbar: true
            },
            quote: {
              class: Quote,
              inlineToolbar: true,
              config: {
                quotePlaceholder: 'Alıntı yazın',
                captionPlaceholder: 'Yazar'
              }
            },
            code: {
              class: Code
            },
            image: {
              class: Image,
              config: {
                uploader: new ImageUploader(),
                captionPlaceholder: 'Görsel açıklaması',
                buttonContent: 'Görsel Yükle',
                accepts: ['image/*'],
                types: 'image/*',
                // Yükleme sırasında görüntülenecek iletişim kutusu metinleri
                additionalRequestData: {
                  author: 'Editor'
                },
                // Maksimum dosya boyutu - 5MB
                fileSizeLimit: 5 * 1024 * 1024, 
                // Yükleme başarısız olduğunda hata göster
                onUploadError: (e: Error) => {
                  console.error('Görsel yükleme hatası:', e);
                  alert('Görsel yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
                }
              }
            },
            embed: {
              class: Embed,
              config: {
                services: {
                  youtube: true,
                  vimeo: true
                }
              }
            },
            linkTool: {
              class: LinkTool
            },
            table: {
              class: Table,
              inlineToolbar: true,
              config: {
                rows: 2,
                cols: 3
              }
            }
          },
          onChange: (api, event) => {
            // Sadece değişiklik olduğunu bildir, kaydetme
            setHasChanges(true);

            // Otomatik kaydetme aktifse kaydet
            if (autoSave && onChange) {
              const saveTimeout = setTimeout(async () => {
                await saveContent();
              }, 1000); // 1 saniye gecikme ile otomatik kaydet
              
              return () => clearTimeout(saveTimeout);
            }
          }
        };

        // Editor'ı başlat
        const editor = new EditorJS(config);
        editorRef.current = editor;
        
        // İçerik değişikliğini izle
        editor.isReady.then(() => {
          if (isMounted) {
            setLoaded(true);
          }
        }).catch((error: any) => {
          console.error('Editor.js başlatma hatası:', error);
        });
      } catch (error) {
        console.error('Editor.js ve eklentilerini yükleme hatası:', error);
      }
    };

    // Editor'ı başlat
    initEditor();

    // Temizleme fonksiyonu
    return () => {
      isMounted = false;
      // Eklenen stil elementini temizle
      document.querySelectorAll('style').forEach(el => {
        if (el.textContent && el.textContent.includes(`#${EDITOR_ID}`)) {
          el.remove();
        }
      });
      // Komponent unmount olduğunda editörü temizle
      if (editorRef.current) {
        try {
          // Destroy fonksiyonu mevcut ve çağrılabilir ise çağır
          if (typeof editorRef.current.destroy === 'function') {
            editorRef.current.destroy();
          }
        } catch (error) {
          console.warn('Editor temizlenirken hata:', error);
        } finally {
          editorRef.current = null;
        }
      }
    };
  }, [data, onChange, readOnly, placeholder, autofocus, autoSave]);

  return (
    <div className="relative">
      {/* Yükleniyor göstergesi */}
      {!loaded && isClient && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70">
          <div className="w-12 h-12 rounded-full border-4 border-gray-900 border-t-transparent animate-spin"></div>
        </div>
      )}
      
      {/* Editor konteyner div'i */}
      <div 
        id={EDITOR_ID} 
        className="prose prose-gray max-w-none rounded-md border border-gray-300 p-4 min-h-[300px] focus-within:ring-2 focus-within:ring-[#dee2e6] focus-within:border-[#dee2e6] text-gray-900"
      />
      
      {/* Kaydetme düğmesi - Otomatik kaydetme aktif değilse göster */}
      {!autoSave && hasChanges && onChange && (
        <div className="flex justify-end mt-2">
          <button
            onClick={saveContent}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Kaydet
          </button>
        </div>
      )}
      
      {/* Editor araç ipuçları */}
      <div className="text-xs text-gray-500 mt-2">
        <ul className="flex flex-wrap gap-2">
          <li className="px-2 py-1 bg-gray-100 rounded-md">Başlık: H2-H4</li>
          <li className="px-2 py-1 bg-gray-100 rounded-md">Görsel Ekleme</li>
          <li className="px-2 py-1 bg-gray-100 rounded-md">Listeler</li>
          <li className="px-2 py-1 bg-gray-100 rounded-md">Alıntı</li>
          <li className="px-2 py-1 bg-gray-100 rounded-md">Kod Bloğu</li>
          <li className="px-2 py-1 bg-gray-100 rounded-md">Tablo</li>
          <li className="px-2 py-1 bg-gray-100 rounded-md">Bağlantı</li>
          <li className="px-2 py-1 bg-gray-100 rounded-md">Gömülü İçerik</li>
        </ul>
      </div>
    </div>
  );
};

export default Editor;