import {useEffect,useState} from 'react'
import {Link} from 'react-router-dom'
import {ArrowUp,ArrowDown,Trash2} from 'lucide-react'
import {sb,configured,slugify} from './lib.js'
const up=async f=>{const p=`${crypto.randomUUID()}-${f.name.replace(/[^\w.-]/g,'_')}`;const {error}=await sb.storage.from('product-images').upload(p,f);if(error)throw error;return sb.storage.from('product-images').getPublicUrl(p).data.publicUrl}
const T=({children})=><h2 className="mb-4 font-serif text-3xl">{children}</h2>
function Editor({table,fields,single,blank={},Extra}){
const [rows,setRows]=useState([]),[f,setF]=useState(null),[m,setM]=useState('')
const load=async()=>{if(single){const {data}=await sb.from(table).select('*').eq('id',1).maybeSingle();setF(data||{id:1});return}const {data}=await sb.from(table).select('*').order('sort_order');setRows(data||[])}
useEffect(()=>{setF(null);load()},[table])
const save=async e=>{e.preventDefault();setM('Saving…');const r={...f};if(!single&&r.sort_order==null)r.sort_order=rows.length;if(fields.some(x=>x.k==='slug')&&!r.slug)r.slug=slugify(r.name||'')
const {data,error}=await sb.from(table).upsert(r).select().single();if(error){setM(error.message);return}setF(data);setM('Saved');load()}
const del=async r=>{if(!confirm('Delete this item? This cannot be undone.'))return;await sb.from(table).delete().eq('id',r.id);setF(null);load()}
const mv=async(i,d)=>{const a=[...rows],j=i+d;if(j<0||j>=a.length)return;[a[i],a[j]]=[a[j],a[i]];await Promise.all(a.map((r,k)=>sb.from(table).update({sort_order:k}).eq('id',r.id)));load()}
const fld=x=>{const v=f[x.k]??'',set=val=>setF(o=>({...o,[x.k]:val}))
if(x.t==='textarea')return <textarea className="inp" rows={5} value={v} onChange={e=>set(e.target.value)}/>
if(x.t==='select')return <select className="inp" value={v} onChange={e=>set(e.target.value||null)}>{!x.r&&<option value="">None</option>}{x.o.map(([a,b])=><option key={a} value={a}>{b}</option>)}</select>
if(x.t==='check')return <input type="checkbox" checked={!!f[x.k]} onChange={e=>set(e.target.checked)}/>
if(x.t==='image')return <div>{v&&<img src={v} alt="" className="mb-2 h-24"/>}<input type="file" accept="image/*" onChange={async e=>{try{setM('Uploading…');set(await up(e.target.files[0]));setM('Image uploaded. Press Save to keep it.')}catch(er){setM(er.message)}}}/></div>
return <input className="inp" required={x.r} value={v} onChange={e=>set(e.target.value)}/>}
return <div>{!single&&<><button className="btn mb-4" onClick={()=>{setF({...blank});setM('')}}>Add new</button>
<ul className="mb-8 divide-y divide-sand border border-sand">{rows.map((r,i)=><li key={r.id} className="flex items-center gap-3 p-3">{r.image_url&&<img src={r.image_url} alt="" className="h-10 w-10 object-cover"/>}<button className="flex-1 text-left" onClick={()=>{setF(r);setM('')}}>{r.name||r.caption||'Image'}{r.status&&<span className="ml-2 text-xs text-earth">{r.status}{r.featured?', featured':''}</span>}</button>
<button aria-label="Move up" onClick={()=>mv(i,-1)}><ArrowUp size={16}/></button><button aria-label="Move down" onClick={()=>mv(i,1)}><ArrowDown size={16}/></button><button aria-label="Delete" onClick={()=>del(r)}><Trash2 size={16}/></button></li>)}{!rows.length&&<li className="p-3 text-sm">Nothing here yet.</li>}</ul></>}
{f&&<form onSubmit={save} className="max-w-2xl space-y-4">{fields.map(x=><label key={x.k} className="block text-sm">{x.l}<div className="mt-1">{fld(x)}</div></label>)}<button className="btn">Save changes</button><span className="ml-4 text-sm" role="status">{m}</span>
{Extra&&f.id&&<Extra pid={f.id}/>}</form>}</div>}
function Extra({pid}){
const [im,setIm]=useState([]),[sp,setSp]=useState(''),[m,setM]=useState('')
const load=async()=>{const a=await sb.from('product_images').select('*').eq('product_id',pid).order('sort_order');setIm(a.data||[]);const b=await sb.from('product_specifications').select('*').eq('product_id',pid).order('sort_order');setSp((b.data||[]).map(r=>`${r.label}: ${r.value}`).join('\n'))}
useEffect(()=>{load()},[pid])
const add=async e=>{const fs=[...e.target.files];setM('Uploading…');try{for(const [k,file] of fs.entries())await sb.from('product_images').insert({product_id:pid,url:await up(file),sort_order:im.length+k});setM('')}catch(er){setM(er.message)}load()}
const mv=async(i,d)=>{const a=[...im],j=i+d;if(j<0||j>=a.length)return;[a[i],a[j]]=[a[j],a[i]];await Promise.all(a.map((r,k)=>sb.from('product_images').update({sort_order:k}).eq('id',r.id)));load()}
const del=async r=>{await sb.from('product_images').delete().eq('id',r.id);load()}
const saveSp=async()=>{await sb.from('product_specifications').delete().eq('product_id',pid);const rows=sp.split('\n').filter(l=>l.includes(':')).map((l,k)=>{const i=l.indexOf(':');return{product_id:pid,label:l.slice(0,i).trim(),value:l.slice(i+1).trim(),sort_order:k}}).filter(r=>r.label&&r.value);if(rows.length)await sb.from('product_specifications').insert(rows);setM('Specifications saved');load()}
return <div className="space-y-4 border-t border-sand pt-6"><T>Images</T><p className="text-sm">The first image is the cover image.</p><div className="flex flex-wrap gap-3">{im.map((r,i)=><div key={r.id} className="w-24"><img src={r.url} alt="" className="h-24 w-24 object-cover"/><div className="flex justify-between pt-1"><button type="button" aria-label="Move earlier" onClick={()=>mv(i,-1)}><ArrowUp size={14}/></button><button type="button" aria-label="Move later" onClick={()=>mv(i,1)}><ArrowDown size={14}/></button><button type="button" aria-label="Delete image" onClick={()=>del(r)}><Trash2 size={14}/></button></div></div>)}</div>
<input type="file" multiple accept="image/*" onChange={add}/><T>Specifications</T><p className="text-sm">One per line, like “Material: Teak wood”.</p><textarea className="inp" rows={6} value={sp} onChange={e=>setSp(e.target.value)}/><button type="button" className="btn" onClick={saveSp}>Save specifications</button><span className="ml-4 text-sm" role="status">{m}</span></div>}
const CAT=[{k:'name',l:'Category name',r:1},{k:'slug',l:'Web address name (filled in automatically if empty)'},{k:'description',l:'Description',t:'textarea'},{k:'image_url',l:'Image',t:'image'}]
const CAR=[{k:'image_url',l:'Image',t:'image'},{k:'caption',l:'Caption'},{k:'link_url',l:'Link (optional)'},{k:'active',l:'Show on homepage',t:'check'}]
const HOME=[{k:'hero_title',l:'Hero title'},{k:'hero_subtitle',l:'Hero subtitle'},{k:'hero_image_url',l:'Hero image',t:'image'},{k:'story_title',l:'Story title'},{k:'story_body',l:'Story text',t:'textarea'},{k:'story_image_url',l:'Story image',t:'image'},{k:'showcase_image_url',l:'Showcase image (full width)',t:'image'}]
const SITE=[{k:'business_name',l:'Business name'},{k:'phone',l:'Phone'},{k:'email',l:'Email'},{k:'whatsapp',l:'WhatsApp number (with country code)'},{k:'address',l:'Address',t:'textarea'},{k:'hours',l:'Business hours',t:'textarea'},{k:'map_location',l:'Footer map location (full address or place name, as you would type it in Google Maps)'},{k:'about_body',l:'About page text',t:'textarea'}]
function Products(){const [c,setC]=useState([]);useEffect(()=>{sb.from('categories').select('id,name').order('sort_order').then(({data})=>setC((data||[]).map(x=>[x.id,x.name])))},[])
return <Editor table="products" Extra={Extra} blank={{status:'draft'}} fields={[{k:'name',l:'Product name',r:1},{k:'slug',l:'Web address name (filled in automatically if empty)'},{k:'category_id',l:'Category',t:'select',o:c},{k:'short_description',l:'Short description'},{k:'description',l:'Description',t:'textarea'},{k:'status',l:'Status',r:1,t:'select',o:[['draft','Draft (hidden)'],['published','Published'],['archived','Archived (hidden)']]},{k:'featured',l:'Show on homepage',t:'check'}]}/>}
function Dash(){const [n,setN]=useState({});useEffect(()=>{(async()=>{const c=async(t,s)=>{let x=sb.from(t).select('*',{count:'exact',head:true});if(s)x=x.eq('status',s);return (await x).count};setN({a:await c('products','published'),b:await c('products','draft'),c:await c('products','archived'),d:await c('categories')})})()},[])
return <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{[['Published products',n.a],['Drafts',n.b],['Archived',n.c],['Categories',n.d]].map(([a,b])=><div key={a} className="border border-sand p-5"><p className="font-serif text-4xl">{b??'–'}</p><p className="text-sm">{a}</p></div>)}</div>}
export default function Admin(){
const [ses,setSes]=useState(undefined),[ok,setOk]=useState(false),[tab,setTab]=useState('Dashboard'),[err,setErr]=useState('')
useEffect(()=>{if(!sb){setSes(null);return}sb.auth.getSession().then(({data})=>setSes(data.session));const {data:l}=sb.auth.onAuthStateChange((_,s)=>setSes(s));return()=>l.subscription.unsubscribe()},[])
useEffect(()=>{if(!ses){setOk(false);return}sb.from('profiles').select('is_admin').eq('id',ses.user.id).maybeSingle().then(({data})=>setOk(!!data?.is_admin))},[ses])
const login=async e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.target));const {error}=await sb.auth.signInWithPassword({email:f.email,password:f.password});setErr(error?error.message:'')}
const out=<button className="btn" onClick={()=>sb.auth.signOut()}>Log out</button>
if(!configured)return <p className="p-10">Supabase is not configured. Add your keys to .env (see README).</p>
if(ses===undefined)return null
if(!ses)return <form onSubmit={login} className="mx-auto mt-32 max-w-sm space-y-4 px-6"><h1 className="font-serif text-4xl">Admin login</h1><input name="email" type="email" required className="inp" placeholder="Email" aria-label="Email"/><input name="password" type="password" required className="inp" placeholder="Password" aria-label="Password"/><button className="btn">Log in</button>{err&&<p role="alert">{err}</p>}</form>
if(!ok)return <div className="mx-auto mt-32 max-w-md space-y-4 px-6"><p>This account does not have admin access yet. See the README to grant it.</p>{out}</div>
const tabs={Dashboard:<Dash/>,Products:<Products/>,Categories:<Editor table="categories" fields={CAT}/>,Carousel:<Editor table="homepage_carousel_items" fields={CAR} blank={{active:true}}/>,Homepage:<Editor table="homepage_settings" single fields={HOME}/>,'Business settings':<Editor table="site_settings" single fields={SITE}/>}
return <div className="mx-auto max-w-5xl px-6 py-10"><div className="mb-8 flex flex-wrap items-center justify-between gap-4"><Link to="/" className="font-serif text-2xl">Saloni Furniture admin</Link>{out}</div>
<nav className="mb-8 flex flex-wrap gap-2">{Object.keys(tabs).map(t=><button key={t} onClick={()=>setTab(t)} className={`border px-4 py-1.5 text-sm ${tab===t?'border-ink bg-ink text-ivory':'border-sand'}`}>{t}</button>)}</nav><T>{tab}</T>{tabs[tab]}</div>}
