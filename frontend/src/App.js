import React from "react";
import "./App.css";
import ChatPanel from "./ChatPanel";
import ProductGrid from "./ProductGrid";
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sabit Header */}
      <header className="fixed top-0 left-0 right-0 bg-blue-600 text-white p-6 shadow-lg z-50">
        <h1 className="text-4xl font-bold text-center">FitStyle AI</h1>
      </header>

      {/* Ana İçerik - Header'ın altında başlar */}
      <main className="pt-28 min-h-screen">
        <div className="max-w-6xl mx-auto px-4">
          {/* İki Sütunlu Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sol Sütun - 1/3 genişlik */}
            <div className="lg:col-span-1 flex">
              <div className="bg-white rounded-lg shadow-md p-6 w-full flex flex-col h-[600px]">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Sol Panel</h2>
                {/* Sohbet paneli burada */}
                <ChatPanel />
              </div>
            </div>

            {/* Sağ Sütun - 2/3 genişlik */}
            <div className="lg:col-span-2 flex">
              <div className="bg-white rounded-lg shadow-md p-6 w-full flex-1 h-[600px] overflow-auto">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Sağ Panel</h2>
                {/* Ürün grid burada */}
                <ProductGrid />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
