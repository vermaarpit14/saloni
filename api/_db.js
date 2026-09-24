// Shared helper for Vercel serverless functions. Uses only the public (anon) key, so RLS still protects data.
export const env=()=>({url:(process.env.VITE_SUPABASE_URL||'').replace(/\/$/,''),key:process.env.VITE_SUPABASE_ANON_KEY||''})
export async function rest(path){const {url,key}=env();if(!url||!key)return null
const r=await fetch(`${url}/rest/v1/${path}`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});if(!r.ok)return null;return r.json()}
export const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
export const origin=req=>`https://${req.headers['x-forwarded-host']||req.headers.host}`
