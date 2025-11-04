import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import path from "path"; // Import path module

export default defineConfig({
  plugins: [react(), tsconfigPaths(), tailwindcss()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Explicitly define the alias
    },
  },

  optimizeDeps: {
    include: ["framer-motion"],
  },

  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: false,
    },
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Your backend server
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
});
