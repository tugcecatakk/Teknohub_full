import React from 'react'
import Navbar from './components/navbar'
import Footer from './components/footer'
import Home from './pages/home'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import About from './pages/about'
import Login from './pages/login'
import KayıtOl from './pages/kayıtol'
import Categories from './pages/kategoriler'
import KategoriDetay from './pages/kategoridetay'
import YazıDetay from './pages/yazıdetay'



function AppLayout(){
  const location =useLocation();
  const NavbarYok=location.pathname==="/login" || location.pathname==="/kayitol" ;
  const FooterYok=location.pathname==="/login" || location.pathname==="/kayitol" || location.pathname==="/categories" || location.pathname.startsWith("/category/") ||
    location.pathname.startsWith("/yazi/") ;

  return(
    <>
      {!NavbarYok && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path ="about" element={<About />}/>
        <Route path ="login" element={<Login />}/>
        <Route path ="kayitol" element={<KayıtOl />}/>
        <Route path ="/categories" element={<Categories />}/>
        <Route path="/category/:slug" element={<KategoriDetay />} />
        <Route path="/yazi/:id" element={<YazıDetay/>} />

        </Routes>
        {!FooterYok && <Footer />}

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