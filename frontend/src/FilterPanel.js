import React, { useState } from "react";

function FilterPanel({ onFilterChange }) {
  const [filters, setFilters] = useState({
    style: "",
    color: "",
    season: "",
    maxPrice: 1000
  });

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    onFilterChange && onFilterChange(newFilters);
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">🔍 Filtreler</h3>
      
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Stil Filtresi */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Stil</label>
          <select
            value={filters.style}
            onChange={(e) => handleFilterChange('style', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">Tüm Stiller</option>
            <option value="casual">Casual</option>
            <option value="formal">Formal</option>
            <option value="street">Street</option>
          </select>
        </div>

        {/* Renk Filtresi */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Renk</label>
          <select
            value={filters.color}
            onChange={(e) => handleFilterChange('color', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">Tüm Renkler</option>
            <option value="siyah">Siyah</option>
            <option value="beyaz">Beyaz</option>
            <option value="mavi">Mavi</option>
          </select>
        </div>

        {/* Mevsim Filtresi */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Mevsim</label>
          <select
            value={filters.season}
            onChange={(e) => handleFilterChange('season', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">Tüm Mevsimler</option>
            <option value="ilkbahar">İlkbahar</option>
            <option value="yaz">Yaz</option>
            <option value="kış">Kış</option>
            <option value="sonbahar">Sonbahar</option>
          </select>
        </div>

        {/* Maksimum Fiyat Filtresi */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maksimum Fiyat: ₺{filters.maxPrice}
          </label>
          <input
            type="range"
            min="0"
            max="1000"
            step="50"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>₺0</span>
            <span>₺1000</span>
          </div>
        </div>

        {/* Filtreleri Temizle Butonu */}
        <div className="flex items-end">
          <button
            onClick={() => {
              const resetFilters = { style: "", color: "", season: "", maxPrice: 1000 };
              setFilters(resetFilters);
              onFilterChange && onFilterChange(resetFilters);
            }}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Temizle
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterPanel; 