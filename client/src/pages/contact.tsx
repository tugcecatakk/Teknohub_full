import { Github, Linkedin, Mail, MapPin, Phone, Twitter } from 'lucide-react';
import React from 'react'
import { Link } from 'react-router-dom'

const Contact = () => {
  return (
    <div className='bg-[#faf8f5] min-h-screen mb-20'>
      <div className='flex flex-col justify-center items-center pt-36 px-6'>
        <div className='text-center max-w-2xl space-y-6 mb-12'>
          <h1 className='text-6xl font-bold font-serif text-gray-800'>İletişime Geçin</h1>
          <p className='text-lg text-gray-600'>
            Herhangi bir sorunuz, öneriniz veya işbirliği teklifiniz mi var? 
            Sizden haber almaktan mutluluk duyarım!
          </p>
        </div>

        <div className='w-full flex flex-row gap-10 px-44'>
          <form className='bg-white rounded-xl shadow-lg p-8 space-y-6 w-8/12'>
            
            {/* Ad Soyad ve Email yan yana */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label htmlFor="name" className='block text-sm font-medium text-gray-700 mb-2'>
                  Adınız Soyadınız
                </label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all' 
                  placeholder="Adınız ve soyadınız"
                />
              </div>

              <div>
                <label htmlFor="email" className='block text-sm font-medium text-gray-700 mb-2'>
                  E-posta Adresiniz
                </label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all' 
                  placeholder="ornek@email.com"
                />
              </div>
            </div>

            {/* Konu */}
            <div>
              <label htmlFor="subject" className='block text-sm font-medium text-gray-700 mb-2'>
                Konu
              </label>
              <input 
                type="text" 
                id="subject" 
                name="subject" 
                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all' 
                placeholder="Mesajınızın konusu"
              />
            </div>

            {/* Mesaj */}
            <div>
              <label htmlFor="message" className='block text-sm font-medium text-gray-700 mb-2'>
                Mesajınız
              </label>
              <textarea 
                id="message" 
                name="message" 
                rows={6}
                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all resize-none' 
                placeholder="Mesajınızı buraya yazın..."
              ></textarea>
            </div>

            {/* Gönder Butonu */}
            <div className='flex justify-center pt-4 '>
              <button 
                type="submit" 
                className='bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-3 rounded-lg font-medium hover:scale-105 transition-transform shadow-lg w-full'
              >
                Mesajı Gönder
              </button>
            </div>

          </form>
          <div className='flex flex-col space-y-8 w-4/12'>
<div className='bg-white rounded-xl shadow-lg p-8 space-y-6'>
<span>İletişim Bilgileri</span>
<div className='flex flex-row  items-center space-x-4'>
    <div>
        <Mail/>
    </div>
    <div className='flex flex-col'>
        <span>E posta</span>
        <span>ayse@modernblog.com</span>
    </div>

</div>
<div className='flex flex-row items-center space-x-4'>
    <div>
        <Phone/>
    </div>
    <div className='flex flex-col'>
        <span>Telefon</span>
        <span>+90 (555) 123 45 67</span>
    </div>

</div>
<div className='flex flex-row  items-center space-x-4'>
    <div>
        <MapPin />
    </div>
    <div className='flex flex-col'>
        <span>Konum</span>
        <span>İstanbul, Türkiye</span>
    </div>

</div>

          </div>

          <div className='flex flex-col bg-white rounded-xl shadow-lg p-8 space-y-6'>
            <h3 className='text-lg font-semibold text-gray-800'>Sosyal Medya</h3>
            <p className='text-sm text-gray-600'>Sosyal medya hesaplarımdan da beni takip edebilirsiniz</p>
            <div className='flex flex-row gap-4 items-center'>
              <Link to={'/'} className='bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 p-3 rounded-xl transition-colors'>
                <Github size={16}/>
              </Link>
              <Link to={'/'} className='bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 p-3 rounded-xl transition-colors'>
                <Twitter size={16} />
              </Link>
              <Link to={'/'} className='bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 p-3 rounded-xl transition-colors'>
                <Linkedin size={16} />
              </Link>
            </div>
          </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default Contact;
