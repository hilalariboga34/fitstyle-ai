# FitStyle AI - Yapay Zeka Destekli Kişisel Moda Asistanı

---

## 🎯 Proje Hakkında

**FitStyle AI**, kullanıcılara doğal dildeki isteklerine göre kişiselleştirilmiş kıyafet ve kombin önerileri sunan, yapay zeka destekli modern bir web uygulamasıdır. "Ne giyeceğim?" sorununa teknolojik bir çözüm sunarak, standart e-ticaret deneyimini her kullanıcı için kişisel bir stil danışmanlığı yolculuğuna dönüştürür.

---

## ✨ Öne Çıkan Özellikler

- **🤖 Akıllı Sohbet Arayüzü:** Kullanıcılar, "ofis için şık bir kombin" veya "rahat bir pantolon arıyorum" gibi isteklerini doğrudan yazarak yapay zekadan öneri alabilir.
- **🧠 Niyet Analizi:** Backend'de çalışan yapay zeka modülü, kullanıcının cümlesindeki stil, ürün türü ve renk gibi anahtar kelimeleri analiz ederek gerçek niyetini anlar.
- **👤 Kullanıcı Profilleri:** Kullanıcılar sisteme kaydolup giriş yapabilir.
- **❤️ Favoriler Sistemi:** Giriş yapmış kullanıcılar, beğendikleri ürünleri favorilerine ekleyerek kendi kişisel koleksiyonlarını oluşturabilir ve "Favorilerim" sayfasında görüntüleyebilir.
- **🔗 Dinamik Arayüz:** Kullanıcının giriş durumuna göre arayüz dinamik olarak değişir ("Giriş Yap" / "Çıkış Yap" butonları gibi).

---

## 🛠️ Kullanılan Teknolojiler

| Katman      | Teknoloji                                       |
| :---------- | :---------------------------------------------- |
| **Frontend** | `React`, `Tailwind CSS`, `axios`, `react-router-dom` |
| **Backend** | `Python`, `FastAPI`, `SQLAlchemy`               |
| **Veritabanı**| `PostgreSQL`                                    |
| **Altyapı** | `Docker`, `Docker Compose`                      |
| **Yapay Zeka**| Doğal Dil İşleme (NLP) ve Kural Tabanlı Mantık  |

---

## 🚀 Kurulum ve Çalıştırma

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin.

### Gereksinimler

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js](https://nodejs.org/en/) (npm dahil)

### Adım Adım Kurulum

1.  **Projeyi Klonlayın:**
    ```bash
    git clone [https://github.com/kullanici-adiniz/fitstyle-ai.git](https://github.com/kullanici-adiniz/fitstyle-ai.git)
    cd fitstyle-ai
    ```

2.  **Backend'i Başlatın:**
    Projenin ana dizinindeyken, Docker'ı kullanarak veritabanını ve backend sunucusunu başlatın.
    - Eğer daha önce çalıştırdıysanız ve temiz bir başlangıç yapmak istiyorsanız, önce aşağıdaki komutla eski verileri silin:
        ```bash
        docker-compose down -v
        ```
    - Ardından, backend'i inşa etmek ve başlatmak için şu komutu çalıştırın:
        ```bash
        docker-compose up --build
        ```
    Bu terminali açık bırakın. Backend sunucusu artık `http://localhost:8000` adresinde çalışıyor.

3.  **Frontend'i Başlatın:**
    - **Yeni bir terminal** açın.
    - Frontend klasörüne gidin:
        ```bash
        cd frontend
        ```
    - Gerekli paketleri kurun (bu işlem sadece ilk kurulumda gereklidir):
        ```bash
        npm install
        ```
    - Frontend geliştirme sunucusunu başlatın:
        ```bash
        npm start
        ```

4.  **Uygulamayı Açın:**
    - Web tarayıcınızı açın ve `http://localhost:3000` adresine gidin. Uygulama artık kullanıma hazır!

---

## 👥 Ekip Üyeleri

- **Emine Naz Duran:** Yapay Zeka / Kalite Güvence
- **Hilal Gül Arıboğa:** Backend Geliştirici
- **Gamze Kartal:** Frontend Geliştirici
