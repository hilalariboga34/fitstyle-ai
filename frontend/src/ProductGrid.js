import React, { useState, useEffect } from "react";
import axios from "axios";

// API'den ürünleri getiren async fonksiyon
const fetchProductsFromAPI = async () => {
  try {
    const response = await axios.get('http://localhost:8000/products');
    return response.data;
  } catch (error) {
    throw new Error('Ürünler yüklenirken bir hata oluştu: ' + error.message);
  }
};

function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const productsData = await fetchProductsFromAPI();
        setProducts(productsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow p-6 flex flex-col items-center">
          {/* Resim yer tutucu */}
          <div className="w-28 h-28 bg-gray-200 rounded mb-4 flex items-center justify-center text-gray-400 text-lg font-bold">
            Resim
          </div>
          <div className="text-lg font-semibold mb-2 text-gray-800">{product.name}</div>
          <div className="text-blue-700 font-bold text-base">₺{product.price}</div>
        </div>
      ))}
    </div>
  );
}

export default ProductGrid; 