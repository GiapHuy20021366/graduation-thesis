import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',
      'assets': "/src/assets",
      'styles': '/src/styles',
      'components': '/src/components',
      'contexts': '/src/components',
      'utils': '/src/components',
      "types": "/src/types"
    }
  },
  plugins: [dts(), react()],
  build: {
    outDir: "../server/web-app"
  }
})
