import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ["phaser"],
        },
      },
    },
  },
  resolve: {
    alias: {
      granadalib: "./node_modules/granadalib/dist",
    },
  },
  server: {
    port: 8080,
  },
});
