import React, { useEffect, useState } from 'react'
import myImage from '../assets/Gemini_Generated_Image_krslpakrslpakrsl.png'
import { Heart, MessageCircle } from 'lucide-react';
interface SonYazilarProps {

    id:string;
    baslik: string;
    icerik: string;
    olusturulma_tarihi: string;
    yazar_id: {
        kullanici_adi: string;
    };
}
const SonYazilar = () => {

const [yazilar,setYazilar]=useState<SonYazilarProps[]>([]);

useEffect(()=>{
    fetch('http://localhost:3001/api/icerikler')
    .then(res => res.json())
    .then(data => setYazilar(data))
    .catch(err => console.error('İçerikler çekilirken hata oluştu:', err));
}, []);

  return (
    <div className='flex flex-row justify-center items-center mb-10'>
 {yazilar.slice(0,3).map((yazi)=>(
            <div key={yazi.id} className='w-1/3 m-5 rounded-xl bg-white  flex flex-col'>
 <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=600&fit=crop" className='rounded-t-xl h-40 w-full object-cover' />
    <div className='p-3 flex-1 flex flex-col'>
        <h2 className='text-xl font-serif mb-2 line-clamp-2'>{yazi.baslik}</h2>
        <p className='text-sm text-gray-600 mb-3 flex-1 line-clamp-4 overflow-hidden'>{yazi.icerik}</p>
        <div className='flex flex-row space-x-3 items-center mt-auto'>
                <img src={myImage} alt="Profil resmi" className='w-10 h-10 rounded-full' />
                <div>
                <h1 className='text-sm font-semibold'>{yazi.yazar_id.kullanici_adi}</h1>
                <p className='text-xs text-gray-500'>Web Tasarımcı</p>
                </div>
            </div>
            <div className='border-t border-gray-200 mt-3 pt-3'></div>
            <div className='flex flex-row items-center justify-between'>
                <div className='flex flex-row space-x-2'>
 <div className='text-sm flex flex-row items-center space-x-1' >
         <Heart size={15} />
         <p>234</p>
       </div>
        <div className='text-sm  flex flex-row items-center space-x-1'>
            <MessageCircle size={15} />
 <p>45</p>
        </div>
                </div>
      
        <div className=''>
            <button className='rounded-xl py-2 px-3 hover:bg-pink-600 hover:text-white'>Oku-</button>
        </div>
    </div>

    </div>
            </div>
        ))}
    </div>
    
    
  )
}

export default SonYazilar;
