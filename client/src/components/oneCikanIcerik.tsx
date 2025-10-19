import { Heart, MessageCircle, Sparkles } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import myImage from '../assets/Gemini_Generated_Image_krslpakrslpakrsl.png'
interface OneCikanIcerikProps {
    baslik: string;
    icerik: string;
    olusturulma_tarihi: string;
    yazar_id: {
        kullanici_adi: string;
    };
}
const OneCikanIcerik = () => {

    const [yazilar, setYazilar]=useState<OneCikanIcerikProps[]>([]);

    useEffect(()=>{
        fetch('http://localhost:3001/api/icerikler')
        .then(res => res.json())
        .then(data => setYazilar(data))
        .catch(err => console.error('İçerikler çekilirken hata oluştu:', err));
    }, []);

  return (
    <div> 
      <div className='flex flex-row mt-36 gap-8 px-6'>
<div className='flex-1 items-center space-y-10'>
    <div className='flex flex-row space-x-3'>
<Sparkles color='#e06500'/>
    <h2 className='bg-[#f1ebe5] rounded-xl w-28 h-5 text-sm'>Öne Çıkan İçerik</h2>
    </div>
    
{yazilar.slice(0,1).map((yazi)=>(
  <div key={yazi.olusturulma_tarihi}>
    <h3 className='text-7xl font-serif '>{yazi.baslik}</h3>
    <p>{yazi.icerik}</p>
    <div className='flex flex-row space-x-3'>
        <img src={myImage} alt="Imported resim" className='w-12 h-12 rounded-full' />
        <div>
        <h1 className='text-lg font-semibold'>{yazi.yazar_id.kullanici_adi}</h1>
        <p className='text-sm text-gray-500'>Web Tasarımcı</p>
        </div>
    </div>
  </div>
))}

    
    <div className='flex flex-row justify-between items-center w-72'>
       <button className='bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-2xl hover:scale-105 transition-transform '>Okumaya Başla</button>
       <div className='flex flex-row items-center space-x-1' >
         <Heart />
<p>234</p>
       </div>
        <div className='flex flex-row items-center space-x-1'>
            <MessageCircle />
 <p>45</p>
        </div>
    </div>
</div>
<div className='flex-1 flex justify-center items-center'>
    <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=600&fit=crop" alt="" className='h-[32rem] w-full max-w-xl object-cover rounded-lg shadow-lg'/>
</div>
    </div>
    </div>
  )
}

export default OneCikanIcerik;
