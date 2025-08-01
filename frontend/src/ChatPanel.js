import React, { useState } from "react";
import axios from "axios";

function ChatPanel({ setProducts, setIsLoading, setError }) {
  const [messages, setMessages] = useState([
    { text: "Hoş geldiniz!", from: "bot" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, from: "user" }]);
    setInput("");

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:8000/recommend", {
        text: userMessage,
        cinsiyet: "kadin",
      });

      const productList = response.data;
      setProducts(productList);
      setIsLoading(false);
      
      // Bot yanıtı ekle
      setMessages(prev => [...prev, { text: "Size özel ürünler bulundu!", from: "bot" }]);
    } catch (error) {
      console.error("API isteği başarısız:", error);
      setIsLoading(false);
      setError("Öneriler yüklenirken bir hata oluştu.");
      setMessages(prev => [...prev, { text: "Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.", from: "bot" }]);
    }
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
      </div>
      {/* Mesaj Girişi */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded px-2 py-1 focus:outline-none"
          placeholder="Mesajınızı yazın..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Gönder
        </button>
      </form>
    </div>
  );
}

export default ChatPanel; 