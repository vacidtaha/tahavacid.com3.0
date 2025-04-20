# tahavacid.com

Bu proje, Taha Vacid'in kişisel web sitesi için Next.js tabanlı bir uygulamadır.

## Teknolojiler

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Next-Auth
- **Database**: Supabase
- **Animation**: Framer Motion

## Kurulum

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

## Kullanım

Geliştirme modunda, uygulama varsayılan olarak `http://localhost:3000` adresinde çalışır.

## Sürümleme

Bu proje, semantic-release kullanarak otomatik sürümleme sistemini kullanmaktadır. Commit mesajları şu formatta yazılmalıdır:

- **feat**: Yeni bir özellik eklendiğinde (minor sürüm artışı)
- **fix**: Bir hata düzeltildiğinde (patch sürüm artışı)
- **BREAKING CHANGE**: Geriye dönük uyumsuz bir değişiklik eklendiğinde (major sürüm artışı)
- **docs**: Yalnızca dokümantasyon değişiklikleri
- **style**: Kod anlamını etkilemeyen değişiklikler (boşluk, biçimlendirme, noktalı virgül vb.)
- **refactor**: Hata düzeltmeyen ve özellik eklemeyen kod değişiklikleri
- **perf**: Performansı iyileştiren kod değişiklikleri
- **test**: Eksik testleri ekleme veya varolan testleri düzeltme
- **chore**: Yapı sürecini veya yardımcı araçları ve kütüphaneleri değiştiren değişiklikler

## Lisans

Tüm hakları saklıdır.

# VPS'de Research Sayfası Düzeltme Adımları

VPS'de yeni eklenen araştırmaların Research sayfasında görünmemesi sorununu çözmek için aşağıdaki adımları takip edin:

## 1. VPS'ye SSH ile Bağlanma
```bash
ssh kullanıcı_adı@sunucu_ip_adresi
```

## 2. Proje Klasörüne Gitme
```bash
cd /var/www/tahavacid.com
```

## 3. Değişiklikleri Uygulamak İçin Dosyayı Düzenleme
```bash
# pages/research/index.tsx dosyasını düzenleyin
nano pages/research/index.tsx
```

## 4. Dosyada Yapılacak Değişiklikler
- Aşağıdaki değişiklikleri yapın:
  - `import { GetStaticProps } from 'next';` yerine `import { GetServerSideProps } from 'next';` yazın
  - Dosyanın sonundaki `getStaticProps` fonksiyonunu `getServerSideProps` olarak değiştirin
  - `revalidate: 600` ve `revalidate: 60` satırlarını kaldırın

Dosyanın son hali şu şekilde olmalıdır:
```tsx
import { GetServerSideProps } from 'next';
...
// Sunucu tarafında veri getirme (her istek için canlı veri)
export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // Supabase'den verileri getir
    const researches = await getResearches();
    
    return {
      props: {
        researches,
      },
    };
  } catch (error) {
    console.error('Verileri alırken hata oluştu:', error);
    
    // Hata durumunda boş dizi döndür
    return {
      props: {
        researches: [],
      },
    };
  }
};
```

## 5. Uygulamayı Yeniden Derleme
```bash
npm run build
```

## 6. Uygulamayı Yeniden Başlatma
```bash
# PM2 kullanıyorsanız
pm2 restart tahavacid.com

# Manuel olarak Node.js kullanıyorsanız
npm start
```

## 7. Değişiklikleri Test Etme
Tarayıcıda Research sayfasını açarak yeni eklenen araştırmaların listelenip listelenmediğini kontrol edin:
```
https://tahavacid.com/research
```

Bu değişikliklerle birlikte, yeni eklenen araştırmalar Research sayfasında hemen görünecektir, çünkü artık sayfa her yüklendiğinde en güncel veriler Supabase'den çekilecektir.




YVHVHBVHYBVYHVGHVHVHVHVHVH55
