import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import eslintPlugin from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslintPlugin()],
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 1500,
    emptyOutDir: true,
    minify: true,
    rollupOptions: {
      external: ["oniguruma-to-js"],
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
    include: ["react", "react-dom"],
    exclude: ["@chakra-ui/react", "reactjs-tiptap-editor"]
  },
  server: {
    port: 5000
  }
});
