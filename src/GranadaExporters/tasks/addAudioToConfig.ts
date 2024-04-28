import fs from "fs";
import path from "path";
import { promisify } from "util";
import findAllFiles from "./findAllFiles"; // Ensure this is properly linked
import { Config } from "../interfaces/ConfigInterface"; // Ensure this is properly defined
import { encodeFileToBase64 } from "../encodeFileToBase64";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const exists = promisify(fs.exists);

/**
 * Updates the configuration JSON file with WAV audio files derived from wav files in a specified directory.
 * Asynchronously reads and writes to the configuration file. Encodes WAV files in Base64.
 *
 * @param wavPath Path to the directory containing WAV files.
 * @param configFilePath Path to the configuration JSON file to update.
 * @throws Will throw an error if the configuration file does not exist or file operations fail.
 */
export async function addAudioToConfig(
  wavPath: string,
  configFilePath: string
): Promise<void> {
  const fileExists = await exists(configFilePath);
  if (!fileExists) {
    throw new Error(
      "Configuration file does not exist. Please ensure that the config.json file is created before running this script."
    );
  }
  const fileType = "wav";
  const wavFiles = findAllFiles(wavPath, [fileType]);

  const wavs = await Promise.all(
    wavFiles.map(async (filePath: string) => {
      const { name } = path.parse(filePath);
      const base64String = await encodeFileToBase64(filePath);
      const dataUrl = `url(data:audio/wav;base64,${base64String})`;
      return { name, value: { key: name, path: dataUrl } };
    })
  );

  const wavsObject = wavs.reduce((acc: Record<string, any>, wav) => {
    acc[wav.name] = wav.value;
    return acc;
  }, {});

  const fileContent = await readFile(configFilePath, "utf8");
  const config: Config = JSON.parse(fileContent);

  // Merge the new WAVs with existing audio data in the config
  config.audio = { ...config.audio, ...wavsObject };

  // Serialize the updated configuration object and write it back to the file
  await writeFile(configFilePath, JSON.stringify(config, null, 2));
  console.log("Config file updated successfully with new WAV audio files.");
}

/**
 * Main function to execute the update process with directory paths provided via command line arguments.
 */
if (require.main === module) {
  const wavPath = process.argv[2];
  const configFilePath = process.argv[3];

  if (!wavPath) {
    console.error("WAV Path is missing");
    process.exit(1);
  }

  if (!configFilePath) {
    console.error("Config Path is missing");
    process.exit(1);
  }

  addAudioToConfig(wavPath, configFilePath).catch((err) => {
    console.error("Failed to update config file:", err);
    process.exit(1);
  });
}
