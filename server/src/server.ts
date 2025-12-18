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
    console.log('İçerikler endpoint çağrıldı');
    
    // Query parametresinden kategori filtresi
    const { kategori_id } = req.query;
    
    let query = supabase
      .from('yazilar')
      .select(`
        id,
        baslik,
        icerik,
        image_url,
        begeni_sayisi,
        goruntuleme,
        olusturulma_tarihi::date,
        kategori_id,
        yazar_id ( id, kullanici_adi )
      `)
      .order('olusturulma_tarihi', { ascending: false });
    
    // Kategori filtresi varsa ekle
    if (kategori_id) {
      console.log('Kategori filtresi uygulanıyor:', kategori_id);
      query = query.eq('kategori_id', kategori_id);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase hatası:', error);
      throw error;
    }

    console.log('İçerikler başarıyla çekildi:', data?.length || 0, 'adet');
    if (data && data.length > 0) {
      console.log('İlk yazı örneği:', JSON.stringify(data[0], null, 2));
    }
    res.json(data);

  } catch (err: any) {
    console.error("İçerikler hatası:", err.message);
    res.status(500).json({ 
      error: 'İçerikler çekilemedi',
      message: err.message 
    });
  } 
});

// Beğeni artırma endpoint'i
app.post('/api/begeni/:yaziId', async (req: Request, res: Response) => {
  try {
    const yaziId = req.params.yaziId;
    const { kullanici_id } = req.body;
    
    console.log('Beğeni endpoint çağrıldı:', { yaziId, kullanici_id });
    
    if (!kullanici_id) {
      return res.status(400).json({ error: 'Kullanıcı ID gerekli' });
    }

    // Önce yazının mevcut beğeni sayısını al
    const { data: currentData, error: fetchError } = await supabase
      .from('yazilar')
      .select('begeni_sayisi')
      .eq('id', yaziId)
      .single();

    if (fetchError) {
      console.error('Yazı bulunamadı:', fetchError);
      return res.status(404).json({ error: 'Yazı bulunamadı' });
    }

    // Beğeni sayısını 1 artır
    const yeniBegeniSayisi = (currentData.begeni_sayisi || 0) + 1;
    
    

const { data, error } = await supabase
  .from('yazilar')
  .update({ begeni_sayisi: yeniBegeniSayisi })
  .eq('id', yaziId)
  .select('begeni_sayisi')
  .single();

    if (error) {
      console.error('Beğeni güncellemesi hatası:', error);
      throw error;
    }

    console.log('Beğeni başarıyla artırıldı:', data);
    res.json({ success: true, begeni_sayisi: data.begeni_sayisi });

  } catch (err: any) {
    console.error('Beğeni hatası:', err.message);
    res.status(500).json({ 
      error: 'Beğeni eklenemedi',
      message: err.message 
    });
  }
});

app.get('/api/yazarlar', async (req: Request, res: Response) => {
  try {
    console.log('Yazarlar endpoint çağrıldı');
    
    const { data, error } = await supabase
      .from('yazarlar')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Yazarlar Supabase hatası:', error);
      return res.status(500).json({ 
        error: 'Yazarlar çekilemedi',
        message: error.message 
      });
    }

    console.log('Yazarlar başarıyla çekildi:', data?.length || 0, 'adet');
    console.log('İlk yazar örneği:', JSON.stringify(data?.[0], null, 2));
    res.json(data);

  } catch (err: any) {
    console.error("Yazarlar hatası:", err.message);
    res.status(500).json({ 
      error: 'Yazarlar çekilemedi',
      message: err.message 
    });
  }
});

// Yeni yazı ekleme endpoint'i
// Yeni yazı ekleme endpoint'i
app.post('/api/yazilar', async (req: Request, res: Response) => {
  try {
    // kategori_id'yi de body'den alıyoruz
    const { baslik, icerik, image_url, yazar_id, kategori_id, slug } = req.body;
    
    if (!baslik || !icerik || !yazar_id) {
      return res.status(400).json({ error: 'Başlık, içerik ve yazar ID gerekli' });
    }

    const { data, error } = await supabase
      .from('yazilar')
      .insert([{
        baslik,
        icerik,
        image_url,
        yazar_id,
        kategori_id: kategori_id || 1, // Eğer boş gelirse varsayılan 1 veriyoruz
        slug: slug || baslik.toLowerCase().replace(/ /g, '-'), // Basit slug oluşturucu
        begeni_sayisi: 0,
        goruntuleme: 0
        // olusturulma_tarihi'ni Supabase otomatik atar, koddan göndermene gerek yok.
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase Hatası Detayı:', error); // Buradaki log hatayı net söyler
      return res.status(400).json({ error: error.message });
    }

    res.json({ success: true, data });

  } catch (err: any) {
    res.status(500).json({ error: 'Sunucu hatası', message: err.message });
  }
});

// Yazı silme endpoint'i
app.delete('/api/yazilar/:id', async (req: Request, res: Response) => {
  try {
    const yaziId = req.params.id;
    const { yazar_id } = req.body;
    
    console.log('Yazı silme isteği:', { yaziId, yazar_id });
    
    if (!yazar_id) {
      return res.status(400).json({ error: 'Yazar ID gerekli' });
    }

    // Önce yazının sahibini kontrol et
    const { data: yaziData, error: fetchError } = await supabase
      .from('yazilar')
      .select('yazar_id')
      .eq('id', yaziId)
      .single();

    if (fetchError) {
      console.error('Yazı bulunamadı:', fetchError);
      return res.status(404).json({ error: 'Yazı bulunamadı' });
    }

    if (yaziData.yazar_id !== yazar_id) {
      return res.status(403).json({ error: 'Bu yazıyı silme yetkiniz yok' });
    }

    const { error } = await supabase
      .from('yazilar')
      .delete()
      .eq('id', yaziId);

    if (error) {
      console.error('Yazı silme hatası:', error);
      throw error;
    }

    console.log('Yazı başarıyla silindi:', yaziId);
    res.json({ success: true, message: 'Yazı başarıyla silindi' });

  } catch (err: any) {
    console.error('Yazı silme hatası:', err.message);
    res.status(500).json({ 
      error: 'Yazı silinemedi',
      message: err.message 
    });
  }
});

app.get('/api/yazilar/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('yazilar')
      .select(`
        *,
        yazar_id ( id, kullanici_adi ),
        kategoriler:kategori_id ( ad )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(404).json({ error: 'Yazı bulunamadı' });
  }
});

// Kullanıcıları listeleyecek API endpoint'i (rol filtresi ile)
app.get('/api/kullanicilar', async (req: Request, res: Response) => {
  try {
    console.log('Kullanıcılar endpoint çağrıldı');
    
    // Query parametresinden rol filtresini al
    const { rol } = req.query;
    
    let query = supabase
      .from('kullanicilar')
      .select('*')
      .order('id', { ascending: true });
    
    // Eğer rol parametresi varsa filtreleme yap
    if (rol) {
      query = query.eq('rol', rol);
    }
    
    const { data, error } = await query;

    if (error) {
      console.error('Kullanıcılar Supabase hatası:', error);
      return res.status(500).json({ 
        error: 'Kullanıcılar çekilemedi',
        message: error.message 
      });
    }

    console.log('Kullanıcılar başarıyla çekildi:', data?.length || 0, 'adet');
    if (rol) {
      console.log(`Rol filtresi: ${rol}`);
    }
    res.json(data);

  } catch (err: any) {
    console.error("Kullanıcılar hatası:", err.message);
    res.status(500).json({ 
      error: 'Kullanıcılar çekilemedi',
      message: err.message 
    });
  }
});

// Tek yazar bilgisini getiren endpoint
app.get('/api/yazarlar/:id', async (req: Request, res: Response) => {
  try {
    const yazarId = req.params.id;
    console.log('Tek yazar endpoint çağrıldı, ID:', yazarId);
    
    const { data, error } = await supabase
      .from('yazarlar')
      .select('*')
      .eq('id', yazarId)
      .single();

    if (error) {
      console.error('Yazar Supabase hatası:', error);
      return res.status(500).json({ 
        error: 'Yazar bilgisi çekilemedi',
        message: error.message 
      });
    }

    if (!data) {
      return res.status(404).json({ 
        error: 'Yazar bulunamadı' 
      });
    }

    console.log('Yazar başarıyla çekildi:', data.kullanici_adi);
    res.json(data);

  } catch (err: any) {
    console.error("Yazar hatası:", err.message);
    res.status(500).json({ 
      error: 'Yazar bilgisi çekilemedi',
      message: err.message 
    });
  }
});

// Login endpoint'i - hem kullanicilar hem yazarlar tablosunu kontrol eder
app.post('/api/login', async (req: Request, res: Response) => {
  try {
    const { email, sifre } = req.body;
    console.log('Login attempt:', { email, sifre: '***' });

    if (!email || !sifre) {
      return res.status(400).json({ 
        success: false,
        error: 'Email ve şifre gerekli' 
      });
    }

    // Önce yazarlar tablosunda kontrol et
    const { data: yazarData, error: yazarError } = await supabase
      .from('yazarlar')
      .select('*')
      .eq('email', email)
      .eq('sifre', sifre)
      .not('email', 'is', null) // null email olanları hariç tut
      .single();

    if (!yazarError && yazarData) {
      console.log('Yazar girişi başarılı:', yazarData.kullanici_adi);
      
      // Yazar bilgilerini kullanıcı formatına çevir
      const user = {
        id: yazarData.id,
        kullanici_adi: yazarData.kullanici_adi,
        email: yazarData.email,
        rol: 'yazar',
        image: yazarData.profil_resmi_url
      };

      return res.json({
        success: true,
        message: 'Yazar girişi başarılı',
        user: user
      });
    }

    // Yazarlar tablosunda bulunamadıysa kullanicilar tablosunda kontrol et
    const { data: kullaniciData, error: kullaniciError } = await supabase
      .from('kullanicilar')
      .select('*')
      .eq('email', email)
      .eq('sifre', sifre)
      .single();

    if (!kullaniciError && kullaniciData) {
      console.log('Kullanıcı girişi başarılı:', kullaniciData.kullanici_adi);
      
      return res.json({
        success: true,
        message: 'Giriş başarılı',
        user: kullaniciData
      });
    }

    // Her iki tablobda da bulunamadı
    console.log('Login failed - user not found or wrong password');
    return res.status(401).json({
      success: false,
      error: 'Email veya şifre hatalı'
    });

  } catch (err: any) {
    console.error("Login hatası:", err.message);
    res.status(500).json({ 
      success: false,
      error: 'Giriş yapılamadı',
      message: err.message 
    });
  }
});

// Server'ı başlat
const server = app.listen(port, () => {
  console.log(`✅ Backend sunucusu http://localhost:${port} adresinde başarıyla başlatıldı!`);
  console.log(`🔗 Test için: http://localhost:${port}/api/test`);
  console.log(`� Login için: http://localhost:${port}/api/login`);
  console.log(`�📁 Kategoriler için: http://localhost:${port}/api/kategoriler`);
  console.log(`📝 İçerikler için: http://localhost:${port}/api/icerikler`);
  console.log(`👥 Yazarlar için: http://localhost:${port}/api/yazarlar`);
  console.log(`👤 Kullanıcılar için: http://localhost:${port}/api/kullanicilar`);
  console.log(`🔒 Yazar kullanıcıları için: http://localhost:${port}/api/kullanicilar?rol=yazar`);
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