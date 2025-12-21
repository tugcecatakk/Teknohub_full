import React, { useEffect, useState } from 'react'
import { Heart, MessageCircle, ArrowRight, User, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "./cardd";
import { supabase } from "../supabase";
interface SonYazilarProps {
    id: number;
    baslik: string;
    icerik: string;
    image_url: string;
    begeni_sayisi: number;
    yorum_sayisi?: number;
    olusturulma_tarihi: string;
    kategori_id: number;
    yazarlar?: {
        ad_soyad: string;
        profil_resmi_url?: string;
    } | null;
}

interface SonYazilarComponentProps {
    kategoriId?: number | null;
}

const SonYazilar = ({ kategoriId }: SonYazilarComponentProps) => {

const [yazilar,setYazilar]=useState<SonYazilarProps[]>([]);
const [kullanici, setKullanici] = useState<any>(null);
const [begeniYukleniyor, setBegeniYukleniyor] = useState<number | null>(null);
const [loading, setLoading] = useState(true);

useEffect(()=>{
    setLoading(true);
    const userStr = localStorage.getItem('user');
    if (userStr) {
        setKullanici(JSON.parse(userStr));
    }
    
    const fetchYazilar = async () => {
        try {
            let query = supabase
                .from("yazilar")
                .select("*,yazarlar(ad_soyad,profil_resmi_url)");
                
            if (kategoriId) {
                query = query.eq("kategori_id", kategoriId);
            }
            
            const { data, error } = await query.order("olusturulma_tarihi", { ascending: false });
            
            if (error) throw error;
            setYazilar(data || []);
        } catch (err: any) {
            console.error('İçerikler çekilirken hata oluştu:', err);
        } finally {
            setLoading(false);
        }
    };
    
    fetchYazilar();
}, [kategoriId]); 

const handleBegeni = async (yaziId: number) => {
    if (!kullanici) {
        alert('🔒 Beğenmek için giriş yapmalısınız!');
        return;
    }
    
    setBegeniYukleniyor(yaziId);
    
    try {
        const response = await fetch(`http://localhost:3001/api/begeni/${yaziId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                kullanici_id: kullanici.id
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            setYazilar(prev => 
                prev.map(yazi => 
                    yazi.id === yaziId 
                        ? { ...yazi, begeni_sayisi: result.begeni_sayisi }
                        : yazi
                )
            );
        } else {
            alert('Beğeni eklenirken hata oluştu: ' + result.error);
        }
    } catch (error) {
        console.error('Beğeni hatası:', error);
        alert('Beğeni eklenirken hata oluştu!');
    } finally {
        setBegeniYukleniyor(null);
    }
};

const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

  return (
    <div className="container mx-auto px-4 py-8">
        {loading ? (
            <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
                <p className="text-gray-600">İçerikler yükleniyor...</p>
            </div>
        ) : yazilar.length === 0 ? (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">
                    Bu kategoriye uygun yazı bulunamadı
                </h3>
                <p className="text-gray-500">
                    Henüz bu kategoride yayınlanmış bir içerik bulunmamaktadır.
                </p>
            </div>
        ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {yazilar.slice(0, 3).map((yazi, index) => (
                <Link key={yazi.id} to={`/yazi/${yazi.id}`}>
                    <Card
                        className="h-full flex flex-col glass-card group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 overflow-hidden animate-fade-in border border-gray-100"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        {/* Image Section */}
                        <div className="relative overflow-hidden h-48">
                            <img
                                src={yazi.image_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=600&fit=crop"}
                                alt={yazi.baslik}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => {
                                    console.log('Resim yükleme hatası:', yazi.image_url);
                                    e.currentTarget.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=600&fit=crop";
                                }}
                            />
                        </div>

                        {/* Content Section */}
                        <CardContent className="p-5 flex flex-col flex-grow space-y-4">
                            {/* Title and Content */}
                            <div className="space-y-2 flex-grow">
                                <h4 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                                    {yazi.baslik}
                                </h4>
                                <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                                    {yazi.icerik}
                                </p>
                            </div>

                            {/* Author Section */}
                            <div className="flex items-center gap-3 pt-2">
                                {yazi.yazarlar?.profil_resmi_url ? (
                                    <img
                                        src={yazi.yazarlar.profil_resmi_url}
                                        alt={yazi.yazarlar.ad_soyad}
                                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                                        <User size={20} />
                                    </div>
                                )}
                                
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-gray-800">
                                        {yazi.yazarlar?.ad_soyad || 'Anonim'}
                                    </span>
                                    <div className="flex items-center text-xs text-gray-500 gap-1">
                                        <Calendar size={12} />
                                        <span>{formatDate(yazi.olusturulma_tarihi)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Interaction Section */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                                <div className="flex items-center gap-4 text-gray-500 text-sm">
                                    <div 
                                        className="flex items-center gap-1.5 hover:text-red-500 transition-colors cursor-pointer"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleBegeni(yazi.id);
                                        }}
                                    >
                                        <Heart size={16} />
                                        <span>{yazi.begeni_sayisi || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
                                        <MessageCircle size={16} />
                                        <span>{yazi.yorum_sayisi || 0}</span>
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
        )}
    </div>
  )
}

export default SonYazilar;
