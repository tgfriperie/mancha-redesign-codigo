/* Loja Mancha Alvi Verde · protótipo
   Peças comuns injetadas em todas as páginas: barra de benefícios, cabeçalho,
   menu, busca, carrinho e rodapé. Os produtos vêm de assets/dados.js. */
(function(){
const P = window.PRODUTOS || [];
const IMG = 'assets/img/';
const FRETE_GRATIS = 299;   // sugestão: régua de frete grátis
const PIX = 0.05;           // sugestão: 5% OFF no Pix

// árvore de categorias do site original (Masculino e Acessórios têm submenu) + Linha Tradicional
const CATS = [
  {id:'linha-tradicional',nome:'Linha Tradicional',hot:true},
  {id:'masculino',nome:'Masculino',sub:[['camisas','Camisas'],['bermudas','Bermudas'],['calcas','Calças'],['regatas','Regatas'],['jaquetas-e-moletons','Jaquetas e Moletons']]},
  {id:'feminino',nome:'Feminino'},
  {id:'infantil',nome:'Infantil'},
  {id:'bones',nome:'Bonés'},
  {id:'acessorios',nome:'Acessórios',sub:[['meias','Meias'],['copos-e-canecas','Copos e Canecas'],['carteira','Carteira'],['chaveiros','Chaveiros'],['colar-e-pulseira','Colar e Pulseira'],['mochilas-necessaires-e-bags','Mochilas, Necessaires e Bags']]},
  {id:'calcados',nome:'Calçados'},
  {id:'souvenirs',nome:'Souvenirs'},
];
// sem a árvore real da Tray no protótipo, a subcategoria é inferida pelo nome do produto
const SUBF = {camisas:/camis|basqueteira|baby look/i,bermudas:/bermuda|shorts/i,calcas:/cal[cç]a/i,regatas:/regata/i,'jaquetas-e-moletons':/jaqueta|moletom|capa de chuva/i,
  meias:/meia/i,'copos-e-canecas':/copo|caneca|abridor/i,carteira:/carteira/i,chaveiros:/chaveiro|porta chaves/i,'colar-e-pulseira':/corrente|colar|pulseira/i,'mochilas-necessaires-e-bags':/bag|bolsa|mochila|necessaire/i};
// ordem dos tamanhos: infantil (02, 04…), adulto (PP…G6) e calçado (35/36…)
const ADULTO = ['PP','P','M','G','GG','XG','XGG','EXG','G1','G2','G3','G4','G5','G6'];
const tamPos = t => /^\d+$/.test(t) ? +t : ADULTO.includes(t) ? 100+ADULTO.indexOf(t) : /^\d+\/\d+$/.test(t) ? 200+parseInt(t) : 999;
const sortTam = arr => arr.slice().sort((a,b)=>tamPos(a)-tamPos(b));
const catLink = (c,s) => `categoria.html?c=${c}${s?'&s='+s:''}`;
const SINONIMOS = {verdao:'',porco:'',palestra:'',palmeiras:'',alviverde:'',mancha:'',
  camiseta:'camisa',blusa:'camisa',bone:'boné',chapeu:'chapéu',colar:'corrente',crianca:'infantil',bebe:'baby'};

const $ = (s,el=document)=>el.querySelector(s);
const brl = v => 'R$ ' + v.toFixed(2).replace('.',',').replace(/\B(?=(\d{3})+(?!\d))/g,'.');
const pix = v => Math.round(v*(1-PIX)*100)/100;
const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
const bySlug = s => P.find(p=>p.slug===s);
const isTrad = p => /tradicional|cordinha/i.test(p.nome);
// "mais vendidos": sem dado real de venda, a ordem é uma curadoria de vitrine (destaques do site atual)
const DESTAQUES = ['camisa-tradicional-masculina-cordinha-ml','bone-tradicional-cordinha','jaqueta-bordada-desde-1983','camisa-malha-mancha-verde-1983','moletom-torcida-que-canta-e-vibra','camiseta-oversize-trio-de-ferro','bone-43-anos','regata-feminina-mancha-alvi-verde','camisa-malha-mancha-dug','basqueteira-simbolos','capa-de-chuva-tradicional','corrente-tradicional'];

const ICON = {
  menu:'<svg viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h12"/></svg>',
  search:'<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
  bag:'<svg viewBox="0 0 24 24"><path d="M5 7h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z"/><path d="M9 7V6a3 3 0 0 1 6 0v1"/></svg>',
  user:'<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
  x:'<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  plus:'<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
  truck:'<svg viewBox="0 0 24 24"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/></svg>',
  swap:'<svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 0 1 14-5.3L20 9"/><path d="M20 4v5h-5"/><path d="M20 12a8 8 0 0 1-14 5.3L4 15"/><path d="M4 20v-5h5"/></svg>',
  lock:'<svg viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
  pix:'<svg viewBox="0 0 24 24"><path d="m12 3 4 4-4 4-4-4zM12 13l4 4-4 4-4-4zM3 12l4-4 4 4-4 4zM13 12l4-4 4 4-4 4z"/></svg>',
  shield:'<svg viewBox="0 0 24 24"><path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>',
  insta:'<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6"/></svg>',
  whats:'<svg viewBox="0 0 24 24"><path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z"/><path d="M9 9c0 3 3 6 6 6l1-1.5-2-1-1 1c-1-.5-2-1.5-2.5-2.5l1-1-1-2z"/></svg>',
  pin:'<svg viewBox="0 0 24 24"><path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>',
  mail:'<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
};

/* ---------- carrinho (localStorage só como conveniência do protótipo) ---------- */
let mem = [];
const store = {
  get(){ try{ return JSON.parse(localStorage.getItem('mancha-cart')||'[]') }catch(e){ return mem } },
  set(v){ mem=v; try{ localStorage.setItem('mancha-cart',JSON.stringify(v)) }catch(e){} }
};

function card(p,opts={}){
  const f = p.fotos;
  const out = p.esgotado;
  return `<a class="card${out?' out':''}" href="produto.html?p=${p.slug}">
    <div class="card-img">
      <img src="${f[0]}" alt="${p.nome}" loading="lazy">${f[1]?`<img src="${f[1]}" alt="" loading="lazy">`:''}
      ${out?'<span class="tag tag-out">Acabou</span>':(opts.tag?`<span class="tag tag-new">${opts.tag}</span>`:'')}
      ${out?'':`<button class="card-add" aria-label="Adicionar ${p.nome}" data-add="${p.slug}">${ICON.plus}</button>`}
    </div>
    <p>${p.nome}</p>
    ${out?'<span class="avise">Acabou. Me avisa quando voltar</span>':
      `<div class="pr"><b>${brl(p.preco)}</b><small><span class="pix">${brl(pix(p.preco))}</span> no Pix</small></div>`}
  </a>`;
}

function header(active){
  return `
  <div class="topbar" data-n="h1"><div class="topbar-track">
    <span>Pagou no Pix, <b>5% OFF</b></span><span>Sai daqui em até <b>2 dias úteis</b></span>
    <span>Frete grátis acima de <b>${brl(FRETE_GRATIS)}</b></span><span>Motoboy em <b>SP</b></span>
  </div></div>
  <header class="hdr">
    <div class="hdr-in">
      <button class="ico hdr-menu" aria-label="Menu" data-open="menu">${ICON.menu}</button>
      <a class="hdr-logo" href="index.html"><img src="${IMG}escudo.png" alt="Loja Mancha Alvi Verde"></a>
      <button class="hdr-search" data-open="search">${ICON.search}<span>Procura o quê? Camisa, boné, corrente…</span></button>
      <div class="hdr-r">
        <button class="ico ico-search" aria-label="Buscar" data-open="search">${ICON.search}</button>
        <a class="ico hdr-acc" href="#" aria-label="Minha conta">${ICON.user}</a>
        <button class="ico cart-btn" aria-label="Carrinho" data-open="cart">${ICON.bag}<i id="cartCount">0</i></button>
      </div>
    </div>
    <nav class="nav"><ul>
      <li class="has-dd dd-all"><a class="${active==='todas'?'on':''}" href="${catLink('todas')}">${ICON.menu} Todas as categorias</a>
        <div class="dd mega"><div class="mega-in">${CATS.map(c=>`<div><a class="mega-h" href="${catLink(c.id)}">${c.nome}</a>${(c.sub||[]).map(([sid,sn])=>`<a href="${catLink(c.id,sid)}">${sn}</a>`).join('')}</div>`).join('')}
          <a class="mega-promo" href="socio.html"><img src="${IMG}torcida/mini-socio.jpg" alt=""><span>Seja sócio da Mancha</span></a></div></div></li>
      ${CATS.map(c=>`<li class="${c.sub?'has-dd':''}"><a class="${c.hot?'hot':''} ${active===c.id?'on':''}" href="${catLink(c.id)}">${c.nome}</a>${c.sub?`<div class="dd"><a href="${catLink(c.id)}">Ver tudo em ${c.nome}</a>${c.sub.map(([sid,sn])=>`<a href="${catLink(c.id,sid)}">${sn}</a>`).join('')}</div>`:''}</li>`).join('')}
      <li><a class="nav-socio ${active==='socio'?'on':''}" href="socio.html">Seja Sócio</a></li>
    </ul></nav>
  </header>`;
}

function drawers(){
  return `
  <div class="scrim" id="scrim"></div>
  <aside class="drawer drawer-l" id="menu" aria-label="Menu">
    <div class="drawer-h"><img src="${IMG}escudo.png" alt="" style="height:44px"><button class="ico" data-close>${ICON.x}</button></div>
    <div class="drawer-b">
      <a class="menu-socio" href="socio.html"><img src="${IMG}torcida/mini-socio.jpg" alt=""><span><b>Seja sócio da Mancha</b>Fica sócio pelo App MV</span></a>
      <ul class="menu-cats">
        <li><a href="${catLink('todas')}">Todas as categorias</a></li>
        ${CATS.map(c=>c.sub?`<li><details><summary>${c.nome}</summary><div class="sub"><a href="${catLink(c.id)}">Ver tudo em ${c.nome}</a>${c.sub.map(([sid,sn])=>`<a href="${catLink(c.id,sid)}">${sn}</a>`).join('')}</div></details></li>`
          :`<li><a class="${c.hot?'hot':''}" href="${catLink(c.id)}">${c.nome}</a></li>`).join('')}
      </ul>
      <a class="menu-promo" href="${catLink('linha-tradicional')}">
        <p>Linha Tradicional</p><small>O manto que a arquibancada veste.</small>
        <img src="${bySlug('camisa-tradicional-masculina-cordinha-ml').fotos[0]}" alt="">
      </a>
      <div class="menu-links">
        <a href="#">${ICON.user} Minha conta e pedidos</a>
        <a href="https://wa.me/5511926651983">${ICON.whats} Chama no zap</a>
        <a href="historia.html">${ICON.shield} Nossa história</a>
        <a href="ajuda.html">${ICON.swap} Troca, entrega e pagamento</a>
      </div>
    </div>
  </aside>

  <div class="search" id="search" hidden>
    <div class="search-h">
      <label>${ICON.search}<input id="q" type="search" placeholder="Procura o quê?" autocomplete="off"></label>
      <button class="ico" data-close aria-label="Fechar">${ICON.x}</button>
    </div>
    <div class="search-b" id="sres"></div>
  </div>

  <aside class="drawer drawer-r" id="cart" aria-label="Carrinho">
    <div class="drawer-h"><h3>Carrinho</h3><button class="ico" data-close>${ICON.x}</button></div>
    <div class="drawer-b" id="cartBody"></div>
    <div class="drawer-f" id="cartFoot"></div>
  </aside>
  <div class="toast" id="toast"></div>`;
}

function footer(){
  return `<footer class="ftr" data-n="f1"><div class="wrap">
    <div class="ftr-top">
      <img class="ftr-logo" src="${IMG}escudo.png" alt="">
      <p class="ftr-tag">Aqui se aprende a amar o Palmeiras</p><p class="ftr-sub">Futebol, União &amp; Samba · desde 1983</p>
      <div class="ftr-social">
        <a href="https://www.instagram.com/manchaverdetorcida/" aria-label="Instagram">${ICON.insta}</a>
        <a href="https://wa.me/5511926651983" aria-label="WhatsApp">${ICON.whats}</a>
      </div>
    </div>
    <div class="ftr-cols">
      <div><h4>Loja</h4><a href="${catLink('todas')}">Todas as categorias</a>${CATS.slice(0,5).map(c=>`<a href="${catLink(c.id)}">${c.nome}</a>`).join('')}</div>
      <div><h4>Ajuda</h4><a href="ajuda.html">Trocas e devoluções</a><a href="ajuda.html">Envio e prazos</a><a href="ajuda.html">Formas de pagamento</a><a href="#">Meus pedidos</a></div>
      <div><h4>A Mancha</h4><a href="socio.html">Seja sócio</a><a href="https://onelink.to/ytus9k">App MV</a><a href="historia.html">Nossa história</a><a href="#">Sede · Rua Palestra Itália, 203</a><a href="#">Política de privacidade</a></div>
      <div><h4>Atendimento</h4><a href="https://wa.me/5511926651983">(11) 92665-1983</a><a href="mailto:loja@manchaverde.com.br">loja@manchaverde.com.br</a>
        <h4 style="margin-top:14px">Pagamento</h4><div class="ftr-pay"><span>PIX</span><span>VISA</span><span>MASTER</span><span>ELO</span><span>AMEX</span></div></div>
    </div>
    <p class="ftr-legal">Loja oficial do G.R.E.C. Mancha Alvi Verde · CNPJ 00.000.000/0000-00 · Rua Palestra Itália, 203 · São Paulo/SP<br>Protótipo de redesign · fotos de produto do site atual</p>
  </div></footer>`;
}

/* ---------- comportamento ---------- */
function openPanel(id){
  closeAll();
  const el = $('#'+id);
  if(id==='search'){ el.hidden=false; renderSearch(''); setTimeout(()=>$('#q').focus(),50); document.body.style.overflow='hidden'; return }
  if(id==='cart') renderCart();
  el.classList.add('on'); $('#scrim').classList.add('on'); document.body.style.overflow='hidden';
}
function closeAll(){
  document.querySelectorAll('.drawer.on').forEach(d=>d.classList.remove('on'));
  $('#scrim')?.classList.remove('on'); const s=$('#search'); if(s) s.hidden=true;
  document.body.style.overflow='';
}

function renderSearch(q){
  const box = $('#sres');
  const t = norm(q.trim());
  if(!t){
    box.innerHTML = `<h4>O pessoal mais procura</h4><div class="chips">${['Camisa tradicional','Boné','Jaqueta','Corrente','Infantil','Bandeirinha'].map(s=>`<button class="chip" data-q="${s}">${s}</button>`).join('')}</div>
      <h4>O que tá saindo</h4><div class="s-res">${DESTAQUES.slice(0,4).map(bySlug).map(sItem).join('')}</div>`;
    return;
  }
  const termos = t.split(/\s+/).map(w=>SINONIMOS[w]!==undefined?SINONIMOS[w]:w).filter(Boolean);
  const res = P.filter(p=>termos.every(w=>norm(p.nome+' '+p.cats.join(' ')).includes(norm(w))))
               .sort((a,b)=>a.esgotado-b.esgotado);
  const geral = !termos.length;
  const lista = geral ? DESTAQUES.map(bySlug) : res;
  box.innerHTML = lista.length
    ? `<h4>${geral?'Aqui é tudo Mancha · o que mais sai':lista.length+' produto'+(lista.length>1?'s':'')}</h4><div class="s-res">${lista.slice(0,8).map(sItem).join('')}</div>`
    : `<p class="s-empty">Não achei nada com "<b>${q}</b>". Tenta "camisa", "boné" ou chama a gente no <a class="link" href="https://wa.me/5511926651983">zap</a>.</p>`;
}
function sItem(p){
  return `<a class="s-item" href="produto.html?p=${p.slug}"><img src="${p.fotos[0]}" alt=""><div><p>${p.nome}</p><small>${p.esgotado?'Acabou':brl(pix(p.preco))+' no Pix'}</small></div></a>`;
}

function addToCart(slug,size){
  const p = bySlug(slug); if(!p||p.esgotado) return;
  const c = store.get(); const key = slug+'|'+(size||'');
  const it = c.find(i=>i.k===key); it?it.q++:c.push({k:key,s:slug,t:size||'',q:1});
  store.set(c); updateCount();
  openPanel('cart');
}
function updateCount(){ const n=store.get().reduce((a,i)=>a+i.q,0); const el=$('#cartCount'); if(el){el.textContent=n;el.style.display=n?'':'none'} }
function renderCart(){
  const c = store.get(), body=$('#cartBody'), foot=$('#cartFoot');
  const sub = c.reduce((a,i)=>a+bySlug(i.s).preco*i.q,0);
  if(!c.length){
    body.innerHTML = `<div class="cart-empty"><img src="${IMG}mascote.png" alt=""><p><b>Carrinho vazio.</b><br>Bora vestir o verde?</p><a class="btn" href="categoria.html?c=linha-tradicional">Ver a Linha Tradicional</a></div>`;
    foot.innerHTML=''; return;
  }
  const falta = FRETE_GRATIS - sub;
  const ja = new Set(c.map(i=>i.s));
  const ups = ['bone-tradicional-cordinha','corrente-tradicional','bandeirinha-43-anos','chaveiro-metal-retro','bone-43-anos'].map(bySlug).filter(p=>p&&!ja.has(p.slug)&&!p.esgotado).slice(0,4);
  body.innerHTML = `
    <div class="cart-ship" data-n="c1">${falta>0?`Faltam <b>${brl(falta)}</b> pro <b>frete grátis</b>. Bota mais um boné aí.`:'<b>Frete grátis garantido!</b>'}
      <div class="bar"><i style="width:${Math.min(100,sub/FRETE_GRATIS*100)}%"></i></div></div>
    <div class="cart-items">${c.map(i=>{const p=bySlug(i.s);return `
      <div class="c-item"><img src="${p.fotos[0]}" alt="">
        <div><p>${p.nome}</p><small>${i.t?'Tamanho '+i.t:''}</small>
          <div class="qty"><button data-q="-1" data-k="${i.k}" aria-label="Diminuir">−</button><span>${i.q}</span><button data-q="1" data-k="${i.k}" aria-label="Aumentar">+</button></div></div>
        <div class="c-r"><b>${brl(p.preco*i.q)}</b><button class="c-rm" data-rm="${i.k}">Remover</button></div>
      </div>`}).join('')}</div>
    ${ups.length?`<div class="cart-up" data-n="c2"><h4>Fecha o kit</h4><div class="up-row">${ups.map(p=>`
      <div class="up"><img src="${p.fotos[0]}" alt=""><p>${p.nome}</p><button data-add="${p.slug}">+ ${brl(p.preco)}</button></div>`).join('')}</div></div>`:''}`;
  foot.innerHTML = `
    <div class="tot"><span>No Pix sai por</span><b>${brl(pix(sub))}</b></div>
    <p class="tot-card">ou ${brl(sub)} em até 12x no cartão · o frete aparece no checkout</p>
    <a class="btn btn-block" href="#" data-n="c3">Fechar pedido</a>
    <p class="cart-trust">${ICON.lock} Pagamento seguro · Pix ou cartão</p>`;
}
function toast(msg){ const t=$('#toast'); t.textContent=msg; t.classList.add('on'); clearTimeout(t._h); t._h=setTimeout(()=>t.classList.remove('on'),1800) }

function init(active){
  document.body.insertAdjacentHTML('afterbegin', header(active));
  document.body.insertAdjacentHTML('beforeend', footer() + drawers());
  updateCount();
  document.addEventListener('click',e=>{
    const o=e.target.closest('[data-open]'); if(o){ e.preventDefault(); openPanel(o.dataset.open); return }
    if(e.target.closest('[data-close]')||e.target.id==='scrim'){ closeAll(); return }
    const a=e.target.closest('[data-add]'); if(a){ e.preventDefault(); e.stopPropagation(); addToCart(a.dataset.add); return }
    const q=e.target.closest('[data-q][data-k]'); if(q){ const c=store.get(); const it=c.find(i=>i.k===q.dataset.k); it.q+=+q.dataset.q; store.set(c.filter(i=>i.q>0)); updateCount(); renderCart(); return }
    const r=e.target.closest('[data-rm]'); if(r){ store.set(store.get().filter(i=>i.k!==r.dataset.rm)); updateCount(); renderCart(); return }
    const ch=e.target.closest('#sres [data-q]'); if(ch){ $('#q').value=ch.dataset.q; renderSearch(ch.dataset.q) }
  });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeAll() });
  document.addEventListener('input',e=>{ if(e.target.id==='q') renderSearch(e.target.value) });
  if(/[?&]pins=1/.test(location.search)) document.body.classList.add('pins');
}

window.MANCHA = {P,CATS,SUBF,catLink,sortTam,DESTAQUES,FRETE_GRATIS,brl,pix,bySlug,isTrad,card,ICON,init,addToCart,toast,openPanel,IMG};
})();
