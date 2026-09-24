import {lazy,Suspense,useEffect,useMemo,useRef,useState} from 'react'
import {Routes,Route,Link,NavLink,useLocation} from 'react-router-dom'
import {AnimatePresence,MotionConfig,motion,useScroll} from 'framer-motion'
import Lenis from 'lenis'
import {Menu,X,Heart} from 'lucide-react'
import {configured,getSite,useAsync,SiteCtx,useSite,applyTheme,useT,useSEO,useList,useLang,ListCtx,LangCtx,cover,DEFAULT_MENU,isExt} from './lib.js'
import {Home,Catalogue,Product,About,Contact,Visit,Saved,CustomPage,NotFound} from './pages.jsx'
const Admin=lazy(()=>import('./Admin.jsx'))
function useMenu(){const s=useSite(),t=useT(),{lang}=useLang();return (Array.isArray(s.menu)&&s.menu.length?s.menu:DEFAULT_MENU).filter(m=>m.visible!==false&&m.link).map(m=>({...m,text:(lang==='hi'&&m.label_hi)||m.label||(m.key?t(m.key):m.link)}))}
const MLink=({m,className,children})=>isExt(m.link)?<a href={m.link} className={className} {...(/^https?:/i.test(m.link)?{target:'_blank',rel:'noopener noreferrer'}:{})}>{children}</a>:<NavLink to={m.link} end={m.link==='/'} className={({isActive})=>`${typeof className==='function'?'':className||''} ${isActive?'active':''}`}>{children}</NavLink>
function Cursor(){const dot=useRef(null),ring=useRef(null),lab=useRef(null)
useEffect(()=>{if(!matchMedia('(hover:hover) and (pointer:fine)').matches||matchMedia('(prefers-reduced-motion:reduce)').matches)return
const root=document.documentElement;root.classList.add('has-cursor');let x=-100,y=-100,rx=-100,ry=-100,st='',label='',raf
const mv=e=>{x=e.clientX;y=e.clientY;dot.current.style.opacity=1;const el=e.target.closest?.('[data-cursor],a,button,summary,select,label,input,textarea');const c=el?.dataset?.cursor||'';const n=!el?'':/^(input|textarea)$/i.test(el.tagName)?'hide':c?'label':'link';if(n!==st||c!==label){st=n;label=c;ring.current.dataset.s=n;lab.current.textContent=c}}
const out=()=>{ring.current.dataset.s='hide';dot.current.style.opacity=0}
const tick=()=>{rx+=(x-rx)*.16;ry+=(y-ry)*.16;dot.current.style.transform=`translate3d(${x}px,${y}px,0)`;ring.current.style.transform=`translate3d(${rx}px,${ry}px,0)`;raf=requestAnimationFrame(tick)}
addEventListener('mousemove',mv,{passive:true});root.addEventListener('mouseleave',out);raf=requestAnimationFrame(tick)
return()=>{cancelAnimationFrame(raf);removeEventListener('mousemove',mv);root.removeEventListener('mouseleave',out);root.classList.remove('has-cursor')}},[])
return <><div ref={ring} className="cursor-ring" aria-hidden="true"><span ref={lab}/></div><div ref={dot} className="cursor-dot" aria-hidden="true"/></>}
function ToTop(){const [p,setP]=useState(0),t=useT()
useEffect(()=>{const f=()=>setP(Math.min(1,scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)));f();addEventListener('scroll',f,{passive:true});return()=>removeEventListener('scroll',f)},[])
const R=18,C=2*Math.PI*R
return <button type="button" aria-label="Back to top" tabIndex={p>.08?0:-1} onClick={()=>window.__lenis?window.__lenis.scrollTo(0):scrollTo(0,0)} className={`fixed bottom-5 right-5 z-40 grid h-12 w-12 place-items-center rounded-full bg-ivory text-ink shadow-lg transition duration-500 ${p>.08?'translate-y-0 opacity-100':'pointer-events-none translate-y-4 opacity-0'}`}><svg viewBox="0 0 44 44" className="absolute inset-0 -rotate-90"><circle cx="22" cy="22" r={R} fill="none" stroke="currentColor" strokeOpacity=".15" strokeWidth="2"/><circle cx="22" cy="22" r={R} fill="none" stroke="var(--color-earth)" strokeWidth="2" strokeDasharray={C} strokeDashoffset={C*(1-p)}/></svg><span aria-hidden="true">↑</span></button>}
function Nav(){const s=useSite(),t=useT(),L2=useList(),{lang,setLang}=useLang(),loc=useLocation();const {scrollYProgress}=useScroll();const [top,setTop]=useState(true),[open,setOpen]=useState(false),[hide,setHide]=useState(false),last=useRef(0),menu=useMenu()
useEffect(()=>{const f=()=>{const y=scrollY;setTop(y<60);if(y>220&&y>last.current+4)setHide(true);else if(y<last.current-4||y<=220)setHide(false);last.current=y};f();addEventListener('scroll',f,{passive:true});return()=>removeEventListener('scroll',f)},[])
useEffect(()=>setOpen(false),[loc.pathname])
const ov=top&&loc.pathname==='/'&&!open
const ann=s.announcement_on&&s.announcement_text,nm=s.business_name||'Saloni Furniture'
return <header onFocus={()=>setHide(false)} className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${hide&&!open?'-translate-y-full':''} ${ov?'text-[#f6f1e7]':'border-b border-sand bg-ivory/95 text-ink'}`}>
{ann&&<div className="bg-band px-4 py-1.5 text-center text-xs text-bandfg">{s.announcement_link?<a href={s.announcement_link} className="underline underline-offset-2">{s.announcement_text}</a>:s.announcement_text}</div>}
<motion.div style={{scaleX:scrollYProgress}} className="absolute inset-x-0 bottom-0 h-px origin-left bg-earth"/>
<div className={`mx-auto flex max-w-7xl items-center justify-between px-6 transition-all duration-500 md:px-12 ${ov?'py-6':'py-4'}`}>
<Link to="/" className="font-serif text-2xl tracking-wide">{s.logo_url?<img src={s.logo_url} alt={nm} className="h-8 w-auto md:h-10"/>:nm}</Link>
<div className="flex items-center gap-5 md:gap-8"><nav className="hidden gap-8 md:flex">{menu.map(m=><MLink key={m.id||m.link} m={m} className="u">{m.text}</MLink>)}</nav>
{s.show_language_toggle&&<button className="text-sm" aria-label="Change language" onClick={()=>setLang(lang==='hi'?'en':'hi')}>{lang==='hi'?'EN':'हिं'}</button>}<Link to="/saved" aria-label={t('saved_heading')} className="relative"><Heart size={20}/>{L2.items.length>0&&<span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-earth px-1 text-[10px] text-ivory">{L2.items.length}</span>}</Link><button className="md:hidden" aria-label="Menu" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></div></div>
<AnimatePresence>{open&&<motion.nav initial={{opacity:0,height:0}} animate={{opacity:1,height:'100svh'}} exit={{opacity:0,height:0}} className="absolute inset-x-0 top-full flex flex-col gap-6 overflow-hidden bg-ivory px-6 pt-10 font-serif text-4xl text-ink">{menu.map(m=><MLink key={m.id||m.link} m={m}>{m.text}</MLink>)}</motion.nav>}</AnimatePresence></header>}
function Footer(){const s=useSite(),t=useT(),menu=useMenu().filter(m=>m.footer!==false);const soc=[['Instagram',s.instagram_url],['Facebook',s.facebook_url],['YouTube',s.youtube_url]].filter(x=>x[1]);return <footer className="bg-band px-6 py-16 text-bandfg md:px-12"><div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
<p className="font-serif text-3xl">{s.business_name||'Saloni Furniture'}</p>
<div className="space-y-1 text-sm text-bandfg/80">{s.phone&&<p>{s.phone}</p>}{s.email&&<p>{s.email}</p>}{s.address&&<p className="whitespace-pre-line">{s.address}</p>}</div>
<nav className="flex flex-col gap-1 text-sm">{menu.map(m=><MLink key={m.id||m.link} m={m} className="u self-start">{m.text}</MLink>)}{soc.map(([n,u])=><a key={n} href={u} target="_blank" rel="noopener noreferrer" className="mt-1 first-of-type:mt-3">{n}</a>)}</nav></div>
{s.map_location&&<iframe title="Our location on the map" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps?q=${encodeURIComponent(s.map_location)}&z=15&output=embed`} className="mx-auto mt-12 block h-56 w-full max-w-7xl border-0 grayscale transition hover:grayscale-0 md:h-64"/>}
<p className="mx-auto mt-12 max-w-7xl text-xs text-bandfg/60">© {new Date().getFullYear()} {s.business_name||'Saloni Furniture'}{t('footer_note')&&` · ${t('footer_note')}`}</p></footer>}
export default function App(){const loc=useLocation();const {d:site}=useAsync(getSite)
const [items,setItems]=useState(()=>{try{return JSON.parse(localStorage.getItem('sf-list')||'[]')}catch{return[]}})
useEffect(()=>{try{localStorage.setItem('sf-list',JSON.stringify(items))}catch{}},[items])
const list=useMemo(()=>({items,has:sl=>items.some(x=>x.slug===sl),toggle:p=>setItems(a=>a.some(x=>x.slug===p.slug)?a.filter(x=>x.slug!==p.slug):[...a,{slug:p.slug,name:p.name,img:cover(p)}]),remove:sl=>setItems(a=>a.filter(x=>x.slug!==sl)),clear:()=>setItems([])}),[items])
const [lang,setLangS]=useState(()=>{try{return localStorage.getItem('sf-lang')||'en'}catch{return'en'}})
const setLang=l=>{setLangS(l);try{localStorage.setItem('sf-lang',l)}catch{}}
const eff=site?.show_language_toggle?lang:'en',lv=useMemo(()=>({lang:eff,setLang}),[eff])
useEffect(()=>{document.documentElement.lang=eff==='hi'?'hi':'en'},[eff])
useEffect(()=>{if(site&&site.id)applyTheme(site)},[site])
useEffect(()=>{if(!site?.favicon_url)return;let l=document.querySelector('link[rel="icon"]');if(!l){l=document.createElement('link');l.rel='icon';document.head.appendChild(l)}l.href=site.favicon_url},[site?.favicon_url])
const generic=!/^\/(product|category)\//.test(loc.pathname)&&!loc.pathname.startsWith('/admin')
useSEO(generic&&site?(site.seo_title||site.business_name):'',generic&&site?site.seo_description:'',generic&&site?site.og_image_url:'')
useEffect(()=>{if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;const l=new Lenis();window.__lenis=l;let id;const raf=t=>{l.raf(t);id=requestAnimationFrame(raf)};id=requestAnimationFrame(raf);return()=>{cancelAnimationFrame(id);window.__lenis=null;l.destroy()}},[])
useEffect(()=>{scrollTo(0,0)},[loc.pathname])
if(loc.pathname.startsWith('/admin'))return <Suspense fallback={null}><Admin/></Suspense>
return <MotionConfig reducedMotion="user"><SiteCtx.Provider value={site||{}}><LangCtx.Provider value={lv}><ListCtx.Provider value={list}><Nav/>
{!configured&&<p className="bg-sand px-6 pb-2 pt-20 text-center text-sm">Supabase is not configured yet. Add your keys to .env (see README).</p>}
<AnimatePresence mode="wait"><motion.main key={loc.pathname} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.3}}>
<Routes location={loc}><Route path="/" element={<Home/>}/><Route path="/catalogue" element={<Catalogue/>}/><Route path="/category/:slug" element={<Catalogue/>}/><Route path="/product/:slug" element={<Product/>}/><Route path="/about" element={<About/>}/><Route path="/contact" element={<Contact/>}/><Route path="/visit" element={<Visit/>}/><Route path="/p/:slug" element={<CustomPage/>}/><Route path="/saved" element={<Saved/>}/><Route path="*" element={<NotFound/>}/></Routes></motion.main></AnimatePresence>
<Footer/><Cursor/><ToTop/></ListCtx.Provider></LangCtx.Provider></SiteCtx.Provider></MotionConfig>}
