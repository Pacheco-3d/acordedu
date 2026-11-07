const data=window.ACORDE_DATA, chords=window.AcordeChords;
// Mantém o catálogo demonstrativo e acrescenta as cifras católicas importadas dos arquivos enviados.
const cat=window.ACORDE_CATHOLIC||{songs:[],artists:[],albums:[]};
data.songs.push(...cat.songs);data.artists.push(...cat.artists);data.albums.push(...cat.albums);
const importados=window.ACORDE_IMPORTADAS||{songs:[],artists:[],albums:[]};
data.songs.push(...importados.songs);data.artists.push(...importados.artists);data.albums.push(...importados.albums);
const terco=window.ACORDE_TERCO||{songs:[],artists:[],albums:[],playlists:{},schedule:{}};
data.songs.push(...terco.songs);data.artists.push(...terco.artists);data.albums.push(...terco.albums);
const page=document.body.dataset.page||'home';const base=document.body.dataset.base||'.';
const globalReadingTheme=localStorage.getItem('as-cifra-theme')==='dark'?'dark':'light';
document.body.classList.toggle('reading-theme-dark',globalReadingTheme==='dark');
document.body.classList.toggle('reading-theme-light',globalReadingTheme!=='dark');
const link=path=>{const route=String(path||'index.html');return `${base}/${route.endsWith('/')?route+'index.html':route}`};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
// As referencias de musicas comerciais navegam apenas dentro deste site.
// Catalogo de metadados: o conteudo integral da cifra depende de cadastro autorizado.
const refSlug=text=>normalize(text).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'sem-nome';
const facil49Full=window.ACORDE_FACIL49||[];
const facil49ArtistIds=new Map(data.artists.map(a=>[normalize(a.name),a.id]));
let facil49Album=data.albums.find(a=>a.id==='facil49-album');
if(!facil49Album){
 let va=data.artists.find(a=>normalize(a.name)==='varios artistas');
 if(!va){va={id:'facil49-varios-artistas',name:'Vários artistas',genre:'Coletânea',description:'Artistas da coleção 49 Músicas Fáceis.',photo:'assets/img/artista-referencia.svg'};data.artists.push(va)}
 facil49Album={id:'facil49-album',title:'49 Músicas Fáceis',artistId:va.id,genre:'Coletânea',year:2026,collection:true,cover:'assets/img/facil49-sprite.webp'};
 data.albums.push(facil49Album);
}
facil49Full.forEach(([num,title,artist,key,genre,used,rows])=>{
 let artistId=facil49ArtistIds.get(normalize(artist));
 if(!artistId){
  artistId='facil49-art-'+refSlug(artist);facil49ArtistIds.set(normalize(artist),artistId);
  data.artists.push({id:artistId,name:artist,genre,description:'Artista da coleção 49 Músicas Fáceis.',photo:'assets/img/artista-referencia.svg'});
 }
 const full={id:'facil49-'+String(num).padStart(2,'0'),title,artistId,albumId:'facil49-album',genre,collection:'49 Músicas Fáceis',key:key||used?.[0]||'—',level:'Fácil',originalLayout:rows};
 const current=data.songs.find(s=>normalize(s.title)===normalize(title)&&normalize((data.artists.find(a=>a.id===s.artistId)||{}).name)===normalize(artist));
 if(current){
  const keepId=current.id,keepCover=current.cover;
  Object.assign(current,full,{id:keepId});
  if(keepCover)current.cover=keepCover;
 }else data.songs.push(full);
});
const facil49ReadyTitles=new Set(facil49Full.map(x=>normalize(x[1])));
const facil49Source=`Flores|Titãs
La Bella Luna|Paralamas do Sucesso
Que País é Esse?|Legião Urbana
Garota Nacional|Skank
É Proibido Fumar|Skank
Era um Garoto|Engenheiros do Hawaii
Aluga-se|Raul Seixas
Ciúme|Ultraje a Rigor
O Descobridor dos Sete Mares|Tim Maia
Por Você|Frejat
Lanterna dos Afogados|Paralamas do Sucesso
Diz Pra Mim|Banda Malta
Como Zaqueu|Regis Danese
Majestade o Sabiá|Jair Rodrigues
Eu Sei|Legião Urbana
Memórias|Banda Malta
Os Cegos do Castelo|Titãs
Parabéns Pra Você|Tradicional
De Janeiro a Janeiro|Roberta Campos e Nando Reis
Catedral|Zélia Duncan
Lenha|Rio Negro e Solimões
Tempos Modernos|Lulu Santos
Domingo de Manhã|Marcos e Belutti
Ovelha Negra|Rita Lee
Fácil|Jota Quest
Fugidinha|Michel Teló
Vida Vazia|Bruno e Marrone
Como Eu Quero|Kid Abelha
Burguesinha|Seu Jorge
Meu Erro|Paralamas do Sucesso
Meteoro|Luan Santana
O Segundo Sol|Nando Reis
Fico Assim Sem Você|Adriana Calcanhotto
Poeira|Ivete Sangalo
Só Hoje|Jota Quest
Primeiros Erros|Capital Inicial
Hoje a Noite Não Tem Luar|Legião Urbana
O Sol|Jota Quest
Maluco Beleza|Raul Seixas
Gostava Tanto de Você|Tim Maia
Velha Infância|Tribalistas
É Preciso Saber Viver|Titãs
Onde Você Mora?|Cidade Negra
Será|Legião Urbana
Camaro Amarelo|Munhoz e Mariano
Vamos Fugir|Skank
Devolva-me|Adriana Calcanhotto
Só os Loucos Sabem|Charlie Brown Jr
Paga Pau|Fernando e Sorocaba`;
const facil49=facil49Source.trim().split('\n').map((row,index)=>{
 const [title,artist]=row.split('|');
 return {title,artist,genre:'49 Músicas Fáceis',collection:'49 Músicas Fáceis',coverIndex:index%9+1,sourceTitle:'49 músicas fáceis cifradas para violão',sourceUrl:'https://pt.slideshare.net/slideshow/49-msicas-fceis-cifradas-para-violo/60558564'};
});
data.external??=[];
const refExisting=new Map(data.external.map(item=>[normalize(item.title)+'|'+normalize(item.artist),item]));
facil49.forEach(item=>{
 if(facil49ReadyTitles.has(normalize(item.title)))return;
 const key=normalize(item.title)+'|'+normalize(item.artist),current=refExisting.get(key);
 if(current)Object.assign(current,{collection:item.collection,coverIndex:item.coverIndex,sourceTitle:item.sourceTitle,sourceUrl:item.sourceUrl});
 else {data.external.push(item);refExisting.set(key,item)}
});

const localArtistIndex=new Map();
data.artists.forEach(a=>localArtistIndex.set(normalize(a.name),a.id));
(data.external||[]).forEach((item,index)=>{
 item.id=`ref-musica-${String(index+1).padStart(3,'0')}`;
 const artistKey=normalize(item.artist);
 if(!localArtistIndex.has(artistKey)){
  const artistId=`ref-artista-${refSlug(item.artist)}`;
  localArtistIndex.set(artistKey,artistId);
  data.artists.push({id:artistId,name:item.artist,genre:item.genre,description:'Perfil do catálogo de referências. As cifras são adicionadas quando autorizadas.',photo:'assets/img/artista-referencia.svg',referenceOnly:true});
 }
 item.artistId=localArtistIndex.get(artistKey);
});
const knownSongs=()=>data.external||[];

const $=(sel,root=document)=>root.querySelector(sel),$$=(sel,root=document)=>[...root.querySelectorAll(sel)];
const getStore=(key,def)=>{try{return JSON.parse(localStorage.getItem('as-'+key))??def}catch{return def}};
const setStore=(key,val)=>localStorage.setItem('as-'+key,JSON.stringify(val));
const artistBy=id=>allArtists().find(a=>a.id===id)||{name:'Artista independente',photo:'assets/img/album-04.svg',genre:'Independente'};
const facil49CoverNumber=song=>{
 if(song?.collection!=='49 Músicas Fáceis')return 0;
 const row=(window.ACORDE_FACIL49||[]).find(x=>normalize(x[1])===normalize(song.title));
 return row?.[0]||1;
};
const songCoverUrl=(song,album,artist)=>{
 const n=facil49CoverNumber(song);
 if(n)return imageUrl('assets/img/edu/capa-'+String((n-1)%8+1).padStart(2,'0')+'.webp');
 return imageUrl(song.cover||album?.cover||artist?.photo);
};
const albumBy=id=>allAlbums().find(a=>a.id===id);
const allSongs=()=>[...data.songs,...getStore('approved',[])];
const pending=()=>getStore('pending',[]);
const allArtists=()=>[...data.artists,...getStore('extraArtists',[])];
const allAlbums=()=>[...data.albums,...getStore('extraAlbums',[])];
// Perfis e repertorios locais: demonstracao sem autenticacao de servidor.
const currentUser=()=>getStore('currentUser',null);
const accountKey=()=>currentUser()?.email||null;
const privateKey=kind=>`${kind}-${accountKey()}`;
const favs=()=>accountKey()?getStore(privateKey('favorites'),[]):[];
const setFavs=list=>{if(accountKey())setStore(privateKey('favorites'),list)};
const lists=()=>accountKey()?getStore(privateKey('setlists'),[]).map(item=>({...item,songIds:[...new Set((item.songIds||[]).filter(Boolean))],songKeys:item.songKeys||{}})):[];
// Repertórios pessoais armazenam apenas referências ao catálogo e preferências leves (como o tom escolhido), nunca cópias da cifra.
const setLists=list=>{if(accountKey())setStore(privateKey('setlists'),list.map(item=>({id:item.id,title:item.title,songIds:[...new Set((item.songIds||[]).filter(Boolean))],songKeys:item.songKeys||{}})))};
const repertoireKey=(list,song)=>list?.songKeys?.[song.id]||song.key||'C';
const repertoireKeyOptions=song=>Array.from({length:12},(_,i)=>chords.transposeKey(song.key||'C',i));
const imageUrl=path=>/^https?:\/\//i.test(path||'')?path:link(path||'assets/img/album-04.svg');
function showToast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(window._toastTimeout);window._toastTimeout=setTimeout(()=>t.classList.remove('show'),2900)}
function icon(name){const icons={search:'⌕',music:'♫',up:'↗',heart:'♡',filter:'☷',note:'♬',clock:'◷',send:'➤',external:'↗'};return icons[name]||'♫'}
const route={home:'',songs:'musicas/',song:'musicas/',artists:'artistas/',artist:'artistas/',gallery:'gallery/',albums:'gallery/',gallerysongs:'gallery/',submit:'enviar/',admin:'admin/',tools:'ferramentas/'};
function shell(content){
 const user=currentUser();
 const nav=[['⌂','Início','', 'home'],['♫','Cifras','musicas/','songs'],['♙','Artistas','artistas/','artists'],['◎','Álbuns','gallery/albuns/','gallery'],['⇄','Estilos','musicas/','styles'],['⚙','Ferramentas','ferramentas/','tools']];
 const current=(page==='song'?'songs':page==='artist'?'artists':page==='albums'||page==='gallerysongs'?'gallery':page);
 const navHtml=nav.map(([symbol,name,path,id])=>`<a class="edu-nav-item ${current===id?'active':''}" href="${link(path)}" ${current===id?'aria-current="page"':''}><span class="edu-nav-symbol" aria-hidden="true">${symbol}</span>${name}</a>`).join('');
 const asideItems=[['♫','Cifras','musicas/'],['♙','Artistas','artistas/'],['◎','Álbuns','gallery/albuns/'],['▱','Estilos Musicais','musicas/'],['☆','Mais Acessadas','index.html#mais-acessadas'],['◷','Lançamentos','index.html#lancamentos'],['✝','Músicas Católicas','categorias/catolica/'],['♡','Meu Repertório','repertorio/']];
 const toolItems=[['♩','Afinador','ferramentas/'],['♟','Metrônomo','ferramentas/'],['▦','Dicionário de Acordes','dicionario/'],['⇅','Transpor Tom','musicas/']];
 const sideLinks=items=>items.map(([sym,name,path])=>`<a href="${link(path)}"><span aria-hidden="true">${sym}</span>${name}</a>`).join('');
 $('#app').innerHTML=`<header class="edu-header"><a class="edu-brand" href="${link('')}" aria-label="AcordeEDU — Página inicial"><img src="${link('assets/img/edu/acordeedu-icone.webp')}" alt="" width="55" height="55"><span><strong>Acorde<span>EDU</span></strong><small>Cifras • Letras • Acordes</small></span></a><nav class="edu-topnav" aria-label="Navegação principal">${navHtml}</nav><div class="edu-account"><a class="edu-login" href="${link(user?'repertorio/':'login/')}"><span aria-hidden="true">♙</span> ${user?esc(user.name.split(' ')[0]):'Entrar'}</a><a class="edu-repertoire" href="${link('repertorio/')}"><span aria-hidden="true">♡</span> Meu Repertório</a><button id="menuButton" class="edu-hamburger" aria-label="Abrir menu" aria-expanded="false">☰</button></div></header>
 <nav id="mobileMenu" class="edu-mobile hidden" aria-label="Menu para dispositivos móveis">${navHtml}<a href="${link('categorias/catolica/')}" class="edu-nav-item">✝ Músicas Católicas</a><a href="${link('repertorio/')}" class="edu-nav-item">♡ Meu Repertório</a><a href="${link('enviar/')}" class="edu-nav-item">✎ Enviar cifra</a></nav>
 <div class="edu-frame"><aside class="edu-sidebar" aria-label="Explorar"><h3>Explorar</h3>${sideLinks(asideItems)}<div class="edu-divider"></div><h3>Ferramentas</h3>${sideLinks(toolItems)}<div class="edu-divider"></div><a href="${link('enviar/')}"><span>✎</span>Enviar cifra</a></aside><main class="edu-main ${page==='home'?'edu-main-home':''}">${content}</main></div>
 <footer class="edu-footer"><a href="${link('')}">Acorde<span>EDU</span></a><p>Cifras, catálogo de artistas e ferramentas musicais. As imagens da página inicial são ilustrativas.</p><div><a href="${link('musicas/')}">Cifras</a><a href="${link('categorias/catolica/')}">Católicas</a><a href="${link('enviar/')}">Enviar cifra</a><a href="${link('admin/')}">Administração</a></div></footer>`;
 $('#menuButton').onclick=()=>{const menu=$('#mobileMenu');menu.classList.toggle('hidden');$('#menuButton').setAttribute('aria-expanded',String(!menu.classList.contains('hidden')))};
}
const heading=(label,title,description)=>`<div class="page-top"><span class="eyebrow">${esc(label)}</span><h1>${title}</h1><p>${description}</p></div>`;
function musicCard(song){const artist=artistBy(song.artistId),album=albumBy(song.albumId);return `<a class="music-card" href="${link('musicas/cifra.html')}?id=${encodeURIComponent(song.id)}"><img loading="lazy" src="${songCoverUrl(song,album,artist)}" alt="Imagem ilustrativa da música ${esc(song.title)}"><div class="card-detail"><h3>${esc(song.title)}</h3><p>${esc(artist.name)}</p><div class="music-meta"><span class="tag lime">${esc(song.key||'—')}</span><span>${esc(song.level||'Cifra')}</span></div></div><span class="arrow">↗</span></a>`}
function albumCard(album){const artist=artistBy(album.artistId);return `<a class="album-card" href="${link('gallery/albuns/')}?id=${encodeURIComponent(album.id)}"><img loading="lazy" src="${imageUrl(album.cover)}" alt="Fotografia ilustrativa do álbum ${esc(album.title)}"><h3>${esc(album.title)}</h3><p>${esc(artist.name)} · ${esc(album.year||'')}</p></a>`}
function artistCard(artist){return `<a class="artist-card" href="${link('artistas/perfil.html')}?id=${encodeURIComponent(artist.id)}"><img loading="lazy" src="${imageUrl(artist.photo)}" alt="Retrato ilustrativo de ${esc(artist.name)}"><div><h3>${esc(artist.name)}</h3><p>${esc(artist.genre||'Artista')}</p></div></a>`}
function referenceHref(item){return `${link('musicas/referencia.html')}?id=${encodeURIComponent(item.id)}`}
function referenceCover(item,large=false){
 const cls=large?'reference-large-art':'reference-cover';
 if(!item.coverIndex)return `<span class="${cls}" aria-hidden="true">♫</span>`;
 const idx=(Number(item.coverIndex)-1)%9,x=(idx%3)*50,y=Math.floor(idx/3)*50;
 return `<span class="${cls}" aria-hidden="true" style="background-image:url('${link('assets/img/facil49-sprite.webp')}');background-size:300% 300%;background-position:${x}% ${y}%;background-repeat:no-repeat;color:transparent"></span>`;
}
function referenceCard(item){return `<a class="reference-card" href="${referenceHref(item)}">${referenceCover(item)}<span class="reference-info"><strong>${esc(item.title)}</strong><small>${esc(item.artist)}</small><span class="reference-tag">${esc(item.collection||item.genre||'Música')} · Ver detalhes</span></span><span class="reference-go" aria-hidden="true">↗</span></a>`}
function externalRow(item){return `<div class="source-row"><a class="record-song-link" href="${referenceHref(item)}"><strong>${esc(item.title)}</strong><small>${esc(item.genre||'Música')} · Ver música aqui ↗</small></a><a class="record-artist-link" href="${link('artistas/perfil.html')}?id=${encodeURIComponent(item.artistId)}" aria-label="Abrir artista ${esc(item.artist)}">${esc(item.artist)} ↗</a></div>`}

function filterBox(items,rootId,type='songs'){const input=$(`#${rootId}-search`),genre=$(`#${rootId}-genre`),results=$(`#${rootId}-results`);if(!input||!results)return;const act=()=>{let key=normalize(input.value),g=genre?.value||'';let found=items.filter(x=>normalize(type==='artists'?`${x.name} ${x.genre}`:`${x.title} ${x.genre} ${x.collection||''} ${albumBy(x.albumId)?.title||''} ${x.artist||artistBy(x.artistId).name}`).includes(key)&&(!g||x.genre===g));results.innerHTML=found.length?(type==='artists'?`<div class="artist-grid">${found.map(artistCard).join('')}</div>`:type==='external'?`<div class="panel">${found.map(externalRow).join('')}</div>`:`<div class="music-grid">${found.map(musicCard).join('')}</div>`):`<div class="empty"><strong>Nenhum resultado encontrado.</strong>Tente outro título, artista ou estilo.</div>`;$('#count-results')?.replaceChildren(document.createTextNode(`${found.length} resultado(s)`))};input.addEventListener('input',act);genre?.addEventListener('change',act);act()}
function genres(items){return [...new Set(items.map(x=>x.genre).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt-BR'))}
const filterUI=(id,items,placeholder='Buscar músicas ou artistas...')=>`<div class="toolbar"><input id="${id}-search" class="input search-field" type="search" placeholder="${esc(placeholder)}" aria-label="Pesquisar"><select id="${id}-genre" class="select" aria-label="Filtrar por gênero"><option value="">Todos os estilos</option>${genres(items).map(g=>`<option value="${esc(g)}">${esc(g)}</option>`).join('')}</select><span class="muted tiny" id="count-results"></span></div><div id="${id}-results"></div>`;
function home(){
 const known=knownSongs();
 const facilRefs=known.filter(item=>item.collection==='49 Músicas Fáceis');
 const facilSongs=allSongs().filter(item=>item.collection==='49 Músicas Fáceis');
 const ready=allSongs().filter(song=>(song.originalLayout?.length||song.sections?.length));
 const imported=ready.filter(song=>song.genre==='Sertanejo'||song.genre==='Pop Rock');
 const ranked=(imported.length?imported:ready).slice(0,8);
 const recent=(imported.length?imported:ready).slice(-4).reverse();
 const letters='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
 const featuredArtists=[...new Map([...importados.artists.slice(0,12),...known.map(item=>allArtists().find(a=>a.id===item.artistId)).filter(Boolean)].map(a=>[a.id,a])).values()].slice(0,18);
 const localImg=n=>imageUrl(`assets/img/edu/${n}`);
 const cover=(song,i)=>`<a class="edu-song-card" href="${link('musicas/cifra.html')}?id=${encodeURIComponent(song.id)}" aria-label="Abrir cifra de ${esc(song.title)}"><span class="edu-song-art"><img loading="lazy" src="${localImg('capa-'+String(i%8+1).padStart(2,'0')+'.webp')}" alt="Imagem ilustrativa para ${esc(song.title)}"></span><strong>${esc(song.title)}</strong><small>${esc(artistBy(song.artistId).name)}</small></a>`;
 const artistItem=(item,i)=>`<a class="edu-artist-slide" href="${link('artistas/perfil.html')}?id=${encodeURIComponent(item.id)}" aria-label="Abrir perfil do artista ${esc(item.name)}"><img src="${localImg('artista-'+String(i%6+1).padStart(2,'0')+'.webp')}" alt="Imagem ilustrativa do artista ${esc(item.name)}" loading="lazy"><strong>${esc(item.name)}</strong></a>`;
 const styles=[['Sertanejo','Sertanejo'],['Pagode','Pagode'],['MPB','MPB'],['Rock','Rock'],['Católica','Católica'],['Gospel','Gospel']];
 shell(`<section class="edu-hero" aria-labelledby="edu-main-title"><div class="edu-hero-inner"><h1 id="edu-main-title">Encontre a cifra<br>da sua música <em>favorita</em></h1><form id="heroSearch" class="edu-search"><span aria-hidden="true">⌕</span><input type="search" id="heroTerm" placeholder="Buscar cifra, artista ou música..." aria-label="Buscar cifra, artista ou música" required><button type="submit">Buscar</button></form><div class="edu-examples"><span>Exemplos:</span>${ranked.slice(0,4).map(x=>`<a href="${link('musicas/cifra.html')}?id=${encodeURIComponent(x.id)}">${esc(x.title)}</a>`).join('<span>·</span>')}</div></div></section>
 <div class="edu-home-panels"><section class="edu-block" id="mais-acessadas"><div class="edu-heading"><h2><span class="edu-heading-icon">▥</span> Mais acessadas</h2><a href="${link('musicas/')}">Ver todas ›</a></div><div class="edu-feature-grid">${ranked.map(cover).join('')}</div></section>
 <div class="edu-duo"><section class="edu-block" id="lancamentos"><div class="edu-heading"><h2><span class="edu-heading-icon">♢</span> Novidades no catálogo</h2><a href="${link('musicas/')}">Ver todas ›</a></div><div class="edu-feature-grid edu-four">${recent.map((item,i)=>cover(item,i+3)).join('')}</div></section>
 <section class="edu-block edu-artists-block" aria-label="Carrossel de artistas"><div class="edu-heading"><h2><span class="edu-heading-icon">♛</span> Top Artistas</h2><a href="${link('artistas/')}">Ver todos ›</a></div><div class="edu-carousel-wrap"><button type="button" id="artistPrev" class="edu-carousel-arrow" aria-label="Artistas anteriores">‹</button><div class="edu-artists-viewport" id="artistsCarousel" tabindex="0" aria-label="Carrossel horizontal de artistas">${featuredArtists.map(artistItem).join('')}</div><button type="button" id="artistNext" class="edu-carousel-arrow" aria-label="Próximos artistas">›</button></div><div class="edu-carousel-progress" aria-hidden="true"><span id="artistsProgress"></span></div></section></div>
 <section class="edu-az edu-block"><div class="edu-heading"><h2><span class="edu-heading-icon">♙</span> Artistas de A a Z</h2></div><nav class="edu-letters" aria-label="Artistas por letra">${letters.map(l=>`<a href="${link('artistas/')}?letter=${l}">${l}</a>`).join('')}<a href="${link('artistas/')}">#</a></nav></section>
 <div class="edu-bottom"><section class="edu-block"><div class="edu-heading"><h2><span class="edu-heading-icon">▱</span> Estilos Musicais</h2><a href="${link('musicas/')}">Ver cifras ›</a></div><div class="edu-styles">${styles.map(([name,filter],i)=>`<a href="${name==='Católica'?link('categorias/catolica/'):link('musicas/')+'?q='+encodeURIComponent(filter)}" class="edu-style"><img src="${localImg('estilo-'+String(i+1).padStart(2,'0')+'.webp')}" alt="Ilustração do estilo ${name}" loading="lazy"><span>${name}</span></a>`).join('')}</div></section>
 <section class="edu-block"><div class="edu-heading"><h2><span class="edu-heading-icon">⚒</span> Ferramentas</h2></div><div class="edu-tools">${[['♩','Afinador'],['♟','Metrônomo'],['▦','Dicionário de Acordes'],['⇅','Transpor Tom']].map(([symbol,name],i)=>`<a href="${i===3?link('musicas/'):i===2?link('dicionario/'):link('ferramentas/')}" class="edu-tool"><span aria-hidden="true">${symbol}</span><strong>${name}</strong></a>`).join('')}</div></section></div>
 <section class="edu-block"><div class="edu-heading"><h2><span class="edu-heading-icon">♫</span> 49 Músicas Fáceis</h2><a href="${link('musicas/')}?q=${encodeURIComponent('49 Músicas Fáceis')}">Ver coleção ›</a></div><p>${facilSongs.length} cifras completas da apostila Acorde EDU, organizadas por artista e categoria.</p><div class="edu-catholic-grid">${facilSongs.slice(0,8).map(musicCard).join('')}</div></section>
 <section class="edu-catholic-line edu-block"><div class="edu-heading"><h2><span class="edu-heading-icon">✝</span> Músicas Católicas</h2><a href="${link('categorias/catolica/')}">Ver todas as ${cat.songs.length} músicas ›</a></div><p>Cifras importadas do seu acervo, com transposição e documento original.</p><div class="edu-catholic-grid">${cat.songs.filter(s=>s.originalLayout?.length||s.sections?.length).slice(0,6).map(musicCard).join('')}</div></section>
 <section class="edu-catholic-line edu-block"><div class="edu-heading"><h2>Sertanejo</h2><a href="${link('musicas/')}?q=Sertanejo">Ver cifras ›</a></div><div class="edu-catholic-grid">${importados.songs.filter(x=>x.genre==='Sertanejo').slice(0,6).map(musicCard).join('')}</div></section><section class="edu-catholic-line edu-block"><div class="edu-heading"><h2>Pop Rock</h2><a href="${link('musicas/')}?q=Pop%20Rock">Ver cifras ›</a></div><div class="edu-catholic-grid">${importados.songs.filter(x=>x.genre==='Pop Rock').slice(0,6).map(musicCard).join('')}</div></section><section class="edu-block edu-submit-line"><p>Sentiu falta de uma música? Colabore com o catálogo enviando uma cifra para revisão.</p><a href="${link('enviar/')}" class="edu-submit-button">Enviar cifra ›</a></section>
 </div>`);
 const search=$('#heroSearch');search.addEventListener('submit',e=>{e.preventDefault();const q=$('#heroTerm').value.trim();if(q)location.href=link('musicas/')+'?q='+encodeURIComponent(q)});
 const viewport=$('#artistsCarousel'),prev=$('#artistPrev'),next=$('#artistNext'),progress=$('#artistsProgress');
 const advance=(dir)=>{const amt=Math.max(170,Math.floor(viewport.clientWidth*.72));const atEnd=viewport.scrollLeft+viewport.clientWidth>=viewport.scrollWidth-5;const atStart=viewport.scrollLeft<=5;viewport.scrollTo({left:dir>0&&atEnd?0:dir<0&&atStart?viewport.scrollWidth:viewport.scrollLeft+amt*dir,behavior:'smooth'})};
 prev.onclick=()=>advance(-1);next.onclick=()=>advance(1);
 viewport.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();advance(e.key==='ArrowRight'?1:-1)}});
 const updateProgress=()=>{const distance=viewport.scrollWidth-viewport.clientWidth;const ratio=distance>0?viewport.scrollLeft/distance:0;progress.style.transform=`translateX(${Math.min(100,Math.max(0,ratio*100))}%)`;prev.setAttribute('aria-disabled',String(viewport.scrollLeft<=3));next.setAttribute('aria-disabled',String(viewport.scrollLeft>=distance-3))};
 viewport.addEventListener('scroll',updateProgress,{passive:true});window.addEventListener('resize',updateProgress);updateProgress();
}
function songsPage(){let songs=allSongs();shell(`${heading('CATÁLOGO DE CIFRAS','Encontre sua próxima música','Busque por música, artista ou estilo. Todas as páginas abrem dentro do AcordeEDU.')}
 <section class="section" style="padding-top:8px"><div class="section-head"><h2>Cifras disponíveis</h2></div>${filterUI('songs',songs)}</section>
 <section class="section"><div class="section-head"><div><span class="eyebrow">CATÁLOGO DO ACORDE STUDIO</span><h2>Músicas conhecidas</h2><p>Explore músicas e artistas sem sair do site. Os itens ainda sem cifra mostram uma ficha para cadastramento.</p></div></div>${filterUI('known',knownSongs(),'Pesquisar músicas conhecidas...')}</section>`);
 const q=new URLSearchParams(location.search).get('q');if(q){$('#songs-search').value=q;$('#known-search').value=q};filterBox(songs,'songs');filterBox(knownSongs(),'known','external')}

function artistsPage(){shell(`${heading('ARTISTAS','Explore os artistas','Encontre artistas cadastrados e veja suas músicas, álbuns e cifras.')}${filterUI('artists',allArtists(),'Buscar artista...')}`);const params=new URLSearchParams(location.search),q=params.get('q'),letter=params.get('letter');if(q)$('#artists-search').value=q;if(letter)$('#artists-search').value=letter;filterBox(allArtists(),'artists','artists');if(letter){const available=allArtists().filter(a=>normalize(a.name).startsWith(normalize(letter)));$('#artists-results').innerHTML=available.length?`<div class="artist-grid">${available.map(artistCard).join('')}</div>`:`<div class="empty"><strong>Não há artistas com a letra ${esc(letter)} ainda.</strong><p><a class="text-link" href="${link('artistas/')}">Ver todos os artistas ↗</a></p></div>`;$('#count-results').textContent=`${available.length} resultado(s)`;} }
function artistPage(){const id=new URLSearchParams(location.search).get('id');let artist=allArtists().find(a=>a.id===id);if(!artist){artistsPage();return}const alb=allAlbums().filter(x=>x.artistId===id),songs=allSongs().filter(x=>x.artistId===id),references=knownSongs().filter(x=>x.artistId===id);shell(`${heading('PERFIL DO ARTISTA',esc(artist.name),esc(artist.genre||''))}<div class="panel" style="display:flex;gap:20px;align-items:center;margin:5px 0 24px"><a href="${link('artistas/')}" aria-label="Voltar à lista de artistas"><img width="125" height="125" style="border-radius:18px;object-fit:cover" src="${imageUrl(artist.photo)}" alt="${artist.referenceOnly?'Ilustração do artista no catálogo':'Imagem ilustrativa do artista'}"></a><div><h2>${esc(artist.name)}</h2><p class="muted">${esc(artist.description||'Artista cadastrado na plataforma.')}</p><p class="muted tiny">${songs.length} cifra(s) publicada(s) · ${references.length} música(s) no catálogo · ${alb.length} álbum(ns)</p></div></div>
 <section class="section" style="padding-top:15px"><div class="section-head"><h2>Cifras disponíveis</h2></div><div class="music-grid">${songs.map(musicCard).join('')||'<div class="empty">Nenhuma cifra publicada ainda.</div>'}</div></section>
 ${references.length?`<section class="section"><div class="section-head"><div><h2>Músicas conhecidas</h2><p>Veja as fichas de músicas deste artista dentro do Acorde Studio.</p></div></div><div class="reference-grid">${references.map(referenceCard).join('')}</div></section>`:''}
 <section class="section"><div class="section-head"><h2>Álbuns</h2></div><div class="album-grid">${alb.map(albumCard).join('')||'<div class="empty">Nenhum álbum cadastrado ainda.</div>'}</div></section>`)}

function galleryPage(){shell(`${heading('ACERVO VISUAL','A música também se vê','Uma galeria organizada por álbuns, artistas e músicas, com fotografias ilustrativas locais nos exemplos.')}<div class="soft-panel"><div><h2>Escolha como explorar.</h2><p>As capas e retratos são imagens ilustrativas criadas para a demonstração; substitua por capas oficiais autorizadas em assets/img se necessário.</p></div><div class="song-buttons"><a class="btn btn-primary" href="${link('gallery/albuns/')}">Ver álbuns</a><a class="btn btn-light" href="${link('gallery/musicas/')}">Ver músicas</a></div></div><section class="section"><div class="section-head"><h2>Álbuns em destaque</h2><a class="text-link" href="${link('gallery/albuns/')}">Todos ↗</a></div><div class="album-grid">${allAlbums().map(albumCard).join('')}</div></section>`)}
function albumsPage(){
 const id=new URLSearchParams(location.search).get('id');
 const albums=allAlbums(),album=albums.find(x=>x.id===id);
 if(album){
  const songIds=album.terco?album.trackIds:undefined;
  const tracks=songIds? songIds.map(id=>allSongs().find(s=>s.id===id)).filter(Boolean):allSongs().filter(s=>s.albumId===id);
  const alternatives=album.terco?(album.alternativeIds||[]).map(id=>allSongs().find(s=>s.id===id)).filter(Boolean):[];
  const section=(label,arr)=>`<div class="panel"><h2>${esc(label)}</h2><div class="stack" style="margin-top:16px">${arr.map((s,i)=>`<div style="display:flex;align-items:center;gap:9px"><span class="tag">${i+1}</span><div style="flex:1">${musicCard(s)}</div></div>`).join('')||'<div class="empty">Sem cifras nesta seleção.</div>'}</div></div>`;
  shell(`${heading(album.terco?'TERÇO DOS HOMENS':'ÁLBUM',esc(album.title),album.terco?esc(album.days||'Repertório do Terço'):esc(artistBy(album.artistId).name)+' · '+esc(album.year||''))}
  <div class="two-col"><div class="stack">${section('Músicas do mistério',tracks)}${alternatives.length?section(album.alternativeLabel||'Outra opção de repertório',alternatives):''}<a class="btn btn-light" href="${link('gallery/albuns/')}">← Todos os álbuns</a></div>
  <aside class="panel"><img style="width:100%;border-radius:16px" src="${imageUrl(album.cover)}" alt="Capa do álbum ${esc(album.title)}"><p class="muted" style="margin-top:12px">Terço dos Homens · ${esc(album.days||'')}</p><p>Escolha uma faixa para abrir sua cifra com rolagem e transposição.</p></aside></div>`);
 }else{
  const rosary=albums.filter(a=>a.terco),others=albums.filter(a=>!a.terco);
  shell(`${heading('GALERIA','Álbuns','Explore os repertórios e abra as cifras dentro do AcordeEDU.')}
  ${rosary.length?`<section class="section"><div class="section-head"><h2>Terço dos Homens</h2></div><div class="album-grid">${rosary.map(albumCard).join('')}</div></section>`:''}
  <section class="section"><div class="section-head"><h2>Outros álbuns</h2></div><div class="album-grid">${others.map(albumCard).join('')}</div></section>`);
 }
}
function gallerySongs(){shell(`${heading('GALERIA','Músicas e referências','Todas as músicas e artistas têm páginas internas no Acorde Studio.')}<section><div class="section-head"><h2>Cifras disponíveis</h2></div><div class="music-grid">${allSongs().map(musicCard).join('')}</div></section><section class="section"><div class="section-head"><div><h2>Catálogo de músicas conhecidas</h2><p>Consulte títulos e artistas; as cifras completas serão publicadas após cadastro autorizado.</p></div></div>${filterUI('ext',knownSongs(),'Buscar música ou artista...')}</section>`);filterBox(knownSongs(),'ext','external')}

function referencePage(){
 const id=new URLSearchParams(location.search).get('id');
 const item=knownSongs().find(x=>x.id===id);
 if(!item){shell(`${heading('CATÁLOGO','Música não encontrada','Volte ao catálogo para procurar outra música.')}<a class="btn btn-primary" href="${link('gallery/musicas/')}">Ver músicas ↗</a>`);return}
 const published=allSongs().find(s=>normalize(s.title)===normalize(item.title)&&normalize(artistBy(s.artistId).name)===normalize(item.artist));
 const artistHref=`${link('artistas/perfil.html')}?id=${encodeURIComponent(item.artistId)}`;
 const sendHref=`${link('enviar/')}?title=${encodeURIComponent(item.title)}&artist=${encodeURIComponent(item.artist)}&genre=${encodeURIComponent(item.genre||'')}`;
 shell(`${heading('CATÁLOGO DE MÚSICAS',esc(item.title),'Ficha da música dentro do Acorde Studio.')}
 <div class="reference-detail-layout"><div class="panel reference-detail"><div class="reference-detail-heading">${referenceCover(item,true)}<div><span class="eyebrow">MÚSICA NO CATÁLOGO</span><h2>${esc(item.title)}</h2><p><a class="text-link" href="${artistHref}">${esc(item.artist)} ↗</a></p><span class="tag lime">${esc(item.genre||'Música')}</span></div></div>
 ${published?`<div class="reference-status"><h3>Esta cifra já está disponível</h3><p>Abra a versão completa com acordes e transposição.</p><a class="btn btn-primary" href="${link('musicas/cifra.html')}?id=${encodeURIComponent(published.id)}">Abrir cifra ↗</a></div>`:`<div class="reference-status"><h3>Cifra ainda não cadastrada</h3><p>O título e o artista fazem parte do catálogo, mas ainda não recebemos uma letra/cifra autorizada para publicar. Você pode enviar uma versão para revisão.</p><a class="btn btn-primary" href="${sendHref}">Enviar cifra para aprovação ↗</a></div>`}
 </div><aside class="stack"><div class="panel"><h3 class="side-title">Informações</h3><div class="mini-stat"><span>Artista</span><a class="text-link" href="${artistHref}">${esc(item.artist)} ↗</a></div><div class="mini-stat"><span>Gênero</span><strong>${esc(item.genre||'—')}</strong></div><div class="mini-stat"><span>Coleção</span><strong>${esc(item.collection||'Catálogo geral')}</strong></div><div class="mini-stat"><span>Localização</span><strong>AcordeEDU</strong></div></div>${item.sourceUrl?`<a class="btn btn-light" href="${esc(item.sourceUrl)}" target="_blank" rel="noopener noreferrer">Ver fonte de referência ↗</a>`:''}<a class="btn btn-light" href="${link('gallery/musicas/')}">← Voltar à galeria</a></aside></div>`);
}

const layoutKind=row=>Array.isArray(row)?(row[0]==='c'?'chords':row[0]==='b'?'blank':'lyric'):(row.kind||'lyric');
const layoutText=row=>Array.isArray(row)?String(row[1]||''):String(row.text||'');
const layoutSections=song=>{
 if(song.sections?.length)return song.sections;
 const chordLines=(song.originalLayout||[]).filter(r=>layoutKind(r)==='chords').map(r=>{
  const text=layoutText(r),tokens=[...text.matchAll(/\S+/g)].map(m=>m[0]).filter(t=>/^[A-G][#b]?(?:m|M|maj|min|dim|aug|sus|add)?[0-9+\-°º]*(?:M)?(?:\/(?:[A-G][#b]?|[0-9]+))?$/.test(t));
  return tokens.map(t=>'['+t+']').join(' ');
 }).filter(Boolean);
 return chordLines.length?[{name:'Acordes',lines:chordLines}]:[];
};
const sourceTypeLabel=song=>song.sourceType||((song.sourceFile||'').split('.').pop()||'arquivo').toUpperCase();
function renderChordLines(song,steps){
 // Para arquivos importados, exibe cada linha exatamente na sequência e coluna do documento.
 // Acordes são posicionados por COLUNA, não inseridos perto de palavras ou sílabas.
 if(Array.isArray(song.originalLayout)&&song.originalLayout.length){
  const rows=song.originalLayout.map(row=>{
   const source=layoutText(row);
   if(layoutKind(row)==='blank')return '<div class="original-row original-blank" aria-hidden="true"></div>';
   if(layoutKind(row)==='chords'){
    const tokens=[...source.matchAll(/\S+/g)];
    const pieces=tokens.map(m=>{
      const token=m[0],column=m.index;
      // Prefixos como [Intro] permanecem imutáveis.
      const label=/^\[.*\]$/.test(token)||!/^([A-G][#b]?)/.test(token)?token:chords.transposeChord(token,steps,/b/.test(song.key));
      return `<span class="chord-at" style="left:${column}ch">${esc(label)}</span>`;
    }).join('');
    return `<div class="original-row original-chords" style="min-width:${Math.max(1,source.length)}ch">${pieces}</div>`;
   }
   // Linhas com acordes ChordPro embutidos continuam transponíveis.
   const inline=esc(source).replace(/\[([A-G][^\]]{0,28})\]/g,(_,c)=>`<b class="inline-chord">${esc(chords.transposeChord(c,steps,/b/.test(song.key)))}</b>`);
   return `<div class="original-row original-lyric">${inline||'&nbsp;'}</div>`;
  }).join('');
  return `<div class="source-layout" aria-label="Cifra com os espaços e colunas do arquivo original">${rows}</div>`;
 }
 return song.sections.map(s=>`<section class="verse-section"><h3>${esc(s.name)}</h3>${s.lines.map(line=>`<div class="cifra-line">${chords.lineSegments(line).map(seg=>`<span class="cifra-seg"><span class="cifra-chord">${seg.chord?esc(chords.transposeChord(seg.chord,steps,/b/.test(song.key))):' '}</span><span class="cifra-lyric">${esc(seg.lyric||' ')}</span></span>`).join('')}</div>`).join('')}</section>`).join('');
}
function songPage(){let params=new URLSearchParams(location.search),id=params.get('id'),song=allSongs().find(x=>x.id===id);if(!song){shell(`${heading('CIFRA','Música não encontrada','Abra uma cifra pela lista de músicas.')}<a class="btn btn-primary" href="${link('musicas/')}">Ver músicas</a>`);return}const artist=artistBy(song.artistId),album=albumBy(song.albumId);let steps=0,size=18,scrolling=false,raf=0,lastTick=0,scrollSpeed=40;const requestedKey=params.get('key');if(requestedKey){for(let i=0;i<12;i++){if(chords.transposeKey(song.key,i)===requestedKey){steps=i;break}}}const stored=favs();let isFav=stored.includes(song.id);const activeListId=params.get('list'),activePos=Number(params.get('pos'));const activeList=activeListId?lists().find(l=>l.id===activeListId):null;const activeIndex=activeList&&Number.isInteger(activePos)&&activePos>=0&&activePos<activeList.songIds.length?activePos:(activeList?activeList.songIds.indexOf(song.id):-1);const prevSong=activeList&&activeIndex>0?allSongs().find(s=>s.id===activeList.songIds[activeIndex-1]):null;const nextSong=activeList&&activeIndex>=0&&activeIndex<activeList.songIds.length-1?allSongs().find(s=>s.id===activeList.songIds[activeIndex+1]):null;const listNav=activeList?`<div class="repertoire-play-nav"><a class="repertoire-back" href="${link('repertorio/')}">← Voltar para ${esc(activeList.title)}</a><div class="repertoire-play-position"><span>${activeIndex+1} de ${activeList.songIds.length}</span><strong>${esc(activeList.title)}</strong></div><div class="repertoire-play-arrows">${prevSong?`<a class="btn btn-small btn-light" href="${link('musicas/cifra.html')}?id=${encodeURIComponent(prevSong.id)}&key=${encodeURIComponent(repertoireKey(activeList,prevSong))}&list=${encodeURIComponent(activeList.id)}&pos=${activeIndex-1}" aria-label="Música anterior">← Anterior</a>`:'<span></span>'}${nextSong?`<a class="btn btn-small btn-primary" href="${link('musicas/cifra.html')}?id=${encodeURIComponent(nextSong.id)}&key=${encodeURIComponent(repertoireKey(activeList,nextSong))}&list=${encodeURIComponent(activeList.id)}&pos=${activeIndex+1}" aria-label="Próxima música">Próxima →</a>`:'<span class="tag">Fim da lista</span>'}</div></div>`:'';shell(`${listNav}<div class="page-top"><span class="eyebrow">CIFRA INTERATIVA · ${esc(song.genre||'')}</span></div><div class="song-head"><a class="song-cover-link" href="${link('gallery/albuns/')}?id=${encodeURIComponent(song.albumId||'')}" aria-label="Abrir álbum ${esc(album?.title||song.title)}"><img class="song-cover" src="${songCoverUrl(song,album,artist)}" alt="Imagem ilustrativa de ${esc(song.title)}"></a><div><h1>${esc(song.title)}</h1><p><a href="${link('artistas/perfil.html')}?id=${encodeURIComponent(song.artistId)}">${esc(artist.name)}</a></p><div class="song-buttons" style="margin-top:13px"><span class="tag lime">Tom original: ${esc(song.key)}</span><span class="tag">${esc(song.level||'')}</span>${song.sourceFile?`<a class="btn btn-small btn-light" download href="${link(song.sourceFile)}" style="margin-top:8px">↓ Arquivo original (${esc(sourceTypeLabel(song))})</a>`:""}</div></div></div><div class="song-layout" id="songLayout"><div class="song-cifra-column"><div class="cifra-controls"><div class="control-group"><strong>Tom</strong><div class="stepper"><button id="down" aria-label="Diminuir semitom">−</button><span id="currentKey">${esc(song.key)}</span><button id="up" aria-label="Aumentar semitom">+</button></div><button id="reset" class="btn btn-small btn-light">Original</button></div><div class="control-group"><strong>Fonte</strong><button class="btn btn-small btn-light" id="fontDown" aria-label="Diminuir fonte">A−</button><button class="btn btn-small btn-light" id="fontUp" aria-label="Aumentar fonte">A+</button></div><div class="control-group"><button class="btn btn-small btn-ghost" id="scrollBtn">▶ Rolagem</button><label class="cifra-theme-switch cifra-theme-compact" for="cifraThemeToggle" title="Alternar tema da cifra"><span class="theme-icon" aria-hidden="true">☼</span><input id="cifraThemeToggle" type="checkbox" role="switch" aria-label="Alternar entre tema claro e escuro"><span class="cifra-theme-track" aria-hidden="true"><span class="cifra-theme-knob"></span></span><span class="theme-icon" aria-hidden="true">☾</span><span id="cifraThemeLabel" class="sr-only" aria-live="polite">Claro</span></label>${currentUser()?`<button class="btn btn-small btn-light" id="favoriteBtn">${isFav?'♥ Salvo':'♡ Favoritar'}</button>${activeList?`<a class="btn btn-small btn-light" id="repertoireBackTop" href="${link('repertorio/')}">← Repertório</a>`:`<button class="btn btn-small btn-light" id="repertoireBtn">＋ Repertório</button>`}`:''}<button class="btn btn-small btn-light" id="printBtn">⎙ Imprimir</button></div></div><div class="panel cifra-body" id="cifraBody" style="--chord-size:18px">${renderChordLines(song,steps)}</div>${activeList?`<div class="repertoire-bottom-nav"><a class="btn btn-light repertoire-bottom-back" href="${link('repertorio/')}">← Repertório</a>${nextSong?`<a class="btn btn-primary repertoire-bottom-next" href="${link('musicas/cifra.html')}?id=${encodeURIComponent(nextSong.id)}&key=${encodeURIComponent(repertoireKey(activeList,nextSong))}&list=${encodeURIComponent(activeList.id)}&pos=${activeIndex+1}">Continuar →</a>`:`<a class="btn btn-light repertoire-bottom-next" href="${link('repertorio/')}">Fim da lista</a>`}</div>`:''}</div><aside class="stack song-side-panel" id="songSidePanel"><button type="button" class="song-side-toggle" id="songSideToggle" aria-label="Recolher painel lateral" aria-expanded="true" title="Recolher painel lateral"><span aria-hidden="true">›</span></button><div class="panel song-side-content"><h3 class="side-title">Informações da música</h3><div class="mini-stat"><span>Tom atual</span><strong id="sideKey">${esc(song.key)}</strong></div><div class="mini-stat"><span>Categoria</span><strong>${esc(song.genre||'—')}</strong></div><div class="mini-stat"><span>Álbum / coleção</span><strong>${esc(album?.title||song.collection||'—')}</strong></div><div class="mini-stat"><span>Ritmo</span><strong>${song.bpm?esc(song.bpm)+' BPM':'Livre'}</strong></div><div class="mini-stat"><span>Capotraste</span><strong>${esc(song.capo??0)}ª casa</strong></div><div class="mini-stat"><span>Detecção harmônica</span><strong id="detectKey">—</strong></div><p class="muted tiny" style="margin-top:12px" id="detectDescription"></p></div><div class="panel song-side-content"><h3 class="side-title">Velocidade da rolagem</h3><input id="scrollSpeed" type="range" class="range" min="10" max="130" value="40" aria-label="Velocidade de rolagem"><div class="mini-stat"><span>Mais lenta</span><span>Mais rápida</span></div></div><div class="panel song-side-content"><h3 class="side-title">Acordes utilizados</h3><div class="chord-grid" id="chordGrid"></div><p class="muted tiny" style="margin-top:10px">Diagramas sugeridos; confira a posição ao tocar.</p></div></aside></div>`);const savedReadingTheme=localStorage.getItem('as-cifra-theme')==='dark'?'dark':'light';
 const applyReadingTheme=theme=>{
  const dark=theme==='dark',body=$('#cifraBody'),toggle=$('#cifraThemeToggle'),label=$('#cifraThemeLabel');
  body?.classList.toggle('cifra-theme-dark',dark);body?.classList.toggle('cifra-theme-light',!dark);
  document.body.classList.toggle('reading-theme-dark',dark);document.body.classList.toggle('reading-theme-light',!dark);
  if(toggle){toggle.checked=dark;toggle.setAttribute('aria-checked',String(dark))}
  if(label)label.textContent=dark?'Escuro':'Claro';
  localStorage.setItem('as-cifra-theme',dark?'dark':'light');
 };
 applyReadingTheme(savedReadingTheme);
 $('#cifraThemeToggle').onchange=e=>applyReadingTheme(e.target.checked?'dark':'light');
 const sidePanel=$('#songSidePanel'),songLayout=$('#songLayout'),sideToggle=$('#songSideToggle');
 const setSideCollapsed=collapsed=>{
  songLayout?.classList.toggle('side-collapsed',collapsed);
  sidePanel?.classList.toggle('is-collapsed',collapsed);
  if(sideToggle){
   sideToggle.setAttribute('aria-expanded',String(!collapsed));
   sideToggle.setAttribute('aria-label',collapsed?'Expandir painel lateral':'Recolher painel lateral');
   sideToggle.title=collapsed?'Expandir painel lateral':'Recolher painel lateral';
   const icon=sideToggle.querySelector('span');if(icon)icon.textContent=collapsed?'‹':'›';
  }
  localStorage.setItem('as-cifra-side-collapsed',collapsed?'1':'0');
 };
 setSideCollapsed(localStorage.getItem('as-cifra-side-collapsed')==='1');
 if(sideToggle)sideToggle.onclick=()=>setSideCollapsed(!sidePanel.classList.contains('is-collapsed'));

 const update=()=>{$('#currentKey').textContent=chords.transposeKey(song.key,steps);$('#sideKey').textContent=chords.transposeKey(song.key,steps);$('#cifraBody').innerHTML=renderChordLines(song,steps);$('#chordGrid').innerHTML=chords.chordCollection(layoutSections(song),steps).slice(0,12).map(ch=>`<div class="chord-box"><strong>${esc(ch)}</strong>${chords.chordDiagram(ch)||'<p class="muted tiny">Sem diagrama</p>'}</div>`).join('')};$('#down').onclick=()=>{steps--;update()};$('#up').onclick=()=>{steps++;update()};$('#reset').onclick=()=>{steps=0;update()};$('#fontDown').onclick=()=>{size=Math.max(12,size-2);$('#cifraBody').style.setProperty('--chord-size',size+'px')};$('#fontUp').onclick=()=>{size=Math.min(30,size+2);$('#cifraBody').style.setProperty('--chord-size',size+'px')};if($('#favoriteBtn'))$('#favoriteBtn').onclick=()=>{const fav=favs();isFav=!fav.includes(song.id);setFavs(isFav?[...fav,song.id]:fav.filter(x=>x!==song.id));$('#favoriteBtn').textContent=isFav?'♥ Salvo':'♡ Favoritar';showToast(isFav?'Adicionado aos favoritos':'Removido dos favoritos')};if($('#repertoireBtn'))$('#repertoireBtn').onclick=()=>{const userLists=lists();if(!userLists.length){if(confirm('Você ainda não criou um repertório. Abrir Meu Repertório agora?'))location.href=link('repertorio/');return}const names=userLists.map((l,i)=>`${i+1}. ${l.title}`).join('\n');const answer=prompt(`Adicionar "${song.title}" em qual repertório?\n\n${names}\n\nDigite o número:`);if(answer===null)return;const index=Number(answer)-1,target=userLists[index];if(!target){showToast('Repertório inválido');return}if(target.songIds.includes(song.id)){showToast('Esta música já está nesse repertório');return}setLists(userLists.map(l=>l.id===target.id?{...l,songIds:[...l.songIds,song.id],songKeys:{...(l.songKeys||{}),[song.id]:chords.transposeKey(song.key,steps)}}:l));showToast(`Adicionada em ${target.title}`)};$('#printBtn').onclick=()=>window.print();$('#scrollSpeed').oninput=e=>scrollSpeed=Number(e.target.value);
 function tick(t){
  if(!scrolling)return;
  const body=$('#cifraBody');
  if(!body){stop();return}
  const end=Math.max(0,body.scrollHeight-body.clientHeight);
  if(lastTick){
   const delta=Math.min(80,(t-lastTick)/1000*scrollSpeed);
   body.scrollTop=Math.min(end,body.scrollTop+Math.max(0,delta));
  }
  lastTick=t;
  if(body.scrollTop>=end-1){stop();return}
  raf=requestAnimationFrame(tick);
 }
 function stop(){
  scrolling=false;cancelAnimationFrame(raf);lastTick=0;
  $('#scrollBtn').textContent='▶ Rolagem';
  $('#scrollBtn').setAttribute('aria-pressed','false');
 }
 $('#scrollBtn').setAttribute('aria-pressed','false');
 $('#scrollBtn').onclick=()=>{
  if(scrolling){stop();return}
  const body=$('#cifraBody');if(!body)return;
  if(body.scrollHeight<=body.clientHeight+1){showToast('A cifra já está totalmente visível na caixa');return}
  scrolling=true;lastTick=0;
  $('#scrollBtn').textContent='❚❚ Pausar';
  $('#scrollBtn').setAttribute('aria-pressed','true');
  raf=requestAnimationFrame(tick)
 };window.addEventListener('pagehide',()=>{if(scrolling)stop()},{once:true});const detected=chords.detectKey(layoutSections(song));$('#detectKey').textContent=`${detected.key} (${detected.confidence}%)`;$('#detectDescription').textContent='Estimativa automática de tom pela sequência de acordes, sujeita a erros. Confira pela audição.';update()}
function parseChordpro(text){const lines=String(text||'').split(/\r?\n/);const sections=[];let active={name:'Cifra',lines:[]};for(const l of lines){const match=l.match(/^\s*\{(?:start_of_)?(?:chorus|verse|bridge):?\s*(.*?)\}\s*$/i);if(match){if(active.lines.length)sections.push(active);active={name:match[1]||'Refrão',lines:[]};continue}if(/^\s*\{(?:end_of_)?(?:chorus|verse|bridge)\}/i.test(l))continue;if(/^\s*#/.test(l))continue;if(l.trim()||active.lines.length)active.lines.push(l)}if(active.lines.length)sections.push(active);return sections.length?sections:[{name:'Cifra',lines:[]}]}
function submitPage(){shell(`${heading('COLABORE','Compartilhe uma cifra','Cadastre uma música autoral ou um arranjo cujo conteúdo você tenha autorização para publicar.')}<div class="two-col"><div class="panel"><form id="submitForm"><div class="form-grid"><div><label class="label" for="songTitle">Nome da música *</label><input class="input" id="songTitle" maxlength="140" required placeholder="Ex.: Meu primeiro acorde"></div><div><label class="label" for="songArtist">Artista *</label><input class="input" id="songArtist" maxlength="120" required placeholder="Nome artístico"></div><div><label class="label" for="songAlbum">Álbum / EP</label><input class="input" id="songAlbum" maxlength="120" placeholder="Opcional"></div><div><label class="label" for="songGenre">Estilo</label><select class="select" id="songGenre" style="width:100%"><option>MPB</option><option>Pop</option><option>Rock</option><option>Sertanejo</option><option>Gospel</option><option>Indie</option><option>Outro</option></select></div><div><label class="label" for="songKey">Tom original</label><select class="select" id="songKey" style="width:100%">${chords.CHROMATIC_SHARP.map(n=>`<option>${n}</option>`).join('')}${chords.CHROMATIC_SHARP.map(n=>`<option>${n}m</option>`).join('')}</select></div><div><label class="label" for="songBpm">Andamento (BPM)</label><input class="input" id="songBpm" type="number" min="30" max="280" value="90"></div><div class="full"><label class="label" for="songBody">Cifra no formato [Acorde]letra *</label><textarea class="textarea" id="songBody" style="min-height:230px;font-family:'DM Mono',monospace" required minlength="25" placeholder="[C]Meu verso começa aqui [G]e vai além...&#10;[Am]Outro pedaço da [F]canção..."></textarea><p class="muted tiny">O acorde fica entre colchetes exatamente antes da sílaba. Separe estrofes por linhas vazias.</p></div><div class="full"><label style="display:flex;gap:8px;align-items:start;font-size:.82rem"><input type="checkbox" id="rights" required> Confirmo que criei este conteúdo ou possuo autorização para disponibilizá-lo.</label></div></div><div class="form-actions"><button class="btn btn-primary" type="submit">Enviar para revisão →</button><button class="btn btn-light" type="button" id="previewBtn">Pré-visualizar</button></div></form><div class="hidden" id="previewArea" style="margin-top:20px"><h3>Prévia</h3><div class="panel cifra-body" id="previewBody"></div></div></div><aside class="stack"><div class="notice"><strong>Como funciona?</strong><p>1. Escreva a cifra com acordes entre colchetes. 2. Visualize como ficará. 3. Envie para a fila de moderação. 4. O administrador poderá aprovar ou rejeitar.</p></div><div class="notice warning"><strong>Dados de demonstração</strong><p>Esta versão em HTML usa o armazenamento local do navegador, sem contas e sem sincronização. Para publicação com contribuições reais, é necessário conectar um servidor e autenticação.</p></div><div class="panel"><h3>Exemplo de formatação</h3><pre style="white-space:pre-wrap;font-size:.83rem">[G]Começa um novo [D]dia\n[Em]Sinto a [C]melodia</pre></div></aside></div>`);const params=new URLSearchParams(location.search);
 if(params.has('title'))$('#songTitle').value=params.get('title').slice(0,140);
 if(params.has('artist'))$('#songArtist').value=params.get('artist').slice(0,120);
 if(params.has('genre')){const select=$('#songGenre');if([...select.options].some(x=>x.value===params.get('genre')))select.value=params.get('genre')}
 $('#previewBtn').onclick=()=>{const sections=parseChordpro($('#songBody').value);$('#previewArea').classList.remove('hidden');$('#previewBody').innerHTML=renderChordLines({sections,key:$('#songKey').value},0)};$('#submitForm').onsubmit=e=>{e.preventDefault();const title=$('#songTitle').value.trim(),name=$('#songArtist').value.trim(),sections=parseChordpro($('#songBody').value),text=sections.flatMap(s=>s.lines).join('');if(!title||!name||!text.trim()||!$('#rights').checked){showToast('Preencha os campos obrigatórios');return}const id='env-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,6);const entry={id,title,artistName:name,albumTitle:$('#songAlbum').value.trim(),genre:$('#songGenre').value,key:$('#songKey').value,bpm:Number($('#songBpm').value)||90,level:'Comunidade',capo:0,sections,status:'pending',submittedAt:new Date().toISOString()};setStore('pending',[...pending(),entry]);$('#submitForm').reset();$('#previewArea').classList.add('hidden');showToast('Cifra enviada para revisão local!');}};
function adminPage(){const pend=pending(),approved=getStore('approved',[]),rejected=getStore('rejected',[]);shell(`${heading('GERENCIAMENTO','Painel editorial','Revise contribuições, aprove cifras e exporte os dados cadastrados.')}<div class="notice warning" style="margin-bottom:19px"><strong>Protótipo local, não seguro para produção.</strong> Qualquer pessoa com acesso a esta página neste navegador pode aprovar itens. Para um site público, é obrigatório implementar login, permissões no servidor e banco de dados.</div><div class="stat-row" style="margin-bottom:23px"><div class="stat"><strong>${pend.length}</strong><small>Pendentes de aprovação</small></div><div class="stat"><strong>${approved.length}</strong><small>Aprovadas localmente</small></div><div class="stat"><strong>${rejected.length}</strong><small>Rejeitadas localmente</small></div></div><div class="section-head"><h2>Fila de revisão</h2><button class="btn btn-light btn-small" id="exportBtn">↓ Exportar dados JSON</button></div><div class="stack" id="reviewList">${pend.length?pend.map(song=>`<div class="panel"><div class="source-row"><div><strong>${esc(song.title)}</strong><small>Enviado por ${esc(song.artistName)} · ${esc(song.genre)} · ${esc(song.key)}</small></div><span class="status pending">Pendente</span></div><details style="margin-top:8px"><summary style="cursor:pointer;font-weight:800">Ver cifra enviada</summary><pre style="white-space:pre-wrap;font-family:'DM Mono',monospace;font-size:.78rem;max-height:280px;overflow:auto">${esc(song.sections.map(s=>s.lines.join('\n')).join('\n\n'))}</pre></details><div class="form-actions"><button class="btn btn-small btn-lime" data-approve="${esc(song.id)}">✓ Aprovar</button><button class="btn btn-small btn-light" data-reject="${esc(song.id)}">✕ Rejeitar</button></div></div>`).join(''):'<div class="empty"><strong>Nenhuma cifra pendente.</strong>As contribuições enviadas neste navegador aparecerão aqui.</div>'}</div><section class="section"><div class="section-head"><h2>Publicações da comunidade</h2></div><div class="music-grid">${approved.map(musicCard).join('')||'<div class="empty">Ainda não há cifras aprovadas.</div>'}</div></section>`);$$('[data-approve]').forEach(btn=>btn.onclick=()=>moderate(btn.dataset.approve,'approve'));$$('[data-reject]').forEach(btn=>btn.onclick=()=>moderate(btn.dataset.reject,'reject'));$('#exportBtn').onclick=()=>{const blob=new Blob([JSON.stringify({pending:pending(),approved:getStore('approved',[]),rejected:getStore('rejected',[]),extraArtists:getStore('extraArtists',[]),extraAlbums:getStore('extraAlbums',[])},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='acorde-studio-dados.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),5000)}}
function moderate(id,action){const song=pending().find(s=>s.id===id);if(!song)return;setStore('pending',pending().filter(s=>s.id!==id));if(action==='reject'){setStore('rejected',[...getStore('rejected',[]),{...song,status:'rejected'}]);showToast('Cifra rejeitada');adminPage();return}let artists=allArtists(),artist=artists.find(a=>normalize(a.name)===normalize(song.artistName)),artistId=artist?.id;if(!artist){artistId='artist-'+song.id;setStore('extraArtists',[...getStore('extraArtists',[]),{id:artistId,name:song.artistName,genre:song.genre,description:'Artista cadastrado pela comunidade.',photo:'assets/img/album-04.svg'}])}let albumId='';if(song.albumTitle){let albums=allAlbums(),alb=albums.find(a=>a.artistId===artistId&&normalize(a.title)===normalize(song.albumTitle));if(alb)albumId=alb.id;else{albumId='album-'+song.id;setStore('extraAlbums',[...getStore('extraAlbums',[]),{id:albumId,title:song.albumTitle,artistId,year:new Date().getFullYear(),cover:'assets/img/album-05.svg'}])}}let {artistName,albumTitle,status,submittedAt,...rest}=song;setStore('approved',[...getStore('approved',[]),{...rest,artistId,albumId,date:new Date().toISOString().slice(0,10)}]);showToast('Cifra aprovada e publicada neste navegador');adminPage()}
function loginPage(){
 const user=currentUser(),params=new URLSearchParams(location.search),next=params.get('next')||'repertorio/';
 // Restrinja redirecionamentos a rotas internas conhecidas.
 const dest=/^(?:repertorio\/|musicas\/cifra\.html\?id=[\w-]+)$/.test(next)?next:'repertorio/';
 if(user){shell(`${heading('SUA CONTA','Você já está no seu perfil',`Acesso local de ${esc(user.name)}.`)}<div class="auth-card"><p>Você já pode salvar músicas e criar listas neste navegador.</p><div class="form-actions"><a class="btn btn-primary" href="${link('repertorio/')}">Ir para meu repertório ↗</a><button class="btn btn-light" id="logoutBtn">Sair do perfil</button></div></div>`);$('#logoutBtn').onclick=()=>{setStore('currentUser',null);location.href=link('login/')};return}
 shell(`<div class="auth-layout"><div class="auth-intro"><span class="eyebrow">MEU REPERTÓRIO</span><h1>Suas músicas.<br><span>Seu espaço.</span></h1><p>Crie um perfil de demonstração para salvar as cifras que você mais gosta e montar listas para tocar.</p><div class="auth-benefits"><span>✓ Cifras favoritas</span><span>✓ Listas de músicas</span><span>✓ Tudo separado do catálogo público</span></div></div><div class="panel auth-card"><h2>Entrar no meu espaço</h2><p class="muted">Experimente o perfil local</p><form id="localLoginForm" class="stack" style="margin-top:22px"><div><label class="label" for="profileName">Seu nome</label><input class="input" id="profileName" name="profileName" type="text" placeholder="Como podemos chamar você?" required minlength="2" maxlength="70" autocomplete="name"></div><div><label class="label" for="profileEmail">Seu e-mail</label><input class="input" id="profileEmail" name="profileEmail" type="email" placeholder="voce@exemplo.com" required autocomplete="email"></div><button type="submit" class="btn btn-primary">Acessar meu repertório ↗</button></form><div class="notice warning" style="margin-top:20px"><strong>Importante:</strong> este é um perfil <strong>de demonstração</strong>. Não há senha, autenticação real ou sincronização. Os dados ficam neste navegador. Para disponibilizar contas seguras online, será necessário integrar um serviço de autenticação e banco de dados.</div></div></div>`);
 $('#localLoginForm').onsubmit=e=>{e.preventDefault();const name=$('#profileName').value.trim(),email=$('#profileEmail').value.trim().toLowerCase();if(name.length<2||!email.includes('@'))return;setStore('currentUser',{name,email});location.href=link(dest)};
}
function repertoirePage(){
 const user=currentUser();if(!user){shell(`<div class="repertoire-gate"><div class="gate-graphic">♡</div><span class="eyebrow">ESPAÇO PESSOAL</span><h1>Meu repertório</h1><p>Explore as cifras livremente. Quando quiser guardar suas favoritas e criar listas, entre no seu espaço pessoal.</p><a class="btn btn-primary" href="${link('login/')}">Entrar / criar perfil local ↗</a><small>Perfil de demonstração salvo apenas neste navegador.</small></div>`);return}
 const ids=favs(),songs=allSongs().filter(s=>ids.includes(s.id)),playlists=lists();
 shell(`<div class="repertoire-top"><div>${heading('MEU ESPAÇO',`Olá, ${esc(user.name.split(' ')[0])} ♡`,'Suas cifras favoritas e listas para ensaiar, organizadas em um só lugar.')}</div><button class="btn btn-light btn-small" id="logoutBtn">Sair do perfil</button></div><div class="repertoire-counters"><div><strong>${songs.length}</strong><small>Cifras favoritas</small></div><div><strong>${playlists.length}</strong><small>Listas criadas</small></div><div><strong>${esc(user.email)}</strong><small>Perfil local ativo</small></div></div><section class="section" style="padding-top:32px"><div class="home-section-heading"><div><span class="eyebrow">PARA TOCAR</span><h2>Minhas músicas salvas</h2></div><a class="section-more" href="${link('musicas/')}">Encontrar cifras ↗</a></div>${songs.length?`<div class="music-grid">${songs.map(musicCard).join('')}</div>`:`<div class="empty"><strong>Você ainda não salvou nenhuma cifra.</strong>Abra uma música do catálogo e clique em “♡ Favoritar”.<p style="margin-top:14px"><a href="${link('musicas/')}" class="btn btn-primary btn-small">Explorar cifras ↗</a></p></div>`}</section><section class="section" style="padding-top:24px"><div class="home-section-heading"><div><span class="eyebrow">ORGANIZAÇÃO</span><h2>Minhas listas</h2><p>Organize seu show, ensaio ou estudo. Cada item aponta para a música original do catálogo, sem criar cópias.</p></div></div><form id="createList" class="list-create"><input class="input" id="listTitle" placeholder="Ex.: Ensaio de sábado" maxlength="70" required aria-label="Nome da lista"><button class="btn btn-primary" type="submit">+ Criar lista</button></form><div class="playlist-grid">${playlists.map(pl=>`<article class="playlist-card"><div class="playlist-head"><span class="playlist-icon">♫</span><button class="playlist-remove" data-remove-list="${esc(pl.id)}" title="Excluir lista" aria-label="Excluir lista ${esc(pl.title)}">×</button></div><h3>${esc(pl.title)}</h3><p>${pl.songIds.length} música(s)</p><div class="playlist-tracks">${pl.songIds.length?'':`<div class="playlist-empty-list">Sua lista aparecerá aqui</div>`}${pl.songIds.map(id=>allSongs().find(s=>s.id===id)).filter(Boolean).map((s,index,arr)=>`<div class="playlist-track-row"><span class="playlist-position">${index+1}</span><div class="playlist-track-main"><a href="${link('musicas/cifra.html')}?id=${encodeURIComponent(s.id)}&key=${encodeURIComponent(repertoireKey(pl,s))}&list=${encodeURIComponent(pl.id)}&pos=${index}">${esc(s.title)}</a><small>${esc(artistBy(s.artistId).name)} · Tom <strong>${esc(repertoireKey(pl,s))}</strong></small></div><label class="playlist-key-picker">Tom <select data-song-key-list="${esc(pl.id)}" data-song="${esc(s.id)}" aria-label="Tom de ${esc(s.title)}">${repertoireKeyOptions(s).map(k=>`<option value="${esc(k)}" ${k===repertoireKey(pl,s)?'selected':''}>${esc(k)}</option>`).join('')}</select></label><div class="playlist-track-actions"><button data-move-up="${esc(pl.id)}" data-song="${esc(s.id)}" aria-label="Mover ${esc(s.title)} para cima" title="Mover para cima" ${index===0?'disabled':''}>↑</button><button data-move-down="${esc(pl.id)}" data-song="${esc(s.id)}" aria-label="Mover ${esc(s.title)} para baixo" title="Mover para baixo" ${index===arr.length-1?'disabled':''}>↓</button><button data-remove-track="${esc(pl.id)}" data-song="${esc(s.id)}" aria-label="Remover ${esc(s.title)} da lista" title="Remover">×</button></div></div>`).join('')}</div><div class="playlist-add"><select aria-label="Escolha uma cifra para adicionar" data-add-select="${esc(pl.id)}"><option value="">Adicionar cifra...</option>${allSongs().filter(s=>!pl.songIds.includes(s.id)).map(s=>`<option value="${esc(s.id)}">${esc(s.title)} — ${esc(artistBy(s.artistId).name)}</option>`).join('')}</select><button type="button" class="btn btn-small btn-light" data-add-track="${esc(pl.id)}">Adicionar</button></div></article>`).join('')}</div></section><div class="notice warning" style="margin-top:34px">Os repertórios guardam somente a organização das músicas por ID. Nesta versão, o perfil fica salvo apenas neste navegador; para sincronizar entre aparelhos será necessária autenticação online.</div>`);
 $('#logoutBtn').onclick=()=>{setStore('currentUser',null);location.href=link('')};
 $('#createList').onsubmit=e=>{e.preventDefault();const title=$('#listTitle').value.trim();if(!title)return;setLists([...lists(),{id:'lista-'+Date.now().toString(36),title,songIds:[],songKeys:{}}]);repertoirePage()};
 $$('[data-remove-list]').forEach(b=>b.onclick=()=>{if(confirm('Excluir esta lista?')){setLists(lists().filter(l=>l.id!==b.dataset.removeList));repertoirePage()}});
 const playlistGrid=$('.playlist-grid');
 if(playlistGrid)playlistGrid.onclick=e=>{
  const btn=e.target.closest('button');if(!btn)return;
  if(btn.dataset.addTrack){
   const sel=$(`[data-add-select="${btn.dataset.addTrack}"]`);
   if(!sel?.value){showToast('Escolha uma cifra para adicionar');return}
   const current=lists(),target=current.find(l=>l.id===btn.dataset.addTrack);
   if(!target){showToast('Lista não encontrada');return}
   if(target.songIds.includes(sel.value)){showToast('Esta música já está nessa lista');return}
   const addedSong=allSongs().find(s=>s.id===sel.value);setLists(current.map(l=>l.id===target.id?{...l,songIds:[...l.songIds,sel.value],songKeys:{...(l.songKeys||{}),[sel.value]:addedSong?.key||'C'}}:l));
   showToast('Música adicionada à lista');
   repertoirePage();return;
  }
  if(btn.dataset.removeTrack){
   setLists(lists().map(l=>{if(l.id!==btn.dataset.removeTrack)return l;const keys={...(l.songKeys||{})};delete keys[btn.dataset.song];return {...l,songIds:l.songIds.filter(x=>x!==btn.dataset.song),songKeys:keys}}));
   repertoirePage();return;
  }
  if(btn.dataset.moveUp){
   setLists(lists().map(l=>{if(l.id!==btn.dataset.moveUp)return l;const ids=[...l.songIds],i=ids.indexOf(btn.dataset.song);if(i>0)[ids[i-1],ids[i]]=[ids[i],ids[i-1]];return {...l,songIds:ids}}));
   repertoirePage();return;
  }
  if(btn.dataset.moveDown){
   setLists(lists().map(l=>{if(l.id!==btn.dataset.moveDown)return l;const ids=[...l.songIds],i=ids.indexOf(btn.dataset.song);if(i>=0&&i<ids.length-1)[ids[i+1],ids[i]]=[ids[i],ids[i+1]];return {...l,songIds:ids}}));
   repertoirePage();return;
  }
 };
 if(playlistGrid)playlistGrid.onchange=e=>{const select=e.target.closest('select[data-song-key-list]');if(!select)return;setLists(lists().map(l=>l.id===select.dataset.songKeyList?{...l,songKeys:{...(l.songKeys||{}),[select.dataset.song]:select.value}}:l));showToast('Tom salvo neste repertório')};
}
let metronomeTimer=null,audioCtx=null;function toolsPage(){shell(`${heading('FERRAMENTAS','Seu estúdio de bolso','Recursos simples para praticar, estudar acordes e descobrir possíveis tons.')}<div class="two-col"><div class="stack"><div class="panel"><div class="tool-head"><div><span class="eyebrow">PRATIQUE</span><h2>Metrônomo</h2></div><span class="tag lime">Áudio</span></div><div class="metronome-beat" id="beatVisual">90</div><input class="range" type="range" id="bpmRange" min="40" max="220" value="90" aria-label="Batidas por minuto"><div class="form-actions"><button id="metroStart" class="btn btn-primary">▶ Iniciar</button><button id="metroStop" class="btn btn-light">■ Parar</button></div><p class="muted tiny" style="margin-top:10px">Clique em iniciar para habilitar o som no navegador.</p></div><div class="panel"><div><span class="eyebrow">EXPLORE</span><h2>Notas e acordes</h2></div><p style="margin:0 0 13px"><a class="btn btn-light" href="${link('dicionario/')}">Abrir dicionário completo ↗</a></p><p class="muted" style="margin:8px 0 13px">Clique em uma nota para ver um acorde básico de violão.</p><div class="note-list" id="notes">${['C','D','E','F','G','A','B','Am','Dm','Em','Bm'].map(n=>`<button data-note="${n}">${n}</button>`).join('')}</div><div id="chosenChord" style="margin-top:16px"></div></div></div><div class="stack"><div class="panel"><span class="eyebrow">INTELIGÊNCIA MUSICAL</span><h2>Detector de tom</h2><p class="muted" style="margin:10px 0 14px">Insira uma sequência de acordes (ex.: G D Em C) para receber uma estimativa da tonalidade.</p><label for="detectText" class="label">Acordes separados por espaços</label><textarea class="textarea" id="detectText">G D Em C G D C G</textarea><button id="detectBtn" class="btn btn-primary" style="margin-top:13px">Analisar progressão</button><div id="detectResult" class="notice" style="margin-top:12px" aria-live="polite">Aguardando acordes...</div></div><div class="panel"><span class="eyebrow">AFINAÇÃO</span><h2>Afinador de referência</h2><p class="muted" style="margin:11px 0">Ouça o som de referência para as cordas soltas do violão (E A D G B E). Não analisa o microfone nesta versão.</p><div class="note-list" id="tuningButtons">${[['E2',82.41],['A2',110],['D3',146.83],['G3',196],['B3',246.94],['E4',329.63]].map(([n,h])=>`<button data-hz="${h}">${n}</button>`).join('')}</div></div></div></div>`);function audio(){audioCtx??=new (window.AudioContext||window.webkitAudioContext)();audioCtx.resume();return audioCtx}function beep(hz=1000,duration=.04,volume=.1,kind='sine'){const c=audio(),o=c.createOscillator(),g=c.createGain();o.frequency.value=hz;o.type=kind;g.gain.setValueAtTime(volume,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+duration);o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+duration)}let beat=0;function runMetronome(){if(metronomeTimer)clearInterval(metronomeTimer);let bpm=Number($('#bpmRange').value);$('#beatVisual').textContent=bpm;beat=0;const tick=()=>{beep(beat%4===0?1400:900,.035,.1,'square');$('#beatVisual').classList.add('pulse');setTimeout(()=>$('#beatVisual')?.classList.remove('pulse'),100);beat++};tick();metronomeTimer=setInterval(tick,60000/bpm)}$('#metroStart').onclick=runMetronome;$('#metroStop').onclick=()=>{clearInterval(metronomeTimer);metronomeTimer=null;$('#beatVisual').classList.remove('pulse')};$('#bpmRange').oninput=e=>{let bpm=e.target.value;$('#beatVisual').textContent=bpm;if(metronomeTimer)runMetronome()};$$('[data-note]').forEach(btn=>btn.onclick=()=>{$('#chosenChord').innerHTML=`<div class="chord-box" style="max-width:170px"><h3>${esc(btn.dataset.note)}</h3>${chords.chordDiagram(btn.dataset.note)}</div>`});$$('[data-hz]').forEach(btn=>btn.onclick=()=>{const c=audio(),o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.value=Number(btn.dataset.hz);g.gain.setValueAtTime(.14,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+1.35);o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+1.35)});$('#detectBtn').onclick=()=>{const str=$('#detectText').value;const list=str.match(/\b[A-G](?:#|b)?(?:maj7|m7b5|m7|m|dim|7|sus4)?(?:\/[A-G](?:#|b)?)?\b/g)||[];if(!list.length){$('#detectResult').textContent='Não identifiquei acordes. Tente: G D Em C';return}const result=chords.detectKey([{lines:[list.map(x=>`[${x}]`).join(' ')]}]);$('#detectResult').innerHTML=`<strong>Tom provável: ${esc(result.key)}</strong><p>Confiança aproximada: ${result.confidence}%. É uma estimativa por progressão harmônica e pode sugerir o relativo menor ou maior.</p>`}};

function catholicPage(){
 const items=allSongs().filter(s=>s.genre==='Católica');
 const groups=cat.albums;
 shell(`${heading('CANTOS • FÉ • COMUNIDADE','Músicas Católicas',`${items.length} cifras importadas dos documentos enviados. Pesquise, abra e mude o tom de cada música.`)}
 <div class="catholic-intro"><span class="catholic-cross">✝</span><div><strong>Seu acervo católico, reunido em um só lugar.</strong><p>As coleções abaixo são agrupamentos temáticos criados para organizar as músicas — não representam álbuns oficiais. Os artistas foram identificados automaticamente quando possível.</p></div></div>
 <section class="section"><div class="home-section-heading"><div><span class="eyebrow">ESCOLHA UM TEMA</span><h2>Coleções por tema</h2></div></div><div class="catholic-collections">${groups.map(g=>`<a class="catholic-collection" href="${link('gallery/albuns/')}?id=${encodeURIComponent(g.id)}"><img loading="lazy" src="${imageUrl(g.cover)}" alt="Arte temática da coleção ${esc(g.title)}"><strong>${esc(g.title)}</strong><small>${items.filter(s=>s.albumId===g.id).length} cifras ↗</small></a>`).join('')}</div></section>
 <section class="section"><div class="home-section-heading"><div><span class="eyebrow">ACERVO COMPLETO</span><h2>Encontre sua música</h2><p>Busque por título ou artista. Clique na capa para abrir a cifra interativa.</p></div></div>
 ${filterUI('catholic',items,'Buscar entre as músicas católicas...')}
 </section>`);
 filterBox(items,'catholic');
 const genre=$('#catholic-genre');if(genre){genre.remove();}
 const q=new URLSearchParams(location.search).get('q');if(q){$('#catholic-search').value=q;$('#catholic-search').dispatchEvent(new Event('input'));}
}

const render={reference:referencePage,catholic:catholicPage,home,songs:songsPage,song:songPage,artists:artistsPage,artist:artistPage,gallery:galleryPage,albums:albumsPage,gallerysongs:gallerySongs,submit:submitPage,admin:adminPage,tools:toolsPage,login:loginPage,repertorio:repertoirePage};(render[page]||home)();
