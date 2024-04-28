import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import initGranadaGamesPlugin from "../src/GranadaExporters/plugins/initGranadaGamesPlugin";
// import Config from "../src/config/config";
// import inlineImages from "../src/GranadaLib/vite/plugins/inlineImages.mjs";

const phasermsg = () => {
  return {
    name: "phasermsg",
    buildStart() {
      process.stdout.write(`Building for production...\n`);
    },
    buildEnd() {
      const line = "---------------------------------------------------------";
      const msg = `❤️❤️❤️ Tell us about your game! - games@phaser.io ❤️❤️❤️ \n ❤️❤️❤️ Us too! - support@granadagames.co ❤️❤️❤️`;
      process.stdout.write(`${line}\n${msg}\n${line}\n`);

      process.stdout.write(`✨ Done ✨\n`);
    },
  };
};

export default defineConfig({
  base: "./",
  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        passes: 2,
      },
      mangle: true,
      format: {
        comments: false,
      },
    },
  },
  server: {
    port: 8080,
  },
  plugins: [
    phasermsg(),
    initGranadaGamesPlugin({
      width: process.env.WIDTH || "1920",
      height: process.env.HEIGHT || "1080",
      encodeAudio: process.env.ENCODE_AUDIO === "true",
    }),
    viteSingleFile({ removeViteModuleLoader: true, deleteInlinedFiles: true }),
  ],
});
