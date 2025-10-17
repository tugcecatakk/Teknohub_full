import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='fixed top-0 bg-opacity-50 h-20 w-full flex items-center justify-between border-b border-gray-400 rounded-md '>
      <div className='ml-3 text-3xl '>
        <h1 className='font-serif bg-gradient-to-r from-orange-500  to-pink-500 bg-clip-text text-transparent'>TeknoHub</h1>
      </div>
      <div className='font-sans text-md space-x-10 '>
        <Link to="/">Anasayfa</Link>
        <Link to="/categories">Kategoriler</Link>
        <Link to="/">Hakkımda</Link>
        <Link to="/">İletişim</Link>
      </div>
      
      <div className='space-x-4'>
        <button className=''>Giriş Yap</button>
        <button className='bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-2xl hover:scale-105 transition-transform '>Kayıt Ol</button>
      </div>
      
    </div>
  ) 
}

export default Navbar;
