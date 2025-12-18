import React, { useEffect, useState } from 'react'
import { Heart, MessageCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
interface SonYazilarProps {
    id: number;
    baslik: string;
    icerik: string;
    image_url: string;
    begeni_sayisi: number;
    olusturulma_tarihi: string;
    yazar_id: {
        id: number;
        kullanici_adi: string;
    };
}

interface SonYazilarComponentProps {
    kategoriId?: number | null;
}

const SonYazilar = ({ kategoriId }: SonYazilarComponentProps) => {

const [yazilar,setYazilar]=useState<SonYazilarProps[]>([]);
const [kullanici, setKullanici] = useState<any>(null);
const [begeniYukleniyor, setBegeniYukleniyor] = useState<number | null>(null);

useEffect(()=>{
    // Login durumunu kontrol et
    const userStr = localStorage.getItem('user');
    if (userStr) {
        setKullanici(JSON.parse(userStr));
    }
    
    // Yazıları yükle
    const apiUrl = kategoriId 
        ? `http://localhost:3001/api/icerikler?kategori_id=${kategoriId}`
        : 'http://localhost:3001/api/icerikler';
    
    fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
        console.log('Gelen veri:', data);
        console.log('Kategori ID:', kategoriId);
        console.log('API URL:', apiUrl);
        setYazilar(data);
    })
    .catch(err => console.error('İçerikler çekilirken hata oluştu:', err));
}, [kategoriId]); // kategoriId değiştiğinde yeniden fetch yap

// Beğeni fonksiyonu
const handleBegeni = async (yaziId: number) => {
    if (!kullanici) {
        alert('🔒 Beğenmek için giriş yapmalısınız!');
        return;
    }
    
    setBegeniYukleniyor(yaziId);
    
    try {
        const response = await fetch(`http://localhost:3001/api/begeni/${yaziId}`, {
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
            // Yerel state'i güncelle
            setYazilar(prev => 
                prev.map(yazi => 
                    yazi.id === yaziId 
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
        setBegeniYukleniyor(null);
    }
};

  return (
    <div className='flex flex-row justify-center items-center mb-10'>
 {yazilar.slice(0,3).map((yazi)=>(
            <div key={yazi.id} className='w-1/3 m-5 rounded-xl bg-white  flex flex-col'>
 <img 
    src={yazi.image_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=600&fit=crop"}
    alt={yazi.baslik}
    className='rounded-t-xl h-40 w-full object-cover' 
    onError={(e) => {
        console.log('Resim yükleme hatası:', yazi.image_url);
        e.currentTarget.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=600&fit=crop";
    }}
/>
    <div className='p-3 flex-1 flex flex-col'>
        <Link to={`/yazidetay/${yazi.id}`} className='hover:text-blue-600 transition-colors'>
            <h2 className='text-xl font-serif mb-2 line-clamp-2'>{yazi.baslik}</h2>
        </Link>
        <p className='text-sm text-gray-600 mb-3 flex-1 line-clamp-4 overflow-hidden'>{yazi.icerik}</p>
        <div className='flex flex-row space-x-3 items-center mt-auto'>
                <div className='w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm'>
                    {yazi.yazar_id?.kullanici_adi?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                <h1 className='text-sm font-semibold'>{yazi.yazar_id?.kullanici_adi || 'Bilinmeyen Yazar'}</h1>
                <p className='text-xs text-gray-500'>Web Tasarımcı</p>
                </div>
            </div>
            <div className='border-t border-gray-200 mt-3 pt-3'></div>
            <div className='flex flex-row items-center justify-between'>
                <div className='flex flex-row space-x-2'>
 <div className='text-sm flex flex-row items-center space-x-1 cursor-pointer' 
      onClick={() => handleBegeni(yazi.id)}
 >
         <Heart size={15} />
         <p>{yazi.begeni_sayisi || 0}</p>
       </div>
        <div className='text-sm  flex flex-row items-center space-x-1'>
            <MessageCircle size={15} />
 <p>45</p>
        </div>
                </div>
      
        <div className=''>
            <Link to={`/yazidetay/${yazi.id}`}>
                <button className='rounded-xl py-2 px-3 hover:bg-pink-600 hover:text-white flex items-center space-x-1'>
                    <span>Oku</span>
                    <ArrowRight size={16} />
                </button>
            </Link>
        </div>
    </div>

    </div>
            </div>
        ))}
    </div>
    
    
  )
}

export default SonYazilar;
