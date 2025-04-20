#!/bin/bash

# Masaüstünde youtube-ozet klasörü oluştur
DEST_DIR=~/Desktop/youtube-ozet
mkdir -p "$DEST_DIR"
mkdir -p "$DEST_DIR/pages"
mkdir -p "$DEST_DIR/components/components/ui"
mkdir -p "$DEST_DIR/components/lib"
mkdir -p "$DEST_DIR/styles"

# Ana deney sayfasını kopyala
cp ~/Desktop/tahavacid.com/pages/experiment.tsx "$DEST_DIR/pages/"

# UI bileşenlerini kopyala
cp ~/Desktop/tahavacid.com/components/components/ui/splash-cursor.tsx "$DEST_DIR/components/components/ui/"
cp ~/Desktop/tahavacid.com/components/components/ui/gooey-text-morphing.tsx "$DEST_DIR/components/components/ui/"
cp ~/Desktop/tahavacid.com/components/components/ui/placeholders-and-vanish-input.tsx "$DEST_DIR/components/components/ui/"
cp ~/Desktop/tahavacid.com/components/components/ui/custom-text-generate-effect.tsx "$DEST_DIR/components/components/ui/"
cp ~/Desktop/tahavacid.com/components/components/ui/text-shimmer.tsx "$DEST_DIR/components/components/ui/"
cp ~/Desktop/tahavacid.com/components/components/ui/text-generate-effect.tsx "$DEST_DIR/components/components/ui/"

# Yardımcı fonksiyonları kopyala 
cp ~/Desktop/tahavacid.com/components/lib/utils.ts "$DEST_DIR/components/lib/"

# Gerekli stil dosyalarını kopyala (varsa)
cp -r ~/Desktop/tahavacid.com/styles/* "$DEST_DIR/styles/" 2>/dev/null || true

# package.json dosyasını kopyala
cp ~/Desktop/tahavacid.com/package.json "$DEST_DIR/"

# README.md dosyası oluştur
cat > "$DEST_DIR/README.md" << 'EOL'
# YouTube Video Özetleyici

Bu proje, YouTube videolarını özetleyen interaktif bir web uygulamasıdır. Next.js, React ve Framer Motion kullanılarak geliştirilmiştir.

## Özellikler

- YouTube video bağlantısını girerek özet alma
- Görsel olarak çekici animasyonlar ve efektler:
  - Splash cursor: Fare hareketlerine tepki veren akışkan animasyon (masaüstü görünümünde)
  - Shimmer text: Parıldayan metinler
  - Gooey text morphing: Akıcı metin dönüşümleri
  - Metin oluşturma efektleri
- Özet sonucunu kopyalama
- Tamamen duyarlı (responsive) tasarım
- Mobil cihazlarda performans için optimize edilmiş

## Dosya Yapısı

- `pages/experiment.tsx`: Ana uygulama sayfası
- `components/components/ui/`: Tüm UI bileşenleri:
  - `splash-cursor.tsx`: Akışkan arka plan animasyonu
  - `gooey-text-morphing.tsx`: Akıcı metin geçişleri
  - `placeholders-and-vanish-input.tsx`: Giriş alanı bileşeni
  - `custom-text-generate-effect.tsx`: Özet metni animasyonları
  - `text-shimmer.tsx`: Metinlere parıldama efekti
  - `text-generate-effect.tsx`: Metin oluşturma efektleri
- `components/lib/utils.ts`: Yardımcı fonksiyonlar

## Kurulum ve Çalıştırma

Projeyi yerel geliştirme ortamınızda çalıştırmak için:

1. Gerekli paketleri yükleyin:
   ```
   npm install
   ```

2. Geliştirme sunucusunu başlatın:
   ```
   npm run dev
   ```

3. Tarayıcınızda [http://localhost:3000/experiment](http://localhost:3000/experiment) adresine giderek uygulamayı görüntüleyin.

## Teknolojiler

- Next.js
- React
- TypeScript
- Framer Motion (animasyonlar için)
- Tailwind CSS (stillendirme için)
- WebGL (splash cursor efekti için)

## Geliştiriciler

Bu uygulama Firudin Mustafayev tarafından geliştirilmiştir.
EOL

echo "YouTube Özet uygulaması $DEST_DIR klasörüne kopyalandı." 