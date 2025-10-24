import React from 'react'
import Navbar from './components/navbar'
import Footer from './components/footer'
import Home from './pages/home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import About from './pages/about'

export default function App() {
  return (
    
   <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />


      </Routes>
      <Footer />
    </BrowserRouter>
    
    
  )
}
