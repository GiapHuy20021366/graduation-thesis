import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',
      'assets': "/src/assets",
      'styles': '/src/styles',
      'components': '/src/components',
      'contexts': '/src/contexts',
      'utils': '/src/utils',
      "types": "/src/types"
    }
  },
  plugins: [react()],
  build: {
    outDir: "../server/gateway/web-app"
  }
})
