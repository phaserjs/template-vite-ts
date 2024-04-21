import { promises as fs } from "fs";
import path from "path";

// Function to list all font files in a directory
async function listFontFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = entries
    .filter(
      (file) => file.isFile() && /\.(woff2|woff|ttf|otf)$/.test(file.name)
    )
    .map((file) => path.join(dir, file.name));
  return files;
}

// Function to convert a font file to a base64-encoded CSS @font-face rule
async function convertFontToBase64CSS(filePath) {
  const fontData = await fs.readFile(filePath);
  const ext = path.extname(filePath).slice(1);
  const base64 = fontData.toString("base64");
  const fontName = path.basename(filePath, path.extname(filePath));
  const mimeType = `font/${
    ext === "ttf" ? "truetype" : ext === "otf" ? "opentype" : ext
  }`;

  return `
@font-face {
    font-family: '${fontName}';
    src: url(data:${mimeType};base64,${base64}) format('${ext}');
    font-weight: normal;
    font-style: normal;
}`;
}

// Function to append CSS to the head of an existing HTML file
async function appendCSSToHTML(cssRules, htmlFilePath) {
  try {
    const htmlContent = await fs.readFile(htmlFilePath, "utf8");
    const position = htmlContent.indexOf("</head>");
    if (position !== -1) {
      // Wrapping the CSS rules in a <style> tag
      const styleTag = `<style>\n${cssRules.join("\n")}\n</style>\n`;
      // Inserting the <style> tag before the </head> tag in the HTML content
      const updatedHTML =
        htmlContent.slice(0, position) + styleTag + htmlContent.slice(position);
      await fs.writeFile(htmlFilePath, updatedHTML, "utf8");
      console.log("CSS has been added to the HTML file.");
    } else {
      console.error("No </head> tag found in the HTML file.");
    }
  } catch (err) {
    console.error(`Failed to read or update the HTML file:`, err);
  }
}

// Main function to encode all fonts in a directory and append them to an HTML file
async function encodeFontsAndAppendToHTML(dir, htmlFilePath) {
  const fontFiles = await listFontFiles(dir);
  const cssRules = [];

  for (const file of fontFiles) {
    const css = await convertFontToBase64CSS(file);
    cssRules.push(css);
  }

  await appendCSSToHTML(cssRules, htmlFilePath);
}

// Run the script for a specific directory and HTML file path
encodeFontsAndAppendToHTML(
  path.resolve("public", "assets", "fonts"),
  path.resolve("dist", "index.html")
).catch(console.error);
