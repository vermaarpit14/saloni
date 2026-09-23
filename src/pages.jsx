import {useState} from 'react'
import {Link,useParams,useSearchParams} from 'react-router-dom'
import {motion,AnimatePresence,useScroll,useTransform,useMotionValue,useSpring} from 'framer-motion'
import emailjs from '@emailjs/browser'
import {X,Phone,Mail,MapPin,Clock,MessageCircle} from 'lucide-react'
import {useAsync,useSite,getHome,getCats,getProducts,getCarousel,getProduct,cover,sorted,PH} from './lib.js'
const E=[.22,1,.36,1]
const fix=e=>{e.currentTarget.src=PH}
const Pg=({children})=><div className="mx-auto max-w-7xl px-6 pb-24 pt-32 md:px-12">{children}</div>
const Img=({src,alt,className=''})=><motion.div className={`overflow-hidden bg-sand ${className}`} initial={{clipPath:'inset(0 0 100% 0)'}} whileInView={{clipPath:'inset(0 0 0% 0)'}} viewport={{once:true,margin:'-40px'}} transition={{duration:1,ease:E}}><img src={src||PH} alt={alt||''} loading="lazy" onError={fix} className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"/></motion.div>
const Card=({p,i=0})=>{const im=sorted(p.product_images);return <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.6,delay:(i%4)*.08,ease:E}}><Link to={`/product/${p.slug}`} className="group block"><div className="relative"><Img src={cover(p)} alt={p.name} className="aspect-[4/5]"/>{im[1]&&<img src={im[1].url} alt="" loading="lazy" onError={fix} className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"/>}</div><h3 className="mt-3 font-serif text-xl underline-offset-4 group-hover:underline md:text-2xl">{p.name}</h3><p className="text-sm text-earth">{p.categories?.name}</p></Link></motion.div>}
const Head=({n,t,to,more})=><div className="mb-10 flex items-end justify-between gap-4 border-b border-sand pb-4"><h2 className="font-serif text-4xl md:text-6xl">{n&&<span className="mr-3 align-top font-sans text-sm text-earth">{n}</span>}{t}</h2>{to&&<Link to={to} className="shrink-0 pb-2 text-sm underline underline-offset-4">{more}</Link>}</div>
function Mag({children}){const ok=typeof matchMedia!=='undefined'&&matchMedia('(hover:hover) and (pointer:fine)').matches&&!matchMedia('(prefers-reduced-motion:reduce)').matches
const x=useMotionValue(0),y=useMotionValue(0),sx=useSpring(x,{stiffness:220,damping:18}),sy=useSpring(y,{stiffness:220,damping:18})
if(!ok)return children
return <motion.span style={{x:sx,y:sy,display:'inline-block'}} onMouseMove={e=>{const r=e.currentTarget.getBoundingClientRect();x.set((e.clientX-r.left-r.width/2)*.22);y.set((e.clientY-r.top-r.height/2)*.22)}} onMouseLeave={()=>{x.set(0);y.set(0)}}>{children}</motion.span>}
export function Home(){
const s=useSite();const {d:h0}=useAsync(getHome),{d:cats}=useAsync(getCats),{d:prods}=useAsync(getProducts),{d:car}=useAsync(getCarousel)
const h=h0||{};const {scrollY}=useScroll();const y=useTransform(scrollY,[0,900],[0,180])
const feat=(prods||[]).filter(p=>p.featured).slice(0,8),half=car?.length?Array(Math.ceil(8/car.length)).fill(car).flat():[],loop=[...half,...half]
const a=d=>({initial:{y:50,opacity:0},animate:{y:0,opacity:1},transition:{duration:1,delay:d,ease:E}})
return <>
<section className="relative h-[100svh] min-h-[560px] overflow-hidden bg-[#1b1916] text-[#f6f1e7]">
<motion.img style={{y}} src={h.hero_image_url||PH} alt="" onError={fix} className="absolute inset-x-0 -top-10 h-[115%] w-full object-cover opacity-70"/><div className="absolute inset-0 bg-black/30"/>
<div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-14 md:px-12 md:pb-20">
<h1 className="max-w-5xl font-serif text-5xl leading-[1.02] md:text-8xl">{(h.hero_title||s.business_name||'Saloni Furniture').split(' ').map((w,i)=><span key={i} className="mr-[.25em] inline-block overflow-hidden pb-[.1em] align-bottom"><motion.span className="inline-block" initial={{y:'110%'}} animate={{y:0}} transition={{duration:1,delay:.15+i*.07,ease:E}}>{w}</motion.span></span>)}</h1>
{h.hero_subtitle&&<motion.p {...a(.5)} className="mt-5 max-w-xl text-lg font-light text-[#f6f1e7]/85">{h.hero_subtitle}</motion.p>}
<motion.div {...a(.7)}><Mag><Link to="/catalogue" className="btn btn-l mt-8">View the catalogue</Link></Mag></motion.div>
<motion.span aria-hidden="true" className="absolute bottom-0 right-12 hidden h-16 w-px origin-top bg-[#f6f1e7]/60 md:block" animate={{scaleY:[0,1,0]}} transition={{repeat:Infinity,duration:2.6,ease:'easeInOut'}}/></div></section>
{cats?.length>0&&<section className="mx-auto max-w-7xl px-6 py-24 md:px-12"><Head n="01" t="Browse by category" to="/catalogue" more="View all"/>
<div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">{cats.slice(0,4).map(c=><Link key={c.id} to={`/category/${c.slug}`} className="group block"><Img src={c.image_url} alt={c.name} className="aspect-[3/4]"/><h3 className="mt-3 font-serif text-xl underline-offset-4 md:text-2xl group-hover:underline">{c.name}</h3></Link>)}</div></section>}
{feat.length>0&&<section className="mx-auto max-w-7xl px-6 pb-24 md:px-12"><Head n="02" t="Featured pieces" to="/catalogue" more="View all"/><div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">{feat.map((p,i)=><Card key={p.id} p={p} i={i}/>)}</div></section>}
{loop.length>0&&<section className="overflow-hidden border-y border-sand py-10"><div className="marquee flex w-max gap-6">{loop.map((c,i)=>{const B=<figure className="w-64 shrink-0 md:w-80"><img src={c.image_url} alt={c.caption||''} onError={fix} className="aspect-[4/3] w-full object-cover"/>{c.caption&&<figcaption className="mt-2 text-sm">{c.caption}</figcaption>}</figure>;return c.link_url?<a key={i} href={c.link_url}>{B}</a>:<div key={i}>{B}</div>})}</div></section>}
{(h.story_title||h.story_body)&&<section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 md:grid-cols-2 md:px-12">{h.story_image_url&&<Img src={h.story_image_url} className="aspect-[4/5]"/>}<div><h2 className="font-serif text-4xl md:text-6xl">{h.story_title}</h2><p className="mt-6 max-w-prose whitespace-pre-line font-light leading-relaxed">{h.story_body}</p></div></section>}
{h.showcase_image_url&&<Img src={h.showcase_image_url} className="h-[70vh] w-full"/>}
<section className="bg-band px-6 py-28 text-center text-bandfg"><h2 className="mx-auto max-w-3xl font-serif text-4xl md:text-6xl">Tell us what you are looking for</h2><Mag><Link to="/contact" className="btn btn-l mt-10">Contact us</Link></Mag></section></>}
export function Catalogue(){
const {slug}=useParams();const {d:cats}=useAsync(getCats),{d:all,l}=useAsync(getProducts);const [q,setQ]=useState('')
const list=(all||[]).filter(p=>(!slug||p.categories?.slug===slug)&&(p.name+' '+(p.short_description||'')).toLowerCase().includes(q.toLowerCase()))
const cur=(cats||[]).find(c=>c.slug===slug)
return <Pg><h1 className="font-serif text-5xl md:text-7xl">{cur?.name||'Catalogue'}</h1>{cur?.description&&<p className="mt-4 max-w-prose font-light">{cur.description}</p>}
<div className="my-8 flex flex-col gap-4 bg-ivory py-3 md:sticky md:top-16 md:z-30 md:flex-row md:items-center md:justify-between"><div className="flex gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible"><Link to="/catalogue" className={`shrink-0 whitespace-nowrap border px-4 py-1.5 text-sm ${!slug?'border-ink bg-ink text-ivory':'border-sand'}`}>All</Link>{(cats||[]).map(c=><Link key={c.id} to={`/category/${c.slug}`} className={`shrink-0 whitespace-nowrap border px-4 py-1.5 text-sm ${slug===c.slug?'border-ink bg-ink text-ivory':'border-sand'}`}>{c.name}</Link>)}</div>
<input className="inp md:max-w-xs" placeholder="Search products" aria-label="Search products" value={q} onChange={e=>setQ(e.target.value)}/></div>
{!l&&<p className="mb-6 text-sm text-earth">{list.length} {list.length===1?'piece':'pieces'}</p>}{!l&&!list.length?<p>No products found. Try another search or category.</p>:<div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">{list.map((p,i)=><Card key={p.id} p={p} i={i}/>)}</div>}</Pg>}
export function Product(){
const {slug}=useParams();const s=useSite();const {d:all}=useAsync(getProducts);const {d:p,l}=useAsync(()=>getProduct(slug),[slug]);const [i,setI]=useState(0),[box,setBox]=useState(false)
if(l)return <Pg><p>Loading…</p></Pg>;if(!p)return <NotFound/>
const im=sorted(p.product_images).map(x=>x.url);if(!im.length)im.push(PH)
const wa=(s.whatsapp||'').replace(/\D/g,''),rel=(all||[]).filter(x=>x.id!==p.id&&p.category_id&&x.category_id===p.category_id).slice(0,4)
return <Pg><div className="grid gap-10 md:grid-cols-2"><div><button className="block w-full cursor-zoom-in" onClick={()=>setBox(true)}><Img src={im[i]} alt={p.name} className="aspect-[4/5]"/></button>
{im.length>1&&<div className="mt-3 flex gap-2 overflow-x-auto">{im.map((u,k)=><button key={k} onClick={()=>setI(k)} className={`h-20 w-16 shrink-0 border ${k===i?'border-ink':'border-transparent'}`}><img src={u} alt="" onError={fix} className="h-full w-full object-cover"/></button>)}</div>}</div>
<div className="md:sticky md:top-28 md:self-start"><Link to={p.categories?`/category/${p.categories.slug}`:'/catalogue'} className="text-sm text-earth underline">{p.categories?.name||'Catalogue'}</Link>
<h1 className="mt-2 font-serif text-4xl md:text-6xl">{p.name}</h1>{p.short_description&&<p className="mt-4 text-lg font-light">{p.short_description}</p>}
{p.description&&<p className="mt-6 max-w-prose whitespace-pre-line font-light leading-relaxed">{p.description}</p>}
{p.product_specifications?.length>0&&<dl className="mt-8 border-t border-sand">{sorted(p.product_specifications).map((x,k)=><div key={k} className="flex justify-between gap-4 border-b border-sand py-3 text-sm"><dt className="text-earth">{x.label}</dt><dd className="text-right">{x.value}</dd></div>)}</dl>}
<div className="mt-8 flex flex-wrap gap-3"><Mag><Link to={`/contact?product=${encodeURIComponent(p.name)}`} className="btn">Enquire about this piece</Link></Mag>{wa&&<a className="btn btn-o" href={`https://wa.me/${wa}`}>WhatsApp us</a>}</div></div></div>
{rel.length>0&&<section className="mt-24"><Head t="You may also like"/><div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">{rel.map((x,k)=><Card key={x.id} p={x} i={k}/>)}</div></section>}
<AnimatePresence>{box&&<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setBox(false)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"><button aria-label="Close" className="absolute right-5 top-5 text-white"><X/></button><motion.img initial={{scale:.96}} animate={{scale:1}} src={im[i]} alt={p.name} className="max-h-full max-w-full object-contain"/></motion.div>}</AnimatePresence></Pg>}
export function About(){const s=useSite();return <Pg><h1 className="font-serif text-5xl md:text-7xl">About {s.business_name||'us'}</h1><p className="mt-8 max-w-prose whitespace-pre-line font-light leading-relaxed">{s.about_body||'This page can be edited from the admin panel under Business settings.'}</p><Link to="/contact" className="btn mt-8">Get in touch</Link></Pg>}
export function Contact(){
const s=useSite();const [sp]=useSearchParams();const [st,setSt]=useState('')
const send=async e=>{e.preventDefault();const form=e.target,f=Object.fromEntries(new FormData(form)),V=import.meta.env
if(!V.VITE_EMAILJS_SERVICE_ID||!V.VITE_EMAILJS_TEMPLATE_ID||!V.VITE_EMAILJS_PUBLIC_KEY){setSt('config');return}
setSt('sending');try{await emailjs.send(V.VITE_EMAILJS_SERVICE_ID,V.VITE_EMAILJS_TEMPLATE_ID,{name:f.name,email:f.email,phone:f.phone,message:f.message,product:f.product,reply_to:f.email},{publicKey:V.VITE_EMAILJS_PUBLIC_KEY});setSt('ok');form.reset()}catch{setSt('err')}}
const wa=(s.whatsapp||'').replace(/\D/g,'')
const R=({I,children})=>children?<p className="flex gap-3"><I size={18} className="mt-1 shrink-0 text-earth"/><span className="whitespace-pre-line">{children}</span></p>:null
return <Pg><h1 className="font-serif text-5xl md:text-7xl">Contact</h1><div className="mt-12 grid gap-12 md:grid-cols-2">
<form onSubmit={send} className="space-y-4"><input name="name" required className="inp" placeholder="Name" aria-label="Name"/><input name="email" type="email" required className="inp" placeholder="Email" aria-label="Email"/><input name="phone" className="inp" placeholder="Phone" aria-label="Phone"/><input name="product" defaultValue={sp.get('product')||''} className="inp" placeholder="Product of interest (optional)" aria-label="Product of interest"/><textarea name="message" required rows={5} className="inp" placeholder="Message" aria-label="Message"/>
<button className="btn" disabled={st==='sending'}>{st==='sending'?'Sending…':'Send message'}</button>
{st==='ok'&&<p role="status">Thank you. Your message has been sent.</p>}{st==='err'&&<p role="alert">The message could not be sent. Please try again or contact us directly.</p>}{st==='config'&&<p role="alert">Email sending is not set up yet. Add the EmailJS keys to .env.</p>}</form>
<div className="space-y-4 font-light"><R I={Phone}>{s.phone}</R><R I={Mail}>{s.email}</R>{wa&&<p className="flex gap-3"><MessageCircle size={18} className="mt-1 text-earth"/><a className="underline" href={`https://wa.me/${wa}`}>Chat on WhatsApp</a></p>}<R I={MapPin}>{s.address}</R><R I={Clock}>{s.hours}</R></div></div></Pg>}
export function NotFound(){return <Pg><h1 className="font-serif text-6xl">Page not found</h1><p className="mt-4">The page you are looking for does not exist.</p><Link to="/" className="btn mt-8">Back to home</Link></Pg>}
