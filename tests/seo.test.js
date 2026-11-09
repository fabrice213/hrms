import {test} from 'node:test';
import assert from 'node:assert/strict';
import {siteOrigin,seoMarkup,sitemap} from '../seo.js';
import {readFile} from 'node:fs/promises';

test('SEO uses only explicitly configured public HTTPS origins',()=>{
 assert.equal(siteOrigin(''),null);
 assert.equal(siteOrigin('https://example.com/'),'https://example.com');
 for(const invalid of ['http://example.com','https://localhost','https://example.com/path','https://example.com/?x=1','not a url']) assert.throws(()=>siteOrigin(invalid));
 assert.doesNotMatch(seoMarkup(null),/canonical|og:image|og:url/);
 const html=seoMarkup('https://example.com');
 assert.match(html,/rel="canonical" href="https:\/\/example.com\/"/);
 assert.match(html,/application\/ld\+json/);
 assert.match(sitemap('https://example.com'),/<loc>https:\/\/example.com\/<\/loc>/);
});
test('public landing page is readable HTML and private app requests no indexing',async()=>{
 const home=await readFile('index.html','utf8');const app=await readFile('app.html','utf8');
 assert.match(home,/<h1>/);assert.match(home,/<main>/);assert.match(home,/href="\/app.html"/);assert.match(home,/Attendance tracking/);
 assert.match(app,/<meta name="robots" content="noindex, nofollow"/);
});
