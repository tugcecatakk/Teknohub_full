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
    <div className='bg-[#faf8f5] min-h-screen mb-20'>
      <div className='flex flex-col justify-center items-center pt-36 px-6'>
        <div className='text-center max-w-2xl space-y-6 mb-12'>
          <h1 className='text-6xl font-bold font-serif text-gray-800'>İletişime Geçin</h1>
          <p className='text-lg text-gray-600'>
            Sizden haber almaktan mutluluk duyarım! Formu doldurarak bana ulaşabilirsiniz.
          </p>
        </div>

        <div className='w-full flex flex-row gap-10 px-44'>
          {/* FORM BAŞLANGIÇ */}
          <form onSubmit={handleSubmit} className='bg-white rounded-xl shadow-lg p-8 space-y-6 w-8/12 relative'>
            
            {/* Başarı Mesajı Overlay */}
            {status === 'success' && (
              <div className='absolute inset-0 bg-white/90 z-10 flex flex-col items-center justify-center rounded-xl transition-all'>
                <CheckCircle2 size={64} className='text-green-500 mb-4 scale-110' />
                <h3 className='text-2xl font-bold text-gray-800'>Mesajınız Gönderildi!</h3>
                <p className='text-gray-600'>En kısa sürede size dönüş yapacağım.</p>
                <button 
                  onClick={() => setStatus('idle')}
                  className='mt-4 text-orange-500 font-medium hover:underline'
                >
                  Yeni bir mesaj gönder
                </button>
              </div>
            )}

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Adınız Soyadınız</label>
                <input 
                  required
                  type="text" 
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                  className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all' 
                  placeholder="Adınız ve soyadınız"
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>E-posta Adresiniz</label>
                <input 
                  required
                  type="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all' 
                  placeholder="ornek@email.com"
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Konu</label>
              <input 
                required
                type="text" 
                name="subject" 
                value={formData.subject}
                onChange={handleChange}
                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all' 
                placeholder="Mesajınızın konusu"
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Mesajınız</label>
              <textarea 
                required
                name="message" 
                rows={6}
                value={formData.message}
                onChange={handleChange}
                className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all resize-none' 
                placeholder="Mesajınızı buraya yazın..."
              ></textarea>
            </div>

            <div className='flex justify-center pt-4 '>
              <button 
                disabled={status === 'loading'}
                type="submit" 
                className={`bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-3 rounded-lg font-medium transition-all shadow-lg w-full flex justify-center items-center space-x-2 ${status === 'loading' ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
              >
                {status === 'loading' ? (
                  <span className='animate-pulse'>Gönderiliyor...</span>
                ) : (
                  <>
                    <span>Mesajı Gönder</span>
                    <Send size={18} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* SAĞ TARAF - BİLGİLER */}
          <div className='flex flex-col space-y-8 w-4/12'>
            <div className='bg-white rounded-xl shadow-lg p-8 space-y-6'>
              <h3 className='text-lg font-semibold text-gray-800 border-b pb-2'>İletişim Bilgileri</h3>
              <div className='flex flex-row items-center space-x-4'>
                <div className='bg-orange-100 p-2 rounded-lg text-orange-600'><Mail size={20}/></div>
                <div className='flex flex-col'>
                  <span className='text-xs text-gray-400 font-bold uppercase'>E-posta</span>
                  <span className='text-sm text-gray-700'>ayse@modernblog.com</span>
                </div>
              </div>
              <div className='flex flex-row items-center space-x-4'>
                <div className='bg-orange-100 p-2 rounded-lg text-orange-600'><Phone size={20}/></div>
                <div className='flex flex-col'>
                  <span className='text-xs text-gray-400 font-bold uppercase'>Telefon</span>
                  <span className='text-sm text-gray-700'>+90 (555) 123 45 67</span>
                </div>
              </div>
              <div className='flex flex-row items-center space-x-4'>
                <div className='bg-orange-100 p-2 rounded-lg text-orange-600'><MapPin size={20}/></div>
                <div className='flex flex-col'>
                  <span className='text-xs text-gray-400 font-bold uppercase'>Konum</span>
                  <span className='text-sm text-gray-700'>İstanbul, Türkiye</span>
                </div>
              </div>
            </div>

            <div className='flex flex-col bg-white rounded-xl shadow-lg p-8 space-y-6'>
              <h3 className='text-lg font-semibold text-gray-800'>Sosyal Medya</h3>
              <p className='text-sm text-gray-600'>Sosyal medya hesaplarımdan da beni takip edebilirsiniz</p>
              <div className='flex flex-row gap-4 items-center'>
                <Link to={'/'} className='bg-gray-50 hover:bg-orange-500 hover:text-white border-2 border-gray-200 p-3 rounded-xl transition-all'>
                  <Github size={18}/>
                </Link>
                <Link to={'/'} className='bg-gray-50 hover:bg-blue-400 hover:text-white border-2 border-gray-200 p-3 rounded-xl transition-all'>
                  <Twitter size={18} />
                </Link>
                <Link to={'/'} className='bg-gray-50 hover:bg-blue-700 hover:text-white border-2 border-gray-200 p-3 rounded-xl transition-all'>
                  <Linkedin size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;