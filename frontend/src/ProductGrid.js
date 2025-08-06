import React, { useState } from "react";
import axios from "axios";

function ProductGrid({ products, setProducts }) {
  const [favoriteStates, setFavoriteStates] = useState({});

  const handleFavoriteClick = async (productId) => {
    // Token'ı localStorage'dan al
    const token = localStorage.getItem('token');
    
    if (!token) {
      // Token yoksa kullanıcıyı giriş sayfasına yönlendir
      const shouldLogin = window.confirm('Favori eklemek için giriş yapmanız gerekiyor. Giriş sayfasına yönlendirilsin mi?');
      if (shouldLogin) {
        window.location.href = '/login';
      }
      return;
    }

    try {
      // Favori ekleme isteği gönder
      const response = await axios.post('http://localhost:8000/favorites', 
        { product_id: productId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Başarılı olursa kalp ikonunu kırmızı yap
      setFavoriteStates(prev => ({
        ...prev,
        [productId]: true
      }));
      
      // Başarı mesajı göster
      alert('Ürün favorilere eklendi!');
      
      console.log('Favori eklendi:', response.data);
      
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Token geçersiz veya süresi dolmuş
        localStorage.removeItem('token'); // Geçersiz token'ı sil
        alert('Oturumunuzun süresi dolmuş. Lütfen tekrar giriş yapın.');
        window.location.href = '/login';
      } else if (error.response && error.response.data && error.response.data.detail) {
        alert(`Hata: ${error.response.data.detail}`);
      } else {
        alert('Favori eklenirken bir hata oluştu.');
      }
    }
  };

  if (!products || products.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div className="text-xl text-gray-600 font-medium mb-2">Henüz ürün önerilmedi</div>
          <div className="text-sm text-gray-500">Sohbet panelinden bir mesaj gönderin</div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div 
          key={product.id} 
          className="glass border border-white/30 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 p-6 flex flex-col relative card-hover group"
        >
          {/* Kalp İkonu - Sağ Üst Köşe */}
          <div className="absolute top-4 right-4 z-10">
            <button 
              onClick={() => handleFavoriteClick(product.id)}
              className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl group-hover:bg-white"
            >
              <svg 
                className={`w-5 h-5 transition-colors duration-300 ${
                  favoriteStates[product.id] 
                    ? 'text-red-500 fill-current' 
                    : 'text-gray-400 hover:text-red-500'
                }`}
                fill={favoriteStates[product.id] ? 'currentColor' : 'none'}
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

          {/* Ürün resmi */}
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
          
          {/* Ürün bilgileri */}
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
  );
}

export default ProductGrid; 