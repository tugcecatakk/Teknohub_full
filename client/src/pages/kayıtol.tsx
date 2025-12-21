import React, { useState } from "react";
import { Button } from "../components/buton";
import { Card, CardContent } from "../components/cardd";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, User, Image as ImageIcon } from "lucide-react";
import { supabase } from "../supabase";

const KayitOl = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [profilFoto, setProfilFoto] = useState<File | null>(null);
  const [yükleniyor, setYükleniyor] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfilFoto(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Şifreler eşleşmiyor!");
      return;
    }

    setYükleniyor(true);

    try {
      let imageUrl = null;

      
      if (profilFoto) {
        const fileExt = profilFoto.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("Avatars")    
          .upload(fileName, profilFoto);

        if (uploadError) {
          console.error(uploadError);
          alert("Fotoğraf yüklenemedi.Kayıt işlemi iptal edildi.");
          setYükleniyor(false);
          return;
        } else {
          imageUrl = supabase.storage
            .from("Avatars")
            .getPublicUrl(uploadData.path).data.publicUrl;
        }
      }

     
      const { error } = await supabase.from("kullanicilar").insert([
        {
          kullanici_adi: formData.name,
          email: formData.email,
          sifre: formData.password,
          image: imageUrl,
        },
      ]);

      if (error) {
        alert("Kayıt başarısız: " + error.message);
        return;
      }

      alert("Kayıt başarılı!");
      navigate("/login");

    } finally {
      setYükleniyor(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 gradient-primary opacity-10 blur-3xl" />

      <Card className="glass-card w-full max-w-md relative z-10 animate-fade-in">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <Link to="/">
              <h1 className="text-3xl font-serif font-bold gradient-text mb-2">
                TeknoHub
              </h1>
            </Link>
            <p className="text-muted-foreground">Yeni hesap oluşturun</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            
            <div className="space-y-2">
              <label className="text-sm font-medium">Profil Fotoğrafı</label>

              <label className="flex items-center gap-3 p-3 bg-secondary border rounded-lg cursor-pointer hover:bg-secondary/80">
                <ImageIcon className="text-muted-foreground" />
                <span className="text-sm">
                  {profilFoto ? profilFoto.name : "Fotoğraf seçin"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Ad Soyad</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-secondary rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="Ad Soyad"
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
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-secondary rounded-lg focus:ring-2 focus:ring-primary"
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
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-secondary rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="********"
                />
              </div>
            </div>

           
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">Şifre Tekrar</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-secondary rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="********"
                />
              </div>
            </div>

            <Button type="submit" className="w-full gradient-primary" disabled={yükleniyor}>
              {yükleniyor ? "Kaydediliyor..." : "Kayıt Ol"}
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

export default KayitOl;
