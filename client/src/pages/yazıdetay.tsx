import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabase";
import { Card, CardContent } from "../components/cardd";
import { Button } from "../components/buton";

interface Yazı{
    id: number;
    baslik:string;
    icerik:string;
    image_url?:string;
    olusturulma_tarihi:string;

}
const YazıDetay = ()=>{
    const [yazı,setYazi]=useState<Yazı | null>(null);
    const {id}=useParams<{id:string}>();
    const [loading,setLoading]=useState(true);

    useEffect(()=>{
        const fetchYazılar=async()=>{
            try{
                const {data,error}=await supabase
                .from("yazilar")
                .select("*")
                .eq("id",Number(id))
                .single();
                if(error) throw error;
                setYazi(data);
            }catch(err:any){
                console.error(err.message);
            }finally{
                setLoading(false);


    }
};
fetchYazılar();
    },[id]);

    if(loading) return <p>Yükleniyor...</p>;
    if(!yazı) return <p>Yazı bulunamadı.</p>;

    return (
    <div className="container mx-auto px-4 py-12">
        <div className="pt-24"></div>
      <h1 className="text-4xl font-bold mb-6">{yazı.baslik}</h1>
      {yazı.image_url&& (
        <img
          src={yazı.image_url}
          alt={yazı.baslik}
          className="w-full max-h-96 object-cover mb-6 rounded"
        />
      )}
      <p className="text-lg text-muted-foreground whitespace-pre-line">{yazı.icerik}</p>
    </div>
  );
};
export default YazıDetay;
