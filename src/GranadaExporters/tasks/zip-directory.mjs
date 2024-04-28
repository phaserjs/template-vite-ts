// Ensure your package.json has "type": "module" if you're using .js with ES imports
import JSZip from "jszip";
import fs from "fs-extra";
import path from "path";

/**
 * Recursively adds files and directories to the zip archive.
 * @param zip The JSZip instance.
 * @param dirPath The path to the directory to add to the zip file.
 * @param zipPath The path within the zip file.
 */
async function addDirToZip(zip, dirPath, zipPath = "") {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  console.log(`Zipping contents of ${dirPath}`);

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relativePath = path.join(zipPath, entry.name);
    console.log(fullPath);
    if (entry.isDirectory()) {
      await addDirToZip(zip, fullPath, relativePath);
    } else {
      console.log(`Adding file to zip: ${fullPath}`);
      const fileData = await fs.readFile(fullPath);
      zip.file(relativePath, fileData);
    }
  }
}

/**
 * Creates a zip file from a directory.
 * @param sourceDir The source directory to zip.
 * @param outputZip The path to output the zip file.
 */
async function zipDirectory(sourceDir, outputZip) {
  console.log(`Starting to zip directory: ${sourceDir}`);
  const zip = new JSZip();
  await addDirToZip(zip, sourceDir);

  console.log(`Writing zip file to ${outputZip}`);
  const content = await zip.generateAsync({ type: "nodebuffer" });
  await fs.writeFile(outputZip, content);

  console.log(`Directory zipped to ${outputZip}`);
}

const sourceDir = path.resolve(process.cwd(), "dist"); // For example, zip the 'dist' directory
const outputZip = path.resolve(process.cwd(), "dist", "dist.zip"); // Output zip file in the same directory

zipDirectory(sourceDir, outputZip).catch(console.error);
