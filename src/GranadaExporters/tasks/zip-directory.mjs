import JSZip from "jszip";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

/**
 * Recursively adds files and directories to the zip archive.
 * @param zip The JSZip instance.
 * @param dirPath The path to the directory to add to the zip file.
 * @param zipPath The path within the zip file.
 */
async function addDirToZip(zip, dirPath, zipPath = "") {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relativePath = path.join(zipPath, entry.name);
    if (entry.isDirectory()) {
      await addDirToZip(zip, fullPath, relativePath);
    } else {
      console.log(chalk.yellow(`Adding file to zip: ${fullPath}`));
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
  console.log(chalk.green(`Starting to zip directory: ${sourceDir}`));
  const zip = new JSZip();
  await addDirToZip(zip, sourceDir);

  console.log(chalk.yellow(`Writing zip file to ${outputZip}`));
  const content = await zip.generateAsync({ type: "nodebuffer" });
  await fs.writeFile(outputZip, content);

  console.log(chalk.green(`Directory zipped to ${outputZip}`));
}

const sourceDir = path.resolve(process.cwd(), "dist");
const outputZip = path.resolve(process.cwd(), "dist", "dist.zip");

zipDirectory(sourceDir, outputZip).catch(console.error);
