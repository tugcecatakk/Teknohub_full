import { Heart, MessageCircle, Sparkles, ArrowRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import myImage from '../assets/Gemini_Generated_Image_krslpakrslpakrsl.png'
interface OneCikanIcerikProps {
    id: number;
    baslik: string;
    icerik: string;
    begeni_sayisi: number;
    olusturulma_tarihi: string;
    yazar_id: {
        kullanici_adi: string;
        image: string;
    };
    image: string;
}
const OneCikanIcerik = () => {

    const [yazilar, setYazilar]=useState<OneCikanIcerikProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [kullanici, setKullanici] = useState<any>(null);
    const [begeniYukleniyor, setBegeniYukleniyor] = useState<boolean>(false);

    useEffect(()=>{
        
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

  return (
    <div> 
      <div className='flex flex-row mt-36 gap-8 px-6'>
<div className='flex-1 items-center space-y-10'>
    <div className='flex flex-row space-x-3'>
<Sparkles color='#e06500'/>
    <h2 className='bg-[#f1ebe5] rounded-xl w-28 h-5 text-sm'>Öne Çıkan İçerik</h2>
    </div>
    
{yazilar.slice(0,1).map((yazi)=>(
  <div key={yazi.id} className="space-y-6"> 
    <Link to={`/yazi/${yazi.id}`} className="hover:opacity-80 transition-opacity">
      <h3 className='text-7xl font-serif leading-tight'>{yazi.baslik}</h3>
    </Link>
    
    
    <p className='text-xl text-gray-600 line-clamp-3'>
        {yazi.icerik}
    </p>

    <div className='flex flex-row space-x-3 items-center'>
        <div className='w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center text-white font-semibold text-lg'>
            {yazi.yazar_id?.kullanici_adi?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div>
            <h1 className='text-lg font-semibold'>{yazi.yazar_id?.kullanici_adi || 'Bilinmeyen Yazar'}</h1>
            <p className='text-sm text-gray-500'>Web Tasarımcı</p>
        </div>
    </div>
  </div>
))}

    
    <div className='flex flex-row justify-between items-center w-72'>
       <Link to={`/yazi/${yazilar[0]?.id || ''}`}>
           <button className='bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-2xl hover:scale-105 transition-transform flex items-center space-x-2'>
               <span>Okumaya Başla</span>
               <ArrowRight size={18} />
           </button>
       </Link>
       <div className='flex flex-row items-center space-x-1 cursor-pointer' 
            onClick={handleBegeni}
       >
         <Heart />
<p>{yazilar[0]?.begeni_sayisi || 0}</p>
       </div>
        <div className='flex flex-row items-center space-x-1'>
            <MessageCircle />
 <p>45</p>
        </div>
    </div>
</div>
<div className='flex-1 flex justify-center items-center'>
    <img src={"https://plus.unsplash.com/premium_photo-1661963874418-df1110ee39c1?q=80&w=1572&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} alt="" className='h-[32rem] w-full max-w-xl object-cover rounded-lg shadow-lg'/>
</div>
    </div>
    </div>
  )
}

export default OneCikanIcerik;
