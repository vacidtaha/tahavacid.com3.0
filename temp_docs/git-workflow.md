# Profesyonel Git İş Akışı

Bu dosya, Git ve GitHub'ı profesyonel bir yazılımcı gibi kullanmanız için gereken adımları ve en iyi pratikleri içermektedir.

## 1. Git Dallanma (Branching) Stratejisi

Profesyonel ekipler genellikle **Git Flow** modelini veya benzeri bir dallanma stratejisi kullanır:

- **main (master)**: Üretim ortamına hazır, tamamen kararlı kod
- **develop**: Aktif geliştirme dalı, bir sonraki sürüm için hazırlanan kod
- **feature/***:  Yeni özellikler için oluşturulan dallar (örn: feature/login-page)
- **hotfix/***:  Acil hata düzeltmeleri için dallar (örn: hotfix/auth-bug)
- **release/***:  Sürüm hazırlığı için dallar (örn: release/v1.0)

### Temel Dal Komutları:
```bash
# Dalları görüntüleme
git branch -a

# Dal oluşturma
git checkout -b develop
git checkout -b feature/yeni-ozellik

# Dallar arası geçiş
git checkout develop
git checkout main
```

## 2. Günlük İş Akışı

### a) Geliştirmeye Başlama
```bash
# 1. En güncel kodu al
git checkout develop
git pull origin develop

# 2. Yeni özellik dalı oluştur
git checkout -b feature/yeni-ozellik
```

### b) Geliştirme Süreci
```bash
# 3. Değişiklikler yap (kod yazma, düzenleme vs.)

# 4. Değişiklikleri kontrol et
git status
git diff

# 5. Değişiklikleri hazırlama alanına ekle
git add .            # Tüm değişiklikleri ekle
# VEYA
git add dosya1.js    # Belirli dosyaları ekle

# 6. Değişiklikleri commit et
git commit -m "feat: Giriş sayfası tasarımı tamamlandı"
```

### c) Güncelleme ve Gönderme
```bash
# 7. Ana daldaki (develop) güncellemeleri al 
git pull --rebase origin develop

# 8. Çakışma varsa çöz ve devam et
# (Çakışma olursa dosyaları düzenle, ardından:)
git add .
git rebase --continue

# 9. Değişiklikleri uzak depoya gönder
git push origin feature/yeni-ozellik
```

### d) Pull Request ve Birleştirme
```bash
# 10. GitHub'da PR (Pull Request) aç
# 11. Kod incelemesi yapılır (Code Review)
# 12. Onay sonrası PR birleştirilir (Merge)

# 13. Yerel depoyu güncelle
git checkout develop
git pull origin develop
```

## 3. İyi Commit Mesajları Yazma

İyi bir commit mesajı şu formatta olmalıdır:

```
[Tip]: Kısa açıklama (50 karakter veya daha az)

Daha detaylı açıklama (gerekirse). Yaklaşık 72 
karakterlik satırlara bölün. İlk satır özetle ne 
yapıldığını, detay kısmı ise neden yapıldığını açıklar.
```

### Tip Kategorileri:
- **feat**: Yeni özellik
- **fix**: Hata düzeltmesi
- **docs**: Sadece dokümantasyon değişiklikleri
- **style**: Kod stilinde yapılan değişiklikler (format, boşluk vb.)
- **refactor**: Kod işlevini değiştirmeyen yeniden düzenlemeler
- **test**: Test ekleme veya güncelleme
- **chore**: Derleme süreci veya yardımcı araçlarla ilgili değişiklikler

## 4. Yararlı Git Teknikleri

### Geçici Değişiklik Saklama (Stash)
```bash
# Değişiklikleri geçici olarak sakla
git stash save "Üzerinde çalıştığım yarım kalmış değişiklikler"

# Saklanan değişiklikleri listele
git stash list

# Saklanan değişiklikleri geri getir
git stash apply stash@{0}   # Belirli bir stash'i getir
git stash pop               # Son stash'i getir ve listeden kaldır
```

### Commit Geçmişini Düzenleme
```bash
# Son commit'i düzenleme
git commit --amend -m "Yeni commit mesajı"

# Son birkaç commit'i düzenleme (Squash, Edit, Reword, Drop)
git rebase -i HEAD~3
```

### Farkları Görüntüleme
```bash
# Çalışma alanı ile son commit arasındaki farklar
git diff

# İki dal arasındaki farklar
git diff main..develop

# İki commit arasındaki farklar
git diff abc123..def456
```

### Geçmişi Görüntüleme
```bash
# Basit log
git log

# Görsel, renkli log
git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit
```

## 5. Kısayollar ve Verimlilik

```bash
# Sık kullanılan komut kısayolları tanımlama
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status

# Kullanımı:
git co develop   # git checkout develop
git br -a        # git branch -a
git ci -m "mesaj" # git commit -m "mesaj"
git st           # git status
```

## 6. Hata Düzeltme Senaryoları

### Yanlış Dalda Commit Yaptığınızda
```bash
# 1. Değişiklikleri geçici olarak sakla
git stash

# 2. Doğru dala geç
git checkout doğru-dal

# 3. Değişiklikleri geri getir
git stash pop

# 4. Değişiklikleri commit et
git add .
git commit -m "feat: Yeni özellik eklendi"
```

### Son Commit'i Geri Almak
```bash
# Commit'i geri al ama değişiklikleri koru
git reset --soft HEAD~1

# Commit'i ve değişiklikleri tamamen geri al
git reset --hard HEAD~1
```

## 7. İleri Seviye Git

### Birleştirme (Merge) vs. Yeniden Tabanlama (Rebase)
```bash
# Merge: Dallar arasında birleştirme yapar (her commit korunur)
git checkout develop
git merge feature/x

# Rebase: Commit'leri hedef dalın üzerine yeniden uygular (daha temiz geçmiş)
git checkout feature/x
git rebase develop
```

### Etiketleme (Tagging)
```bash
# Yeni etiket oluşturma
git tag -a v1.0.0 -m "Versiyon 1.0.0 Sürümü"

# Etiketleri listeleme
git tag

# Etiketleri uzak depoya gönderme
git push origin --tags
```

## 8. GitHub Özellikleri

### Pull Request En İyi Pratikleri
1. Her PR bir tek görev/özellik içermeli
2. PR başlığı ve açıklaması detaylı olmalı
3. PR'ın içerebileceği testler eklenmiş olmalı
4. PR gönderilmeden önce son kontrol yapılmalı

### GitHub Actions ve CI/CD
- Otomatik testler
- Derleme kontrolleri
- Kod kalite kontrolleri
- Otomatik dağıtım

---

Bu iş akışlarını ve pratikleri takip ederek, profesyonel bir yazılım geliştirme ekibinde sorunsuz şekilde çalışabileceksiniz. Git ve GitHub konusunda daha fazla bilgi için resmi dokümantasyonu inceleyebilirsiniz: https://git-scm.com/doc 