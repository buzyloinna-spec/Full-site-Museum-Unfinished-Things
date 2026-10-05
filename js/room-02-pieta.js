(function(){
  const wrap=document.getElementById('wrap02'),B=document.getElementById('sculpt'),img=B.querySelector('.s-close'),img2=B.querySelector('.s-main'),room=document.getElementById('room02');
  const cap1=document.getElementById('cap1'),cap=document.getElementById('cap2'),label=document.getElementById('t2Label'),story=document.getElementById('t2Story'),prog=document.getElementById('progress2');
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v)),seg=(p,a,b)=>clamp((p-a)/(b-a));
  const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,soft=t=>1-Math.pow(1-t,3),mix=(a,b,t)=>a+(b-a)*t;
  const ink=[17,17,15],paper=[251,247,240];
  let F,E,W,H,g;
  function measure(){
    W=window.innerWidth;H=window.innerHeight;g=W<=720?16:48;
    F={l:0,t:0,w:W,h:H};
    if(W<=720){const h=H*0.30,w=Math.min(h*490/734,W-2*g);E={l:W-g-w,t:76,w,h};
      const ct=(76+h+24)+'px';label.style.top=ct;story.style.top=ct;}          // phone: statue on top, text underneath
    else{const h=H-150,w=Math.min(h*490/734,W*0.36);E={l:W-g-w,t:96,w,h};label.style.top='';story.style.top='';}
  }
  function show(el,o,y){el.style.opacity=o;el.style.visibility=o<=0.001?'hidden':'visible';el.style.transform='translate3d(0,'+y+'px,0)';}
  const TW2=(function(el,host){const tok=[...el.textContent];let n=reduce?tok.length:0,timer=null;el.setAttribute('aria-label',el.textContent);
    const caret='<span class="tw-caret" aria-hidden="true"></span>',draw=()=>{el.innerHTML=tok.slice(0,n).join('')+(n<tok.length?caret:'');};
    const step=()=>{n++;draw();if(n<tok.length)timer=setTimeout(step,/[.,—]/.test(tok[n-1])?180:38);else timer=null;};draw();
    return {tick(){if(reduce)return;const r=wrap.getBoundingClientRect(),seen=r.top<H*0.35&&r.bottom>H*0.6,o=seen?parseFloat(host.style.opacity||0):0;
      if(o>0.6&&n===0&&!timer)timer=setTimeout(step,350);if(o<0.05&&(n>0||timer)){clearTimeout(timer);timer=null;n=0;draw();}}};})(story.querySelector('.q'),story);
  function render(p){
    // screen 1 · full screen, very close on the leftover arm (0 – 12 %)
    // screen 2 · pulls back, still full screen, caption appears (12 – 42 %)
    const z=ease(seg(p,.10,.28));
    // screen 3 · shrinks to the right and sticks (44 – 62 %)
    const sine=t=>-(Math.cos(Math.PI*t)-1)/2;
    const k=sine(seg(p,.37,.70));                                   // slower, gentler shrink to the sculpture's own size
    // screens 1–2: camera on the close-up photo — legs (thigh to feet) first, then it pulls back and settles on the arm
    {const bw=F.w,bh=F.h,ia=2048/3072;let dw,dh;if(bw/bh>ia){dw=bw;dh=bw/ia;}else{dh=bh;dw=bh*ia;}
     const ox=(bw-dw)/2,oy=(bh-dh)/2;
     const legs={fx:.49,fy:.615,s:bh/(.26*dh),sx:.5,sy:.5};          // screen 1
     const arm ={fx:.37,fy:.47, s:bh/(.30*dh),sx:.5,sy:.48};        // screen 2
     const fx=mix(legs.fx,arm.fx,z),fy=mix(legs.fy,arm.fy,z),sc=mix(legs.s,arm.s,z),sx=mix(legs.sx,arm.sx,z),sy=mix(legs.sy,arm.sy,z);
     img.style.width=dw+'px';img.style.height=dh+'px';img.style.left='0px';img.style.top='0px';
     // with k the camera eases back to the plain full-frame view while the box shrinks
     const s2=mix(sc,1,k),tx=mix(sx,.5,k)*bw-s2*mix(fx,.5,k)*dw,ty=mix(sy,.5,k)*bh-s2*mix(fy,.5,k)*dh;
     const cx=Math.min(0,Math.max(bw-s2*dw,tx)),cy=Math.min(0,Math.max(bh-s2*dh,ty));   // never show the photo's edge
     img.style.transform='translate('+cx+'px,'+cy+'px) scale('+s2+')';}
    B.style.left=mix(F.l,E.l,k)+'px';B.style.top=mix(F.t,E.t,k)+'px';B.style.width=mix(F.w,E.w,k)+'px';B.style.height=mix(F.h,E.h,k)+'px';

    const x=sine(seg(k,0,1));img.style.opacity=1-x;img2.style.opacity=x;  // screen 3: becomes the whole sculpture
    // wall text: “He changed his mind.” on the close-up … pause … “And changed it again.”
    const c1i=soft(seg(p,.02,.07)),c1o=soft(seg(p,.11,.15));show(cap1,c1i*(1-c1o),24*(1-c1i)-24*c1o);
    const ci=soft(seg(p,.24,.30)),co=soft(seg(p,.40,.46));show(cap,ci*(1-co),24*(1-ci)-24*co);
    const li=soft(seg(p,.66,.73)),lo=soft(seg(p,.77,.81));show(label,li*(1-lo),36*(1-li)-28*lo);
    // screen 4 · story + the first-version close-up
    const si=soft(seg(p,.79,.87));show(story,si,36*(1-si));
    TW2.tick();
    prog.textContent='Room 02 — '+Math.round(p*100)+'%';
  }
  const target=()=>{const r=wrap.getBoundingClientRect();return clamp(-r.top/(r.height-H));};
  measure();
  if(reduce){render(0.8);return;}
  let cur=target(),raf=null;
  function loop(){const t=target();cur+=(t-cur)*0.09;if(Math.abs(t-cur)<0.0004)cur=t;render(cur);raf=Math.abs(t-cur)>0?requestAnimationFrame(loop):null;}
  window.addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(loop);},{passive:true});
  window.addEventListener('resize',()=>{measure();cur=target();render(cur);});
  render(cur);
})();
