// api/overpass.js
// Vercel Serverless Function — Overpass API Proxy
//
// Tarayıcı → bu endpoint → Overpass API
// CORS sorunu: tarayıcı Overpass'a doğrudan bağlanamaz.
// Bu fonksiyon sunucu tarafında çalışır, CORS kısıtlaması yoktur.
// Tarayıcıya dönerken uygun CORS header'larını ekler.

export default async function handler(req, res) {
  // Yalnızca GET ve POST'a izin ver
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Sorguyu al: GET → ?data=..., POST → body
  let query;
  if (req.method === 'GET') {
    query = req.query.data;
  } else {
    // POST için body'yi string olarak oku
    query = await new Promise((resolve) => {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', () => resolve(body));
    });
  }

  if (!query) {
    return res.status(400).json({ error: 'Sorgu parametresi eksik (data)' });
  }

  // Overpass API mirror'ları — sırayla dene
  const MIRRORS = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
    'https://overpass.openstreetmap.ru/api/interpreter',
  ];

  let lastError;

  for (const mirror of MIRRORS) {
    try {
      const response = await fetch(mirror, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(query)}`,
      });

      if (!response.ok) throw new Error(`Upstream HTTP ${response.status}`);

      const data = await response.json();

      // CORS header'larını ekle — tarayıcının isteği kabul etmesi için
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

      return res.status(200).json(data);

    } catch (err) {
      lastError = err;
      // Bu mirror başarısız, sıradakini dene
    }
  }

  // Tüm mirror'lar başarısız
  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.status(502).json({
    error: 'Tüm Overpass sunucularına erişilemedi',
    detail: lastError?.message,
  });
}
