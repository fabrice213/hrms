// A production URL must be explicit; never guess a canonical domain from a preview host.
export function siteOrigin(value) {
 if(!value) return null;
 let url;
 try {url=new URL(value)} catch {throw new Error('VITE_SITE_URL must be an absolute HTTPS origin, for example https://example.com');}
 if(url.protocol!=='https:'||url.username||url.password||url.pathname!=='/'||url.search||url.hash||url.hostname==='localhost'||url.hostname.endsWith('.localhost')) throw new Error('VITE_SITE_URL must be a public HTTPS origin without a path, query or fragment');
 return url.origin;
}
export function seoMarkup(origin) {
 const schema={'@context':'https://schema.org','@type':'SoftwareApplication',name:'Fabrice HRMS',applicationCategory:'BusinessApplication',operatingSystem:'Web',description:'A local demonstration HR management system for employee records, attendance, leave, payroll tracking and reports.'};
 if(origin) schema.url=`${origin}/`;
 const safeJson=JSON.stringify(schema).replace(/</g,'\\u003c');
 let tags=`<script type="application/ld+json">${safeJson}</script>`;
 if(origin) tags+=`\n<link rel="canonical" href="${origin}/" />\n<meta property="og:url" content="${origin}/" />\n<meta property="og:image" content="${origin}/social.jpg" />\n<meta property="og:image:alt" content="Fabrice HRMS — better people, stronger teams" />\n<meta name="twitter:image" content="${origin}/social.jpg" />`;
 return tags;
}
export function sitemap(origin){return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${origin.replace(/&/g,'&amp;')}/</loc></url>\n</urlset>\n`;}
