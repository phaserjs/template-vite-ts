import { promises as fs } from "fs";
import path from "path";

// Global scope within the module for shared data
let imageMap = {};

// Utility function to convert image to base64
async function imageToBase64(filePath) {
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
async function encodeAllImages(dir, basePath) {
  const files = await fs.readdir(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) {
      await encodeAllImages(filePath, basePath);
    } else if (/\.(jpe?g|png|gif|svg)$/i.test(file)) {
      const relativePath = path.relative(basePath, filePath);
      imageMap[relativePath] = await imageToBase64(filePath);
    }
  }
}

// Vite plugin definition
export default function inlineImages() {
  return {
    name: "inline-images",
    enforce: "pre",
    async buildStart() {
      const publicDirPath = path.resolve(__dirname, "../../public"); // Adjust path as necessary
      await encodeAllImages(publicDirPath, publicDirPath);
    },
    transformIndexHtml(html) {
      const imageScripts = Object.entries(imageMap)
        .map(
          ([key, value]) => `var img_${key.replace(/\W/g, "_")} = "${value}";`
        )
        .join("\n");
      return html.replace("</head>", `<script>${imageScripts}</script></head>`);
    },
  };
}
