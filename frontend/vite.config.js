import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    // This allows Railway's dynamic domains to bypass the host check
    allowedHosts: true
  }
})