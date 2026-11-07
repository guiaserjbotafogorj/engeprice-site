(() => {
'use strict';
const cfg=JSON.parse(document.getElementById('site-data').textContent);
const store={get(key,session=false){try{return(session?sessionStorage:localStorage).getItem(key)}catch{return null}},set(key,value,session=false){try{(session?sessionStorage:localStorage).setItem(key,value)}catch{}}};
let consent=store.get('ep-measurement')==='yes';
window.dataLayer=window.dataLayer||[];
function track(event,data={}){if(consent)window.dataLayer.push({event,...data});}
function loadGtm(){if(!consent||!/^GTM-[A-Z0-9]+$/.test(cfg.gtm)||document.getElementById('gtm'))return;window.dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});const s=document.createElement('script');s.id='gtm';s.async=true;s.src='https://www.googletagmanager.com/gtm.js?id='+encodeURIComponent(cfg.gtm);document.head.append(s);}
const banner=document.getElementById('cookie-banner');
if(cfg.gtm&&!store.get('ep-measurement'))banner.hidden=false;
loadGtm();
function setConsent(allow){consent=allow;store.set('ep-measurement',allow?'yes':'no');banner.hidden=true;if(allow)loadGtm();else if(cfg.gtm&&document.getElementById('gtm'))location.reload();}
document.getElementById('cookie-accept').addEventListener('click',()=>setConsent(true));
document.getElementById('cookie-reject').addEventListener('click',()=>setConsent(false));
document.getElementById('cookie-settings').addEventListener('click',()=>{banner.hidden=false;document.getElementById('cookie-reject').focus();});
const toggle=document.querySelector('.menu-toggle'),nav=document.getElementById('navigation');
function closeMenu(){toggle.setAttribute('aria-expanded','false');toggle.firstChild.textContent=cfg.menu+' ';nav.classList.remove('is-open');}
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));toggle.firstChild.textContent=(open?cfg.closeMenu:cfg.menu)+' ';nav.classList.toggle('is-open',open);});
nav.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){closeMenu();toggle.focus();}});
matchMedia('(min-width: 801px)').addEventListener('change',e=>{if(e.matches)closeMenu();});
document.addEventListener('click',event=>{const a=event.target.closest('[data-event]');if(a)track(a.dataset.event,{section:a.dataset.section||undefined,socio:a.dataset.name||undefined});});
const params=new URLSearchParams(location.search);
const utmKeys=['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
for(const key of utmKeys){const value=params.get(key);if(value)store.set('ep-'+key,value.slice(0,300),true);}
// A shared 8-second clock keeps every path and each visible row in sync.
if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
 document.documentElement.classList.add('drawing-ready');
 const startDrawing=svg=>{svg.classList.add('is-drawing');drawingObserver.unobserve(svg);};
 const drawingObserver=new IntersectionObserver(entries=>{
  for(const entry of entries){
   if(!entry.isIntersecting)continue;
   const svg=entry.target, list=svg.closest('.project-list');
   if(!list){startDrawing(svg);continue;}
   const rowTop=svg.getBoundingClientRect().top;
   for(const peer of list.querySelectorAll('svg[data-drawing]')){
    if(Math.abs(peer.getBoundingClientRect().top-rowTop)<4)startDrawing(peer);
   }
  }
 },{threshold:.35});
 document.querySelectorAll('svg[data-drawing]').forEach(svg=>drawingObserver.observe(svg));
}
// Animate once on entry without hiding content or changing document layout.
if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
 const motionObserver=new IntersectionObserver(entries=>{
  for(const entry of entries)if(entry.isIntersecting){
   entry.target.classList.add('has-entered');
   motionObserver.unobserve(entry.target);
  }
 },{threshold:.12,rootMargin:'0px 0px -4% 0px'});
 const motionTargets=document.querySelectorAll('.section-head, .intro > div, .service-row, .process-lead, .process-list li, .client-logos, .partner-copy, .tool-group, .budget-method, .faq-list details, .contact-copy, .contact-form, .google-profile-copy, .google-profile iframe, .footer-main');
 for(const target of motionTargets){target.classList.add('scroll-entry');motionObserver.observe(target);}
}
// Keep text readable throughout; scrolling only adds a small spatial entrance.
if('IntersectionObserver' in window){
 const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
 const closing=document.querySelector('.closing');
 if(closing&&!reducedMotion.matches){
  closing.classList.add('is-scroll-ready');
  const phraseObserver=new IntersectionObserver(entries=>{
   for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('is-in-view');phraseObserver.unobserve(entry.target);}
  },{threshold:.7,rootMargin:'0px 0px -8% 0px'});
  closing.querySelectorAll('p').forEach(p=>phraseObserver.observe(p));
 }
 const mobilePortrait=matchMedia('(max-width: 600px)');
 const portraitObserver=new IntersectionObserver(entries=>{
  for(const entry of entries)entry.target.classList.toggle('is-scroll-color',mobilePortrait.matches&&entry.isIntersecting);
 },{threshold:.35,rootMargin:'-15% 0px -15% 0px'});
 document.querySelectorAll('.portrait-toggle').forEach(p=>portraitObserver.observe(p));
 mobilePortrait.addEventListener('change',()=>{
  document.querySelectorAll('.portrait-toggle').forEach(p=>{p.classList.remove('is-scroll-color');portraitObserver.unobserve(p);portraitObserver.observe(p);});
 });
}
// Mouse hover is temporary. A tap/click or keyboard activation toggles a persistent state.
for(const portrait of document.querySelectorAll('.portrait-toggle')){
  portrait.addEventListener('click',()=>{
    const color=portrait.getAttribute('aria-pressed')!=='true';
    portrait.setAttribute('aria-pressed',String(color));
    portrait.setAttribute('aria-label',color?portrait.dataset.monoLabel:portrait.dataset.colorLabel);
    portrait.classList.toggle('is-color',color);
  });
}
const form=document.getElementById('contact-form'),status=document.getElementById('form-status');
// The markup stays non-submittable if JavaScript is unavailable.
form.querySelector('[type=submit]').disabled=false;
form.addEventListener('submit',async event=>{event.preventDefault();if(!form.reportValidity())return;const data=Object.fromEntries(new FormData(form));if(data.website)return;if(!cfg.endpoint){status.textContent=cfg.demoSuccess;return;}const button=form.querySelector('[type=submit]');button.disabled=true;form.setAttribute('aria-busy','true');status.textContent='';for(const key of utmKeys){const value=store.get('ep-'+key,true);if(value)data[key]=value;}data.privacy=true;
try{const response=await fetch(cfg.endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});const result=await response.json();if(!response.ok||result.success!==true)throw Error();status.textContent=cfg.success;track('generate_lead',{method:'contact_form'});form.reset();}catch{status.textContent=cfg.formError;}finally{button.disabled=false;form.removeAttribute('aria-busy');}});
})();
