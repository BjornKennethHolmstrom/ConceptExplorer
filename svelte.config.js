import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
  extensions: ['.svelte', '.svx'],

  kit: {
    adapter: adapter({
      fallback: 'index.html', // Fallback for SPA behavior
      strict: false // Disable strict mode
    }),
    paths: {
      base: process.env.NODE_ENV === 'production' ? '/ConceptExplorer' : ''
    },
    prerender: {
      entries: ['*'] // Pre-render all routes
    }
  },

  preprocess: [
    vitePreprocess(),
    mdsvex({
      extension: '.svx'
    })
  ]
};

export default config;

