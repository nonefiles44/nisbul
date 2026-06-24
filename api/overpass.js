// api/overpass.js
// Vercel Serverless Function — Overpass API Proxy

export default async function handler(req, res) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Sorguyu al: GET → ?data=..., POST → body
  let query;
  if (req.method === 'GET') {
    query = req.query.data;
  } else {
    query = await new Promise((resolve) => {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', () => resolve(body));
    });
  }

  if (!query) {
    return res.status(400).json({ error: 'Sorgu parametresi eksik (data)' });
  }

  // Overpass API mirror'ları — daha kapsamlı liste, sırayla dene
  const MIRRORS = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
    'https://overpass.openstreetmap.fr/api/interpreter',  // YENİ — Fransa mirror
    'https://maps.mail.ru/osm/tools/overpass/api/interpreter', // YENİ — Rusya mirror
    'https://overpass.openstreetmap.ru/api/interpreter',
  ];

  const TIMEOUT_MS = 20000; // Her mirror için 20 saniye timeout

  let lastError;

  for (const mirror of MIRRORS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

      const response = await fetch(mirror, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(query)}`,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`Upstream HTTP ${response.status}`);

      const data = await response.json();

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
      res.setHeader('X-Served-By', mirror); // hangi mirror'ın çalıştığını debug için

      return res.status(200).json(data);

    } catch (err) {
      lastError = err;
      console.error(`Mirror başarısız [${mirror}]:`, err.message);
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
