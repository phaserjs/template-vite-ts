import fs from "fs";
import path from "path";
import { promisify } from "util";
import { JSDOM } from "jsdom";
import { Config } from "../interfaces/ConfigInterface";
import { encodeFileToBase64 } from "../encodeFileToBase64";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const exists = promisify(fs.exists);

const htmlFilePath = path.join(process.cwd(), "index.html");

/**
 * Sanitizes a string by removing unwanted special characters while keeping critical CSS characters.
 * @param text The text to sanitize.
 * @returns The sanitized text.
 */
function sanitizeString(text: string): string {
  return text.replace(/[^a-zA-Z0-9 ,.!?;:{}@()'"\/\[\]-]/g, "");
}

/**
 * Extracts font family names from the given CSS content.
 * Uses a regular expression to find all instances of font-family declarations.
 * @param css The CSS content from which to extract font families.
 * @returns An array of unique font family names.
 */
function extractFontFamilies(css: string): string[] {
  const fontFamilyRegex = /font-family:\s*['"]?([^'";]+)['"]?;/gi;
  const fontFamilies = new Set<string>();

  let match;
  while ((match = fontFamilyRegex.exec(css)) !== null) {
    fontFamilies.add(match[1].trim());
  }
  return [...fontFamilies];
}

/**
 * Embeds CSS content from font-related CSS files into the `<head>` element of the specified HTML file,
 * removes existing related styles to prevent duplicates, and sets the style for a specific div dynamically.
 * @param cssFiles An array of paths to the CSS files.
 */
async function updateHtmlWithCss(cssFiles: string[]): Promise<void> {
  const cssContents = await Promise.all(
    cssFiles.map((filePath) => readFile(filePath, "utf8"))
  );
  const htmlContent = await readFile(htmlFilePath, "utf8");
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;

  const existingStyles = [...document.querySelectorAll("style[data-font-css]")];
  existingStyles.forEach((style) => style.remove());

  let allFontFamilies = new Set<string>();
  cssContents.forEach((css) => {
    const styleEl = document.createElement("style");
    styleEl.textContent = sanitizeString(css);
    styleEl.setAttribute("data-font-css", "");
    document.head.appendChild(styleEl);

    extractFontFamilies(css).forEach((family) => allFontFamilies.add(family));
  });

  const embeddedFontsDiv = document.getElementById("embedded-fonts");
  if (embeddedFontsDiv) {
    embeddedFontsDiv.style.cssText = `
      font-family: '${[...allFontFamilies].join(", ")}';
      opacity: 0;
      position: absolute;
      pointer-events: none;
    `;
  }

  await writeFile(htmlFilePath, dom.serialize());
}

/**
 * Updates the configuration JSON file with new fonts encoded in Base64 and updates the specified HTML file with new styles.
 * It processes both TTF and CSS files located in a given directory, encodes TTF files, and embeds CSS directly into HTML.
 * @param fontsPath The directory containing the font files.
 * @param configFilePath The JSON configuration file path where font data should be updated.
 */
export async function updateFontsConfig(
  fontsPath: string,
  configFilePath: string
): Promise<void> {
  if (!(await exists(configFilePath))) {
    throw new Error("Configuration file does not exist.");
  }

  const files = fs
    .readdirSync(fontsPath, { withFileTypes: true })
    .filter((file) =>
      file.isDirectory() ? false : /\.(ttf|css)$/.test(file.name)
    )
    .map((file) => path.join(fontsPath, file.name));

  const fontFiles = files.filter((file) => file.endsWith(".ttf"));
  const cssFiles = files.filter((file) => file.endsWith(".css"));

  const fonts = await Promise.all(
    fontFiles.map(async (filePath) => {
      const { name } = path.parse(filePath);
      const base64String = await encodeFileToBase64(filePath);
      const dataUrl = `url(data:font/ttf;charset=utf-8;base64,${base64String}) format('truetype')`;
      return {
        name: name.replace(/\s+/g, ""),
        value: { key: name.replace(/\s+/g, ""), path: dataUrl },
      };
    })
  );

  const fontsObject = fonts.reduce((acc: Record<string, any>, font) => {
    acc[font.name] = font.value;
    return acc;
  }, {});

  const fileContent = await readFile(configFilePath, "utf8");
  const config: Config = JSON.parse(fileContent);
  config.fonts = { ...config.fonts, ...fontsObject };
  await writeFile(configFilePath, JSON.stringify(config, null, 2), "utf8");

  await updateHtmlWithCss(cssFiles);

  console.log(
    "Config file and HTML updated successfully with new fonts and styles."
  );
}

// Main function executed via command line
if (require.main === module) {
  const fontsPath = process.argv[2];
  const configFilePath = process.argv[3];

  if (!fontsPath || !configFilePath) {
    console.error("Please specify the fonts path and config file path.");
    process.exit(1);
  }

  updateFontsConfig(fontsPath, configFilePath).catch((err) => {
    console.error("Failed to update fonts and HTML:", err);
    process.exit(1);
  });
}
