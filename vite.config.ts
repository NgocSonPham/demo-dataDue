import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import commonjs from "vite-plugin-commonjs";
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
      external: ["oniguruma-to-js"],
      output: {
        manualChunks: {
          vendor: [
            "@chakra-ui/react",
            "@emotion/react",
            "@emotion/styled",
            "react",
            "react-dom",
            "reactjs-tiptap-editor"
          ]
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
