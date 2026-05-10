/* ═══════════════════════════════════════════════════════
   TEMAS POR HORA — la hora se lee automáticamente
   del dispositivo del usuario (new Date().getHours()).
   Puedes cambiar los colores de cada período aquí.
═══════════════════════════════════════════════════════ */
const THEMES = {
  dawn: {        /* 5–7 am  amanecer */
    sky:['#FF7043','#FFCC80'], ground:'#6aaa2a',
    cel:'#FFF176', celShadow:'0 0 30px #FFF176,0 0 65px rgba(255,241,118,.4)',
    clouds:.65, stars:0
  },
  morning: {     /* 7–12 am  mañana */
    sky:['#64B5F6','#B3E5FC'], ground:'#7ab830',
    cel:'#FFD700', celShadow:'0 0 36px #FFD700,0 0 72px rgba(255,215,0,.45)',
    clouds:.85, stars:0
  },
  afternoon: {   /* 12–17 pm  tarde */
    sky:['#42A5F5','#90CAF9'], ground:'#6aaa2a',
    cel:'#FFF176', celShadow:'0 0 28px #FFF176,0 0 58px rgba(255,241,118,.35)',
    clouds:.75, stars:0
  },
  evening: {     /* 17–20 pm  atardecer */
    sky:['#BF360C','#FF8A65'], ground:'#4a7a18',
    cel:'#FF7043', celShadow:'0 0 42px #FF7043,0 0 85px rgba(255,112,67,.5)',
    clouds:.9, stars:0
  },
  night: {       /* 20–5 am  noche */
    sky:['#0D1B4B','#1A237E'], ground:'#2d5010',
    cel:'#E0E0E0', celShadow:'0 0 26px #E0E0E0,0 0 54px rgba(220,220,220,.3)',
    clouds:.2, stars:1
  }
};

function getTheme() {
  const h = new Date().getHours(); /* ← hora local del dispositivo */
  if (h>=5  && h<7)  return THEMES.dawn;
  if (h>=7  && h<12) return THEMES.morning;
  if (h>=12 && h<17) return THEMES.afternoon;
  if (h>=17 && h<20) return THEMES.evening;
  return THEMES.night;
}


const FLOWERS = [
  { xPct:.06, stemH:62, r:28, color:'#FF80AB', center:'#FFD740', petals:8,  delay:0   },
  { xPct:.16, stemH:46, r:20, color:'#F48FB1', center:'#FF6D00', petals:6,  delay:.45 },
  { xPct:.27, stemH:78, r:34, color:'#FF4081', center:'#FFD740', petals:10, delay:.9  },
  { xPct:.38, stemH:54, r:24, color:'#CE93D8', center:'#FF8F00', petals:8,  delay:1.3 },
  { xPct:.50, stemH:85, r:38, color:'#FF80AB', center:'#FFD740', petals:8,  delay:1.7 },
  { xPct:.61, stemH:48, r:22, color:'#FF4081', center:'#FFD740', petals:6,  delay:2.1 },
  { xPct:.72, stemH:72, r:30, color:'#F48FB1', center:'#FF6D00', petals:8,  delay:2.5 },
  { xPct:.83, stemH:44, r:18, color:'#CE93D8', center:'#FFD740', petals:6,  delay:2.9 },
  { xPct:.92, stemH:58, r:25, color:'#FF80AB', center:'#FF6D00', petals:8,  delay:3.2 },
];

/* ── Utilidades ─────────────────────────────────────── */
function flowerScale() { return Math.min(1, window.innerWidth / 420); }

function darken(hex, amt) {
  const n = parseInt(hex.replace('#',''),16);
  const c = v => Math.min(255,Math.max(0,v));
  const r=c((n>>16)+amt), g=c(((n>>8)&0xFF)+amt), b=c((n&0xFF)+amt);
  return '#'+((r<<16)|(g<<8)|b).toString(16).padStart(6,'0');
}

function petalPath(r) {
  const tip=-r*1.58, w=r*0.52;
  return `M0 0 C${-w} ${-r*.45},${-w*.75} ${tip+r*.3},0 ${tip} C${w*.75} ${tip+r*.3},${w} ${-r*.45},0 0 Z`;
}

function makeFlowerSVG(cfg, scale) {
  const r=cfg.r*scale, stemH=cfg.stemH*scale, totalW=r*3.4;
  const pd=petalPath(r), step=360/cfg.petals;
  let pts='';
  for(let i=0;i<cfg.petals;i++)
    pts+=`<path d="${pd}" fill="${cfg.color}" fill-opacity=".9"
      stroke="${darken(cfg.color,-18)}" stroke-width=".8"
      transform="rotate(${step*i})"/>`;
  return `<svg class="flower-svg"
    width="${totalW}" height="${r*2+stemH+6}"
    viewBox="${-totalW/2} ${-r*1.65} ${totalW} ${r*2+stemH+6}"
    style="animation-delay:${cfg.delay}s" overflow="visible">
    <rect x="-3" y="0" width="6" height="${stemH+4}" rx="3" fill="#4e8818"/>
    <ellipse cx="${r*.6}" cy="${stemH*.42}" rx="${r*.44}" ry="${r*.19}"
      fill="#5aaa20" transform="rotate(-28,${r*.6},${stemH*.42})"/>
    <g>${pts}</g>
    <circle r="${r*.32}" fill="${cfg.center}"/>
    <circle r="${r*.15}" fill="${darken(cfg.center,-40)}"/>
  </svg>`;
}

/* ── Escenario ──────────────────────────────────────── */
function applyTheme(t) {
  document.getElementById('sky').style.background =
    `linear-gradient(180deg,${t.sky[0]} 0%,${t.sky[1]} 100%)`;
  document.getElementById('ground').style.background = t.ground;
  const cel = document.getElementById('celestial');
  cel.style.background = t.cel;
  cel.style.boxShadow  = t.celShadow;
  document.getElementById('stars').style.opacity = t.stars;
  document.querySelectorAll('.cloud').forEach(c => c.style.opacity = t.clouds);
}

function placeCelestial() {
  const cel=document.getElementById('celestial');
  const W=window.innerWidth, H=window.innerHeight;
  const sz=Math.max(40,Math.min(68,W*.1));
  Object.assign(cel.style,{
    width:sz+'px', height:sz+'px',
    top:Math.max(22,H*.06)+'px', right:Math.max(18,W*.1)+'px'
  });
}

function buildStars() {
  const c=document.getElementById('stars'); c.innerHTML='';
  for(let i=0;i<90;i++){
    const s=document.createElement('div'); s.className='star';
    const sz=1+Math.random()*2.5;
    s.style.cssText=`width:${sz}px;height:${sz}px;
      left:${Math.random()*100}%;top:${Math.random()*55}%;
      animation-delay:${Math.random()*3}s;
      animation-duration:${1.5+Math.random()*2.5}s`;
    c.appendChild(s);
  }
}

function buildClouds() {
  const c=document.getElementById('cloudsContainer'); c.innerHTML='';
  const sc=Math.min(1,window.innerWidth/500);
  [{left:'7%',top:'7%',w:100},{left:'32%',top:'11%',w:76},{left:'62%',top:'5%',w:108}]
  .forEach(d=>{
    const w=d.w*sc, h=w*.3;
    const div=document.createElement('div');
    div.className='cloud';
    div.style.cssText=`position:absolute;left:${d.left};top:${d.top}`;
    div.innerHTML=`<div style="position:relative;background:#fff;
      width:${w}px;height:${h}px;border-radius:${h}px">
      <div style="position:absolute;background:#fff;border-radius:50%;
        width:${w*.5}px;height:${w*.5}px;top:-${w*.25}px;left:${w*.1}px"></div>
      <div style="position:absolute;background:#fff;border-radius:50%;
        width:${w*.38}px;height:${w*.38}px;top:-${w*.16}px;left:${w*.46}px"></div>
    </div>`;
    c.appendChild(div);
  });
}

function buildGrass() {
  const c=document.getElementById('grassContainer'); c.innerHTML='';
  const n=Math.round(window.innerWidth/14);
  for(let i=0;i<n;i++){
    const g=document.createElement('div'); g.className='grass-blade';
    g.style.cssText=`left:${Math.random()*100}%;
      height:${8+Math.random()*15}px;
      transform:rotate(${(Math.random()-.5)*38}deg);
      background:hsl(${88+Math.random()*22},${50+Math.random()*22}%,${28+Math.random()*16}%)`;
    c.appendChild(g);
  }
}

function buildButterflies() {
  const c=document.getElementById('butterfliesContainer'); c.innerHTML='';
  const W=window.innerWidth, fly=Math.min(45,W*.1);
  const list=[
    {x:'15%',y:'20%',c1:'#FF80AB',c2:'#FFD740',dur:5},
    {x:'48%',y:'15%',c1:'#CE93D8',c2:'#FF8F00',dur:6.5},
    {x:'74%',y:'22%',c1:'#80DEEA',c2:'#69F0AE',dur:5.8},
  ];
  (W<360?list.slice(0,2):list).forEach((b,i)=>{
    const el=document.createElement('div'); el.className='butterfly';
    const sz=Math.max(22,Math.min(34,W*.07));
    el.style.cssText=`left:${b.x};top:${b.y};
      animation-duration:${b.dur}s;animation-delay:${i*.8}s;
      --bx1:${fly}px;--by1:${-fly*.7}px;
      --bx2:${fly*.2}px;--by2:${-fly*1.4}px;
      --bx3:${-fly*.7}px;--by3:${-fly*.8}px;
      --bx4:${-fly*.3}px;--by4:${fly*.25}px`;
    el.innerHTML=`<svg class="butterfly-svg"
      width="${sz}" height="${sz*.72}" viewBox="0 0 34 24">
      <ellipse cx="8"  cy="9"  rx="8"  ry="9"  fill="${b.c1}" opacity=".82"/>
      <ellipse cx="26" cy="9"  rx="8"  ry="9"  fill="${b.c1}" opacity=".82"/>
      <ellipse cx="8"  cy="17" rx="6"  ry="6"  fill="${b.c2}" opacity=".72"/>
      <ellipse cx="26" cy="17" rx="6"  ry="6"  fill="${b.c2}" opacity=".72"/>
      <line x1="17" y1="2" x2="17" y2="22" stroke="#333" stroke-width="1.5"/>
      <path d="M17 3 Q15 1 12 2" stroke="#333" stroke-width=".9" fill="none"/>
      <path d="M17 3 Q19 1 22 2" stroke="#333" stroke-width=".9" fill="none"/>
    </svg>`;
    c.appendChild(el);
  });
}

function buildFlowers() {
  const c=document.getElementById('flowersContainer'); c.innerHTML='';
  const W=window.innerWidth, scale=flowerScale();
  const list = W<400
    ? FLOWERS.filter((_,i)=>i%2===0)
    : W<550
    ? FLOWERS.filter((_,i)=>i!==1&&i!==7)
    : FLOWERS;
  list.forEach(cfg=>{
    const wrap=document.createElement('div'); wrap.className='flower-wrap';
    const r=cfg.r*scale;
    wrap.style.left=(cfg.xPct*W - r*1.7)+'px';
    wrap.style.animationDelay=(cfg.delay+.5)+'s';
    wrap.innerHTML=makeFlowerSVG(cfg,scale);
    c.appendChild(wrap);
    setTimeout(()=>wrap.classList.add('visible'), cfg.delay*1000+80);
  });
  return list[list.length-1].delay;
}

function spawnPetals() {
  const colors=['#FF80AB','#F48FB1','#CE93D8','#FF4081','#FFD740'];
  const W=window.innerWidth;
  return setInterval(()=>{
    const p=document.createElement('div'); p.className='petal-fly';
    const sz=7+Math.random()*8, dx=(Math.random()*100-50)*(W/400);
    p.style.cssText=`width:${sz}px;height:${sz}px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      left:${10+Math.random()*80}%;top:${5+Math.random()*42}%;
      --dx:${dx}px;--dy:${Math.random()*70+20}px;
      --dr:${Math.random()*720-360}deg;
      animation-duration:${2+Math.random()*2.2}s;opacity:.87`;
    document.getElementById('garden').appendChild(p);
    setTimeout(()=>p.remove(),4500);
  },340);
}

/* ── Flujo principal ────────────────────────────────── */
let animating=false, petalInterval=null;

function init() {
  buildStars(); buildClouds(); buildGrass();
  buildButterflies(); placeCelestial();
  applyTheme(getTheme());
}

function startAnimation() {
  if(animating) return;
  animating=true;
  const screen=document.getElementById('startScreen');
  screen.style.opacity='0';
  setTimeout(()=>screen.style.display='none',800);
  document.getElementById('resetBtn').style.display='block';
  const lastDelay=buildFlowers();
  setTimeout(()=>{ petalInterval=spawnPetals(); },(lastDelay+.9)*1000);
  setTimeout(()=>{ document.getElementById('message').classList.add('show'); },(lastDelay+2.1)*1000);
}

function resetAnimation() {
  animating=false;
  if(petalInterval){ clearInterval(petalInterval); petalInterval=null; }
  document.querySelectorAll('.petal-fly').forEach(p=>p.remove());
  document.getElementById('message').classList.remove('show');
  document.getElementById('flowersContainer').innerHTML='';
  document.getElementById('resetBtn').style.display='none';
  const screen=document.getElementById('startScreen');
  screen.style.display='flex';
  requestAnimationFrame(()=>{ screen.style.opacity='1'; });
}

/* Redibujar al rotar el dispositivo */
let resizeTimer;
window.addEventListener('resize', ()=>{
  clearTimeout(resizeTimer);
  resizeTimer=setTimeout(()=>{
    placeCelestial(); buildClouds(); buildGrass(); buildButterflies();
    if(animating) buildFlowers();
  },250);
});


document.getElementById('startBtn').addEventListener('click', startAnimation);
document.getElementById('resetBtn').addEventListener('click', resetAnimation);
init();