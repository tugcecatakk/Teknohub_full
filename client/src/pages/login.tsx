import React from 'react';

import {Button} from "../components/buton";
import {Card,CardContent} from "../components/cardd";
import {Link,useNavigate} from "react-router-dom";
import {Mail,Lock,ArrowRight} from "lucide-react";
import {useState} from "react";
import{ supabase } from "../supabase";

const Login =() =>{
    
    const navigate =useNavigate();
    const [formData,setFormData]=useState({
        email:"",
        password:""
    });
   
    const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const { data, error } = await supabase
    .from("kullanicilar")
    .select("*")
    .eq("email", formData.email)
    .eq("sifre", formData.password)
    .single();

  if (error || !data) {
    alert("Email veya şifre hatalı!");
    return;
  }

 
  localStorage.setItem("user", JSON.stringify(data));

  alert("Giriş başarılı!");
  navigate("/");
};

    
    const handleChange=(e: React.ChangeEvent<HTMLInputElement>)=>{
        setFormData(prev=>({... prev, [e.target.name]: e.target.value}));
    };
    return(
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
      
      <div className="absolute inset-0 gradient-primary opacity-10 blur-3xl" />
      
      <Card className="glass-card w-full max-w-md relative z-10 animate-fade-in">
        <CardContent className="p-8">
      
          <div className="text-center mb-8">
            <Link to="/">
              <h1 className="text-3xl font-serif font-bold gradient-text mb-2">TeknoHub</h1>
            </Link>
            <p className="text-muted-foreground">Hesabınıza giriş yapın</p>
          </div>

          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  placeholder="Email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Şifre
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  placeholder="********"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span className="text-muted-foreground">Beni Hatırla</span>
              </label>
              <a href="#" className="text-primary hover:underline">
                Şifremi Unuttum
              </a>
            </div>

            <Button type="submit" className="w-full gradient-primary">
              Giriş Yap
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </form>

          

        

     
          <p className="text-center text-sm text-muted-foreground mt-6">
            Hesabınız yok mu?{" "}
            <Link to="/kayitol" className="text-primary hover:underline font-medium">
              Kayıt Olun
            </Link>
          </p>

    
          <div className="text-center mt-6">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              ← Anasayfaya Dön
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
        
    

    
};
export default Login;
