
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabase";
import { Button } from "../components/buton";
import { ArrowLeft } from "lucide-react";
import { ArrowRight, Heart, MessageCircle, Calendar, User, Clock } from "lucide-react";
import Kod from "../components/Kod";
interface Yazi {
  id: number;
  baslik: string;
  icerik: string;
  image_url?: string;
  olusturulma_tarihi: string;
  kategori_id: number;
  kod_editor: string;
  yazarlar?: {
    ad_soyad: string;
    profil_resmi_url?: string;
  } | null;

  kategoriler?: {
    slug: string;
  };
}

interface YaziYorumu {
  id: number;
  icerik: string;
  olusturulma_tarihi: string;
  kullanici_id: number;
  kullanicilar?: {
    kullanici_adi: string;
    image: string;
  };
}

const YaziDetay = () => {
  const { id } = useParams<{ id: string }>();

  const [yazi, setYazi] = useState<Yazi | null>(null);
  const [yükleniyor, setYükleniyor] = useState(true);


  const [kullanici, setKullanici] = useState<any>(null);


  const [begeniSayisi, setBegeniSayisi] = useState(0);
  const [begendim, setBegendim] = useState(false);


  const [yorumlar, setYorumlar] = useState<YaziYorumu[]>([]);
  const [yeniYorum, setYeniYorum] = useState("");

  useEffect(() => {
    const userStr = localStorage.getItem("user");

    if (userStr) {
      setKullanici(JSON.parse(userStr));
    }
  }, []);

  useEffect(() => {
    if (!id) return;

    const goruntulemeArttir = async () => {
      const { error } = await supabase.rpc('goruntuleme_arttir', {
        yazi_id: Number(id)
      });

      if (error) console.error("Görüntüleme artırma hatası:", error);
    };

    goruntulemeArttir();
  }, [id]);


  useEffect(() => {

    const verileriGetir = async () => {

      const { data: yaziVerisi } = await supabase
        .from("yazilar")
        .select("*,yazarlar(ad_soyad,profil_resmi_url),kategoriler(slug),kod_editor")
        .eq("id", Number(id))
        .single();
      setYazi(yaziVerisi);


      const { count } = await supabase
        .from("begeniler")
        .select("*", { count: "exact", head: true })
        .eq("yazi_id", Number(id));
      setBegeniSayisi(count || 0);


      if (kullanici) {
        const { data: benBegendimMi } = await supabase
          .from("begeniler")
          .select("*")
          .eq("yazi_id", Number(id))
          .eq("kullanici_id", kullanici.id)
          .maybeSingle();

        setBegendim(!!benBegendimMi);
      }




      const { data: yorumVerisi, error: yorumError } = await supabase
        .from("yorumlar")
        .select("*, kullanicilar(*)")
        .eq("yazi_id", Number(id))
        .order("olusturulma_tarihi", { ascending: false });

      console.log("YORUMLAR:", yorumVerisi);

      if (yorumError) {
        console.error("Yorum çekme hatası:", yorumError);
        setYorumlar([]);
      } else {

        setYorumlar((Array.isArray(yorumVerisi) ? yorumVerisi : []) as YaziYorumu[]);
      }




      setYükleniyor(false);
    };

    verileriGetir();
  }, [id, kullanici?.id]);




  useEffect(() => {
    const kanal = supabase
      .channel("realtime-yazi")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "yorumlar" },
        () => {
          supabase
            .from("yorumlar")
            .select("*, kullanicilar(kullanici_adi, image)")
            .eq("yazi_id", Number(id))
            .order("olusturulma_tarihi", { ascending: false })
            .then((res) => {
              if (res.error) {
                console.error("Realtime yorum fetch error:", res.error);
                setYorumlar([]);
              } else {
                setYorumlar((Array.isArray(res.data) ? res.data : []) as YaziYorumu[]);
              }
            });
        }
      )

      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "begeniler" },
        async () => {
          const { count } = await supabase
            .from("begeniler")
            .select("*", { count: "exact", head: true })
            .eq("yazi_id", Number(id));
          setBegeniSayisi(count || 0);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(kanal);
    };
  }, [id]);


  const begeniDegistir = async () => {
    if (!kullanici) {
      alert("Beğenmek için giriş yapmalısınız.");
      return;
    }
    const yeniDurum = !begendim;
    setBegendim(yeniDurum);

    setBegeniSayisi((prev) => prev + (yeniDurum ? 1 : -1));
    if (yeniDurum) {
      const { error } = await supabase.from("begeniler").insert([
        { yazi_id: Number(id), kullanici_id: kullanici.id },
      ]);
      if (error) {
        setBegendim(!yeniDurum)
        setBegeniSayisi((prev) => prev - 1);
      }
    }
    else {

      const { error } = await supabase
        .from("begeniler")
        .delete()
        .eq("yazi_id", Number(id))
        .eq("kullanici_id", kullanici.id);

      if (error) {
        setBegendim(!yeniDurum);
        setBegeniSayisi((prev) => prev + 1);
      }
    }

  };



  const yorumEkle = async () => {
    if (!kullanici) {
      alert("Yorum yapmak için giriş yapmalısınız.");
      return;
    }
    if (!yeniYorum.trim()) return;


    const { data, error } = await supabase
      .from("yorumlar")
      .insert([
        {
          yazi_id: Number(id),
          icerik: yeniYorum,
          kullanici_id: kullanici.id,
        },
      ])
      .select("*, kullanicilar(kullanici_adi, image)")
      .single();

    if (error) {
      console.error("Yorum hatası:", error);
      alert("Yorum gönderilemedi.");
    } else if (data) {

      const eklenecekYorum: YaziYorumu = {
        ...data,
        kullanicilar: data.kullanicilar || {
          kullanici_adi: kullanici.kullanici_adi,
          image: kullanici.image || ""
        }
      };

      setYorumlar([eklenecekYorum, ...yorumlar]);
      setYeniYorum("");
    }

  };




  if (yükleniyor) return <p>Yükleniyor...</p>;
  if (!yazi) return <p>Yazı bulunamadı.</p>;



  return (
    <div className="min-h-screen bg-[#fdf8f4] pb-20 font-sans">


      <div className="pt-28 container mx-auto px-4 max-w-4xl">
        <Link to={yazi.kategoriler?.slug ? `/category/${yazi.kategoriler?.slug}` : "/categories"}>
          <Button variant="ghost" size="sm" className="hover:bg-orange-100 hover:text-orange-600 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kategoriye Dön
          </Button>
        </Link>
      </div>


      <article className="container mx-auto px-4 max-w-4xl mt-8">


        <div className="text-center space-y-4 mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            {yazi.baslik}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-4 text-gray-500 text-sm md:text-base">
            <div className="flex items-center gap-2">
              {yazi.yazarlar?.profil_resmi_url ? (
                <img
                  src={yazi.yazarlar.profil_resmi_url}
                  alt={yazi.yazarlar.ad_soyad}
                  className="w-8 h-8 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="bg-orange-100 p-1.5 rounded-full">
                  <User size={16} className="text-orange-600" />
                </div>
              )}
              <span className="font-medium text-gray-700">
                {yazi.yazarlar?.ad_soyad || "Anonim"}
              </span>
            </div>
            <span className="hidden md:block text-gray-300">•</span>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{new Date(yazi.olusturulma_tarihi).toLocaleDateString("tr-TR")}</span>
            </div>

          </div>
        </div>


        {yazi.image_url && (
          <div className="relative w-full mb-12 group">
            <div className="absolute inset-0 bg-orange-200 blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
            <img
              src={yazi.image_url}
              alt={yazi.baslik}
              className="relative w-full max-h-[500px] object-cover rounded-2xl shadow-2xl border border-gray-100"
            />
          </div>
        )}


        <div className="prose prose-lg prose-orange max-w-none text-gray-700 leading-8 whitespace-pre-line">
          {yazi.icerik}
        </div>
        {yazi.kod_editor && (
          <div className="mt-10">
            <h3 className="text-2xl font-bold mb-4">👨‍💻 Canlı Örnek</h3>
            <p className="text-gray-600 mb-4">Aşağıdaki kod üzerinde değişiklik yapabilirsin, sonuç anında sağ tarafa yansıyacaktır.</p>
            <Kod kod={yazi.kod_editor} />
          </div>
        )}


        <div className="mt-16 pt-8 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={begeniDegistir}
              className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 transform active:scale-95 ${begendim
                  ? "bg-red-50 text-red-600 shadow-md border border-red-100"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
            >
              <Heart className={begendim ? "fill-current" : ""} size={20} />
              <span className="font-bold">{begeniSayisi}</span>
              <span className="text-sm font-normal">Kişi beğendi</span>
            </button>
          </div>


        </div>
      </article>


      <div className="container mx-auto px-4 max-w-3xl mt-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-orange-100 p-2 rounded-lg">
            <MessageCircle className="text-orange-600" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Yorumlar <span className="text-gray-400 font-normal text-lg">({yorumlar.length})</span>
          </h2>
        </div>


        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-10">
          <textarea
            className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-orange-100 transition-all resize-none text-gray-700 placeholder:text-gray-400"
            rows={4}
            placeholder="Bu yazı hakkında ne düşünüyorsun?"
            value={yeniYorum}
            onChange={(e) => setYeniYorum(e.target.value)}
          />
          <div className="flex justify-end mt-4">
            <button
              className="px-8 py-2.5 bg-gray-900 hover:bg-orange-600 text-white rounded-full font-medium transition-colors duration-300 shadow-lg shadow-gray-200"
              onClick={yorumEkle}
            >
              Yorumu Gönder
            </button>
          </div>
        </div>


        <div className="space-y-6">
          {yorumlar.map((yrm) => (
            <div
              key={yrm.id}
              className="group p-6 bg-white border border-gray-100 hover:border-orange-100 rounded-2xl hover:shadow-md transition-all duration-300 flex gap-4"
            >
              <img
                src={yrm.kullanicilar?.image || "https://ui-avatars.com/api/?name=" + (yrm.kullanicilar?.kullanici_adi || "User")}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                alt="Avatar"
              />

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-gray-900">
                    {yrm.kullanicilar?.kullanici_adi || "Misafir Kullanıcı"}
                  </h4>
                  <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                    {new Date(yrm.olusturulma_tarihi).toLocaleDateString("tr-TR")}
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                  {yrm.icerik}
                </p>
              </div>
            </div>
          ))}

          {yorumlar.length === 0 && (
            <div className="text-center py-10 text-gray-400 bg-white rounded-2xl border border-dashed">
              <p>Henüz yorum yapılmamış. İlk yorumu sen yap! 🚀</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );



};

export default YaziDetay;
