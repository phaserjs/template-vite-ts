// your-plugin-file.ts
import { Plugin } from "vite";
import path from "path";
import { createConfigFile } from "../tasks/createConfigFile";
import { updatePagesConfig } from "../tasks/addPagesToConfig";

interface PluginOptions {
  width: string;
  height: string;
}

export default function initGranadaConfigPlugin(
  options: PluginOptions
): Plugin {
  return {
    name: "setup-project-configuration",
    async buildStart() {
      try {
        const projectRoot = process.cwd();

        const configFilePath = path.join(projectRoot, "src/config/config.json");
        const scenesPath = path.join(projectRoot, "src/scenes");

        // First create or update the main configuration file
        await createConfigFile(configFilePath, options.width, options.height);

        // Then update the pages configuration
        await updatePagesConfig(scenesPath, configFilePath);

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
