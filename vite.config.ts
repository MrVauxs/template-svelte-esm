/* eslint-env node */
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve'; // This resolves NPM modules from node_modules.
import preprocess from 'svelte-preprocess';
import {
   postcssConfig,
   terserConfig
} from '@typhonjs-fvtt/runtime/rollup';

const s_PACKAGE_ID = 'modules/template-svelte-esm';
const s_SVELTE_HASH_ID = 'tse';
const s_COMPRESS = true;  // Set to true to compress the module bundle.
const s_SOURCEMAPS = true; // Generate sourcemaps for the bundle (recommended).

// Used in bundling particularly during development. If you npm-link packages to your project add them here.
const s_RESOLVE_CONFIG = {
   browser: true,
   dedupe: ['svelte']
};

export default defineConfig({
   root: 'src/',                 // Source location / esbuild root.
   base: `/${s_PACKAGE_ID}/`,    // Base module path that 30001 / served dev directory.
   publicDir: false,             // No public resources to copy.
   cacheDir: '../.vite-cache',   // Relative from root directory.

   resolve: { conditions: ['import', 'browser'] },

   esbuild: {
      target: ['es2022']
   },

   css: {
      // Creates a standard configuration for PostCSS with autoprefixer & postcss-preset-env.
      postcss: postcssConfig({ compress: s_COMPRESS, sourceMap: s_SOURCEMAPS })
   },

   server: {
      port: 30001,
      open: '/game',
      proxy: {
         // Serves static files from main Foundry server.
         [`^(/${s_PACKAGE_ID}/(assets|lang|packs|style.css))`]: 'http://localhost:30000',

         // All other paths besides package ID path are served from main Foundry server.
         [`^(?!/${s_PACKAGE_ID}/)`]: 'http://localhost:30000',

         // Enable socket.io from main Foundry server.
         '/socket.io': { target: 'ws://localhost:30000', ws: true }
      }
   },

   build: {
      outDir: ".",
      emptyOutDir: false,
      sourcemap: s_SOURCEMAPS,
      minify: s_COMPRESS ? 'terser' : false,
      target: ['es2022'],
      terserOptions: s_COMPRESS ? { ...terserConfig(), ecma: 2022 } : void 0,
      lib: {
         entry: './index.ts',
         formats: ['es'],
         fileName: 'index'
      }
   },

   // Necessary when using the dev server for top-level await usage inside TRL.
   optimizeDeps: {
      esbuildOptions: {
         target: 'es2022'
      }
   },

   plugins: [
      svelte({
         compilerOptions: {
            cssHash: ({ hash, css }) => `svelte-${s_SVELTE_HASH_ID}-${hash(css)}`
         },
         preprocess: preprocess()
      }),

      resolve(s_RESOLVE_CONFIG)  // Necessary when bundling npm-linked packages.
   ]
})