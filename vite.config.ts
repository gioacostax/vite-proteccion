/**
 * Project vite (base-config)
 */

/// <reference types="vitest" />

import { resolve } from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => ({
  plugins: [
    react(),
    ...(mode === 'development' || (mode !== 'test' && command === 'serve') ? [mkcert()] : []),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src/'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'istanbul',
      all: true,
      include: ['src/**'],
      exclude: ['src/test.utils.tsx'],
      reporter: ['html-spa', 'lcov', 'text'],
    },
    silent: true,
    setupFiles: 'src/test.setup.tsx',
    restoreMocks: true,
    clearMocks: true,
    singleThread: true,
  },
  server: {
    https: true,
    port: 8452, // Change to the project port
    // proxy: {
    //   '/proxy/services': {
    //     rewrite: (path) => path.replace(/^\/proxy\/services/, ''),
    //     target: 'https://wlp.pruebas.proteccion.com.co',
    //     changeOrigin: true,
    //     secure: false,
    //     cookieDomainRewrite: 'localhost',
    //   },
    // },
  },
  preview: {
    https: true,
  },
  build: {
    outDir: 'build',
    assetsDir: '.',
    rollupOptions: {
      output: {
        entryFileNames: 'main-[hash].js',
        chunkFileNames: 'js/[hash].js',
        assetFileNames: 'assets/[hash].[ext]',
      },
    },
  },
}));
