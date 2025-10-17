import React from 'react'

const Footer = () => {
  return (
    <div >
    <div className='h-80 w-full flex items-center justify-between border-t border-gray-400 rounded-md '>
      <div>
        <h1 className='font-serif bg-gradient-to-r from-orange-500  to-pink-500 bg-clip-text text-transparent'>TeknoHub</h1>
        <h3>Teknoloji, tasarım ve yazılım dünyasından en güncel içerikler.</h3>
      </div>
      <div>
        <h1>Kategoriler</h1>
        <ul>
            <li><a href="/">Tasarım</a></li>
            <li>
                <a href="/">Yazılım</a>
            </li>
            <li>
                <a href="/">Frontend</a>
            </li>
            <li>
                <a href="/">UI/UX</a>
            </li>
        </ul>
      </div>
      <div>
        <h1>Hızlı Linkler</h1>
        <ul>
            <li>
                <a href="/">Hakkımızda</a>
            </li>
            <li>
                <a href="/">İletişim</a>
            </li>
            <li>
                <a href="/">Profil</a>
            </li>
            <li>
                <a href="/">Yazı Oluştur</a>
            </li>
        </ul>
      </div>
      <div>
        <h1>Bülten</h1>
        <h3>Yeni içeriklerden haberdar olun</h3>
        <input type="text" className='border border-gray-400 rounded-lg p-2' placeholder='E-posta adresiniz' />
        <button className='bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-2xl hover:scale-105 transition-transform '>Abone Ol</button>
      </div>
    </div>
    <div className='h-20 w-full flex items-center justify-center border-t border-gray-400 rounded-md '>
<h3>© Tüm Hakları Saklıdır 2023 TeknoHub</h3>
    </div>
    </div>
  )
}

export default Footer;
