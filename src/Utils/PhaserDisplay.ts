import Phaser from "phaser";
import { GameConfig, Images } from "./types";

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
  const scale = getGameScale(scene, config) * 0.5;
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
  const scene = container instanceof Phaser.Scene ? container : container.scene;
  const textObject = scene.add
    .text(x, y, text, {
      fontFamily,
      fontSize: `${fontSize}px`,
      color,
      align: "center",
    })
    .setInteractive();
  const scale = getGameScale(scene, config);
  textObject.setFontSize(fontSize * scale);
  if (container instanceof Phaser.GameObjects.Container) {
    container.add(textObject);
  }
  return textObject;
};

export const getGameScale = (
  scene: Phaser.Scene,
  config: GameConfig
): number => {
  const scaleX = scene.scale.width / config.size.x;
  const scaleY = scene.scale.height / config.size.y;
  return Math.min(scaleX, scaleY);
};
