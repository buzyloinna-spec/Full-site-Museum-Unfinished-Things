/* ---------- Side navigation: jump between rooms, show where you are ---------- */
(function(){
  const nav=document.getElementById('sidenav');if(!nav)return;
  const links=[...nav.querySelectorAll('a')];
  const targets=links.map(a=>document.querySelector(a.getAttribute('href')));
  const intro=document.getElementById('intro');
  const dark=[document.getElementById('wrap02')];          // the Michelangelo room is black
  const stage=document.getElementById('stage');
  let jumping=false;

  function update(){
    const on=intro.classList.contains('done')&&!(stage&&stage.classList.contains('playing'));
    nav.classList.toggle('on',on);
    const mid=window.innerHeight*0.45;let act=0;
    targets.forEach((t,i)=>{if(t&&t.getBoundingClientRect().top<=mid)act=i;});
    links.forEach((a,i)=>{a.classList.toggle('active',i===act);if(i===act)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');});
    const y=window.innerHeight/2;
    nav.classList.toggle('dark',dark.some(d=>{const r=d&&d.getBoundingClientRect();return r&&r.top<=y&&r.bottom>=y;}));
  }

  function jump(i){
    const t=targets[i];if(!t)return;
    if(window.__stage&&window.__stage.playing())window.__stage.stop();
    const isStage=t.id==='wrapWhy';
    let top=t===intro?0:window.scrollY+t.getBoundingClientRect().top;
    if(isStage)top+=0.05*(t.offsetHeight-window.innerHeight);   // land just inside, so the question starts playing
    window.__navJump=true;jumping=true;
    window.scrollTo({top,behavior:'smooth'});
    let last=-1,still=0;
    (function wait(){const y=window.scrollY;still=Math.abs(y-last)<1?still+1:0;last=y;
      if(still>8){window.__navJump=false;jumping=false;if(isStage&&window.__stage)window.__stage.replay();update();return;}requestAnimationFrame(wait);})();
  }

  links.forEach((a,i)=>a.addEventListener('click',e=>{e.preventDefault();if(e.detail>0)a.blur();jump(i);}));   // mouse clicks drop focus so the labels fold away; keyboard focus stays
  let pend=null;
  window.addEventListener('scroll',()=>{if(!pend)pend=requestAnimationFrame(()=>{update();pend=null;});},{passive:true});
  window.addEventListener('resize',update);
  new MutationObserver(update).observe(intro,{attributes:true,attributeFilter:['class']});
  if(stage)new MutationObserver(update).observe(stage,{attributes:true,attributeFilter:['class']});
  update();
})();
