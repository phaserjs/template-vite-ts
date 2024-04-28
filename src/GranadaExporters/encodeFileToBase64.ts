import fs from "fs";
import { promisify } from "util";

const readFile = promisify(fs.readFile);
/**const readFile = promisify(fs.readFile);
 * Encodes a file to Base64.
 *
 * @param filePath Path to the file.
 * @returns Base64 encoded string of the file.
 */
export async function encodeFileToBase64(filePath: string): Promise<string> {
  const fileBuffer = await readFile(filePath);
  return fileBuffer.toString("base64");
}
