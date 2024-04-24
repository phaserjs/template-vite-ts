const { exec } = require("child_process");
const path = require("path");

/**
 * Generates a texture atlas from images in a specified directory.
 * @param {string} sourceDir - Directory containing image files.
 * @param {string} outputDir - Directory to output the atlas files.
 */
function generateTextureAtlas(sourceDir, outputDir) {
  const absoluteSourceDir = path.resolve(sourceDir);
  const absoluteOutputDir = path.resolve(outputDir);

  const command = `TexturePacker --sheet ${absoluteOutputDir}/atlas.png --data ${absoluteOutputDir}/atlas.json --format phaser --no-trim --max-size 4096 --allow-free-size --algorithm MaxRects --pack-mode Best --disable-rotation --scale 1 --scale-mode Smooth ${absoluteSourceDir}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Error: ${stderr}`);
      return;
    }
    console.log(`Texture Atlas Generated: ${stdout}`);
  });
}

// Usage
const sourceDirectory = "./public/assets";
const outputDirectory = "./dist/images";

generateTextureAtlas(sourceDirectory, outputDirectory);
