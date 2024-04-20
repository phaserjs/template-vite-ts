import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import inlineImages from "./plugins/inlineImages";

export default defineConfig({
  base: "./",
  plugins: [
    viteSingleFile(
      { removeViteModuleLoader: true, deleteInlinedFiles: true },
      inlineImages()
    ),
  ],
  server: {
    port: 8080,
  },
});
