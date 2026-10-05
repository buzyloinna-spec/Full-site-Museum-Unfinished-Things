(function(){
  const wrap=document.getElementById('wrap01'),P=document.getElementById('painting');
  const intro=document.getElementById('tIntro'),label=document.getElementById('tLabel');
  const b1=document.getElementById('band1'),concl=document.getElementById('concl'),why=document.getElementById('tWhy');
  const prog=document.getElementById('progress'),hint=document.getElementById('hint'),bar1=document.querySelector('#room01 .bar');
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
  const seg=(p,a,b)=>clamp((p-a)/(b-a));
  const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;          // smooth cubic in-out
  const soft=t=>1-Math.pow(1-t,3);                              // gentle ease-out for text
  const mix=(a,b,t)=>a+(b-a)*t;
  let S,E,F,W,H;
  function measure(){
    W=window.innerWidth;H=window.innerHeight;const g=W<=720?16:48,narrow=W<=720;
    const ew=narrow?Math.min(W-2*g,H*0.45):Math.min(W*0.46,H-150);
    E=narrow?{l:g,t:76,w:ew,h:ew}:{l:W-g-ew,t:96,w:ew,h:ew};
    const sw=narrow?W*0.22:Math.min(W*0.125,H*0.2);            // start: half of the previous 25%
    S={l:g,t:narrow?76:96,w:sw,h:sw};
    F={l:0,t:0,w:W,h:H};                                        // full screen
  }
  function box(a,b,t){P.style.left=mix(a.l,b.l,t)+'px';P.style.top=mix(a.t,b.t,t)+'px';P.style.width=mix(a.w,b.w,t)+'px';P.style.height=mix(a.h,b.h,t)+'px';}
  function show(el,o,y){el.style.opacity=o;el.style.visibility=o<=0.001?'hidden':'visible';el.style.transform='translate3d(0,'+y+'px,0)';}
  function render(p){
    // 1 · small painting grows and travels right · 2 · label · 3 · full screen + story plate · big question · 4 · back to the right, why the emptiness
    const g=ease(seg(p,0,.19)),f=ease(seg(p,.34,.50)),bk=ease(seg(p,.80,.88));
    if(bk>0)box(F,E,bk);else if(f>0)box(E,F,f);else box(S,E,g);
    const sh=bk>0?bk:(f>0?1-f:1);
    P.style.boxShadow='0 2px 6px rgba(17,17,15,'+(.08*sh)+'),0 18px 44px rgba(17,17,15,'+(.16*sh)+')';
    const i=soft(seg(p,.09,.15));show(intro,1-i,-28*i);
    const li=soft(seg(p,.20,.27)),lo=soft(seg(p,.32,.38));show(label,li*(1-lo),36*(1-li)-28*lo);
    const ci=soft(seg(p,.54,.61)),co=soft(seg(p,.76,.80));show(concl,ci*(1-co),24*(1-ci)-24*co);
    const wi=soft(seg(p,.86,.93));show(why,wi,36*(1-wi));
    // black bands scroll past at page speed — the painting stays pinned
    const travel=p*(wrap.offsetHeight-H);
    b1.style.transform='translate3d(0,'+(H*1.05-travel)+'px,0)';
    prog.textContent='Room 03 — '+Math.round(p*100)+'%';
    hint.style.opacity=p>0.02?0:1;
  }
  const target=()=>{const r=wrap.getBoundingClientRect();return clamp(-r.top/(r.height-H));};
  measure();
  if(reduce){box(E,E,1);show(intro,0,0);show(label,1,0);show(why,1,0);return;}
  let cur=target(),raf=null;
  function loop(){                        // inertia: follow the scroll with a soft lag
    const t=target();cur+=(t-cur)*0.09;
    if(Math.abs(t-cur)<0.0004)cur=t;
    render(cur);
    raf=Math.abs(t-cur)>0?requestAnimationFrame(loop):null;
  }
  const kick=()=>{if(!raf)raf=requestAnimationFrame(loop);};
  window.addEventListener('scroll',kick,{passive:true});
  window.addEventListener('resize',()=>{measure();cur=target();render(cur);});
  render(cur);
})();
