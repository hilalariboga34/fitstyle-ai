"""
Kullanıcı metinlerinden stil ve tür etiketlerini çıkaran modül.
Bu modül, kombin_generator.py'deki fonksiyonları kullanarak
kullanıcı isteklerini analiz eder.
"""

from .kombin_generator import generate_kombin_recipe
from .kombin_rules import ANAHTAR_KELİMELER, KOMBİN_KURALLARI, KATEGORILER, RENK_UYUMU_KURALLARI

def analyze_prompt_intent(text: str) -> dict:
    """
    Kullanıcı metninden stil ve tür etiketlerini çıkarır.
    
    Args:
        text (str): Analiz edilecek kullanıcı metni
        
    Returns:
        dict: Çıkarılan etiketler ve analiz sonuçları
        {
            'style': [stil_etiketleri],
            'type': [tür_etiketleri], 
            'material': [malzeme_etiketleri],
            'color': [renk_etiketleri],
            'message': str
        }
    """
    # Kullanıcı metnini analiz et
    intent_result = generate_kombin_recipe(
        cumle=text,
        anahtar_kelimeler_dict=ANAHTAR_KELİMELER,
        kombin_kurallari_dict=KOMBİN_KURALLARI,
        kategoriler_dict=KATEGORILER,
        renk_uyumu_dict=RENK_UYUMU_KURALLARI,
        cinsiyet="kadin"  # Varsayılan olarak kadın
    )
    
    return intent_result 