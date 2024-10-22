import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJSX from '@vitejs/plugin-vue-jsx';
import copy from 'rollup-plugin-copy';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue'],
          'element-plus': ['element-plus'],
        },
        globals: {
          vue: 'Vue',
        },
      },
    },
    chunkSizeWarningLimit: 1024,
  },
  plugins: [
    vue(),
    vueJSX(),
    copy({
      targets: [{ src: 'examples/readme.md', dest: '../../../Cola/sf' }],
    }),
  ],
});
