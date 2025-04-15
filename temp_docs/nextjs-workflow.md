# Profesyonel Next.js Proje İş Akışı

Bu rehber, modern ve profesyonel bir Next.js projesi geliştirme sürecinde izlenmesi gereken adımları detaylı olarak açıklamaktadır.

## 1. Proje Kurulumu

### Geliştirme Ortamı Hazırlığı
```bash
# Node.js'in güncel sürümünün yüklü olduğundan emin olun (LTS sürümü önerilir)
node -v  # v18.x veya daha yüksek olmalı

# npm veya yarn'ın güncel olduğundan emin olun
npm -v   # veya
yarn -v
```

### Next.js Projesi Oluşturma
```bash
# create-next-app kullanarak yeni proje oluşturma
npx create-next-app@latest my-nextjs-project
cd my-nextjs-project

# veya yarn kullanarak
yarn create next-app my-nextjs-project
cd my-nextjs-project

# Kurulum sırasında sorulacak sorulara cevaplar:
# - TypeScript kullanmak istiyor musunuz? Evet (önerilir)
# - ESLint kullanmak istiyor musunuz? Evet
# - Tailwind CSS kullanmak istiyor musunuz? (tercihinize göre)
# - src/ dizinini kullanmak istiyor musunuz? Evet (önerilir)
# - App Router kullanmak istiyor musunuz? Evet (modern yaklaşım)
# - import alias oluşturmak istiyor musunuz? Evet (@/* şeklinde)
```

### Gerekli Paketlerin Kurulumu
```bash
# Temel geliştirme araçları
npm install --save-dev prettier eslint-config-prettier husky lint-staged

# UI kütüphaneleri (ihtiyaca göre)
npm install @headlessui/react @heroicons/react

# Form yönetimi
npm install react-hook-form zod @hookform/resolvers

# Durum yönetimi (gerekirse)
npm install zustand # veya
npm install @tanstack/react-query
```

## 2. Proje Yapısı ve Organizasyon

### Önerilen Dizin Yapısı (App Router)
```
my-nextjs-project/
├── .github/                  # GitHub Actions CI/CD yapılandırması
├── .husky/                   # Git hook'ları
├── public/                   # Statik dosyalar (favicons, robot.txt, vb.)
├── src/
│   ├── app/                  # App Router sayfaları
│   │   ├── (auth)/           # Gruplandırılmış rotalar (auth routes)
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── api/              # API rotaları
│   │   ├── layout.tsx        # Kök layout
│   │   └── page.tsx          # Ana sayfa
│   ├── components/           # Bileşenler
│   │   ├── ui/               # Temel UI bileşenleri
│   │   ├── forms/            # Form bileşenleri
│   │   ├── layout/           # Layout bileşenleri
│   │   └── sections/         # Sayfa bölümleri
│   ├── lib/                  # Yardımcı fonksiyonlar ve kütüphaneler
│   │   ├── utils.ts
│   │   └── constants.ts
│   ├── hooks/                # Özel React hook'ları
│   ├── styles/               # Global stiller
│   ├── types/                # TypeScript tipleri
│   └── services/             # API servisleri
├── .eslintrc.js              # ESLint yapılandırması
├── .prettierrc               # Prettier yapılandırması
├── next.config.js            # Next.js yapılandırması
├── tsconfig.json             # TypeScript yapılandırması
├── tailwind.config.js        # Tailwind yapılandırması (eğer kullanılıyorsa)
└── package.json              # Proje bağımlılıkları
```

## 3. Kodlama Standartları ve En İyi Pratikler

### Linter ve Formatter Ayarları
```bash
# .prettierrc dosyası
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}

# ESLint entegrasyonu (.eslintrc.js)
module.exports = {
  extends: [
    'next/core-web-vitals',
    'prettier'
  ],
  rules: {
    // Projeye özel kurallar
  }
}
```

### Git Commitleri Öncesi Kod Düzenleme (Husky ve lint-staged)
```bash
# package.json'a ekle
"scripts": {
  // ... diğer scriptler
  "prepare": "husky install"
},
"lint-staged": {
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ]
}

# Husky kurulumu
npm run prepare
npx husky add .husky/pre-commit "npx lint-staged"
```

## 4. Bileşen Mimarisi

### Atom Design Metodolojisi
- **Atoms**: Butonlar, Inputlar, Iconlar
- **Molecules**: Form alanları, Card bileşenleri
- **Organisms**: Header, Footer, SidebarNavigaiton
- **Templates**: Sayfa düzenleri
- **Pages**: Gerçek sayfalar

### Bileşen Örneği (Button.tsx)
```tsx
// src/components/ui/Button.tsx
import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import classNames from 'classnames';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', children, isLoading, className, ...props }, ref) => {
    const baseStyles = 'font-medium rounded-lg inline-flex items-center justify-center';
    
    const variantStyles = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
      outline: 'border border-gray-300 hover:bg-gray-100 text-gray-800',
    };
    
    const sizeStyles = {
      sm: 'text-xs px-2.5 py-1.5',
      md: 'text-sm px-4 py-2',
      lg: 'text-base px-6 py-3',
    };
    
    return (
      <button
        ref={ref}
        className={classNames(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          isLoading && 'opacity-70 cursor-not-allowed',
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && (
          <svg className="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24">
            {/* Spinner SVG */}
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
```

## 5. Veri Fetching ve API Entegrasyonu

### API Servis Katmanı
```tsx
// src/services/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function fetchApi<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new ApiError(response.status, data.message || 'API Error');
  }
  
  return data as T;
}
```

### React Query Kullanımı
```tsx
// src/hooks/useUsers.ts
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/services/api';

interface User {
  id: number;
  name: string;
  email: string;
}

export function useUsers() {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => fetchApi('/users'),
    staleTime: 1000 * 60 * 5, // 5 dakika
  });
}
```

## 6. Routing ve Sayfa Yapısı

### App Router ile Sayfa Oluşturma
```tsx
// src/app/blog/[slug]/page.tsx
import { Metadata } from 'next';
import { getBlogPost, getAllPostSlugs } from '@/services/blogService';

// Dinamik metaveri
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPost(params.slug);
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage],
    },
  };
}

// Statik parametre üretimi
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map(slug => ({ slug }));
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);
  
  return (
    <article className="max-w-3xl mx-auto py-12">
      <h1 className="text-4xl font-bold">{post.title}</h1>
      <div className="mt-6 text-gray-600">
        {new Date(post.publishedAt).toLocaleDateString()}
      </div>
      <div className="prose mt-8" dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
```

### Layout Kullanımı
```tsx
// src/app/blog/layout.tsx
export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="container mx-auto px-4">
      <aside className="mb-8 pb-4 border-b">
        <h2 className="text-2xl font-bold">Blog</h2>
        <p className="text-gray-600">En son yazılar ve güncellemeler</p>
      </aside>
      <div>{children}</div>
    </section>
  );
}
```

## 7. Form Yönetimi

### React Hook Form ve Zod Validasyonu
```tsx
// src/app/(auth)/register/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/components/ui/Button';

const registerSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
  email: z.string().email('Geçerli bir e-posta adresi girin'),
  password: z.string().min(8, 'Şifre en az 8 karakter olmalıdır'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor',
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    // Form işleme mantığı
    console.log(data);
    // API çağrısı yapılabilir
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Kayıt Ol</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">İsim</label>
          <input
            {...register('name')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">E-posta</label>
          <input
            type="email"
            {...register('email')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Şifre</label>
          <input
            type="password"
            {...register('password')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Şifreyi Tekrarla</label>
          <input
            type="password"
            {...register('confirmPassword')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>
        
        <Button
          type="submit"
          isLoading={isSubmitting}
          className="w-full"
        >
          Kayıt Ol
        </Button>
      </form>
    </div>
  );
}
```

## 8. Stil ve Tema Yönetimi

### Tailwind CSS Kullanımı
```bash
# Tailwind CSS kurulumu (eğer başlangıçta seçilmediyse)
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

```jsx
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          // ... diğer tonlar
          900: '#0c4a6e',
        },
        // diğer tema renkleri
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Montserrat', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
```

### Bileşen Stillendirme
```tsx
// src/components/Card.tsx
import { ReactNode } from 'react';
import classNames from 'classnames';

interface CardProps {
  title?: string;
  className?: string;
  children: ReactNode;
  padding?: 'none' | 'small' | 'normal' | 'large';
  variant?: 'default' | 'bordered' | 'elevated';
}

export default function Card({
  title,
  className,
  children,
  padding = 'normal',
  variant = 'default',
}: CardProps) {
  const paddingClasses = {
    none: '',
    small: 'p-3',
    normal: 'p-5',
    large: 'p-8',
  };
  
  const variantClasses = {
    default: 'bg-white',
    bordered: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-md',
  };
  
  return (
    <div 
      className={classNames(
        'rounded-lg',
        variantClasses[variant],
        paddingClasses[padding],
        className
      )}
    >
      {title && (
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
      )}
      {children}
    </div>
  );
}
```

## 9. SEO ve Performans Optimizasyonu

### Metadata ve SEO
```tsx
// src/app/layout.tsx
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | Site İsmi',
    default: 'Site İsmi – Kısa Açıklama',
  },
  description: 'Sitenizin detaylı açıklaması burada yer alır.',
  keywords: ['nextjs', 'react', 'web development'],
  authors: [{ name: 'İsminiz' }],
  creator: 'İsminiz',
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://www.siteniz.com',
    siteName: 'Site İsmi',
    images: [
      {
        url: 'https://www.siteniz.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Site İsmi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@twitter_kullanici_adi',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: '/favicon.ico' }],
    apple: [{ url: '/apple-touch-icon.png' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

### Resim Optimizasyonu
```tsx
import Image from 'next/image';

export default function OptimizedImage() {
  return (
    <figure className="relative w-full h-64">
      <Image
        src="/images/header.jpg"
        alt="Açıklama metni"
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority
        className="object-cover"
      />
    </figure>
  );
}
```

## 10. Dağıtım (Deployment) ve CI/CD

### Vercel ile Dağıtım
```bash
# Vercel CLI kurulumu
npm install -g vercel

# Giriş yapma
vercel login

# Proje dağıtımı
vercel # interaktif CLI
# veya
vercel --prod # doğrudan production'a dağıtım
```

### GitHub Actions ile CI/CD Kurulumu
```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Lint
        run: npm run lint
        
      - name: Type check
        run: npm run typecheck
        
      - name: Run tests
        run: npm test
        
  deploy:
    if: github.ref == 'refs/heads/main'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## 11. Geliştirme İş Akışı Özeti

1. **Planlama ve Tasarım**
   - Sayfaların ve bileşenlerin tasarımı
   - Veri modelleri ve API gereksinimlerinin belirlenmesi
   - Sayfa rotalarının planlanması

2. **Geliştirme Akışı**
   - Git Flow stratejisini uygulayın (`main`, `develop`, `feature/*`)
   - Her özellik için yeni bir dal oluşturun
   - TDD prensiplerine uyun (mümkünse)
   - Düzenli commit'ler yapın

3. **Kod İncelemesi**
   - Pull Request açın
   - Otomatik CI kontrolleri çalıştırın
   - Kod incelemesini tamamlayın
   - Geri bildirimleri düzeltin

4. **Test ve Kalite Kontrol**
   - Birim testleri yazın
   - Entegrasyon testleri ekleyin
   - Kullanıcı arayüzü testleri yapın
   - Erişilebilirlik kontrollerini gerçekleştirin

5. **Dağıtım ve İzleme**
   - Preview ortamına dağıtım
   - Son kullanıcı testleri
   - Production ortamına dağıtım
   - Performans ve hata izleme

---

Bu rehber sayesinde profesyonel bir Next.js projesi geliştirme sürecinizi verimli ve yapılandırılmış bir hale getirebilirsiniz. İyi çalışmalar! 