import { Scene } from "phaser";
import Config from "../config/config.json";
import {
  addText,
  createSceneContainer,
  loadAllImages,
} from "../GranadaLib/Display/PhaserDisplay";

/**
 * The Boot scene is responsible for setting up the initial assets and
 * configurations needed for the game to run. It also handles the initial API
 * connection checks before starting the main game.
 */
export class Boot extends Scene {
  loadingText: Phaser.GameObjects.Text;
  container: Phaser.GameObjects.Container;
  /**
   * Constructs the Boot scene object.
   */
  constructor() {
    super(Config.pages.Boot);
  }

  /**
   * Preloads necessary assets for the boot process. This method is called automatically by Phaser.
   * It's typically used to load minimal assets required for the preloader, like a game logo or background.
   */
  preload = async () => {
    this.container = createSceneContainer(this);
    this.loadingText = addText(
      Config.size.x / 2,
      Config.size.y / 2,
      Config.fonts.poppins,
      24,
      this.container,
      "0x000",
      "Loading..."
    );

    this.loadingText.setOrigin(0.5);
  };

  /**
   * Creates necessary game objects and setups after assets are loaded. This method also initiates the API connection check.
   */
  create = async () => {
    loadAllImages(this, Config.images);
    console.log("Preloading Audio assets...");
    (this.sound as Phaser.Sound.WebAudioSoundManager).decodeAudio(
      Config.audio.Neutral.key,
      Config.audio.Neutral.path
    );

    this.sound.once("decodedall", () => this.startGame());
  };

  /**
   * Starts the main game by setting the screen size and transitioning to the game scene.
   */
  startGame = () => {
    console.log("Starting Game...");
    this.scene.start(Config.pages.Game);
  };
}
