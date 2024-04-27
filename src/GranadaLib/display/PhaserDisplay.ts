import Phaser from "phaser";
import { Images } from "../types/types";
import Config from "../../config/config";

/**
 * Preloads all images defined in the Images object into a Phaser scene.
 * @param {Phaser.Scene} game - The Phaser scene where the images will be loaded.
 * @param {Images} images - An object mapping image keys to their file paths and keys.
 */
export const loadAllImages = (game: Phaser.Scene, images: Images): void => {
  // if (IS_DEV_MODE) {
  //   Object.entries(images).forEach(([key, image]) => {
  //     console.log(`Loading image ${key} from ${image.path}`);
  //   });
  // } else {
  game.textures.addBase64("questions", questions);
  game.textures.addBase64("topBar", topBar);
  game.textures.addBase64("submit", submit);
  game.textures.addBase64("letter", letter);
  game.textures.addBase64("letterCorrect", letterCorrect);
  game.textures.addBase64("letterAlmost", letterAlmost);
  game.textures.addBase64("letterWrong", letterWrong);
  game.textures.addBase64("deleteBtn", deleteBtn);
  game.textures.addBase64("confetti", confetti);
  game.textures.addBase64("wheel", wheel);
  game.textures.addBase64("welcomeSplash", welcomeSplash);
  game.textures.addBase64("completeSplash", completeSplash);
  game.textures.addBase64("button", button);
  //}

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
  container: Phaser.GameObjects.Container | Phaser.Scene
): Phaser.GameObjects.Image => {
  const scene = container instanceof Phaser.Scene ? container : container.scene;

  const image = scene.make.image({
    key,
  });

  if (container instanceof Phaser.GameObjects.Container) {
    container.add(image);
  } else {
    scene.add.existing(image);
  }

  image.x = x;
  image.y = y;
  image.setOrigin(0);

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
  text: string
): Phaser.GameObjects.Text => {
  const scene = container instanceof Phaser.Scene ? container : container.scene;
  const textObject = scene.make.text({
    x,
    y,
    text,
    style: {
      font: fontFamily,
      color,
      align: "center",
    },
  });

  textObject.setFontFamily(fontFamily);
  textObject.setFontSize(fontSize);

  if (!(container instanceof Phaser.Scene)) {
    container.add(textObject);
  }
  return textObject;
};

export const createSceneContainer = (
  scene: Phaser.Scene
): Phaser.GameObjects.Container => {
  const container = scene.add.container(0, 0);
  const scaleX = scene.game.canvas.width / Config.size.x;
  const scaleY = scene.game.canvas.height / Config.size.y;
  const scale = Math.min(scaleX, scaleY);
  container.setScale(scale);
  container.x = (scene.game.canvas.width - Config.size.x * scale) / 2;
  container.y = (scene.game.canvas.height - Config.size.y * scale) / 2;
  return container;
};
