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
  },
});
