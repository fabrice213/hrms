import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { siteOrigin, seoMarkup, sitemap } from './seo.js';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  const origin = siteOrigin(env.VITE_SITE_URL);
  return {
    plugins: [react(), {
      name: 'public-site-seo',
      configureServer(server) {
        // The dev server must never serve local HR data or database files directly.
        server.middlewares.use((req, res, next) => {
          let path = (req.url || '').split('?')[0];
          try { for (let i=0;i<3;i++) { const decoded=decodeURIComponent(path); if(decoded===path) break; path=decoded; } }
          catch { res.statusCode=400; return res.end('Invalid path'); }
          path=path.replaceAll('\\','/').toLowerCase();
          if (/(^|\/)data(?:\/|$)/.test(path) || /\.sqlite(?:-[^/]*)?$/.test(path) || /(^|\/)hrms\.json$/.test(path)) {
            res.statusCode=403; return res.end('Forbidden');
          }
          next();
        });
      },
      transformIndexHtml(html, ctx) {
        if (ctx.filename.endsWith('/index.html')) return html.replace('</head>', `${seoMarkup(origin)}\n</head>`);
        return html;
      },
      generateBundle() {
        if (!origin) return;
        this.emitFile({type:'asset',fileName:'sitemap.xml',source:sitemap(origin)});
        this.emitFile({type:'asset',fileName:'robots.txt',source:`User-agent: *\nDisallow: /api/\nSitemap: ${origin}/sitemap.xml\n`});
      }
    }],
    build: {rollupOptions:{input:{home:resolve('index.html'),app:resolve('app.html')}}},
    server: { host: '0.0.0.0', allowedHosts: true, fs: {deny: ['.env', '.env.*', '*.{crt,pem}', '**/.git/**', '**/data/**', '**/*.sqlite', '**/*.sqlite-*', '**/hrms.json']}, proxy: { '/api': { target: 'http://127.0.0.1:3001', changeOrigin: false } } }
  };
});
