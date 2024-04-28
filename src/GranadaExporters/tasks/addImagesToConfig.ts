import fs from "fs";
import path from "path";
import { promisify } from "util";
import { optimize, loadConfig } from "svgo";
import sanitizeString from "../sanitizeString";
import toCamelCase from "../toCamelCase";
import { GameConfig, Images } from "../../GranadaLib/types/types";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const exists = promisify(fs.exists);
const mkdtemp = promisify(fs.mkdtemp);
const copyFile = promisify(fs.copyFile);
const stat = promisify(fs.stat);

/**
 * Loads SVGO configuration from the specified file path.
 * @param configFile - The file path to the SVGO configuration file.
 * @returns The loaded SVGO configuration.
 * @throws Will throw an error if the configuration file is invalid or empty.
 */
async function loadSvgoConfig(configFile: string): Promise<any> {
  console.log(`[INFO] Loading SVGO configuration from: ${configFile}`);
  const config = await loadConfig(configFile, process.cwd());
  if (!config) {
    throw new Error("SVGO configuration is invalid or empty");
  }
  return config;
}

/**
 * Compresses an SVG file using SVGO and provides detailed logging.
 * @param filePath - The file path to the SVG to be compressed.
 * @param config - The SVGO configuration to use for compression.
 * @returns The compressed SVG data as a string along with size reduction info.
 * @throws Will throw an error if the SVG cannot be read or if optimization fails.
 */
async function compressSVG(
  filePath: string,
  config: any
): Promise<{
  data: string;
  sizeBefore: number;
  sizeAfter: number;
  saved: number;
}> {
  const svgData = await readFile(filePath, "utf8").catch((err) => {
    throw new Error(`Failed to read SVG file: ${err.message}`);
  });

  const sizeBefore = (await stat(filePath)).size;

  const result = optimize(svgData, config);
  if (!result.data) {
    throw new Error("SVG optimization failed");
  }

  const sizeAfter = Buffer.byteLength(result.data);
  const saved = sizeBefore - sizeAfter;

  return { data: result.data, sizeBefore, sizeAfter, saved };
}

/**
 * Processes an array of SVG files using specified SVGO configuration and saves the compressed SVGs to a temporary directory.
 * Provides detailed logs of each file's processing and compression savings.
 * @param svgFiles - An array of paths to the SVG files to be processed.
 * @param svgoConfig - SVGO configuration object for compression.
 * @param tempDir - The temporary directory path where processed SVGs will be stored.
 * @returns An array of objects containing the compressed SVG data and the sanitized, camelCase filenames, along with size info.
 * @throws Will throw an error if any files are not SVGs or if file operations fail.
 */
async function processSvgFiles(
  svgFiles: string[],
  svgoConfig: any,
  tempDir: string
): Promise<
  Array<{
    svg: string;
    name: string;
    sizeBefore: number;
    sizeAfter: number;
    saved: number;
  }>
> {
  return Promise.all(
    svgFiles.map(async (file) => {
      const filenameWithExtension = path.basename(file);
      if (!filenameWithExtension.endsWith(".svg")) {
        throw new Error(
          `File format error: ${filenameWithExtension} is not an SVG file.`
        );
      }

      const filename = path.basename(file, ".svg");
      const sanitizedFilename = sanitizeString(filename);
      const camelCaseFilename = toCamelCase(sanitizedFilename);

      const tempPath = path.join(tempDir, filenameWithExtension);
      await copyFile(file, tempPath).catch((err) => {
        throw new Error(
          `Failed to copy file to temp directory: ${err.message}`
        );
      });

      const {
        data: compressedSVG,
        sizeBefore,
        sizeAfter,
        saved,
      } = await compressSVG(tempPath, svgoConfig);

      return {
        svg: compressedSVG,
        name: camelCaseFilename,
        sizeBefore,
        sizeAfter,
        saved,
      };
    })
  );
}

/**
 * Adds compressed SVG images to the game configuration.
 * @param svgPath - The path to the directory containing SVG files.
 * @param configFilePath - The path to the game configuration file.
 * @returns A Promise that resolves when the images are added to the configuration.
 * @throws Will throw an error if the configuration file does not exist or if any processing errors occur.
 */
export async function addImagesToConfig(
  svgPath: string,
  configFilePath: string
): Promise<void> {
  if (!(await exists(configFilePath))) {
    throw new Error("Configuration file does not exist");
  }

  const svgoConfig = await loadSvgoConfig(
    path.join(__dirname, "../svgo.config.mjs")
  );
  const tempDir = await mkdtemp(path.join(__dirname, "tmp-"));

  try {
    const svgFiles = await fs.promises.readdir(svgPath);
    const svgData = await processSvgFiles(
      svgFiles.map((file) => path.join(svgPath, file)),
      svgoConfig,
      tempDir
    );
    const images: Images = svgData.reduce(
      (acc: Images, { svg, name }) => ({
        ...acc,
        [name]: {
          key: name,
          path: `data:image/svg+xml;base64,${Buffer.from(svg).toString(
            "base64"
          )}`,
        },
      }),
      {}
    );

    const gameConfigData = await readFile(configFilePath, "utf8");
    const gameConfig: GameConfig = JSON.parse(gameConfigData);
    gameConfig.images = { ...gameConfig.images, ...images };

    await writeFile(configFilePath, JSON.stringify(gameConfig, null, 2));

    // Calculate total size before compression
    const totalSizeBefore = svgData.reduce(
      (acc, { sizeBefore }) => acc + sizeBefore,
      0
    );
    // Calculate total savings in MB
    const totalSavedBytes = svgData.reduce((acc, { saved }) => acc + saved, 0);
    const totalSavedMB = (totalSavedBytes / (1024 * 1024)).toFixed(2);
    const savedPercentage = (totalSavedBytes / totalSizeBefore) * 100;
    console.log(
      `[SUCCESS] Hooray! We've saved ${totalSavedMB} MB in total! That's a reduction of ${savedPercentage.toFixed(
        2
      )}% in file size!`
    );
  } catch (error) {
    console.error(
      `Error during image configuration: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    throw error; // Rethrow to handle it in the outer layer
  } finally {
    console.log("[INFO] Cleaning up temporary directory...");
    await fs.promises.rm(tempDir, { recursive: true }); // Updated to fs.rm
  }
}

if (require.main === module) {
  const [svgPath, configFilePath] = process.argv.slice(2);
  addImagesToConfig(svgPath, configFilePath).catch((error) => {
    console.error(
      `Fatal error: ${
        error instanceof Error ? error.message : "An unknown error occurred"
      }`
    );
    process.exit(1);
  });
}
