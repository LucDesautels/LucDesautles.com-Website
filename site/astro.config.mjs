import { defineConfig } from "astro/config";
import react from "@astrojs/react";
// Sitemap is left out until a real deploy URL is wired up.
// To re-enable: `npm i @astrojs/sitemap` + add `sitemap()` to integrations.

// https://astro.build/config
export default defineConfig({
  // Used for canonical URLs and (eventually) the sitemap.
  site: "https://lucdesautels.com",
  integrations: [react()],
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
});
