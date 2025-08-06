# Bu hücre, kombin_generator.py dosyasını simüle ediyor. (KARARLI ÇÖZÜM)
import re
from TurkishStemmer import TurkishStemmer

stemmer = TurkishStemmer()

def get_category_of_item(item, kategoriler_dict):
    for category, items in kategoriler_dict.items():
        if item in items:
            return category
    return None

def generate_kombin_recipe(cumle, anahtar_kelimeler_dict, kombin_kurallari_dict, kategoriler_dict, renk_uyumu_dict, cinsiyet="kadin"):
    clean_cumle = re.sub(r'[^ -ÿ\w\s]', '', cumle.lower())
    
    niyet = {'style': [], 'type': [], 'material': [], 'color': []}

    # --- Alakasızlık kontrolü ---
    moda_kelimeleri = anahtar_kelimeler_dict.get('moda_iliskili_kelimeler', [])
    alakasiz_konular = anahtar_kelimeler_dict.get('alakasiz_konular', [])
    alakasiz_soru_kelimeleri = anahtar_kelimeler_dict.get('alakasiz_soru_kelimeleri', [])

    if (not any(moda_kelime in clean_cumle for moda_kelime in moda_kelimeleri)) or \
       (any(alakasiz in clean_cumle for alakasiz in alakasiz_konular) or any(alakasiz_soru in clean_cumle for alakasiz_soru in alakasiz_soru_kelimeleri)):
        niyet['alakasiz'] = True
        niyet['message'] = 'Üzgünüm, ben sadece modaya ait soruları cevaplayabilirim. Modaya ait soruları sorabilirsiniz.'
        return niyet

    # 1. Niyet Tespiti (ÖNCELİKLENDİRİLMİŞ YÖNTEM)
    
    # Adım 1.1: Çok kelimeli türleri öncelikli olarak ara
    # Listeyi en uzundan en kısaya doğru sıralıyoruz ki "takım elbise", "elbise"den önce bulunsun.
    multi_word_turler = sorted([t for t in anahtar_kelimeler_dict['turler'] if ' ' in t], key=len, reverse=True)
    
    temp_cumle = clean_cumle
    for tur in multi_word_turler:
        if tur in temp_cumle:
            niyet['type'].append(tur)
            temp_cumle = temp_cumle.replace(tur, "") # Bulunanı cümleden çıkar ki tekrar bulunmasın

    # Adım 1.2: Geriye kalan cümlede tek kelimeli anahtar kelimeleri kökleriyle ara
    cumle_kelimeleri = temp_cumle.split()
    koklenmis_kelimeler = {stemmer.stem(kelime) for kelime in cumle_kelimeleri}
    
    niyet['style'].extend(list(set([s for s in anahtar_kelimeler_dict['stiller'] if stemmer.stem(s) in koklenmis_kelimeler])))
    niyet['type'].extend(list(set([t for t in anahtar_kelimeler_dict['turler'] if " " not in t and stemmer.stem(t) in koklenmis_kelimeler])))
    niyet['material'].extend(list(set([m for m in anahtar_kelimeler_dict['malzemeler'] if stemmer.stem(m) in koklenmis_kelimeler])))
    niyet['color'].extend(list(set([c for c in anahtar_kelimeler_dict['renkler'] if stemmer.stem(c) in koklenmis_kelimeler])))

    # 2. Kombin Gerekli mi? Karar mekanizması
    kombin_gerekli = False
    ana_parca_ile_kombin = False
    is_kombin_sorusu = any(q in clean_cumle for q in anahtar_kelimeler_dict['kombin_sorulari'])

    if 'kombin' in niyet['type']:
        kombin_gerekli = True
        if len(niyet['type']) > 1:
             niyet['type'].remove('kombin')
             ana_parca_ile_kombin = True
    elif not niyet['type'] and (niyet['style'] or any(b in clean_cumle for b in anahtar_kelimeler_dict['belirsiz_ifadeler'])):
        kombin_gerekli = True
    elif niyet['type'] and is_kombin_sorusu:
        kombin_gerekli = True
        ana_parca_ile_kombin = True

    # 3. Sonucu Oluşturma
    if kombin_gerekli:
        cinsiyet_kurallari = kombin_kurallari_dict.get(cinsiyet, kombin_kurallari_dict['kadin'])
        oncelikli_stil = next((s for s in niyet['style'] if s in cinsiyet_kurallari), "günlük")
        
        kural = cinsiyet_kurallari.get(oncelikli_stil)
        if kural:
            kombin_recetesi = []
            dolu_kategoriler = []
            if ana_parca_ile_kombin:
                for parca_turu in niyet['type']:
                    kombin_recetesi.append({'tur': parca_turu})
                    kategori = get_category_of_item(parca_turu, kategoriler_dict)
                    if kategori:
                        dolu_kategoriler.append(kategori)
            
            renk_onerileri = []
            if niyet['color']:
                ana_renk = niyet['color'][0]
                renk_onerileri = renk_uyumu_dict.get(ana_renk, [])
            
            tamamlayici_parcalar = kural['ana_parcalar'] + kural['aksesuarlar']
            for parca in tamamlayici_parcalar:
                parca_kategorisi = get_category_of_item(parca, kategoriler_dict)
                if parca_kategorisi not in dolu_kategoriler:
                    recete_parcasi = {'tur': parca}
                    if renk_onerileri:
                        recete_parcasi['renk_onerisi'] = renk_onerileri
                    kombin_recetesi.append(recete_parcasi)
                    if parca_kategorisi:
                        dolu_kategoriler.append(parca_kategorisi)
            
            niyet['kombin_recetesi'] = kombin_recetesi
            niyet['message'] = f"'{cinsiyet}' için '{oncelikli_stil}' stiline uygun bir kombin önerisi oluşturdum."
            
    return niyet
