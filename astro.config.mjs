import { defineConfig } from 'astro/config';
import icon from "astro-icon";
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";

import vue from "@astrojs/vue";

// https://astro.build/config
export default defineConfig({
  site: 'https://watzon.tech',
  integrations: [mdx(), sitemap(), tailwind(), icon({
    include: {
      mdi: ['*'],
      ic: ['*']
    }
  }), vue()]
});