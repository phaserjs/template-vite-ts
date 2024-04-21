import { GameConfig, ImageConfig, Images } from "./types";

/**
 * Loads all images into a Phaser game scene from a provided object of ImageConfig entries.
 * @param game {Phaser.Scene} - The Phaser scene where images will be loaded.
 * @param images {Images} - An object containing ImageConfig entries.
 */
export const loadAllImages = (game: Phaser.Scene, images: Images): void => {
  Object.entries(images).forEach(([key, image]: [string, ImageConfig]) => {
    // Start the texture loading process
    console.log(`Loading image ${key} from ${image.path}`);
    game.textures
      .addBase64(image.key, image.path)
      .on("load", (textureKey: string) => {
        console.log(`Image ${textureKey} loaded successfully.`);
      })
      .on("error", (textureKey: string, event: Event) => {
        console.error(`Failed to load image ${textureKey}`, event);
      });
  });
};

export const addImage = (
  x: number,
  y: number,
  key: string,
  scene: Phaser.Scene,
  config: GameConfig,
  centerX: boolean = false
): Phaser.GameObjects.Image => {
  const image = scene.add.image(0, y * getGameScale(scene, config), key);
  if (centerX === true) {
    image.setX(scene.cameras.main.width / 2 + x);
    image.setOrigin(0.5, 0);
  } else {
    image.setX(x);
    image.setOrigin(0);
  }

  image.setScale(0.5 * getGameScale(scene, config));
  return image;
};

export const getGameScale = (
  game: Phaser.Scene,
  config: GameConfig
): number => {
  const scaleX = game.scale.width / config.size.x;
  const scaleY = game.scale.height / config.size.y;

  return Math.min(scaleX, scaleY);
};
