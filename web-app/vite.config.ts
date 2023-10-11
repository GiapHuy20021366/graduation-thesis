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
      'contexts': '/src/components',
      'utils': '/src/components'
    }
  },
  plugins: [react()],
  build: {
    outDir: "../server/web-app"
  }
})
