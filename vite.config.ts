import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api/yahoo': {
            target: 'https://query1.finance.yahoo.com',
            changeOrigin: true,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
            },
            rewrite: (path) => path.replace(/^\/api\/yahoo/, '')
          },
          '/api/cryptopanic': {
            target: 'https://cryptopanic.com',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/cryptopanic/, '')
          },
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
          '/api/thegraph': {
            target: 'https://api.studio.thegraph.com',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/thegraph/, '')
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
