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
      try {
        // Supabase'e dosyayı yükle
        const result = await uploadFile(file);
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
   * Dosyadan görüntü yükleme - Editor.js Image aracı tarafından çağrılır
   */
  async uploadByFile(file: File) {
    return this.uploadCallback(file);
  }

  /**
   * URL'den görüntü yükleme - Editor.js Image aracı tarafından çağrılır
   * Not: Bu örnekte desteklenmiyor, gerçek bir fetch ve yükleme işlemi eklenebilir
   */
  async uploadByUrl(url: string) {
    console.warn('URL üzerinden görüntü yükleme şu anda desteklenmiyor');
    return {
      success: 0,
      file: {
        url: ''
      }
    };
  }
} 