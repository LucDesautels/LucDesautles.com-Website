import { defineConfig } from "astro/config";
import react from "@astrojs/react";
// Sitemap is left out until a real deploy URL is wired up.
// To re-enable: `npm i @astrojs/sitemap` + add `sitemap()` to integrations.

// https://astro.build/config
export default defineConfig({
  // Used for canonical URLs and (eventually) the sitemap.
  site: "https://lucdesautels.com",
  // Honor a PORT env var (the preview tool assigns one to avoid colliding with a
  // dev server already on 4321); plain `npm run dev` still defaults to 4321.
  server: { port: Number(process.env.PORT) || 4321 },
  integrations: [react()],
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
    // Dev server only. Vite pre-bundles dependencies the first time it sees them, and
    // when it finds a *new* one mid-session (say, the first visit to a page that imports
    // lenis) it re-bundles and changes the hash — pages already rendered then ask for the
    // old one and get "504 Outdated Optimize Dep", React fails to load, and every island
    // stays un-hydrated (the email button stuck as dots, the contents strip dead). Listing
    // the packages here bundles them all at startup so nothing is discovered late.
    // (Has no effect on the production build.)
    optimizeDeps: {
      include: ["react-dom/client", "lenis", "vara"],
    },
  },
});
