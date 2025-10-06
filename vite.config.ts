import { defineConfig } from 'vite'

export default defineConfig({
  // Configure for local preview mode without external calls
  preview: {
    port: 4173,
    strictPort: true,
    host: 'localhost'
  },
  server: {
    port: 5173,
    strictPort: true,
    host: 'localhost'
  },
  build: {
    outDir: 'dist',
    // Ensure all assets are bundled locally
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})
