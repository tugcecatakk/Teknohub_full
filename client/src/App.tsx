import React from 'react'
import Navbar from './components/navbar'
import Footer from './components/footer'
import Home from './pages/home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import About from './pages/about'
import Login from './pages/login'
import KayıtOl from './pages/kayıtol'
import Contact from './pages/contact'
import Admin from './pages/admin'

export default function App() {
  try {
    return (
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/kayıtol" element={<KayıtOl />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    )
  } catch (error) {
    console.error('App component hatası:', error);
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Uygulama Hatası</h1>
          <p className="text-gray-700">Bir hata oluştu, sayfa yeniden yüklenmeyi deneyin.</p>
        </div>
      </div>
    );
  }
}
