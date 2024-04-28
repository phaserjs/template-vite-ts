// your-plugin-file.ts
import { Plugin } from "vite";
import path from "path";
import { createConfigFile } from "../tasks/createConfigFile";
import { updatePagesConfig } from "../tasks/addPagesToConfig";
import { updateFontsConfig } from "../tasks/addFontsToConfig";
import { addImagesToConfig } from "../tasks/addImagesToConfig";
import { addAudioToConfig } from "../tasks/addAudioToConfig";

interface PluginOptions {
  width: string;
  height: string;
  encodeAudio: boolean;
}

export default function initGranadaGamesPlugin(options: PluginOptions): Plugin {
  return {
    name: "setup-project-configuration",
    async buildStart() {
      try {
        const projectRoot = process.cwd();

        const configFilePath = path.join(projectRoot, "src/config/config.json");
        const scenesPath = path.join(projectRoot, "src/scenes");
        const fontsPath = path.join(projectRoot, "src/assets/fonts");
        const imagesPath = path.join(projectRoot, "src/assets/images");
        const audioPath = path.join(projectRoot, "src/assets/audio");
        const distPath = path.join(projectRoot, "dist");
        // First create or update the main configuration file
        await createConfigFile(configFilePath, options.width, options.height);

        // Then update the pages configuration
        await updatePagesConfig(scenesPath, configFilePath);

        // update fonts configuration
        await updateFontsConfig(fontsPath, configFilePath);

        // update images configuration
        await addImagesToConfig(imagesPath, configFilePath);

        if (options.encodeAudio) {
          // update audio configuration
          await addAudioToConfig(audioPath, configFilePath);
        }

        console.log("Configuration has been successfully created and updated.");
      } catch (error) {
        console.error("Failed to setup project configuration:", error);
        // Properly reporting the error to Vite
        if (error instanceof Error) {
          this.error(`Error during plugin execution: ${error.message}`);
        } else {
          this.error("An unknown error occurred during plugin execution.");
        }
      }
    },
  };
}
