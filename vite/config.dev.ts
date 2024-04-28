import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import initGranadaGamesPlugin from "../src/GranadaExporters/plugins/initGranadaGamesPlugin";

export default defineConfig({
  base: "./",
  server: {
    port: 8080,
  },
  plugins: [
    initGranadaGamesPlugin({
      width: process.env.WIDTH || "1920",
      height: process.env.HEIGHT || "1080",
      encodeAudio: process.env.ENCODE_AUDIO === "true",
    }),
    viteSingleFile({ removeViteModuleLoader: true, deleteInlinedFiles: true }),
  ],
});
