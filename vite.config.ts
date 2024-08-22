import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import commonjs from "vite-plugin-commonjs";
import eslintPlugin from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    commonjs({
      filter(id) {
        if (["ckeditor5/build/ckeditor.js"].includes(id)) {
          return true;
        }
      }
    }),
    eslintPlugin()
  ],
  build: {
    sourcemap: true,
    commonjsOptions: {
      exclude: ["ckeditor5-custom-build"]
    },
    chunkSizeWarningLimit: 1500,
    emptyOutDir: true,
    minify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            "@chakra-ui/react",
            "@ckeditor/ckeditor5-react",
            "@emotion/react",
            "@emotion/styled",
            "antd",
            "react",
            "react-dom"
          ] // add other libraries if needed
        }
      }
    }
  },
  optimizeDeps: {
    include: ["react", "react-dom", "antd", "ckeditor5-custom-build"]
  },
  server: {
    port: 5000
  }
});
