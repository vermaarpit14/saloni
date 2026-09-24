import {rest,esc,origin} from './_db.js'
export default async function handler(req,res){const base=origin(req)
if(req.query?.robots){res.setHeader('Content-Type','text/plain');return res.end(`User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: ${base}/sitemap.xml\n`)}
const [p,c,g]=await Promise.all([rest('products?status=eq.published&select=slug,created_at'),rest('categories?select=slug'),rest('pages?published=eq.true&select=slug')])
const u=(l,d)=>`<url><loc>${esc(base+l)}</loc>${d?`<lastmod>${esc(String(d).slice(0,10))}</lastmod>`:''}</url>`
const xml=`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['/','/catalogue','/about','/visit','/contact'].map(x=>u(x)).join('')}${(g||[]).map(x=>u(`/p/${x.slug}`)).join('')}${(c||[]).map(x=>u(`/category/${x.slug}`)).join('')}${(p||[]).map(x=>u(`/product/${x.slug}`,x.created_at)).join('')}</urlset>`
res.setHeader('Content-Type','application/xml');res.setHeader('Cache-Control','public, s-maxage=3600, stale-while-revalidate=86400');res.end(xml)}
