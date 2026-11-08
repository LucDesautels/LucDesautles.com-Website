import{j as i}from"./jsx-runtime.7V9JGS85.js";import{r as s}from"./index.BlVtF3na.js";import"./_commonjsHelpers.CqkleIqs.js";const a=[{id:"full",baseLabel:"The full picture",selectedLabel:"The full picture",shortLabel:"Full",description:"Everything on the site.",bodyClass:"filter-full"},{id:"eng-acad",baseLabel:"Engineering & Academics",selectedLabel:"Engineering & Academics only",shortLabel:"Eng + Acad",description:"robotics work, sub-projects, and academics.",bodyClass:"filter-eng-acad",jumpTo:"#robotics-intro"},{id:"engineering",baseLabel:"Engineering only",selectedLabel:"Engineering only",shortLabel:"Eng",description:"robotics work and supporting research.",bodyClass:"filter-engineering",jumpTo:"#robotics-intro"},{id:"non-eng",baseLabel:"Non-engineering only",selectedLabel:"Non-engineering only",shortLabel:"Non-eng",description:"academics, well-rounded, and experiences.",bodyClass:"filter-non-eng",jumpTo:"#academics"}],l="luc:filter-change";function c(t){if(typeof document>"u")return;const n=document.body;Array.from(n.classList).forEach(e=>{e.startsWith("filter-")&&n.classList.remove(e)});const r=a.find(e=>e.id===t);if(!r)return;n.classList.add(r.bodyClass),n.dataset.filter=t,window.dispatchEvent(new CustomEvent(l,{detail:{filter:t}}));const o=window.lenis;r.jumpTo?requestAnimationFrame(()=>{const e=document.querySelector(r.jumpTo);e&&(o?o.scrollTo(e,{offset:0}):e.scrollIntoView({behavior:"smooth",block:"start"}))}):t==="full"&&(o?o.scrollTo(0):window.scrollTo({top:0,behavior:"smooth"}))}function b(){const[t,n]=s.useState("full");if(s.useEffect(()=>{n(document.body.dataset.filter||"full");const e=d=>{n(d.detail.filter)};return window.addEventListener(l,e),()=>window.removeEventListener(l,e)},[]),t==="full")return null;const r=a.find(e=>e.id===t);if(!r)return null;const o=a.filter(e=>e.id!==t);return i.jsxs("aside",{className:"filter-ind",role:"region","aria-label":"Active filter",children:[i.jsxs("div",{className:"filter-ind__head",children:[i.jsx("span",{className:"filter-ind__dot","aria-hidden":"true"}),"Filter active"]}),i.jsx("div",{className:"filter-ind__name",children:r.selectedLabel}),i.jsxs("div",{className:"filter-ind__desc",children:["You're only seeing ",r.description]}),i.jsxs("div",{className:"filter-ind__switch",children:[i.jsx("div",{className:"filter-ind__switch-label",children:"Change filter"}),i.jsx("div",{className:"filter-ind__switch-row",children:o.map(e=>i.jsx("button",{type:"button",onClick:()=>c(e.id),className:"filter-ind__chip"+(e.id==="full"?" filter-ind__chip--primary":""),children:e.id==="full"?"Show full picture":e.shortLabel},e.id))})]}),i.jsx("style",{children:`
        .filter-ind {
          position: fixed;
          right: 20px;
          bottom: 20px;
          z-index: 60;
          width: min(360px, calc(100vw - 40px));
          padding: 16px 18px 14px;
          background: var(--ink);
          color: var(--bg);
          box-shadow: 0 22px 50px rgba(0,0,0,0.28);
          border-left: 3px solid var(--accent);
          font-family: var(--font-body);
          animation: filter-ind-in .25s ease both;
        }
        @keyframes filter-ind-in {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .filter-ind__head {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--accent);
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .filter-ind__dot {
          width: 8px;
          height: 8px;
          background: var(--accent);
          border-radius: 999px;
          animation: filter-ind-pulse 1.6s ease-in-out infinite;
        }
        @keyframes filter-ind-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
        .filter-ind__name {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 500;
          letter-spacing: -0.01em;
          margin: 6px 0 6px;
          line-height: 1.1;
        }
        .filter-ind__desc {
          font-size: 13px;
          color: rgba(244, 237, 226, 0.72);
          line-height: 1.45;
        }
        .filter-ind__switch {
          margin-top: 14px;
          padding-top: 12px;
          border-top: 1px solid rgba(255,255,255,0.12);
        }
        .filter-ind__switch-label {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(244, 237, 226, 0.55);
          margin-bottom: 8px;
        }
        .filter-ind__switch-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .filter-ind__chip {
          padding: 6px 10px;
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--bg);
          background: transparent;
          border: 1px solid rgba(255,255,255,0.3);
          cursor: pointer;
          transition: background .15s, border-color .15s, color .15s;
        }
        .filter-ind__chip:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.5);
        }
        .filter-ind__chip--primary {
          background: var(--accent);
          border-color: var(--accent);
          color: var(--accent-ink);
          font-weight: 600;
          padding: 6px 12px;
        }
        .filter-ind__chip--primary:hover {
          background: #c45a26;
          border-color: #c45a26;
        }
        @media (max-width: 640px) {
          .filter-ind {
            left: 12px;
            right: 12px;
            bottom: 12px;
            width: auto;
          }
        }
      `})]})}export{b as default};
