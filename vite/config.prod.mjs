import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import inlineImages from "./plugins/inlineImages";

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
  logLevel: "warning",
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
    viteSingleFile({ removeViteModuleLoader: true, deleteInlinedFiles: true }),
    inlineImages(),
  ],
});
