import React, { useEffect, useState } from "react";
import "./App.css";
import ChatPanel from "./ChatPanel";
import ProductGrid from "./ProductGrid";
import FilterPanel from "./FilterPanel";
import { fetchProducts } from "./api";
import './index.css';

function App() {
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
    // Stil filtresi
    if (selectedFilters.style && product.category.toLowerCase() !== selectedFilters.style.toLowerCase()) {
      return false;
    }
    
    // Renk filtresi
    if (selectedFilters.color && !product.name.toLowerCase().includes(selectedFilters.color.toLowerCase())) {
      return false;
    }
    
    // Fiyat filtresi
    if (product.price > selectedFilters.maxPrice) {
      return false;
    }
    
    return true;
  });

  const handleFilterChange = (filters) => {
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
    <div className="min-h-screen bg-gray-100">
      {/* Sabit Header */}
      <header className="fixed top-0 left-0 right-0 bg-blue-600 text-white p-6 shadow-lg z-50">
        <h1 className="text-4xl font-bold text-center">FitStyle AI</h1>
      </header>

      {/* Ana İçerik - Header'ın altında başlar */}
      <main className="pt-28 min-h-screen">
        <div className="max-w-7xl mx-auto px-4">
          {/* Responsive İki Panelli Yapı */}
          <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
            
            {/* Sol Panel - Sohbet Paneli (%35) */}
            <div className="w-full lg:w-[35%] flex-shrink-0">
              <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Sohbet Paneli</h2>
                {/* Sohbet paneli burada */}
                <div className="flex-1">
                  <ChatPanel setProducts={setProducts} />
                </div>
              </div>
            </div>

            {/* Sağ Panel - Ürünler (%65) */}
            <div className="w-full lg:w-[65%] flex-shrink-0">
              <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Önerilen Ürünler</h2>
                
                {/* FilterPanel - Ürünlerin üstünde */}
                <div className="mb-6">
                  <FilterPanel onFilterChange={handleFilterChange} />
                </div>

                {/* Ürün grid burada - scroll edilebilir */}
                <div className="flex-1 overflow-y-auto">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="text-lg text-gray-600">Yükleniyor...</div>
                    </div>
                  ) : error ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="text-lg text-red-600">{error}</div>
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="text-lg text-gray-600">Filtreye uygun ürün bulunamadı.</div>
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
            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">🎨 Kombin Önerileri</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {comboProducts.map((product) => (
                  <div 
                    key={product.id} 
                    className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 p-4 flex flex-col"
                  >
                    {/* Ürün resmi */}
                    <div className="w-full h-32 mb-3 rounded-lg overflow-hidden bg-gray-100">
                      {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm font-bold">
                          Resim
                        </div>
                      )}
                    </div>
                    
                    {/* Ürün bilgileri */}
                    <div className="flex-1 flex flex-col">
                      <h3 className="text-sm font-semibold mb-1 text-gray-800 line-clamp-2">{product.name}</h3>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-purple-600">₺{product.price}</span>
                        <span className="text-xs text-gray-500 bg-purple-100 px-2 py-1 rounded-full">{product.category}</span>
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
}

export default App;
