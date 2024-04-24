const fontkit = require("fontkit");
const { exec } = require("child_process");
const fs = require("fs").promises;
const path = require("path");

/**
 * Renders font glyphs into FFmpeg drawtext filter commands.
 * @param {string} fontPath - Path to the font file.
 * @param {number} fontSize - Font size for rendering.
 * @param {string} glyphsPerFont - String of characters to render.
 * @param {number} index - Vertical position multiplier for the row.
 * @returns {Promise<Object>} - Promise resolving to drawing commands and row width.
 */
async function renderFontGlyphs(fontPath, fontSize, glyphsPerFont, index) {
  return new Promise((resolve, reject) => {
    fontkit.open(fontPath, (error, font) => {
      if (error) {
        console.error(`Error loading font ${fontPath}: ${error}`);
        return reject(error);
      }
      const glyphs = glyphsPerFont
        .split("")
        .map((char) => font.glyphForCodePoint(char.charCodeAt(0)));
      const rowWidth = fontSize * glyphs.length;
      const filterCommands = glyphs
        .map((glyph, idx) => {
          const x = fontSize * idx;
          const y = fontSize * index;
          const text = String.fromCharCode(glyph.codePoints[0]);
          return `drawtext=fontfile='${fontPath.replace(
            /'/g,
            "'\\''"
          )}':text='${text}':x=${x}:y=${y}:fontsize=${fontSize}:fontcolor=black`;
        })
        .join(",");
      resolve({ rowWidth, filterCommands });
    });
  });
}

/**
 * Processes a directory of fonts and generates a single bitmap image with all glyphs.
 * @param {string} directory - Directory containing font files.
 * @param {string} outputImagePath - Path to save the generated image.
 */
async function processDirectory(directory, outputImagePath) {
  try {
    const files = await fs.readdir(directory);
    const fontSize = 48;
    const glyphsPerFont =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let totalWidth = 0;
    const renderPromises = files
      .filter((file) => /\.(ttf|otf|eot|woff|woff2|svg)$/.test(file))
      .map((file, index) =>
        renderFontGlyphs(
          path.join(directory, file),
          fontSize,
          glyphsPerFont,
          index
        )
      );

    const results = await Promise.all(renderPromises);
    totalWidth = Math.max(...results.map((result) => result.rowWidth));
    const filters = results.map((result) => result.filterCommands).join(",");
    const canvasHeight = fontSize * results.length; // Adjust height based on the number of processed fonts

    const command = `ffmpeg -f lavfi -i color=c=white:s=${totalWidth}x${canvasHeight} -vf "${filters}" "${outputImagePath}"`;
    exec(command, (error) => {
      if (error) {
        console.error(
          `Error generating combined bitmap font: ${error.message}`
        );
        return;
      }
      console.log("Combined bitmap font generated:", outputImagePath);
    });
  } catch (error) {
    console.error("Error processing fonts:", error);
  }
}

const fontsDir = "./public/assets";
const outputBitmap = "./dist/fonts.png";
processDirectory(fontsDir, outputBitmap);
