import path from "path";
import { promises as fs } from "fs";

export default function inlineImages(config) {
  let encodedImages = {};

  return {
    name: "inline-images",
    enforce: "pre",
    async buildStart() {
      const outputFilePath = path.resolve(
        __dirname,
        "../../src/config/assets.ts"
      );
      console.log("Starting to encode images...");
      try {
        encodedImages = await encodeConfigImages(config.images, outputFilePath);
        console.log(`Base64 images object exported to ${outputFilePath}`);
        this.addWatchFile(outputFilePath);
      } catch (error) {
        console.error("Failed to encode images:", error);
      }
    },
    async writeBundle(options, bundle) {
      const indexHtmlPath = path.resolve(
        options.dir || path.dirname(options.file),
        "index.html"
      );
      const typesFilePath = path.resolve(
        __dirname,
        "../../src/Utils/images.d.ts"
      ); // Adjusted path
      try {
        await injectBase64IntoHtml(encodedImages, indexHtmlPath);
        await createTypesFile(encodedImages, typesFilePath);
      } catch (error) {
        console.error("Failed to finalize output:", error);
      }
    },
  };
}

async function createTypesFile(images, filePath) {
  const declarations = Object.keys(images)
    .map((key) => `declare const ${key}: string;`)
    .join("\n");
  const content = `// Type declarations for image assets\n${declarations}`;
  await fs.writeFile(filePath, content, "utf8");
}

async function injectBase64IntoHtml(images, htmlFilePath) {
  let htmlContent = await fs.readFile(htmlFilePath, "utf8");
  const headCloseTag = "</head>";
  const base64Scripts = Object.values(images)
    .map((image) => `<script>const ${image.key} = "${image.path}";</script>`)
    .join("\n");

  htmlContent = htmlContent.replace(
    headCloseTag,
    `${base64Scripts}\n${headCloseTag}`
  );
  await fs.writeFile(htmlFilePath, htmlContent, "utf8");
}

async function encodeConfigImages(images, outputFilePath) {
  const imageObject = {};
  const imageArray = Object.values(images);
  for (const image of imageArray) {
    try {
      const filePath = path.resolve(__dirname, "../../public", image.path);
      const base64 = await imageToBase64(filePath);
      imageObject[image.key] = { key: image.key, path: base64 };
    } catch (error) {
      console.error(`Failed to process image ${image.key}:`, error);
    }
  }
  const exportContent = `export const images = ${JSON.stringify(
    imageObject,
    null,
    2
  )};`;
  await fs.writeFile(outputFilePath, exportContent, "utf8");
  return imageObject;
}

async function imageToBase64(filePath) {
  try {
    const file = await fs.readFile(filePath);
    const ext = path.extname(filePath).substring(1).toLowerCase();
    const mimeTypes = {
      jpg: "jpeg",
      jpeg: "jpeg",
      png: "png",
      gif: "gif",
      webp: "webp",
      svg: "svg+xml",
    };
    return `data:image/${mimeTypes[ext] || "png"};base64,${file.toString(
      "base64"
    )}`;
  } catch (error) {
    console.error(`Failed to read or encode file at ${filePath}:`, error);
    throw error;
  }
}
