const fs = require("fs");
const path = require("path");

/**
 * The source directory from which files will be copied.
 * @type {string}
 */
const sourceDir = path.resolve("./src");

/**
 * The destination directory where files will be copied.
 * @type {string}
 */
const destinationDir = path.resolve("./dist");

/**
 * Copies a file from the source to the destination.
 * @param {string} source - The path to the source file.
 * @param {string} target - The path to the destination file.
 */
function copyFile(source, target) {
  fs.copyFileSync(source, target);
  console.log(`Copied: ${source} to ${target}`);
}

/**
 * Recursively finds and copies .mjs files from a directory.
 * @param {string} currentDir - The current directory to search.
 */
function findAndCopyMJSFiles(currentDir) {
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });

  for (let entry of entries) {
    const entryPath = path.join(currentDir, entry.name);

    if (entry.isDirectory()) {
      findAndCopyMJSFiles(entryPath); // Recurse into directories
    } else if (entry.isFile() && entry.name.endsWith(".mjs")) {
      const newLocation = entryPath.replace(sourceDir, destinationDir);
      const targetDir = path.dirname(newLocation);

      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      copyFile(entryPath, newLocation);
    }
  }
}

// Start the copying process
findAndCopyMJSFiles(sourceDir);
