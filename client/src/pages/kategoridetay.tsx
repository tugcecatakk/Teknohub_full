
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabase";
import { Card, CardContent } from "../components/cardd";
import { Button } from "../components/buton";
import { ArrowBigLeft, ArrowLeft } from "lucide-react";
import YaziDetay from "./yazıdetay";
import { ArrowRight, Heart, MessageCircle, Calendar, User } from "lucide-react";


interface Yazı {
  id: number;
  baslik: string;
  icerik: string;
  image_url?: string;
  begeni_sayisi?: number;
  yorum_sayisi?: number;
  goruntuleme: number;
  olusturulma_tarihi: string;
  kategori_id: number;
  yazarlar?: {
    ad_soyad: string;
   profil_resmi_url?: string;
  } | null;



}
interface Category {
  aciklama?: string;
}


const KategoriDetay = () => {
  const { slug } = useParams<{ slug: string }>();
  const [yazılar, setYazılar] = useState<Yazı[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("varsayılan");
  const [category, setCategory] = useState<Category | null>(null);


  useEffect(() => {
    const fetchYazılar = async () => {
      try {

        const { data: category, error: catErr } = await supabase
          .from("kategoriler")
          .select("id, ad,aciklama")
          .eq("slug", slug)
          .single();

        if (catErr || !category) throw new Error("Kategori bulunamadı");
        setCategory(category);
        let query = supabase
          .from("yazilar")
          .select("*,yazarlar(ad_soyad,profil_resmi_url)")
          .eq("kategori_id", category.id);

        if (filter === "varsayılan") {
          query = query.order("olusturulma_tarihi", { ascending: false });
        }
        if (filter === "popüler") {
          query = query.order("begeni_sayisi", { ascending: false });
        }
        if (filter === "yorum") {
          query = query.order("yorum_sayisi", { ascending: false });
        }
        if (filter === "goruntuleme") {
          query = query.order("goruntuleme", { ascending: false });
        }


        const { data, error } = await query;


        if (error) throw error;
        setYazılar(data || []);
      } catch (err: any) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchYazılar();
  }, [slug, filter]);

  if (loading) return <p>Yükleniyor...</p>;

  
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };



  return (

    <div className="min-h-screen bg-[#fdf8f4]">
      <div className="pt-24"></div>
      <div className="container mx-auto px-4 py-6">
        <Link to="/categories">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kategorilere Dön
          </Button>
        </Link>
      </div>

      <section className="container mx-auto px-4  py-8">
        <div className="space-y-4 animate-fade-in">
          <h2 className="text-4xl md:text-6xl font-serif font-bold capitalize">{slug}</h2>
          <p className="text-lg text-muted-foreground max-w-3xl">
            {category?.aciklama ?? "Bu kategoriye ait yazılar listeleniyor."}
          </p>
          <div className="flex gap-3 mb-8">




            <button
              onClick={() => setFilter("varsayılan")}
              className={`px-3 py-1 rounded-full border ${filter === "varsayılan" ? "bg-primary text-white" : ""
                }`}
            >
              🆕 En Yeni
            </button>

            <button
              onClick={() => setFilter("popüler")}
              className={`px-3 py-1 rounded-full border ${filter === "popüler" ? "bg-primary text-white" : ""
                }`}
            >
              ⭐  En Popüler
            </button>

            <button
              onClick={() => setFilter("goruntuleme")}
              className={`px-3 py-1 rounded-full border ${filter === "goruntuleme" ? "bg-primary text-white" : ""
                }`}
            >
              🔥 En Çok Görüntülenen
            </button>

            <button
              onClick={() => setFilter("yorum")}
              className={`px-3 py-1 rounded-full border ${filter === "yorum" ? "bg-primary text-white" : ""
                }`}
            >
              💬 En Çok Yorum Alan
            </button>


          </div>
        </div>
      </section>
      <section className="container mx-autopx-4 px-4 py-12 md:py-20">
        {yazılar.length === 0 && <p>Bu kategoride yazı bulunmamaktadır.</p>}

        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {yazılar.map((yazı, index) => (
            <Link key={yazı.id} to={`/yazi/${yazı.id}`}>
              <Card
                className="h-full flex flex-col glass-card group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 overflow-hidden animate-fade-in border border-gray-100"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                
                <div className="relative overflow-hidden h-48">
                  {yazı.image_url ? (
                    <img
                      src={yazı.image_url}
                      alt={yazı.baslik}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                      Resim Yok
                    </div>
                  )}
                </div>

             
                <CardContent className="p-5 flex flex-col flex-grow space-y-4">
                  
                
                  <div className="space-y-2 flex-grow">
                    <h4 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                      {yazı.baslik}
                    </h4>
                    <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                      {yazı.icerik}
                    </p>
                  </div>

                
                  <div className="flex items-center gap-3 pt-2">
                    {yazı.yazarlar?.profil_resmi_url ? (
                      <img
                        src={yazı.yazarlar.profil_resmi_url}
                        alt={yazı.yazarlar.ad_soyad}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                         <User size={20} />
                      </div>
                    )}
                    
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800">
                        {yazı.yazarlar?.ad_soyad ?? "Anonim"}
                      </span>
                      <div className="flex items-center text-xs text-gray-500 gap-1">
                        <span>{formatDate(yazı.olusturulma_tarihi)}</span>
                       
                        
                      </div>
                    </div>
                  </div>

                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                    <div className="flex items-center gap-4 text-gray-500 text-sm">
                      <div className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
                        <Heart size={16} />
                        <span>{yazı.begeni_sayisi ?? 0}</span>
                      </div>
                      <div className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
                        <MessageCircle size={16} />
                        <span>{yazı.yorum_sayisi ?? 0}</span>
                      </div>
                    </div>

                    <div className="flex items-center text-sm font-medium text-gray-900 group-hover:translate-x-1 transition-transform">
                      Oku <ArrowRight size={16} className="ml-1" />
                    </div>
                  </div>

                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default KategoriDetay;

