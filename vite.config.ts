import path from "path";
import {reactRouter} from "@react-router/dev/vite"
import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.VITE_BASENAME,
  plugins: [reactRouter()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    rollupOptions: {
      external: [
        "env-config.js"
      ],
    },
  },
});
