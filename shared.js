/* ===========================================
   ABRAHAM CASTER - Shared Site Logic
   =========================================== */


// Edit most website content here: artworks, series, print prices, payment links, navigation, footer, and popup copy.
// Keep API keys out of this file. Backend keys belong in Netlify environment variables only.

const SITE_EMAIL = 'info@casterart.com';

const SERIES = [
  {
    id: 'perception',
    title: 'Perception Series',
    shortTitle: 'Perception',
    slug: 'series/perception.html',
    thumbnail: 'assets/images/view.jpg',
    description: 'A series about the senses, memory, emotion, listening, and the quiet ways experience changes how we understand the world.',
    statement: `Perception is the series where I try to understand why I see the world the way I do. It is not only about the five senses. It is about memory, inherited beliefs, emotions, silence, attention, and the private filters we carry without always knowing where they came from.

Each work begins with a part of human experience that feels ordinary until I sit with it long enough. Sight, sound, taste, scent, and feeling become doorways into something deeper: the way a person builds a worldview.`
  },
  {
    id: 'shades-of-brown',
    title: 'Shades of Brown Series',
    shortTitle: 'Shades of Brown',
    slug: 'series/shades-of-brown.html',
    thumbnail: 'assets/images/shades-of-brown-1.jpg',
    description: 'A series using skin colour as a starting point for conversations about difference, shared humanity, culture, and the divisions we learn to create.',
    statement: `Shades of Brown began from a simple question: how much do we allow the surface of a person to decide the story we attach to them?

The series uses skin colour as a metaphor for human difference and cultural diversity. It is personal, but it is also universal. We all carry small joys, quiet fears, inherited assumptions, and a need to be seen beyond the easiest labels. These works ask the viewer to slow down before judging what appears different.`
  }
];

const ARTWORKS = [
  {
    id: 'grey',
    title: 'Grey',
    medium: 'Graphite, Charcoal & Ball Pen',
    year: '2023',
    series: null,
    image: 'assets/images/grey.jpg',
    fallbackImage: 'assets/images/grey.jpg',
    available: true,
    featured: true,
    printStatus: 'available',
    statement: `"Grey" explores the complexities of human nature and perception. Some see the world in black and white, while others recognise the shades of grey in between. This piece is not about denying the clear lines between right and wrong or good and evil. It is a reflection on how, with humans, things are rarely as straightforward as they seem.

It challenges the narrow lens through which we often view the world and judge others. "Grey" invites you to reflect on your own judgments and consider the perspectives of others. By understanding the views of those around us, we can gain a broader, more compassionate perception of life.`
  },
  {
    id: 'serenity',
    title: 'Serenity',
    medium: 'Graphite, Charcoal & Pastel',
    year: '2022',
    series: null,
    image: 'assets/images/serenity.jpg',
    fallbackImage: 'assets/images/serenity.jpg',
    available: true,
    featured: false,
    printStatus: 'available',
    statement: `"Serenity" is like my creative escape hatch. When anxiety kicks in, I dive into the world of art, blast my favourite tunes, or get lost in timeless films. Each stroke, each note, each frame becomes a soothing balm, a gentle antidote to the chaos within.

Every stroke is a little victory, a step closer to that calm state. It is like my personal therapy session without the couch. This piece is a quiet thank you to art, music, and film, the things that have helped me find stillness when my mind would not.`
  },
  {
    id: 'broken',
    title: 'The Broken',
    medium: 'Graphite & Charcoal',
    year: '2023',
    series: null,
    image: 'assets/images/the-broken.jpg',
    fallbackImage: 'assets/images/the-broken.jpg',
    available: true,
    featured: true,
    printStatus: 'waitlist',
    waitlistSource: 'waitlist_broken',
    statement: `Is it possible to traverse the human experience without encountering the inevitable cracks that shape our character? Broken or unbroken, our spirits are mirrors reflecting the brilliance within.

The shattered glass is a metaphor for our imperfections, but also for the beauty of the inner light that still finds a way through. The cracks are not only damage. They are evidence that something survived.`
  },
  {
    id: 'ayaba',
    title: 'Ayaba',
    medium: 'Graphite & Charcoal',
    year: '2023',
    series: null,
    image: 'assets/images/ayaba.jpg',
    fallbackImage: 'assets/images/ayaba.jpg',
    available: false,
    featured: true,
    printOnly: true,
    printStatus: 'available',
    statement: `"Ayaba" means queen in my tribe, the Yoruba tribe. It is a powerful symbol of resilience and strength. In this hyperrealistic charcoal drawing, a crowned queen stands tall amidst a sea of oppressive hands. A single, defiant hand reaches out to lift her chin, a testament to the indomitable spirit that lies within.

Ayaba is a reminder that even in the face of adversity, we can rise above and reclaim our power. This artwork is a tribute to the strength and resilience of women, especially those who face societal challenges.`
  },
  {
    id: 'shades1',
    title: 'Shades of Brown I',
    medium: 'Graphite, Charcoal & Pastel',
    year: '2023',
    series: 'shades-of-brown',
    image: 'assets/images/shades-of-brown-1.jpg',
    fallbackImage: 'assets/images/shades-of-brown-1.jpg',
    available: true,
    featured: false,
    printStatus: 'waitlist',
    waitlistSource: 'waitlist_shades',
    statement: `My aim is to use our skin colour as a metaphor for our human differences and cultural diversity. Despite these differences, we are more alike than we think. We all share simple joys, like the satisfaction of kicking pebbles while walking, and universal experiences, like the natural fear boys have of their mothers, no matter how old or big they get. We all crave love and fear the unknown.

This piece encourages reflection on how we treat people we perceive as different. It reminds us that our common experiences bind us together and that the divisions between us are often of our own making. Ultimately, it is a call to recognise our shared humanity and to see beyond superficial differences.`
  },
  {
    id: 'shades2',
    title: 'Shades of Brown II',
    medium: 'Graphite, Charcoal & Pastel',
    year: '2022',
    series: 'shades-of-brown',
    image: 'assets/images/shades-of-brown-2.jpg',
    fallbackImage: 'assets/images/shades-of-brown-2.jpg',
    available: true,
    featured: false,
    printStatus: 'waitlist',
    waitlistSource: 'waitlist_shades',
    statement: `My aim is to use our skin colour as a metaphor for our human differences and cultural diversity. Despite these differences, we are more alike than we think. We all share simple joys, like the satisfaction of kicking pebbles while walking, and universal experiences, like the natural fear boys have of their mothers, no matter how old or big they get. We all crave love and fear the unknown.

This second work continues the same question from another face and another presence. It asks us to notice how quickly we make distance between ourselves and others, then reminds us that the distance is often something we were taught, not something that has to remain.`
  },
  {
    id: 'view',
    title: 'View',
    medium: 'Graphite & Charcoal',
    year: '2023',
    series: 'perception',
    image: 'assets/images/view.jpg',
    fallbackImage: 'assets/images/view.jpg',
    available: true,
    featured: true,
    printStatus: 'waitlist',
    waitlistSource: 'waitlist_perception',
    statement: `During the early years of my life, the way I viewed and saw the world was largely dependent on the beliefs and values that were passed down to me. As I grew older, the things I saw and experienced began to reshape some of these beliefs. As I grew, my questions grew too. Some still remain unanswered.

Each stroke of charcoal and graphite on paper reflects my evolving journey, capturing the essence of my changing perception of the world. "View" is not just a piece of art. It is a visual narrative of my quest for understanding and the continuous transformation of my worldview.`
  },
  {
    id: 'sound',
    title: 'Sound',
    medium: 'Graphite & Charcoal',
    year: '2023',
    series: 'perception',
    image: 'assets/images/sound.jpg',
    fallbackImage: 'assets/images/sound.jpg',
    available: true,
    featured: false,
    printStatus: 'waitlist',
    waitlistSource: 'waitlist_perception',
    statement: `I have always been the quiet one, more of a listener than a talker. This has largely shaped my perception of the world and how I connect with people. By listening, I have learned to pick up on the little things: tones, pauses, and unspoken words.

My artwork "Sound" is an expression in charcoal and graphite of this deep understanding that comes from truly listening, like translating the subtlety of human interaction onto paper. "Sound" is not just a piece of art to me. It is a totem to the power of listening and the rich insights it brings.`
  },
  {
    id: 'taste',
    title: 'Taste',
    medium: 'Graphite & Charcoal',
    year: '2023',
    series: 'perception',
    image: 'assets/images/taste.jpg',
    fallbackImage: 'assets/images/taste.jpg',
    available: true,
    featured: false,
    printStatus: 'waitlist',
    waitlistSource: 'waitlist_perception',
    statement: `I have always been drawn to simplicity and finding joy beyond material possessions. My artwork "Taste" reflects this mindset. It is about perceiving life through the lens of value and impact rather than focusing on appearances. By concentrating on what truly matters and how things can change lives, I have come to appreciate the deeper essence of experiences and connections.

"Taste" celebrates finding beauty and worth in the intangible. Through this piece, I aim to share a perspective that values substance over superficiality, hoping to inspire a different kind of appreciation for the world around us.`
  },
  {
    id: 'scent',
    title: 'Scent',
    medium: 'Graphite & Charcoal',
    year: '2023',
    series: 'perception',
    image: 'assets/images/scent.jpg',
    fallbackImage: 'assets/images/scent.jpg',
    available: true,
    featured: false,
    printStatus: 'waitlist',
    waitlistSource: 'waitlist_perception',
    statement: `"Scent" explores how our sense of smell shapes our perception of the world. Smells can trigger strong emotions and vivid memories, instantly transporting us back to past experiences. This connection between scent and memory is powerful and deeply personal.

Through "Scent," I invite you to reflect on how smells enrich our lives and shape our feelings. From the comforting aroma of home to the fresh scent of nature, these olfactory experiences connect us to moments and emotions in unique ways. This artwork is a reminder of the subtle yet profound impact that our sense of smell has on our understanding of the world around us.`
  },
  {
    id: 'feel',
    title: 'Feel',
    medium: 'Graphite & Charcoal',
    year: '2023',
    series: 'perception',
    image: 'assets/images/feel.jpg',
    fallbackImage: 'assets/images/feel.jpg',
    available: true,
    featured: false,
    printStatus: 'waitlist',
    waitlistSource: 'waitlist_perception',
    statement: `"Feel" explores the profound impact our emotions have on how we see the world. Emotions colour our experiences, shaping our perceptions and memories. When we are happy, everything seems brighter and more hopeful. When we are sad, the same world can feel heavy and grey.

This artwork invites you to reflect on how your feelings influence your view of life. It is a reminder that our emotions are powerful lenses through which we interpret our surroundings and experiences. Embrace your feelings, understand their influence, and let them guide you to a deeper, more empathetic understanding of the world around you.`
  }
];

const PRINT_SIZES = [
  {
    label: 'A4 · 8" × 12"',
    price: '$80',
    amount: 80,
    currency: 'USD',
    code: 'A4'
  },
  {
    label: 'A3 · 12" × 16"',
    price: '$130',
    amount: 130,
    currency: 'USD',
    code: 'A3'
  },
  {
    label: 'A2 · 16" × 20"',
    price: '$220',
    amount: 220,
    currency: 'USD',
    code: 'A2'
  }
];

const NAV_HTML = `
<nav id="mainNav">
<a href="index.html" class="nav-logo" aria-label="Abraham Caster Home">
  <img src="assets/images/logo.png" alt="Abraham Caster logo">
</a>
  <ul class="nav-links">
    <li><a href="about.html" data-page="about">About</a></li>
    <li><a href="originals.html" data-page="originals">Originals</a></li>
    <li><a href="prints.html" data-page="prints">Prints</a></li>
<li class="nav-dropdown">
  <a href="series/perception.html" data-page="series">Series</a>
  <div class="nav-dropdown-menu">
    <a href="series/perception.html">Perception Series</a>
    <a href="series/shades-of-brown.html">Shades of Brown Series</a>
  </div>
</li>
    <li><a href="commissions.html" data-page="commissions">Commissions</a></li>
    <li><a href="policies.html" data-page="policies">Policies</a></li>
  </ul>
  <a href="commissions.html" class="nav-cta">Commission a Piece</a>
  <button class="nav-hamburger" id="hamburger" onclick="toggleMobileNav()" aria-label="Menu"><span></span><span></span><span></span></button>
</nav>
<div class="mobile-overlay" id="mobileOverlay" onclick="closeMobileNav()"></div>
<div class="mobile-nav" id="mobileNav">
  <button class="mobile-nav-close" onclick="closeMobileNav()">x</button>
  <ul class="mobile-nav-links">
    <li><a href="about.html" onclick="closeMobileNav()">About</a></li>
    <li><a href="originals.html" onclick="closeMobileNav()">Originals</a></li>
    <li><a href="prints.html" onclick="closeMobileNav()">Prints</a></li>
    <li><a href="series/perception.html" onclick="closeMobileNav()">Perception Series</a></li>
    <li><a href="series/shades-of-brown.html" onclick="closeMobileNav()">Shades of Brown</a></li>
    <li><a href="commissions.html" onclick="closeMobileNav()">Commissions</a></li>
    <li><a href="policies.html" onclick="closeMobileNav()">Policies</a></li>
  </ul>
  <a href="commissions.html" class="btn-primary" onclick="closeMobileNav()">Commission a Piece</a>
</div>`;

const FOOTER_HTML = `
<footer id="siteFooter">
  <div>
    <div class="footer-brand-name">Abraham Caster</div>
    <div class="footer-tagline">Exploring The Human Condition<br>Lagos, Nigeria. Available Worldwide.</div>
  </div>
  <div>
    <div class="footer-nav-title">Navigate</div>
    <ul class="footer-nav-links">
      <li><a href="about.html">About</a></li>
      <li><a href="originals.html">Original Artworks</a></li>
      <li><a href="prints.html">Limited Prints</a></li>
      <li><a href="series/perception.html">Perception Series</a></li>
      <li><a href="series/shades-of-brown.html">Shades of Brown Series</a></li>
      <li><a href="commissions.html">Commissions</a></li>
      <li><a href="commissions.html#newsletter">Newsletter</a></li>
      <li><a href="policies.html">Policies</a></li>
    </ul>
  </div>
  <div class="footer-right">
    <div class="footer-social">
      <a href="https://instagram.com/caster_art" target="_blank" rel="noopener">Instagram</a>
      <a href="https://www.youtube.com/@Caster_art" target="_blank" rel="noopener">YouTube</a>
      <a href="https://www.tiktok.com/@caster_art" target="_blank" rel="noopener">TikTok</a>
    </div>
    <div class="footer-legal">
      <a href="policies.html#shipping">Shipping Policy</a>
      <a href="policies.html#privacy">Privacy Policy</a>
    </div>
    <div class="footer-copy">© ${new Date().getFullYear()} Abraham Caster. All rights reserved.</div>
  </div>
</footer>`;

const POPUP_HTML = `
<div class="popup-overlay" id="popupOverlay">
  <div class="popup">
    <div class="popup-img"><img src="assets/images/ayaba.jpg" data-fallback="https://casterart.com/assets/images/gallery03/247600f4_original.jpg" alt="Ayaba by Abraham Caster"></div>
    <div class="popup-body">
      <button class="popup-close" onclick="dismissPopup()">x</button>
      <p class="popup-label">The Inner Circle</p>
      <h2 class="popup-title">First Access.<br>No Noise.</h2>
      <p class="popup-sub">I only send notes when there is something real to share: new originals, print drops, studio thoughts, and first access before I post publicly.</p>
      <div class="popup-form" id="popupForm">
        <input type="text" id="popupName" placeholder="First name" autocomplete="given-name">
        <input type="email" id="popupEmail" placeholder="Email address" autocomplete="email">
        <button class="popup-submit" onclick="handlePopupSubscribe()">Join the List</button>
        <p class="popup-disclaimer">No spam. Unsubscribe any time.</p>
      </div>
      <div class="popup-success" id="popupSuccess"><h3>You are in.</h3><p>Welcome to the inner circle. You will hear from me when something real happens.</p></div>
    </div>
  </div>
</div>`;

const MODAL_HTML = `
<div class="modal-overlay" id="modalOverlay" onclick="handleModalBgClose(event)">
  <div class="modal" role="dialog" aria-modal="true">
    <div class="modal-img"><img id="modalImg" src="" alt="" style="object-position:center top;"></div>
    <div class="modal-body">
      <button class="modal-close" onclick="closeModal()">x</button>
      <p class="modal-eyebrow" id="modalEyebrow"></p>
      <h2 class="modal-title" id="modalTitle"></h2>
      <p class="modal-meta" id="modalMeta"></p>
      <p class="modal-statement" id="modalStatement"></p>
      <div class="modal-actions">
        <a class="modal-cta" id="modalCta" href="#">Inquire About This Piece</a>
        <a class="modal-secondary" id="modalPrintCta" href="#">Order Print</a>
      </div>
    </div>
  </div>
</div>`;

const TOAST_HTML = `<div class="toast" id="toast"></div>`;

document.addEventListener('DOMContentLoaded', () => {
  fixRelativeLinksForNestedPages();
  injectElement('nav-placeholder', withBase(NAV_HTML));
  injectElement('footer-placeholder', withBase(FOOTER_HTML));
  injectElement('popup-placeholder', withBase(POPUP_HTML));
  if (document.getElementById('modal-placeholder')) injectElement('modal-placeholder', withBase(MODAL_HTML));
  document.body.insertAdjacentHTML('beforeend', TOAST_HTML);
  applyImageFallbacks();
  setActiveNav();
  setupNavScroll();
  setupFadeObserver(document);
  setupCursor();
  checkAndShowPopup();
  setupCommissionReferenceUploads();
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); dismissPopup(); } });
});

function isNestedPage(){ return location.pathname.includes('/series/'); }
function basePrefix(){ return isNestedPage() ? '../' : ''; }
function withBase(html){ return html.replace(/(href|src)="(?!https?:|mailto:|#|\/|\.\/|\.\.\/)/g, `$1="${basePrefix()}`); }
function localImage(path){ return isNestedPage() && path.startsWith('assets/') ? '../' + path : path; }
function pageHref(path){ return isNestedPage() && !path.startsWith('../') && !path.startsWith('http') ? '../' + path : path; }
function fixRelativeLinksForNestedPages(){ document.querySelectorAll('link[href="styles.css"], script[src="shared.js"]').forEach(el => { if(isNestedPage()) { const attr=el.tagName==='LINK'?'href':'src'; el.setAttribute(attr, '../' + el.getAttribute(attr)); } }); }
function setActiveNav(){ const page=document.body.dataset.page; if(!page) return; const link=document.querySelector(`.nav-links a[data-page="${page}"]`); if(link) link.classList.add('active'); }
function setupNavScroll(){ const nav=document.getElementById('mainNav'); if(!nav) return; const onScroll=()=>nav.classList.toggle('scrolled', window.scrollY>60); window.addEventListener('scroll', onScroll, {passive:true}); onScroll(); }
function setupFadeObserver(scope){ const obs=new IntersectionObserver(entries=>entries.forEach((e,i)=>{ if(e.isIntersecting) setTimeout(()=>e.target.classList.add('visible'), i*60); }), {threshold:0.06}); scope.querySelectorAll('.fade-in').forEach(el=>obs.observe(el)); }
function setupCursor(){ const cursor=document.getElementById('cursor'), ring=document.getElementById('cursorRing'); if(!cursor||!ring) return; let mx=0,my=0,rx=0,ry=0; document.addEventListener('mousemove', e=>{mx=e.clientX;my=e.clientY;cursor.style.left=mx+'px';cursor.style.top=my+'px';}); const anim=()=>{rx+=(mx-rx)*.13;ry+=(my-ry)*.13;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(anim)}; anim(); document.querySelectorAll('a,button,.work-card,.print-card,.tier-card,.series-card').forEach(el=>{el.addEventListener('mouseenter',()=>{ring.style.transform='translate(-50%,-50%) scale(2)';ring.style.borderColor='rgba(201,169,110,0.55)'});el.addEventListener('mouseleave',()=>{ring.style.transform='translate(-50%,-50%) scale(1)';ring.style.borderColor='rgba(201,169,110,0.3)'})}); }
function applyImageFallbacks(){
  document.querySelectorAll('img[data-fallback]').forEach(img=>{
    img.onerror=()=>{
      if(img.dataset.fallbackTried==='true'){
        img.classList.add('image-missing');
        return;
      }
      img.dataset.fallbackTried='true';
      const f=img.dataset.fallback;
      if(f) img.src=localImage(f);
      else img.classList.add('image-missing');
    };
    if(img.getAttribute('src') && !img.dataset.srcNormalised){
      img.dataset.srcNormalised='true';
      img.src=localImage(img.getAttribute('src'));
    }
  });
}
function imgTag(src, fallback, alt){ const s=localImage(src); const f=fallback || src; return `<img src="${s}" data-fallback="${f}" alt="${alt}" loading="lazy">`; }
function injectElement(id, html){ const el=document.getElementById(id); if(el) el.innerHTML=html; }
function getArtwork(id){ return ARTWORKS.find(a=>a.id===id); }
function getSeries(id){ return SERIES.find(s=>s.id===id); }
function getSeriesWorks(id){ return ARTWORKS.filter(a=>a.series===id); }
function getSeriesLabel(id){ const s=getSeries(id); return s ? s.title : ''; }

function renderOriginalCards(gridId, works){ const grid=document.getElementById(gridId); if(!grid) return; grid.innerHTML=''; works.forEach(w=>grid.insertAdjacentHTML('beforeend', originalCardHTML(w))); setupFadeObserver(grid); }
function originalCardHTML(w){ return `<div class="work-item work-card fade-in" data-series="${w.series||''}" data-available="${w.available}" onclick="openModal('${w.id}')"><div class="work-card-img">${imgTag(w.image,w.fallbackImage,w.title)}<div class="work-card-overlay"><span class="work-card-view">View Work ></span></div></div><div class="work-card-info"><h3 class="work-card-title">${w.title}</h3><p class="work-card-meta">${w.medium} · ${w.year}${w.series ? ' · ' + getSeriesLabel(w.series) : ''}</p><span class="work-card-badge${!w.available || w.printOnly ? ' sold' : w.series ? ' new' : ''}">${!w.available || w.printOnly ? 'Sold · Print Available' : 'Available'}</span></div></div>`; }
function seriesCardHTML(series, mode='originals'){ return `<a class="series-card fade-in" href="${pageHref(series.slug)}"><div class="series-card-img">${imgTag(series.thumbnail,series.thumbnail,series.title)}</div><div class="series-card-body"><p class="series-kicker">Series</p><h3>${series.title}</h3><p>${series.description}</p><span>View Series ></span></div></a>`; }
function renderOriginalsWithSeries(){ const grid=document.getElementById('originalsGrid'); if(!grid) return; grid.innerHTML=''; ARTWORKS.filter(w=>!w.series).forEach(w=>grid.insertAdjacentHTML('beforeend', originalCardHTML(w))); SERIES.forEach(s=>grid.insertAdjacentHTML('beforeend', seriesCardHTML(s,'originals'))); setupFadeObserver(grid); }
function renderPrintsWithSeries(){ const grid=document.getElementById('printsGrid'); if(!grid) return; grid.innerHTML=''; ARTWORKS.filter(w=>!w.series || w.printOnly).forEach(w=>grid.insertAdjacentHTML('beforeend', printCardHTML(w))); SERIES.forEach(s=>grid.insertAdjacentHTML('beforeend', seriesCardHTML(s,'prints'))); setupFadeObserver(grid); }
function renderSeriesPage(seriesId){
  const s = getSeries(seriesId);
  if(!s) return;

  const title = document.getElementById('seriesTitle');
  const desc = document.getElementById('seriesDescription');
  const statement = document.getElementById('seriesStatement');
  const hero = document.getElementById('seriesHeroImg');

  if(title) title.textContent = s.title;
  if(desc) desc.textContent = s.description;
  if(statement) statement.textContent = s.statement;

  if(hero){
    hero.src = localImage(s.thumbnail);
    hero.dataset.fallback = s.thumbnail;
  }

  const works = getSeriesWorks(seriesId);
  const grid = document.getElementById('seriesCommerceGrid');

  if(grid){
    grid.innerHTML = '';
    works.forEach(w => grid.insertAdjacentHTML('beforeend', seriesCommerceCardHTML(w)));
    setupFadeObserver(grid);
  }
}


function getPrintStatus(w){ return w && w.printStatus ? w.printStatus : 'available'; }
function isPrintWaitlist(w){ return getPrintStatus(w) === 'waitlist'; }
function getWaitlistSource(w){
  if(!w) return 'waitlist_print';
  if(w.waitlistSource) return w.waitlistSource;
  if(w.id === 'broken') return 'waitlist_broken';
  if(w.series === 'shades-of-brown') return 'waitlist_shades';
  if(w.series === 'perception') return 'waitlist_perception';
  return 'waitlist_print';
}
function getSelectedPrintSize(safeId){
  const selected = document.querySelector('#sizes-' + safeId + ' .size-option.selected');
  if(!selected) return null;
  const input = selected.querySelector('input');
  if(!input) return null;
  const index = parseInt(input.value, 10);
  return PRINT_SIZES[index] || null;
}
function printActionButtonHTML(w, safeId){
  if(isPrintWaitlist(w)){
    return '<button class="btn-checkout" onclick="openPrintWaitlistForm(\'' + w.id + '\',\'' + safeId + '\')">Request First Access</button>';
  }
  return '<button class="btn-checkout" onclick="buyPrint(\'' + w.id + '\',\'' + safeId + '\')">Claim This Print</button>';
}

function seriesCommerceCardHTML(w){
  const originalSubject = encodeURIComponent('Original Inquiry: ' + w.title);
  const originalBody = encodeURIComponent('Hello,\n\nI am interested in the original "' + w.title + '" (' + w.medium + ', ' + w.year + ').\n\nPlease share pricing and availability.\n\nThank you.');

  return '<div class="series-commerce-card fade-in" id="' + w.id + '">'
    + '<div class="series-commerce-img">' + imgTag(w.image, w.fallbackImage, w.title) + '</div>'
    + '<div class="series-commerce-body">'
    + '<p class="series-commerce-kicker">' + w.medium + ' · ' + w.year + '</p>'
    + '<h3>' + w.title + '</h3>'
    + '<p class="series-commerce-text">' + w.statement + '</p>'
    + '<div class="series-commerce-actions">'
    + '<a class="modal-cta" href="mailto:' + SITE_EMAIL + '?subject=' + originalSubject + '&body=' + originalBody + '">Inquire About Original</a>'
    + '<div class="size-selector" id="sizes-series-' + w.id + '">'
    + PRINT_SIZES.map(function(s, i){
        return '<label class="size-option' + (i===0?' selected':'') + '" for="series-' + w.id + '-' + i + '" onclick="selectSize(this)">'
          + '<input type="radio" name="series-size-' + w.id + '" id="series-' + w.id + '-' + i + '" value="' + i + '"' + (i===0?' checked':'') + '>'
          + '<span class="size-option-label">' + s.label + '</span>'
          + '<span class="size-option-price">' + s.price + '</span>'
          + '</label>';
      }).join('')
    + '</div>'
    + printActionButtonHTML(w, 'series-' + w.id)
    + '</div></div></div>';
}

function printCardHTML(w){
  const safe = w.id.replace(/[^a-z0-9]/g,'');
  return '<div class="print-card fade-in" id="' + w.id + '">'
    + '<div class="print-card-img">' + imgTag(w.image, w.fallbackImage, w.title + ' print') + '</div>'
    + '<div class="print-card-body">'
    + '<h3 class="print-card-title">' + w.title + '</h3>'
    + '<p class="print-card-edition">Limited Edition · 25 prints per size · Hand-signed</p>'
    + '<p class="print-card-summary">' + w.statement.split('\n')[0].slice(0,170) + '...</p>'
    + '<div class="size-selector" id="sizes-' + safe + '">'
    + PRINT_SIZES.map(function(s, i){
        return '<label class="size-option' + (i===0?' selected':'') + '" for="s' + safe + i + '" onclick="selectSize(this)">'
          + '<input type="radio" name="size-' + safe + '" id="s' + safe + i + '" value="' + i + '"' + (i===0?' checked':'') + '>'
          + '<span class="size-option-label">' + s.label + '</span>'
          + '<span class="size-option-price">' + s.price + '</span>'
          + '</label>';
      }).join('')
    + '</div>'
    + '<div class="payment-options">'
    + printActionButtonHTML(w, safe)
    + '</div></div></div>';
}

function selectSize(label){ const container=label.closest('.size-selector'); container.querySelectorAll('.size-option').forEach(l=>l.classList.remove('selected')); label.classList.add('selected'); }


function openPrintWaitlistForm(artworkId, safeId) {
  const w = getArtwork(artworkId);
  if (!w) return;

  const existing = document.getElementById('printWaitlistOverlay');
  if (existing) existing.remove();

  const selectedSize = getSelectedPrintSize(safeId);

  window._pendingWaitlistArtworkId = artworkId;
  window._pendingWaitlistSafeId = safeId;
  window._pendingWaitlistSize = selectedSize;

  const overlay = document.createElement('div');
  overlay.id = 'printWaitlistOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(8,7,6,.88);z-index:9000;display:flex;align-items:flex-start;justify-content:center;padding:18px;overflow-y:auto;';

  const box = document.createElement('div');
  box.style.cssText = 'background:var(--surface);border:1px solid var(--border);padding:34px 24px 30px;max-width:500px;width:100%;position:relative;margin:38px auto;box-sizing:border-box;box-shadow:0 24px 80px rgba(0,0,0,.35);';

  box.innerHTML = ''
    + '<button id="pwCloseBtn" style="position:absolute;top:14px;right:16px;background:none;border:none;color:var(--cream-dim);font-size:22px;cursor:pointer;line-height:1;">✕</button>'
    + '<p style="font-size:10px;letter-spacing:.28em;text-transform:uppercase;color:var(--gold);margin-bottom:10px;padding-right:34px;">Print Waitlist</p>'
    + '<h2 style="font-family:var(--font-display);font-size:32px;font-weight:400;line-height:1.08;margin-bottom:8px;padding-right:34px;">Request First Access</h2>'
    + '<p style="font-size:13px;color:var(--cream-dim);line-height:1.75;margin-bottom:22px;">Not yet released. Join the waitlist for early access and collector pricing before the public launch.</p>'
    + '<p style="font-size:12px;color:var(--gold);line-height:1.6;margin-bottom:20px;">' + w.title + (selectedSize ? ' · ' + selectedSize.label : '') + '</p>'
    + '<div style="display:flex;flex-direction:column;gap:14px;width:100%;">'
    + '<div class="form-group"><label>First Name *</label><input id="pw-name" type="text" placeholder="Your first name" autocomplete="given-name" style="width:100%;box-sizing:border-box;"></div>'
    + '<div class="form-group"><label>Email Address *</label><input id="pw-email" type="email" placeholder="you@email.com" autocomplete="email" style="width:100%;box-sizing:border-box;"></div>'
    + '</div>'
    + '<button id="printWaitlistSubmitBtn" class="btn-primary" style="width:100%;text-align:center;margin-top:24px;display:block;box-sizing:border-box;">Join Waitlist</button>'
    + '<p style="font-size:11px;color:var(--muted);margin-top:14px;line-height:1.65;text-align:center;">No spam. You will only hear about this print release and collector updates.</p>';

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  document.getElementById('pwCloseBtn').addEventListener('click', function () {
    document.getElementById('printWaitlistOverlay').remove();
  });

  document.getElementById('printWaitlistSubmitBtn').addEventListener('click', submitPrintWaitlist);
}

async function submitPrintWaitlist() {
  const artworkId = window._pendingWaitlistArtworkId;
  const safeId = window._pendingWaitlistSafeId;
  const selectedSize = getSelectedPrintSize(safeId) || window._pendingWaitlistSize;
  const w = getArtwork(artworkId);

  if (!w) {
    showToast('Something went wrong. Please try again.');
    return;
  }

  const firstName = document.getElementById('pw-name') ? document.getElementById('pw-name').value.trim() : '';
  const email = document.getElementById('pw-email') ? document.getElementById('pw-email').value.trim() : '';

  if (!firstName) {
    showToast('Please enter your first name.');
    return;
  }

  if (!email || !email.includes('@')) {
    showToast('Please enter a valid email address.');
    return;
  }

  const button = document.getElementById('printWaitlistSubmitBtn');
  if (button) {
    button.disabled = true;
    button.textContent = 'Joining...';
  }

  try {
    const resp = await fetch('/.netlify/functions/brevo-subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName,
        email,
        source: getWaitlistSource(w),
        artworkId: w.id,
        artworkTitle: w.title,
        printSize: selectedSize ? selectedSize.label : ''
      })
    });

    const data = await resp.json().catch(function(){ return {}; });

    if (resp.ok && data.ok) {
      const overlay = document.getElementById('printWaitlistOverlay');
      if (overlay) overlay.remove();
      showToast('You are on the first-access list.', true);
      return;
    }

    console.error('Waitlist signup failed:', data);
    showToast('Waitlist sign-up is not ready yet. Please try again later.');
  } catch (err) {
    console.error('Waitlist error:', err);
    showToast('Waitlist sign-up is not ready yet. Please try again later.');
  }

  if (button) {
    button.disabled = false;
    button.textContent = 'Join Waitlist';
  }
}

function buyPrint(artworkId, safeId) {
  const selected = document.querySelector('#sizes-' + safeId + ' .size-option.selected');
  if (!selected) { showToast('Please select a size.'); return; }
  const sizeIndex = parseInt(selected.querySelector('input').value, 10);
  const size = PRINT_SIZES[sizeIndex];
  const w = getArtwork(artworkId);
  if (!w) return;
  openShippingForm(artworkId, size, w);
}

function openShippingForm(artworkId, size, artwork) {
  const existing = document.getElementById('shippingFormOverlay');
  if (existing) existing.remove();

  window._pendingPrintSize = size;
  window._pendingArtworkId = artworkId;

  const overlay = document.createElement('div');
  overlay.id = 'shippingFormOverlay';
  overlay.style.cssText =
    'position:fixed;inset:0;background:rgba(8,7,6,.88);z-index:9000;display:flex;align-items:flex-start;justify-content:center;padding:18px;overflow-y:auto;';

  const box = document.createElement('div');
  box.style.cssText =
    'background:var(--surface);border:1px solid var(--border);padding:32px 22px;max-width:560px;width:100%;position:relative;margin:24px auto;box-sizing:border-box;';

  box.innerHTML = ''
    + '<button id="sfCloseBtn" style="position:absolute;top:14px;right:16px;background:none;border:none;color:var(--cream-dim);font-size:22px;cursor:pointer;line-height:1;">✕</button>'
    + '<p style="font-size:10px;letter-spacing:.25em;text-transform:uppercase;color:var(--gold);margin-bottom:8px;padding-right:32px;">Shipping Details</p>'
    + '<h2 style="font-family:var(--font-display);font-size:26px;margin-bottom:6px;padding-right:32px;">' + artwork.title + '</h2>'
    + '<p style="font-size:13px;color:var(--cream-dim);margin-bottom:24px;line-height:1.6;">' + size.label + ' · ' + size.price + ' · Limited Edition of 25</p>'

    + '<div style="display:flex;flex-direction:column;gap:14px;width:100%;">'

    + '<div class="form-group">'
    + '<label>Full Name *</label>'
    + '<input id="sf-name" type="text" placeholder="Your full name" style="width:100%;box-sizing:border-box;">'
    + '</div>'

    + '<div class="form-group">'
    + '<label>Email Address *</label>'
    + '<input id="sf-email" type="email" placeholder="you@email.com" style="width:100%;box-sizing:border-box;">'
    + '</div>'

    + '<div class="form-group">'
    + '<label>Phone Number * <span style="font-size:11px;color:var(--muted);letter-spacing:0;text-transform:none;">include country code</span></label>'
    + '<input id="sf-phone" type="tel" placeholder="+1 555 000 0000" style="width:100%;box-sizing:border-box;">'
    + '</div>'

    + '<div class="form-group">'
    + '<label>Street Address *</label>'
    + '<input id="sf-street" type="text" placeholder="House number, street name" style="width:100%;box-sizing:border-box;">'
    + '</div>'

    + '<div class="form-group">'
    + '<label>City *</label>'
    + '<input id="sf-city" type="text" placeholder="City" style="width:100%;box-sizing:border-box;">'
    + '</div>'

    + '<div class="form-group">'
    + '<label>State / Province *</label>'
    + '<input id="sf-state" type="text" placeholder="State or province" style="width:100%;box-sizing:border-box;">'
    + '</div>'

    + '<div class="form-group">'
    + '<label>Postal / ZIP Code *</label>'
    + '<input id="sf-postal" type="text" placeholder="Postal code" style="width:100%;box-sizing:border-box;">'
    + '</div>'

    + '<div class="form-group">'
    + '<label>Country *</label>'
    + '<input id="sf-country" type="text" placeholder="Country" style="width:100%;box-sizing:border-box;">'
    + '</div>'

    + '</div>'

    + '<button id="proceedPaymentBtn" class="btn-primary" style="width:100%;text-align:center;margin-top:24px;display:block;box-sizing:border-box;">Proceed to Payment → ' + size.price + '</button>'
    + '<p style="font-size:11.5px;color:var(--muted);margin-top:14px;line-height:1.7;text-align:center;">Your address is used only to ship your print. Free worldwide shipping included.</p>';

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  document.getElementById('sfCloseBtn').addEventListener('click', function () {
    document.getElementById('shippingFormOverlay').remove();
  });

  document.getElementById('proceedPaymentBtn').addEventListener('click', proceedToPayment);
}

async function proceedToPayment() {
  const size = window._pendingPrintSize;
  const artworkId = window._pendingArtworkId;

  if (!size || !artworkId) {
    showToast('Something went wrong. Please try again.');
    return;
  }

  const fields = {
    name:    document.getElementById('sf-name')    ? document.getElementById('sf-name').value.trim()    : '',
    email:   document.getElementById('sf-email')   ? document.getElementById('sf-email').value.trim()   : '',
    phone:   document.getElementById('sf-phone')   ? document.getElementById('sf-phone').value.trim()   : '',
    street:  document.getElementById('sf-street')  ? document.getElementById('sf-street').value.trim()  : '',
    city:    document.getElementById('sf-city')    ? document.getElementById('sf-city').value.trim()    : '',
    state:   document.getElementById('sf-state')   ? document.getElementById('sf-state').value.trim()   : '',
    postal:  document.getElementById('sf-postal')  ? document.getElementById('sf-postal').value.trim()  : '',
    country: document.getElementById('sf-country') ? document.getElementById('sf-country').value.trim() : ''
  };

  for (var key in fields) {
    if (!fields[key]) {
      showToast('Please fill in all required shipping fields.');
      return;
    }
  }

  if (fields.email.indexOf('@') === -1) {
    showToast('Please enter a valid email address.');
    return;
  }

  const w = getArtwork(artworkId);
  if (!w) {
    showToast('Artwork not found. Please refresh and try again.');
    return;
  }

  const button = document.getElementById('proceedPaymentBtn');
  if (button) {
    button.disabled = true;
    button.textContent = 'Preparing secure checkout...';
  }

  try {
    const response = await fetch('/.netlify/functions/create-flutterwave-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        artworkId: artworkId,
        artworkTitle: w.title,
        sizeLabel: size.label,
        sizeCode: size.code,
        amount: size.amount,
        currency: size.currency,
        customerName: fields.name,
        customerEmail: fields.email,
        customerPhone: fields.phone,
        shippingAddress: {
          street: fields.street,
          city: fields.city,
          state: fields.state,
          postal: fields.postal,
          country: fields.country
        }
      })
    });

    const result = await response.json();

    if (!response.ok || !result.link) {
      console.error('Checkout creation failed:', result);
      showToast(result.error || 'Payment could not be started. Please try again.');

      if (button) {
        button.disabled = false;
        button.textContent = 'Proceed to Payment → ' + size.price;
      }

      return;
    }

    window.location.href = result.link;

  } catch (error) {
    console.error('Payment start failed:', error);
    showToast('Payment could not be started. Please try again.');

    if (button) {
      button.disabled = false;
      button.textContent = 'Proceed to Payment → ' + size.price;
    }
  }
}

function openModal(id){ const w=getArtwork(id); if(!w) return; const img=document.getElementById('modalImg'); img.src=localImage(w.image); img.dataset.fallback=w.fallbackImage || w.image; document.getElementById('modalEyebrow').textContent=(w.series ? getSeriesLabel(w.series) + ' · ' : '') + w.medium + ' · ' + w.year; document.getElementById('modalTitle').textContent=w.title; document.getElementById('modalMeta').textContent=w.medium + ' on Paper · ' + w.year + (w.series ? ' · ' + getSeriesLabel(w.series) : ''); document.getElementById('modalStatement').textContent=w.statement; const cta=document.getElementById('modalCta'); const pcta=document.getElementById('modalPrintCta'); if(!w.available || w.printOnly){ cta.textContent='Original Sold'; cta.href='#'; cta.onclick=function(e){e.preventDefault();}; } else { const subject=encodeURIComponent('Original Inquiry: ' + w.title); const body=encodeURIComponent('Hello,\n\nI am interested in the original "' + w.title + '" (' + w.medium + ', ' + w.year + ').\n\nPlease share pricing and availability.\n\nThank you.'); cta.textContent='Inquire About Original'; cta.href='mailto:' + SITE_EMAIL + '?subject=' + subject + '&body=' + body; cta.onclick=null; } pcta.href=pageHref('prints.html#' + w.id); pcta.textContent='Order Print'; document.getElementById('modalOverlay').classList.add('active'); document.body.style.overflow='hidden'; applyImageFallbacks(); }
function closeModal(){ const overlay=document.getElementById('modalOverlay'); if(overlay){overlay.classList.remove('active');document.body.style.overflow='';} }
function handleModalBgClose(e){ if(e.target===document.getElementById('modalOverlay')) closeModal(); }
function toggleMobileNav(){ document.getElementById('mobileNav').classList.toggle('open'); document.getElementById('mobileOverlay').classList.toggle('active'); }
function closeMobileNav(){ document.getElementById('mobileNav').classList.remove('open'); document.getElementById('mobileOverlay').classList.remove('active'); }
function checkAndShowPopup(){ if(localStorage.getItem('caster_subscribed')==='true') return; const last=localStorage.getItem('caster_popup_shown'); const now=Date.now(), hours24=86400000; if(!last || now-parseInt(last,10)>hours24) setTimeout(showPopup,3500); }
function showPopup(){ const overlay=document.getElementById('popupOverlay'); if(overlay){ overlay.classList.add('active'); document.body.style.overflow='hidden'; localStorage.setItem('caster_popup_shown',Date.now().toString()); } }
function dismissPopup(){ const overlay=document.getElementById('popupOverlay'); if(overlay){ overlay.classList.remove('active'); document.body.style.overflow=''; } }
async function handlePopupSubscribe(){ const name=document.getElementById('popupName').value.trim(); const email=document.getElementById('popupEmail').value.trim(); if(!name){showToast('Please enter your first name.');return;} if(!email||!email.includes('@')){showToast('Please enter a valid email address.');return;} await subscribeToList(name,email,'popup'); }
async function subscribeToList(firstName,email,source='newsletter'){ try{ const resp=await fetch('/.netlify/functions/brevo-subscribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({firstName,email,source})}); if(resp.ok){ localStorage.setItem('caster_subscribed','true'); if(source==='popup'){document.getElementById('popupForm').style.display='none';document.getElementById('popupSuccess').style.display='block';setTimeout(dismissPopup,2500);} else showToast('You are in. Welcome to the inner circle.',true); } else showToast('Sign-up is not ready yet. Please try again later.'); } catch(err){ console.warn(err); showToast('Sign-up is not ready yet. Please try again later.'); } }
async function handleNewsletterSubmit(nameId, emailId) {
  const firstName = document.getElementById(nameId) ? document.getElementById(nameId).value.trim() : '';
  const email = document.getElementById(emailId) ? document.getElementById(emailId).value.trim() : '';
  if (!firstName || !email) { showToast('Please enter your first name and email address.'); return; }
  if (!email.includes('@')) { showToast('Please enter a valid email address.'); return; }
  try {
    const resp = await fetch('/.netlify/functions/brevo-subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, email, source: 'newsletter' })
    });
    const data = await resp.json();
    if (resp.ok && data.ok) {
      showToast("You're on the list. First access is yours.", true);
      document.getElementById(nameId).value = '';
      document.getElementById(emailId).value = '';
    } else {
      showToast('Something went wrong. Please try again.');
    }
  } catch (err) {
    console.error('Newsletter error:', err);
    showToast('Something went wrong. Please try again.');
  }
}
const commissionReferenceFiles = [];

function setupCommissionReferenceUploads(){
  const input = document.getElementById('cf-references');
  if(!input) return;

  input.addEventListener('change', () => {
    const incoming = Array.from(input.files || []);
    for(const file of incoming){
      const duplicate = commissionReferenceFiles.some(existing =>
        existing.name === file.name &&
        existing.size === file.size &&
        existing.lastModified === file.lastModified
      );
      if(!duplicate && commissionReferenceFiles.length < 3){
        commissionReferenceFiles.push(file);
      }
    }

    if(incoming.length && commissionReferenceFiles.length >= 3){
      showToast('Maximum 3 reference photos selected.');
    }

    input.value = '';
    updateCommissionReferenceSummary();
  });

  updateCommissionReferenceSummary();
}

function updateCommissionReferenceSummary(){
  const input = document.getElementById('cf-references');
  if(!input) return;
  const help = input.closest('.form-group')?.querySelector('.form-help');
  if(!help) return;

  if(!commissionReferenceFiles.length){
    help.textContent = 'Upload up to 3 clear reference photos. JPG, PNG or WebP only. Maximum 2MB per file.';
    return;
  }

  help.textContent = `${commissionReferenceFiles.length}/3 reference photo${commissionReferenceFiles.length === 1 ? '' : 's'} selected: ${commissionReferenceFiles.map(file => file.name).join(', ')}`;
}

function clearCommissionReferenceUploads(){
  commissionReferenceFiles.length = 0;
  const input = document.getElementById('cf-references');
  if(input) input.value = '';
  updateCommissionReferenceSummary();
}

async function handleCommissionSubmit(event){
  if(event) event.preventDefault();
  const form = document.getElementById('commissionForm');
  if(!form) return;
  const required = ['cf-name','cf-email','cf-vision','cf-country'];
  for(const id of required){
    const el = document.getElementById(id);
    if(!el || !el.value.trim()){
      showToast('Please complete the required commission details.');
      return;
    }
  }
  const files = [...commissionReferenceFiles];
  if(!files.length){
    showToast('Please upload at least one reference photo.');
    return;
  }
  const maxFiles = 3;
  const maxFileSize = 2 * 1024 * 1024;
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if(files.length > maxFiles){ showToast('Please upload no more than 3 reference photos.'); return; }
  for(const file of files){
    if(!allowedTypes.includes(file.type)){ showToast('Reference photos must be JPG, PNG, or WebP.'); return; }
    if(file.size > maxFileSize){ showToast(file.name + ' is too large. Maximum size is 2MB per file.'); return; }
  }

  const button = form.querySelector('button[type="submit"], .btn-submit');
  const oldText = button ? button.textContent : '';
  if(button){ button.disabled = true; button.textContent = 'Sending Inquiry...'; }

  try{
    const attachments = await Promise.all(files.map(fileToBase64Attachment));
    const payload = {
      inquiry: {
        name: getFieldValue('cf-name'),
        email: getFieldValue('cf-email'),
        phone: getFieldValue('cf-phone'),
        country: getFieldValue('cf-country'),
        city: getFieldValue('cf-city'),
        size: getFieldValue('cf-size'),
        medium: getFieldValue('cf-medium'),
        deadline: getFieldValue('cf-deadline'),
        budget: getFieldValue('cf-budget'),
        subjects: getFieldValue('cf-subjects'),
        shipping: getFieldValue('cf-shipping'),
        vision: getFieldValue('cf-vision')
      },
      attachments
    };

    const resp = await fetch('/.netlify/functions/commission-inquiry',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(payload)
    });

    if(resp.ok){
      showToast('Inquiry sent. I will reply personally.', true);
      form.reset();
      clearCommissionReferenceUploads();
    } else {
      const err = await resp.json().catch(()=>({}));
      console.error('Commission inquiry failed:', err);
      fallbackCommissionEmail(form);
    }
  } catch(err){
    console.error('Commission inquiry error:', err);
    fallbackCommissionEmail(form);
  } finally {
    if(button){ button.disabled = false; button.textContent = oldText; }
  }
}

function getFieldValue(id){ return document.getElementById(id) ? document.getElementById(id).value.trim() : ''; }
function fileToBase64Attachment(file){
  return new Promise((resolve,reject)=>{
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      const content = result.includes(',') ? result.split(',').pop() : result;
      resolve({ name:file.name, mimeType:file.type, size:file.size, content });
    };
    reader.onerror = () => reject(reader.error || new Error('Could not read reference photo'));
    reader.readAsDataURL(file);
  });
}

function fallbackCommissionEmail(form){ const get=id=>document.getElementById(id)?document.getElementById(id).value:''; const subject=encodeURIComponent('Commission Inquiry'); const body=encodeURIComponent('Name: ' + get('cf-name') + '\nEmail: ' + get('cf-email') + '\nPhone/WhatsApp: ' + get('cf-phone') + '\nCountry: ' + get('cf-country') + '\nCity: ' + get('cf-city') + '\nPreferred size: ' + get('cf-size') + '\nMedium: ' + get('cf-medium') + '\nDeadline: ' + get('cf-deadline') + '\nBudget: ' + get('cf-budget') + '\nSubjects: ' + get('cf-subjects') + '\nShipping address/notes: ' + get('cf-shipping') + '\n\nVision:\n' + get('cf-vision') + '\n\nReference photos were selected on the website form. If they were not attached automatically, please include them in your reply.'); window.location.href='mailto:' + SITE_EMAIL + '?subject=' + subject + '&body=' + body; }
function showToast(msg,success=false){ const t=document.getElementById('toast'); if(!t) return; t.textContent=msg; t.className='toast'+(success?' success':''); t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),3500); }
