// import React from 'react'
// import { Link } from 'react-router-dom'

// const Navbar = () => {
  
//   return (
//     <div className='fixed top-0 bg-[#faf8f5] bg-opacity-95 backdrop-blur-sm h-20 w-full flex items-center justify-between border-b border-gray-400 rounded-md shadow-sm z-50'>
//       <div className='ml-3 text-3xl '>
//         <h1 className='font-serif bg-gradient-to-r from-orange-500  to-pink-500 bg-clip-text text-transparent'>TeknoHub</h1>
//       </div>
//       <div className='font-sans text-md space-x-10 '>
//         <Link to="/">Anasayfa</Link>
//         <Link to="/categories">Kategoriler</Link>
//         <Link to="/about">Hakkımda</Link>
//         <Link to="/contact">İletişim</Link>
//       </div>

//       <div className='space-x-4'>
//         <Link to="/login" className=''>
//           Giriş Yap
//         </Link>
//         <Link to="/kayitol" className='bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-2xl hover:scale-105 transition-transform'>
//           Kayıt Ol
//         </Link>
//       </div>


     
//     </div>

   
//   )
// }


import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);

  // Admin sayfasında mı kontrolü
  const isAdminPage = location.pathname === '/admin';

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
    <div className='fixed top-0 bg-[#faf8f5] bg-opacity-95 backdrop-blur-sm h-20 w-full 
      flex items-center justify-between border-b border-gray-400 rounded-md shadow-sm z-50'>

      <div className='ml-3 text-3xl'>
        <h1 className='font-serif bg-gradient-to-r from-orange-500 to-pink-500 
          bg-clip-text text-transparent'>
          TeknoHub
        </h1>
      </div>

      <div className='font-sans text-md space-x-10'>
        <Link to="/">Anasayfa</Link>
        <Link to="/categories">Kategoriler</Link>
        <Link to="/about">Hakkımızda</Link>
        <Link to="/contact">İletişim</Link>
        <Link to="/admin-login" className="text-orange-600 hover:text-orange-800">Admin</Link>
      </div>

     
      {user ? (
        <div className="flex items-center space-x-4 mr-4">
         
          <img
            src={user.image } 
            alt="avatar"
            className="w-10 h-10 rounded-full border"
          />

         
          <button
            onClick={handleLogout}
            className="text-red-500 hover:underline"
          >
            {isAdminPage ? "Admin Çıkışı" : "Çıkış Yap"}
          </button>
        </div>
      ) : (
        
        <div className='space-x-4 mr-4'>
          <Link to="/login">Giriş Yap</Link>
          <Link
            to="/kayitol"
            className='bg-gradient-to-r from-orange-500 to-pink-500 
            text-white px-4 py-2 rounded-2xl hover:scale-105 transition-transform'
          >
            Kayıt Ol
          </Link>
        </div>
      )}

    </div>
  );
};

export default Navbar;
