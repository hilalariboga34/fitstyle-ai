import React from "react";

function ProductGrid({ products, setProducts }) {
  if (!products || products.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">🛍️</div>
          <div className="text-xl text-gray-600 font-medium">Henüz ürün önerilmedi</div>
          <div className="text-sm text-gray-500 mt-2">Sohbet panelinden bir mesaj gönderin</div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div 
          key={product.id} 
          className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 flex flex-col"
        >
          {/* Ürün resmi */}
          <div className="w-full h-48 mb-4 rounded-lg overflow-hidden bg-gray-100">
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-lg font-bold" style={{ display: product.image_url ? 'none' : 'flex' }}>
              Resim
            </div>
          </div>
          
          {/* Ürün bilgileri */}
          <div className="flex-1 flex flex-col">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 line-clamp-2">{product.name}</h3>
            <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-3">{product.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-blue-600">₺{product.price}</span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{product.category}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductGrid; 