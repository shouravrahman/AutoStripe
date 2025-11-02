import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	plugins: [react(), tsconfigPaths(), tailwindcss()],

	build: {
		outDir: "../dist/public",
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
