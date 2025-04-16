import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function AccessDenied() {
  const router = useRouter();

  // 5 saniye sonra ana sayfaya yönlendir
  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => {
      clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <>
      <Head>
        <title>Erişim Engellendi - Taha Vacid</title>
        <meta name="description" content="Admin paneline mobil cihazlardan erişim engellendi" />
      </Head>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4 text-center">
        <div className="mx-auto max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg">
          <div className="text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Erişim Engellendi</h1>
          <p className="text-gray-600">
            Admin paneline mobil cihazlardan erişim desteklenmemektedir. Lütfen masaüstü bir cihaz kullanınız.
          </p>
          <p className="text-sm text-gray-500">
            5 saniye içerisinde ana sayfaya yönlendirileceksiniz.
          </p>
          <Link href="/" className="inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </>
  );
} 