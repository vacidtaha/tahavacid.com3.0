import { uploadFile } from '../../lib/supabase';

/**
 * Editor.js için Supabase görüntü yükleme mekanizması
 */
export default class ImageUploader {
  private readonly uploadCallback: (file: File) => Promise<{success: number; file: {url: string}}>;

  constructor() {
    // Fonksiyonu sınıf örneğine bağla
    this.uploadByFile = this.uploadByFile.bind(this);
    this.uploadByUrl = this.uploadByUrl.bind(this);

    // Varsayılan yükleme fonksiyonu
    this.uploadCallback = async (file: File) => {
      // Dosya kontrolü
      if (!file) {
        console.error('Görüntü yükleme hatası: Dosya tanımsız veya boş');
        return {
          success: 0,
          file: {
            url: ''
          }
        };
      }

      // Dosya türü kontrolü
      if (!file.type.startsWith('image/')) {
        console.error('Geçersiz dosya türü:', file.type);
        return {
          success: 0,
          file: {
            url: ''
          }
        };
      }

      try {
        console.log('Dosya yükleme başladı:', file.name, file.type, file.size);
        
        // Dosya boyutu kontrolü
        if (file.size > 5 * 1024 * 1024) {
          console.error('Dosya boyutu çok büyük:', file.size);
          throw new Error('Dosya boyutu 5MB\'dan küçük olmalıdır');
        }
        
        // Supabase'e dosyayı yükle
        const result = await uploadFile(file);
        
        console.log('Yükleme sonucu:', result);
        
        if (!result || !result.url) {
          throw new Error('Yükleme başarılı oldu fakat URL alınamadı');
        }
        
        // Doğrulama yapmaya çalış ama hata durumunda yine de devam et
        try {
          await this.checkImageUrlExists(result.url);
        } catch (validationError: unknown) {
          const errorMessage = validationError instanceof Error ? 
            validationError.message : 
            'Bilinmeyen doğrulama hatası';
          
          console.warn('Görsel URL doğrulanamadı ancak yükleme kabul ediliyor:', errorMessage);
          // Doğrulama hatası olsa bile devam et
        }
        
        // Başarılı sonuç - ImageTool'un beklediği yapıda
        return {
          success: 1,
          file: {
            url: result.url
          }
        };
      } catch (error) {
        console.error('Görüntü yükleme hatası:', error);
        return {
          success: 0,
          file: {
            url: ''
          }
        };
      }
    };
  }

  /**
   * URL'nin erişilebilir olup olmadığını kontrol et
   * Yalnızca basit bir kontrol - CORS sorunlarını önlemek için fetch API kullanıyor
   */
  private checkImageUrlExists = (url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      console.log('URL erişilebilirlik kontrolü başlatılıyor:', url);
      
      // Fetch API ile URL'ye HEAD isteği göndererek var olup olmadığını kontrol et
      fetch(url, { method: 'HEAD', mode: 'no-cors' })
        .then(response => {
          console.log('URL kontrolü tamamlandı:', url);
          resolve();
        })
        .catch(error => {
          console.error('URL kontrolü başarısız oldu:', url, error);
          reject(new Error('URL erişilebilir değil'));
        });
      
      // 3 saniye sonra zaman aşımına uğrarsa yine de devam et
      setTimeout(() => {
        console.log('URL kontrol zaman aşımı, yine de devam ediliyor:', url);
        resolve();
      }, 3000);
    });
  };

  /**
   * Dosyadan görüntü yükleme - Editor.js Image aracı tarafından çağrılır
   */
  async uploadByFile(file: File) {
    if (!file) {
      console.error('uploadByFile: Geçersiz dosya');
      return {
        success: 0,
        file: {
          url: ''
        }
      };
    }
    console.log('uploadByFile çağrıldı:', file.name);
    return this.uploadCallback(file);
  }

  /**
   * URL'den görüntü yükleme - Editor.js Image aracı tarafından çağrılır
   * Not: Bu örnekte desteklenmiyor, gerçek bir fetch ve yükleme işlemi eklenebilir
   */
  async uploadByUrl(url: string) {
    console.warn('URL üzerinden görüntü yükleme şu anda desteklenmiyor:', url);
    return {
      success: 0,
      file: {
        url: ''
      }
    };
  }
} 