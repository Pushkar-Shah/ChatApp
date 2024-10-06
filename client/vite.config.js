import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0", // Allow external access
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000, // Use PORT from environment or default to 3000
  },
});
