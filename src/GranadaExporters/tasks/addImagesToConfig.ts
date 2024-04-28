import fs from "fs";
import path from "path";
import { promisify } from "util";
import findAllFiles from "./findAllFiles"; // Ensure this is properly linked
import { Config } from "../interfaces/ConfigInterface"; // Ensure this is properly defined

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const exists = promisify(fs.exists);

/**
 * Encodes a file to Base64.
 *
 * @param filePath Path to the file.
 * @returns Base64 encoded string of the file.
 */
async function encodeFileToBase64(filePath: string): Promise<string> {
  const fileBuffer = await readFile(filePath);
  return fileBuffer.toString("base64");
}

/**
 * Updates the configuration JSON file with SVG images derived from svg files in a specified directory.
 * Asynchronously reads and writes to the configuration file. Encodes SVG files in Base64.
 *
 * @param svgPath Path to the directory containing SVG files.
 * @param configFilePath Path to the configuration JSON file to update.
 * @throws Will throw an error if the configuration file does not exist or file operations fail.
 */
export async function addImagesToConfig(
  svgPath: string,
  configFilePath: string
): Promise<void> {
  const fileExists = await exists(configFilePath);
  if (!fileExists) {
    throw new Error(
      "Configuration file does not exist. Please ensure that the config.json file is created before running this script."
    );
  }
  const fileType = "svg";
  const svgFiles = findAllFiles(svgPath, fileType);

  const svgs = await Promise.all(
    svgFiles.map(async (filePath: string) => {
      const { name } = path.parse(filePath);
      const base64String = await encodeFileToBase64(filePath);
      const dataUrl = `url(data:image/svg+xml;charset=utf-8;base64,${base64String})`;
      return { name, value: { key: name, path: dataUrl } };
    })
  );

  const svgsObject = svgs.reduce((acc: Record<string, any>, svg) => {
    acc[svg.name] = svg.value;
    return acc;
  }, {});

  const fileContent = await readFile(configFilePath, "utf8");
  const config: Config = JSON.parse(fileContent);

  // Merge the new SVGs with existing images in the config
  config.images = { ...config.images, ...svgsObject };

  // Serialize the updated configuration object and write it back to the file
  await writeFile(configFilePath, JSON.stringify(config, null, 2));
  console.log("Config file updated successfully with new SVG images.");
}

/**
 * Main function to execute the update process with directory paths provided via command line arguments.
 */
if (require.main === module) {
  const svgPath = process.argv[2];
  const configFilePath = process.argv[3];

  if (!svgPath) {
    console.error("SVG Path is missing");
    process.exit(1);
  }

  if (!configFilePath) {
    console.error("Config Path is missing");
    process.exit(1);
  }

  addImagesToConfig(svgPath, configFilePath).catch((err) => {
    console.error("Failed to update config file:", err);
    process.exit(1);
  });
}
