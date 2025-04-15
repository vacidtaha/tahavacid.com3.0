import { createClient } from '@supabase/supabase-js';

// Supabase bağlantı bilgileri
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Supabase client oluşturma
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Araştırma türü tanımı
export interface Research {
  id: string;
  title: string;
  content: string;
  created_at: string;
  slug: string;
  description: string;
  category: string;
  image_url?: string; // İsteğe bağlı resim URL'si
}

// Kimlik doğrulama fonksiyonları
// --------------------------------

// Giriş yapma fonksiyonu
export async function signIn(email: string, password: string) {
  return await supabase.auth.signInWithPassword({
    email,
    password
  });
}

// Çıkış yapma fonksiyonu
export async function signOut() {
  return await supabase.auth.signOut();
}

// Mevcut kullanıcıyı getirme fonksiyonu
export async function getCurrentUser() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user || null;
}

// Oturum durumunu takip etme
export function subscribeToAuthChanges(callback: (event: 'SIGNED_IN' | 'SIGNED_OUT', session: any) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event as any, session);
  });
}

// Real-time veri aboneliği
// --------------------------------

// Araştırmalara gerçek zamanlı abone olma fonksiyonu
export function subscribeToResearches(callback: (researches: Research[]) => void) {
  // Önce mevcut araştırmaları getir
  getResearches().then(initialResearches => {
    // İlk verileri hemen gönder
    callback(initialResearches as Research[]);
    
    // Araştırma değişikliklerini dinle
    const subscription = supabase
      .channel('researches-changes')
      .on('postgres_changes', 
        { 
          event: '*', // INSERT, UPDATE, DELETE olaylarını dinle
          schema: 'public',
          table: 'researches' 
        }, 
        async () => {
          // Herhangi bir değişiklik olduğunda tüm verileri yeniden getir
          const updatedResearches = await getResearches();
          callback(updatedResearches as Research[]);
        })
      .subscribe();
      
    // Aboneliği döndür (gerekirse ileride kaldırılabilir)
    return subscription;
  });
}

// Veri işlemleri fonksiyonları
// --------------------------------

// Tüm araştırmaları getiren fonksiyon
export async function getResearches() {
  try {
    console.log('Araştırmalar getiriliyor...');
    // Sorguyu basitleştir, sadece kesin olarak var olan sütunları iste
    const { data, error } = await supabase
      .from('researches')
      .select('id, title, created_at, slug, description, category')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Araştırmalar alınırken hata oluştu:', error);
      return [];
    }

    console.log('Getirilen araştırma sayısı:', data?.length || 0);
    return data || [];
  } catch (err) {
    console.error('Veri getirme hatası:', err);
    return [];
  }
}

// Slug'a göre tekil araştırma getiren fonksiyon (içerik dahil tüm alanlarla)
export async function getResearchBySlug(slug: string) {
  try {
    const { data, error } = await supabase
      .from('researches')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Araştırma alınırken hata oluştu:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Veri getirme hatası:', err);
    return null;
  }
}

// Yeni araştırma ekleme fonksiyonu (admin paneli için)
export async function addResearch(research: Partial<Omit<Research, 'id' | 'created_at'>>) {
  try {
    // Önce kullanıcı oturumunu kontrol et
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error('Kullanıcı oturumu bulunamadı');
      throw new Error('Oturum süresi dolmuş olabilir, lütfen tekrar giriş yapın');
    }
    
    // Zorunlu alanları kontrol et
    if (!research.title || !research.content || !research.slug) {
      throw new Error('Başlık, içerik ve slug zorunludur');
    }
    
    const { data, error } = await supabase
      .from('researches')
      .insert([
        { 
          ...research,
          created_at: new Date().toISOString(),
        }
      ])
      .select();

    if (error) {
      console.error('Araştırma eklenirken hata oluştu:', error);
      throw error;
    }

    return data?.[0] || null;
  } catch (err) {
    console.error('Veri ekleme hatası:', err);
    throw err;
  }
}

// Araştırma güncelleme fonksiyonu (admin paneli için)
export async function updateResearch(id: string, updates: Partial<Omit<Research, 'id' | 'created_at'>>) {
  try {
    // Önce kullanıcı oturumunu kontrol et
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error('Kullanıcı oturumu bulunamadı');
      throw new Error('Oturum süresi dolmuş olabilir, lütfen tekrar giriş yapın');
    }
    
    const { data, error } = await supabase
      .from('researches')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Araştırma güncellenirken hata oluştu:', error);
      throw error;
    }

    return data?.[0] || null;
  } catch (err) {
    console.error('Veri güncelleme hatası:', err);
    throw err;
  }
}

// Araştırma silme fonksiyonu (admin paneli için)
export async function deleteResearch(id: string) {
  try {
    // Önce kullanıcı oturumunu kontrol et
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.error('Kullanıcı oturumu bulunamadı');
      throw new Error('Oturum süresi dolmuş olabilir, lütfen tekrar giriş yapın');
    }
    
    const { error } = await supabase
      .from('researches')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Araştırma silinirken hata oluştu:', error);
      throw error;
    }

    return true;
  } catch (err) {
    console.error('Veri silme hatası:', err);
    throw err;
  }
} 