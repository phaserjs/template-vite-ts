import fs from "fs";
import path from "path";
import { promisify } from "util";
import { JSDOM } from "jsdom";
import { GameConfig } from "../../GranadaLib/types/types";
import { encodeFileToBase64 } from "../encodeFileToBase64";
import findAllFiles from "./findAllFiles";
import sanitizeString from "../sanitizeString";
import toCamelCase from "../toCamelCase";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const exists = promisify(fs.exists);

/**
 * Updates both HTML and config files for fonts.
 * Fonts are Base64 encoded and embedded directly into HTML.
 * Only sanitized and camelCased font names are saved in the config file.
 * @param fontsPath The directory containing the font files.
 * @param htmlFilePath The HTML file path to update.
 * @param configFilePath The JSON configuration file path where font data should be updated.
 */
export async function updateFontsConfig(
  fontsPath: string,
  htmlFilePath: string,
  configFilePath: string
): Promise<void> {
  if (!(await exists(configFilePath))) {
    throw new Error("Configuration file does not exist.");
  }

  const fontFiles = findAllFiles(fontsPath, ["ttf"]);

  const fonts = await Promise.all(
    fontFiles.map(async (filePath) => {
      const { name } = path.parse(filePath);
      const sanitized = sanitizeString(name);
      const camelCaseName = toCamelCase(sanitized);
      const base64String = await encodeFileToBase64(filePath);
      return {
        name: camelCaseName,
        base64: `url(data:font/ttf;charset=utf-8;base64,${base64String}) format('truetype')`,
      };
    })
  );

  const configContent = await readFile(configFilePath, "utf8");
  const config: GameConfig = JSON.parse(configContent);
  const newFontKeys = fonts.reduce(
    (acc, font) => ({ ...acc, [font.name]: font.name }),
    {}
  );

  config.fonts = { ...config.fonts, ...newFontKeys };
  await writeFile(configFilePath, JSON.stringify(config, null, 2), "utf8");

  await updateHtmlWithFonts(htmlFilePath, fonts);
}

/**
 * Embeds encoded font data directly into the HTML file.
 * @param htmlFilePath The path to the HTML file to update.
 * @param fonts Array of objects with font names and their Base64 encoded values.
 */
async function updateHtmlWithFonts(
  htmlFilePath: string,
  fonts: { name: string; base64: string }[]
): Promise<void> {
  const htmlContent = await readFile(htmlFilePath, "utf8");
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;

  const existingStyles = [...document.querySelectorAll("style[data-font-css]")];
  existingStyles.forEach((style) => style.remove());

  const styleEl = document.createElement("style");
  styleEl.setAttribute("data-font-css", "");

  let cssContent = fonts
    .map(
      (font) => `
@font-face {
  font-family: '${font.name}';
  src: ${font.base64};
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}`
    )
    .join("");

  styleEl.textContent = cssContent;
  document.head.appendChild(styleEl);

  await writeFile(htmlFilePath, dom.serialize());
}

// Main function executed via command line
if (require.main === module) {
  const fontsPath = process.argv[2];
  const htmlFilePath = process.argv[3];
  const configFilePath = process.argv[4];

  if (!fontsPath || !htmlFilePath || !configFilePath) {
    console.error(
      "Please specify the fonts path, HTML file path, and config file path."
    );
    process.exit(1);
  }

  updateFontsConfig(fontsPath, htmlFilePath, configFilePath).catch((err) => {
    console.error("Failed to update fonts and HTML:", err);
    process.exit(1);
  });
}
