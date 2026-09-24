// Serves index.html with product/category-specific meta tags, so WhatsApp, Facebook and Google show the right preview.
// The normal site still loads and runs exactly as before.
import {rest,esc,origin} from './_db.js'
const clip=(s,n)=>{s=String(s||'').replace(/\s+/g,' ').trim();return s.length>n?s.slice(0,n-1)+'…':s}
export default async function handler(req,res){
const base=origin(req),{type,slug}=req.query||{}
let html
try{const r=await fetch(`${base}/index.html`);html=await r.text()}catch{res.statusCode=500;return res.end('Error')}
try{
if(/^[a-z0-9-]+$/.test(slug||'')){
const [site]=(await rest('site_settings?id=eq.1&select=business_name,seo_description,og_image_url'))||[],biz=site?.business_name||'Saloni Furniture'
let title,desc,img,url=`${base}/${type}/${slug}`
if(type==='product'){const [p]=(await rest(`products?slug=eq.${slug}&status=eq.published&select=name,short_description,description,seo_title,seo_description,product_images(url,sort_order)`))||[]
if(p){const im=[...(p.product_images||[])].sort((a,b)=>a.sort_order-b.sort_order)[0]
title=`${p.seo_title||p.name} | ${biz}`;desc=clip(p.seo_description||p.short_description||p.description,200);img=im?.url}}
else if(type==='page'){const [c]=(await rest(`pages?slug=eq.${slug}&published=eq.true&select=title,seo_title,seo_description`))||[]
if(c){title=`${c.seo_title||c.title} | ${biz}`;desc=clip(c.seo_description||`${c.title} at ${biz}`,200)}}
else if(type==='category'){const [c]=(await rest(`categories?slug=eq.${slug}&select=name,description,image_url`))||[]
if(c){title=`${c.name} | ${biz}`;desc=clip(c.description||`Browse ${c.name} from ${biz}.`,200);img=c.image_url}}
if(title){img=img||site?.og_image_url
const tags=`<title>${esc(title)}</title><meta name="description" content="${esc(desc)}"><meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${esc(url)}">${img?`<meta property="og:image" content="${esc(img)}"><meta name="twitter:card" content="summary_large_image">`:''}`
html=html.replace(/<title>[^<]*<\/title>/,'').replace(/<meta (name="description"|property="og:[a-z:]+"|name="twitter:[a-z:]+")[^>]*>/g,'').replace('</head>',tags+'</head>')}}
}catch{}
res.setHeader('Content-Type','text/html; charset=utf-8');res.setHeader('Cache-Control','public, s-maxage=300, stale-while-revalidate=86400');res.statusCode=200;res.end(html)}
