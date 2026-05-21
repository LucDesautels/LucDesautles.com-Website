import { defineConfig } from "astro/config";
import react from "@astrojs/react";
// Sitemap is left out until a real deploy URL is wired up.
// To re-enable: `npm i @astrojs/sitemap` + add `sitemap()` to integrations.

// https://astro.build/config
export default defineConfig({
  // Update this when you deploy. Used for canonical URLs.
  site: "https://desautels.net",
  integrations: [react()],
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
});
