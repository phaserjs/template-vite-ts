import fs from "fs";
import path from "path";
import { promisify } from "util";
import findAllFiles from "./findAllFiles"; // Ensure this is properly linked
import { Config } from "../ConfigInterface"; // Ensure this is properly defined

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const exists = promisify(fs.exists);

/**
 * Updates the configuration JSON file with fonts derived from tff files in a specified directory.
 * Asynchronously reads and writes to the configuration file.
 *
 * @param fontsPath Path to the directory containing font files.
 * @param configFilePath Path to the configuration JSON file to update.
 * @throws Will throw an error if the configuration file does not exist or file operations fail.
 */
export async function updateFontsConfig(
  fontsPath: string,
  configFilePath: string
): Promise<void> {
  const fileExists = await exists(configFilePath);
  if (!fileExists) {
    throw new Error(
      "Configuration file does not exist. Please ensure that the config.json file is created before running this script."
    );
  }
  const fileType = "ttf";
  const fontFiles = findAllFiles(fontsPath, fileType);

  const fonts = fontFiles.reduce(
    (acc: Record<string, any>, filePath: string) => {
      const { name } = path.parse(filePath); // Extract filename without extension
      acc[name] = { key: name, path: "" }; // Set path as empty string for now
      return acc;
    },
    {}
  );

  const fileContent = await readFile(configFilePath, "utf8");
  const config: Config = JSON.parse(fileContent);

  // Merge the new fonts with existing fonts in the config
  config.fonts = { ...config.fonts, ...fonts };

  // Serialize the updated configuration object and write it back to the file
  await writeFile(configFilePath, JSON.stringify(config, null, 2));
  console.log("Config file updated successfully with new fonts.");
}

/**
 * Main function to execute the update process with directory paths provided via command line arguments.
 */
if (require.main === module) {
  const fontsPath = process.argv[2];
  const configFilePath = process.argv[3];

  if (!fontsPath) {
    console.error("Fonts Path is missing");
    process.exit(1);
  }

  if (!configFilePath) {
    console.error("Config Path is missing");
    process.exit(1);
  }

  updateFontsConfig(fontsPath, configFilePath).catch((err) => {
    console.error("Failed to update config file:", err);
    process.exit(1);
  });
}
