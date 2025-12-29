import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allows Nginx to talk to it
    port: 5173,
    hmr: {
        host: 'motive.italynorth.cloudapp.azure.com',
        clientPort: 443 // CRITICAL: Tells the browser to use HTTPS for the WebSocket connection
    }
  }
})