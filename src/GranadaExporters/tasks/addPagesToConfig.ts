import fs from "fs";
import path from "path";
import { promisify } from "util";
import findAllFiles from "./findAllFiles"; // Ensure this is properly linked
import { GameConfig } from "../../GranadaLib/types/types";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const exists = promisify(fs.exists);

/**
 * Updates the configuration JSON file with pages derived from TypeScript files in a specified directory.
 * Asynchronously reads and writes to the configuration file.
 *
 * @param scenesPath Path to the directory containing TypeScript files.
 * @param configFilePath Path to the configuration JSON file to update.
 * @throws Will throw an error if the configuration file does not exist or file operations fail.
 */
export async function updatePagesConfig(
  scenesPath: string,
  configFilePath: string
): Promise<void> {
  const fileExists = await exists(configFilePath);
  if (!fileExists) {
    throw new Error(
      "Configuration file does not exist. Please ensure that the config.json file is created before running this script."
    );
  }
  const fileType = "ts";
  const tsFiles = findAllFiles(scenesPath, [fileType]);

  const pages = tsFiles.reduce(
    (acc: Record<string, string>, filePath: string) => {
      const { name } = path.parse(filePath); // Extract filename without extension
      acc[name] = name;
      return acc;
    },
    {}
  );

  const fileContent = await readFile(configFilePath, "utf8");
  const config: GameConfig = JSON.parse(fileContent);

  // Merge the new pages with existing pages in the config
  config.pages = { ...config.pages, ...pages };

  // Serialize the updated configuration object and write it back to the file
  await writeFile(configFilePath, JSON.stringify(config, null, 2));
  console.log("Config file updated successfully with new pages.");
}

/**
 * Main function to execute the update process with directory paths provided via command line arguments.
 */
if (require.main === module) {
  const scenesPath = process.argv[2];
  const configFilePath = process.argv[3];

  if (!scenesPath) {
    console.error("Scenes Path is missing");
    process.exit(1);
  }

  if (!configFilePath) {
    console.error("Config Path is missing");
    process.exit(1);
  }

  updatePagesConfig(scenesPath, configFilePath).catch((err) => {
    console.error("Failed to update config file:", err);
    process.exit(1);
  });
}
