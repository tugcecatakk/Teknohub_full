import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Kategori {
  id: number;
  ad: string;
  slug?: string; 
}

const Footer = () => {
  const [kategoriler, setKategoriler] = useState<Kategori[]>([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/kategoriler')
      .then((res) => res.json())
      .then((data) => setKategoriler(data))
      .catch((err) => console.error('Kategoriler çekilirken hata oluştu:', err));
  }, []);

  return (
    <footer className="bg-[#faf8f5] border-t border-gray-300 mt-auto">
      <div className="container mx-auto px-6 py-12">
        
      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
        
          <div className="lg:col-span-1 space-y-4">
            <h1 className="text-3xl font-serif font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent inline-block">
              TeknoHub
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              Teknoloji, tasarım ve yazılım dünyasından en güncel içerikleri sizlerle buluşturuyoruz.
            </p>
          </div>

          
          <div>
            <h3 className="text-gray-900 font-bold mb-4 uppercase text-sm tracking-wider">Kategoriler</h3>
            <ul className="space-y-2">
              {kategoriler.slice(0, 5).map((kategori) => ( 
                <li key={kategori.id}>
                  <Link 
                    to={`/category/${kategori.slug || kategori.id}`} 
                    className="text-gray-600 hover:text-orange-500 transition-colors text-sm"
                  >
                    {kategori.ad}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          
          

          <div>
            <h3 className="text-gray-900 font-bold mb-4 uppercase text-sm tracking-wider">Hesap</h3>
            <ul className="space-y-2">
              
              <li>
                <Link to="/admin" className="text-gray-600 hover:text-orange-500 transition-colors text-sm">Yazı Oluştur</Link>
              </li>
              <li>
                <Link to="/kayitol" className="text-gray-600 hover:text-orange-500 transition-colors text-sm">Üye Ol</Link>
              </li>
            </ul>
          </div>
        </div>

      
        <div className="border-t border-gray-200 mt-12 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <div className="flex space-x-4 mt-4 md:mt-0">
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;