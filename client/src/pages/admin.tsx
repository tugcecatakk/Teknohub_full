import React, { useEffect, useState, useMemo } from 'react';

// Admin bileşenine prop olarak gelmesi gereken bir ID'yi simüle ediyoruz.
// Normalde bu ID, giriş yapma işleminden sonra alınır ve bileşene iletilir.
// Eğer bileşen dışından prop olarak geliyorsa, interface'e ekleyin.
// Örnek: const Admin = ({ oturumAcikYazarId }: { oturumAcikYazarId: number }) => { ... }

interface YazarDetayProps { // Yazarlar tablosundaki bir kaydı temsil eder
    id: number;
    ad_soyad: string;
    email: string;
    profil_resmi_url: string; // Ekledim, mevcut kodunuzda kullanılıyor
    // Diğer alanlar...
}

interface YaziProps { // İçerikler tablosundaki bir kaydı temsil eder
    id: number;
    baslik: string;
    icerik: string;
    // Yazar ID'si için iki olası durum var:
    // 1. API sadece ID'yi döndürür: yazar_id: number;
    // 2. API ilişkili veriyi (nested) döndürür (yazarın tamamı veya bir kısmı):
    yazar_id: number | { id: number; kullanici_adi: string; /* ... */ }; // Hem ID hem nesne ihtimali için union type
    olusturulma_tarihi: string;
}

type TabType = 'yazilarim' | 'kaydedilenler' | 'taslaklar';

// Yazar ID'sini simüle eden bir prop ekleyelim.
interface AdminComponentProps {
    // Oturum açmış yazarın ID'si, dışarıdan (girişten) gelmelidir.
    oturumAcikYazarId: number; 
}

// Bileşeni prop alacak şekilde güncelliyoruz
const Admin = ({ oturumAcikYazarId }: AdminComponentProps) => { // Prop'u kullan
    
    const [yazarlar, setYazarlar] = useState<YazarDetayProps[]>([]);
    const [tumYazilar, setTumYazilar] = useState<YaziProps[]>([]);
    // yazarId state'i kaldırıldı, artık prop'tan geliyor: oturumAcikYazarId
    
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>('yazilarim');

    // 1. Verileri Çekme ve Filtreleme
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Yazar API çağrısı (Oturum açan yazarın detaylarını bulmak için)
                const yazarRes = await fetch('http://localhost:3001/api/yazarlar');
                const yazarData: YazarDetayProps[] = await yazarRes.json();
                setYazarlar(yazarData);
                
                // İçerik API çağrısı (Tüm içerikleri çekmek zorunluluğu varsa)
                // Daha iyi bir çözüm: Sadece oturumAcikYazarId'ye ait yazıları çekmek için API'yi kullanın.
                // Örn: fetch(`http://localhost:3001/api/icerikler?yazarId=${oturumAcikYazarId}`);
                const icerikRes = await fetch('http://localhost:3001/api/icerikler');
                const icerikData: YaziProps[] = await icerikRes.json();
                setTumYazilar(icerikData);

            } catch (err) {
                console.error('Veri çekilirken hata oluştu:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [oturumAcikYazarId]); // Prop bağımlılık listesine eklendi

    // 2. Yazar ID'sine göre filtrelenmiş yazı listesini hesaplama (MEMO)
    const yazarYazilari = useMemo(() => {
        if (tumYazilar.length === 0 || !oturumAcikYazarId) {
            return [];
        }
        
        return tumYazilar.filter(yazi => {
            // yazi.yazar_id'nin tipini kontrol et
            if (typeof yazi.yazar_id === 'object' && yazi.yazar_id !== null && 'id' in yazi.yazar_id) {
                // İlişkili veri (nesne) ise ID'sini kullan
                return yazi.yazar_id.id === oturumAcikYazarId;
            } 
            
            // Eğer yazar_id direkt tam sayı (number) ise, onu kullan
            return yazi.yazar_id === oturumAcikYazarId;
        });
    }, [oturumAcikYazarId, tumYazilar]); // Bağımlılıklar güncellendi

    // 3. Aktif Sekmeye göre gösterilecek yazıları hesaplama (MEMO) - Aynı kaldı
    const gosterilecekYazilar = useMemo(() => {
        // ... (Bu kısım aynı kalabilir) ...
        return yazarYazilari.filter(yazi => {
            if (activeTab === 'yazilarim') {
                return true; 
            } else if (activeTab === 'taslaklar') {
                return false; // Taslak mantığı eklenmeli
            } else if (activeTab === 'kaydedilenler') {
                return false; // Kaydedilenler mantığı eklenmeli
            }
            return false;
        });
    }, [yazarYazilari, activeTab]);
    

    if (loading) {
        return <div className="text-center mt-32">Yükleniyor...</div>;
    }
    
    // Yazar verisi yoksa veya ID set edilmemişse
    if (yazarlar.length === 0 || !oturumAcikYazarId) {
        return <div className="text-center mt-32 text-red-600">Profil bilgileri yüklenemedi veya oturum açmış yazar belirlenemedi.</div>;
    }
    
    // Oturum açmış yazarın detaylarını bul
    const currentYazar = yazarlar.find(y => y.id === oturumAcikYazarId); 
    
    if (!currentYazar) {
         return <div className="text-center mt-32 text-red-600">Oturum açmış yazarın detayları bulunamadı.</div>;
    }


    // **********************************
    // Render Kısmı
    // **********************************
    return (
        <div className=''>
            {/* ... PROFİL BİLGİSİ BÖLÜMÜ ... */}
            <div className='flex flex-row justify-between my-32 '>
                <div className='flex flex-row space-x-12 mx-8 '>
                    {/* currentYazar'ın varlığını kontrol etmiştik */}
                    <img src={currentYazar.profil_resmi_url} alt="Profil Resmi" className='w-32 h-32 rounded-full' />
                    <div className='flex flex-col '>
                        <span className='text-3xl font-bold'>{currentYazar.ad_soyad}</span>
                        <span className='items-center '>{currentYazar.email}</span>
                        {/* ... diğer bilgiler ... */}
                        <br />
                        <div className='flex flex-row space-x-4'>
                            <div className='flex flex-col'>
                                {/* Yazarın yayınladığı toplam yazı sayısını göster */}
                                <span className='text-orange-400 font-bold text-2xl'>{yazarYazilari.length}</span>
                                <span>Yazı</span>
                            </div>
                            {/* ... beğeni ve yorum sayıları ... */}
                        </div>
                    </div>
                </div>
                {/* ... Butonlar ... */}
            </div>

            {/* ... TAB NAVİGASYON BÖLÜMÜ ... */}
            <div className='mx-16 mt-10 space-y-8'>
                {/* ... Tab Butonları (Aynı kaldı) ... */}
                <div className='w-4/12 bg-[#efe2d1] h-10 rounded-xl flex flex-row justify-between items-center px-5'>
                    {/* ... (butons) ... */}
                </div>

                {/* YAZI LİSTELEME ALANI */}
                {(activeTab === 'yazilarim' || activeTab === 'taslaklar') && (
                    <>
                        {/* ... Başlık ... */}
                        
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6'>
                            {gosterilecekYazilar.map((yazi) => (
                                <div 
                                    key={yazi.id} 
                                    className={`...`} // Stil
                                >
                                    <h3 className='text-xl font-bold text-gray-800 mb-3'>{yazi.baslik}</h3>
                                    {/* ... içerik, tarih vs. ... */}
                                    <div className='flex justify-between items-center text-xs text-gray-500'>
                                        {/* Yazar adını daha güvenli göster */}
                                        <span>Yazar: {
                                            (typeof yazi.yazar_id === 'object' && yazi.yazar_id !== null && 'kullanici_adi' in yazi.yazar_id) 
                                                ? yazi.yazar_id.kullanici_adi 
                                                : 'Bilinmiyor'
                                        }</span>
                                        <span>{new Date(yazi.olusturulma_tarihi).toLocaleDateString('tr-TR')}</span>
                                    </div>
                                    {/* ... Butonlar ... */}
                                </div>
                            ))}
                            
                            {/* Yazı Yoksa Mesajı */}
                            {gosterilecekYazilar.length === 0 && (
                                <div className='col-span-full text-center text-gray-500 py-12'>
                                    {/* ... */}
                                </div>
                            )}
                        </div>
                    </>
                )}
                {/* ... Kaydedilenler Sekmesi ... */}
            </div>
        </div>
    );
}

// Varsayılan dışa aktarma işlemi (Admin'in dışarıdan ID alması için)
// Bu kısımla, Admin bileşenini kullanırken ID'yi iletmelisiniz: <Admin oturumAcikYazarId={1} />
// Gerçek uygulamada, oturum açmış kullanıcının ID'sini buraya dinamik olarak vermelisiniz.

export default Admin;