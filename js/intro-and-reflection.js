/* ---------- Intro: time-based opening, then scroll unlocks ---------- */
(function(){
  const I=document.getElementById('intro'),root=document.documentElement;
  const L=[...I.querySelectorAll('.sl')];
  // phones: scale “UNFINISHED” so it runs past the right edge, as on desktop
  const l2=I.querySelector('.l2');
  const fcv=document.createElement('canvas').getContext('2d');
  function fitTitle(){l2.style.fontSize='';const cs=getComputedStyle(l2),fs=parseFloat(cs.fontSize),gl=l2.getBoundingClientRect().left,W=window.innerWidth-gl;
    fcv.font=cs.fontStyle+' '+cs.fontWeight+' '+fs+'px '+cs.fontFamily;fcv.letterSpacing=cs.letterSpacing;
    const vis=fcv.measureText('UNFINISH').width+fcv.measureText('E').width*0.5;   // the screen edge falls in the middle of the E — half of E and all of D stay unseen
    l2.style.fontSize=(fs*W/vis)+'px';}
  // equal, measured gaps between the three title lines (ink to ink, using the real font metrics)
  const l1=I.querySelector('.l1'),l3=I.querySelector('.l3'),cv=document.createElement('canvas').getContext('2d');
  function ink(el,txt){const cs=getComputedStyle(el),fs=parseFloat(cs.fontSize);cv.font=cs.fontStyle+' '+cs.fontWeight+' '+fs+'px '+cs.fontFamily;
    const m=cv.measureText(txt.toUpperCase()),fa=m.fontBoundingBoxAscent,fd=m.fontBoundingBoxDescent,lh=el.getBoundingClientRect().height;
    const base=(lh-(fa+fd))/2+fa;return {top:base-m.actualBoundingBoxAscent,bot:base+m.actualBoundingBoxDescent,h:lh,fs};}
  function spaceTitle(){l1.style.marginBottom='0px';l3.style.marginTop='0px';
    const a=ink(l1,l1.textContent.trim()),b=ink(l2,'UNFINISHE'),c0=ink(l3,'THING'),c1=ink(l3,'THINGS'),c={h:c0.h,top:(c0.top+c1.top)/2};   // the breve of Й counts half
    const G=Math.max(12,b.fs*0.085);                                   // the same breathing room above and below the big word
    l1.style.marginBottom=(G-(a.h-a.bot)-b.top)+'px';
    l3.style.marginTop=(G-(b.h-b.bot)-c.top)+'px';}
  function layoutTitle(){fitTitle();spaceTitle();}
  layoutTitle();window.addEventListener('resize',layoutTitle);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(layoutTitle);
  // split each line into letters; each letter gets its own slow, random moment to appear and to leave
  L.forEach((el,li)=>{
    const words=el.dataset.t.split(' ');let n=0;const total=el.dataset.t.replace(/ /g,'').length;
    el.innerHTML=words.map(w=>'<span class="w">'+[...w].map(c=>{n++;
      const d=(Math.random()*3.0).toFixed(2), o=(Math.random()*1.8).toFixed(2), y=((Math.random()-.5)*10).toFixed(1);
      return '<span class="ch" aria-hidden="true" style="--d:'+d+'s;--o:'+o+'s;--y:'+y+'px">'+c+'</span>';}).join('')+'</span>').join(' ');
  });
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const timers=[];let done=false;
  const at=(t,fn)=>timers.push(setTimeout(fn,t*1000));
  function finish(){
    if(done)return;done=true;timers.forEach(clearTimeout);
    L.forEach(l=>{l.classList.remove('in');l.classList.add('out');});
    I.classList.remove('s-q');I.classList.add('s-qout','t1','t2','t3','t4','done');
    root.style.overflow='';
    window.removeEventListener('keydown',skip);
  }
  function skip(e){if(!['Escape','Enter'].includes(e.key))return;finish();}   // scrolling no longer skips — only the button, Esc or Enter
  document.getElementById('skip').addEventListener('click',finish);
  if(reduce){finish();return;}
  if('scrollRestoration' in history)history.scrollRestoration='manual';   // always start at the top on reload
  root.style.overflow='hidden';window.scrollTo(0,0);
  window.addEventListener('keydown',skip);
  // 0–1.2 s: empty paper · the slogan surfaces letter by letter, line two after line one, holds, then dissolves
  at(1.2,()=>L.forEach(l=>l.classList.add('in')));      // both lines surface together
  at(10.6,()=>L.forEach(l=>{l.classList.remove('in');l.classList.add('out');}));
  // the title builds line by line
  at(14.8,()=>I.classList.add('t1'));
  at(15.6,()=>I.classList.add('t2'));
  at(16.4,()=>I.classList.add('t3'));
  at(17.6,()=>I.classList.add('t4'));
  at(18.8,finish);
})();

/* ---------- Reflection stage: the question stays on top, three answers surface under it, then the museum's answer ---------- */
(function(){
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v)),seg=(p,a,b)=>clamp((p-a)/(b-a));
  const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
  const sine=t=>-(Math.cos(Math.PI*t)-1)/2;
  const root=document.documentElement;
  const wrap=document.getElementById('wrapWhy'),stage=document.getElementById('stage');
  const q=document.getElementById('whyQ'),M=['m1','m2','m3'].map(id=>document.getElementById(id));
  const A1=stage.querySelector('.ans1'),A2=stage.querySelector('.ans2'),door=stage.querySelector('.door'),skipB=document.getElementById('stSkip');
  const TRIG=.04,SNAP=.06;
  let H,state='idle',t0=0,raf=null;
  const prog=()=>{const r=wrap.getBoundingClientRect();return clamp(-r.top/(r.height-H));};

  // a possible answer surfaces out of the blur and stays; k = fade of the whole group before the museum answers
  function drawM(m,t,k){
    const inn=sine(clamp(t/2.4)),o=inn*(1-k);
    m.style.opacity=o.toFixed(3);
    m.style.filter='blur('+(8*(1-inn)+6*k).toFixed(2)+'px)';
    m.style.transform='translate('+(-2.5*(1-inn)).toFixed(2)+'vw,'+(6*(1-inn)).toFixed(1)+'px)';
  }
  function drawAns(t){
    const k=sine(clamp(t/3.2));
    [A1,A2].forEach((el,j)=>{
      el.style.opacity=k;el.style.filter='blur('+(10*(1-k)).toFixed(2)+'px)';
      el.style.letterSpacing=(j? -.01+.12*(1-k) : -.035+.09*(1-k)).toFixed(3)+'em';
      el.style.transform='translateY('+(8*(1-k)).toFixed(1)+'px)';
    });
    door.style.setProperty('--fill',ease(seg(t,3.4,4.8)).toFixed(3));
  }
  function reset(){q.style.opacity=1;q.style.filter='';M.forEach(m=>{m.style.opacity=0;});[A1,A2].forEach(el=>{el.style.opacity=0;});door.style.setProperty('--fill',0);}

  // Timeline (s): answers at 0.8 / 3.8 / 6.8 · all stay · 11.4–13.0 everything fades · museum answers at 13.4
  const G=[0.8,3.8,6.8],FADE=11.4,ANS=13.4,END=ANS+5.6;
  function tick(now){
    const t=(now-t0)/1000,k=sine(seg(t,FADE,FADE+1.6));
    q.style.opacity=(1-k).toFixed(3);q.style.filter='blur('+(6*k).toFixed(2)+'px)';
    M.forEach((m,i)=>{const lt=t-G[i];if(lt<0){m.style.opacity=0;return;}drawM(m,lt,k);});
    if(t>=ANS)drawAns(t-ANS);
    if(t>=END){finish();return;}
    raf=requestAnimationFrame(tick);
  }
  const block=e=>{if(state==='playing')e.preventDefault();};
  function lock(on){root.style.overflow=on?'hidden':'';const fn=on?'addEventListener':'removeEventListener';
    window[fn]('wheel',block,{passive:false});window[fn]('touchmove',block,{passive:false});}
  function play(){
    state='playing';stage.classList.add('playing');
    const r=wrap.getBoundingClientRect(),top=window.scrollY+r.top;
    window.scrollTo(0,top+SNAP*(r.height-H));
    lock(true);t0=performance.now();raf=requestAnimationFrame(tick);
  }
  function finish(){
    cancelAnimationFrame(raf);state='done';stage.classList.remove('playing');
    q.style.opacity=0;M.forEach(m=>{m.style.opacity=0;});drawAns(10);lock(false);
  }
  skipB.addEventListener('click',finish);
  function onScroll(){
    if(state==='playing')return;
    const p=prog(),r=wrap.getBoundingClientRect();
    if(state==='idle'&&p>=TRIG)play();
    else if(state==='done'&&r.top>H*0.6){state='idle';reset();}      // scrolled back above — it can play again
  }
  H=window.innerHeight;
  if(reduce){M.forEach(m=>{m.style.opacity=1;});A1.style.opacity=A2.style.opacity=1;door.style.setProperty('--fill',1);return;}
  let pend=null;
  window.addEventListener('scroll',()=>{if(!pend)pend=requestAnimationFrame(()=>{onScroll();pend=null;});},{passive:true});
  window.addEventListener('resize',()=>{H=window.innerHeight;});
  onScroll();
})();
