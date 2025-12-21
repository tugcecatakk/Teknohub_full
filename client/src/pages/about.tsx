import { ChevronsLeftRight, Github, Heart, Linkedin, Mail, MessageCircle, Sparkles, Twitter } from 'lucide-react';
import React, { useEffect, useState } from 'react'

import { Link } from 'react-router-dom';
interface OneCikanIcerikProps {
    baslik: string;
    icerik: string;
    olusturulma_tarihi: string;
    yazar_id: {
        kullanici_adi: string;
        image: string;
    };
    image: string;
}
const About = () => {
    const [yazilar, setYazilar]=useState<OneCikanIcerikProps[]>([]);
    
        useEffect(()=>{
            fetch('http://localhost:3001/api/icerikler')
            .then(res => res.json())
            .then(data => setYazilar(data))
            .catch(err => console.error('İçerikler çekilirken hata oluştu:', err));
        }, []);
  return (
    <div className='bg-[#faf8f5]'>
<div className='flex flex-row gap-8 px-6 pt-48'>
<div className='flex-1 items-center space-y-10 p-12  '>

    <div className='flex flex-row space-x-3'>
<Sparkles color='#e06500'/>
    <h2 className='text-[#e06500]'>Blog Yazarları & Tasarımcılar</h2>
    </div>
    

  <div>
    <h3 className='text-7xl font-serif '>TeknoHub Ekibi
</h3>
    <br />
    <h1 className='text-lg '>Web tasarımı ve yazılım geliştirme konularında tutkulu bir ekibiz. Modern teknolojiler, kullanıcı deneyimi ve estetik tasarım ilkelerini harmanlayarak değerli içerikler üretiyoruz.</h1>
  </div>


    
    <div className='flex flex-row justify-between items-center w-72'>
       
        <Link to={'/'} className='border-2 border-gray-200 p-2 rounded-xl'>
        <Github size={16}/>
        </Link>
       <Link to={'/'} className='border-2 border-gray-200 p-2 rounded-xl'>
         <Twitter size={16} />
        </Link>
        <Link to={'/'} className='border-2 border-gray-200 p-2 rounded-xl'>
        <Linkedin size={16} />
        </Link>

    </div>
</div>
<div className='flex-1 flex justify-center items-center'>
    <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=800&fit=crop" alt="" className='h-[32rem] w-full max-w-xl object-cover rounded-lg shadow-lg'/>
</div>

    </div>
    <div className='flex flex-row gap-2 my-32 mx-8 justify-center text-center'>
        <div className='bg-white flex-1 h-32 rounded-3xl flex flex-col items-center justify-center shadow-sm'>
            <span className='text-4xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent'>250+</span>
            <span className='text-sm text-gray-600'>Yazı</span>
        </div>
        <div className='bg-white flex-1 h-32 rounded-3xl flex flex-col items-center justify-center shadow-sm'>
            <span className='text-4xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent'>180+</span>
            <span className='text-sm text-gray-600'>Takipçi</span>
        </div>
        <div className='bg-white flex-1 h-32 rounded-3xl flex flex-col items-center justify-center shadow-sm'>
            <span className='text-4xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent'>95%</span>
            <span className='text-sm text-gray-600'>Yorum</span>
        </div>
        <div className='bg-white flex-1 h-32 rounded-3xl flex flex-col items-center justify-center shadow-sm'>
            <span className='text-4xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent'>24/7</span>
            <span className='text-sm text-gray-600'>Destek</span>
        </div>
    </div>
    <div className='pb-32 max-w-4xl mx-auto px-6'>
       
        <div className='text-center mb-12'>
            <h1 className='text-4xl font-serif mb-4'>Hikayemiz</h1>
            <p className='text-xl text-zinc-600 font-serif'>Tasarım ve teknoloji tutkusu ile başlayan yolculuğumuz</p>
        </div>
        
        
        <div className='grid grid-cols-1 lg:grid-cols-1 gap-8 mb-16'>
            <div className='bg-white rounded-xl p-8 shadow-sm mx-auto max-w-4xl'>
                <div className='space-y-6 text-zinc-500 leading-relaxed'>
                    <p>Web tasarımıyla tanışmamız, üniversite yıllarında aldığımız  derslere dayanıyor. İlk HTML kodlarımızı yazdığımız o an; hem tasarımcı hem de geliştirici kimliğini aynı potada eritebileceğimizi fark ettik. O günden bu yana, bu iki dünyayı kusursuz bir şekilde birleştirmek için çalışıyoruz.</p>
                    
                    <p>2015 yılında başlayan blog yolculuğumuz, öğrendiğimiz her bilgiyi paylaşma tutkumuzdan doğdu. Zamanla paylaşımlarımız etrafında kenetlenen küçük bir topluluk oluşturduk ve bu yolda birlikte büyüdük. Her yazımızda okuyucularımıza değer katmayı ve onlara ilham vermeyi kendimize görev ediniyoruz.</p>
                    
                    <p>Bugün, TeknoHub çatısı altında teknoloji, tasarım ve yazılım geliştirme konularında içerikler üretiyoruz. En büyük amacımız; karmaşık kavramları herkes için anlaşılır hale getirmek ve merak duyan herkesin bu güzel dünyaya dahil olmasını sağlamak.</p>
                </div>
            </div>
        </div>
        
        
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='bg-white p-8 rounded-xl shadow-sm text-center space-y-3 hover:shadow-md transition-shadow'>
                <div className='bg-orange-100 p-3 rounded-full inline-block'>
                    <Heart color='#f27907'/>
                </div>
                <h3 className=' font-bold text-gray-800'>Tutkulu</h3>
                <p className='text-zinc-500'>İşimizi severek ve tutkuyla yapıyoruz</p>
            </div>
            <div className='bg-white p-8 rounded-xl shadow-sm text-center space-y-3 hover:shadow-md transition-shadow'>
                <div className='bg-orange-100 p-3 rounded-full inline-block'>
                    <ChevronsLeftRight color='#f27907' />
                </div>
                <h3 className=' font-bold text-gray-800'>Deneyimli</h3>
                <p className='text-zinc-500'>8+ yıllık tasarım ve geliştirme deneyimi</p>
            </div>
            <div className='bg-white p-8 rounded-xl shadow-sm text-center space-y-3 hover:shadow-md transition-shadow'>
                <div className='bg-orange-100 p-3 rounded-full inline-block'>
                    <Sparkles color='#f27907' />
                </div>
                <h3 className=' font-bold text-gray-800'>Yaratıcı</h3>
                <p className='text-zinc-500'>Her projede yenilikçi çözümler üretiyoruz</p>
            </div>
        </div>
    </div>
    </div>
      
     
  )
}

export default About;
