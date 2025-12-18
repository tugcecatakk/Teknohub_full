import React, { useState } from 'react';
import { Button } from "../components/buton";
import { Card, CardContent } from "../components/cardd";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, CheckCircle, KeyRound } from "lucide-react";
import { supabase } from "../supabase";
import emailjs from '@emailjs/browser';

const SifremiUnuttum = () => {
    const navigate = useNavigate();


    const SERVICE_ID = "service_x5p622w";  
    const TEMPLATE_ID = "template_594hs0d"; 
    const PUBLIC_KEY = "Udi5eIG0x9JJy7PHq";   
    // ----------------------------------------

   
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    
    const [email, setEmail] = useState("");
    const [resetKod, setResetKod] = useState("");
    const [newPassword, setNewPassword] = useState("");

  
    const generateCode = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    // 1. ADIM: KODU ÜRET, KAYDET VE MAİL AT
    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // A. Kullanıcı var mı kontrol et
            const { data: user, error } = await supabase
                .from("kullanicilar")
                .select("id, kullanici_adi")
                .eq("email", email)
                .single();

            if (error || !user) {
                alert("Bu e-posta ile kayıtlı kullanıcı bulunamadı.");
                setLoading(false);
                return;
            }

            // B. 6 Haneli kod üret
            const code = generateCode();

            // C. Kodu veritabanına kaydet (reset_kod sütununa)
            const { error: updateError } = await supabase
                .from("kullanicilar")
                .update({ reset_kod: code })
                .eq("email", email);

            if (updateError) throw updateError;

            // D. EmailJS ile mail gönder
            const templateParams = {
                kullanici_adi: user.kullanici_adi, // Şablondaki {{kullanici_adi}}
                kod: code,                         // Şablondaki {{kod}}
                user_email: email                  // Mailin gideceği adres (EmailJS otomatik algılar genelde ama settings'den "To Email"i bu değişken yapmalısın veya Reply To olarak kullanır)
            };

            // Not: EmailJS template ayarlarında "To Email" kısmına {{user_email}} yazarsan veya
            // send fonksiyonunun 3. parametresi form verisi değilse direkt alıcıyı template içinde tanımlaman gerekebilir.
            // En kolayı: EmailJS Template ayarlarında "To Email" alanına dinamik değişken vermek yerine,
            // send metodunda form referansı kullanmaktır. Ama manuel obje yolluyorsak, EmailJS panelinde "To Email" kısmına {{user_email}} yazmalısın.
            
            await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);

            alert("Doğrulama kodu e-posta adresine gönderildi!");
            setStep(2);

        } catch (error) {
            console.error("Hata:", error);
            alert("Bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setLoading(false);
        }
    };

    // 2. ADIM: KODU DOĞRULA
    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Veritabanındaki kodu çek
            const { data, error } = await supabase
                .from("kullanicilar")
                .select("reset_kod")
                .eq("email", email)
                .single();

            if (error || !data) {
                alert("Hata oluştu.");
                return;
            }

            // Girilen kod ile veritabanındaki kodu karşılaştır
            if (data.reset_kod === resetKod) {
                setStep(3); // Kod doğru, şifre değiştirme ekranına geç
            } else {
                alert("Girdiğiniz kod hatalı!");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // 3. ADIM: ŞİFREYİ GÜNCELLE
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Şifreyi güncelle ve kodu sil (güvenlik için reset_kod null yapılır)
            const { error } = await supabase
                .from("kullanicilar")
                .update({ 
                    sifre: newPassword,
                    reset_kod: null // Kod kullanıldı, artık geçersiz olsun
                })
                .eq("email", email);

            if (error) throw error;

            alert("Şifreniz başarıyla güncellendi! Giriş yapabilirsiniz.");
            navigate("/login");

        } catch (error) {
            console.error(error);
            alert("Şifre güncellenemedi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="absolute inset-0 gradient-primary opacity-10 blur-3xl" />

            <Card className="glass-card w-full max-w-md relative z-10 animate-fade-in">
                <CardContent className="p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-serif font-bold gradient-text mb-2">
                            {step === 1 && "Şifremi Unuttum"}
                            {step === 2 && "Doğrulama Kodu"}
                            {step === 3 && "Yeni Şifre"}
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            {step === 1 && "E-posta adresinize bir doğrulama kodu göndereceğiz."}
                            {step === 2 && `${email} adresine gelen 6 haneli kodu girin.`}
                            {step === 3 && "Yeni şifrenizi belirleyin."}
                        </p>
                    </div>

                    {/* --- STEP 1: EMAIL GİRİŞ --- */}
                    {step === 1 && (
                        <form onSubmit={handleSendCode} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                                        placeholder="ornek@email.com"
                                    />
                                </div>
                            </div>
                            <Button type="submit" disabled={loading} className="w-full gradient-primary">
                                {loading ? "Gönderiliyor..." : "Kod Gönder"}
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        </form>
                    )}

                    {/* --- STEP 2: KOD DOĞRULAMA --- */}
                    {step === 2 && (
                        <form onSubmit={handleVerifyCode} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Doğrulama Kodu</label>
                                <div className="relative">
                                    <KeyRound className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                    <input
                                        type="text"
                                        required
                                        maxLength={6}
                                        value={resetKod}
                                        onChange={(e) => setResetKod(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground tracking-widest font-bold"
                                        placeholder="123456"
                                    />
                                </div>
                            </div>
                            <Button type="submit" disabled={loading} className="w-full gradient-primary">
                                {loading ? "Kontrol Ediliyor..." : "Doğrula"}
                                <CheckCircle className="h-4 w-4 ml-2" />
                            </Button>
                            <button 
                                type="button" 
                                onClick={() => setStep(1)} 
                                className="text-xs text-center w-full text-gray-500 hover:text-primary"
                            >
                                E-postayı yanlış mı girdiniz?
                            </button>
                        </form>
                    )}

                    {/* --- STEP 3: YENİ ŞİFRE --- */}
                    {step === 3 && (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Yeni Şifre</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                    <input
                                        type="password"
                                        required
                                        minLength={6}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                                        placeholder="******"
                                    />
                                </div>
                            </div>
                            <Button type="submit" disabled={loading} className="w-full gradient-primary">
                                {loading ? "Güncelleniyor..." : "Şifreyi Değiştir"}
                                <CheckCircle className="h-4 w-4 ml-2" />
                            </Button>
                        </form>
                    )}

                    <div className="text-center mt-6">
                        <Link to="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            ← Giriş ekranına dön
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SifremiUnuttum;