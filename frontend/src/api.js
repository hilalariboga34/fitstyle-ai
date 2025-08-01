export async function fetchProducts() {
  try {
    console.log("API çağrısı başlatılıyor...");
    const response = await fetch("http://127.0.0.1:8000/products");
    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(`Veriler alınamadı. Status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("API Response data:", data);
    return data;
  } catch (error) {
    console.error("API Hatası:", error);
    console.error("Error details:", error.message);
    
    // Mock data döndür
    console.log("Mock data kullanılıyor...");
    return [
      {
        id: 1,
        name: "Klasik Beyaz Gömlek",
        description: "Klasik kesim beyaz gömlek, ofis ve günlük kullanım için ideal",
        price: 150.0,
        category: "Gömlek",
        image_url: ""
      },
      {
        id: 2,
        name: "Siyah Kot Pantolon",
        description: "Rahat kesim siyah kot pantolon, her türlü kombin için uygun",
        price: 200.0,
        category: "Pantolon",
        image_url: ""
      },
      {
        id: 3,
        name: "Mavi Blazer Ceket",
        description: "Şık mavi blazer ceket, resmi ve yarı resmi ortamlar için",
        price: 350.0,
        category: "Ceket",
        image_url: ""
      },
      {
        id: 4,
        name: "Kırmızı Elbise",
        description: "Göz alıcı kırmızı elbise, özel günler için mükemmel",
        price: 280.0,
        category: "Elbise",
        image_url: ""
      }
    ];
  }
} 