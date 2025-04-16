import { createClient } from '@supabase/supabase-js';

// Supabase ortam değişkenlerini al
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('❌ Supabase environment değişkenleri tanımlanmamış. NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_ANON_KEY eksik.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Research {
  id: string;
  title: string;
  content: string;
  created_at: string;
  slug: string;
  description: string;
  category: string;
  image_url?: string;
}

export async function signIn(email: string, password: string) {
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  return await supabase.auth.signOut();
}

export async function getCurrentUser() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user || null;
}

export function subscribeToAuthChanges(callback: (event: 'SIGNED_IN' | 'SIGNED_OUT', session: any) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event as any, session);
  });
}

export function subscribeToResearches(callback: (researches: Research[]) => void) {
  getResearches().then(initialResearches => {
    callback(initialResearches as Research[]);

    const subscription = supabase
      .channel('researches-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'researches' }, 
        async () => {
          const updatedResearches = await getResearches();
          callback(updatedResearches as Research[]);
        })
      .subscribe();

    return subscription;
  });
}

export async function getResearches() {
  try {
    console.log('Araştırmalar getiriliyor...');
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

export async function addResearch(research: Partial<Omit<Research, 'id' | 'created_at'>>) {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      console.error('Kullanıcı oturumu bulunamadı');
      throw new Error('Oturum süresi dolmuş olabilir, lütfen tekrar giriş yapın');
    }

    if (!research.title || !research.content || !research.slug) {
      throw new Error('Başlık, içerik ve slug zorunludur');
    }

    const { data, error } = await supabase
      .from('researches')
      .insert([{ ...research, created_at: new Date().toISOString() }])
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

export async function updateResearch(id: string, updates: Partial<Omit<Research, 'id' | 'created_at'>>) {
  try {
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

export async function deleteResearch(id: string) {
  try {
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

// Dosya yükleme fonksiyonu
export async function uploadFile(file: File, bucket: string = 'images') {
  try {
    console.log('Supabase uploadFile çağrıldı:', file.name, file.type, file.size, 'bucket:', bucket);
    
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      console.error('Kullanıcı oturumu bulunamadı');
      throw new Error('Oturum süresi dolmuş olabilir, lütfen tekrar giriş yapın');
    }

    // Dosya adının benzersiz olması için timestamp ekliyoruz
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${fileName}`;

    console.log('Yükleme için dosya yolu:', filePath);

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Dosya yüklenirken hata oluştu:', error);
      throw error;
    }

    console.log('Dosya başarıyla yüklendi:', data);

    // Dosya URL'ini döndür
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    console.log('Dosyanın genel URL\'i:', urlData.publicUrl);

    return {
      url: urlData.publicUrl,
      path: filePath
    };
  } catch (err) {
    console.error('Dosya yükleme hatası:', err);
    throw err;
  }
}

// Dosya silme fonksiyonu
export async function deleteFile(filePath: string, bucket: string = 'images') {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      console.error('Kullanıcı oturumu bulunamadı');
      throw new Error('Oturum süresi dolmuş olabilir, lütfen tekrar giriş yapın');
    }

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('Dosya silinirken hata oluştu:', error);
      throw error;
    }

    return true;
  } catch (err) {
    console.error('Dosya silme hatası:', err);
    throw err;
  }
}

// Yayın içeriğinin JSON formatında güncellenmesi
export async function updateResearchContent(id: string, content: any) {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      console.error('Kullanıcı oturumu bulunamadı');
      throw new Error('Oturum süresi dolmuş olabilir, lütfen tekrar giriş yapın');
    }
    
    // EditorJS veri kontrolü
    if (content && typeof content === 'object') {
      // Geçersiz blokları temizle
      if (content.blocks && Array.isArray(content.blocks)) {
        content.blocks = content.blocks.filter((block: any) => 
          block && block.type && block.data !== undefined
        );
      }
    }

    // İçeriği string mi yoksa obje mi kontrol et ve doğru şekilde kaydet
    let contentToSave;
    if (typeof content === 'string') {
      try {
        // Zaten JSON string ise geçerli olduğundan emin ol
        JSON.parse(content);
        contentToSave = content;
      } catch (error) {
        // JSON formatında değilse JSON'a çevir
        contentToSave = JSON.stringify(content);
      }
    } else {
      // Obje ise JSON string'e çevir
      contentToSave = JSON.stringify(content);
    }

    const { data, error } = await supabase
      .from('researches')
      .update({ content: contentToSave })
      .eq('id', id)
      .select();

    if (error) {
      console.error('İçerik güncellenirken hata oluştu:', error);
      throw error;
    }

    return data?.[0] || null;
  } catch (err) {
    console.error('İçerik güncelleme hatası:', err);
    throw err;
  }
}

// Araştırma ekleme fonksiyonunu JSON içerik desteği ile güncelle
export async function addResearchWithJsonContent(research: Partial<Omit<Research, 'id' | 'created_at'>>, editorContent: any) {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      console.error('Kullanıcı oturumu bulunamadı');
      throw new Error('Oturum süresi dolmuş olabilir, lütfen tekrar giriş yapın');
    }

    if (!research.title || !research.slug) {
      throw new Error('Başlık ve slug zorunludur');
    }
    
    // EditorJS veri kontrolü
    if (editorContent && typeof editorContent === 'object') {
      // Geçersiz blokları temizle
      if (editorContent.blocks && Array.isArray(editorContent.blocks)) {
        editorContent.blocks = editorContent.blocks.filter((block: any) => 
          block && block.type && block.data !== undefined
        );
      }
      
      // Boş blokları kontrol et
      if (!editorContent.blocks || editorContent.blocks.length === 0) {
        // En azından boş bir paragraf bloğu ekle
        editorContent.blocks = [{
          type: 'paragraph',
          data: { text: '' }
        }];
      }
    }

    // İçeriği doğru formatta hazırla
    let jsonContent;
    if (typeof editorContent === 'string') {
      try {
        // Zaten JSON string ise geçerli olduğundan emin ol
        JSON.parse(editorContent);
        jsonContent = editorContent;
      } catch (error) {
        // JSON formatında değilse JSON'a çevir
        jsonContent = JSON.stringify(editorContent);
      }
    } else {
      // Obje ise JSON string'e çevir
      jsonContent = JSON.stringify(editorContent);
    }

    const { data, error } = await supabase
      .from('researches')
      .insert([{ 
        ...research, 
        content: jsonContent,
        created_at: new Date().toISOString() 
      }])
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