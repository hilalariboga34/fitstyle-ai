import React, { useState } from 'react';
import axios from 'axios';

// Ana sayfadaki mock data'yı buraya ekleyelim (60 ürün)
const mockProducts = [
  {
    id: 1,
    name: "Klasik Beyaz Gömlek",
    description: "Klasik kesim beyaz gömlek, ofis ve günlük kullanım için ideal",
    price: 150.0,
    category: "Gömlek",
    image_url: "https://i.pinimg.com/474x/29/37/56/293756786197dce80c9e2dadfbb63a31.jpg"
  },
  {
    id: 2,
    name: "Siyah Kot Pantolon",
    description: "Rahat kesim siyah kot pantolon, her türlü kombin için uygun",
    price: 200.0,
    category: "Pantolon",
    image_url: "https://d1fufvy4xao6k9.cloudfront.net/feed/img/man_jeans/217871/front.png"
  },
  {
    id: 3,
    name: "Mavi Blazer Ceket",
    description: "Şık mavi blazer ceket, resmi ve yarı resmi ortamlar için",
    price: 350.0,
    category: "Ceket",
    image_url: "https://i.pinimg.com/736x/70/45/64/704564ceb308951c8a2d4de83f8eda9c.jpg"
  },
  {
    id: 4,
    name: "Kırmızı Elbise",
    description: "Göz alıcı kırmızı elbise, özel günler için mükemmel",
    price: 280.0,
    category: "Elbise",
    image_url: "https://png.pngtree.com/png-clipart/20190906/original/pngtree-red-dress-clothing-png-image_4548315.jpg"
  },
  {
    id: 5,
    name: "Gri Triko Kazak",
    description: "Sıcak ve şık gri triko kazak, kış ayları için ideal",
    price: 120.0,
    category: "Kazak",
    image_url: "https://assets.theplace.com/image/upload/t_pdp_img_m,f_auto,q_auto/v1/ecom/assets/products/snj/3048615/3048615_1362.png"
  },
  {
    id: 6,
    name: "Bej Deri Ceket",
    description: "Vintage tarz bej deri ceket, casual kombinler için",
    price: 450.0,
    category: "Ceket",
    image_url: "https://d3lazpv835634a.cloudfront.net/product-media/45ZU/1005/1985/Persueder-Champagne-Faux-Suede-Biker-Jacket-Champagne.jpg"
  },
  {
    id: 7,
    name: "Siyah Mini Etek",
    description: "Klasik siyah mini etek, her yaş grubu için uygun",
    price: 180.0,
    category: "Etek",
    image_url: "https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTExL3Jhd3BpeGVsX29mZmljZV8yNV9sZWF0aGVyX21pbmlfc2tpcnRfaXNvbGF0ZWRfd2hpdGVfYmFja2dyb3VuZF82OGE1ZmEyNS1mY2NmLTQwYmItYWQzNi1mMDMwYmRhMTYzY2YucG5n.png"
  },
  {
    id: 8,
    name: "Beyaz Sneaker",
    description: "Rahat ve şık beyaz sneaker, günlük kullanım için",
    price: 220.0,
    category: "Ayakkabı",
    image_url: "https://d1fufvy4xao6k9.cloudfront.net/feed/img/man_sneaker/1050847/side.png"
  },
  {
    id: 9,
    name: "Mavi Gömlek",
    description: "Açık mavi gömlek, ofis ve günlük kombinler için",
    price: 140.0,
    category: "Gömlek",
    image_url: "https://png.pngtree.com/png-vector/20241001/ourmid/pngtree-modern-blue-shirt-png-image_13996708.png"
  },
  {
    id: 10,
    name: "Siyah Deri Çanta",
    description: "Elegant siyah deri çanta, her kombinle uyumlu",
    price: 320.0,
    category: "Çanta",
    image_url: "https://burkely.com/en/wp-content/uploads/2025/02/1001111.65.10_2_STRA-455x500.png"
  },
  {
    id: 11,
    name: "Pembe Bluz",
    description: "Pastel pembe bluz, bahar ayları için ideal",
    price: 95.0,
    category: "Bluz",
    image_url: "https://www.rinascimento.com/media/catalog/product/c/f/c/0/CFC0122867003B528_det_4_03280220.jpg"
  },
  {
    id: 12,
    name: "Kahverengi Deri Ayakkabı",
    description: "Klasik kahverengi deri ayakkabı, resmi ortamlar için",
    price: 280.0,
    category: "Ayakkabı",
    image_url: "https://cdn1.incorio.com/4673-large_default/arthur-cognac-leather-leather-sole.jpg"
  },
  {
    id: 13,
    name: "Siyah Triko Hırka",
    description: "Sıcak siyah triko hırka, soğuk havalar için",
    price: 160.0,
    category: "Hırka",
    image_url: "https://media.high-everydaycouture.com/media/catalog/product/S/5/S5518390W98-199_999_2.png"
  },
  {
    id: 14,
    name: "Beyaz Elbise",
    description: "Minimalist beyaz elbise, yaz ayları için ideal",
    price: 240.0,
    category: "Elbise",
    image_url: "https://e7.pngegg.com/pngimages/242/176/png-clipart-wedding-dress-sleeve-white-gown-first-communion-white-child-thumbnail.png"
  },
  {
    id: 15,
    name: "Gri Pantolon",
    description: "Slim fit gri pantolon, ofis kombinleri için",
    price: 190.0,
    category: "Pantolon",
    image_url: "https://assets.riani.com/media/36/a0/d1/1721037807/473310-004272-912-2.1.png"
  },
  {
    id: 16,
    name: "Kırmızı Triko Kazak",
    description: "Canlı kırmızı triko kazak, kış ayları için",
    price: 110.0,
    category: "Kazak",
    image_url: "https://static.vecteezy.com/system/resources/previews/055/778/982/non_2x/red-cable-knit-sweater-long-sleeves-winter-fashion-png.png"
  },
  {
    id: 17,
    name: "Siyah Crop Top",
    description: "Modern siyah crop top, yaz kombinleri için",
    price: 85.0,
    category: "Üst Giyim",
    image_url: "https://www.bubago.com/image/cache/data/resimler/casall-comfort-crop-top-siyah-513-550x550h.png"
  },
  {
    id: 18,
    name: "Mavi Kot Şort",
    description: "Rahat mavi kot şort, yaz ayları için ideal",
    price: 130.0,
    category: "Şort",
    image_url: "https://w7.pngwing.com/pngs/710/614/png-transparent-denim-jeans-shorts-paper-jeans-textile-fashion-active-shorts.png"
  },
  {
    id: 19,
    name: "Pembe Triko Hırka",
    description: "Pastel pembe triko hırka, bahar ayları için",
    price: 170.0,
    category: "Hırka",
    image_url: "https://m.media-amazon.com/images/I/71LabRtn7FL._AC_SY445_.jpg"
  },
  {
    id: 20,
    name: "Siyah Platform Ayakkabı",
    description: "Şık siyah platform ayakkabı, özel günler için",
    price: 290.0,
    category: "Ayakkabı",
    image_url: "https://d2q7r0rjkm1t8k.cloudfront.net/uplister/images/2a99ec674197464a4a00b3a611bd5fcd.png"
  },
  {
    id: 21,
    name: "Beyaz Crop Bluz",
    description: "Minimalist beyaz crop bluz, günlük kullanım için",
    price: 75.0,
    category: "Bluz",
    image_url: "https://www.casall.com/storage/5FB479B7E91382931CEE7E0C3E2263DC904E8D9AFE77DB2593CB2A495F8183EE/38d6ad099e84490b8623517a38d0cf6d/png/media/67a1cf594c0a4fe3a957bcc90297bb93/22134C001_hover.png"
  },
  {
    id: 22,
    name: "Kahverengi Deri Ceket",
    description: "Vintage kahverengi deri ceket, rock tarzı kombinler için",
    price: 520.0,
    category: "Ceket",
    image_url: "https://png.pngtree.com/png-vector/20240416/ourmid/pngtree-a-brown-leather-jacket-with-the-word-on-front-png-image_11974101.png"
  },
  {
    id: 23,
    name: "Mavi Midi Etek",
    description: "Elegant mavi midi etek, ofis kombinleri için",
    price: 210.0,
    category: "Etek",
    image_url: "https://w7.pngwing.com/pngs/978/488/png-transparent-pencil-skirt-clothing-dress-ruffle-dress-blue-midi-party.png"
  },
  {
    id: 24,
    name: "Siyah Crop Pantolon",
    description: "Modern siyah crop pantolon, yaz kombinleri için",
    price: 180.0,
    category: "Pantolon",
    image_url: "https://e7.pngegg.com/pngimages/96/103/png-clipart-t-shirt-pants-clothing-pajamas-loose-pants-adidas-black-thumbnail.png"
  },
  {
    id: 25,
    name: "Beyaz Triko Kazak",
    description: "Temiz beyaz triko kazak, her kombinle uyumlu",
    price: 100.0,
    category: "Kazak",
    image_url: "https://static.vecteezy.com/system/resources/previews/055/062/564/non_2x/a-white-sweater-on-a-transparent-background-free-png.png"
  },
  {
    id: 26,
    name: "Kırmızı Deri Çanta",
    description: "Göz alıcı kırmızı deri çanta, özel günler için",
    price: 380.0,
    category: "Çanta",
    image_url: "https://w7.pngwing.com/pngs/546/465/png-transparent-tote-bag-chanel-red-handbag-leather-red-spotted-clothing-blue-luggage-bags-fashion.png"
  },
  {
    id: 27,
    name: "Gri Crop Top",
    description: "Şık gri crop top, günlük kombinler için",
    price: 70.0,
    category: "Üst Giyim",
    image_url: "https://static.vecteezy.com/system/resources/previews/057/554/898/non_2x/elegant-abstract-crop-top-white-ribbed-transparent-background-cutout-png.png"
  },
  {
    id: 28,
    name: "Siyah Midi Elbise",
    description: "Klasik siyah midi elbise, her ortam için uygun",
    price: 320.0,
    category: "Elbise",
    image_url: "https://png.pngtree.com/png-vector/20250114/ourmid/pngtree-a-tailored-midi-dress-png-image_15177262.png"
  },
  {
    id: 29,
    name: "Mavi Triko Hırka",
    description: "Sıcak mavi triko hırka, kış ayları için",
    price: 150.0,
    category: "Hırka",
    image_url: "https://www.podyumplus.com/image/cache/catalog/ZENTON%C4%B0/LOO5CtbklFttJfICLm5ljCJ3eK2RUrvNlEtnTudt-600x315.png"
  },
  {
    id: 30,
    name: "Beyaz Platform Sneaker",
    description: "Modern beyaz platform sneaker, günlük kullanım için",
    price: 250.0,
    category: "Ayakkabı",
    image_url: "https://static.nike.com/a/images/t_default/71d0d5ac-e6a2-4d7e-b4b7-ef1e60d4cb58/W+NIKE+COURT+VISION+ALTA+LTR.png"
  },
  {
    id: 31,
    name: "Pembe Crop Bluz",
    description: "Pastel pembe crop bluz, bahar ayları için",
    price: 80.0,
    category: "Bluz",
    image_url: "https://www.dilvin.com.tr/productimages/121727/original/101a03687_koyu-pembe.jpg"
  },
  {
    id: 32,
    name: "Siyah Deri Ceket",
    description: "Klasik siyah deri ceket, her tarzla uyumlu",
    price: 480.0,
    category: "Ceket",
    image_url: "https://e7.pngegg.com/pngimages/396/893/png-clipart-leather-jacket-coat-clothing-jacket.png"
  },
  {
    id: 33,
    name: "Beyaz Midi Etek",
    description: "Minimalist beyaz midi etek, yaz kombinleri için",
    price: 190.0,
    category: "Etek",
    image_url: "https://cdn.dsmcdn.com/mnresize/500/-/ty1518/product/media/images/prod/QC/20240902/21/cc92e112-9714-3c8d-95ac-451699dd1f79/1_org.jpg"
  },
  {
    id: 34,
    name: "Gri Crop Pantolon",
    description: "Modern gri crop pantolon, günlük kullanım için",
    price: 170.0,
    category: "Pantolon",
    image_url: "https://cdn.qukasoft.com/f/200208/bzR6YWFtNG0vcUp3ZUdGckg4OG5icmdQYmNFPQ/p/kadin-tas-palazzo-ince-pantolon-1006-2412-34016343-sw1200sh1800.png"
  },
  {
    id: 35,
    name: "Kırmızı Crop Top",
    description: "Canlı kırmızı crop top, özel günler için",
    price: 90.0,
    category: "Üst Giyim",
    image_url: "https://cdn.dsmcdn.com/mnresize/420/620/ty1317/product/media/images/prod/QC/20240519/00/a9e09698-88f5-3f55-a0e0-bb5114eaa3ff/1_org_zoom.jpg"
  },
  {
    id: 36,
    name: "Siyah Triko Hırka",
    description: "Sıcak siyah triko hırka, kış ayları için",
    price: 160.0,
    category: "Hırka",
    image_url: "https://www.podyumplus.com/image/catalog/ZENTON%C4%B0/FrWxdRiIOCmUzaiIv5JHmYhGJMuHmw3hqJZsfARX.jpg"
  },
  {
    id: 37,
    name: "Beyaz Crop Top",
    description: "Temiz beyaz crop top, yaz kombinleri için",
    price: 65.0,
    category: "Üst Giyim",
    image_url: "https://static.ticimax.cloud/36598/uploads/urunresimleri/buyuk/beyaz-kitty-crop--e2e92.png"
  },
  {
    id: 38,
    name: "Siyah Kot Şort",
    description: "Klasik siyah kot şort, yaz ayları için",
    price: 140.0,
    category: "Şort",
    image_url: "https://e7.pngegg.com/pngimages/236/386/png-clipart-t-shirt-topshop-clothing-jeans-shorts-t-shirt-sneakers-black.png"
  },
  {
    id: 39,
    name: "Mavi Crop Bluz",
    description: "Açık mavi crop bluz, günlük kullanım için",
    price: 85.0,
    category: "Bluz",
    image_url: "https://w7.pngwing.com/pngs/870/875/png-transparent-t-shirt-crop-top-sweater-makeup-material-blue-fashion-woman.png"
  },
  {
    id: 40,
    name: "Kahverengi Midi Etek",
    description: "Elegant kahverengi midi etek, ofis kombinleri için",
    price: 230.0,
    category: "Etek",
    image_url: "https://cdn.globalso.com/yashagarment/CVASV-1.png"
  },
  {
    id: 41,
    name: "Beyaz Crop Pantolon",
    description: "Minimalist beyaz crop pantolon, yaz kombinleri için",
    price: 200.0,
    category: "Pantolon",
    image_url: "https://w7.pngwing.com/pngs/709/841/png-transparent-jeans-pants-jeans-white-active-pants-clothing.png"
  },
  {
    id: 42,
    name: "Kırmızı Triko Hırka",
    description: "Canlı kırmızı triko hırka, kış ayları için",
    price: 180.0,
    category: "Hırka",
    image_url: "https://w7.pngwing.com/pngs/521/999/png-transparent-cardigan-clothing-sweater-jacket-button-jacket-fashion-woolen-sneakers.png"
  },
  {
    id: 43,
    name: "Siyah Platform Ayakkabı",
    description: "Şık siyah platform ayakkabı, özel günler için",
    price: 310.0,
    category: "Ayakkabı",
    image_url: "https://w7.pngwing.com/pngs/106/281/png-transparent-quartier-pigalle-court-shoe-high-heeled-footwear-patent-leather-black-smooth-surface-high-heeled-shoes-black-hair-fashion-black-white.png"
  },
  {
    id: 44,
    name: "Pembe Midi Elbise",
    description: "Pastel pembe midi elbise, bahar ayları için",
    price: 260.0,
    category: "Elbise",
    image_url: "https://png.pngtree.com/png-vector/20240803/ourlarge/pngtree-light-pink-silk-dress-isolated-on-transparent-background-png-image_13360501.png"
  },
  {
    id: 45,
    name: "Gri Deri Çanta",
    description: "Elegant gri deri çanta, her kombinle uyumlu",
    price: 340.0,
    category: "Çanta",
    image_url: "https://e7.pngegg.com/pngimages/363/799/png-clipart-birkin-bag-hermxe8s-handbag-leather-hermes-hermes-elephant-gray-leather-handbags-blue-white-thumbnail.png"
  },
  {
    id: 46,
    name: "Mavi Crop Top",
    description: "Açık mavi crop top, yaz kombinleri için",
    price: 75.0,
    category: "Üst Giyim",
    image_url: "https://i.pinimg.com/736x/37/33/41/373341e6986dd1d917a060d3f6f7b839.jpg"
  },
  {
    id: 47,
    name: "Siyah Midi Etek",
    description: "Klasik siyah midi etek, her ortam için uygun",
    price: 220.0,
    category: "Etek",
    image_url: "https://png.pngtree.com/png-vector/20240429/ourmid/pngtree-pleated-black-skirt-with-cinched-waist-png-image_12339553.png"
  },
  {
    id: 48,
    name: "Beyaz Triko Hırka",
    description: "Temiz beyaz triko hırka, kış ayları için",
    price: 170.0,
    category: "Hırka",
    image_url: "https://www.podyumplus.com/image/cache/catalog/VAN%C4%B0ZA_(%C3%96.A)/zeEC0dNHmBuZGMEFdluAoOGwuO90eIm0wfMcTDYv-600x315.png"
  },
  {
    id: 49,
    name: "Kahverengi Platform Sneaker",
    description: "Vintage kahverengi platform sneaker, günlük kullanım için",
    price: 270.0,
    category: "Ayakkabı",
    image_url: "https://static.ticimax.cloud/40380/Uploads/UrunResimleri/thumb/run-star-hike-platform-weatherized-lea-a-9652.png"
  },
  {
    id: 50,
    name: "Mavi Midi Elbise",
    description: "Elegant mavi midi elbise, özel günler için",
    price: 300.0,
    category: "Elbise",
    image_url: "https://www.ilaydakarakus.com/image/cache/catalog/Urunler/u10-615x923.png"
  },
  {
    id: 51,
    name: "Siyah Crop Bluz",
    description: "Modern siyah crop bluz, günlük kullanım için",
    price: 90.0,
    category: "Bluz",
    image_url: "https://w7.pngwing.com/pngs/899/38/png-transparent-t-shirt-crop-top-sleeve-t-shirt-fashion-black-woman.png"
  },
  {
    id: 52,
    name: "Gri Midi Etek",
    description: "Şık gri midi etek, ofis kombinleri için",
    price: 240.0,
    category: "Etek",
    image_url: "https://static.ticimax.cloud/cdn-cgi/image/width=-,quality=85/31315/uploads/urunresimleri/buyuk/tuvit-etek-c-9241.jpg"
  },
  {
    id: 53,
    name: "Beyaz Crop Pantolon",
    description: "Minimalist beyaz crop pantolon, yaz kombinleri için",
    price: 210.0,
    category: "Pantolon",
    image_url: "https://w7.pngwing.com/pngs/870/693/png-transparent-bermuda-shorts-jeans-jeans-white-bermuda-shorts-clothing.png"
  },
  {
    id: 54,
    name: "Kırmızı Platform Ayakkabı",
    description: "Göz alıcı kırmızı platform ayakkabı, özel günler için",
    price: 330.0,
    category: "Ayakkabı",
    image_url: "https://png.pngtree.com/png-vector/20250325/ourlarge/pngtree-red-high-heeled-shoes-png-image_15868529.png"
  },
  {
    id: 55,
    name: "Siyah Midi Elbise",
    description: "Klasik siyah midi elbise, her ortam için uygun",
    price: 340.0,
    category: "Elbise",
    image_url: "https://png.pngtree.com/png-vector/20250114/ourmid/pngtree-a-tailored-midi-dress-png-image_15177262.png"
  },
  {
    id: 56,
    name: "Mavi Deri Çanta",
    description: "Elegant mavi deri çanta, her kombinle uyumlu",
    price: 360.0,
    category: "Çanta",
    image_url: "https://w7.pngwing.com/pngs/449/169/png-transparent-handbag-leather-clothing-accessories-woman-bag-blue-white-luggage-bags.png"
  },
  {
    id: 57,
    name: "Pembe Crop Top",
    description: "Pastel pembe crop top, bahar ayları için",
    price: 70.0,
    category: "Üst Giyim",
    image_url: "https://w7.pngwing.com/pngs/964/674/png-transparent-bra-crop-top-sleeveless-shirt-tanktop-tank-top-white-swimsuit-top-magenta-thumbnail.png"
  },
  {
    id: 58,
    name: "Kahverengi Crop Pantolon",
    description: "Vintage kahverengi crop pantolon, günlük kullanım için",
    price: 190.0,
    category: "Pantolon",
    image_url: "https://cdn.qukasoft.com/f/864663/cG96YWFtNG0vcUp3ZUdGckg4OG5icmdQYmNFPQ/p/premium-modal-palazzo-pantolon-kahverengi-47535895-sw1400sh2100.png"
  },
  {
    id: 59,
    name: "Beyaz Platform Sneaker",
    description: "Temiz beyaz platform sneaker, günlük kullanım için",
    price: 260.0,
    category: "Ayakkabı",
    image_url: "https://png.pngtree.com/png-clipart/20250428/original/pngtree-a-stylish-white-sneaker-with-chunky-sole-featuring-lace-up-design-png-image_20883668.png"
  },
  {
    id: 60,
    name: "Gri Midi Elbise",
    description: "Elegant gri midi elbise, ofis kombinleri için",
    price: 280.0,
    category: "Elbise",
    image_url: "https://png.pngtree.com/png-clipart/20220706/ourmid/pngtree-monochrome-midi-dress-png-image_5722887.png"
  }
];

// Mock data'dan ürün ID'sine göre ürün bulma fonksiyonu
const getProductById = (productId) => {
  return mockProducts.find(product => product.id === productId);
};

const ChatPanel = ({ setProducts }) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hoş geldiniz! Size nasıl yardımcı olabilirim? Stil önerileri için bana ne tür bir kombin istediğinizi söyleyin.',
      timestamp: new Date()
    }
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    setShowAllProducts(false); // Yeni öneri alırken butonu gizle

    try {
      const response = await axios.post('http://localhost:8000/recommend', {
        text: message
      });

      // Backend'den gelen ürünleri mock data ile eşleştir
      const enhancedProducts = response.data.map(aiProduct => {
        const mockProduct = getProductById(aiProduct.id);
        if (mockProduct) {
          return {
            ...aiProduct,
            image_url: mockProduct.image_url, // Ana sayfadaki resmi kullan
            name: mockProduct.name,
            description: mockProduct.description,
            price: mockProduct.price,
            category: mockProduct.category
          };
        }
        return aiProduct; // Eğer mock data'da bulunamazsa AI verisini kullan
      });

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: `Size ${enhancedProducts.length} adet ürün önerisi buldum! Aşağıdaki ürünleri inceleyebilirsiniz.`,
        timestamp: new Date()
      };

      setChatHistory(prev => [...prev, botMessage]);
      setProducts(enhancedProducts); // Geliştirilmiş ürünleri set et
      setShowAllProducts(true); // Tüm ürünleri göster butonunu aktif et

    } catch (error) {
      console.error('Öneri alınırken hata:', error);
      let content = 'Üzgünüm, şu anda öneri alamıyorum. Lütfen daha sonra tekrar deneyin.';
      if (error.response && error.response.data) {
        if (error.response.data.message) {
          content = error.response.data.message;
        } else if (error.response.data.detail) {
          content = error.response.data.detail;
        }
      }
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content,
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Tüm ürünleri göster fonksiyonu
  const handleShowAllProducts = () => {
    setProducts(mockProducts); // Tüm mock ürünleri göster
    setShowAllProducts(false); // Butonu gizle
    
    // Chat'e bilgi mesajı ekle
    const infoMessage = {
      id: Date.now(),
      type: 'bot',
      content: 'Tüm ürünleri gösteriyorum. Başka bir öneri almak isterseniz yazabilirsiniz!',
      timestamp: new Date()
    };
    
    setChatHistory(prev => [...prev, infoMessage]);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-full min-h-0 w-full overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center space-x-3 mb-4 flex-shrink-0 px-2">
        <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">AI Asistan</h3>
          <p className="text-xs text-gray-500">Stil önerileri için hazır</p>
        </div>
      </div>

      {/* Chat Messages - Scrollable Area */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-3 min-h-0 w-full px-2" style={{ maxHeight: 'calc(100vh - 300px)' }}>
        {chatHistory.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[60%] min-w-0 px-3 py-2 rounded-2xl ${
                msg.type === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'bg-white/70 backdrop-blur-sm text-gray-800 border border-white/30'
              } shadow-lg`}
              style={{
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                hyphens: 'auto',
                maxWidth: '60%',
                minWidth: '0',
                overflow: 'hidden',
                wordBreak: 'break-word'
              }}
            >
              <p className="text-sm leading-relaxed break-words whitespace-pre-wrap overflow-hidden" style={{ wordBreak: 'break-word' }}>
                {msg.content}
              </p>
              <p className={`text-xs mt-1 ${
                msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {formatTime(msg.timestamp)}
              </p>
            </div>
          </div>
        ))}
        
        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start w-full">
            <div className="bg-white/70 backdrop-blur-sm text-gray-800 border border-white/30 rounded-2xl px-3 py-2 shadow-lg" style={{ maxWidth: '65%', minWidth: '0', overflow: 'hidden' }}>
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
                <span className="text-sm text-gray-600">Düşünüyor...</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Tüm Ürünleri Göster Butonu */}
      {showAllProducts && (
        <div className="flex-shrink-0 w-full px-2 mb-2">
          <button
            onClick={handleShowAllProducts}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <span>Tüm Ürünleri Göster</span>
          </button>
        </div>
      )}

      {/* Message Input - Fixed at Bottom */}
      <div className="flex-shrink-0 w-full px-2 pb-2" style={{ minHeight: '120px' }}>
        <form onSubmit={handleSubmit} className="space-y-2 w-full">
          <div className="relative w-full">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Mesajınızı yazın..."
              className="w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl px-3 py-2 pr-10 text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none text-sm"
              rows="2"
              disabled={isLoading}
              style={{ 
                minHeight: '60px', 
                maxHeight: '80px',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                maxWidth: '100%'
              }}
            />
            <button
              type="submit"
              disabled={!message.trim() || isLoading}
              className="absolute bottom-2 right-2 w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-lg flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none disabled:cursor-not-allowed"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          
          {/* Quick Suggestions */}
          <div className="flex flex-wrap gap-1 w-full">
            {[
              "Ofis kombin",
              "Günlük stil",
              "Özel gün",
              "Spor tarz"
            ].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setMessage(suggestion)}
                disabled={isLoading}
                className="px-2 py-1 bg-white/30 hover:bg-white/50 backdrop-blur-sm border border-white/30 rounded-full text-xs text-gray-700 font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;
