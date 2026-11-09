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
    server: { host: '0.0.0.0', allowedHosts: true, proxy: { '/api': 'http://127.0.0.1:3001' } }
  };
});
