// Lightweight zero-dependency static server with AI Travel Concierge for TripStar
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

// Universal Knowledge & AI Response Engine
const TripStarAi = require('./js/ai-engine.js');
const RESIDENCES = TripStarAi.RESIDENCES;

// AI Response Synthesis Engine powered by TripStarAi
function generateAiResponse(userMessage) {
  const result = TripStarAi.answerTravelQuery(userMessage);
  return {
    reply: result.reply,
    recommendedStays: result.recommendedStays || [],
    timestamp: new Date().toISOString()
  };
}

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let reqUrl = parsedUrl.pathname;

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // 1. Real-time Residences API Endpoint
  if (reqUrl === '/api/residences') {
    const category = parsedUrl.searchParams.get('category') || 'all';
    const dest = (parsedUrl.searchParams.get('dest') || '').toLowerCase();

    let filtered = RESIDENCES;
    if (category && category !== 'all') {
      filtered = filtered.filter(r => r.category === category);
    }
    if (dest) {
      filtered = filtered.filter(r => r.location.toLowerCase().includes(dest) || r.title.toLowerCase().includes(dest));
    }

    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({
      status: 'success',
      source: 'TripStar Realtime Residences API',
      timestamp: new Date().toISOString(),
      count: filtered.length,
      residences: filtered
    }));
  }

  // 2. Chat AI Assistant API Endpoint
  if (reqUrl === '/api/chat') {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const parsed = JSON.parse(body || '{}');
          const response = generateAiResponse(parsed.message || '');
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          return res.end(JSON.stringify(response));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Invalid JSON request' }));
        }
      });
      return;
    } else {
      // Handle GET fallback with ?q=...
      const query = parsedUrl.searchParams.get('q') || '';
      const response = generateAiResponse(query);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify(response));
    }
  }

  // 3. Static File Serving
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
  console.log(`\n======================================================`);
  console.log(`  TRIP-STAR Platform & AI Concierge Service`);
  console.log(`  Local server running at: http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});
