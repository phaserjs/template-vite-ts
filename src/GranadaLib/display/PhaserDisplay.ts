import Phaser from "phaser";
import { GameConfig, Images, Point } from "../types/types";

/**
 * Preloads all images defined in the Images object into a Phaser scene.
 * @param {Phaser.Scene} game - The Phaser scene where the images will be loaded.
 * @param {Images} images - An object mapping image keys to their file paths and keys.
 */
export const loadAllImages = (game: Phaser.Scene, images: Images): void => {
  Object.entries(images).forEach(([key, image]) => {
    console.log(`Loading image ${key} from ${image.path}`);
    game.textures.addBase64(image.key, image.path);
  });
  game.load.start();
};

/**
 * Adds an image to a Phaser scene or container.
 * @param {number} x - The x-coordinate for the image position.
 * @param {number} y - The y-coordinate for the image position.
 * @param {string} key - The key for the loaded image.
 * @param {Phaser.GameObjects.Container | Phaser.Scene} container - The container or scene to add the image to.
 * @param {GameConfig} config - Game configuration object.
 * @param {boolean} [centerX=false] - Whether to center the image horizontally within the scene.
 * @returns {Phaser.GameObjects.Image} The newly created Phaser image object.
 */
export const addImage = (
  x: number,
  y: number,
  key: string,
  container: Phaser.GameObjects.Container | Phaser.Scene,
  config: GameConfig,
  centerX: boolean = false
): Phaser.GameObjects.Image => {
  const scene = container instanceof Phaser.Scene ? container : container.scene;
  const image = scene.add.image(x, y, key).setInteractive();
  const scale = getGameScale(config) * 0.5; // Assuming use of retina assets
  image.setScale(scale);
  if (centerX) {
    image.setX(scene.cameras.main.width / 2);
    image.setOrigin(0.5, 0);
  }
  if (container instanceof Phaser.GameObjects.Container) {
    container.add(image);
  }
  return image;
};

/**
 * Adds text to a Phaser scene or container.
 * @param {number} x - The x-coordinate for the text position.
 * @param {number} y - The y-coordinate for the text position.
 * @param {string} fontFamily - The font family for the text.
 * @param {number} fontSize - The font size for the text.
 * @param {Phaser.GameObjects.Container | Phaser.Scene} container - The container or scene to add the text to.
 * @param {string} color - The color of the text.
 * @param {string} text - The text content.
 * @param {GameConfig} config - Game configuration object.
 * @returns {Phaser.GameObjects.Text} The newly created Phaser text object.
 */
export const addText = (
  x: number,
  y: number,
  fontFamily: string,
  fontSize: number,
  container: Phaser.GameObjects.Container | Phaser.Scene,
  color: string,
  text: string,
  config: GameConfig
): Phaser.GameObjects.Text => {
  const scene = container instanceof Phaser.Scene ? container : container.scene;
  const textObject = scene.add
    .text(x, y, text, {
      fontFamily,
      fontSize: `${fontSize}px`,
      color,
      align: "center",
    })
    .setInteractive();
  const scale = getGameScale(config);
  textObject.setFontSize(fontSize * scale);
  textObject.setOrigin(0.5, 0);
  if (!(container instanceof Phaser.Scene)) {
    container.add(textObject);
  }
  return textObject;
};

/**
 * Calculates the game scale based on the window dimensions and predefined game size.
 * @param {GameConfig} config - Game configuration object specifying the intended game dimensions.
 * @returns {number} The scale factor derived from the maximum of either the width or height scale.
 */
export const getGameScale = (config: GameConfig): number => {
  const scaleX = window.innerWidth / config.size.x;
  const scaleY = window.innerHeight / config.size.y;
  return Math.max(scaleX, scaleY);
};

/**
 * Calculates the scaled position based on the game configuration.
 * @param {Point} p - The original point to be scaled.
 * @param {GameConfig} config - Game configuration object.
 * @returns {Point} The scaled position.
 */
export const getPosition = (p: Point, config: GameConfig): Point => {
  return {
    x: p.x * getGameScale(config),
    y: p.y * getGameScale(config),
  };
};
