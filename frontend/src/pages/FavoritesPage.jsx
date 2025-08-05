import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Ana sayfadaki mock data'yı buraya ekleyelim
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
  }
];

// Mock data'dan ürün ID'sine göre ürün bulma fonksiyonu
const getProductById = (productId) => {
  return mockProducts.find(product => product.id === productId);
};

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      // 1. localStorage'dan token'ı al
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError("Favorilerinizi görmek için lütfen giriş yapın.");
        setIsLoading(false);
        return;
      }

      try {
        // 2. API isteğinin header'ına token'ı ekle
        const response = await axios.get('http://localhost:8000/favorites', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // 3. Backend'den gelen favori ürün ID'lerini kullanarak mock data'dan tam ürün bilgilerini al
        const favoriteProducts = response.data.map(favoriteProduct => {
          const mockProduct = getProductById(favoriteProduct.id);
          if (mockProduct) {
            return {
              ...favoriteProduct,
              image_url: mockProduct.image_url, // Ana sayfadaki resmi kullan
              name: mockProduct.name,
              description: mockProduct.description,
              price: mockProduct.price,
              category: mockProduct.category
            };
          }
          return favoriteProduct; // Eğer mock data'da bulunamazsa backend verisini kullan
        });
        
        setFavorites(favoriteProducts);
      } catch (err) {
        setError("Favoriler yüklenirken bir hata oluştu veya oturumunuzun süresi doldu.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (productId) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('Favori silmek için giriş yapmanız gerekiyor.');
      return;
    }

    try {
      await axios.delete(`http://localhost:8000/favorites/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Favoriler listesinden ürünü kaldır
      setFavorites(prev => prev.filter(product => product.id !== productId));
      alert('Ürün favorilerden silindi!');
      
    } catch (error) {
      if (error.response && error.response.data && error.response.data.detail) {
        alert(`Hata: ${error.response.data.detail}`);
      } else {
        alert('Favori silinirken bir hata oluştu.');
      }
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
        <div className="text-lg text-gray-600 font-medium">Favorileriniz yükleniyor...</div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="text-lg text-red-600 font-medium mb-4">{error}</div>
        <Link to="/login" className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl">
          Giriş Yap
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="glass border border-white/20 rounded-2xl shadow-xl p-8 mb-8 backdrop-blur-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold gradient-text">Favorilerim</h1>
                <p className="text-gray-600 mt-1">{favorites.length} ürün favorilerinizde</p>
              </div>
            </div>
            <Link 
              to="/" 
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>

        {/* Content */}
        {favorites.length === 0 ? (
          <div className="glass border border-white/20 rounded-2xl shadow-xl p-12 text-center backdrop-blur-sm">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Henüz favori ürününüz yok</h2>
            <p className="text-gray-600 mb-6">Ana sayfada beğendiğiniz ürünleri favorilere ekleyerek burada görüntüleyebilirsiniz.</p>
            <Link 
              to="/" 
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Ürünleri Keşfet
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map(product => (
              <div key={product.id} className="glass border border-white/30 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 p-6 flex flex-col relative card-hover group">
                {/* Kalp İkonu - Sağ Üst Köşe (Dolu Kalp - Favorilerden Çıkar) */}
                <div className="absolute top-4 right-4 z-10">
                  <button 
                    onClick={() => handleRemoveFavorite(product.id)}
                    className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl group-hover:bg-white"
                  >
                    <svg 
                      className="w-5 h-5 text-red-500" 
                      fill="currentColor" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                      />
                    </svg>
                  </button>
                </div>

                {/* Ürün resmi - Ana sayfadaki yapıyla aynı */}
                <div className="w-full h-48 mb-6 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 group-hover:shadow-lg transition-all duration-300">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center text-gray-400 text-lg font-bold" style={{ display: product.image_url ? 'none' : 'flex' }}>
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                
                {/* Ürün bilgileri - Ana sayfadaki yapıyla aynı */}
                <div className="flex-1 flex flex-col">
                  <h3 className="text-lg font-bold mb-3 text-gray-800 line-clamp-2 group-hover:text-gray-900 transition-colors duration-300">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-3 leading-relaxed">{product.description}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-white/30">
                    <span className="text-xl font-bold gradient-text">₺{product.price}</span>
                    <span className="text-xs text-gray-600 bg-white/50 backdrop-blur-sm px-3 py-2 rounded-full font-medium border border-white/30">
                      {product.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
