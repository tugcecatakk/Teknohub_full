import React, { useEffect, useState } from 'react'
import Footer from '../components/footer'
import Navbar from '../components/navbar'
import { Heart, MessageCircle, Sparkles, TrendingUp } from 'lucide-react'
import OneCikanIcerik from '../components/oneCikanIcerik';
import SonYazilar from '../components/sonYazilar';

interface Kategori{
    id: number;
    ad:string;
}

const Home = () => {

    const [kategoriler, setKategoriler] = useState<Kategori[]>([]);

    useEffect(() =>{
fetch('http://localhost:3001/api/kategoriler')
.then(res =>res.json())
.then(data =>setKategoriler(data))
.catch(err => console.error('Kategoriler çekilirken hata oluştu:', err));

    }, []);










    
  return (
   <div className='min-h-screen  bg-[#f9f8f7] flex flex-col'>
    
    <Navbar/>
    <OneCikanIcerik />
    
    <div className='flex flex-row border border-gray-300  my-20 h-40 space-x-3 items-center'>
        <TrendingUp color='#f97901'/>
       <ul className='flex flex-row space-x-3  ' >
        {kategoriler.map((kategori)=>(
            <li className='rounded-xl p-2 hover:bg-pink-600 hover:text-white '>{kategori.ad}</li>
        ))}
       </ul>
    </div>
    <div>
    <SonYazilar />

    </div>
<Footer />
    </div>
  ) 
}

export default Home;
