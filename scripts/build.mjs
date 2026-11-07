import {createHash} from 'node:crypto';
import {readFile, writeFile, mkdir, cp, rm, readdir} from 'node:fs/promises';
import {structure} from '../src/drawings.mjs';
import {checkPlaceholders} from './check-placeholders.mjs';

const c = JSON.parse(await readFile('content.pt-BR.json', 'utf8'));
const config = JSON.parse(await readFile('site.config.json', 'utf8'));
const env = process.env;
const preview = env.PREVIEW ? env.PREVIEW !== 'false' : config.preview;
const url = (env.SITE_URL || config.url).replace(/\/$/, '');
const endpoint = env.FORM_ENDPOINT || '';
const socialVersion = createHash('sha256').update(await readFile('assets/social-card.png')).digest('hex').slice(0,12);
if (!preview && (url.includes('pages.dev') || !config.address || !config.phone)) {
  throw new Error('Produção exige domínio definitivo e NAP confirmado.');
}
const e = value => String(value).replace(/[&<>"']/g, x => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[x]));
const nl = value => e(value).replace(/\n/g, '<br>');
const label = value => `<p class="section-label">${e(value)}</p>`;
const contactLink = (text, section, extra = '') => `<a class="text-link ${extra}" href="#contato" data-event="cta_click" data-section="${section}">${e(text)}</a>`;
const disclosure = (closed, open) => `<span class="disclosure-label" aria-hidden="true"><span class="when-closed">${e(closed)}</span><span class="when-open">${e(open)}</span></span>`;
const heading = section => `<div class="section-head"><div>${label(section.eyebrow)}<h2>${nl(section.title)}</h2></div>${section.description ? `<p>${e(section.description)}</p>` : ''}</div>`;
const addressText = config.address ? (typeof config.address === 'string' ? config.address : [config.address.streetAddress, config.address.addressLocality, config.address.addressRegion, config.address.postalCode].filter(Boolean).join(', ')) : '';

// Asset versions invalidate browser caches when a photograph is updated.
const photoVersions = {};
for (const person of c.partners.people) {
  for (const variant of ['360', '640', 'color-360', 'color-640']) {
    const key = `${person.image}-${variant}`;
    photoVersions[key] = createHash('sha256').update(await readFile(`assets/people/${key}.webp`)).digest('hex').slice(0, 12);
  }
}
const photoUrl = (person, variant) => `/assets/people/${person.image}-${variant}.webp?v=${photoVersions[person.image+'-'+variant]}`;
function portrait(person) {
  const action = c.ui.photoEnable.replace('{name}', person.name);
  const reset = c.ui.photoDisable.replace('{name}', person.name);
  return `<figure class="portrait">
    <button type="button" class="portrait-toggle" aria-pressed="false" aria-label="${e(action)}" aria-describedby="portrait-help" data-color-label="${e(action)}" data-mono-label="${e(reset)}">
      <img class="portrait-original" src="${photoUrl(person, '640')}" srcset="${photoUrl(person, '360')} 360w, ${photoUrl(person, '640')} 640w" sizes="(max-width: 600px) 90vw, 420px" width="640" height="640" alt="Retrato de ${e(person.name)}, sócio fundador da Engeprice" loading="lazy" decoding="async">
      <img class="portrait-color" src="${photoUrl(person, 'color-640')}" srcset="${photoUrl(person, 'color-360')} 360w, ${photoUrl(person, 'color-640')} 640w" sizes="(max-width: 600px) 90vw, 420px" width="640" height="640" alt="" aria-hidden="true" loading="lazy" decoding="async">
    </button>
    <figcaption>${e(person.caption)}</figcaption>
  </figure>`;
}
const fields = c.ui.formLabels;
const input = (id, type = 'text', extra = '') => `<div class="field"><label for="field-${id}">${e(fields[id])}</label><input id="field-${id}" name="${id}" type="${type}" required maxlength="${id === 'email' ? 254 : 180}" ${extra}></div>`;
const select = (id, options) => `<div class="field field-select"><label for="field-${id}">${e(fields[id])}</label><select id="field-${id}" name="${id}" required>${options.map((item, i) => `<option value="${i ? e(item) : ''}">${e(item)}</option>`).join('')}</select></div>`;

const schema = {'@context':'https://schema.org', '@graph':[
  {'@type':'ProfessionalService', '@id':url+'/#organization', name:config.name, legalName:config.legalName, url, email:config.email,
    areaServed:{'@type':'Country', name:'Brasil'}, knowsAbout:['Engenharia de custos', 'Estimativas CAPEX', 'Orçamento executivo', 'Controle de custos'],
    sameAs:[config.linkedin, config.instagram], ...(config.googleBusiness ? {hasMap:config.googleBusiness.profileUrl} : {}), ...(config.address ? {address:config.address} : {}), ...(config.phone ? {telephone:config.phone} : {}),
    hasOfferCatalog:{'@type':'OfferCatalog', name:'Consultoria em engenharia de custos', itemListElement:c.services.cards.map(service => ({'@type':'Offer', itemOffered:{'@type':'Service', name:service.title, description:service.description}}))}},
  ...c.partners.people.map(person => ({'@type':'Person', name:person.name, jobTitle:'Sócio fundador', worksFor:{'@id':url+'/#organization'}, description:person.bio.join(' '), ...(person.linkedin ? {sameAs:[person.linkedin]} : {})})),
  {'@type':'FAQPage', mainEntity:c.faq.items.map(item => ({'@type':'Question', name:item.q, acceptedAnswer:{'@type':'Answer', text:item.a}}))}
]};

function header() {
  return `<a href="#conteudo" class="skip">${e(c.ui.skip)}</a>
  <header class="header">
    <div class="brand-lockup"><a href="#inicio" class="brand" aria-label="${e(config.name)} — início"><img src="/assets/brand/logo.webp" width="480" height="138" alt="${e(config.name)} Consulting"></a>${preview ? `<p class="proposal-label">${e(c.proposal.label)}</p>` : ''}</div>
    <nav aria-label="Navegação principal" id="navigation">${c.nav.map(item => `<a href="#${item.id}">${e(item.label)}</a>`).join('')}${contactLink('Contato', 'header', 'nav-contact')}</nav>
    <button class="menu-toggle" type="button" aria-controls="navigation" aria-expanded="false">${e(c.ui.menu)}</button>
  </header>`;
}
function hero() {
  return `<section class="hero" id="inicio">
    <div class="hero-top"><div class="hero-copy">${label(c.hero.eyebrow)}<h1>${e(c.hero.title)} <span class="hero-accent">${e(c.hero.accent).replace('grande porte.', '<span class="keep-together">grande porte.</span>')}</span></h1><p class="hero-description">${e(c.hero.description)}</p><div class="hero-actions">${contactLink(c.hero.primary, 'hero', 'primary-link')}<a class="text-link" href="#servicos">${e(c.hero.secondary)}</a></div></div>
    <figure class="hero-drawing"><p class="drawing-heading">${e(c.hero.drawingTitle)}</p>${structure()}<figcaption>${e(c.hero.drawingLabel)}</figcaption></figure></div>
    <ul class="hero-pillars">${c.hero.pillars.map(item => `<li>${e(item)}</li>`).join('')}</ul>
  </section>`;
}
function intro() {
  return `<section id="visao" class="intro section"><div>${label(c.intro.eyebrow)}<h2>${nl(c.intro.title)}</h2></div><div class="intro-text"><p>${e(c.intro.description)}</p><p class="muted">${e(c.intro.note)}</p></div></section>`;
}
function serviceDiagram(index) {
  const diagrams = [
    '<path d="M14 65H90M20 59V43H36V59M43 59V31H59V59M66 59V18H82V59"/><path class="service-diagram-accent" d="M19 28L44 19L62 24L83 10"/><circle cx="44" cy="19" r="2"/><circle cx="62" cy="24" r="2"/>',
    '<path d="M22 10H70L84 24V72H22ZM70 10V24H84M31 35H75M31 47H75M31 59H75M48 29V65M63 29V65"/><path class="service-diagram-accent" d="M31 59H75M63 35V59"/>',
    '<path d="M17 12H59V64H17ZM27 24H49M27 34H49M27 44H42M48 28H88V74H48M59 39H78M59 49H78"/><path class="service-diagram-accent" d="M59 62L65 68L79 55"/>'
  ];
  return `<svg class="service-diagram" viewBox="0 0 104 84" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${diagrams[index]}</svg>`;
}
function services() {
  return `<section id="servicos" class="services section">${heading(c.services)}<div class="service-list">${c.services.cards.map((service, i) => `<article class="service-row"><div class="service-identity">${serviceDiagram(i)}<div class="service-title"><p class="service-stage">${e(service.stage)}</p><h3>${e(service.title)}</h3></div></div><div class="service-description"><p>${e(service.description)}</p><details class="service-detail"><summary>${e(c.services.detailLabel)}${disclosure(c.services.detailOpen, c.services.detailClose)}</summary><p class="audience">${e(service.audience)}</p><ul>${service.items.map(item => `<li>${e(item)}</li>`).join('')}</ul></details></div><div class="service-contact">${contactLink(service.link, 'servico-'+i)}</div></article>`).join('')}</div>
    <details class="scope"><summary>${e(c.services.expand)}${disclosure(c.ui.showScope, c.ui.hideScope)}</summary><ul>${c.services.full.map(item => `<li>${e(item)}</li>`).join('')}</ul></details></section>`;
}
function processSection() {
  return `<section class="process section"><div class="process-lead">${label(c.process.eyebrow)}<h2>${nl(c.process.title)}</h2><p>${e(c.process.description)}</p></div><ol class="process-list">${c.process.steps.map(item => `<li><h3>${e(item.title)}</h3><p>${e(item.text)}</p></li>`).join('')}</ol></section>`;
}
function experience() {
  return `<section id="experiencia" class="experience section">${heading(c.experience)}<p class="illustration-note">${e(c.experience.illustrationNote)}</p><div class="project-list">${c.experience.projects.map(project => `<article class="project"><figure class="project-illustration"><div class="project-drawing">${structure(project.illustration)}</div><figcaption>${e(project.illustrationCaption)}</figcaption></figure><div><h3>${e(project.name)}</h3></div><p>${e(project.text)}</p></article>`).join('')}</div><ul class="segment-list">${c.experience.segments.map(item => `<li>${e(item)}</li>`).join('')}</ul></section>`;
}
function partners() {
  return `<section id="socios" class="partners section">${heading(c.partners)}<p class="portrait-help" id="portrait-help">${e(c.partners.photoHelp)} ${e(c.partners.colorNotice)}</p>${c.partners.people.map((person, i) => `<article class="partner ${i ? 'reverse' : ''}">${portrait(person)}<div class="partner-copy">${label(person.role)}<h3>${e(person.name)}</h3><p class="specialty">${e(person.specialty)}</p>${person.bio.map(paragraph => `<p>${e(paragraph)}</p>`).join('')}<ul class="credentials">${person.tags.map(tag => `<li>${e(tag)}</li>`).join('')}</ul>${person.linkedin ? `<a class="text-link" href="${e(person.linkedin)}" target="_blank" rel="noopener noreferrer" data-event="click_linkedin_socio" data-name="${e(person.name)}">${e(c.ui.linkedin)}</a>` : ''}</div></article>`).join('')}</section>`;
}
function clients() {
  return `<section class="clients section" id="clientes">${heading(c.clients)}<div class="client-logos">${c.clients.items.map(client => `<figure><img src="/assets/clients/${e(client.asset)}" width="${client.width}" height="${client.height}" alt="${e(client.name)}" loading="lazy" decoding="async">${client.caption ? `<figcaption>${e(client.caption)}</figcaption>` : ''}</figure>`).join('')}</div></section>`;
}
function tools() {
  return `<section class="tools section" id="ferramentas">${heading(c.tools)}<div class="tool-roster"><div class="tool-group"><h3>${e(c.tools.basesTitle)}</h3><dl class="reference-bases">${c.tools.bases.map(base => `<div><dt>${e(base.name)}</dt><dd>${e(base.description)}</dd></div>`).join('')}</dl></div><div class="tool-group"><h3>${e(c.tools.platformsTitle)}</h3><ul class="platform-names">${c.tools.platforms.map(name => `<li>${e(name)}</li>`).join('')}</ul></div></div>
  <div class="budget-method"><div class="budget-explanation"><h3>${e(c.tools.methodTitle)}</h3><div class="cost-equation"><span>${e(c.tools.equationTerms[0])}</span><span aria-hidden="true">×</span><span>${e(c.tools.equationTerms[1])}</span><span class="equation-equals" aria-hidden="true">=</span><strong>${e(c.tools.equationTerms[2])}</strong></div><p>${e(c.tools.equationTotal)}</p><p class="method-note">${e(c.tools.methodNote)}</p></div><div class="cost-sheet"><table><caption>${e(c.tools.sheetTitle)}</caption><thead><tr>${c.tools.sheetHeaders.map(text => `<th scope="col">${e(text)}</th>`).join('')}</tr></thead><tbody>${c.tools.sheetRows.map(row => `<tr>${row.map((text,i) => i===0 ? `<th scope="row">${e(text)}</th>` : `<td>${e(text)}</td>`).join('')}</tr>`).join('')}</tbody><tfoot><tr><td colspan="4">${e(c.tools.sheetTotal)}</td></tr></tfoot></table></div></div></section>`;
}
function googleBusiness() {
  if (!config.googleBusiness) return '';
  return `<section class="google-profile section" id="perfil-google"><div class="google-profile-copy">${label(c.google.eyebrow)}<h2>${e(c.google.title)}</h2><p>${e(c.google.description)}</p><a class="text-link" href="${e(config.googleBusiness.profileUrl)}" target="_blank" rel="noopener noreferrer">${e(c.google.link)}</a><p class="map-source">${e(c.google.sourceNote)}</p></div><iframe src="${e(config.googleBusiness.embedUrl)}" title="${e(c.google.mapTitle)}" width="600" height="420" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></section>`;
}
function faq() {
  return `<section id="perguntas" class="faq section"><div>${label(c.faq.eyebrow)}<h2>${nl(c.faq.title)}</h2></div><div class="faq-list">${c.faq.items.map(item => `<details><summary><span>${e(item.q)}</span>${disclosure(c.ui.readAnswer, c.ui.closeAnswer)}</summary><p>${e(item.a)}</p></details>`).join('')}</div></section>`;
}
function confirmedContact() {
  return `${config.phone ? `<div class="optional-contact">${label(c.contact.phoneLabel)}<a class="text-link" href="tel:${e(config.phone.replace(/[^+0-9]/g, ''))}" data-event="click_phone">${e(config.phone)}</a>${config.whatsappEnabled ? `<a class="text-link" href="https://wa.me/${e(config.phone.replace(/[^0-9]/g, ''))}" target="_blank" rel="noopener noreferrer" data-event="click_whatsapp">${e(c.contact.whatsappLabel)}</a>` : ''}</div>` : ''}${addressText ? `<div class="optional-contact">${label(c.contact.addressLabel)}<p>${e(addressText)}</p><a class="text-link" href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(addressText)}" target="_blank" rel="noopener noreferrer">${e(c.contact.mapLabel)}</a></div>` : ''}`;
}
function closing() {
  return `<section class="closing section" aria-label="Foco da consultoria">${c.closing.map(line => `<p>${e(line)}</p>`).join('')}</section>`;
}
function contact() {
  const privacyText = endpoint ? c.contact.privacyProduction : c.contact.privacy;
  return `<section id="contato" class="contact section"><div class="contact-copy">${label(c.contact.eyebrow)}<h2>${nl(c.contact.title)}</h2><p>${e(c.contact.description)}</p><p class="muted">${e(c.contact.audience)}</p><div class="contact-direct">${label(c.contact.emailLabel)}<a class="text-link" href="mailto:${e(config.email)}" data-event="click_email">${e(config.email)}</a><p>${e(c.contact.locationLabel)}</p>${confirmedContact()}</div></div>
    <form id="contact-form" class="contact-form" method="post" action="/api/contact"><p class="form-notice">${e(endpoint ? c.ui.required : c.contact.previewNotice)}</p><div class="form-grid">${input('name', 'text', 'autocomplete="name"')}${input('company', 'text', 'autocomplete="organization"')}${input('role', 'text', 'autocomplete="organization-title"')}${input('email', 'email', 'autocomplete="email"')}${select('demand', c.ui.demandOptions)}${select('phase', c.ui.phaseOptions)}${select('type', c.ui.typeOptions)}${input('size', 'text', `placeholder="${e(c.ui.sizePlaceholder)}"`)}</div>
    <div class="field message-field"><label for="field-message">${e(fields.message)}</label><textarea id="field-message" name="message" rows="4" required minlength="20" maxlength="5000" placeholder="${e(c.ui.messagePlaceholder)}"></textarea></div>
    <label class="honey" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label><div class="consent"><input id="privacy-consent" type="checkbox" name="privacy" required><div><label for="privacy-consent">${e(privacyText)}</label> <a href="#privacidade">${e(c.footer.privacy)}</a>.</div></div>
    <noscript><p class="form-notice">${e(c.ui.noScriptForm)}</p></noscript><button class="action-link" type="submit" disabled>${e(endpoint ? c.contact.submit : c.contact.previewSubmit)}</button><p id="form-status" role="status" aria-live="polite"></p></form></section>`;
}
function footer() {
  return `<footer class="footer section"><div class="footer-main"><div><a class="brand" href="#inicio"><img src="/assets/brand/logo.webp" alt="${e(config.name)} Consulting" width="480" height="138" loading="lazy"></a><p class="footer-tagline">${nl(c.footer.tagline)}</p></div><nav class="footer-links" aria-label="Links do rodapé">${c.nav.map(item => `<a href="#${item.id}">${e(item.label)}</a>`).join('')}<a href="${e(config.linkedin)}" target="_blank" rel="noopener noreferrer">LinkedIn</a><a href="${e(config.instagram)}" target="_blank" rel="noopener noreferrer">Instagram</a></nav><div class="newsletter"><h3>${e(c.footer.newsletter)}</h3><p>${e(c.footer.newsletterText)}</p><a class="text-link" href="mailto:${e(config.email)}?subject=Cadastro%20de%20novidades" data-event="click_email">${e(c.footer.newsletterLink)}</a></div></div>
    <details id="privacidade"><summary>${e(c.ui.privacyTitle)}</summary><p>${e(c.ui.privacyText)}</p></details><div class="footer-bottom"><p>${e(config.legalName)}<br>CNPJ ${e(config.cnpj)}${addressText ? `<br>${e(addressText)}` : ''}${config.phone ? `<br>${e(config.phone)}` : ''}</p><p>© ${new Date().getFullYear()} ${e(config.name)}. ${e(c.footer.copyright)}</p><button class="action-link" type="button" id="cookie-settings">${e(c.footer.cookies)}</button></div>
    <div class="footer-credit">${preview ? `<p>${e(c.footer.preview)}</p>` : ''}<p>${e(c.footer.creditPrefix)} <a href="${e(config.developer.url)}" target="_blank" rel="noopener noreferrer">${e(config.developer.name)}</a></p></div></footer>
    <aside class="cookie-banner" id="cookie-banner" aria-label="${e(c.ui.cookieTitle)}" hidden><p>${e(c.ui.cookieText)}</p><div><button class="action-link" type="button" id="cookie-reject">${e(c.ui.cookieReject)}</button><button class="action-link" type="button" id="cookie-accept">${e(c.ui.cookieAccept)}</button></div></aside>`;
}
const clientConfig = {endpoint, gtm:env.GTM_ID || '', preview, success:c.contact.success, demoSuccess:c.contact.demoSuccess, formError:c.ui.formError, closeMenu:c.ui.closeMenu, menu:c.ui.menu};
const html = `<!doctype html><html lang="pt-BR"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${e(c.meta.title)}</title><meta name="description" content="${e(c.meta.description)}"><meta name="robots" content="${preview ? 'noindex, nofollow' : 'index, follow'}"><link rel="canonical" href="${url}/">
<meta property="og:type" content="website"><meta property="og:locale" content="pt_BR"><meta property="og:title" content="${e(c.meta.title)}"><meta property="og:description" content="${e(c.meta.description)}"><meta property="og:url" content="${url}/"><meta property="og:image" content="${url}/assets/social-card.png?v=${socialVersion}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${e(c.meta.socialAlt)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${e(c.meta.title)}"><meta name="twitter:description" content="${e(c.meta.description)}"><meta name="twitter:image" content="${url}/assets/social-card.png?v=${socialVersion}">
${env.GSC_TOKEN ? `<meta name="google-site-verification" content="${e(env.GSC_TOKEN)}">` : ''}<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="preload" href="/assets/fonts/archivo-latin-variable.woff2" as="font" type="font/woff2" crossorigin>
<style>${await readFile('src/style.css', 'utf8')}</style><script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script><script id="site-data" type="application/json">${JSON.stringify(clientConfig).replace(/</g, '\\u003c')}</script><script src="/app.js" defer></script>
</head><body>${header()}<main id="conteudo" tabindex="-1">${hero()}${intro()}${services()}${processSection()}${experience()}${clients()}${partners()}${tools()}${faq()}${closing()}${contact()}${googleBusiness()}</main>${footer()}</body></html>`;

await mkdir('dist', {recursive:true});
await writeFile('dist/index.html', html);
await cp('src/app.js', 'dist/app.js');
await cp('assets', 'dist/assets', {recursive:true});
// Keep originals and generation sources in the repository, outside the published assets.
for (const file of await readdir('dist/assets/people')) {
  if (file.endsWith('-original.png') || file.endsWith('-source.png')) await rm('dist/assets/people/'+file);
}
await rm('dist/assets/brand/logo-original.png', {force:true});
for (const file of ['heebo.ttf', 'playfair.ttf', 'Heebo-OFL.txt', 'Playfair-OFL.txt']) await rm('dist/assets/fonts/'+file, {force:true});
await writeFile('dist/robots.txt', preview ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\nSitemap: ${url}/sitemap.xml\n`);
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${preview ? '' : `<url><loc>${url}/</loc></url>`}</urlset>`);
await writeFile('dist/llms.txt', `# Engeprice\n\n${preview ? 'Proposta conceitual de renovação, não é o site oficial.\n\n' : ''}Site oficial: ${config.officialUrl}\n\nConsultoria brasileira em engenharia de custos, com base em Vitória/ES e atuação nacional.\n\n## Serviços\n${c.services.full.map(item => '- '+item).join('\n')}\n\nContato: ${config.email}\n`);
await writeFile('dist/_headers', `/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://www.google-analytics.com; font-src 'self'; connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com${endpoint && endpoint.startsWith('https:') ? ' '+new URL(endpoint).origin : ''}; frame-src https://www.google.com https://maps.google.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'\n${preview ? '  X-Robots-Tag: noindex, nofollow\n' : ''}/assets/*\n  Cache-Control: public, max-age=86400\n`);
await writeFile('dist/404.html', `<!doctype html><html lang="pt-BR"><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Página não encontrada | Engeprice</title><style>@font-face{font-family:Archivo;src:url(/assets/fonts/archivo-latin-variable.woff2) format('woff2');font-display:swap}</style><body style="font:20px Archivo,Arial,sans-serif;background:#0b1517;color:white;padding:10vw">${preview ? `<p>${e(c.proposal.label)}</p>` : ''}<h1>${e(c.ui.notFoundTitle)}</h1><a style="color:#f3cc51" href="/">${e(c.ui.notFoundLink)}</a></body></html>`);
await checkPlaceholders();
console.log(`Build pronto: dist/ — ${preview ? 'proposta conceitual noindex' : 'produção indexável'}, formulário ${endpoint ? 'configurado' : 'demonstrativo'}.`);
