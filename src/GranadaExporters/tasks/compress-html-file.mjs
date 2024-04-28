import fs from "fs";
import { minify } from "html-minifier-terser";
import { gzip } from "zlib";
import { promisify } from "util";
import path from "path";
import chalk from "chalk";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const gzipPromise = promisify(gzip);

/**
 * Convert bytes to megabytes (MB).
 * @param {number} bytes - Size in bytes.
 * @returns {number} - Size in megabytes (MB).
 */
function bytesToMB(bytes) {
  return bytes / (1024 * 1024);
}

/**
 * Minifies and compresses an HTML file with additional performance optimizations.
 * @param {string} inputPath - Path to the input HTML file.
 * @param {string} outputPath - Path to save the compressed output file.
 * @returns {Promise<void>} - A promise that resolves when the compression process is complete.
 */
async function compressHtmlFile(inputPath, outputPath) {
  console.log(chalk.green("Compressing output HTML file..."));

  try {
    // Read the HTML file
    const htmlContent = await readFile(inputPath, "utf8");

    // Get the size of the original HTML content
    const originalSize = Buffer.byteLength(htmlContent, "utf8");

    // Minify the HTML content with additional performance optimizations
    const minifiedHtml = await minify(htmlContent, {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
      minifyCSS: true,
      minifyJS: true,
      minifyURLs: true,
      removeEmptyAttributes: true,
      removeOptionalTags: true,
      removeAttributeQuotes: true,
      removeEmptyElements: false,
      collapseBooleanAttributes: true,
    });

    // Compress the minified HTML using Gzip
    const compressedHtml = await gzipPromise(minifiedHtml);

    // Write the compressed file without the .gz extension
    await writeFile(outputPath, compressedHtml);

    // Get the size of the compressed HTML content
    const compressedSize = Buffer.byteLength(compressedHtml);

    // Calculate the space saved
    const spaceSaved = originalSize - compressedSize;

    // Output the report to the console
    console.log(
      chalk.green("HTML file has been compressed and saved successfully.")
    );
    console.log(
      chalk.green(`Original size: ${chalk.yellow(bytesToMB(originalSize))} MB`)
    );
    console.log(
      chalk.green(
        `Compressed size: ${chalk.yellow(bytesToMB(compressedSize))} MB`
      )
    );
    console.log(
      chalk.green(
        `Space saved: ${chalk.yellow(bytesToMB(spaceSaved))} MB !!!` +
          ` ::  ${Math.round(
            (spaceSaved / originalSize) * 100
          )}% Reduction in size`
      )
    );
  } catch (error) {
    console.error(chalk.red("An error occurred:"), error);
  }
}

export default compressHtmlFile;

// Automatically compress dist/index.html when this module is run directly
const inputPath = path.resolve(process.cwd(), "dist", "index.html");
const outputPath = path.resolve(process.cwd(), "dist", "index.html");
compressHtmlFile(inputPath, outputPath);
