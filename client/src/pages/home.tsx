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
    const [loading, setLoading] = useState(true);

    useEffect(() =>{
        setLoading(true);
        fetch('http://localhost:3001/api/kategoriler')
        .then(res =>res.json())
        .then(data =>{
            setKategoriler(data);
            setLoading(false);
        })
        .catch(err => {
            console.error('Kategoriler çekilirken hata oluştu:', err);
            setLoading(false);
        });
    }, []);










    
  return (
   <div className='min-h-screen  bg-[#faf8f5] flex flex-col'>
    
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

    </div>
  ) 
}

export default Home;
