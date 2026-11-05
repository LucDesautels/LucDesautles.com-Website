import{j as r}from"./jsx-runtime.7V9JGS85.js";import{r as v,R as ot}from"./index.BlVtF3na.js";import"./_commonjsHelpers.CqkleIqs.js";function at(t){const n=window,i=n.__wfState??{};n.__wfState={...i,...t}}function _t(t){let n=0,i=0,s=0;if(t.startsWith("#"))n=parseInt(t.slice(1,3),16),i=parseInt(t.slice(3,5),16),s=parseInt(t.slice(5,7),16);else{const o=t.match(/(\d+(?:\.\d+)?)/g);if(!o||o.length<3)return 1;n=+o[0],i=+o[1],s=+o[2]}return(.299*n+.587*i+.114*s)/255}const rt=[-220,80,-100,160,-260,40,120,-160,200,-60,-180,100],nt=[1,.7,1.25,.85,1.15,.6,1.3,.9,.75,1.1],ft=72,ut=140;function A(t,n,i,s,o,l,d){const x=o-n,w=(t-n)/x,f=w*w,b=f*w,N=2*b-3*f+1,j=b-2*f+w,$=-2*b+3*f,T=b-f;return N*i+j*x*s+$*l+T*x*d}function mt(t,n,i,s,o,l,d,x){const w=-i/n,f=-1;return t<n-l?i*(1-t/n):t<n+l?A(t,n-l,i*l/n,w,n+l,-l,f):t<o-l?-(t-n):t<o+d?A(t,o-l,-(s-l),f,o+d,-s-x,0):-s-x}function gt(t,n,i,s,o,l,d){return t<n-o?0:t<n+o?A(t,n-o,0,0,n+o,-o,-1):t<s-o?-(t-n):t<s+l?A(t,s-o,-(i-o),-1,s+l,-i-d,0):-i-d}function vt(t,n,i){const s=parseInt(t.slice(1,3),16),o=parseInt(t.slice(3,5),16),l=parseInt(t.slice(5,7),16),d=parseInt(n.slice(1,3),16),x=parseInt(n.slice(3,5),16),w=parseInt(n.slice(5,7),16),f=Math.round(s+(d-s)*i),b=Math.round(o+(x-o)*i),N=Math.round(l+(w-l)*i);return`rgb(${f},${b},${N})`}function kt({sections:t}){const n=v.useRef(null),i=v.useRef(null),s=v.useRef(null),o=v.useRef(null),l=v.useRef(null),[d,x]=v.useState(0),[w,f]=v.useState(null),[b,N]=v.useState(!1),[j,$]=v.useState("fat-fixed"),T=e=>{l.current?.style.setProperty("--rail-p",e.toFixed(4))};v.useEffect(()=>{const e=()=>{const c=window.__wfConfig?.rail?.variant;c&&$(c)};e();const a=c=>{const h=c.detail?.key;(h==="rail.variant"||h==="__init")&&e()};return window.addEventListener("wf-config-change",a),()=>window.removeEventListener("wf-config-change",a)},[]);const V=1;v.useLayoutEffect(()=>{const e=()=>{const c=o.current;if(!c)return;const h=c.scrollWidth,p=window.innerWidth,u=window.innerHeight;if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches&&p>=900&&h>p+50){const g=h-p,E=u*V;f(u+g+E),N(!0)}else f(null),N(!1)};e();const a=new ResizeObserver(e);return o.current&&a.observe(o.current),window.addEventListener("resize",e),()=>{a.disconnect(),window.removeEventListener("resize",e)}},[t]),v.useEffect(()=>{if(!b){o.current&&(o.current.style.transform="",o.current.style.removeProperty("--enter")),T(0),s.current&&(s.current.style.backgroundColor=t[0]?.tone??""),i.current&&i.current.classList.remove("htoc__sticky--dark"),at({htocShiftX:0,htocActive:0,htocDarkness:0,htocBounds:null,htocPinOffset:0,htocWaveShiftX:0,htocPinStartY:0,htocMaxTranslate:0});return}let e=0;const a=()=>{e=0;const h=n.current,p=o.current,u=i.current,S=s.current;if(!h||!p||!u||!S)return;const m=window.innerHeight,g=window.innerWidth,k=p.scrollWidth-g,X=h.offsetTop-m,C=m*V,Y=g*.35,L=h.offsetHeight,O=Math.min(Math.max(window.scrollY-X,0),L),W=m+k,q=Math.max(40,Math.min(m*.15,k*.08)),H=mt(O,m,g,k,W,q,C,Y),it=gt(O,m,k,W,q,C,Y);p.style.setProperty("--shift-x",`${H.toFixed(2)}px`);const B=L>0?O/L:0;p.style.setProperty("--enter",String(Math.min(1,B*6.5))),T(B);const M=-H+g/2,G=p.querySelectorAll("[data-toc-section]");let D=0,J=1/0;G.forEach((_,F)=>{const pt=_.offsetLeft+_.offsetWidth/2,et=Math.abs(pt-M);et<J&&(J=et,D=F)}),x(D);const y=Array.from(G).map(_=>_.offsetLeft+_.offsetWidth/2);let R=0,I=0;if(y.length>0){if(M<=y[0])R=0,I=0;else if(M>=y[y.length-1])R=y.length-1,I=0;else for(let _=0;_<y.length-1;_++)if(M>=y[_]&&M<=y[_+1]){R=_;const F=y[_+1]-y[_];I=F>0?(M-y[_])/F:0;break}}const U=t[R]?.tone??"#f1ede3",st=t[Math.min(R+1,t.length-1)]?.tone??U,Z=vt(U,st,I);S.style.backgroundColor=Z;const ct=!!t[D]?.dark;u.classList.toggle("htoc__sticky--dark",ct);const P=u.getBoundingClientRect(),lt=Math.max(0,Math.min(m,P.bottom))-Math.max(0,P.top),K=Math.max(0,Math.min(1,lt/m)),ht=1-_t(Z),Q=h.offsetTop,tt=k+C,dt=Math.max(0,Math.min(tt,window.scrollY-Q));at({htocShiftX:H,htocActive:K,htocDarkness:ht*K,htocBounds:{top:P.top,bottom:P.bottom},htocPinOffset:dt,htocWaveShiftX:it,htocPinStartY:Q,htocMaxTranslate:tt})},c=()=>{e||(e=requestAnimationFrame(a))};return window.addEventListener("scroll",c,{passive:!0}),a(),()=>{window.removeEventListener("scroll",c),e&&cancelAnimationFrame(e)}},[b,t]);const z=e=>{const a=n.current,c=o.current;if(!a||!c)return;if(!b){c.querySelectorAll("[data-toc-section]")[e]?.scrollIntoView({behavior:"smooth",inline:"start",block:"nearest"});return}const h=c.querySelectorAll("[data-toc-section]")[e];if(!h)return;const p=window.innerHeight,u=window.innerWidth,S=c.scrollWidth,m=Math.max(0,S-u),g=Math.max(-m,Math.min(u,-h.offsetLeft)),E=a.offsetTop-p;let k;g>=0?k=p*(1-g/u):k=p+-g,window.scrollTo({top:E+k,behavior:"smooth"})};return r.jsxs("section",{ref:n,className:`htoc${b?" htoc--pinned":""}`,style:w?{height:w}:void 0,"aria-label":"Field log — scroll to explore",children:[r.jsx("div",{ref:s,className:"htoc__bg",style:{backgroundColor:t[0]?.tone},"aria-hidden":"true"}),r.jsxs("div",{ref:i,className:"htoc__sticky",children:[r.jsxs("div",{className:"htoc__corner",children:[r.jsx("span",{className:"htoc__corner-mark",children:"§ 01"}),r.jsx("span",{className:"htoc__corner-label",children:"Table of contents"})]}),r.jsx("div",{className:"htoc__viewport",children:r.jsx("div",{ref:o,className:"htoc__strip",style:{height:880},children:t.map((e,a)=>r.jsxs("div",{"data-toc-section":!0,className:"htoc__section",style:{padding:`0 ${ut}px`,gap:`${ft}px`},children:[r.jsxs("div",{className:"htoc__vlabel",children:[e.label,"."]}),e.items.map((c,h)=>{const p=rt[(a*5+h)%rt.length],u=nt[(a*3+h)%nt.length],S=h%2===0?-1+h*.4:.8+h*.3,m=Math.round(c.w*u),g=Math.round(c.h*u);return r.jsxs("div",{className:"htoc__tile",style:{width:m,height:g,transform:`translateY(${p}px) rotate(${S.toFixed(2)}deg)`},children:[r.jsx("img",{src:c.image,alt:c.label,loading:"lazy",decoding:"async",style:{width:"100%",height:"100%",objectFit:"cover",display:"block"}}),r.jsxs("div",{className:"htoc__tile-cap",children:["/ ",c.tag]})]},h)})]},e.id))})}),r.jsxs("div",{ref:l,className:`htoc__rail-wrap htoc__rail-wrap--${j}`,children:[(j==="fat-fixed"||j==="thin-fixed")&&r.jsxs("div",{className:"htoc__rail",children:[r.jsx("div",{className:"htoc__rail-fill"}),r.jsx("div",{className:"htoc__rail-labels",children:t.map((e,a)=>r.jsx("button",{type:"button",onClick:()=>z(a),className:`htoc__rail-label${a===d?" htoc__rail-label--active":""}`,style:{left:`${(a+.5)/t.length*100}%`},"aria-current":a===d?"true":void 0,children:e.label},e.id))})]}),j==="line-thread"&&r.jsxs("div",{className:"htoc__thread",children:[r.jsx("div",{className:"htoc__thread-row htoc__thread-row--muted",children:t.map((e,a)=>r.jsxs(ot.Fragment,{children:[a>0&&r.jsx("span",{className:"htoc__thread-seg","aria-hidden":"true"}),r.jsx("button",{type:"button",onClick:()=>z(a),className:"htoc__thread-lbl","aria-current":a===d?"true":void 0,children:e.label})]},e.id))}),r.jsx("div",{className:"htoc__thread-row htoc__thread-row--accent","aria-hidden":"true",children:t.map((e,a)=>r.jsxs(ot.Fragment,{children:[a>0&&r.jsx("span",{className:"htoc__thread-seg"}),r.jsx("span",{className:"htoc__thread-lbl",children:e.label})]},e.id))})]}),j==="active-text"&&r.jsx("div",{className:"htoc__textrail",children:t.map((e,a)=>r.jsx("button",{type:"button",onClick:()=>z(a),className:`htoc__textrail-lbl${a===d?" is-active":""}`,"aria-current":a===d?"true":void 0,children:e.label},e.id))}),j==="cumulative-text"&&r.jsx("div",{className:"htoc__textrail htoc__textrail--cumulative",children:t.map((e,a)=>r.jsx("button",{type:"button",onClick:()=>z(a),className:`htoc__textrail-lbl${a<=d?" is-passed":""}${a===d?" is-active":""}`,"aria-current":a===d?"true":void 0,children:e.label},e.id))}),r.jsxs("div",{className:"htoc__counter",children:[String(d+1).padStart(2,"0")," / ",String(t.length).padStart(2,"0")]})]})]}),r.jsx("style",{children:`
        .htoc {
          position: relative;
          /* Outer container has no background — the .htoc__bg layer inside
             owns the color and fades it as scroll progresses. */
        }
        /* Section-tint color layer. Deliberately NOT part of .htoc__sticky's
           stacking context: position:sticky always opens a new stacking
           context, and once that context is raised above the global
           WaveField canvas (z-index: 1, fixed) so the tiles/text/rail can
           paint over the wave lines, anything painted inside it — including
           its own background — would rise too and blot the waves out. This
           sibling stays at the unraised z:auto level, below the canvas, so
           the tint shows and the waves are visible drawn over it. */
        .htoc__bg {
          /* Out-of-flow and spanning the whole (possibly many-viewports-
             tall) .htoc box — NOT position:sticky. Two in-flow sticky
             siblings both pinning at top:0 would each claim their own
             100vh slot in the flow, push each other apart, and desync the
             scroll-jack math (which assumes the gallery starts exactly at
             the section's own top). Since this is one giant absolutely
             positioned rect covering the full section height, whatever
             color is set is visible at every scroll position without
             needing its own sticky behavior. */
          position: absolute;
          inset: 0;
          transition: background-color .35s ease;
        }
        .htoc__sticky {
          display: flex;
          flex-direction: column;
          color: var(--ink);
          /* Raised above the WaveField canvas (z-index: 1) so the tiles,
             labels, and rail paint on top of the wave lines. The tint
             itself lives in the unraised .htoc__bg sibling instead — see
             above — so the waves stay visible against it. */
          position: relative;
          z-index: 2;
        }
        .htoc__sticky--dark { color: var(--dark-ink); }
        .htoc__sticky--dark .htoc__corner-mark,
        .htoc__sticky--dark .htoc__corner-label { color: var(--dark-mute); }
        .htoc__sticky--dark .htoc__vlabel { color: var(--dark-ink); }
        .htoc__sticky--dark .htoc__tile-cap { color: var(--dark-mute); }
        .htoc__sticky--dark .htoc__counter { color: var(--dark-dim); }
        .htoc__sticky--dark .htoc__rail { background: rgba(255,255,255,0.10); }
        .htoc__sticky--dark .htoc__rail-label { color: var(--dark-dim); }
        .htoc__sticky--dark .htoc__rail-label--active { color: var(--dark-ink); }

        .htoc--pinned .htoc__sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: hidden;
        }

        /* (Removed: .htoc__waves — waves now come from the global WaveField.) */

        /* Top-left tiny label */
        .htoc__corner {
          position: absolute;
          top: calc(var(--topbar-h) + 18px);
          left: var(--page-pad);
          z-index: 4;
          display: flex;
          align-items: baseline;
          gap: 10px;
          pointer-events: none;
        }
        .htoc__corner-mark,
        .htoc__corner-label {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.22em;
          color: var(--ink-mute);
          text-transform: uppercase;
          transition: color .35s ease;
        }
        .htoc__corner-mark { color: var(--accent); font-weight: 600; }

        /* The horizontal viewport — clips the translating strip. */
        .htoc__viewport {
          flex: 1;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
        }

        .htoc__strip {
          display: inline-flex;
          align-items: center;
          will-change: transform, opacity;
          /* JS sets --shift-x (px) and --enter (0..1). Horizontal motion
             runs throughout the whole section scroll, so the entrance is
             mostly the quick opacity ramp + a small upward slide. */
          transform: translate3d(var(--shift-x, 0px), calc((1 - var(--enter, 0)) * 40px), 0);
          opacity: var(--enter, 0);
        }

        .htoc__section {
          display: inline-flex;
          align-items: center;
          height: 100%;
          position: relative;
          flex: 0 0 auto;
        }
        .htoc__vlabel {
          writing-mode: vertical-rl;
          transform: rotate(180deg);
          margin-right: 28px;
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 500;
          font-style: italic;
          color: var(--ink);
          letter-spacing: -0.01em;
          line-height: 0.95;
          white-space: nowrap;
          transition: color .35s ease;
        }
        .htoc__tile {
          position: relative;
          flex: 0 0 auto;
        }
        .htoc__tile-cap {
          position: absolute;
          left: 6px;
          bottom: -26px;
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          color: var(--ink-mute);
          text-transform: uppercase;
          white-space: nowrap;
          transition: color .35s ease;
        }

        /* ── Bottom rail ────────────────────────────────────────────────
           One container, five variant skins. Progress comes from --rail-p
           (0..1) which the scroll RAF writes to the wrap element directly,
           so the fill paints in lockstep with the scroll. No CSS width
           transitions anywhere — those queue catch-up frames and made the
           old rail visibly lag and step. */
        .htoc__rail-wrap {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 36px;
          padding: 0 var(--page-pad);
          display: flex;
          gap: 16px;
          align-items: center;
          z-index: 3;
        }

        /* ▸ Variant A — fat bar (current style, lag-free) */
        .htoc__rail-wrap--fat-fixed .htoc__rail {
          flex: 1;
          position: relative;
          height: 36px;
          background: rgba(26,23,20,0.10);
          transition: background-color .35s ease;
        }
        /* ▸ Variant B — thin bar, centered, narrower */
        .htoc__rail-wrap--thin-fixed { justify-content: center; }
        .htoc__rail-wrap--thin-fixed .htoc__rail {
          flex: 0 1 min(720px, 80%);
          position: relative;
          height: 6px;
          border-radius: 3px;
          background: rgba(26,23,20,0.12);
          transition: background-color .35s ease;
        }
        .htoc__rail-wrap--thin-fixed .htoc__rail-fill { border-radius: inherit; }
        .htoc__rail-wrap--thin-fixed .htoc__rail-label {
          /* Move labels off the thin bar so they don't overlap a 6px strip. */
          top: -22px;
          font-size: 10px;
          padding: 2px 6px;
        }

        /* Shared fill — width comes from --rail-p, no transition. */
        .htoc__rail-fill {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          background: var(--accent);
          width: calc(max(var(--rail-p, 0), 0.02) * 100%);
          transition: none;
        }
        .htoc__rail-labels {
          position: absolute;
          inset: 0;
        }
        .htoc__rail-label {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          background: transparent;
          border: 0;
          padding: 4px 10px;
          cursor: pointer;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ink);
          white-space: nowrap;
          transition: color .35s ease, font-weight .15s;
          font-weight: 500;
          mix-blend-mode: normal;
        }
        .htoc__rail-label:hover { color: var(--accent); }
        .htoc__rail-label--active {
          color: var(--accent-ink);
          font-weight: 700;
        }

        /* ▸ Variant C — line + text fills L→R.
           Two stacked rows: muted (always visible) and accent (clipped from
           the right by inset(0 (1-p)*100% 0 0)). The accent layer wipes over
           the muted one as scroll progresses, sweeping a single orange tide
           across both the line segments and the text in one continuous pass. */
        .htoc__rail-wrap--line-thread { padding: 0 var(--page-pad); }
        .htoc__thread {
          flex: 1;
          position: relative;
          height: 28px;
        }
        .htoc__thread-row {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 500;
          white-space: nowrap;
        }
        .htoc__thread-row--muted { color: var(--ink-mute); }
        .htoc__thread-row--accent {
          color: var(--accent);
          pointer-events: none;
          /* Wipe-from-left clip driven by --rail-p. */
          clip-path: inset(0 calc((1 - var(--rail-p, 0)) * 100%) 0 0);
          -webkit-clip-path: inset(0 calc((1 - var(--rail-p, 0)) * 100%) 0 0);
        }
        .htoc__thread-row--accent .htoc__thread-seg { background: var(--accent); }
        .htoc__thread-row--muted  .htoc__thread-seg { background: rgba(26,23,20,0.18); }
        .htoc__thread-seg {
          flex: 1;
          height: 1px;
          min-width: 24px;
        }
        .htoc__thread-lbl {
          flex: 0 0 auto;
          background: transparent;
          border: 0;
          padding: 4px 10px;
          cursor: pointer;
          color: inherit;
          font: inherit;
          letter-spacing: inherit;
          text-transform: inherit;
        }
        .htoc__thread-row--muted .htoc__thread-lbl:hover { color: var(--accent); }

        /* ▸ Variants D & E — text-only rails.
           D (active-text):     only the current label is in accent.
           E (cumulative-text): every label up to and including the current
                                one is in accent, painted in section steps. */
        .htoc__textrail {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 0 4px;
        }
        .htoc__textrail-lbl {
          flex: 0 1 auto;
          background: transparent;
          border: 0;
          padding: 4px 10px;
          cursor: pointer;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 500;
          color: var(--ink-mute);
          white-space: nowrap;
          transition: color .2s ease, font-weight .15s;
        }
        .htoc__textrail-lbl:hover { color: var(--accent); }
        .htoc__textrail-lbl.is-active { color: var(--accent); font-weight: 700; }
        .htoc__textrail--cumulative .htoc__textrail-lbl.is-passed { color: var(--accent); }
        .htoc__textrail--cumulative .htoc__textrail-lbl.is-active { font-weight: 700; }

        /* Dark-section variants of the new rails. The active / passed
           selectors carry the same class-count as the dark override, so
           they need to come AFTER it to win — they're declared here in
           the right order. */
        .htoc__sticky--dark .htoc__thread-row--muted { color: var(--dark-mute); }
        .htoc__sticky--dark .htoc__thread-row--muted .htoc__thread-seg { background: rgba(255,255,255,0.18); }
        .htoc__sticky--dark .htoc__textrail-lbl { color: var(--dark-mute); }
        .htoc__sticky--dark .htoc__textrail-lbl.is-active { color: var(--accent); }
        .htoc__sticky--dark .htoc__textrail--cumulative .htoc__textrail-lbl.is-passed { color: var(--accent); }
        .htoc__counter {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--ink);
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 600;
          padding: 4px 8px;
          transition: color .35s ease;
        }

        /* Non-pinned fallback (mobile / reduced motion) */
        .htoc:not(.htoc--pinned) .htoc__viewport {
          overflow-x: auto;
          overflow-y: hidden;
          scroll-snap-type: x mandatory;
        }
        .htoc:not(.htoc--pinned) .htoc__strip {
          transform: none;
          opacity: 1;
        }
        .htoc:not(.htoc--pinned) .htoc__section { scroll-snap-align: start; }
      `})]})}export{kt as default};
