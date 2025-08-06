import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ChatPanel from "../ChatPanel";
import ProductGrid from "../ProductGrid";
import FilterPanel from "../FilterPanel";
import { fetchProducts } from "../api";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [comboProducts, setComboProducts] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    style: "",
    color: "",
    season: "",
    maxPrice: 1000
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();

  // Kullanıcı giriş durumunu kontrol et
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // Test için: Token yoksa otomatik giriş yap
    if (!token) {
      console.log('Token bulunamadı, test kullanıcısı ile otomatik giriş yapılıyor...');
      
      // Test kullanıcısı ile otomatik giriş
      fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'username=test@test.com&password=test123'
      })
      .then(response => response.json())
      .then(data => {
        if (data.access_token) {
          localStorage.setItem('token', data.access_token);
          setIsLoggedIn(true);
          console.log('Otomatik giriş başarılı!');
        }
      })
      .catch(error => {
        console.error('Otomatik giriş başarısız:', error);
      });
    } else {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setShowProfileDropdown(false);
    navigate('/');
  };

  const handleFavorites = () => {
    if (isLoggedIn) {
      navigate('/favorites');
    } else {
      alert('Favorileri görüntülemek için giriş yapmanız gerekiyor.');
    }
  };

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        setError("Ürünler yüklenirken bir hata oluştu.");
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Filtreleme fonksiyonu
  const filteredProducts = products.filter(product => {
    const productText = `${product.name} ${product.description} ${product.category}`.toLowerCase();
    
    // Stil filtresi - ürün açıklamasında stil aranıyor
    if (selectedFilters.style && selectedFilters.style !== "") {
      const styleLower = selectedFilters.style.toLowerCase();
      if (!productText.includes(styleLower)) {
        return false;
      }
    }
    
    // Renk filtresi - hem ad hem açıklamada renk aranıyor
    if (selectedFilters.color && selectedFilters.color !== "") {
      const colorLower = selectedFilters.color.toLowerCase();
      if (!productText.includes(colorLower)) {
        return false;
      }
    }
    
    // Mevsim filtresi - ürün açıklamasında mevsim aranıyor
    if (selectedFilters.season && selectedFilters.season !== "") {
      const seasonLower = selectedFilters.season.toLowerCase();
      if (!productText.includes(seasonLower)) {
        return false;
      }
    }
    
    // Fiyat filtresi
    if (product.price > selectedFilters.maxPrice) {
      return false;
    }
    
    return true;
  });

  console.log('Filtrelenmiş ürün sayısı:', filteredProducts.length, 'Toplam ürün:', products.length);

  const handleFilterChange = (filters) => {
    console.log('Filtreler değişti:', filters);
    setSelectedFilters(filters);
  };

  const handleSuggestCombo = async (selectedProduct) => {
    try {
      // Backend'e POST isteği (şimdilik mock response)
      // const response = await fetch('http://localhost:8000/combo', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(selectedProduct)
      // });
      // const comboData = await response.json();
      
      // Mock response - gerçek API yerine
      setTimeout(() => {
        const mockComboProducts = [
          {
            id: 101,
            name: `${selectedProduct.name} ile Uyumlu Pantolon`,
            description: `${selectedProduct.name} ile mükemmel uyum sağlayan pantolon`,
            price: 180.0,
            category: "Pantolon",
            image_url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop"
          },
          {
            id: 102,
            name: `${selectedProduct.name} ile Uyumlu Ayakkabı`,
            description: `${selectedProduct.name} ile şık kombin oluşturan ayakkabı`,
            price: 220.0,
            category: "Ayakkabı",
            image_url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop"
          },
          {
            id: 103,
            name: `${selectedProduct.name} ile Uyumlu Aksesuar`,
            description: `${selectedProduct.name} ile tamamlayıcı aksesuar`,
            price: 80.0,
            category: "Aksesuar",
            image_url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop"
          }
        ];
        setComboProducts(mockComboProducts);
      }, 1000);
      
    } catch (error) {
      console.error("Kombin önerisi alınırken hata:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Modern Glass Header */}
      <header className="fixed top-0 left-0 right-0 glass border-b border-white/20 backdrop-blur-lg z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold gradient-text">FitStyle AI</h1>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Favoriler Butonu */}
              <button
                onClick={handleFavorites}
                className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300 text-gray-800 font-semibold backdrop-blur-sm shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="drop-shadow-sm">Favorilerim</span>
              </button>

              {isLoggedIn ? (
                /* Giriş yapmış kullanıcı - Profil Dropdown */
                <div className="relative">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center space-x-3 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300 text-gray-800 font-semibold backdrop-blur-sm shadow-lg hover:shadow-xl"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span className="drop-shadow-sm">Profil</span>
                    <svg className={`w-4 h-4 text-gray-800 transition-transform duration-200 ${showProfileDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-3 w-48 glass rounded-xl shadow-xl py-2 z-50 border border-white/20">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-white/20 transition-colors duration-200 rounded-lg mx-2"
                      >
                        Çıkış Yap
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Giriş yapmamış kullanıcı - Giriş/Kayıt Butonları */
                <div className="flex space-x-4">
                  <Link to="/login" className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300 text-gray-800 font-semibold backdrop-blur-sm shadow-lg hover:shadow-xl">
                    Giriş Yap
                  </Link>
                  <Link to="/register" className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl transition-all duration-300 text-white font-semibold shadow-lg hover:shadow-xl">
                    Kayıt Ol
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Dropdown dışına tıklandığında kapat */}
      {showProfileDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowProfileDropdown(false)}
        />
      )}

      {/* Ana İçerik - Header'ın altında başlar */}
      <main className="pt-24 min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          {/* Responsive İki Panelli Yapı */}
          <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-8rem)]">
            
            {/* Sol Panel - Sohbet Paneli (%35) */}
            <div className="w-full lg:w-[35%] flex-shrink-0">
              <div className="glass rounded-2xl shadow-xl p-6 h-full flex flex-col border border-white/20 overflow-hidden">
                <div className="flex items-center space-x-3 mb-4 flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">AI Asistan</h2>
                </div>
                {/* Sohbet paneli burada - Scrollable */}
                <div className="flex-1 min-h-0 overflow-hidden">
                  <ChatPanel setProducts={setProducts} />
                </div>
              </div>
            </div>

            {/* Sağ Panel - Ürünler (%65) */}
            <div className="w-full lg:w-[65%] flex-shrink-0">
              <div className="glass rounded-2xl shadow-xl p-8 h-full flex flex-col border border-white/20">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Önerilen Ürünler</h2>
                </div>
                
                {/* FilterPanel - Ürünlerin üstünde */}
                <div className="mb-6">
                  <FilterPanel onFilterChange={handleFilterChange} />
                </div>

                {/* Ürün grid burada - scroll edilebilir */}
                <div className="flex-1 overflow-y-auto">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-spin"></div>
                        <div className="text-lg text-gray-600 font-medium">Yükleniyor...</div>
                      </div>
                    </div>
                  ) : error ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="text-lg text-red-600 font-medium">{error}</div>
                      </div>
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <div className="text-lg text-gray-600 font-medium">Filtreye uygun ürün bulunamadı.</div>
                      </div>
                    </div>
                  ) : (
                    <ProductGrid products={filteredProducts} setProducts={setProducts} />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Kombin Önerileri Paneli */}
          {comboProducts.length > 0 && (
            <div className="mt-8 glass rounded-2xl shadow-xl p-8 border border-white/20 fade-in">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">🎨 Kombin Önerileri</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {comboProducts.map((product) => (
                  <div 
                    key={product.id} 
                    className="bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 flex flex-col card-hover"
                  >
                    {/* Ürün resmi */}
                    <div className="w-full h-32 mb-4 rounded-lg overflow-hidden bg-gray-100">
                      {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm font-bold">
                          Resim
                        </div>
                      )}
                    </div>
                    
                    {/* Ürün bilgileri */}
                    <div className="flex-1 flex flex-col">
                      <h3 className="text-sm font-semibold mb-2 text-gray-800 line-clamp-2">{product.name}</h3>
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold gradient-text">₺{product.price}</span>
                        <span className="text-xs text-gray-500 bg-gradient-to-r from-yellow-100 to-orange-100 px-3 py-1 rounded-full font-medium">{product.category}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HomePage; 