import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='fixed top-0 bg-[#faf8f5] bg-opacity-95 backdrop-blur-sm h-20 w-full flex items-center justify-between border-b border-gray-400 rounded-md shadow-sm z-50'>
      <div className='ml-3 text-3xl '>
        <h1 className='font-serif bg-gradient-to-r from-orange-500  to-pink-500 bg-clip-text text-transparent'>TeknoHub</h1>
      </div>
      <div className='font-sans text-md space-x-10 '>
        <Link to="/">Anasayfa</Link>
        <Link to="/categories">Kategoriler</Link>
        <Link to="/about">Hakkımda</Link>
        <Link to="/contact">İletişim</Link>
      </div>

      <div className='space-x-4'>
        <Link to="/login" className=''>
          Giriş Yap
        </Link>
        <Link to="/kayitol" className='bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-2xl hover:scale-105 transition-transform'>
          Kayıt Ol
        </Link>
      </div>


     
    </div>

   
  )
}

export default Navbar;
