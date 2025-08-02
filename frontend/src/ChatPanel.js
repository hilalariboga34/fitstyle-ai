import React, { useState } from "react";

function ChatPanel({ setProducts }) {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hoş geldiniz! Size nasıl yardımcı olabilirim?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput("");

    setIsLoading(true);
    setError(null);

    // Basit mock response
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
        },
        {
          id: 4,
          name: "Kırmızı Elbise",
          description: "Göz alıcı kırmızı elbise, özel günler için mükemmel",
          price: 280.0,
          category: "Elbise",
          image_url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop"
        },
        {
          id: 5,
          name: "Gri Triko Kazak",
          description: "Sıcak ve şık gri triko kazak, kış ayları için ideal",
          price: 120.0,
          category: "Kazak",
          image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop"
        }
      ];
      
      setProducts(mockProducts);
      setIsLoading(false);
      setMessages(prev => [...prev, { sender: 'ai', text: "Size 5 özel ürün bulundu! Sağ panelde görebilirsiniz." }]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-lg">
      {/* Mesajlar Listesi */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, idx) => (
          <div
            key={idx}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
            </div>
          </div>
        ))}
        
        {/* Loading durumu */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 rounded-lg rounded-bl-none border border-gray-200 px-4 py-2 shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm">Öneriler aranıyor...</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Error durumu */}
        {error && (
          <div className="flex justify-start">
            <div className="bg-red-50 text-red-600 rounded-lg rounded-bl-none border border-red-200 px-4 py-2 shadow-sm">
              <div className="flex items-center space-x-2">
                <span className="text-sm">⚠️ {error}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Mesaj Girişi */}
      <div className="border-t border-gray-200 p-4 bg-white rounded-b-lg">
        <form onSubmit={handleSendMessage} className="flex space-x-3">
          <input
            type="text"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Mesajınızı yazın..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
              isLoading 
                ? "bg-gray-400 text-gray-600 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Gönderiliyor..." : "Gönder"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatPanel; 