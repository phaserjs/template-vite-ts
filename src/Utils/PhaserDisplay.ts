import Phaser from "phaser";
import { GameConfig, Images, Point } from "./types";

export const loadAllImages = (game: Phaser.Scene, images: Images): void => {
  Object.entries(images).forEach(([key, image]) => {
    console.log(`Loading image ${key} from ${image.path}`);
    game.load.image(image.key, image.path);
    game.load.on("filecomplete-image-" + image.key, () => {
      console.log(`Image ${image.key} loaded successfully.`);
    });
    game.load.on("loaderror", (fileKey: string, file: any) => {
      console.error(`Failed to load image ${fileKey}`, file.src);
    });
  });
  game.load.start();
};

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
  // we use 0.5 as we only use retina assets for now.
  const scale = getGameScale(config) * 0.5;
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
  // Determine the appropriate scene whether the container is a scene or a container within a scene
  const scene = container instanceof Phaser.Scene ? container : container.scene;

  // Create the text object directly in the scene
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
  textObject.setOrigin(0.5, 0); // Ensure text is centered horizontally around its x

  // Add the text object to the container if it's not the scene itself
  if (!(container instanceof Phaser.Scene)) {
    container.add(textObject);
  }

  return textObject;
};

export const getGameScale = (config: GameConfig): number => {
  const scaleX = window.innerWidth / config.size.x;
  const scaleY = window.innerHeight / config.size.y;
  return Math.min(scaleX, scaleY);
};

export const getPosition = (p: Point, config: GameConfig): Point => {
  return {
    x: p.x * getGameScale(config),
    y: p.y * getGameScale(config),
  };
};
