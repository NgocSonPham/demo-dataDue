import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import eslintPlugin from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslintPlugin()],
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 1500,
    emptyOutDir: true,
    minify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          chakra: ["@chakra-ui/react", "@emotion/react", "@emotion/styled"],
          react: ["react", "react-dom"],
          tiptap: ["reactjs-tiptap-editor"],
          utils: ["lodash", "dayjs"],
          redux: ["@reduxjs/toolkit", "react-redux", "redux-persist"]
        }
      }
    }
  },
  optimizeDeps: {
    include: ["react", "react-dom"]
  },
  server: {
    port: 5000
  }
});
