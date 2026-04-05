const http = require('http');
const fs = require('fs');
const path = require('path');
const dir = __dirname;
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.woff2': 'font/woff2'
};
http.createServer((req, res) => {
  let filePath = path.join(dir, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not Found'); return; }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}).listen(8080, () => console.log('Server running at http://localhost:8080'));
