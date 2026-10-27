/* Banners do protótipo. A mesma marcação é usada na home e em banners.html,
   que exporta os PNGs no tamanho da Tray. `foto` fica atrás, com o degradê
   verde por cima; `pos` ajusta o enquadramento (background-position). */
window.BANNERS = [
  { id:'mancha', k:'Loja oficial da Mancha', t:'Aqui se aprende<br>a amar o <em>Palmeiras</em>',
    s:'Camisa, boné e acessório de quem tá na arquibancada desde 1983.',
    cta:'Ver o que mais sai', href:'categoria.html?c=linha-tradicional',
    prod:'', foto:'assets/img/torcida/hero-mancha.jpg', pos:'50% 40%' },
  { id:'tradicional', k:'Linha Tradicional', t:'O manto da<br><em>arquibancada</em>',
    s:'Cordinha manga longa. Do jeito que a bateria veste.',
    cta:'Quero a minha', href:'produto.html?p=camisa-tradicional-masculina-cordinha-ml',
    prod:'', foto:'assets/img/torcida/hero-tradicional.jpg', pos:'60% 35%' },
  { id:'43anos', k:'Desde 1983', t:'43 anos<br>de <em>Mancha</em>',
    s:'Desde 11 de janeiro de 1983. Boné, bandeirinha e a jaqueta bordada da coleção.',
    cta:'Ver a coleção', href:'categoria.html?c=bones',
    prod:'', foto:'assets/img/torcida/hero-43anos.jpg', pos:'50% 62%' },
  { id:'pix', k:'Pagou no Pix, economizou', t:'5% OFF<br>no <em>Pix</em>',
    s:'Em tudo da loja, direto no checkout. Sai em até 2 dias úteis.',
    cta:'Bora', href:'categoria.html?c=linha-tradicional',
    prod:'assets/img/recorte/bone-mv-verde_1.png', foto:'assets/img/torcida/hero-pix.jpg', pos:'50% 35%' },
];

window.renderBanner = function(b, cls=''){
  return `<a class="bn ${b.foto?'bn-has-photo':''} ${cls}" href="${b.href}" data-banner="${b.id}">
    <div class="bn-photo${b.foto?'':' empty'}" ${b.foto?`style="background-image:url('${b.foto}');background-position:${b.pos||'center'}"`:''}></div>
    ${b.foto?'':'<img class="bn-mascot" src="assets/img/mascote-branco.png" alt="" style="height:120%;left:-12%;top:-8%">'}
    ${b.prod?`<img class="bn-prod" src="${b.prod}" alt="">`:''}
    <span class="bn-k">${b.k}</span>
    <h2 class="bn-t">${b.t}</h2>
    <p class="bn-s">${b.s}</p>
    <span class="btn btn-white">${b.cta}</span>
    ${b.foto?`<span class="photo-credit">Foto: ${b.credito||'@manchaverdetorcida'}</span>`:''}
  </a>`;
};
