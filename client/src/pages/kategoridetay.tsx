
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabase";
import { Card, CardContent } from "../components/cardd";
import { Button } from "../components/buton";


interface Yazı {
  id: number;
  baslik: string;
  icerik: string;
  image_url?: string;
}
interface Category {
  aciklama?: string;}

const KategoriDetay = () => {
  const { slug } = useParams<{ slug: string }>();
  const [yazılar, setYazılar] = useState<Yazı[]>([]);
  const [loading, setLoading] = useState(true);
  const [ filter,setFilter]=useState("varsayılan");
  const [category,setCategory]=useState<Category | null>(null);

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
        .select("*")
        .eq("kategori_id", category.id);

        if(filter==="varsayılan"){
          query=query.order("olusturulma_tarihi",{ascending:false});
        }
        if(filter==="popüler"){
          query=query.order("beğenı;_sayısı",{ascending:false});
        }
        if(filter==="yorum"){
          query=query.order("yorum_sayısı",{ascending:false});
        }
        if(filter==="görüntüleme"){
          query=query.order("görüntüleme_sayısı",{ascending:false});
        }
        

        const { data, error } = await query;


        
        // const { data, error } = await supabase
        //   .from("yazilar")
        //   .select("*")
        //   .eq("kategori_id", category.id)
        //   .order("olusturulma_tarihi", { ascending: false });

        if (error) throw error;
        setYazılar(data || []);
      } catch (err: any) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchYazılar();
  }, [slug,filter]);

  if (loading) return <p>Yükleniyor...</p>;

 

  return (
    <div className="min-h-screen bg-[#fdf8f4]">
      <div className="pt-24"></div>


    <section className="container mx-auto px-4  py-8">
      <div className="space-y-4 animate-fade-in">
        <h2 className="text-4xl md:text-6xl font-serif font-bold capitalize">{slug}</h2>
          <p className="text-lg text-muted-foreground max-w-3xl">
            {category?.aciklama ?? "Bu kategoriye ait yazılar listeleniyor."}
          </p>
          <div className="flex gap-3 mb-8">

          <button
            onClick={() => setFilter("varsayılan")}
            className={`px-3 py-1 rounded-full border ${
              filter === "newest" ? "bg-primary text-white" : ""
            }`}
          >
            🆕 En Yeni
          </button>

          <button
            onClick={() => setFilter("popüler")}
            className={`px-3 py-1 rounded-full border ${
              filter === "popular" ? "bg-primary text-white" : ""
            }`}
          >
            ⭐  En Popüler
          </button>

          <button
            onClick={() => setFilter("görüntüleme")}
            className={`px-3 py-1 rounded-full border ${
              filter === "views" ? "bg-primary text-white" : ""
            }`}
          >
            🔥 En Çok Görüntülenen
          </button>

          <button
            onClick={() => setFilter("yorum")}
            className={`px-3 py-1 rounded-full border ${
              filter === "comments" ? "bg-primary text-white" : ""
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
        {yazılar.map((yazı,index) => (
          <Link key={yazı.id} to={`/yazi/${yazı.id}`}>
            <Card
                className="glass-card group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
              {yazı.image_url && (
                <img
                  src={yazı.image_url}
                  alt={yazı.baslik}
                  className="w-full h-48 object-cover"
                />
              )}
              <CardContent className="p-4 space-y-4">
                <h4 className="text-2xl font-bold mb-2">{yazı.baslik}</h4>
                <p className="text-muted-foreground text-sm line-clamp-2">
                  {yazı.icerik}
                </p>
                <Button variant="ghost" size="sm" className="text-xs mt-2">
                  Oku →
                </Button>
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

