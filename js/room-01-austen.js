/* ---------- Room 01 — Jane Austen: first page, last page, the label, the date, the afterlife ---------- */
(function(){
  const wrap=document.getElementById('wrap00'),$=id=>document.getElementById(id);
  const A1=$('aFirst'),A2=$('aLast'),PT=$('aPortrait'),NB=$('aNotebooks'),NC=$('aNbCap');
  const T1=$('aT1'),T2=$('aT2'),T3=$('aT3'),LB=$('aLabel'),ST=$('aStory'),prog=$('progress0');
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v)),seg=(p,a,b)=>clamp((p-a)/(b-a));
  const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,soft=t=>1-Math.pow(1-t,3),mix=(a,b,t)=>a+(b-a)*t;
  const R1=390/594,R2=614/458,RP=992/1188;
  let W,H,g,narrow,P1,P1b,P2,PP,top1,top2,topL;
  function measure(){
    W=window.innerWidth;H=window.innerHeight;narrow=W<=720;g=narrow?16:48;
    if(!narrow){
      const h1=H*.74;P1={l:W-g-h1*R1-40,t:(H-h1)/2+24,w:h1*R1,h:h1};
      const h2=H*.46,w1=h2*R1,w2=h2*R2,tot=w1+28+w2;P1b={l:W-g-tot,t:(H-h2)/2+24,w:w1,h:h2};P2={l:W-g-w2,t:(H-h2)/2+24,w:w2,h:h2};
      const hp=H-150;PP={l:W-g-hp*RP,t:96,w:hp*RP,h:hp};
      [T1,T2,T3].forEach(t=>{t.style.top='';t.style.bottom='16vh';t.style.width='';});T2.style.width=Math.max(260,P1b.l-g-40)+'px';T2.style.top=P1b.t+'px';T2.style.bottom='auto';LB.style.top='120px';ST.style.top='104px';
      const avail=H-60-(104+ST.offsetHeight+30);NB.style.display=avail>120?'':'none';NC.style.display=NB.style.display;
      const nh=Math.min(avail,220),nw=nh*1000/666;NB.style.left=g+'px';NB.style.top=(104+ST.offsetHeight+30)+'px';NB.style.width=nw+'px';NB.style.height=nh+'px';
      NC.style.left=(g+nw+18)+'px';NC.style.top=(104+ST.offsetHeight+30+nh-14)+'px';
    }else{
      const h1=H*.44;P1={l:(W-h1*R1)/2,t:76,w:h1*R1,h:h1};
      const h2=H*.22,w1=h2*R1,w2=W-2*g-w1-12;P1b={l:g,t:76,w:w1,h:h2};P2={l:g+w1+12,t:76+(h2-w2/R2)/2,w:w2,h:w2/R2};
      const hp=H*.30;PP={l:W-g-hp*RP,t:76,w:hp*RP,h:hp};
      T1.style.top=(76+h1+24)+'px';T2.style.top=(76+h2+28)+'px';T3.style.top=(76+hp+24)+'px';[T1,T2,T3].forEach(t=>t.style.bottom='auto');
      LB.style.top=(76+hp+24)+'px';ST.style.top=(76+hp+20)+'px';
    }
  }
  // typewriter: types the line once its block is visible, clears it when the block is gone
  function typer(el,host){const src=el.innerHTML,tok=[];src.split(/(<br>)/).forEach(x=>{if(x==='<br>')tok.push(x);else tok.push(...[...x]);});
    let n=reduce?tok.length:0,timer=null;const caret='<span class="tw-caret" aria-hidden="true"></span>';el.setAttribute('aria-label',el.textContent);
    const draw=()=>{el.innerHTML=tok.slice(0,n).join('')+(n<tok.length?caret:'');};
    const step=()=>{n++;draw();if(n<tok.length)timer=setTimeout(step,tok[n-1]==='<br>'?260:(/[.,—]/.test(tok[n-1])?180:38));else timer=null;};
    draw();
    return {tick(){if(reduce)return;const r=wrap.getBoundingClientRect(),seen=r.top<H*0.35&&r.bottom>H*0.6;const o=seen?parseFloat(host.style.opacity||0):0;
      if(o>0.6&&n===0&&!timer)timer=setTimeout(step,250);
      if(o<0.05&&(n>0||timer)){clearTimeout(timer);timer=null;n=0;draw();}}};}
  const TW=[[T1,'.sub'],[T2,'.sub'],[T3,'.sub'],[ST,'.q']].map(([h,s])=>typer(h.querySelector(s),h));
  function place(el,b){el.style.left=b.l+'px';el.style.top=b.t+'px';el.style.width=b.w+'px';el.style.height=b.h+'px';}
  function show(el,o,y){el.style.opacity=o;el.style.visibility=o<=0.001?'hidden':'visible';el.style.transform='translate3d(0,'+y+'px,0)';}
  function render(p){
    const m=ease(seg(p,.14,.27));                                            // first page steps aside, the last one arrives
    place(A1,{l:mix(P1.l,P1b.l,m),t:mix(P1.t,P1b.t,m),w:mix(P1.w,P1b.w,m),h:mix(P1.h,P1b.h,m)});
    place(A2,P2);place(PT,PP);
    const lIn=soft(seg(p,.20,.29)),pOut=soft(seg(p,.40,.47));
    A1.style.opacity=1-pOut;A2.style.opacity=lIn*(1-pOut);A2.style.transform='translateX('+(40*(1-lIn))+'px)';
    const pi=soft(seg(p,.42,.50));PT.style.opacity=pi;PT.style.transform='translateY('+(30*(1-pi))+'px)';
    const t1o=soft(seg(p,.12,.16));show(T1,1-t1o,-24*t1o);
    const t2i=soft(seg(p,.25,.31)),t2o=soft(seg(p,.37,.41));show(T2,t2i*(1-t2o),24*(1-t2i)-24*t2o);
    const li=soft(seg(p,.47,.53)),lo=soft(seg(p,.58,.62));show(LB,li*(1-lo),36*(1-li)-28*lo);
    const t3i=soft(seg(p,.62,.67)),t3o=soft(seg(p,.73,.77));show(T3,t3i*(1-t3o),24*(1-t3i)-24*t3o);
    const si=soft(seg(p,.78,.85));show(ST,si,36*(1-si));
    const ni=soft(seg(p,.85,.92));show(NB,ni,30*(1-ni));show(NC,ni,30*(1-ni));
    TW.forEach(t=>t.tick());                                        // the quiet lines are typed out as if someone is writing them now
    prog.textContent='Room 01 — '+Math.round(p*100)+'%';
  }
  const target=()=>{const r=wrap.getBoundingClientRect();return clamp(-r.top/(r.height-H));};
  measure();
  if(reduce){render(.5);return;}
  let cur=target(),raf=null;
  function loop(){const t=target();cur+=(t-cur)*0.09;if(Math.abs(t-cur)<0.0004)cur=t;render(cur);raf=Math.abs(t-cur)>0?requestAnimationFrame(loop):null;}
  window.addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(loop);},{passive:true});
  window.addEventListener('resize',()=>{measure();cur=target();render(cur);});
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{measure();render(cur);});
  render(cur);
})();
