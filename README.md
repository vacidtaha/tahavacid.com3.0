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

Tüm hakları saklıdır. Yeni deploy testi
