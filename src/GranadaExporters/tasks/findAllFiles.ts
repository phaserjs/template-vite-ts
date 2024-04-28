import path from "path";
import fs from "fs";

/**
 * Recursively find all files in a directory that match a given set of file extensions.
 * @param {string} dirPath - The path to the directory to search.
 * @param {string[]} exts - An array of file extensions to look for.
 * @param {string[]} arrayOfFiles - An array of files accumulated recursively.
 * @returns {string[]} An array of file paths that match the specified extensions.
 */
function getAllFiles(
  dirPath: string,
  exts: string[],
  arrayOfFiles: string[] = []
): string[] {
  let files;
  try {
    files = fs.readdirSync(dirPath, { withFileTypes: true });
  } catch (error) {
    console.error("Error accessing directory:", error);
    return arrayOfFiles; // Return the current list of files if the directory read fails
  }

  files.forEach((file) => {
    if (file.isDirectory()) {
      arrayOfFiles = getAllFiles(
        path.join(dirPath, file.name),
        exts,
        arrayOfFiles
      );
    } else {
      const fileExt = path.extname(file.name);
      if (exts.includes(fileExt)) {
        arrayOfFiles.push(path.join(dirPath, file.name));
      }
    }
  });

  return arrayOfFiles;
}

/**
 * The main function that finds all files with the given extensions in a specified directory.
 * @param {string} directoryPath - Path to the directory to search, relative to process.cwd() or absolute.
 * @param {string[]} fileExtensions - An array of file extensions to search for.
 * @returns {string[]} An array of file paths that match the given extensions.
 */
function findAllFiles(
  directoryPath: string,
  fileExtensions: string[]
): string[] {
  const resolvedPath = path.resolve(process.cwd(), directoryPath);
  const normalizedExts = fileExtensions.map((ext) =>
    ext.startsWith(".") ? ext : `.${ext}`
  );

  try {
    const result = getAllFiles(resolvedPath, normalizedExts);
    console.log("Found files:", result);
    return result;
  } catch (error) {
    console.error(
      "Error reading directory:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return []; // Return an empty array in case of an error
  }
}

export default findAllFiles; // Exporting the function for external use

// Example usage: Uncomment the following line to use within this script
// findAllFiles('./path/to/directory', ['.js', '.ts']);
