import React from 'react'
import Navbar from './components/navbar'
import Footer from './components/footer'
import Home from './pages/home'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import About from './pages/about'
import Login from './pages/login'
import KayıtOl from './pages/kayıtol'


function AppLayout(){
  const location =useLocation();
  const isAuthPage=location.pathname==="/login" || location.pathname==="/kayitol";
  return(
    <>
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path ="about" element={<About />}/>
        <Route path ="login" element={<Login />}/>
        <Route path ="kayitol" element={<KayıtOl />}/>
        </Routes>
        {!isAuthPage && <Footer />}

    </>

  )
}
export default function App(){
  return(
    <BrowserRouter>
    <AppLayout />
    </BrowserRouter>
  )
}