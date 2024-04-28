import Phaser from "phaser";
import { Images } from "../types/types";
import Config from "../../config/working-config";

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

  //}

  console.log("Loading images...", images);

  Object.entries(images).forEach(([key, image]) => {
    console.log(`Loading image ${key} from ${image.path}`);
    game.textures.addBase64(image.key, image.path);
  });

  game.load.start();
};

/**
 * Creates and adds an image to a Phaser scene or container.
 * @param x The x-coordinate for the image position.
 * @param y The y-coordinate for the image position.
 * @param key The key for the loaded image.
 * @param container The container or scene to add the image to, either a Phaser.GameObjects.Container or Phaser.Scene.
 * @returns The newly created Phaser image object.
 */
export const addImage = (
  x: number,
  y: number,
  key: string,
  container: Phaser.GameObjects.Container | Phaser.Scene
): Phaser.GameObjects.Image => {
  const scene =
    container instanceof Phaser.GameObjects.Container
      ? container.scene
      : container;
  const image = scene.make.image({ key, x, y });
  image.setOrigin(0);

  if (container instanceof Phaser.GameObjects.Container) {
    container.add(image);
  } else {
    scene.add.existing(image);
  }

  return image;
};

/**
 * Creates and adds text to a Phaser scene or container.
 * @param x The x-coordinate for the text position.
 * @param y The y-coordinate for the text position.
 * @param fontFamily The font family for the text.
 * @param fontSize The font size for the text.
 * @param container The container or scene to add the text to, either a Phaser.GameObjects.Container or Phaser.Scene.
 * @param color The color of the text.
 * @param text The text content.
 * @returns The newly created Phaser text object.
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
  const scene =
    container instanceof Phaser.GameObjects.Container
      ? container.scene
      : container;
  const textObject = scene.make.text({
    x,
    y,
    text,
    style: {
      font: `${fontSize}px ${fontFamily}`,
      color,
      align: "center",
    },
  });

  if (container instanceof Phaser.GameObjects.Container) {
    container.add(textObject);
  }

  return textObject;
};

/**
 * Calculates the display scale factor based on the scene dimensions and predefined configuration.
 * @param scene The current Phaser scene.
 * @returns The scale factor to be applied.
 */
export const getDisplayScale = (scene: Phaser.Scene): number => {
  const scaleX = scene.game.canvas.width / Config.size.x;
  const scaleY = scene.game.canvas.height / Config.size.y;
  return Math.min(scaleX, scaleY);
};

/**
 * Creates a container in a Phaser scene that scales and centers itself according to the game's canvas size and predefined configuration.
 * @param scene The Phaser scene in which the container will be created.
 * @returns The newly created scaled and centered Phaser container.
 */
export const createSceneContainer = (
  scene: Phaser.Scene
): Phaser.GameObjects.Container => {
  const container = scene.add.container(0, 0);
  const scale = getDisplayScale(scene);
  container.setScale(scale);
  container.x = (scene.game.canvas.width - Config.size.x * scale) / 2;
  container.y = (scene.game.canvas.height - Config.size.y * scale) / 2;
  return container;
};
