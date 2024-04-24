import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import Config from "../src/config/config";
import inlineImages from "../src/GranadaLib/vite/plugins/inlineImages.mjs";

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
