import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Sadece GET isteklerine izin ver
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Sadece GET metodu destekleniyor' });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Geçerli bir ID gerekli' });
    }

    // Supabase'den araştırmayı getir
    const { data, error } = await supabase
      .from('researches')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Yayın getirme hatası:', error);
      return res.status(500).json({ message: 'Yayın getirme hatası', error: error.message });
    }

    if (!data) {
      return res.status(404).json({ message: 'Yayın bulunamadı' });
    }

    // Başarılı sonuç döndür
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('API hatası:', error);
    return res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
} 