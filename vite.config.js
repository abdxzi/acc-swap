import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': '/src/components',
      '@utils': '/src/utils',
      '@css': '/src/assets/css',
      '@config': '/src/config',
      '@assets': '/src/assets',
      // Add more aliases as needed
    },
  },
})