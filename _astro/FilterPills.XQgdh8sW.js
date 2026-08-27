import{j as r}from"./jsx-runtime.7V9JGS85.js";import{r as i}from"./index.BlVtF3na.js";import{a,F as s,b as p,E as c}from"./filters.Cz9dUr4a.js";import"./_commonjsHelpers.CqkleIqs.js";function g({resumeHref:o}){const[n,t]=i.useState("full");return i.useEffect(()=>{t(document.body.dataset.filter||"full");const e=l=>{t(l.detail.filter)};return window.addEventListener(a,e),()=>window.removeEventListener(a,e)},[]),r.jsxs("div",{className:"filter-pills",role:"group","aria-label":"Content filter","data-rsec":"filter",children:[r.jsx("span",{className:"filter-pills__intro",children:"Show me —"}),s.map(e=>{const l=n===e.id;return r.jsx("button",{type:"button",onClick:()=>p(e.id),"aria-pressed":l,className:`pill${l?" pill--filled":""}`,children:l?e.selectedLabel:e.baseLabel},e.id)}),r.jsx("a",{href:c,className:"pill pill--ghost",children:"Engineering portfolio →"}),r.jsx("a",{href:o,className:"pill pill--ghost",children:"↓ Résumé"}),r.jsx("style",{children:`
        .filter-pills {
          margin-top: 64px;
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .filter-pills__intro {
          font-family: var(--font-body);
          font-style: italic;
          color: var(--ink-dim);
          font-size: 15px;
          margin-right: 8px;
        }
        .pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 999px;
          background: rgba(26,23,20,0.04);
          border: 1px solid var(--rule);
          color: var(--ink);
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          cursor: pointer;
          font-weight: 500;
          transition: background .15s, color .15s, border-color .15s;
          text-decoration: none;
        }
        .pill:hover { background: rgba(26,23,20,0.08); }
        .pill--filled {
          background: var(--accent);
          color: var(--accent-ink);
          border-color: var(--accent);
          font-weight: 600;
        }
        .pill--filled:hover { background: var(--accent); }
        .pill--ghost { text-decoration: none; }
      `})]})}export{g as default};
