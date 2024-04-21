import { defineConfig } from "vite";
import inlineImages from "./plugins/inlineImages.mjs";
import { viteSingleFile } from "vite-plugin-singlefile";
import Config from "../src/config/config";

export default defineConfig({
  base: "./",
  server: {
    port: 8080,
  },
  plugins: [
    inlineImages(Config),
    viteSingleFile({ removeViteModuleLoader: true, deleteInlinedFiles: true }),
  ],
});
