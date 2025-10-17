"use strict";
// =======================================================
//          ÖZEL HATA AYIKLAMA KODU
// =======================================================
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
async function startServer() {
    try {
        console.log('[1/7] Sunucu başlatılıyor...');
        // Gerekli modülleri try bloğu içinde import edelim
        const express = (await Promise.resolve().then(() => __importStar(require('express')))).default;
        const cors = (await Promise.resolve().then(() => __importStar(require('cors')))).default;
        const { createClient } = await Promise.resolve().then(() => __importStar(require('@supabase/supabase-js')));
        const dotenv = (await Promise.resolve().then(() => __importStar(require('dotenv')))).default;
        console.log('[2/7] Modüller yüklendi.');
        dotenv.config();
        console.log('[3/7] .env dosyası okundu.');
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_ANON_KEY;
        if (!supabaseUrl || !supabaseKey) {
            throw new Error('.env dosyasındaki Supabase URL veya Key bulunamadı!');
        }
        console.log('[4/7] .env değişkenleri doğrulandı.');
        const supabase = createClient(supabaseUrl, supabaseKey);
        console.log('[5/7] Supabase istemcisi başarıyla oluşturuldu.');
        const app = express();
        const port = 5000;
        app.use(cors());
        app.get('/api/kategoriler', async (req, res) => {
            const { data, error } = await supabase
                .from('kategoriler')
                .select('*');
            if (error) {
                // Hata varsa, hatayı terminale yaz ve istemciye gönder
                console.error('Supabase Sorgu Hatası:', error);
                return res.status(500).json({ message: 'Sorgu sırasında hata oluştu', error });
            }
            // Her şey yolundaysa veriyi gönder
            return res.json(data);
        });
        console.log('[6/7] API endpoint tanımlandı.');
        app.listen(port, () => {
            console.log(`[7/7] ✅ SUNUCU AKTİF! http://localhost:${port} adresini dinliyor. Kapanmaması gerekiyor.`);
        });
    }
    catch (error) {
        // EĞER HERHANGİ BİR YERDE HATA OLURSA, BURASI ÇALIŞACAK!
        console.error('❌❌❌ BEKLENMEYEN KRİTİK HATA! ❌❌❌');
        if (error instanceof Error) {
            console.error('Hata Mesajı:', error.message);
            console.error('Hata Detayı:', error.stack);
        }
        else {
            console.error('Bilinmeyen bir hata oluştu:', error);
        }
        process.exit(1); // Programı hata koduyla sonlandır
    }
}
// Ana fonksiyonu çalıştır
startServer();
