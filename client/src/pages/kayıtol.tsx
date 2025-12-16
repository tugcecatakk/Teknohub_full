import React from 'react';

import {Button} from "../components/buton";
import {Card,CardContent} from "../components/cardd";
import {Link,useNavigate} from "react-router-dom";
import {Mail,Lock,ArrowRight, User} from "lucide-react";
import {useState} from "react";

const KayıtOl =()=>{
    const [formData,setFormData]=useState({
        name:"",
        email:"",
        password:"",
        confirmpassword:""
    });
    const handleSubmit=(e:React.FormEvent)=>{
        e.preventDefault();
        if(formData.password !==formData.confirmpassword){
            alert("Şifreler eşleşmiyor.")
            return;
        }
        alert("Kayıt başarılı! Hesabınız oluşturuldu.");
        
      
    };
    const handleChange=(e: React.ChangeEvent<HTMLInputElement>)=>{
         setFormData(prev=>({... prev, [e.target.name]: e.target.value}));
    };
    return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 gradient-primary opacity-10 blur-3xl" />
      
      <Card className="glass-card w-full max-w-md relative z-10 animate-fade-in">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <Link to="/">
              <h1 className="text-3xl font-serif font-bold gradient-text mb-2">TeknoHub</h1>
            </Link>
            <p className="text-muted-foreground">Yeni hesap oluşturun</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
           
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Ad Soyad</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  placeholder="Ad Soyad "
                />
              </div>
            </div>

           
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
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
              <label htmlFor="password" className="text-sm font-medium">Şifre</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="w-full pl-11 pr-4 py-3 bg-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  placeholder="********"
                />
              </div>
              <p className="text-xs text-muted-foreground">En az 8 karakter olmalıdır.</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">Şifre Tekrar</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmpassword}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  placeholder="********"
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full gradient-primary">
              Kayıt Ol
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Zaten hesabınız var mı?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Giriş Yapın
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default KayıtOl;


