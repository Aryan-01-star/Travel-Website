// Lightweight zero-dependency static server for TripStar
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let reqUrl = parsedUrl.pathname;

  // Real-time Residences API Endpoint
  if (reqUrl === '/api/residences') {
    const category = parsedUrl.searchParams.get('category') || 'all';
    const dest = (parsedUrl.searchParams.get('dest') || '').toLowerCase();

    const RESIDENCES = [
      {
        id: "stay-ny",
        title: "Manhattan Sky Residence",
        location: "New York City, United States",
        price: 380,
        badge: "Penthouse",
        category: "urban",
        guests: 4,
        type: "Luxury Penthouse",
        features: ["Skyline View", "Concierge", "Private Terrace"],
        availability: "Instant Booking",
        img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80"
      },
      {
        id: "stay-swiss",
        title: "Zermatt Alpine Chalet",
        location: "Zermatt, Switzerland",
        price: 295,
        badge: "Chalet",
        category: "chalet",
        guests: 6,
        type: "Alpine Chalet",
        features: ["Sauna", "Matterhorn View", "Ski-in Access"],
        availability: "Available Today",
        img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80"
      },
      {
        id: "stay-santorini",
        title: "Oia Cliffside Sanctuary",
        location: "Santorini, Greece",
        price: 340,
        badge: "Oceanfront",
        category: "villa",
        guests: 2,
        type: "Cliff Villa",
        features: ["Caldera Sunset", "Infinity Plunge Pool", "Private Chef"],
        availability: "Only 2 suites left",
        img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80"
      },
      {
        id: "stay-kyoto",
        title: "Gion Heritage Machiya",
        location: "Kyoto, Japan",
        price: 210,
        badge: "Historic",
        category: "estate",
        guests: 3,
        type: "Traditional Machiya",
        features: ["Zen Garden", "Hinoki Wood Bath", "Tea Ceremony Room"],
        availability: "Available Today",
        img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=80"
      },
      {
        id: "stay-paris",
        title: "Saint-Germain Haussmann Suite",
        location: "Paris, France",
        price: 260,
        badge: "Suite",
        category: "urban",
        guests: 2,
        type: "Haussmann Suite",
        features: ["Balcony View", "Wine Cellar Access", "Art Deco Interior"],
        availability: "Instant Booking",
        img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80"
      },
      {
        id: "stay-bali",
        title: "Ubud Rainforest Villa",
        location: "Bali, Indonesia",
        price: 180,
        badge: "Villa",
        category: "villa",
        guests: 4,
        type: "Rainforest Villa",
        features: ["Private Infinity Pool", "Jungle Canopy", "Floating Breakfast"],
        availability: "Available this week",
        img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=80"
      }
    ];

    let filtered = RESIDENCES;
    if (category && category !== 'all') {
      filtered = filtered.filter(r => r.category === category);
    }
    if (dest) {
      filtered = filtered.filter(r => r.location.toLowerCase().includes(dest) || r.title.toLowerCase().includes(dest));
    }

    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache'
    });
    return res.end(JSON.stringify({
      status: 'success',
      source: 'TripStar Realtime Residences API',
      timestamp: new Date().toISOString(),
      count: filtered.length,
      residences: filtered
    }));
  }

  if (reqUrl === '/') reqUrl = '/index.html';

  let filePath = path.join(ROOT, decodeURIComponent(reqUrl));

  // Security: prevent directory traversal
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('403 Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(`
        <!DOCTYPE html>
        <html>
        <head><title>404 Not Found</title><style>body{font-family:-apple-system,BlinkMacSystemFont,sans-serif;background:#FAF9F6;color:#121212;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;flex-direction:column}h1{font-size:2rem;margin-bottom:8px}p{color:#6E6E73;margin:0}a{color:#111111;background:#E5E5EA;padding:8px 18px;border-radius:9999px;font-weight:600;margin-top:20px;text-decoration:none;transition:all .2s}a:hover{background:#111111;color:#fff}</style></head>
        <body>
          <h1>404 - Page Not Found</h1>
          <p>The requested file does not exist.</p>
          <a href="/index.html">← Return to TripStar Home</a>
        </body>
        </html>
      `);
    }

    if (stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        return res.end('500 Internal Server Error');
      }
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`  TRIP-STAR Apple-Redesigned Platform`);
  console.log(`  Local server running at: http://localhost:${PORT}`);
  console.log(`========================================\n`);
});
