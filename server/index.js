import http from 'node:http';
import { readFile, mkdir, writeFile, rename } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const file = resolve('data/hrms.json');
const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  if (req.url !== '/api/data') { res.writeHead(404); return res.end(JSON.stringify({ error: 'Not found' })); }
  try {
    if (req.method === 'GET') {
      let data = null;
      try { data = JSON.parse(await readFile(file, 'utf8')); } catch (err) { if (err.code !== 'ENOENT') throw err; }
      return res.end(JSON.stringify(data));
    }
    if (req.method === 'PUT') {
      let body = '';
      for await (const chunk of req) { body += chunk; if (body.length > 1000000) { res.writeHead(413); return res.end(JSON.stringify({error:'Request too large'})); } }
      const data = JSON.parse(body);
      if (!Array.isArray(data.employees) || !Array.isArray(data.leaves)) { res.writeHead(400); return res.end(JSON.stringify({error:'Invalid data'})); }
      await mkdir(dirname(file), { recursive: true });
      const temporary = `${file}.${Date.now()}.tmp`;
      await writeFile(temporary, JSON.stringify(data, null, 2));
      await rename(temporary, file);
      return res.end(JSON.stringify({ok:true}));
    }
    res.writeHead(405); res.end(JSON.stringify({ error: 'Method not allowed' }));
  } catch (err) { console.error(err); res.writeHead(500); res.end(JSON.stringify({error:'Unable to process request'})); }
});
const port = Number(process.env.PORT || 3001);
server.listen(port, '127.0.0.1', () => console.log(`HRMS API listening on port ${port}`));
