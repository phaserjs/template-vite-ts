const imagemin = require("imagemin");
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageminPngquant = require("imagemin-pngquant");
const imageminGifsicle = require("imagemin-gifsicle");
const imageminSvgo = require("imagemin-svgo");
const fs = require("fs");

/**
 * Directory containing the images to be compressed.
 * @type {string}
 */
const inputDir = "./public/assets";

/**
 * Output directory where the compressed images will be saved.
 * @type {string}
 */
const outputDir = "./dist";

/**
 * Compresses image files in a specified directory and saves them to an output directory.
 * Supports jpg, jpeg, png, gif, and svg formats.
 *
 * @param {string} inputDir - The directory containing the images to compress.
 * @param {string} outputDir - The directory to save the compressed images.
 */
const compressImages = async (inputDir, outputDir) => {
  try {
    const files = await imagemin([`${inputDir}/*.{jpg,jpeg,png,gif,svg}`], {
      destination: outputDir,
      plugins: [
        imageminMozjpeg({ quality: 75 }),
        imageminPngquant({
          quality: [0.6, 0.8],
        }),
        imageminGifsicle(),
        imageminSvgo(),
      ],
    });

    console.log("Images compressed:", files.length);
  } catch (error) {
    console.error("Error compressing images:", error);
  }
};

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Start the image compression
compressImages(inputDir, outputDir);
