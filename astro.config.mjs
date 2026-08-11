// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * Static generation only — 00-BUILD-BRIEF.md §7.4. Every page is pre-rendered
 * HTML; there is no adapter and no server at runtime, which is what Cloudflare
 * Pages serves directly out of dist/.
 */
export default defineConfig({
  site: 'https://abinduction.com',
  trailingSlash: 'always',
  build: { format: 'directory' },

  integrations: [
    mdx(),
    sitemap({
      // §7.4: sitemap-index.xml split by type
      filter: (page) => !page.includes('/thank-you/') && !page.includes('/design-system/'),
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  image: {
    // AVIF with WebP fallback, §7.4
    responsiveStyles: true,
  },

  devToolbar: { enabled: false },
});
