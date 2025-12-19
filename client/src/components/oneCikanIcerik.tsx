import { Heart, MessageCircle, Sparkles, ArrowRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

interface OneCikanIcerikProps {
    id: number;
    baslik: string;
    icerik: string;
    begeni_sayisi: number;
    olusturulma_tarihi: string;
    image_url?: string; 
    yorumlar?: any[];   
    yazar_id: {
        kullanici_adi: string;
        image: string;
    };
}

const OneCikanIcerik = () => {

    const [yazilar, setYazilar] = useState<OneCikanIcerikProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [kullanici, setKullanici] = useState<any>(null);
    const [begeniYukleniyor, setBegeniYukleniyor] = useState<boolean>(false);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setKullanici(JSON.parse(userStr));
        }
        
        setLoading(true);
        fetch('http://localhost:3001/api/icerikler')
        .then(res => res.json())
        .then(data => {
            setYazilar(data);
            setLoading(false);
        })
        .catch(err => {
            console.error('İçerikler çekilirken hata oluştu:', err);
            setLoading(false);
        });
    }, []);
    
    const handleBegeni = async () => {
        if (!kullanici) {
            alert('🔒 Beğenmek için giriş yapmalısınız!');
            return;
        }
        
        if (yazilar.length === 0) return;
        
        setBegeniYukleniyor(true);
        
        try {
            const response = await fetch(`http://localhost:3001/api/begeni/${yazilar[0].id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    kullanici_id: kullanici.id
                })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                setYazilar(prev => 
                    prev.map((yazi, index) => 
                        index === 0 
                            ? { ...yazi, begeni_sayisi: result.begeni_sayisi }
                            : yazi
                    )
                );
            } else {
                alert('Beğeni eklenirken hata oluştu: ' + result.error);
            }
        } catch (error) {
            console.error('Beğeni hatası:', error);
            alert('Beğeni eklenirken hata oluştu!');
        } finally {
            setBegeniYukleniyor(false);
        }
    };

    if (loading) {
        return (
            <div className='flex justify-center items-center h-64'>
                <div className='text-gray-500'>İçerikler yükleniyor...</div>
            </div>
        );
    }

    if (yazilar.length === 0) {
        return (
            <div className='flex justify-center items-center h-64'>
                <div className='text-gray-500'>Henüz içerik bulunmuyor.</div>
            </div>
        );
    }


    const oneCikanYazi = yazilar[0];

  return (
    <div> 
      <div className='flex flex-col md:flex-row mt-36 gap-8 px-6'> 
        <div className='flex-1 items-center space-y-10'>
            <div className='flex flex-row space-x-3'>
                <Sparkles color='#e06500'/>
                <h2 className='bg-[#f1ebe5] rounded-xl w-28 h-5 text-sm text-center'>Öne Çıkan İçerik</h2>
            </div>
            
            <div className="space-y-6"> 
                <Link to={`/yazi/${oneCikanYazi.id}`} className="hover:opacity-80 transition-opacity">
                    <h3 className='text-4xl md:text-7xl font-serif leading-tight'>{oneCikanYazi.baslik}</h3>
                </Link>
                
                <p className='text-xl text-gray-600 line-clamp-3'>
                    {oneCikanYazi.icerik}
                </p>

                <div className='flex flex-row space-x-3 items-center'>
                    <div className='w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center text-white font-semibold text-lg overflow-hidden'>
                        {/* Yazar resmi varsa göster yoksa baş harfi */}
                        {oneCikanYazi.yazar_id?.image ? (
                             <img src={oneCikanYazi.yazar_id.image} alt="yazar" className="w-full h-full object-cover" />
                        ) : (
                            oneCikanYazi.yazar_id?.kullanici_adi?.charAt(0).toUpperCase() || 'U'
                        )}
                    </div>
                    <div>
                        <h1 className='text-lg font-semibold'>{oneCikanYazi.yazar_id?.kullanici_adi || 'Bilinmeyen Yazar'}</h1>
                        <p className='text-sm text-gray-500'>Yazar</p>
                    </div>
                </div>
            </div>

            <div className='flex flex-row justify-between items-center w-full max-w-xs'>
               <Link to={`/yazi/${oneCikanYazi.id}`}>
                   <button className='bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-2xl hover:scale-105 transition-transform flex items-center space-x-2'>
                       <span>Okumaya Başla</span>
                       <ArrowRight size={18} />
                   </button>
               </Link>
               
               <div className='flex flex-row items-center space-x-1 cursor-pointer hover:text-red-500 transition-colors' 
                    onClick={handleBegeni}
               >
                 <Heart className={begeniYukleniyor ? 'animate-pulse' : ''} />
                 <p>{oneCikanYazi.begeni_sayisi || 0}</p>
               </div>
               
               <div className='flex flex-row items-center space-x-1 text-gray-600'>
                    <MessageCircle />
                   
                    <p>{oneCikanYazi.yorumlar ? oneCikanYazi.yorumlar.length : 0}</p>
               </div>
            </div>
        </div>

       
        <div className='flex-1 flex justify-center items-center'>
            <img 
                src={oneCikanYazi.image_url || "https://images.unsplash.com/photo-1499750310159-5254f412c2de?q=80&w=1000&auto=format&fit=crop"} 
                alt={oneCikanYazi.baslik} 
                className='h-[32rem] w-full max-w-xl object-cover rounded-lg shadow-lg'
                onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1499750310159-5254f412c2de?q=80&w=1000&auto=format&fit=crop"; }}
            />
        </div>
      </div>
    </div>
  )
}

export default OneCikanIcerik;