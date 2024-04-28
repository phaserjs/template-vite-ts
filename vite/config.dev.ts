import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import initGranadaConfigPlugin from "../src/GranadaExporters/plugins/initGranadaConfigPlugin";

export default defineConfig({
  base: "./",
  server: {
    port: 8080,
  },
  plugins: [
    initGranadaConfigPlugin({
      width: process.env.WIDTH || "1920",
      height: process.env.HEIGHT || "1080",
    }),
    viteSingleFile({ removeViteModuleLoader: true, deleteInlinedFiles: true }),
  ],
});
