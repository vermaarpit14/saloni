import {useEffect,useState} from 'react'
import {Routes,Route,Link,NavLink,useLocation} from 'react-router-dom'
import {AnimatePresence,MotionConfig,motion,useScroll} from 'framer-motion'
import Lenis from 'lenis'
import {Menu,X} from 'lucide-react'
import {configured,getSite,useAsync,SiteCtx,useSite,applyTheme} from './lib.js'
import {Home,Catalogue,Product,About,Contact,NotFound} from './pages.jsx'
import Admin from './Admin.jsx'
function Nav(){const s=useSite(),loc=useLocation();const {scrollYProgress}=useScroll();const [top,setTop]=useState(true),[open,setOpen]=useState(false)
useEffect(()=>{const f=()=>setTop(scrollY<60);f();addEventListener('scroll',f);return()=>removeEventListener('scroll',f)},[])
useEffect(()=>setOpen(false),[loc.pathname])
const ov=top&&loc.pathname==='/'&&!open
const L=[['/catalogue','Catalogue'],['/about','About'],['/contact','Contact']]
return <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${ov?'py-6 text-[#f6f1e7]':'border-b border-sand bg-ivory/95 py-4 text-ink'}`}>
<motion.div style={{scaleX:scrollYProgress}} className="absolute inset-x-0 bottom-0 h-px origin-left bg-earth"/>
<div className="mx-auto flex max-w-7xl items-center justify-between px-6 md:px-12">
<Link to="/" className="font-serif text-2xl tracking-wide">{s.business_name||'Saloni Furniture'}</Link>
<nav className="hidden gap-10 md:flex">{L.map(([t,n])=><NavLink key={t} to={t} className={({isActive})=>`underline-offset-8 hover:underline ${isActive?'underline':''}`}>{n}</NavLink>)}</nav>
<button className="md:hidden" aria-label="Menu" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></div>
<AnimatePresence>{open&&<motion.nav initial={{opacity:0,height:0}} animate={{opacity:1,height:'100svh'}} exit={{opacity:0,height:0}} className="absolute inset-x-0 top-full flex flex-col gap-6 overflow-hidden bg-ivory px-6 pt-10 font-serif text-4xl text-ink">{L.map(([t,n])=><Link key={t} to={t}>{n}</Link>)}</motion.nav>}</AnimatePresence></header>}
function Footer(){const s=useSite();return <footer className="bg-band px-6 py-16 text-bandfg md:px-12"><div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
<p className="font-serif text-3xl">{s.business_name||'Saloni Furniture'}</p>
<div className="space-y-1 text-sm text-bandfg/80">{s.phone&&<p>{s.phone}</p>}{s.email&&<p>{s.email}</p>}{s.address&&<p className="whitespace-pre-line">{s.address}</p>}</div>
<nav className="flex flex-col gap-1 text-sm"><Link to="/catalogue">Catalogue</Link><Link to="/about">About</Link><Link to="/contact">Contact</Link></nav></div>
{s.map_location&&<iframe title="Our location on the map" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps?q=${encodeURIComponent(s.map_location)}&z=15&output=embed`} className="mx-auto mt-12 block h-56 w-full max-w-7xl border-0 grayscale transition hover:grayscale-0 md:h-64"/>}
<p className="mx-auto mt-12 max-w-7xl text-xs text-bandfg/60">© {new Date().getFullYear()} {s.business_name||'Saloni Furniture'}</p></footer>}
export default function App(){const loc=useLocation();const {d:site}=useAsync(getSite)
useEffect(()=>{if(site&&site.id)applyTheme(site)},[site])
useEffect(()=>{if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;const l=new Lenis();let id;const raf=t=>{l.raf(t);id=requestAnimationFrame(raf)};id=requestAnimationFrame(raf);return()=>{cancelAnimationFrame(id);l.destroy()}},[])
useEffect(()=>{scrollTo(0,0)},[loc.pathname])
if(loc.pathname.startsWith('/admin'))return <Admin/>
return <MotionConfig reducedMotion="user"><SiteCtx.Provider value={site||{}}><Nav/>
{!configured&&<p className="bg-sand px-6 pb-2 pt-20 text-center text-sm">Supabase is not configured yet. Add your keys to .env (see README).</p>}
<AnimatePresence mode="wait"><motion.main key={loc.pathname} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.3}}>
<Routes location={loc}><Route path="/" element={<Home/>}/><Route path="/catalogue" element={<Catalogue/>}/><Route path="/category/:slug" element={<Catalogue/>}/><Route path="/product/:slug" element={<Product/>}/><Route path="/about" element={<About/>}/><Route path="/contact" element={<Contact/>}/><Route path="*" element={<NotFound/>}/></Routes></motion.main></AnimatePresence>
<Footer/></SiteCtx.Provider></MotionConfig>}
