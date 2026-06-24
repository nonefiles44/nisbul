# 🗺️ NişBul — Yakınımdaki İşletmeler

**OpenStreetMap verilerini kullanarak harita üzerinde seçilen bir noktanın etrafındaki işletmeleri bulan modern, tek sayfalık web uygulaması.**

---

## 🚀 Canlı Demo

> GitHub Pages üzerinden yayınlamak için: `Settings → Pages → Branch: main → / (root) → Save`
> Birkaç dakika sonra `https://<kullanıcı-adın>.github.io/<repo-adı>` adresinden erişebilirsin.

---

## ✨ Özellikler

- 📍 **Haritaya tıkla** → merkez noktayı seç
- ⭕ **Yarıçap slider'ı** → 100m ile 5km arasında dinamik çember
- 🔍 **13 kategori**: Kafe, Restoran, Eczane, Süpermarket, Hastane, Banka, Benzin, Okul, Diş Hekimi, Fırın, Spor Salonu, Bar, Psikolog
- 📋 **Sonuç tablosu**: İşletme adı, kategori, adres, iletişim bilgisi
- 🌙 **Koyu tema** + mobil uyumlu (responsive) tasarım
- ⚡ Sıfır kurulum — tek HTML dosyası

---

## 🛠️ Kullanılan Teknolojiler

| Teknoloji | Açıklama |
|-----------|----------|
| [Leaflet.js](https://leafletjs.com/) | Etkileşimli harita kütüphanesi |
| [Overpass API](https://overpass-api.de/) | OpenStreetMap veri sorgu API'si |
| [CartoDB Dark Matter](https://carto.com/basemaps/) | Koyu tema harita katmanı |
| Vanilla JS (ES6+) | Framework gerektirmez |

---

## 📂 Proje Yapısı

```
nisbul/
├── index.html   # Tüm uygulama (HTML + CSS + JS tek dosyada)
└── README.md
```

---

## 💻 Yerel Geliştirme

Dosyayı doğrudan `file://` protokolüyle açmak tarayıcı güvenlik kısıtlamaları nedeniyle **çalışmaz**. Bir yerel sunucu kullanın:

**Python (önerilir):**
```bash
python -m http.server 8000
# → http://localhost:8000
```

**Node.js:**
```bash
npx serve .
# → http://localhost:3000
```

**VS Code:**
- "Live Server" eklentisini yükle → sağ tık → "Open with Live Server"

---

## 🗺️ Nasıl Kullanılır?

1. Sayfayı aç
2. **Kategori seç** (örn. Kafe)
3. **Yarıçap belirle** (örn. 500m)
4. **Haritada bir noktaya tıkla** → merkez marker ve çember belirir
5. **"İşletmeleri Bul"** butonuna bas
6. Sonuçlar haritada 🟢 marker olarak ve altta tablo olarak gösterilir
7. Tablodaki satıra tıklayarak ilgili konuma odaklan

---

## 📡 Veri Kaynağı

Veriler [OpenStreetMap](https://www.openstreetmap.org) katkıcılarına aittir ve [Overpass API](https://overpass-api.de) üzerinden çekilmektedir.

© OpenStreetMap contributors, [ODbL](https://opendatacommons.org/licenses/odbl/)

---

## 📄 Lisans

MIT License — dilediğin gibi kullanabilir, değiştirebilir ve dağıtabilirsin.
