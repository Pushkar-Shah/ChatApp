import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
    // eslint-disable-next-line no-undef
      "@": path.resolve(__dirname, "./src"),
    },
  },
  ,
  server: {
    host: '0.0.0.0', // Allow external access
    port: process.env.PORT ? parseInt(process.env.PORT) : 5173 // Use PORT from the environment
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,  // Increase the chunk size limit
  },
})


