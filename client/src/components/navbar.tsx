
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <div className='fixed top-0 bg-[#faf8f5] bg-opacity-95 backdrop-blur-sm h-auto md:h-20 w-full 
      flex flex-col md:flex-row items-center justify-between border-b border-gray-400 rounded-md shadow-sm z-50 py-2 md:py-0 transition-all duration-300'>

      <div className=' text-3xl mb-2 md:mb-0 md:ml-3'>
        <h1 className='font-serif bg-gradient-to-r from-orange-500 to-pink-500 
          bg-clip-text text-transparent'>
          TeknoHub
        </h1>
      </div>

      <div className='font-sans text-sm md:text-md flex gap-4 md:gap-10 mb-2 md:mb-0'>
        <Link to="/">Anasayfa</Link>
        <Link to="/categories">Kategoriler</Link>
        <Link to="/about">Hakkımızda</Link>
        <Link to="/contact">İletişim</Link>
      </div>

     
      {user ? (
        <div className="flex items-center space-x-4 md:mr-4">
         
          <img
            src={user.image } 
            alt="avatar"
            className="w-8 h-8 md:w-10 md:h-10 rounded-full border"
          />
          <span className="text-sm font-semibold text-gray-800">
            {user.kullanici_adi }
          </span>

         
          <button
            onClick={handleLogout}
            className="text-red-500 hover:underline"
          >
            Çıkış Yap
          </button>
        </div>
      ) : (
        
        <div className='flex gap-4 md:mr-4 items-center'>
          <Link to="/login" className="text-sm md:text-base hover:text-orange-500">Giriş Yap</Link>
          <Link
            to="/kayitol"
            className='bg-gradient-to-r from-orange-500 to-pink-500 
            text-white px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base rounded-2xl hover:scale-105 transition-transform'
          >
            Kayıt Ol
          </Link>
        </div>
      )}

    </div>
  );
};

export default Navbar;
