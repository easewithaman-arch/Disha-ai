import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    // SPA fallback: serve index.html for all non-file routes
    {
      name: 'spa-fallback',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // If the request is not for an existing file/asset, rewrite to /
          if (
            !req.url.includes('.') &&
            !req.url.startsWith('/@') &&
            !req.url.startsWith('/node_modules') &&
            !req.url.startsWith('/src')
          ) {
            req.url = '/index.html'
          }
          next()
        })
      },
    },
  ],
  server: {
    port: 5173,
    open: true,
  },
})
