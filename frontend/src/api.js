export async function fetchProducts() {
  // Mock data kullanılıyor (backend çalışmadığı için)
  console.log("Mock data kullanılıyor...");
  return [
    {
      id: 1,
      name: "Klasik Beyaz Gömlek",
      description: "Klasik kesim beyaz gömlek, ofis ve günlük kullanım için ideal",
      price: 150.0,
      category: "Gömlek",
      image_url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop"
    },
    {
      id: 2,
      name: "Siyah Kot Pantolon",
      description: "Rahat kesim siyah kot pantolon, her türlü kombin için uygun",
      price: 200.0,
      category: "Pantolon",
      image_url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop"
    },
    {
      id: 3,
      name: "Mavi Blazer Ceket",
      description: "Şık mavi blazer ceket, resmi ve yarı resmi ortamlar için",
      price: 350.0,
      category: "Ceket",
      image_url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop"
    },
    {
      id: 4,
      name: "Kırmızı Elbise",
      description: "Göz alıcı kırmızı elbise, özel günler için mükemmel",
      price: 280.0,
      category: "Elbise",
      image_url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop"
    },
    {
      id: 5,
      name: "Gri Triko Kazak",
      description: "Sıcak ve şık gri triko kazak, kış ayları için ideal",
      price: 120.0,
      category: "Kazak",
      image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop"
    },
    {
      id: 6,
      name: "Bej Deri Ceket",
      description: "Vintage tarz bej deri ceket, casual kombinler için",
      price: 450.0,
      category: "Ceket",
      image_url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop"
    },
    {
      id: 7,
      name: "Siyah Mini Etek",
      description: "Klasik siyah mini etek, her yaş grubu için uygun",
      price: 180.0,
      category: "Etek",
      image_url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop"
    },
    {
      id: 8,
      name: "Beyaz Sneaker",
      description: "Rahat ve şık beyaz sneaker, günlük kullanım için",
      price: 220.0,
      category: "Ayakkabı",
      image_url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop"
    },
    {
      id: 9,
      name: "Mavi Gömlek",
      description: "Açık mavi gömlek, ofis ve günlük kombinler için",
      price: 140.0,
      category: "Gömlek",
      image_url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop"
    },
    {
      id: 10,
      name: "Siyah Deri Çanta",
      description: "Elegant siyah deri çanta, her kombinle uyumlu",
      price: 320.0,
      category: "Çanta",
      image_url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop"
    },
    {
      id: 11,
      name: "Pembe Bluz",
      description: "Pastel pembe bluz, bahar ayları için ideal",
      price: 95.0,
      category: "Bluz",
      image_url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop"
    },
    {
      id: 12,
      name: "Kahverengi Deri Ayakkabı",
      description: "Klasik kahverengi deri ayakkabı, resmi ortamlar için",
      price: 280.0,
      category: "Ayakkabı",
      image_url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop"
    },
    {
      id: 13,
      name: "Siyah Triko Hırka",
      description: "Sıcak siyah triko hırka, soğuk havalar için",
      price: 160.0,
      category: "Hırka",
      image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop"
    },
    {
      id: 14,
      name: "Beyaz Elbise",
      description: "Minimalist beyaz elbise, yaz ayları için ideal",
      price: 240.0,
      category: "Elbise",
      image_url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop"
    },
    {
      id: 15,
      name: "Gri Pantolon",
      description: "Slim fit gri pantolon, ofis kombinleri için",
      price: 190.0,
      category: "Pantolon",
      image_url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop"
    },
    {
      id: 16,
      name: "Kırmızı Triko Kazak",
      description: "Canlı kırmızı triko kazak, kış ayları için",
      price: 110.0,
      category: "Kazak",
      image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop"
    },
    {
      id: 17,
      name: "Siyah Crop Top",
      description: "Modern siyah crop top, yaz kombinleri için",
      price: 85.0,
      category: "Üst Giyim",
      image_url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop"
    },
    {
      id: 18,
      name: "Mavi Kot Şort",
      description: "Rahat mavi kot şort, yaz ayları için ideal",
      price: 130.0,
      category: "Şort",
      image_url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop"
    },
    {
      id: 19,
      name: "Pembe Triko Hırka",
      description: "Pastel pembe triko hırka, bahar ayları için",
      price: 170.0,
      category: "Hırka",
      image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop"
    },
    {
      id: 20,
      name: "Siyah Platform Ayakkabı",
      description: "Şık siyah platform ayakkabı, özel günler için",
      price: 290.0,
      category: "Ayakkabı",
      image_url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop"
    },
    {
      id: 21,
      name: "Beyaz Crop Bluz",
      description: "Minimalist beyaz crop bluz, günlük kullanım için",
      price: 75.0,
      category: "Bluz",
      image_url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop"
    },
    {
      id: 22,
      name: "Kahverengi Deri Ceket",
      description: "Vintage kahverengi deri ceket, rock tarzı kombinler için",
      price: 520.0,
      category: "Ceket",
      image_url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop"
    },
    {
      id: 23,
      name: "Mavi Midi Etek",
      description: "Elegant mavi midi etek, ofis kombinleri için",
      price: 210.0,
      category: "Etek",
      image_url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop"
    },
    {
      id: 24,
      name: "Siyah Crop Pantolon",
      description: "Modern siyah crop pantolon, yaz kombinleri için",
      price: 180.0,
      category: "Pantolon",
      image_url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop"
    },
    {
      id: 25,
      name: "Beyaz Triko Kazak",
      description: "Temiz beyaz triko kazak, her kombinle uyumlu",
      price: 100.0,
      category: "Kazak",
      image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop"
    },
    {
      id: 26,
      name: "Kırmızı Deri Çanta",
      description: "Göz alıcı kırmızı deri çanta, özel günler için",
      price: 380.0,
      category: "Çanta",
      image_url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop"
    },
    {
      id: 27,
      name: "Gri Crop Top",
      description: "Şık gri crop top, günlük kombinler için",
      price: 70.0,
      category: "Üst Giyim",
      image_url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop"
    },
    {
      id: 28,
      name: "Siyah Midi Elbise",
      description: "Klasik siyah midi elbise, her ortam için uygun",
      price: 320.0,
      category: "Elbise",
      image_url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop"
    },
    {
      id: 29,
      name: "Mavi Triko Hırka",
      description: "Sıcak mavi triko hırka, kış ayları için",
      price: 150.0,
      category: "Hırka",
      image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop"
    },
    {
      id: 30,
      name: "Beyaz Platform Sneaker",
      description: "Modern beyaz platform sneaker, günlük kullanım için",
      price: 250.0,
      category: "Ayakkabı",
      image_url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop"
    },
    {
      id: 31,
      name: "Pembe Crop Bluz",
      description: "Pastel pembe crop bluz, bahar ayları için",
      price: 80.0,
      category: "Bluz",
      image_url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop"
    },
    {
      id: 32,
      name: "Siyah Deri Ceket",
      description: "Klasik siyah deri ceket, her tarzla uyumlu",
      price: 480.0,
      category: "Ceket",
      image_url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop"
    },
    {
      id: 33,
      name: "Beyaz Midi Etek",
      description: "Minimalist beyaz midi etek, yaz kombinleri için",
      price: 190.0,
      category: "Etek",
      image_url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop"
    },
    {
      id: 34,
      name: "Gri Crop Pantolon",
      description: "Modern gri crop pantolon, günlük kullanım için",
      price: 170.0,
      category: "Pantolon",
      image_url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop"
    },
    {
      id: 35,
      name: "Kırmızı Crop Top",
      description: "Canlı kırmızı crop top, özel günler için",
      price: 90.0,
      category: "Üst Giyim",
      image_url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop"
    },
    {
      id: 36,
      name: "Siyah Triko Hırka",
      description: "Sıcak siyah triko hırka, kış ayları için",
      price: 160.0,
      category: "Hırka",
      image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop"
    },
    {
      id: 37,
      name: "Beyaz Crop Top",
      description: "Temiz beyaz crop top, yaz kombinleri için",
      price: 65.0,
      category: "Üst Giyim",
      image_url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop"
    },
    {
      id: 38,
      name: "Siyah Kot Şort",
      description: "Klasik siyah kot şort, yaz ayları için",
      price: 140.0,
      category: "Şort",
      image_url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop"
    },
    {
      id: 39,
      name: "Mavi Crop Bluz",
      description: "Açık mavi crop bluz, günlük kullanım için",
      price: 85.0,
      category: "Bluz",
      image_url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop"
    },
    {
      id: 40,
      name: "Kahverengi Midi Etek",
      description: "Elegant kahverengi midi etek, ofis kombinleri için",
      price: 230.0,
      category: "Etek",
      image_url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop"
    },
    {
      id: 41,
      name: "Beyaz Crop Pantolon",
      description: "Minimalist beyaz crop pantolon, yaz kombinleri için",
      price: 200.0,
      category: "Pantolon",
      image_url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop"
    },
    {
      id: 42,
      name: "Kırmızı Triko Hırka",
      description: "Canlı kırmızı triko hırka, kış ayları için",
      price: 180.0,
      category: "Hırka",
      image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop"
    },
    {
      id: 43,
      name: "Siyah Platform Ayakkabı",
      description: "Şık siyah platform ayakkabı, özel günler için",
      price: 310.0,
      category: "Ayakkabı",
      image_url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop"
    },
    {
      id: 44,
      name: "Pembe Midi Elbise",
      description: "Pastel pembe midi elbise, bahar ayları için",
      price: 260.0,
      category: "Elbise",
      image_url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop"
    },
    {
      id: 45,
      name: "Gri Deri Çanta",
      description: "Elegant gri deri çanta, her kombinle uyumlu",
      price: 340.0,
      category: "Çanta",
      image_url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop"
    },
    {
      id: 46,
      name: "Mavi Crop Top",
      description: "Açık mavi crop top, yaz kombinleri için",
      price: 75.0,
      category: "Üst Giyim",
      image_url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop"
    },
    {
      id: 47,
      name: "Siyah Midi Etek",
      description: "Klasik siyah midi etek, her ortam için uygun",
      price: 220.0,
      category: "Etek",
      image_url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop"
    },
    {
      id: 48,
      name: "Beyaz Triko Hırka",
      description: "Temiz beyaz triko hırka, kış ayları için",
      price: 170.0,
      category: "Hırka",
      image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop"
    },
    {
      id: 49,
      name: "Kahverengi Platform Sneaker",
      description: "Vintage kahverengi platform sneaker, günlük kullanım için",
      price: 270.0,
      category: "Ayakkabı",
      image_url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop"
    },
    {
      id: 50,
      name: "Mavi Midi Elbise",
      description: "Elegant mavi midi elbise, özel günler için",
      price: 300.0,
      category: "Elbise",
      image_url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop"
    },
    {
      id: 51,
      name: "Siyah Crop Bluz",
      description: "Modern siyah crop bluz, günlük kullanım için",
      price: 90.0,
      category: "Bluz",
      image_url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop"
    },
    {
      id: 52,
      name: "Gri Midi Etek",
      description: "Şık gri midi etek, ofis kombinleri için",
      price: 240.0,
      category: "Etek",
      image_url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop"
    },
    {
      id: 53,
      name: "Beyaz Crop Pantolon",
      description: "Minimalist beyaz crop pantolon, yaz kombinleri için",
      price: 210.0,
      category: "Pantolon",
      image_url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop"
    },
    {
      id: 54,
      name: "Kırmızı Platform Ayakkabı",
      description: "Göz alıcı kırmızı platform ayakkabı, özel günler için",
      price: 330.0,
      category: "Ayakkabı",
      image_url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop"
    },
    {
      id: 55,
      name: "Siyah Midi Elbise",
      description: "Klasik siyah midi elbise, her ortam için uygun",
      price: 340.0,
      category: "Elbise",
      image_url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop"
    },
    {
      id: 56,
      name: "Mavi Deri Çanta",
      description: "Elegant mavi deri çanta, her kombinle uyumlu",
      price: 360.0,
      category: "Çanta",
      image_url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop"
    },
    {
      id: 57,
      name: "Pembe Crop Top",
      description: "Pastel pembe crop top, bahar ayları için",
      price: 70.0,
      category: "Üst Giyim",
      image_url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop"
    },
    {
      id: 58,
      name: "Kahverengi Crop Pantolon",
      description: "Vintage kahverengi crop pantolon, günlük kullanım için",
      price: 190.0,
      category: "Pantolon",
      image_url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop"
    },
    {
      id: 59,
      name: "Beyaz Platform Sneaker",
      description: "Temiz beyaz platform sneaker, günlük kullanım için",
      price: 260.0,
      category: "Ayakkabı",
      image_url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop"
    },
    {
      id: 60,
      name: "Gri Midi Elbise",
      description: "Elegant gri midi elbise, ofis kombinleri için",
      price: 280.0,
      category: "Elbise",
      image_url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop"
    }
  ];
} 