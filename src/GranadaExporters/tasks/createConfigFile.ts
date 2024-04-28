import fs from "fs";
import path from "path";
import { Config } from "../interfaces/ConfigInterface";
import { promisify } from "util";

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const exists = promisify(fs.exists);

/**
 * Represents the structure for command line dimensions.
 */
interface CommandLineArgs {
  width: number;
  height: number;
}

/**
 * Parses command line or environment input strings to extract dimensions.
 * @param widthStr The width as a string.
 * @param heightStr The height as a string.
 * @returns The parsed dimensions as CommandLineArgs.
 * @throws Will throw an error if either width or height are not provided or if they are not valid integers.
 */
function parseArguments(widthStr: string, heightStr: string): CommandLineArgs {
  if (!widthStr || !heightStr) {
    throw new Error("Both WIDTH and HEIGHT environment variables must be set.");
  }

  const width = parseInt(widthStr, 10);
  const height = parseInt(heightStr, 10);

  if (isNaN(width) || isNaN(height)) {
    throw new Error("Both WIDTH and HEIGHT must be valid integers.");
  }

  if (width < 0 || height < 0) {
    throw new Error("Both WIDTH and HEIGHT must be non-negative numbers.");
  }

  return { width, height };
}

/**
 * Generates configuration content based on provided dimensions.
 * @param width Width for the configuration.
 * @param height Height for the configuration.
 * @returns A configuration object filled with default values and specified dimensions.
 */
function generateConfigContent(width: number, height: number): Config {
  return {
    size: {
      x: width,
      y: height,
    },
    pages: {},
    fonts: {},
    images: {},
    audio: {},
  };
}

/**
 * Writes the configuration data to a specified file path.
 * @param configData The configuration data to write.
 * @param filePath The file path where the configuration should be written.
 * @throws Will throw an error if the file path's directory does not exist and cannot be created.
 */
async function writeConfigFile(
  configData: Config,
  filePath: string
): Promise<void> {
  const dir = path.dirname(filePath);

  if (!(await exists(dir))) {
    await mkdir(dir, { recursive: true });
  }

  await writeFile(filePath, JSON.stringify(configData, null, 2));
  console.log("Config file written successfully at:", filePath);
}

/**
 * Creates a configuration file from specified dimensions.
 * @param filePath The path to write the configuration file.
 * @param widthStr The width dimension as a string.
 * @param heightStr The height dimension as a string.
 * @throws Will propagate any parsing or file writing errors to the caller.
 */
export async function createConfigFile(
  filePath: string,
  widthStr: string,
  heightStr: string
): Promise<void> {
  const { width, height } = parseArguments(widthStr, heightStr);
  const configData = generateConfigContent(width, height);
  await writeConfigFile(configData, filePath);
}

// Allow direct command-line usage
if (require.main === module) {
  const filePath = process.argv[2];
  const widthStr = process.argv[3];
  const heightStr = process.argv[4];
  createConfigFile(filePath, widthStr, heightStr).catch((err) => {
    console.error("Failed to create config file:", (err as Error).message);
  });
}
