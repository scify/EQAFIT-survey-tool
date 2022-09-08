import { fileURLToPath, URL } from "node:url";
import * as path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // ref: https://github.com/jzaefferer/webpack-jquery-ui#using-resolvealias-to-simplify-imports
      // bind version of jquery-ui
      "jquery-ui": "jquery-ui-dist/jquery-ui.js",
      "jquery-ui-css": "jquery-ui-dist/jquery-ui.css",
      // bind to modules;
      modules: path.join(__dirname, "node_modules"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },
    },
  },
});
