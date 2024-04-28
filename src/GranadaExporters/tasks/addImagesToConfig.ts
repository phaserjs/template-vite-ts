import fs from "fs";
import path from "path";
import fse from "fs-extra";
import { promisify } from "util";
import { optimize, loadConfig } from "svgo";
import findAllFiles from "./findAllFiles";
import { Config } from "../interfaces/ConfigInterface";
import { encodeFileToBase64 } from "../encodeFileToBase64";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const exists = promisify(fs.exists);
const mkdtemp = promisify(fs.mkdtemp);

/**
 * Loads the SVGO configuration from a specific file.
 * @param configFile - The path to the configuration file.
 * @returns The configuration object for SVGO.
 */
async function loadSvgoConfig(configFile: string): Promise<any> {
  const config = await loadConfig(configFile, process.cwd());
  if (!config) {
    throw new Error("Failed to load SVGO configuration.");
  }
  return config;
}

/**
 * Compresses an SVG file using SVGO based on a loaded configuration.
 * @param svgData - The SVG content as a string.
 * @param config - The SVGO configuration to use.
 * @returns The optimized SVG content as a string.
 * @throws Throws an error if optimization fails.
 */
async function compressSVG(svgData: string, config: any): Promise<string> {
  try {
    const result = optimize(svgData, config);
    return result.data;
  } catch (error) {
    throw new Error(`Error optimizing SVG: ${error}`);
  }
}

/**
 * Updates the configuration JSON file with compressed and Base64-encoded SVG images from a specified directory.
 * @param svgPath - Path to the directory containing SVG files.
 * @param configFilePath - Path to the configuration JSON file to update. * @throws Error if the configuration file does not exist or file operations fail.
 */
export async function addImagesToConfig(
  svgPath: string,
  configFilePath: string
): Promise<void> {
  if (!(await exists(configFilePath))) {
    throw new Error(
      "Configuration file does not exist. Please ensure the config.json file is created before running this script."
    );
  }

  const svgoConfig = await loadSvgoConfig(
    path.resolve(path.join(__dirname, "../svgo.config.mjs"))
  );
  const tempDir = await mkdtemp(path.join(__dirname, "tmp-"));

  try {
    const svgFiles = findAllFiles(svgPath, "svg");
    await Promise.all(
      svgFiles.map(async (file) => {
        const svgData = await readFile(file, "utf8");
        const compressedSVG = await compressSVG(svgData, svgoConfig);
        const destinationPath = path.join(tempDir, path.basename(file));
        await writeFile(destinationPath, compressedSVG, "utf8");
        return destinationPath;
      })
    );

    const svgs = await Promise.all(
      svgFiles.map(async (filePath) => {
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
    config.images = { ...config.images, ...svgsObject };
    await writeFile(configFilePath, JSON.stringify(config, null, 2));
    console.log("Config file updated successfully with new SVG images.");
  } finally {
    await fse.remove(tempDir); // Ensure temporary directory is deleted even if an error occurs
  }
}

/**
 * Main function to execute the update process with directory paths provided via command line arguments.
 */
if (require.main === module) {
  const svgPath = process.argv[2];
  const configFilePath = process.argv[3];

  if (!svgPath || !configFilePath) {
    console.error("SVG Path or Config Path is missing");
    process.exit(1);
  }

  addImagesToConfig(svgPath, configFilePath).catch((err) => {
    console.error("Failed to update config file:", err);
    process.exit(1);
  });
}
