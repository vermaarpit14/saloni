import {createClient} from '@supabase/supabase-js'
import {createContext,useContext,useEffect,useState} from 'react'
const U=import.meta.env.VITE_SUPABASE_URL,K=import.meta.env.VITE_SUPABASE_ANON_KEY
export const configured=!!(U&&K)
export const sb=configured?createClient(U,K):null
export const PH='/placeholder.svg'
export const SiteCtx=createContext({})
export const useSite=()=>useContext(SiteCtx)
export const slugify=s=>s.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
export function useAsync(fn,deps=[]){const [s,set]=useState({d:null,l:true});useEffect(()=>{let ok=true;set(x=>({...x,l:true}));fn().then(d=>ok&&set({d,l:false})).catch(()=>ok&&set({d:null,l:false}));return()=>{ok=false}},deps);return s}
const q=async(p,d)=>{if(!sb)return d;const {data,error}=await p(sb);if(error)throw error;return data??d}
export const getSite=()=>q(s=>s.from('site_settings').select('*').eq('id',1).maybeSingle(),{})
export const getHome=()=>q(s=>s.from('homepage_settings').select('*').eq('id',1).maybeSingle(),{})
export const getCarousel=()=>q(s=>s.from('homepage_carousel_items').select('*').eq('active',true).order('sort_order'),[])
export const getCats=()=>q(s=>s.from('categories').select('*').order('sort_order'),[])
export const getProducts=()=>q(s=>s.from('products').select('*,categories(name,slug),product_images(url,sort_order)').eq('status','published').order('sort_order'),[])
export const getProduct=slug=>q(s=>s.from('products').select('*,categories(name,slug),product_images(url,sort_order),product_specifications(label,value,sort_order)').eq('slug',slug).eq('status','published').maybeSingle(),null)
export const sorted=a=>[...(a||[])].sort((x,y)=>x.sort_order-y.sort_order)
export const cover=p=>sorted(p.product_images)[0]?.url||PH

export const THEMES=[
['ivory-clay','Ivory and Clay','#f2ece1','#e3d8c6','#7d6247','#24221f'],
['linen-sage','Linen and Sage','#eef0e8','#dde2d3','#5f6f52','#1f2a1d'],
['bone-ink','Bone and Ink','#f4f4f1','#e2e2dd','#55554f','#151515'],
['blush-walnut','Blush and Walnut','#f6ece8','#ead9d2','#8a5a44','#2b1f1b'],
['desert','Desert Dusk','#f3e9dc','#e6d3ba','#a4583a','#2a1d15'],
['mist-slate','Mist and Slate','#eceff1','#d9dfe4','#48607a','#1a232c'],
['olive-cream','Olive and Cream','#f3f1e4','#e1dec2','#6b6b2f','#23240f'],
['oat-navy','Oat and Navy','#f1ede4','#e0d9c8','#2f4a6b','#1b2230'],
['charcoal-brass','Charcoal and Brass','#171614','#2a2825','#c4a06a','#ece6da'],
['midnight-gold','Midnight and Gold','#0f1720','#1f2b38','#c9a75f','#e8e4da'],
['forest-ivory','Forest and Ivory','#10201a','#1d332a','#b9a877','#e9e6d8'],
['rosewood','Rosewood','#1e1416','#33232a','#d1a38f','#f0e5df']]
export const HEADS=[['Cormorant Garamond','400;500;600','serif'],['Playfair Display','400;500;600','serif'],['Fraunces','400;500;600','serif'],['DM Serif Display','400','serif'],['Libre Baskerville','400;700','serif'],['Bodoni Moda','400;500;600','serif'],['Marcellus','400','serif'],['Jost','400;500','sans-serif']]
export const BODYS=[['Jost','300;400;500','sans-serif'],['Inter','300;400;500','sans-serif'],['DM Sans','300;400;500','sans-serif'],['Manrope','300;400;500','sans-serif'],['Work Sans','300;400;500','sans-serif'],['Lora','400;500','serif']]
export function applyTheme(s={}){try{
const t=THEMES.find(x=>x[0]===s.theme)||THEMES[0],r=document.documentElement.style
;['ivory','sand','earth','ink'].forEach((k,i)=>r.setProperty('--color-'+k,t[i+2]))
const n=parseInt(t[2].slice(1),16),dark=((n>>16)&255)*.299+((n>>8)&255)*.587+(n&255)*.114<110
r.setProperty('--color-band',dark?t[3]:t[5]);r.setProperty('--color-bandfg',dark?t[5]:t[2]);r.setProperty('color-scheme',dark?'dark':'light')
const h=HEADS.find(x=>x[0]===s.heading_font)||HEADS[0],b=BODYS.find(x=>x[0]===s.body_font)||BODYS[0]
r.setProperty('--font-serif',`'${h[0]}',${h[2]==='serif'?'Georgia,serif':'system-ui,sans-serif'}`);r.setProperty('--font-sans',`'${b[0]}',${b[2]==='serif'?'Georgia,serif':'system-ui,sans-serif'}`)
const fam=[...new Set([h,b])].map(f=>`family=${f[0].replace(/ /g,'+')}:wght@${f[1]}`).join('&'),u=`https://fonts.googleapis.com/css2?${fam}&display=swap`
let l=document.getElementById('gf');if(!l){l=document.createElement('link');l.id='gf';l.rel='stylesheet';document.head.appendChild(l)}if(l.getAttribute('href')!==u)l.setAttribute('href',u)
localStorage.setItem('sf-theme',JSON.stringify({theme:t[0],heading_font:h[0],body_font:b[0]}))}catch{}}
try{applyTheme(JSON.parse(localStorage.getItem('sf-theme')||'{}'))}catch{applyTheme({})}
