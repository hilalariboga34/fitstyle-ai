import React from "react";

function ProductGrid({ products, setProducts }) {
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