import React, { useState } from "react";
import axios from "axios"; // axios'u import etmeyi unutmuyoruz

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

    // ===================================================================
    // ESKİ setTimeout BLOĞU KALDIRILDI, YERİNE GERÇEK API İSTEĞİ GELDİ
    // ===================================================================
    try {
      // Backend'deki /recommend endpoint'ine POST isteği gönderiyoruz
      const response = await axios.post('http://localhost:8000/recommend', {
        text: userMessage 
      });

      // Başarılı olursa, dönen ürünleri ana state'e aktarıyoruz
      setProducts(response.data);
      
      // Başarı mesajını sohbet ekranına ekliyoruz
      const responseMessage = response.data.length > 0
        ? `Size ${response.data.length} özel ürün bulundu! Sağ panelde görebilirsiniz.`
        : "Bu isteğinize uygun bir ürün bulamadım, başka bir şey denemek ister misiniz?";
      
      setMessages(prev => [...prev, { sender: 'ai', text: responseMessage }]);

    } catch (err) {
      // Hata olursa, kullanıcıya bir hata mesajı gösteriyoruz
      const errorMessage = "Üzgünüm, öneri getirirken bir hata oluştu. Lütfen tekrar deneyin.";
      setError(errorMessage);
      console.error("API isteği sırasında hata:", err); // Hatayı konsola yazdırıyoruz
    } finally {
      // İşlem başarılı da olsa, başarısız da olsa yüklenme durumunu bitiriyoruz
      setIsLoading(false);
    }
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
