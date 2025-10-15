import React from 'react'
import Footer from '../components/footer'
import Navbar from '../components/navbar'
import { Heart, MessageCircle, Sparkles } from 'lucide-react'
import myImage from '../assets/Gemini_Generated_Image_krslpakrslpakrsl.png'

const Home = () => {
  return (
   <div className='min-h-screen  bg-[#f9f8f7] flex flex-col'>
    <div>
    <Navbar/>
    </div>
    <div className='flex flex-row mt-36 gap-8 px-6'>
<div className='flex-1 items-center space-y-10'>
    <div className='flex flex-row space-x-3'>
<Sparkles color='#e06500'/>
    <h2 className='bg-[#f1ebe5] rounded-xl w-28 h-5 text-sm'>Öne Çıkan İçerik</h2>
    </div>
    <h3 className='text-7xl font-serif '>Modern Web Tasarımında Yeni Trendler</h3>
    <p>2024'te web tasarım dünyasını şekillendirecek en önemli trendleri keşfedin. Minimalizm, bold tipoğrafi ve immersive deneyimler...</p>
    <div className='flex flex-row space-x-3'>
        <img src={myImage} alt="Imported resim" className='w-12 h-12 rounded-full' />
        <div>
        <h1 className='text-lg font-semibold'>Ayşe Yılmaz</h1>
        <p className='text-sm text-gray-500'>Web Tasarımcı</p>
        </div>
    </div>
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
    <div className='border border-gray-300  my-20 mx-6'>
       <ul>
        <li></li>
       </ul>
    </div>
<Footer />
    </div>
  )
}

export default Home;
