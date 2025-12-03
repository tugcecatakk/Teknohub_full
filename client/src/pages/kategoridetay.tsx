
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

const KategoriDetay = () => {
  const { slug } = useParams<{ slug: string }>();
  const [yazılar, setYazılar] = useState<Yazı[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchYazılar = async () => {
      try {
       
        const { data: category, error: catErr } = await supabase
          .from("kategoriler")
          .select("id, ad")
          .eq("slug", slug)
          .single();

        if (catErr || !category) throw new Error("Kategori bulunamadı");

        
        const { data, error } = await supabase
          .from("yazilar")
          .select("*")
          .eq("kategori_id", category.id)
          .order("olusturulma_tarihi", { ascending: false });

        if (error) throw error;
        setYazılar(data || []);
      } catch (err: any) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchYazılar();
  }, [slug]);

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">{slug}</h1>

      {yazılar.length === 0 && <p>Bu kategoride yazı bulunmamaktadır.</p>}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {yazılar.map((yazı) => (
          <Link key={yazı.id} to={`/yazi/${yazı.id}`}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              {yazı.image_url && (
                <img
                  src={yazı.image_url}
                  alt={yazı.baslik}
                  className="w-full h-48 object-cover"
                />
              )}
              <CardContent className="p-4">
                <h3 className="text-2xl font-bold mb-2">{yazı.baslik}</h3>
                <p className="line-clamp-3 text-muted-foreground">
                  {yazı.icerik}
                </p>
                <Button variant="ghost" size="sm" className="mt-2 w-full">
                  Oku →
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default KategoriDetay;
