import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// ─── Prerender Plugin ─────────────────────────────────────
// Renders each route to static HTML at build time.
// Crawlers (Googlebot, GPTBot, Claude-Web, etc.) receive
// fully populated HTML — no JS execution required.
// Human users still get the full React SPA experience.
// ──────────────────────────────────────────────────────────

// Dynamic import to handle ESM/CJS interop in some setups
const { default: prerender } = await import('vite-plugin-prerender').catch(() => {
  console.warn('vite-plugin-prerender not installed. Run: npm install vite-plugin-prerender')
  return { default: null }
})

// All public-facing routes on coinvestopedia.com
const ROUTES = [
  '/',
  '/exchanges',
  '/macro-intel',
  '/tools',
  '/knowledge',
  '/the-briefing',
  '/whale-tracker',
  '/asset-comparison',
]

export default defineConfig({
  plugins: [
    react(),
    ...(prerender
      ? [
          prerender({
            // Must match your Vite output directory
            staticDir: path.join(__dirname, 'dist'),

            // All routes to pre-render
            routes: ROUTES,

            renderer: new (require('vite-plugin-prerender/es6-renderer'))({
              // Time to wait after JS executes before snapshotting HTML.
              // Increase if your components fetch data on mount.
              renderAfterTime: 3000,

              // Or use this instead of time-based: waits for a specific
              // element to appear in the DOM before snapshotting.
              // renderAfterElementExists: '[data-prerender-ready]',

              // Inject a window flag so your React app can detect
              // it's being pre-rendered and skip animations/API calls
              injectProperty: '__PRERENDERING__',
              inject: { __PRERENDERING__: true },
            }),

            // Post-processing: inject crawler-friendly meta after render
            postProcess(renderedRoute) {
              // Fix asset paths for non-root routes
              renderedRoute.html = renderedRoute.html
                .replace(/href="\//g, 'href="/')
                .replace(/src="\//g, 'src="/')

              return renderedRoute
            },
          }),
        ]
      : []),
  ],

  build: {
    outDir: 'dist',
    // Generate source maps for debugging (disable in production if preferred)
    sourcemap: false,
    rollupOptions: {
      output: {
        // Chunk splitting: separates vendor libs from app code.
        // Crawlers parse smaller HTML files; humans load faster.
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      },
    },
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
