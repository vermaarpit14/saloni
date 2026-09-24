import {createClient} from '@supabase/supabase-js'
import emailjs from '@emailjs/browser'
import {createContext,useContext,useEffect,useState} from 'react'
const U=import.meta.env.VITE_SUPABASE_URL,K=import.meta.env.VITE_SUPABASE_ANON_KEY
export const configured=!!(U&&K)
export const sb=configured?createClient(U,K):null
export const PH='/placeholder.svg'
export const SiteCtx=createContext({})
export const useSite=()=>useContext(SiteCtx)
export const ListCtx=createContext({items:[],has:()=>false,toggle:()=>{},remove:()=>{},clear:()=>{}})
export const useList=()=>useContext(ListCtx)
export const LangCtx=createContext({lang:'en',setLang:()=>{}})
export const useLang=()=>useContext(LangCtx)
// Every visible text the owner can change from Admin > Texts. [label shown in admin, default text]
export const TEXTS={
nav_catalogue:['Menu: Catalogue','Catalogue'],nav_about:['Menu: About','About'],nav_contact:['Menu: Contact','Contact'],
hero_cta:['Home: hero button','View the catalogue'],cat_heading:['Home: categories heading','Browse by category'],feat_heading:['Home: featured heading','Featured pieces'],view_all:['Home: "View all" link','View all'],
cta_heading:['Home: bottom heading','Tell us what you are looking for'],cta_button:['Home: bottom button','Contact us'],
catalogue_heading:['Catalogue: page heading','Catalogue'],cat_all:['Catalogue: "All" filter','All'],search_ph:['Catalogue: search box hint','Search products'],no_products:['Catalogue: nothing found message','No products found. Try another search or category.'],
enquire_btn:['Product: enquiry button','Enquire about this piece'],whatsapp_btn:['Product: WhatsApp button','WhatsApp us'],related_heading:['Product: related heading','You may also like'],
about_heading:['About: heading (business name is added after it)','About'],about_btn:['About: button','Get in touch'],
contact_heading:['Contact: page heading','Contact'],ph_name:['Contact form: name hint','Name'],ph_email:['Contact form: email hint','Email'],ph_phone:['Contact form: phone hint','Phone'],ph_product:['Contact form: product hint','Product of interest (optional)'],ph_message:['Contact form: message hint','Message'],
form_send:['Contact form: send button','Send message'],form_ok:['Contact form: success message','Thank you. Your message has been sent. We will get back to you soon.'],form_err:['Contact form: error message','The message could not be sent. Please try again or contact us directly.'],
footer_note:['Footer: small line after the copyright',''],
nav_visit:['Menu: Visit us','Visit us'],dimensions_label:['Product: dimensions label','Dimensions'],save_btn:['Product: save to list button','Save to enquiry list'],saved_btn:['Product: already saved label','Saved to your list'],
saved_heading:['Enquiry list: heading','Your enquiry list'],saved_empty:['Enquiry list: empty message','You have not saved any pieces yet. Tap the heart on a product to add it here.'],saved_send:['Enquiry list: send button','Send one enquiry for these pieces'],saved_clear:['Enquiry list: clear button','Clear list'],
testi_heading:['Home: customer reviews heading','What our customers say'],filters_clear:['Catalogue: clear filters','Clear filters'],view3d:['Product: 3D / AR button','View in 3D and in your room'],
visit_heading:['Visit page: heading','Book a showroom visit'],visit_intro:['Visit page: intro text','Tell us when you would like to visit and we will confirm the time with you.'],visit_date:['Visit form: date label','Preferred date'],visit_time:['Visit form: time label','Preferred time'],visit_people:['Visit form: people label','Number of people'],
visit_send:['Visit form: send button','Request a visit'],visit_ok:['Visit form: success message','Thank you. We have received your request and will confirm your visit shortly.'],
slot_morning:['Visit form: morning slot','Morning (10 am to 12 pm)'],slot_afternoon:['Visit form: afternoon slot','Afternoon (12 pm to 4 pm)'],slot_evening:['Visit form: evening slot','Evening (4 pm to 7 pm)'],cursor_view:['Mouse pointer label on products','View'],cursor_explore:['Mouse pointer label on categories','Explore']}
export const TEXTS_HI={nav_catalogue:'कैटलॉग',nav_about:'हमारे बारे में',nav_contact:'संपर्क',nav_visit:'शोरूम आइए',hero_cta:'कैटलॉग देखें',cat_heading:'श्रेणी के अनुसार देखें',feat_heading:'चुनिंदा फ़र्नीचर',view_all:'सभी देखें',cta_heading:'बताइए, आपको क्या चाहिए',cta_button:'संपर्क करें',
catalogue_heading:'कैटलॉग',cat_all:'सभी',search_ph:'प्रोडक्ट खोजें',no_products:'कोई प्रोडक्ट नहीं मिला। दूसरी खोज या श्रेणी आज़माएँ।',enquire_btn:'इस पीस के बारे में पूछें',whatsapp_btn:'WhatsApp करें',related_heading:'ये भी पसंद आ सकते हैं',about_heading:'हमारे बारे में',about_btn:'संपर्क करें',
contact_heading:'संपर्क',ph_name:'नाम',ph_email:'ईमेल',ph_phone:'फ़ोन',ph_product:'पसंदीदा प्रोडक्ट (वैकल्पिक)',ph_message:'संदेश',form_send:'संदेश भेजें',form_ok:'धन्यवाद! आपका संदेश भेज दिया गया है। हम जल्द ही संपर्क करेंगे।',form_err:'संदेश नहीं भेजा जा सका। कृपया दोबारा कोशिश करें या सीधे हमसे संपर्क करें।',
dimensions_label:'माप',save_btn:'एन्क्वायरी लिस्ट में जोड़ें',saved_btn:'लिस्ट में जोड़ा गया',saved_heading:'आपकी एन्क्वायरी लिस्ट',saved_empty:'आपने अभी कोई पीस सेव नहीं किया है। किसी प्रोडक्ट पर दिल के निशान को दबाएँ।',saved_send:'इन सभी पीस के लिए एक एन्क्वायरी भेजें',saved_clear:'लिस्ट खाली करें',
testi_heading:'हमारे ग्राहक क्या कहते हैं',filters_clear:'फ़िल्टर हटाएँ',view3d:'3D में और अपने कमरे में देखें',visit_heading:'शोरूम विज़िट बुक करें',visit_intro:'बताइए आप कब आना चाहेंगे, हम समय की पुष्टि कर देंगे।',visit_date:'पसंदीदा तारीख',visit_time:'पसंदीदा समय',visit_people:'लोगों की संख्या',visit_send:'विज़िट का अनुरोध भेजें',visit_ok:'धन्यवाद! हमें आपका अनुरोध मिल गया है, हम जल्द ही विज़िट की पुष्टि करेंगे।',
slot_morning:'सुबह (10 से 12 बजे)',slot_afternoon:'दोपहर (12 से 4 बजे)',slot_evening:'शाम (4 से 7 बजे)',cursor_view:'देखें',cursor_explore:'खोजें'}
export const useT=()=>{const s=useSite(),{lang}=useLang();return k=>{const o=s.texts||{},v=x=>typeof x==='string'&&x.trim()
if(lang==='hi')return v(o['hi_'+k])||TEXTS_HI[k]||v(o[k])||TEXTS[k]?.[1]||''
return v(o[k])||TEXTS[k]?.[1]||''}}
// Saves a form submission to Supabase (so nothing is lost) and also emails it through EmailJS. Returns 'ok', 'err' or 'config'.
export async function sendEnquiry(f){const V=import.meta.env,mail=V.VITE_EMAILJS_SERVICE_ID&&V.VITE_EMAILJS_TEMPLATE_ID&&V.VITE_EMAILJS_PUBLIC_KEY
if(!mail&&!sb)return 'config'
let saved=false,sent=false
if(sb){try{const row={name:f.name,email:f.email,phone:f.phone||null,product:f.product||null,message:f.message};if(f.kind==='visit')Object.assign(row,{kind:'visit',visit_date:f.visit_date||null,visit_time:f.visit_time||null,people:f.people?+f.people:null})
const {error}=await sb.from('enquiries').insert(row);saved=!error}catch{}}
if(mail){try{await emailjs.send(V.VITE_EMAILJS_SERVICE_ID,V.VITE_EMAILJS_TEMPLATE_ID,{name:f.name,email:f.email,phone:f.phone,message:f.message,product:f.product,reply_to:f.email},{publicKey:V.VITE_EMAILJS_PUBLIC_KEY});sent=true}catch{}}
return saved||sent?'ok':'err'}
// Anonymous usage counter for the admin Analytics tab. No personal data; each event is logged once per visit.
export const track=(type,p)=>{try{if(!sb)return;const k=`sf-ev:${type}:${p?.slug||''}`;if(sessionStorage.getItem(k))return;sessionStorage.setItem(k,'1');sb.from('events').insert({type,product_slug:p?.slug||null,product_name:p?.name||null}).then(()=>{},()=>{})}catch{}}
const lum=h=>{const n=parseInt(h.slice(1),16),w=[.2126,.7152,.0722];return [16,8,0].reduce((a,s,i)=>{const c=((n>>s)&255)/255;return a+w[i]*(c<=.03928?c/12.92:((c+.055)/1.055)**2.4)},0)}
export const contrast=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)}
// Shrinks big phone photos in the browser before upload: max 2000px, WebP. Falls back to the original file if anything fails.
export async function compress(f,max=2000){if(!/^image\/(jpeg|png|webp)$/.test(f.type))return f
try{const b=await createImageBitmap(f),r=Math.min(1,max/Math.max(b.width,b.height)),c=document.createElement('canvas');c.width=Math.round(b.width*r);c.height=Math.round(b.height*r);c.getContext('2d').drawImage(b,0,0,c.width,c.height);b.close?.()
const blob=await new Promise(res=>c.toBlob(res,'image/webp',.82));if(!blob||(r===1&&blob.size>=f.size))return f
return new File([blob],f.name.replace(/\.[^.]+$/,'')+'.webp',{type:'image/webp'})}catch{return f}}
const meta=(k,v,prop)=>{if(!v)return;const a=prop?'property':'name';let e=document.head.querySelector(`meta[${a}="${k}"]`);if(!e){e=document.createElement('meta');e.setAttribute(a,k);document.head.appendChild(e)}e.setAttribute('content',v)}
export function useSEO(title,desc,img){useEffect(()=>{if(title)document.title=title;meta('description',desc);meta('og:title',title,1);meta('og:description',desc,1);meta('og:image',img,1);meta('og:type','website',1);if(img)meta('twitter:card','summary_large_image')},[title,desc,img])}
export const slugify=s=>s.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
export function useAsync(fn,deps=[]){const [s,set]=useState({d:null,l:true});useEffect(()=>{let ok=true;set(x=>({...x,l:true}));fn().then(d=>ok&&set({d,l:false})).catch(()=>ok&&set({d:null,l:false}));return()=>{ok=false}},deps);return s}
const q=async(p,d)=>{if(!sb)return d;const {data,error}=await p(sb);if(error)throw error;return data??d}
export const getSite=()=>q(s=>s.from('site_settings').select('*').eq('id',1).maybeSingle(),{})
export const getHome=()=>q(s=>s.from('homepage_settings').select('*').eq('id',1).maybeSingle(),{})
export const getCarousel=()=>q(s=>s.from('homepage_carousel_items').select('*').eq('active',true).order('sort_order'),[])
export const getCats=()=>q(s=>s.from('categories').select('*').order('sort_order'),[])
export const getProducts=()=>q(s=>s.from('products').select('*,categories(name,slug),product_images(url,sort_order,alt),product_specifications(label,value)').eq('status','published').order('sort_order'),[])
export const getProduct=(slug,preview)=>q(s=>{let x=s.from('products').select('*,categories(name,slug),product_images(url,sort_order,alt),product_specifications(label,value,sort_order)').eq('slug',slug);if(!preview)x=x.eq('status','published');return x.maybeSingle()},null)
export const getTestimonials=()=>q(s=>s.from('testimonials').select('*').eq('active',true).order('sort_order'),[])
export const sorted=a=>[...(a||[])].sort((x,y)=>x.sort_order-y.sort_order)
export const getPage=(slug,preview)=>q(s=>{let x=s.from('pages').select('*').eq('slug',slug);if(!preview)x=x.eq('published',true);return x.maybeSingle()},null)
// Default layout of the home page, top menu and contact form. The admin can change all of these; empty settings fall back to these.
export const DEFAULT_SECTIONS=[{id:'s-hero',type:'hero',visible:true},{id:'s-cat',type:'categories',visible:true},{id:'s-feat',type:'featured',visible:true},{id:'s-mq',type:'marquee',visible:true,text:''},{id:'s-car',type:'carousel',visible:true},{id:'s-story',type:'story',visible:true},{id:'s-show',type:'showcase',visible:true},{id:'s-testi',type:'testimonials',visible:true},{id:'s-cta',type:'cta',visible:true}]
export const DEFAULT_MENU=[{id:'m1',key:'nav_catalogue',label:'',label_hi:'',link:'/catalogue',visible:true,footer:true},{id:'m2',key:'nav_about',label:'',label_hi:'',link:'/about',visible:true,footer:true},{id:'m3',key:'nav_visit',label:'',label_hi:'',link:'/visit',visible:true,footer:true},{id:'m4',key:'nav_contact',label:'',label_hi:'',link:'/contact',visible:true,footer:true}]
export const DEFAULT_FORM=[{id:'f1',key:'name',type:'text',label:'',required:true},{id:'f2',key:'email',type:'email',label:'',required:true},{id:'f3',key:'phone',type:'tel',label:'',required:false},{id:'f4',key:'product',type:'text',label:'',required:false},{id:'f5',key:'message',type:'textarea',label:'',required:true}]
export const isExt=u=>/^(https?:|mailto:|tel:)/i.test(u||'')
export const embedUrl=u=>{u=(u||'').trim();let m=u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/);if(m)return `https://www.youtube-nocookie.com/embed/${m[1]}`;m=u.match(/vimeo\.com\/(\d+)/);return m?`https://player.vimeo.com/video/${m[1]}`:''}
export const cover=p=>sorted(p.product_images)[0]?.url||PH
export const coverAlt=p=>sorted(p.product_images)[0]?.alt||p.name

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
const t=s.theme==='custom'&&Array.isArray(s.custom_theme)&&s.custom_theme.length===4&&s.custom_theme.every(c=>/^#[0-9a-f]{6}$/i.test(c))?['custom','Custom',...s.custom_theme]:(THEMES.find(x=>x[0]===s.theme)||THEMES[0]),r=document.documentElement.style
;['ivory','sand','earth','ink'].forEach((k,i)=>r.setProperty('--color-'+k,t[i+2]))
const n=parseInt(t[2].slice(1),16),dark=((n>>16)&255)*.299+((n>>8)&255)*.587+(n&255)*.114<110
r.setProperty('--color-band',dark?t[3]:t[5]);r.setProperty('--color-bandfg',dark?t[5]:t[2]);r.setProperty('color-scheme',dark?'dark':'light')
const h=HEADS.find(x=>x[0]===s.heading_font)||HEADS[0],b=BODYS.find(x=>x[0]===s.body_font)||BODYS[0]
r.setProperty('--font-serif',`'${h[0]}',${h[2]==='serif'?'Georgia,serif':'system-ui,sans-serif'},'Noto Sans Devanagari'`);r.setProperty('--font-sans',`'${b[0]}',${b[2]==='serif'?'Georgia,serif':'system-ui,sans-serif'},'Noto Sans Devanagari'`)
const fam=[...new Set([h,b])].map(f=>`family=${f[0].replace(/ /g,'+')}:wght@${f[1]}`).concat('family=Noto+Sans+Devanagari:wght@300;400;500').join('&'),u=`https://fonts.googleapis.com/css2?${fam}&display=swap`
let l=document.getElementById('gf');if(!l){l=document.createElement('link');l.id='gf';l.rel='stylesheet';document.head.appendChild(l)}if(l.getAttribute('href')!==u)l.setAttribute('href',u)
localStorage.setItem('sf-theme',JSON.stringify({theme:t[0],heading_font:h[0],body_font:b[0],custom_theme:s.custom_theme}))}catch{}}
try{applyTheme(JSON.parse(localStorage.getItem('sf-theme')||'{}'))}catch{applyTheme({})}
