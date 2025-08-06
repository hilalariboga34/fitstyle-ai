import React, { useState } from 'react';

const FilterPanel = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    style: "",
    color: "",
    season: "",
    maxPrice: 1000
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      style: "",
      color: "",
      season: "",
      maxPrice: 1000
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="glass border border-white/20 rounded-xl p-2 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-gray-800">Filtreler</h3>
        </div>
        <button
          onClick={handleClearFilters}
          className="px-2 py-1 bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white text-xs font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Temizle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        {/* Stil Filtresi */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-700">Stil</label>
          <select
            value={filters.style}
            onChange={(e) => handleFilterChange('style', e.target.value)}
            className="w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg px-2 py-1 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
          >
            <option value="">Tüm Stiller</option>
            <option value="Günlük">Günlük</option>
            <option value="Ofis">Ofis</option>
            <option value="Spor">Spor</option>
            <option value="Sokak Stili">Sokak Stili</option>
            <option value="Casual">Casual</option>
            <option value="Elegant">Elegant</option>
            <option value="Minimalist">Minimalist</option>
            <option value="Vintage">Vintage</option>
            <option value="Bohem">Bohem</option>
            <option value="Klasik">Klasik</option>
            <option value="Modern">Modern</option>
            <option value="Romantik">Romantik</option>
            <option value="Rock">Rock</option>
            <option value="Preppy">Preppy</option>
            <option value="Girly">Girly</option>
            <option value="Androgynous">Androgynous</option>
          </select>
        </div>

        {/* Renk Filtresi */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-700">Renk</label>
          <select
            value={filters.color}
            onChange={(e) => handleFilterChange('color', e.target.value)}
            className="w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg px-2 py-1 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
          >
            <option value="">Tüm Renkler</option>
            <option value="Beyaz">Beyaz</option>
            <option value="Siyah">Siyah</option>
            <option value="Mavi">Mavi</option>
            <option value="Kırmızı">Kırmızı</option>
            <option value="Gri">Gri</option>
            <option value="Kahverengi">Kahverengi</option>
            <option value="Pembe">Pembe</option>
            <option value="Bej">Bej</option>
            <option value="Yeşil">Yeşil</option>
            <option value="Bordo">Bordo</option>
            <option value="Krem">Krem</option>
            <option value="Lacivert">Lacivert</option>
            <option value="Turuncu">Turuncu</option>
            <option value="Mor">Mor</option>
            <option value="Sarı">Sarı</option>
            <option value="Altın">Altın</option>
            <option value="Gümüş">Gümüş</option>
          </select>
        </div>

        {/* Mevsim Filtresi */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-700">Mevsim</label>
          <select
            value={filters.season}
            onChange={(e) => handleFilterChange('season', e.target.value)}
            className="w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg px-2 py-1 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
          >
            <option value="">Tüm Mevsimler</option>
            <option value="İlkbahar">İlkbahar</option>
            <option value="Yaz">Yaz</option>
            <option value="Sonbahar">Sonbahar</option>
            <option value="Kış">Kış</option>
          </select>
        </div>

        {/* Fiyat Filtresi */}
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-700">
            Maksimum Fiyat: ₺{filters.maxPrice}
          </label>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="1000"
              step="50"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value))}
              className="w-full h-2 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>₺0</span>
              <span>₺1000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Aktif Filtreler Göstergesi */}
      {(filters.style || filters.color || filters.season || filters.maxPrice !== 1000) && (
        <div className="mt-4 pt-4 border-t border-white/30">
          <div className="flex flex-wrap gap-2">
            {filters.style && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Stil: {filters.style}
                <button
                  onClick={() => handleFilterChange('style', '')}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.color && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Renk: {filters.color}
                <button
                  onClick={() => handleFilterChange('color', '')}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.season && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Mevsim: {filters.season}
                <button
                  onClick={() => handleFilterChange('season', '')}
                  className="ml-2 text-yellow-600 hover:text-yellow-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.maxPrice !== 1000 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Fiyat: ₺{filters.maxPrice}
                <button
                  onClick={() => handleFilterChange('maxPrice', 1000)}
                  className="ml-2 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel; 