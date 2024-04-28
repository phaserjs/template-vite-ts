import path from "path";
import fs from "fs";

/**
 * Recursively find all files in a directory that match a given file extension.
 * @param {string} dirPath - The path to the directory to search.
 * @param {string} ext - The file extension to look for.
 * @param {string[]} arrayOfFiles - An array of files accumulated recursively.
 * @returns {string[]} An array of file paths.
 */
function getAllFiles(
  dirPath: string,
  ext: string,
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
        ext,
        arrayOfFiles
      );
    } else if (path.extname(file.name) === ext) {
      arrayOfFiles.push(path.join(dirPath, file.name));
    }
  });

  return arrayOfFiles;
}

/**
 * The main function that finds all files with a given extension in a specified directory.
 * This function can be exported and used in other scripts.
 * @param {string} directoryPath - Path to the directory to search, relative to process.cwd() or absolute.
 * @param {string} fileExtension - File extension to search for.
 * @returns {string[]} An array of file paths that match the given extension.
 */
function findAllFiles(directoryPath: string, fileExtension: string): string[] {
  const resolvedPath = path.resolve(process.cwd(), directoryPath);
  const normalizedExt = fileExtension.startsWith(".")
    ? fileExtension
    : `.${fileExtension}`;

  try {
    const result = getAllFiles(resolvedPath, normalizedExt);
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
// findAllFiles('./path/to/directory', '.js');
