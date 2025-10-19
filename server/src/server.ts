import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// .env dosyasındaki değişkenleri yükle
dotenv.config();

const app: Express = express();
const port: number = 3001;

app.use(cors());
app.use(express.json());

// Supabase istemcisini oluştur
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key var mı?:', !!supabaseKey);

const supabase = createClient(supabaseUrl, supabaseKey);

// Kategorileri listeleyecek API endpoint'i
app.get('/api/kategoriler', async (req: Request, res: Response) => {
  try {
    console.log('Kategoriler endpoint çağrıldı');
    
    const { data, error } = await supabase
      .from('kategoriler')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Supabase hatası:', error);
      throw error;
    }

    console.log('Kategoriler başarıyla çekildi:', data?.length || 0, 'adet');
    res.json(data);

  } catch (err: any) {
    console.error("Kategoriler hatası:", err.message);
    res.status(500).json({ 
      error: 'Kategoriler çekilemedi',
      message: err.message 
    });
  }
});

app.get('/api/icerikler',async(req:Request,res:Response)=>{
   try {
    console.log('Kategoriler endpoint çağrıldı');
    
    const { data, error } = await supabase
      .from('yazilar')
      .select(`
        id,
        baslik,
        icerik,
        olusturulma_tarihi,
        yazar_id ( kullanici_adi ) 
      `)
      .order('olusturulma_tarihi', { ascending: true });

    if (error) {
      console.error('Supabase hatası:', error);
      throw error;
    }

    console.log('İçerikler başarıyla çekildi:', data?.length || 0, 'adet');
    res.json(data);

  } catch (err: any) {
    console.error("İçerikler hatası:", err.message);
    res.status(500).json({ 
      error: 'İçerikler çekilemedi',
      message: err.message 
    });
  } 
});

// Server'ı başlat
const server = app.listen(port, () => {
  console.log(`✅ Backend sunucusu http://localhost:${port} adresinde başarıyla başlatıldı!`);
  console.log(`🔗 Test için: http://localhost:${port}/api/test`);
  console.log(`📁 Kategoriler için: http://localhost:${port}/api/kategoriler`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM alındı, sunucu kapatılıyor...');
  server.close(() => {
    console.log('Sunucu kapatıldı');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT alındı (Ctrl+C), sunucu kapatılıyor...');
  server.close(() => {
    console.log('Sunucu kapatıldı');
  });
});