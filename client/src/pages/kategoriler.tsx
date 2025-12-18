import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";
import { Card, CardContent } from "../components/cardd";
import { Button } from "../components/buton";

import {
  Layout,
  Code,
  Server,
  Inbox,
  Settings,
  Bot,
} from "lucide-react";

const iconMap: any = {
  Layout: Layout,
  Code: Code,
  Server: Server,
  Inbox: Inbox,
  Settings: Settings,
  Bot: Bot,
};

interface Category {
  id: number;
  ad: string;
  slug?: string;
  aciklama?: string;
  image_url?: string;
  renk?: string;
  icon_adı?: string;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("kategoriler")
          .select("*")
          .order("id", { ascending: true });

        if (error) {
          console.error("Supabase hatası:", error.message);
        } else {
          setCategories(data || []);
        }
      } catch (err) {
        console.error("Bağlantı hatası:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary text-xl font-serif">
          Kategoriler Yükleniyor...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-24"></div>
     


      
      <section className="container mx-auto px-4 py-12 md:py-20 text-center space-y-4 animate-fade-in">
        <h2 className="text-4xl md:text-6xl font-serif font-bold">Kategoriler</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          İlgi alanınıza göre içerikleri keşfedin ve favori konularınızı takip edin
        </p>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => {
            const IconComponent =
              iconMap[category.icon_adı || "Layout"] || Layout;

            return (
              <Link key={category.id} to={`/category/${category.slug}`}>
                <Card
                  className="glass-card group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 overflow-hidden h-full animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative overflow-hidden h-48">
                    {category.image_url && (
                      <img
                        src={category.image_url}
                        alt={category.ad}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    )}

                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${category.renk} opacity-60 group-hover:opacity-70 transition-opacity`}
                    />

                   
                    <div className="absolute inset-0 flex items-center justify-center">
                      <IconComponent className="h-16 w-16 text-white" />
                    </div>
                  </div>

                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-serif font-bold group-hover:text-primary transition-colors">
                        {category.ad}
                      </h3>
                    </div>
                    {category.aciklama && (
                      <p className="text-muted-foreground line-clamp-2">
                        {category.aciklama}
                      </p>
                    )}
                 
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full group-hover:text-primary"
                    >
                      Keşfet →
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Categories;
