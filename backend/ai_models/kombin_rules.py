# Bu hücre, kombin_rules.py dosyasını simüle ediyor.
import re

# Cinsiyete göre ayrılmış kombin kuralları
KOMBİN_KURALLARI = {
    "kadin": {
        "ofis": {"ana_parcalar": ["kumaş pantolon", "bluz", "blazer ceket"], "aksesuarlar": ["topuklu ayakkabı", "çanta", "saat"]},
        "spor": {"ana_parcalar": ["tayt", "sweatshirt", "tişört"], "aksesuarlar": ["spor ayakkabı", "sırt çantası", "şapka"]},
        "sokak stili": {"ana_parcalar": ["kargo pantolon", "hoodie", "bomber ceket"], "aksesuarlar": ["sneaker", "bere"]},
        "günlük": {"ana_parcalar": ["jean", "tişört", "hırka"], "aksesuarlar": ["sneaker", "çanta"]},
        "vintage": {"ana_parcalar": ["midi etek", "bluz", "hırka"], "aksesuarlar": ["topuklu ayakkabı", "çanta", "şapka"]},
        "casual": {"ana_parcalar": ["jean", "tişört", "sneaker"], "aksesuarlar": ["çanta", "şapka"]},
        "elegant": {"ana_parcalar": ["elbise", "ceket", "topuklu ayakkabı"], "aksesuarlar": ["çanta", "takı"]}
    },
    "erkek": {
        "ofis": {"ana_parcalar": ["kumaş pantolon", "gömlek", "blazer ceket"], "aksesuarlar": ["klasik ayakkabı", "deri kemer", "saat"]},
        "spor": {"ana_parcalar": ["eşofman altı", "sweatshirt", "tişört"], "aksesuarlar": ["spor ayakkabı", "sırt çantası", "şapka"]},
        "sokak stili": {"ana_parcalar": ["kargo pantolon", "hoodie", "oversize tişört"], "aksesuarlar": ["sneaker", "bere"]},
        "günlük": {"ana_parcalar": ["jean", "polo yaka tişört", "gömlek"], "aksesuarlar": ["sneaker", "saat"]}
    }
}

# Renk uyum kuralları
RENK_UYUMU_KURALLARI = {
    "siyah": ["beyaz", "krem", "gri", "kırmızı", "bordo"], "beyaz": ["siyah", "mavi", "bej", "pembe", "yeşil"],
    "gri": ["siyah", "beyaz", "lacivert", "pembe", "bordo"], "mavi": ["beyaz", "bej", "gri", "kahverengi"],
    "yeşil": ["krem", "kahverengi", "siyah", "beyaz"], "kırmızı": ["siyah", "beyaz", "gri", "bej"]
}

# Kıyafet Kategorileri (GÜNCELLENDİ)
KATEGORILER = {
    "ust_giyim": ['tişört', 'gömlek', 'bluz', 'kazak', 'sweatshirt', 'hoodie', 'atlet', 'body', 'büstiyer', 'crop top', 'crop bluz'],
    "alt_giyim": ['pantolon', 'jean', 'etek', 'şort', 'tayt', 'kargo pantolon', 'midi etek', 'mini etek'],
    "dis_giyim": ['ceket', 'mont', 'kaban', 'blazer', 'trençkot', 'hırka', 'yelek'],
    "tek_parca": ['elbise', 'tulum', 'abiye', 'takım elbise'], # "takım elbise" burada yer alıyor.
    "ayakkabi": ['ayakkabı', 'spor ayakkabı', 'sneaker', 'bot', 'çizme', 'topuklu ayakkabı', 'sandalet'],
    "aksesuar": ['çanta', 'sırt çantası', 'kemer', 'şapka', 'gözlük', 'takı']
}
    
ANAHTAR_KELİMELER = {
    'stiller': ['rahat', 'şık', 'spor', 'ofis', 'günlük', 'klasik', 'sokak stili', 'bohem', 'elegant', 'vintage', 'casual', 'minimalist', 'modern', 'romantik', 'rock', 'preppy', 'girly', 'androgynous'],
    'turler': [tur for kategori in KATEGORILER.values() for tur in kategori] + ['kombin'],
    'malzemeler': ['deri', 'kadife', 'kot', 'saten', 'yün', 'keten'],
    'renkler': ['siyah', 'beyaz', 'gri', 'mavi', 'yeşil', 'kırmızı', 'pembe', 'bordo', 'bej', 'krem', 'kahverengi'],
    'belirsiz_ifadeler': ['bir şey', 'bir şeyler', 'bir kıyafet', 'ne giysem'],
    'kombin_sorulari': ['ile ne giyebilirim', 'ile ne giyilir', 'nasıl kombinlenir', 'nasıl kombinlerim']
}
