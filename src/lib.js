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
