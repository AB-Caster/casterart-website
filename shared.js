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
    statement: `"Feel" explores the profound impact our emotions have on how we see the world. Emotions colour our experiences, shaping our perceptions and memories. When we are happy, everything seems brighter and more hopeful. When we are sad, the same world can feel heavy and grey.

This artwork invites you to reflect on how your feelings influence your view of life. It is a reminder that our emotions are powerful lenses through which we interpret our surroundings and experiences. Embrace your feelings, understand their influence, and let them guide you to a deeper, more empathetic understanding of the world around you.`
  }
];

const PRINT_SIZES = [
  { label: 'A4 (8" x 12")', price: '$80', usd: 80, stock: 25, lemonLink: 'YOUR_LEMON_SQUEEZY_A4_LINK' },
  { label: 'A3 (12" x 16")', price: '$130', usd: 130, stock: 25, lemonLink: 'YOUR_LEMON_SQUEEZY_A3_LINK' },
  { label: 'A2 (16" x 20")', price: '$220', usd: 220, stock: 25, lemonLink: 'YOUR_LEMON_SQUEEZY_A2_LINK' }
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

function seriesCommerceCardHTML(w){
  const originalSubject = encodeURIComponent(`Original Inquiry: ${w.title}`);
  const originalBody = encodeURIComponent(`Hello,

I am interested in the original "${w.title}" (${w.medium}, ${w.year}).

Please share pricing and availability.

Thank you.`);

  return `
    <div class="series-commerce-card fade-in" id="${w.id}">
      <div class="series-commerce-img">
        ${imgTag(w.image, w.fallbackImage, w.title)}
      </div>

      <div class="series-commerce-body">
        <p class="series-commerce-kicker">${w.medium} · ${w.year}</p>
        <h3>${w.title}</h3>
        <p class="series-commerce-text">${w.statement}</p>

        <div class="series-commerce-actions">
          <a class="modal-cta" href="mailto:${SITE_EMAIL}?subject=${originalSubject}&body=${originalBody}">
            Inquire About Original
          </a>
         <div class="size-selector" id="sizes-series-${w.id}">
  ${PRINT_SIZES.map((s,i)=>`
    <label class="size-option${i===0?' selected':''}" for="series-${w.id}-${i}" onclick="selectSize(this)">
      <input type="radio" name="series-size-${w.id}" id="series-${w.id}-${i}" value="${i}"${i===0?' checked':''}>
      <span class="size-option-label">${s.label}</span>
      <span class="size-option-price">${s.price}</span>
    </label>
  `).join('')}
</div>

<button class="btn-checkout" onclick="buyPrint('${w.id}','series-${w.id}')">
  Claim This Print
</button>
        </div>
      </div>
    </div>`;
}
function printCardHTML(w){ const safe=w.id.replace(/[^a-z0-9]/g,''); return `<div class="print-card fade-in" id="${w.id}"><div class="print-card-img">${imgTag(w.image,w.fallbackImage,w.title + ' print')}</div><div class="print-card-body"><h3 class="print-card-title">${w.title}</h3><p class="print-card-edition">Limited Edition · 25 prints per size · Hand-signed</p><p class="print-card-summary">${w.statement.split('\n')[0].slice(0,170)}...</p><div class="size-selector" id="sizes-${safe}">${PRINT_SIZES.map((s,i)=>`<label class="size-option${i===0?' selected':''}" for="s${safe}${i}" onclick="selectSize(this)"><input type="radio" name="size-${safe}" id="s${safe}${i}" value="${i}"${i===0?' checked':''}><span class="size-option-label">${s.label}</span><span class="size-option-price">${s.price}</span></label>`).join('')}</div><div class="payment-options"><button class="btn-checkout" onclick="buyPrint('${w.id}','${safe}')">Claim This Print</button></a></div></div></div>`; }
function selectSize(label){ const container=label.closest('.size-selector'); container.querySelectorAll('.size-option').forEach(l=>l.classList.remove('selected')); label.classList.add('selected'); }
function buyPrint(artworkId, safeId){ const selected=document.querySelector(`#sizes-${safeId} .size-option.selected`); if(!selected){showToast('Please select a size.');return;} const size=PRINT_SIZES[parseInt(selected.querySelector('input').value,10)]; const w=getArtwork(artworkId); if(!size.lemonLink || size.lemonLink.startsWith('YOUR_')){ const subject=encodeURIComponent(`Print Purchase: ${w.title} - ${size.label}`); const body=encodeURIComponent(`Hello,\n\nI would like to purchase this print.\n\nArtwork: ${w.title}\nSize: ${size.label}\nPrice: ${size.price}\n\nPlease send payment instructions.\n\nThank you.`); window.location.href=`mailto:${SITE_EMAIL}?subject=${subject}&body=${body}`; return;} window.open(size.lemonLink + `?checkout[custom][artwork_id]=${encodeURIComponent(artworkId)}&checkout[custom][print_size]=${encodeURIComponent(size.label)}`,'_blank','noopener'); }
function openModal(id){ const w=getArtwork(id); if(!w) return; const img=document.getElementById('modalImg'); img.src=localImage(w.image); img.dataset.fallback=w.fallbackImage || w.image; document.getElementById('modalEyebrow').textContent=(w.series ? getSeriesLabel(w.series) + ' · ' : '') + `${w.medium} · ${w.year}`; document.getElementById('modalTitle').textContent=w.title; document.getElementById('modalMeta').textContent=`${w.medium} on Paper · ${w.year}${w.series ? ' · ' + getSeriesLabel(w.series) : ''}`; document.getElementById('modalStatement').textContent=w.statement; const cta=document.getElementById('modalCta'); const pcta=document.getElementById('modalPrintCta'); if(!w.available || w.printOnly){ cta.textContent='Original Sold'; cta.href='#'; cta.onclick=e=>e.preventDefault(); } else { const subject=encodeURIComponent(`Original Inquiry: ${w.title}`); const body=encodeURIComponent(`Hello,\n\nI am interested in the original "${w.title}" (${w.medium}, ${w.year}).\n\nPlease share pricing and availability.\n\nThank you.`); cta.textContent='Inquire About Original'; cta.href=`mailto:${SITE_EMAIL}?subject=${subject}&body=${body}`; cta.onclick=null; } pcta.href=pageHref(`prints.html#${w.id}`); pcta.textContent='Order Print'; document.getElementById('modalOverlay').classList.add('active'); document.body.style.overflow='hidden'; applyImageFallbacks(); }
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
  const firstName = document.getElementById(nameId)?.value?.trim();
  const email = document.getElementById(emailId)?.value?.trim();

  if (!firstName || !email) {
    showToast('Please enter your first name and email address.', 'error');
    return;
  }

  if (!email.includes('@')) {
    showToast('Please enter a valid email address.', 'error');
    return;
  }

  try {
    const resp = await fetch('/.netlify/functions/brevo-subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName,
        email,
        source: 'newsletter'
      })
    });

    const data = await resp.json();

    if (resp.ok && data.ok) {
      showToast("You're on the list. First access is yours.", 'success');
      document.getElementById(nameId).value = '';
      document.getElementById(emailId).value = '';
    } else {
      showToast('Something went wrong. Please try again.', 'error');
    }
  } catch (err) {
    console.error('Newsletter error:', err);
    showToast('Something went wrong. Please try again.', 'error');
  }
}
async function handleCommissionSubmit(event){ 
  if(event) event.preventDefault(); 

  const form = document.getElementById('commissionForm'); 
  if(!form) return; 

  const required = ['cf-name','cf-email','cf-vision','cf-country','cf-references']; 

  for(const id of required){ 
    const el = document.getElementById(id); 
    if(!el || (el.type === 'file' ? !el.files.length : !el.value.trim())){ 
      showToast('Please complete the required commission details.'); 
      return; 
    } 
  }

  const referenceInput = document.getElementById('cf-references');
  const files = referenceInput ? Array.from(referenceInput.files) : [];
  const maxFiles = 3;
  const maxFileSize = 2 * 1024 * 1024; // 2MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if(files.length > maxFiles){
    showToast('Please upload no more than 3 reference photos.');
    return;
  }

  for(const file of files){
    if(!allowedTypes.includes(file.type)){
      showToast('Reference photos must be JPG, PNG, or WebP.');
      return;
    }

    if(file.size > maxFileSize){
      showToast(`${file.name} is too large. Maximum size is 2MB per file.`);
      return;
    }
  }

  const data = new FormData(form); 

  try{ 
    const resp = await fetch('/.netlify/functions/commission-inquiry',{method:'POST',body:data}); 

    if(resp.ok){ 
      showToast('Inquiry sent. I will reply personally.', true); 
      form.reset(); 
    } else { 
      fallbackCommissionEmail(form); 
    } 
  } catch(err){ 
    fallbackCommissionEmail(form); 
  } 
}
function fallbackCommissionEmail(form){ const get=id=>document.getElementById(id)?.value||''; const subject=encodeURIComponent('Commission Inquiry'); const body=encodeURIComponent(`Name: ${get('cf-name')}\nEmail: ${get('cf-email')}\nPhone/WhatsApp: ${get('cf-phone')}\nCountry: ${get('cf-country')}\nCity: ${get('cf-city')}\nPreferred size: ${get('cf-size')}\nMedium: ${get('cf-medium')}\nDeadline: ${get('cf-deadline')}\nBudget: ${get('cf-budget')}\nSubjects: ${get('cf-subjects')}\nShipping address/notes: ${get('cf-shipping')}\n\nVision:\n${get('cf-vision')}\n\nReference photos were selected on the website form. If they were not attached automatically, please include them in your reply.`); window.location.href=`mailto:${SITE_EMAIL}?subject=${subject}&body=${body}`; }
function showToast(msg,success=false){ const t=document.getElementById('toast'); if(!t) return; t.textContent=msg; t.className='toast'+(success?' success':''); t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),3500); }
