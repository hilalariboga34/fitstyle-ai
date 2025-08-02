import React, { useState } from "react";

function ChatPanel({ setProducts }) {
  const [messages, setMessages] = useState([
    { text: "Hoş geldiniz! Size nasıl yardımcı olabilirim?", from: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSend = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, from: "user" }]);
    setInput("");

    setIsLoading(true);
    setError(null);

    // Mock response - gerçek API yerine
    setTimeout(() => {
      const mockProducts = [
        {
          id: 1,
          name: "Klasik Beyaz Gömlek",
          description: "Klasik kesim beyaz gömlek, ofis ve günlük kullanım için ideal",
          price: 150.0,
          category: "Gömlek",
          image_url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop"
        },
        {
          id: 2,
          name: "Siyah Kot Pantolon",
          description: "Rahat kesim siyah kot pantolon, her türlü kombin için uygun",
          price: 200.0,
          category: "Pantolon",
          image_url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop"
        },
        {
          id: 3,
          name: "Mavi Blazer Ceket",
          description: "Şık mavi blazer ceket, resmi ve yarı resmi ortamlar için",
          price: 350.0,
          category: "Ceket",
          image_url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop"
        }
      ];
      
      setProducts(mockProducts);
      setIsLoading(false);
      setMessages(prev => [...prev, { text: "Size özel ürünler bulundu! Sağ panelde görebilirsiniz.", from: "bot" }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[400px] lg:h-[600px]">
      {/* Mesaj Geçmişi */}
      <div className="flex-1 overflow-y-auto mb-4 bg-gray-50 rounded p-2 border">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 text-sm ${msg.from === "user" ? "text-right" : "text-left text-blue-700"}`}
          >
            {msg.text}
          </div>
        ))}
        
        {/* Loading durumu */}
        {isLoading && (
          <div className="text-center text-gray-600 text-sm">
            <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            Öneriler aranıyor...
          </div>
        )}
        
        {/* Error durumu */}
        {error && (
          <div className="text-center text-red-600 text-sm bg-red-50 p-2 rounded">
            ⚠️ {error}
          </div>
        )}
      </div>
      
      {/* Mesaj Girişi */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Mesajınızı yazın..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          className={`px-4 py-1 rounded transition-colors ${
            isLoading 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-blue-600 hover:bg-blue-700"
          } text-white`}
          disabled={isLoading}
        >
          {isLoading ? "Gönderiliyor..." : "Gönder"}
        </button>
      </form>
    </div>
  );
}

export default ChatPanel; 