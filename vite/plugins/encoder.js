import { promises as fs } from "fs";
import path from "path";

// Utility function to convert image to base64
export async function imageToBase64(filePath) {
  const file = await fs.readFile(filePath);
  const ext = path.extname(filePath).substring(1).toLowerCase();
  const mimeTypes = {
    jpg: "jpeg",
    jpeg: "jpeg",
    png: "png",
    gif: "gif",
    svg: "svg+xml",
  };
  return `data:image/${mimeTypes[ext] || "png"};base64,${file.toString(
    "base64"
  )}`;
}

// Function to recursively scan and encode images from a directory
export async function encodeAllImages(dir, basePath) {
  const files = await fs.readdir(dir);
  const imageMap = {};

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.stat(filePath);

    if (stat.isDirectory()) {
      const subImages = await encodeAllImages(filePath, basePath);
      Object.assign(imageMap, subImages);
    } else if (/\.(jpe?g|png|gif|svg)$/i.test(file)) {
      const relativePath = path.relative(basePath, filePath);
      imageMap[relativePath] = await imageToBase64(filePath);
    }
  }
  return imageMap;
}
