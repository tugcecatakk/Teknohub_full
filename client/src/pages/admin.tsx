import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';

// Admin bileşenine prop olarak gelmesi gereken bir ID'yi simüle ediyoruz.
// Normalde bu ID, giriş yapma işleminden sonra alınır ve bileşene iletilir.
// Eğer bileşen dışından prop olarak geliyorsa, interface'e ekleyin.
// Örnek: const Admin = ({ oturumAcikYazarId }: { oturumAcikYazarId: number }) => { ... }

interface KullaniciProps { // Kullanicilar tablosundaki bir kaydı temsil eder
    id: number;
    kullanici_adi: string;
    email: string;
    rol: string;
    image?: string; // Profil resmi URL'si
    // Diğer alanlar...
}

interface YazarProps { // Yazarlar tablosundaki bir kaydı temsil eder
    id: number;
    kullanici_adi: string;
    image?: string; // Profil resmi URL'si
    bio?: string;
    uzmanlik_alani?: string;
    // Diğer alanlar...
}

interface YaziProps { // İçerikler tablosundaki bir kaydı temsil eder
    id: number;
    baslik: string;
    icerik: string;
    image_url?: string; // Yazı resmi URL'si
    goruntuleme?: number; // Görüntüleme sayısı
    // Yazar ID'si için iki olası durum var:
    // 1. API sadece ID'yi döndürür: yazar_id: number;
    // 2. API ilişkili veriyi (nested) döndürür (yazarın tamamı veya bir kısmı):
    yazar_id: number | { id: number; kullanici_adi: string; /* ... */ }; // Hem ID hem nesne ihtimali için union type
    olusturulma_tarihi: string;
}

type TabType = 'yazilarim' | 'kaydedilenler' | 'taslaklar';

// Admin bileşeni artık localStorage'dan kullanıcı bilgisini alacak
const Admin = () => {
    const navigate = useNavigate();
    
    const [currentKullanici, setCurrentKullanici] = useState<KullaniciProps | null>(null);
    const [currentYazar, setCurrentYazar] = useState<YazarProps | null>(null);
    const [tumYazilar, setTumYazilar] = useState<YaziProps[]>([]);
    const [oturumAcikYazarId, setOturumAcikYazarId] = useState<number | null>(null);
    
    const [loading, setLoading] = useState(true);
    
    // Yazı ekleme için state'ler
    const [showYaziForm, setShowYaziForm] = useState(false);
    const [yaziForm, setYaziForm] = useState({
        baslik: '',
        icerik: '',
        image_url: '',
        kategori_id: 1,
        slug: ''
    });
    const [formYukleniyor, setFormYukleniyor] = useState(false);
    const [kategoriler, setKategoriler] = useState<any[]>([]);

    // Çıkış yapma fonksiyonu
    const handleLogout = () => {
        localStorage.removeItem('user');
        alert('Çıkış yapıldı!');
        navigate('/admin-login');
    };

    // localStorage'dan kullanıcı bilgisini al ve giriş kontrolü yap
    useEffect(() => {
        const userString = localStorage.getItem('user');
        console.log('localStorage user:', userString);
        
        if (!userString) {
            // Eğer giriş yapılmamışsa admin login sayfasına yönlendir
            console.log('Kullanıcı giriş yapmamış, admin login sayfasına yönlendiriliyor');
            navigate('/admin-login');
            return;
        }

        const user = JSON.parse(userString);
        console.log('Parse edilen user:', user);
        
        // Eğer kullanıcının rolü "yazar" değilse admin login sayfasına yönlendir
        if (user.rol !== "yazar") {
            console.log('Kullanıcı rolü yazar değil:', user.rol);
            alert("Bu sayfaya erişim yetkiniz yok! Lütfen yazar hesabınızla giriş yapın.");
            navigate('/admin-login');
            return;
        }

        console.log('Kullanıcı bilgileri set ediliyor:', user);
        // Kullanıcı bilgilerini direkt localStorage'dan al
        setCurrentKullanici({
            id: user.id,
            kullanici_adi: user.kullanici_adi,
            email: user.email,
            rol: user.rol,
            image: user.image // Resim bilgisini de ekle
        });
        setOturumAcikYazarId(user.id);
        
        // Yazar bilgilerini yazarlar tablosundan çek
        fetch(`http://localhost:3001/api/yazarlar/${user.id}`)
            .then(res => {
                console.log('Yazar API response status:', res.status);
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                console.log('Yazar bilgileri çekildi:', data);
                if (data.error) {
                    console.error('API error:', data.error);
                    alert('Yazar bilgileri alınamadı: ' + data.error);
                } else {
                    setCurrentYazar(data);
                }
            })
            .catch(err => {
                console.error('Yazar bilgileri çekilirken hata:', err);
                alert('Yazar bilgileri yüklenemedi. Lütfen sayfayı yenileyin.');
            });
        
        // Kategorileri yükle
        fetch('http://localhost:3001/api/kategoriler')
            .then(res => res.json())
            .then(data => setKategoriler(data))
            .catch(err => console.error('Kategoriler yüklenirken hata:', err));
    }, [navigate]);

    // 1. Verileri Çekme ve Filtreleme
    useEffect(() => {
        const fetchData = async () => {
            // Eğer kullanıcı ID'si henüz yüklenmediyse bekle
            if (!oturumAcikYazarId) {
                console.log('oturumAcikYazarId henüz yüklenmedi, bekleniyor...');
                return;
            }

            console.log('Veri çekme işlemi başlıyor, kullanıcı ID:', oturumAcikYazarId);
            setLoading(true);
            try {
                // İçerik API çağrısı (İçerikleri çekmek için)
                console.log('İçerikler API çağrısı yapılıyor...');
                const icerikRes = await fetch('http://localhost:3001/api/icerikler');
                
                if (!icerikRes.ok) {
                    throw new Error(`HTTP error! status: ${icerikRes.status}`);
                }
                
                const icerikData: YaziProps[] = await icerikRes.json();
                console.log('İçerikler API yanıtı:', icerikData);
                setTumYazilar(icerikData);

            } catch (err) {
                console.error('Veri çekilirken hata oluştu:', err);
            } finally {
                setLoading(false);
                console.log('Veri çekme işlemi tamamlandı');
            }
        };

        fetchData();
    }, [oturumAcikYazarId]);

    // 2. Kullanıcı ID'sine göre filtrelenmiş yazı listesini hesaplama (MEMO)
    const kullaniciYazilari = useMemo(() => {
        console.log('kullaniciYazilari hesaplanıyor...');
        console.log('tumYazilar:', tumYazilar);
        console.log('oturumAcikYazarId:', oturumAcikYazarId);
        
        if (tumYazilar.length === 0 || !oturumAcikYazarId) {
            console.log('tumYazilar boş veya oturumAcikYazarId yok');
            return [];
        }
        
        const filteredYazilar = tumYazilar.filter(yazi => {
            console.log('Yazı kontrol ediliyor:', yazi.id, 'yazar_id:', yazi.yazar_id);
            
            // yazi.yazar_id'nin tipini kontrol et
            if (typeof yazi.yazar_id === 'object' && yazi.yazar_id !== null && 'id' in yazi.yazar_id) {
                // İlişkili veri (nesne) ise ID'sini kullan
                console.log('Nested yazar_id:', yazi.yazar_id.id, 'vs oturum:', oturumAcikYazarId);
                return yazi.yazar_id.id === oturumAcikYazarId;
            } 
            
            // Eğer yazar_id direkt tam sayı (number) ise, onu kullan
            console.log('Direct yazar_id:', yazi.yazar_id, 'vs oturum:', oturumAcikYazarId);
            return yazi.yazar_id === oturumAcikYazarId;
        });
        
        console.log('Filtrelenen yazılar:', filteredYazilar);
        return filteredYazilar;
    }, [oturumAcikYazarId, tumYazilar]); // Bağımlılıklar güncellendi
    
    // Yazı ekleme fonksiyonu
    const handleYaziEkle = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!yaziForm.baslik.trim() || !yaziForm.icerik.trim()) {
            alert('Başlık ve içerik alanları gereklidir!');
            return;
        }
        
        setFormYukleniyor(true);
        
        try {
            const response = await fetch('http://localhost:3001/api/yazilar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    baslik: yaziForm.baslik,
                    icerik: yaziForm.icerik,
                    image_url: yaziForm.image_url || null,
                    kategori_id: yaziForm.kategori_id,
                    slug: yaziForm.slug || yaziForm.baslik.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    yazar_id: oturumAcikYazarId
                })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                alert('✅ Yazı başarıyla eklendi!');
                setYaziForm({ baslik: '', icerik: '', image_url: '', kategori_id: 1, slug: '' });
                setShowYaziForm(false);
                // Yazılar listesini yenile
                const icerikRes = await fetch('http://localhost:3001/api/icerikler');
                const icerikData = await icerikRes.json();
                setTumYazilar(icerikData);
            } else {
                alert('❌ Yazı eklenirken hata oluştu: ' + result.error);
            }
        } catch (error) {
            console.error('Yazı ekleme hatası:', error);
            alert('❌ Yazı eklenirken hata oluştu!');
        } finally {
            setFormYukleniyor(false);
        }
    };
    
    // Yazı silme fonksiyonu
    const handleYaziSil = async (yaziId: number, yaziBaslik: string) => {
        if (!confirm(`"${yaziBaslik}" adlı yazıyı silmek istediğinizden emin misiniz?`)) {
            return;
        }
        
        try {
            const response = await fetch(`http://localhost:3001/api/yazilar/${yaziId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    yazar_id: oturumAcikYazarId
                })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                alert('✅ Yazı başarıyla silindi!');
                // Yazılar listesini yenile
                const icerikRes = await fetch('http://localhost:3001/api/icerikler');
                const icerikData = await icerikRes.json();
                setTumYazilar(icerikData);
            } else {
                alert('❌ Yazı silinirken hata oluştu: ' + result.error);
            }
        } catch (error) {
            console.error('Yazı silme hatası:', error);
            alert('❌ Yazı silinirken hata oluştu!');
        }
    };

    // 3. Kullanıcının tüm yazılarını göster (MEMO) 
    const gosterilecekYazilar = useMemo(() => {
        console.log('gosterilecekYazilar hesaplanıyor...');
        console.log('kullaniciYazilari:', kullaniciYazilari);
        
        // Sadece kullanıcının yazılarını döndür
        return kullaniciYazilari;
    }, [kullaniciYazilari]);
    
    // Toplam okuyucu sayısını hesapla (tüm yazıların görüntüleme sayıları toplamı)
    const toplamOkuyucuSayisi = useMemo(() => {
        console.log('Okuyucu sayısı hesaplanıyor...');
        console.log('kullaniciYazilari:', kullaniciYazilari);
        
        let toplam = 0;
        kullaniciYazilari.forEach((yazi, index) => {
            const goruntuleme = yazi.goruntuleme || 0;
            console.log(`Yazı ${index + 1} (${yazi.baslik}): ${goruntuleme} görüntüleme`);
            toplam += goruntuleme;
        });
        
        console.log('Toplam görüntüleme sayısı:', toplam);
        return toplam;
    }, [kullaniciYazilari]);
    

    if (loading) {
        return <div className="text-center mt-32">Yükleniyor...</div>;
    }
    
    // Kullanıcı verisi yoksa veya ID set edilmemişse
    if (!currentKullanici || !currentYazar || !oturumAcikYazarId) {
        console.log('Debug - Loading state:', {
            currentKullanici: !!currentKullanici,
            currentYazar: !!currentYazar,
            oturumAcikYazarId: !!oturumAcikYazarId
        });
        return <div className="text-center mt-32 text-red-600">Profil bilgileri yüklenemedi veya oturum açmış kullanıcı belirlenemedi.</div>;
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
                    {currentYazar.image ? (
                        <img 
                            src={currentYazar.image} 
                            alt="Profil Resmi" 
                            className='w-32 h-32 rounded-full object-cover' 
                        />
                    ) : (
                        <div className='w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center'>
                            <span className='text-4xl font-bold text-gray-600'>
                                {currentYazar.kullanici_adi.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                    <div className='flex flex-col '>
                        <span className='text-3xl font-bold'>{currentYazar.kullanici_adi}</span>
                        <span className='items-center '>{currentKullanici.email}</span>
                        <span className='text-sm text-gray-600'>Rol: {currentKullanici.rol}</span>
                        {currentYazar.bio && <span className='text-sm text-gray-600 mt-1'>Bio: {currentYazar.bio}</span>}
                        {currentYazar.uzmanlik_alani && <span className='text-sm text-gray-600'>Uzmanlık: {currentYazar.uzmanlik_alani}</span>}
                        {/* ... diğer bilgiler ... */}
                        <br />
                        <div className='flex flex-row space-x-4'>
                            <div className='flex flex-col'>
                                {/* Kullanıcının yayınladığı toplam yazı sayısını göster */}
                                <span className='text-orange-400 font-bold text-2xl'>{kullaniciYazilari.length}</span>
                                <span>Yazı</span>
                            </div>
                            <div className='flex flex-col'>
                                {/* Toplam okuyucu sayısını göster */}
                                <span className='text-blue-500 font-bold text-2xl'>{toplamOkuyucuSayisi.toLocaleString()}</span>
                                <span>Okuyucu</span>
                            </div>
                            {/* ... beğeni ve yorum sayıları ... */}
                        </div>
                    </div>
                </div>
                {/* Çıkış Yap Butonu */}
                <div className='flex items-center'>
                    <button
                        onClick={handleLogout}
                        className='bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2'
                    >
                        <span>🚪</span>
                        <span>Çıkış Yap</span>
                    </button>
                </div>
            </div>

            {/* ... TAB NAVİGASYON BÖLÜMÜ ... */}
            <div className='mx-16 mt-10 space-y-8'>
                {/* YENİ YAZI EKLEME BUTONU */}
                <div className='flex justify-between items-center'>
                    <h2 className='text-2xl font-bold text-gray-800'>Yazılarım</h2>
                    <button 
                        onClick={() => setShowYaziForm(!showYaziForm)}
                        className='bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all'
                    >
                        {showYaziForm ? '❌ İptal' : '✍️ Yeni Yazı'}
                    </button>
                </div>

                {/* YENİ YAZI FORMU */}
                {showYaziForm && (
                    <div className='bg-white p-6 rounded-lg shadow-lg border border-gray-200'>
                        <h3 className='text-xl font-bold mb-4 text-gray-800'>Yeni Yazı Ekle</h3>
                        <form onSubmit={handleYaziEkle} className='space-y-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Başlık *
                                </label>
                                <input
                                    type='text'
                                    value={yaziForm.baslik}
                                    onChange={(e) => setYaziForm({...yaziForm, baslik: e.target.value})}
                                    className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
                                    placeholder='Yazı başlığını girin...'
                                    required
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    İçerik *
                                </label>
                                <textarea
                                    value={yaziForm.icerik}
                                    onChange={(e) => setYaziForm({...yaziForm, icerik: e.target.value})}
                                    rows={6}
                                    className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
                                    placeholder='Yazı içeriğini girin...'
                                    required
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Kategori *
                                </label>
                                <select
                                    value={yaziForm.kategori_id}
                                    onChange={(e) => setYaziForm({...yaziForm, kategori_id: parseInt(e.target.value)})}
                                    className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
                                    required
                                >
                                    {kategoriler.map(kategori => (
                                        <option key={kategori.id} value={kategori.id}>
                                            {kategori.ad}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Resim URL'si (opsiyonel)
                                </label>
                                <input
                                    type='url'
                                    value={yaziForm.image_url}
                                    onChange={(e) => setYaziForm({...yaziForm, image_url: e.target.value})}
                                    className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
                                    placeholder='https://example.com/image.jpg'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    URL Slug (opsiyonel)
                                </label>
                                <input
                                    type='text'
                                    value={yaziForm.slug}
                                    onChange={(e) => setYaziForm({...yaziForm, slug: e.target.value})}
                                    className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
                                    placeholder='makale-url-slug'
                                />
                                <small className='text-gray-500'>Boş bırakılırsa başlıktan otomatik oluşturulur</small>
                            </div>
                            <div className='flex space-x-3'>
                                <button
                                    type='submit'
                                    disabled={formYukleniyor}
                                    className={`flex-1 py-3 rounded-lg text-white font-medium ${
                                        formYukleniyor 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-green-600 hover:bg-green-700'
                                    }`}
                                >
                                    {formYukleniyor ? '⏳ Ekleniyor...' : '✅ Yazıyı Yayınla'}
                                </button>
                                <button
                                    type='button'
                                    onClick={() => setShowYaziForm(false)}
                                    className='px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50'
                                >
                                    İptal
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* YAZI LİSTELEME ALANI */}
                <>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6'>
                            {gosterilecekYazilar.map((yazi) => (
                                <Link key={yazi.id} to={`/yazi/${yazi.id}`}>
                                    <div 
                                        className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer`}
                                    >
                                    {/* Yazı Resmi */}
                                    {yazi.image_url ? (
                                        <img 
                                            src={yazi.image_url} 
                                            alt={yazi.baslik}
                                            className='w-full h-48 object-cover'
                                        />
                                    ) : (
                                        <div className='w-full h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center'>
                                            <span className='text-white text-4xl font-bold'>
                                                {yazi.baslik.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                    
                                    {/* Yazı İçeriği */}
                                    <div className='p-4'>
                                        <h3 className='text-xl font-bold text-gray-800 mb-3 line-clamp-2'>{yazi.baslik}</h3>
                                        <p className='text-gray-600 text-sm mb-4 line-clamp-3'>
                                            {yazi.icerik.substring(0, 150)}...
                                        </p>
                                        
                                        {/* Meta Bilgiler */}
                                        <div className='flex justify-between items-center text-xs text-gray-500 mb-4'>
                                            {/* Yazar adını daha güvenli göster */}
                                            <span>Yazar: {
                                                (typeof yazi.yazar_id === 'object' && yazi.yazar_id !== null && 'kullanici_adi' in yazi.yazar_id) 
                                                    ? yazi.yazar_id.kullanici_adi 
                                                    : 'Bilinmiyor'
                                            }</span>
                                            <span>{new Date(yazi.olusturulma_tarihi).toLocaleDateString('tr-TR')}</span>
                                        </div>
                                        
                                        {/* Aksiyon Butonları */}
                                        <div className='flex justify-center mt-4' onClick={(e) => e.preventDefault()}>
                                            <button 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleYaziSil(yazi.id, yazi.baslik);
                                                }}
                                                className='group flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-red-600 hover:to-red-700 hover:shadow-lg transform hover:scale-105 transition-all duration-200 shadow-md'
                                            >
                                                <Trash2 size={16} className='group-hover:animate-pulse' />
                                                <span>Sil</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                </Link>
                            ))}
                            
                            {/* Yazı Yoksa Mesajı */}
                            {gosterilecekYazilar.length === 0 && (
                                <div className='col-span-full text-center text-gray-500 py-12'>
                                    {/* ... */}
                                </div>
                            )}
                        </div>
                    </>
            </div>
        </div>
    );
}

// Varsayılan dışa aktarma işlemi (Admin'in dışarıdan ID alması için)
// Bu kısımla, Admin bileşenini kullanırken ID'yi iletmelisiniz: <Admin oturumAcikYazarId={1} />
// Gerçek uygulamada, oturum açmış kullanıcının ID'sini buraya dinamik olarak vermelisiniz.

export default Admin;