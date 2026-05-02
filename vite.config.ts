import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          // ── Public APIs (no key needed) ─────────────────────────────────
          '/api/yahoo': {
            target: 'https://query1.finance.yahoo.com',
            changeOrigin: true,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
            },
            rewrite: (path) => path.replace(/^\/api\/yahoo/, '')
          },
          '/api/coingecko': {
            target: 'https://api.coingecko.com/api/v3',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/coingecko/, '')
          },
          '/api/thegraph': {
            target: 'https://api.studio.thegraph.com',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/thegraph/, '')
          },

          // ── Keyed APIs (inject key from env if available) ──────────────
          '/api/etherscan': {
            target: 'https://api.etherscan.io',
            changeOrigin: true,
            rewrite: (reqPath) => {
              const apikey = env.ETHERSCAN_API || '';
              const cleaned = reqPath.replace(/^\/api\/etherscan/, '/api');
              return apikey ? `${cleaned}${cleaned.includes('?') ? '&' : '?'}apikey=${apikey}` : cleaned;
            }
          },
          '/api/fmp': {
            target: 'https://financialmodelingprep.com',
            changeOrigin: true,
            rewrite: (reqPath) => {
              const apikey = env.FMP_API_KEY || '';
              const cleaned = reqPath.replace(/^\/api\/fmp/, '/api');
              return apikey ? `${cleaned}${cleaned.includes('?') ? '&' : '?'}apikey=${apikey}` : cleaned;
            }
          },
          '/api/cryptopanic': {
            target: 'https://cryptopanic.com',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/cryptopanic/, '')
          },
          '/api/cryptoquant': {
            target: 'https://api.cryptoquant.com',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/cryptoquant/, '')
          },
          '/api/bitquery': {
            target: 'https://streaming.bitquery.io',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/bitquery/, '')
          },
          '/api/openexchangerates': {
            target: 'https://openexchangerates.org',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/openexchangerates/, '')
          },
          '/api/whale-alert': {
            target: 'https://api.whale-alert.io',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/whale-alert/, '')
          },
          '/api/glassnode': {
            target: 'https://api.glassnode.com',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/glassnode/, '')
          },
          '/api/dune': {
            target: 'https://api.dune.com',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/dune/, '')
          },

          // ── RSS Feeds ──────────────────────────────────────────────────
          '/rss/coindesk': {
            target: 'https://www.coindesk.com',
            changeOrigin: true,
            rewrite: () => '/arc/outboundfeeds/rss/'
          },
          '/rss/cointelegraph': {
            target: 'https://cointelegraph.com',
            changeOrigin: true,
            rewrite: () => '/rss'
          },
          '/rss/decrypt': {
            target: 'https://decrypt.co',
            changeOrigin: true,
            rewrite: () => '/feed'
          }
        }
      },
      plugins: [react()],

      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        chunkSizeWarningLimit: 800,
      }
    };
});
