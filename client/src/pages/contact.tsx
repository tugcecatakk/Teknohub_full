import { Github, Linkedin, Mail, MapPin, Phone, Twitter, Send, CheckCircle2 } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
  // Form durumlarını yönetmek için state'ler
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    // API entegrasyonu simülasyonu (Burayı gerçek API endpoint'inizle değiştirebilirsiniz)
    try {
      // Örnek: await fetch('http://localhost:3001/api/contact', { method: 'POST', body: JSON.stringify(formData) })
      await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 saniye bekleme simülasyonu
      
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' }); // Formu temizle
      
      // 5 saniye sonra başarı mesajını kaldır
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <div className='bg-gradient-to-br from-[#faf8f5] via-orange-50 to-pink-50 min-h-screen'>
      {/* Hero Section - Responsive */}
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 lg:pt-36'>
        {/* Header */}
        <div className='text-center max-w-4xl mx-auto mb-12 lg:mb-16'>
          <div className='inline-flex items-center bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-medium mb-6'>
            <Mail size={16} className='mr-2' />
            İletişim
          </div>
          <h1 className='text-3xl sm:text-4xl lg:text-6xl font-bold font-serif text-gray-800 leading-tight mb-6'>
            Sizden Haber Almak İstiyorum
          </h1>
          <p className='text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed'>
            Herhangi bir sorunuz, öneriniz veya işbirliği teklifiniz mi var? 
            Sizden haber almaktan mutluluk duyarım!
          </p>
        </div>

        {/* Main Content - Responsive Grid */}
        <div className='max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 pb-16 lg:pb-20'>
          
          {/* FORM - Mobilde üstte, Desktop'ta solda */}
          <div className='lg:col-span-2 order-2 lg:order-1'>
            <form onSubmit={handleSubmit} className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 relative border border-white/20 hover:shadow-2xl transition-all duration-300'>
              
              {/* Başarı Mesajı Overlay - Responsive */}
              {status === 'success' && (
                <div className='absolute inset-0 bg-white/95 z-10 flex flex-col items-center justify-center rounded-2xl transition-all p-6'>
                  <CheckCircle2 size={48} className='sm:w-16 sm:h-16 text-green-500 mb-4 animate-bounce' />
                  <h3 className='text-xl sm:text-2xl font-bold text-gray-800 text-center'>Mesajınız Gönderildi!</h3>
                  <p className='text-gray-600 text-center text-sm sm:text-base mt-2'>En kısa sürede size dönüş yapacağım.</p>
                  <button 
                    onClick={() => setStatus('idle')}
                    className='mt-4 text-orange-500 font-medium hover:underline text-sm sm:text-base'
                  >
                    Yeni bir mesaj gönder
                  </button>
                </div>
              )}

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6'>
                <div className='space-y-2'>
                  <label className='block text-sm font-semibold text-gray-700'>Adınız Soyadınız</label>
                  <input 
                    required
                    type="text" 
                    name="name" 
                    value={formData.name}
                    onChange={handleChange}
                    className='w-full px-4 py-3 sm:py-4 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none transition-all duration-200 bg-gray-50/50 placeholder-gray-400' 
                    placeholder="Adınız ve soyadınız"
                  />
                </div>

                <div className='space-y-2'>
                  <label className='block text-sm font-semibold text-gray-700'>E-posta Adresiniz</label>
                  <input 
                    required
                    type="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleChange}
                    className='w-full px-4 py-3 sm:py-4 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none transition-all duration-200 bg-gray-50/50 placeholder-gray-400' 
                    placeholder="ornek@email.com"
                  />
                </div>
              </div>

              <div className='space-y-2 mb-6'>
                <label className='block text-sm font-semibold text-gray-700'>Konu</label>
                <input 
                  required
                  type="text" 
                  name="subject" 
                  value={formData.subject}
                  onChange={handleChange}
                  className='w-full px-4 py-3 sm:py-4 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none transition-all duration-200 bg-gray-50/50 placeholder-gray-400' 
                  placeholder="Mesajınızın konusu"
                />
              </div>

              <div className='space-y-2 mb-8'>
                <label className='block text-sm font-semibold text-gray-700'>Mesajınız</label>
                <textarea 
                  required
                  name="message" 
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className='w-full px-4 py-3 sm:py-4 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none transition-all duration-200 resize-none bg-gray-50/50 placeholder-gray-400' 
                  placeholder="Mesajınızı buraya yazın..."
                ></textarea>
              </div>

              <div className='flex justify-center'>
                <button 
                  disabled={status === 'loading'}
                  type="submit" 
                  className={`bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg w-full sm:w-auto min-w-48 flex justify-center items-center space-x-2 group ${status === 'loading' ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02] hover:shadow-xl'}`}
                >
                  {status === 'loading' ? (
                    <div className='flex items-center space-x-2'>
                      <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                      <span>Gönderiliyor...</span>
                    </div>
                  ) : (
                    <>
                      <span>Mesajı Gönder</span>
                      <Send size={18} className='group-hover:translate-x-1 transition-transform' />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* SIDEBAR - Mobilde altta, Desktop'ta sağda */}
          <div className='lg:col-span-1 order-1 lg:order-2 space-y-6 lg:space-y-8'>
            
            {/* İletişim Bilgileri Card */}
            <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border border-white/20 hover:shadow-2xl transition-all duration-300'>
              <div className='flex items-center space-x-2 mb-6'>
                <div className='w-2 h-8 bg-gradient-to-b from-orange-400 to-pink-400 rounded-full'></div>
                <h3 className='text-xl font-bold text-gray-800'>İletişim Bilgileri</h3>
              </div>
              
              <div className='space-y-6'>
                <div className='flex items-start space-x-4 group cursor-pointer'>
                  <div className='bg-gradient-to-br from-orange-100 to-orange-200 p-3 rounded-xl text-orange-600 group-hover:scale-110 transition-transform'>
                    <Mail size={20}/>
                  </div>
                  <div className='flex-1'>
                    <span className='text-xs text-gray-500 font-bold uppercase tracking-wider'>E-posta</span>
                    <p className='text-gray-800 font-medium'>ayse@modernblog.com</p>
                  </div>
                </div>
                
                <div className='flex items-start space-x-4 group cursor-pointer'>
                  <div className='bg-gradient-to-br from-orange-100 to-orange-200 p-3 rounded-xl text-orange-600 group-hover:scale-110 transition-transform'>
                    <Phone size={20}/>
                  </div>
                  <div className='flex-1'>
                    <span className='text-xs text-gray-500 font-bold uppercase tracking-wider'>Telefon</span>
                    <p className='text-gray-800 font-medium'>+90 (555) 123 45 67</p>
                  </div>
                </div>
                
                <div className='flex items-start space-x-4 group cursor-pointer'>
                  <div className='bg-gradient-to-br from-orange-100 to-orange-200 p-3 rounded-xl text-orange-600 group-hover:scale-110 transition-transform'>
                    <MapPin size={20}/>
                  </div>
                  <div className='flex-1'>
                    <span className='text-xs text-gray-500 font-bold uppercase tracking-wider'>Konum</span>
                    <p className='text-gray-800 font-medium'>İstanbul, Türkiye</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sosyal Medya Card */}
            <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border border-white/20 hover:shadow-2xl transition-all duration-300'>
              <div className='flex items-center space-x-2 mb-6'>
                <div className='w-2 h-8 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full'></div>
                <h3 className='text-xl font-bold text-gray-800'>Sosyal Medya</h3>
              </div>
              
              <p className='text-gray-600 mb-6 text-sm leading-relaxed'>
                Sosyal medya hesaplarımdan da beni takip edebilir, güncel içeriklerimi görebilirsiniz.
              </p>
              
              <div className='grid grid-cols-3 gap-4'>
                <Link to={'/'} className='bg-gradient-to-br from-gray-50 to-gray-100 hover:from-orange-500 hover:to-orange-600 hover:text-white border border-gray-200 p-4 rounded-xl transition-all duration-300 flex items-center justify-center group hover:scale-105 hover:shadow-lg'>
                  <Github size={20} className='group-hover:scale-110 transition-transform'/>
                </Link>
                <Link to={'/'} className='bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-400 hover:to-blue-500 hover:text-white border border-gray-200 p-4 rounded-xl transition-all duration-300 flex items-center justify-center group hover:scale-105 hover:shadow-lg'>
                  <Twitter size={20} className='group-hover:scale-110 transition-transform'/>
                </Link>
                <Link to={'/'} className='bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-600 hover:to-blue-700 hover:text-white border border-gray-200 p-4 rounded-xl transition-all duration-300 flex items-center justify-center group hover:scale-105 hover:shadow-lg'>
                  <Linkedin size={20} className='group-hover:scale-110 transition-transform'/>
                </Link>
              </div>
            </div>

            {/* Hızlı İpuçları Card - Sadece Desktop'ta göster */}
            <div className='hidden lg:block bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-6 border border-orange-200'>
              <h4 className='text-lg font-bold text-gray-800 mb-4'>💡 Hızlı İpuçları</h4>
              <ul className='space-y-3 text-sm text-gray-700'>
                <li className='flex items-start space-x-2'>
                  <span className='text-orange-500 font-bold'>•</span>
                  <span>24 saat içinde size dönüş yapacağım</span>
                </li>
                <li className='flex items-start space-x-2'>
                  <span className='text-orange-500 font-bold'>•</span>
                  <span>İşbirliği teklifleri için detay belirtin</span>
                </li>
                <li className='flex items-start space-x-2'>
                  <span className='text-orange-500 font-bold'>•</span>
                  <span>Teknik sorular için örnekler ekleyin</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;