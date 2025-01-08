import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const dev = process.env.NODE_ENV !== 'production';

const config = {
  extensions: ['.svelte', '.svx'],

  kit: {
    adapter: adapter({
      fallback: 'index.html', // Fallback for SPA behavior
      strict: false // Disable strict mode
    }),
    paths: {
      base: dev ? '' : '/ConceptExplorer'
    },
    prerender: {
      handleHttpError: ({ path, referrer, message }) => {
        // Ignore specific paths if needed
        if (path === '/ConceptExplorer/' || path === '/') return;
        
        // Otherwise throw the error
        throw new Error(message);
      },
      entries: ['*']
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
